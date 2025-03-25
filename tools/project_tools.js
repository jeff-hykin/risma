import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
// import { FileSystem } from "https://deno.land/x/quickr@0.6.51/main/file_system.js"
// import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.13.5.0/string.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.73/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.73/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.73/main/console.js"
import { OperatingSystem } from "https://deno.land/x/quickr@0.6.73/main/operating_system.js"
// import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import * as yaml from "../tools/yaml.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/deno.js'
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.13.5.0/flattened/parse_args.js" 
import { rankedCompare } from "https://deno.land/x/good@1.13.5.0/flattened/ranked_compare.js" 

import { version } from "../tools/version.js"
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write } from "../tools/input_tools.js"  
import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, openAlexToSimpleFormat } from "../tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "../tools/misc.js"
import { Reference } from "../tools/reference.js"

export const loadProject = async (path) => {
    let project
    const defaultObject = {
        settings: {
            keywords: {
                positive: [],
                negative: [],
                neutral: [],
            },
        },
        references: {},
        discoveryAttempts: [],
    }
    project = await FileSystem.read(path) || JSON.stringify(defaultObject)
    project = yaml.parse(project)
    if (!project.discoveryAttempts || !project.references) {
        console.warn(`Active project ${green(JSON.stringify(path))}\ndoesn't seem to have core fields`)
        project = defaultObject
    }
    project.settings = project.settings || {}
    project.settings.keywords = project.settings.keywords || {}
    for (let [key, value] of Object.entries(project.references)) {
        let ref = project.references[key] = new Reference(value)
        // enforce that title is actually the title (seems some uppercase/lowercase bug is causing problems)
        if (typeof ref.title == "string") {
            if (ref.title != key) {
                delete project.references[key]
                key = ref.title
                project.references[key] = ref
            }
        }
        try {
            project.references[key].score = score(project.references[key], project)
            project.references[key].scoreString = project.references[key].score.join("|")
        } catch (error) {
            console.debug(`score error is:`,error)
        }
    }
    for (let eachDiscoveryAttempt of project.discoveryAttempts) {
        for (let each of eachDiscoveryAttempt.referenceLinks) {
            each.link = project.references[each.title]
        }
    }
    return project
}

const innerSave = ({activeProject, path})=>{
    const projectToSave = structuredClone(activeProject)
    // fixup references
    for (const [key, value] of Object.entries(projectToSave.references)) {
        projectToSave.references[key] = new Reference(value)
        try {
            projectToSave.references[key].score = score(projectToSave.references[key], activeProject)
            projectToSave.references[key].scoreString = projectToSave.references[key].score.join("|")
        } catch (error) {
            console.debug(`score error is:`,error)
        }
    }
    // fixup links
    for (let eachDiscoveryAttempt of projectToSave.discoveryAttempts) {
        for (let each of eachDiscoveryAttempt.referenceLinks) {
            each.link = projectToSave.references[each.title]
        }
    }
    for (const [key, value] of Object.entries(projectToSave.references)) {
        value.beforeSave()
    }
    return FileSystem.write({path, data: yaml.stringify(projectToSave,{ indent: 4, lineWidth: Infinity, skipInvalid: true, })})
}

// this wrapper acts as a lock to prevent multiple saves at the same time causing a race condition (only really matters for non-interactive use)
let activeSave = Promise.resolve()
export const saveProject = async ({activeProject, path})=>{
    return await activeSave.then(()=>{
        activeSave = innerSave({activeProject, path})
        return activeSave
    })
}

//
// keyword count
//
export function getKeywordCount(title, project) {
    const keywords = project.settings.keywords
    keywords.positive = keywords.positive || []
    keywords.negative = keywords.negative || []
    keywords.neutral = keywords.neutral || []
    keywords.positive = keywords.positive.map(each=>each.toLowerCase())
    keywords.negative = keywords.negative.map(each=>each.toLowerCase())
    keywords.neutral = keywords.neutral.map(each=>each.toLowerCase())

    const goodKeywords = keywords.positive
    const badKeywords = keywords.negative
    const neutralKeywords = keywords.neutral
    if (!title) {
        return {good: 0, bad: 0, neutral: 0}
    }
    let numberOfGoodKeywords = 0
    let numberOfBadKeywords = 0
    let numberOfNeutralKeywords = 0
    let index = -1
    for (let char of title) {
        index++
        if (!title.slice(0,index).match(/[a-zA-Z0-9_]$/)) {
            const remaining = title.slice(index,).toLowerCase()
            let matching
            // FIXME: need to sort by length of keyword 
            if (goodKeywords.some(each=>(remaining.startsWith(matching=each)))) {
                numberOfGoodKeywords++
                index += matching.length
            } else if (badKeywords.some(each=>remaining.startsWith(matching=each))) {
                numberOfBadKeywords++
                index += matching.length
            } else if (neutralKeywords.some(each=>remaining.startsWith(matching=each))) {
                numberOfNeutralKeywords++
                index += matching.length
            }
        }
    }
    return {good: numberOfGoodKeywords, bad: numberOfBadKeywords, neutral: numberOfNeutralKeywords}
}

