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

var references = Object.values(main.activeProject.references).sort((a,b)=>rankedCompare(b.score,a.score))
var discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)
var warningLogs = yaml.parse(await FileSystem.read('/Users/jeffhykin/repos/risma/warnings.yml'))
var warningTitles = new Set()
for (var [key, value] of Object.entries(warningLogs)) {
    warningLogs[key.toLowerCase()] = value
    warningTitles.add(key.toLowerCase())
}
var importantSources = [
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
var origins = []
var mustHave = []
for (let each of references) {
    if (each.notes.category||each.notes.nickname) {
        origins.push(new URL(each.link).origin)
    }
    if (each.notes.nickname) {
        mustHave.push(new URL(each.link).origin)
    }
}
import { frequencyCount } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/frequency_count.js'

var automatedResults = discoveryAttempts.filter(each=>each.automatedQuery)
var automatedResultsTitles = new Set(automatedResults.map(each=>each.referenceLinks.map(each=>each.title.toLowerCase())).flat())

var _nicknamesNoFilter = new Set()
var _onesWithCategoryNoFilter = new Set()
var titlesFromAutomatedSearches = new Set()
var titlesFromAutomatedSearchesWithGoodSources = new Set()
var titlesWithCategoriesAfterAllFilters = new Set()
var nicknamesAfterAllFilters = new Set()
var qualifiedSystemsAfterAllFilters = new Set()
var titlesForManualReview = new Set()

var categories = {}
var total = 0
var hasAbstract = 0
var withWarnings = 0
var abstractAndWarnings = 0
var abstractNoWarnings = 0
var unexplainedLackOfWarnings = 0
var isBook = 0
var probablyNeedToGetManually = 0
var probablyNeedToGetManuallyWithWarning = 0
var hasWarningLog = 0
var isPdf = 0
var referenceByLowerCaseTitle = {}
import { merge } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/merge.js'
for (var reference of references) {
    var title = reference.title.toLowerCase()
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

for (var reference of Object.values(referenceByLowerCaseTitle)) {
    // 
    // get link
    // 
        let urls = new Set()
        for (var [key, value] of Object.entries(reference.accordingTo)) {
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
        //         var re = (await getRedirectedUrl(url))
        //         if (re) {
        //             urls.add(re)
        //         }
        //     }
        // }
        urls = [...urls]
    
        if (reference.notes.nickname) {
            _nicknamesNoFilter.add(reference.notes.nickname)
        }
        if (reference.notes.category) {
            _onesWithCategoryNoFilter.add(reference.title.toLowerCase())
        }
    // 
    // only automated results filter
    // 
        if (!automatedResultsTitles.has(reference.title.toLowerCase())) {
            continue
        }
        titlesFromAutomatedSearches.add(reference.title.toLowerCase())
    // 
    // only good sources filter
    // 
        if (!importantSources.some(source=>urls.some(url=>url.includes(source)))) {
            continue
        }
        // if (!reference.abstract && reference.score[0] < 3) {
        //     continue
        // }
        titlesFromAutomatedSearchesWithGoodSources.add(reference.title.toLowerCase())
    // 
    // score filter
    // 
        if (reference.score[0] <= 105) {
            continue
        }
        titlesForManualReview.add(reference.title.toLowerCase())
    // 
    // nicknames and other simple counts
    // 
        if (reference.notes.nickname) {
            nicknamesAfterAllFilters.add(reference.notes.nickname)
        }
        if (reference.notes.category) {
            titlesWithCategoriesAfterAllFilters.add(reference.title.toLowerCase())
        }
        if (reference.notes.category == "qualifiedSystem") {
            qualifiedSystemsAfterAllFilters.add(reference.title.toLowerCase())
        }
        if (reference.notes.category) {
            if (!categories[reference.notes.category]) {
                categories[reference.notes.category] = new Set()
            }
            categories[reference.notes.category].add(reference.title.toLowerCase())
        }
    // 
    // counters
    // 
        var hasWarnings = Object.keys(reference.accordingTo.$manuallyEntered.warnings||{}).length > 0
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

console.debug(`nicknames lost:`,setSubtract({ value: nicknamesAfterAllFilters, from: _nicknamesNoFilter }))
console.debug(`nicknames kept:`,setSubtract({ value: _nicknamesNoFilter, from: nicknamesAfterAllFilters }))

var totalLost = _onesWithCategoryNoFilter.size-intersection(_onesWithCategoryNoFilter,titlesWithCategoriesAfterAllFilters).size
var percentLost = (totalLost/_onesWithCategoryNoFilter.size)*100
// console.debug(`category totalLost is:`,totalLost)
// console.debug(`category percentLost is:`,percentLost)
console.debug(`category lost are:`,setSubtract({ value: titlesWithCategoriesAfterAllFilters, from: _onesWithCategoryNoFilter }))
console.debug(`need to manually review is:`,setSubtract({ value: titlesWithCategoriesAfterAllFilters, from: titlesForManualReview }))
// await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})

console.log(`categories:`)
for (const [key, value] of Object.entries(categories)) {
    console.log(`    ${key}: ${value.size}`)
}

console.log(`qualifiedSystems:`)
var qualifiedSystemReferences = [...categories["qualifiedSystem"]].sort().map(eachTitle=>Object.values(p.references).find(each=>each.title.toLowerCase()==eachTitle))
var qualifiedSystemReferences = [...categories["qualifiedSystem"]].sort().map(eachTitle=>references.find(each=>each.title.toLowerCase()==eachTitle))
for (let ref of qualifiedSystemReferences) {
    try {
        const count = eval(`JSON.stringify(ref).match(/(?:citedByCount|citationCount)":(\\d+)/)[1]`)-0  //")/g)
        if (count<2) {
            continue
        }
    } catch (error) {
        
    }

    let citationCount
    // console.debug(`ref._.citedByCount is:`,ref._.citedByCount)
    // if (typeof ref._.citationCount-0 == "number" || typeof ref._.citedByCount-0 == "number") {
    //     console.debug(`ref._.citationCount is:`,ref._.citationCount)
    //     console.debug(`ref._.citedByCount is:`,ref._.citedByCount)
    //     citationCount = Math.max((ref._.citationCount||0), (ref._.citedByCount||0))
    //     console.debug(`citationCount is:`,citationCount)
    //     if (citationCount==citationCount) {
    //         if (citationCount<2) {
    //             continue
    //         }
    //     } else {
    //         citationCount = null
    //     }
    // }
    console.log(`    ${(ref.notes.nickname||"").padEnd(20)} | ${ref.authorNames.sort().join(", ").padEnd(120)}: ${ref.title}`)
}

console.debug(`total is:`,titlesFromAutomatedSearches.size)
console.debug(`    after source filter is:`,titlesFromAutomatedSearchesWithGoodSources.size)
console.debug(`    after score filter:`,titlesForManualReview.size)
console.debug(`    manually reviewed is:`,titlesWithCategoriesAfterAllFilters.size)
console.debug(`    withCategories is:`,titlesWithCategoriesAfterAllFilters.size)
console.debug(`    withWarnings is:`,withWarnings)
console.debug(`    hasAbstract is:`,hasAbstract)
console.debug(`    hasAbstract/total % is:`,(hasAbstract/total)*100)
console.debug(`    withWarnings/total % is:`,(withWarnings/total)*100)
console.debug(`    abstractAndWarnings % is:`,(abstractAndWarnings/total)*100)
console.debug(`    unexplainedLackOfWarnings/total % is:`,(unexplainedLackOfWarnings/total)*100)
console.debug(`    unexplainedLackOfWarnings is:`,unexplainedLackOfWarnings)
console.debug(`    probablyNeedToGetManuallyWithWarning is:`,probablyNeedToGetManuallyWithWarning)
console.debug(`    isBook is:`,isBook)
console.debug(`    link isPdf is:`,isPdf)
console.debug(`    probablyNeedToGetManually % is:`,(probablyNeedToGetManually/total)*100)
console.debug(`    probablyNeedToGetManually is:`,probablyNeedToGetManually)
