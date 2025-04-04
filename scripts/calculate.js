#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from '../main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'
import { rankedCompare } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/ranked_compare.js'
import { indent } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/indent.js'
import { getRedirectedUrl } from "/Users/jeffhykin/repos/academic_api/main/tools/fetch_tools.js"
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import { intersection } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/intersection.js'
import { setSubtract } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/set_subtract.js'

const references = Object.values(main.activeProject.references).sort((a,b)=>rankedCompare(b.score,a.score))
const discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)
const warningLogs = yaml.parse(await FileSystem.read('/Users/jeffhykin/repos/risma/warnings.yml'))
const warningTitles = new Set()
for (const [key, value] of Object.entries(warningLogs)) {
    warningLogs[key.toLowerCase()] = value
    warningTitles.add(key.toLowerCase())
}
const unfilteredCategoryOnes = new Set()
const filteredCategoryOnes = new Set()
const importantSources = [
    // must have's
    "https://ieeexplore.ieee.org",
    "https://www.science.org",
    "https://www.mdpi.com",
    "https://link.springer.com",
    "https://linkinghub.elsevier.com",

    // "https://ieeexplore.ieee.org",
    // "https://www.nature.com",
    // "https://www.science.org",
    // "https://www.cell.com",
    // "https://link.springer.com",
    // "https://linkinghub.elsevier.com",
    // "https://dl.acm.org",
    // "https://www.mdpi.com",
    // // "https://arxiv.org",
    // "https://www.frontiersin.org",
    // "https://www.sciencedirect.com",
    // // "https://search.proquest.com",
    // // "https://onlinelibrary.wiley.com",
    // // "https://books.google.com",
    // "https://journals.sagepub.com",
    // "https://www.biorxiv.org",
    // // "https://academic.oup.com",
    // // "https://www.tandfonline.com",
    // "https://journals.plos.org",
    // // "https://www.researchgate.net",
    // // "https://direct.mit.edu",
    // // "https://elifesciences.org",
    // "https://proceedings.neurips.cc",
    // // "https://www.cambridge.org",
    // // "https://www.jneurosci.org",
    // // "https://iopscience.iop.org",
    // // "https://pubs.aip.org",
    // // "https://www.annualreviews.org",
    // // "https://www.taylorfrancis.com",
    // // "https://www.academia.edu",
    
    // // "https://eprints.qut.edu.au/",
]
let origins = []
let mustHave = []
for (let each of references) {
    if (each.notes.category||each.notes.nickname) {
        origins.push(new URL(each.link).origin)
    }
    if (each.notes.nickname) {
        mustHave.push(new URL(each.link).origin)
    }
}
import { frequencyCount } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/frequency_count.js'
console.debug(`frequencyCount(mustHave, {sort:1}) is:`,frequencyCount(mustHave, {sort:1}))
console.debug(`frequencyCount(origins, {sort:1}) is:`,frequencyCount(origins, {sort:1}))
console.debug(`importantSources is:`,importantSources)
let nicknamesQualified = new Set()
let nicknamesNoFilter = new Set()

let total = 0
let hasAbstract = 0
let withWarnings = 0
let abstractAndWarnings = 0
let abstractNoWarnings = 0
let unexplainedLackOfWarnings = 0
let isBook = 0
let probablyNeedToGetManually = 0
let probablyNeedToGetManuallyWithWarning = 0
let hasWarningLog = 0
let isPdf = 0
const referenceByLowerCaseTitle = {}
import { merge } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/merge.js'
for (const reference of references) {
    const title = reference.title.toLowerCase()
    let existing = referenceByLowerCaseTitle[title]
    if (existing) {
        // console.log(`duplicate reference found:`,reference.title)
        if (JSON.stringify(reference).length > JSON.stringify(existing)) {
            referenceByLowerCaseTitle[title] = reference
        } 
    } else {
        referenceByLowerCaseTitle[title] = reference
    }
    // 
    // attach warnings from logs
    // 
    if (warningLogs[title]?.warnings!=null) {
        hasWarningLog++
        referenceByLowerCaseTitle[title].accordingTo.$manuallyEntered.warnings = warningLogs[title]?.warnings
    }
}
console.log(``)

