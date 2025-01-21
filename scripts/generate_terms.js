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
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write, clearScreen } from "../tools/input_tools.js"  
import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, getOpenAlexData, openAlexToSimpleFormat } from "../tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "../tools/misc.js"
import { DiscoveryMethod } from "../tools/discovery_method.js"
import { Reference } from "../tools/reference.js"
import { loadProject, saveProject, score, referenceSorter, sortReferencesByDate, } from "../tools/project_tools.js"
import { zipShort } from "https://deno.land/x/good@1.13.1.0/flattened/zip_short.js"
import { frequencyCount } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.2.0/source/flattened/frequency_count.js"

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
import { getPairedFrequency, getPairedFrequencyNoInnerDuplicates, getWordFrequencyNoInnerDuplicates, getWordFrequency, relevantWords, getTerms } from "../tools/word_analysis.js"
import { linePlot } from "../tools/plot.js"

let refGroup = refs

var allTitles = refGroup.map(each=>each.title).flat(Infinity)
var allAbstracts = refGroup.map(each=>each.abstract).filter(each=>each).flat(Infinity)
var allStrings = allTitles.concat(allAbstracts).filter(each=>each)

var singleWordFreq = getWordFrequency(allStrings)
var totalWords = getTerms(allStrings.join(" ")).length
var numberOfUniqueWords = singleWordFreq.size
var probabilityOfWord = (word)=>singleWordFreq.get(word)/totalWords
var averageProbabilityOfWord = 1/numberOfUniqueWords
var scoreOfWord = (word)=>probabilityOfWord(word)/averageProbabilityOfWord

// 
// get relevant terms list
// 
var pairsFreq = getPairedFrequency(allStrings)
// var numberOfUniquePairs = numberOfUniqueWords * numberOfUniqueWords 
var numberOfUniquePairs = numberOfUniqueWords * 2 // wrong (in terms of probability) but useful for mixing terms and singular words
var totalPairs = totalWords - 1 //  "a b c d" => "a b" "b c" "c d"
var probabilityOfPair = (pair)=>pairsFreq.get(pair)/totalPairs
var averageProbabilityOfPair = 1/numberOfUniquePairs
var scoreOfPair = (pair)=>probabilityOfPair(pair)/averageProbabilityOfPair

// 
// score them
// 
var scoredTerms = []
for (const [key, value] of singleWordFreq.entries()) {
    scoredTerms.push([key, scoreOfWord(key), singleWordFreq.get(key)])
}
for (const [term, count] of pairsFreq.entries()) {
    let [word1, word2] = term.split(" ")
    let probabilityOfNotGettingWord1 = 1-probabilityOfWord(word1)
    let probabilityOfNotGettingWord2 = 1-probabilityOfWord(word2)
    let probabilityOfNotGettingPair = probabilityOfNotGettingWord1*probabilityOfNotGettingWord2
    let probabilityOfGettingPair = 1-probabilityOfNotGettingPair
    let expectedFrequencyOfPair = 1/probabilityOfGettingPair // zipf's law
    
    // more freq is good
    // using rare words is better
    scoredTerms.push([term, scoreOfPair(term), pairsFreq.get(term)])
}
scoredTerms.sort((a,b)=>b[1]-a[1])
for (let [term, score, freq] of scoredTerms.slice(0,)) {
    console.debug(`${(term)}: ${score}, ${freq}`)
}