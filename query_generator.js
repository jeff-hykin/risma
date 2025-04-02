#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from './main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'

// maybe add:
    // neurorobotics
    // neuroethology
    // biomimetic
var problemBeingSolved = [
    "localisation",
    "localization",
    "place recognition",
    "visual place recognition",
    "SLAM",
    "landmark stability",
    "simultaneous localization and mapping",
    "visual SLAM",
    "spatial navigation",
    "multimodal perception",
    "scene understanding",
    "locomotion",
    "",
]
var groundingInNeuroScience = [
    'neuro-inspired',
    'neuro inspired',
    'neuro-biological',
    'hippocampal',
    'neuro-physiologically',
    'hebbian learning',
    'plasticity',
    'synaptic',
    'spiking neural network',
    '"snn"',
    'biologically plausible',
    'biologically inspired',
    'visual cortex',
    'neuromorphic',
    'mice',
    'rat',
    'head direction system',
    'grid cell',
    '"head direction cell"',
    '"HDC"',
    'border cell',
    'place cell',
    'sparse distributed representation',
    '"SDR"',
    'hierchical temporal memory',
    '"HTM"',
    'boundary vector cell',
    '"bvc"',
    'ratslam',
    'neuroslam',
    'continuous attractor',
    'ring attractor',
    'multidimensional continuous attractor',
    'drosophila',
    'fly',
    "",
]
var groundingInApplication = [
    // code
    'code implementation'
    '"python"',
    '"c++"',
    '"pytorch"',
    '"tensorflow"',
    '"tensorflow.js"',
    '"jax"',
    '"bindsnet"',
    // hardware
    'robot',
    '"robotics"',
    '"ugv"',
    '"quadruped"',
    '"legged"',
    '"jetson"',
    '"clearpath"',
    'boston dynamics spot',
    '"unitree"',
    'unitree go1',
    'unitree go2',
    '"simulation"',
    "",
]

var outcomes = [...combinationOfChoices([
    problemBeingSolved,
    groundingInNeuroScience,
    groundingInApplication,
])]

// remove the completely empty string
outcomes = outcomes.filter(each=>each.join("").trim().length>0)
randomlyShuffle(outcomes)

// don't redo valid queries
const queriesAndEngines = main.activeProject.discoveryAttempts.filter(each=>each.referenceLinks.length>0).map(each=>[each.query, each.searchEngine])
const queryCache = {}
for (let [ query, searchEngine ] of queriesAndEngines) {
    queryCache[query] = queryCache[query] || {}
    queryCache[query][searchEngine] = true
}

// 
// start running them!
// 
for (let searchEngineName of Object.keys(main.searchOptions)) {
    if (searchEngineName !== "googleScholar") {
        continue
    }
    const searchEngine = main.searchOptions[searchEngineName]
    let activeSave = Promise.resolve()
    ;((async ()=>{
        for (let eachQuery of outcomes) {
            const query = eachQuery.join(" ")
            if (queryCache[query]?.[searchEngineName]) {
                continue
            }
            queryCache[query] = queryCache[query] instanceof Object ? queryCache[query] : {}
            try {
                const {references, newReferences, discoveryMethod} = await main.getSearchResults({
                    query, 
                    resultsPromise: searchEngine.urlToListOfResults(`${searchEngine.base}${searchEngine.searchStringToParams(query)}`), 
                    searchEngineName,
                    project: main.activeProject,
                    otherData: {
                        automatedQuery: true,
                    },
                    getFullData: false,
                    message: `searching ...`,
                })
                let output = ``
                output += `[${gray(searchEngineName)}] ${cyan(newReferences.length)} new references from ${yellow(query)}\n`
                for (const each of newReferences.sort(main.referenceSorter({project: main.activeProject}))) {
                    output += `${main.score(each, main.activeProject)}  ${main.highlightKeywords(each.title)}\n`
                }
                console.log(output)
                queryCache[query][searchEngineName] = true
                queryCache[query] = queryCache[query] // to update cold storage
                // this acts as a lock to prevent multiple saves at the same time causing a race
                await activeSave.then(()=>{
                    activeSave = main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
                    return activeSave
                })
            } catch (error) {
                console.debug(`error when getting ${query} from ${searchEngineName} is:`,error)
            }
            
        }
    })())
}