const goodTitles = new Set()
for (const reference of Object.values(referenceByLowerCaseTitle)) {
    // 
    // get link
    // 
        let urls = new Set()
        for (const [key, value] of Object.entries(reference.accordingTo)) {
            if (typeof value?.link=="string") {
                urls.add(value.link)
            }
            if (typeof value?.pdfLink=="string") {
                urls.add(value.pdfLink)
            }
        }
        if (urls.size == 0) {
            continue
        }
        // for (let url of urls) {
        //     if (url.startsWith("https://www.doi.org/")) {
        //         const re = (await getRedirectedUrl(url))
        //         if (re) {
        //             urls.add(re)
        //         }
        //     }
        // }
        urls = [...urls]
    
        if (reference.notes.nickname) {
            nicknamesNoFilter.add(reference.notes.nickname)
        }
        if (reference.notes.category) {
            unfilteredCategoryOnes.add(reference.title.toLowerCase())
        }
    // 
    // only good sources filter
    // 
        if (!importantSources.some(source=>urls.some(url=>url.includes(source)))) {
            if (reference.title.toLowerCase().includes("neuroslam")) {
                console.debug(`urls is:`,urls)
                for (let url of urls) {
                    console.debug(`    url is:`,url)
                    for (let each of importantSources) {
                        console.debug(`    url.includes(${each}) is:`,url.includes(each))
                    }
                }
            }
            continue
        }
        // if (!reference.abstract && reference.score[0] < 3) {
        //     continue
        // }
        goodTitles.add(reference.title.toLowerCase())
    // 
    // nicknames and other
    // 
        if (reference.notes.nickname) {
            nicknamesQualified.add(reference.notes.nickname)
        }
        if (reference.notes.category) {
            filteredCategoryOnes.add(reference.title.toLowerCase())
        }
    // 
    // counters
    // 
        const hasWarnings = Object.keys(reference.accordingTo.$manuallyEntered.warnings||{}).length > 0
        if (hasWarnings) {
            withWarnings++
        }
        if (reference.abstract) {
            hasAbstract++
            if (hasWarnings) {
                abstractAndWarnings++
            } else{
                abstractNoWarnings++
            }
        } else {
            probablyNeedToGetManually++
            console.debug(`    `,JSON.stringify(reference.title))
            // skip if google book
            if (urls.some(url=>url.startsWith("https://books.google.com/"))) {
                isBook++
            } else {
                if (urls.some(url=>url.startsWith("https://www.researchgate.net")) || urls.some(url=>url.match(/https:\/\/(link\.springer\.com|www\.academia\.edu|www\.jneurosci\.org).+\.pdf$/))) {
                    isPdf++
                } else {
                    if (!hasWarnings) {
                        unexplainedLackOfWarnings++
                    } else {
                        probablyNeedToGetManuallyWithWarning++
                    }
                }
            }
        }
        total++
}

console.debug(`withWarnings is:`,withWarnings)
console.debug(`hasAbstract is:`,hasAbstract)
console.debug(`total is:`,total)
console.debug(`hasAbstract/total % is:`,(hasAbstract/total)*100)
console.debug(`withWarnings/total % is:`,(withWarnings/total)*100)
console.debug(`both/total % is:`,((hasAbstract/total)+(withWarnings/total))*100)
console.debug(`both/total % is:`,(abstractAndWarnings/total)*100)
console.debug(`abstractNoWarnings/total % is:`,(abstractNoWarnings/total)*100)
console.debug(`unexplainedLackOfWarnings/total % is:`,(unexplainedLackOfWarnings/total)*100)
console.debug(`probablyNeedToGetManually/total % is:`,(probablyNeedToGetManually/total)*100)
console.debug(`probablyNeedToGetManually is:`,probablyNeedToGetManually)
console.debug(`    isBook is:`,isBook)
console.debug(`    isPdf is:`,isPdf)
console.debug(`    unexplainedLackOfWarnings is:`,unexplainedLackOfWarnings)
console.debug(`    probablyNeedToGetManuallyWithWarning is:`,probablyNeedToGetManuallyWithWarning)
console.debug(`nicknames lost:`,setSubtract({ value: nicknamesQualified, from: nicknamesNoFilter }))


const totalLost = unfilteredCategoryOnes.size-intersection(unfilteredCategoryOnes,filteredCategoryOnes).size
const percentLost = (totalLost/unfilteredCategoryOnes.size)*100
// console.debug(`category totalLost is:`,totalLost)
// console.debug(`category percentLost is:`,percentLost)
console.debug(`category lost are:`,setSubtract({ value: filteredCategoryOnes, from: unfilteredCategoryOnes }))

// await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})