export const score = (each, project)=>{
    project = project || activeProject // TODO: remove
    //
    // keyword count
    //
    const keywords = project.settings.keywords
    keywords.positive = keywords.positive || []
    keywords.negative = keywords.negative || []
    keywords.neutral = keywords.neutral || []
    keywords.positive = keywords.positive.map(each=>each.toLowerCase())
    keywords.negative = keywords.negative.map(each=>each.toLowerCase())
    keywords.neutral = keywords.neutral.map(each=>each.toLowerCase())
    const goodKeywords = keywords.positive
    const badKeywords = keywords.negative
    const neutralKeywords = keywords.neutral
    
    // 
    // evaluate user-defined scoring functions
    // 
    let scoreList = [0,0,0,0,0]
    for (const [key, value] of Object.entries(project.settings.scoreGivers||{})) {
        try {
            const func = eval(value)
            func(
                each,
                scoreList,
                {
                    keywords,
                    settings: project.settings,
                    numberOfGoodKeywordsIn: (title)=>getKeywordCount(title, project).good,
                    numberOfBadKeywordsIn: (title)=>getKeywordCount(title, project).bad,
                    numberOfNeutralKeywordsIn: (title)=>getKeywordCount(title, project).neutral,
                }
            )
        } catch (error) {
            console.debug(`\nerror when calculating score with ${key}() for `, value)
            throw error
        }
    }
    if (Object.values(project?.settings?.scoreGivers||{}).length == 0) {
        // use year (currently gets added to keyword score)
        scoreList[0] += (each.year-0||0)
    }
    
    return scoreList
}

export function referenceSorter({reverse, project}) {
    // const activeReferences = references.filter(each=>each.resumeStatus == whatKind)
    // for (let each of activeReferences) {
    //     console.debug(`each.title, score(each) is:`,highlightKeywords(each.title), score(each))
    // }
    if (reverse) {
        return (b,a)=>rankedCompare(score(b, project),score(a, project))
    } else {
        return (a,b)=>rankedCompare(score(b, project),score(a, project))
    }
}

export function sortReferencesByDate(references) {
    return references.sort((a,b)=>new Date(b?.notes?.events?.added).getTime()-new Date(a?.notes?.events?.added).getTime())
}

export function scoreDiscoveryAttempt(discoveryAttempt, project) {
    let sum = 0
    let count = 0
    for (let each of discoveryAttempt.referenceLinks) {
        each = each.link
        if (!each) {
            continue
        } else if (each.resumeStatus == "unseen|title") {
            const title = each.title.toLowerCase()
            const notASingleGoodKeyword = !project.settings.keywords.positive.some(keyword=>title.includes(keyword.toLowerCase()))
            if (notASingleGoodKeyword) {
                count++
                sum -= 2
            } else {
                // ignore it (needs to be manually rated before contributing to the score)
            }
        } else {
            count++
            if (each.resumeStatus == "relevent|title") {
                sum += 1
            } else if (each.resumeStatus == "super-relevent|title") {
                sum += 3
            } else if (each.resumeStatus == "irrelevent|title") {
                sum -= 1
            } else if (each.resumeStatus == "relevent|abstract") {
                sum += 4
            } else if (each.resumeStatus == "super-relevent|abstract") {
                sum += 10
            } else if (each.resumeStatus == "appendix|abstract") {
                sum += 0.5
            } else if (each.resumeStatus == "slightly-irrelevent|abstract") {
                sum -= 2
            } else if (each.resumeStatus == "irrelevent|abstract") {
                sum -= 3
            }
        }
    }
    return `${sum}/${count}`
}

export function rateDiscoveryAttempts(discoveryAttempts, project) {
    for (let each of discoveryAttempts) {
        each.score = scoreDiscoveryAttempt(each, project)
    }
}