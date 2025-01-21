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
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write, clearScreen, Input } from "../tools/input_tools.js"  
import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, getOpenAlexData, openAlexToSimpleFormat, relatedWorkIncludes, autofillDataFor } from "../tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "../tools/misc.js"
import { DiscoveryMethod } from "../tools/discovery_method.js"
import { Reference } from "../tools/reference.js"
import { loadProject, saveProject, score, referenceSorter, sortReferencesByDate, getKeywordCount } from "../tools/project_tools.js"
import { zipShort } from "https://deno.land/x/good@1.13.1.0/flattened/zip_short.js"
import { frequencyCount } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.2.0/source/flattened/frequency_count.js"
import { DataFrame, Series } from "https://esm.sh/data-forge@1.10.2?dev"
import shuffle from "https://esm.sh/lodash@4.17.21/shuffle.js"

const options = { cachePath: `${FileSystem.home}/.cache/risma/` }

const cacheFolder = options.cachePath
const cacheItemPath = `${cacheFolder}/cache.json`
const storageObject = createStorageObject(cacheItemPath)
const crossrefCachePath = `${cacheFolder}/cache.json`
doiToCrossrefInfo.cache = createStorageObject(crossrefCachePath)
const openAlexCachePath = `${cacheFolder}/openAlexCache.json`
getOpenAlexData.cache = createStorageObject(openAlexCachePath)

// 
// get active project   
//
    storageObject.previouslyActiveProjectPaths = storageObject.previouslyActiveProjectPaths || {}
    if (!storageObject.activeProjectPath) {
        if (await Console.askFor.yesNo(`No active project set (path to a yaml file), do you want to set one now?`)) {
            storageObject.activeProjectPath = FileSystem.makeAbsolutePath(await askForFilePath(`What is the path to the yaml file? (if what you enter doesn't exist, I'll create it)`,))
            let name = (await Console.askFor.line(`What is a good name for this project? (empty will use date)`)) || new DateTime().date
            storageObject.previouslyActiveProjectPaths[name] = storageObject.activeProjectPath
        } else {
            console.log(`okay, well I need one to continue`)
            Deno.exit(1)
        }
    }
    let activeProject
    function getReferenceStatusCounts() {
        const counts = {
            'unseen|title': 0,
            'unclear|title': 0,
            'skipped|title': 0,
            'relevent|title': 0,
            'relevent|abstract': 0,
            'super-relevent|abstract': 0,
            'irrelevent|title': 0,
            'partialy-irrelevent|abstract': 0,
            'irrelevent|abstract': 0,
        }
        const references = Object.values(activeProject.references)
        const statuses = Object.values(activeProject.references).map(each=>each.notes.resumeStatus)
        for (const element of statuses) {
            counts[element] = (counts[element] || 0) + 1
        }
        for (const [key, value] of Object.entries(counts)) {
            if (value == 0) {
                delete counts[key]
            }
        }
        return counts
    }
    
    function showProjectStatus() {
        const counts = getReferenceStatusCounts()
        clearScreen()
        console.log(green`project summary`)
        console.log(green`------------------------------------------`)
        console.log(cyan(`${(yaml.stringify({
            references: {
                total: Object.keys(activeProject.references).length, 
                ...counts
            },
        }))}`.replace(/\b(\d+)\b/g, "\x1b[31m$1\x1b[36m")))
        console.log(green``)
    }
    
    function highlightKeywords(text) {
        const keywords = activeProject.settings.keywords
        keywords.positive = keywords.positive || []
        keywords.negative = keywords.negative || []
        keywords.neutral = keywords.neutral || []
        keywords.positive = keywords.positive.map(each=>each.toLowerCase())
        keywords.negative = keywords.negative.map(each=>each.toLowerCase())
        keywords.neutral = keywords.neutral.map(each=>each.toLowerCase())
        const goodKeywords = keywords.positive
        const badKeywords = keywords.negative
        const neutralKeywords = keywords.neutral
        let index = -1
        for (let char of text) {
            index++
            if (!text.slice(0,index).match(/[a-zA-Z0-9_]$/)) {
                const remaining = text.slice(index,).toLowerCase()
                let matching
                if (goodKeywords.some(each=>(remaining.startsWith(matching=each)))) {
                    const replacement = `${green(matching)}`
                    text = text.slice(0, index) + replacement + text.slice(index + matching.length,)
                    index += replacement.length
                } else if (badKeywords.some(each=>remaining.startsWith(matching=each))) {
                    const replacement = `${red(matching)}`
                    text = text.slice(0, index) + replacement + text.slice(index + matching.length,)
                    index += replacement.length
                } else if (neutralKeywords.some(each=>remaining.startsWith(matching=each))) {
                    const replacement = `${magenta(matching)}`
                    text = text.slice(0, index) + replacement + text.slice(index + matching.length,)
                    index += replacement.length
                }
            }
        }
        return reset``+text
    }

