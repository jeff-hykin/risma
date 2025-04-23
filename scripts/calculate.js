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
var qualifiedSystemsBeforeAllFilters = new Set()
var qualifiedSystemsAfterAllAutomatedFilters = new Set()
var qualifiedSystemsAfterAllManualFilters = new Set()
var almostQualifiedSystemsBeforeAllFilters = new Set()
var almostQualifiedSystemsAfterAutomatedFilters = new Set()
var almostQualifiedSystemsAfterManualFilters = new Set()
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

var yearFreqAll = {}
var yearFreqManual = {}
for (var reference of Object.values(referenceByLowerCaseTitle)) {
    if (reference.year) {
        if (!yearFreqAll[reference.year]) {
            yearFreqAll[reference.year] = 0
        }
        yearFreqAll[reference.year]++
    }
    if (reference.notes.category == "qualifiedSystem") {
        qualifiedSystemsBeforeAllFilters.add(reference.title.toLowerCase())
    }
    if (reference.notes.category == "almostQualifiedSystem") {
        almostQualifiedSystemsBeforeAllFilters.add(reference.title.toLowerCase())
    }
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
        if (reference.year) {
            if (!yearFreqManual[reference.year]) {
                yearFreqManual[reference.year] = 0
            }
            yearFreqManual[reference.year]++
        }
        almostQualifiedSystemsAfterAutomatedFilters.add(reference.title.toLowerCase())
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
            qualifiedSystemsAfterAllAutomatedFilters.add(reference.title.toLowerCase())
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

console.debug(`qualifiedSystemsBeforeAllFilters is:`,qualifiedSystemsBeforeAllFilters)
console.debug(`qualifiedSystemsAfterAllAutomatedFilters is:`,qualifiedSystemsAfterAllAutomatedFilters)
const duplicates = [
    "31.1 A 65nm 8.79TOPS/W 23.82mW Mixed-Signal Oscillator-Based NeuroSLAM Accelerator for Applications in Edge Robotics",
]
const manuallyDisqualified = [
    "ViTa-SLAM: A Bio-inspired Visuo-Tactile SLAM for Navigation while Interacting with Aliased Environments",
]
for (let each of manuallyDisqualified) {
    almostQualifiedSystemsAfterManualFilters.add(each)
}
for (let each of almostQualifiedSystemsAfterAutomatedFilters) {
    almostQualifiedSystemsAfterManualFilters.add(referenceByLowerCaseTitle[each].title)
}
for (let ref of [...qualifiedSystemsAfterAllAutomatedFilters].map(each=>referenceByLowerCaseTitle[each]).sort((a,b)=>a.year-b.year)) {
    if (duplicates.includes(ref.title) || manuallyDisqualified.includes(ref.title)) {
        continue
    }
    qualifiedSystemsAfterAllManualFilters.add(ref.title)
    console.log(`    ${ref.notes.nickname}\t${ref.year}\t${ref.authorNames.join(", ")}\t${ref.title}`)
}
console.debug(`nicknames lost:`,setSubtract({ value: nicknamesAfterAllFilters, from: _nicknamesNoFilter }))
console.debug(`nicknames kept:`,nicknamesAfterAllFilters)

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

// 
// survey papers
// 
    var queryRefs = references.filter(each=>automatedResultsTitles.has(each.title.toLowerCase()))
    var relatedSurveys = new Set( queryRefs.filter(each=>each.title.match(/a (review|survey|perspective)/i)).filter(each=>each.citationCount>1).filter(each=>{
        let score = each.score[0]
        if (score>100) { // cited source
            score -= 100
        }
        return score>4 // score filter
    }).map(each=>each.title.toLowerCase()))
    var relatedSurveysPrintout = new Set( queryRefs.filter(each=>each.title.match(/a (review|survey|perspective)/i)).filter(each=>each.citationCount>1).filter(each=>{
        let score = each.score[0]
        if (score>100) { // cited source
            score -= 100
        }
        return score>4 // score filter
    }).map(each=>`(${each.year}) ${each.title.toLowerCase()}`))
    console.debug(`relatedSurveys is:`,relatedSurveysPrintout)
    var manuallyRuledOut = new Set([
        "kalman filter for robot vision: a survey", // (2011) 
        "deep ehr: a survey of recent advances in deep learning techniques for electronic health record (ehr) analysis", // (2017) 
        "deep learning in mobile and wireless networking: a survey", // (2019) 
        "a review of the deep learning methods for medical images super resolution problems", // (2020) 
        "medical image fusion: a survey of the state of the art", // (2014) 
        "sensing solutions for collecting spatio-temporal data for wildlife monitoring applications: a review", // (2013) 
        "internet of things: a survey on enabling technologies, protocols, and applications", // (2015) 
        "a survey on explainable artificial intelligence (xai): toward medical xai", // (2020) 
        "a survey on mobile crowdsensing systems: challenges, solutions, and opportunities", // (2019) 
        "satellite communications in the new space era: a survey and future challenges", // (2020) 
        "cognitive assisted living ambient system: a survey", // (2015) 
        "a review of models of consciousness", // (2010) 
        "human motion tracking for rehabilitation—a survey", // (2007) 
        "a survey of human gait-based artificial intelligence applications", // (2022)
    ])
    var surveyTitleList = [...relatedSurveys].filter(each=>!manuallyRuledOut.has(each))
    surveyTitleList = surveyTitleList.map(each=>referenceByLowerCaseTitle[each].title)
    // ruled in:
    // "(2023) bioinspired perception and navigation of service robots in indoor environments: a review",                       // mentions continuous attractors
    // "(2024) neuromorphic perception and navigation for mobile robots: a review",                                             // mentions continuous attractors
    // "(2015) computational cognitive models of spatial memory in navigation space: a review",                                 // mentions continuous attractors

    // "(2024) a review of brain-inspired cognition and navigation technology for mobile robots",                               // mentions continuous attractors
    // "(2019) combined sensing, cognition, learning, and control for developing future neuro-robotics systems: a survey",      // does not mention continuous attractors
    // "(2024) application of event cameras and neuromorphic computing to vslam: a survey",                                     // does not mention continuous attractors
    // "(2023) neuromorphic electronics for robotic perception, navigation and control: a survey",
    // "(2023) a perspective on the neuromorphic control of legged locomotion in past, present, and future insect-like robots", // does not mention continuous attractors
    // "(2015) visual place recognition: a survey",                                                                             // does not mention continuous attractors
    // "(2024) event-based stereo depth estimation: a survey",                                                                  // does not mention continuous attractors
    // "(2023) integration of feedforward and feedback control in the neuromechanics of vertebrate locomotion: a review of experimental, simulation and robotic studies", // nope

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

console.debug(`yearFreqAll is:`,yearFreqAll)
console.debug(`yearFreqManual is:`,yearFreqManual)

references.filter(each=>each.title.match(/review|survery|perspective/i)).filter(each=>each.citationCount>1).length

for (const [key, value] of Object.entries(categories)) {
    categories[key] = [...value].map(each=>referenceByLowerCaseTitle[each].title)
}

// 
// Survey Papers:
// 
console.log(`\n\nSurvey Papers:`)
console.log((surveyTitleList).map(each=>`- ${each}`).join("\n"))

// 
// Qualified Systems:
// 
console.log(`\n\nQualified Systems:`)
console.log(([...qualifiedSystemsAfterAllManualFilters]).map(each=>`- ${each}`).join("\n"))

// 
// Almost Qualified Systems:
// 
console.log(`\n\nAlmost Qualified Systems:`)
console.log(([...almostQualifiedSystemsAfterManualFilters]).map(each=>`- ${each}`).join("\n"))

// 
// System Enhancements:
// 
console.log(`\n\nSystem Enhancements:`)
console.log(([...categories["noteForQualifiedSystem"]]).map(each=>`- ${each}`).join("\n"))

// 
// External Contributions:
// 
console.log(`\n\nExternal Contributions:`)
console.log(([...categories["surroundingWork"], ...categories["nonBioSlam"]]).map(each=>`- ${each}`).join("\n"))