activeProject = await loadProject(storageObject.activeProjectPath)

var refs = Object.values(activeProject.references)
var rrefs = refs.filter(each=>each.notes.resumeStatus.match(/\brelevent\b/))
var discoverys = activeProject.discoveryAttempts


// 
import { getPairedFrequency, getPairedFrequencyNoInnerDuplicates, getWordFrequencyNoInnerDuplicates, relevantWords } from "../tools/word_analysis.js"
import { linePlot } from "../tools/plot.js"

let index = -1
let questionnaires = refs.map(each=>each?.notes?.questionnaire||{})
let questions = [...new Set(questionnaires.map(each=>Object.keys(each)).flat(Infinity))]
let answers = questionnaires.map(each=>Object.values(each)).flat(Infinity)
let answerFreq = frequencyCount(answers, {sort:1})
for (const [answer, count] of answerFreq.entries()) {
    if (count < 1) {
        answerFreq.delete(answer)
    }
}
answers = [...answerFreq.keys()].map(each=>`${each}`)

const ask = async (q, each)=>{
    while (true) {
        let answer = (await Input.prompt({
            message: q,
            list: true,
            info: true,
            suggestions: answers,
        })).trim()
        if (answer == "o") {
            await OperatingSystem.openUrl(each.link||each.pdfLink)
            continue
        }
        if (answer == "null") {
            answer = null
        }
        if (answer == "y" || answer == "yes" || answer == "true") {
            answer = true
        }
        if (answer == "n" || answer == "no" || answer == "false") {
            answer = false
        }
        activeProject.references[each.title].notes.questionnaire[q] = answer
        break
    }
    saveProject({ activeProject, path: storageObject.activeProjectPath})
    return answer
}

for (let each of shuffle(refs)) {
    if (!each || !each.title) {
        continue
    }

    each = activeProject.references[each.title]
    each.notes = each.notes || {}
    each.notes.questionnaire = each.notes.questionnaire || {}
    let q
    let answer
    let questionnaire = each.notes.questionnaire
    // 
    // automated filters
    // 
    let { good: goodKeywordCount } = getKeywordCount(each.title +" "+ (each.abstract||""), activeProject)
    questionnaire["good keyword count"] = goodKeywordCount
    if (goodKeywordCount == 0) {
        continue
    }
    clearScreen()
    console.log(`title: ${highlightKeywords(each.title)}`)
    console.log(``)
    console.log(`abstract:\n${highlightKeywords(each.abstract||"missing")}`)
    console.log(``)
    
    q="is the reference related to a machine with perception that was learned over time?"
    if (questionnaire[q] == null) {
        answer = await ask(q, each)
    }
    if (!answer) { continue }
    
    q="does the paper propose a method for perception?"
    if (questionnaire[q] == null) {
        answer = await ask(q, each)
    }
    if (!answer) { continue }
    
    // q="is the problem being solved related to general spatial awareness?"
    // if (questionnaire[q] == null) {
    //     answer = await ask(q, each)
    // }
    
    q="what is the perceptual data?"
    if (questionnaire[q] == null) {
        answer = await ask(q, each)
    }
    
    q="is the primary method supervised learning?"
    if (questionnaire[q] == null) {
        answer = await ask(q, each)
    }
    if (!answer) { continue }
    
    q="is the approach embodied in some way?"
    if (questionnaire[q] == null) {
        answer = await ask(q, each)
    }
    
    if (answer) {
        q="was there a virtual agent?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }

        q="was there a physical agent?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="if it was a standard robot what was the name?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="what actions was the agent capable of?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="did the study include multiple tasks?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="what was the general algorithm(s) being used?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="was the learning off-policy?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }

        q="is it possible that changing the task of the agent would change what the agent perceived, when given training time with the environment?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
        
        q="is it possible that changing the task of the agent would change what the agent perceived, even without training time in the environment?"
        if (questionnaire[q] == null) {
            answer = await ask(q, each)
        }
    }
    
    // q="what was the metric of success?"
    // if (questionnaire[q] == null) {
    //     answer = await ask(q, each)
    // }
    // if (!answer) { continue }


    // q="what was the metric of success?"
    // if (questionnaire[q] == null) {
    //     answer = await ask(q, each)
    // }
    // if (!answer) { continue }
    


    // if (questionnaire[q="is it a methods paper?"] == null) {
    //     activeProject.references[each.title].notes.questionnaire[q] = await Console.askFor.line(q)
    // }
}