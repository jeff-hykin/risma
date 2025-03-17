import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from './main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'

const queryCache = createStorageObject(`./query_generator.json`)
var problemBeingSolved = [
    "visual place recognition",
    "SLAM",
    "landmark stability",
    "simulation localization and mapping",
    "visual SLAM",
    "spatial navigation",
    "multimodal perception",
    "scene understanding",
    "locomotion",
]
var groundingInNeuroScience = [
    "neuro-inspired",
    "neuro inspired",
    "neuro-biological",
    "hippocampal",
    "neuro-physiologically",
    "hebbian learning",
    "plasticity",
    "synaptic",
    "spiking neural network",
    "snn",
    "biologically plausible",
    "biologically inspired",
    "visual cortex",
    "neuromorphic",
    "mice",
    "rat",
    "head direction system",
    "grid cell",
    "head direction",
    "border cell",
    "place cell",
    "sparse distributed representation",
    "SDR",
    "hierchical temporal memory",
    "HTM",
    "boundary vector cell",
    "bvc",
    "ratslam",
    "neuroslam",
    "continuous attractor",
    "ring attractor",
    "multidimensional continuous attractor",
    "drosophila",
]
var groundingInApplication = [
    // code
    '"pytorch"',
    '"tensorflow"',
    '"tensorflow.js"',
    '"jax"',
    '"C++"',
    // hardware
    '"robotics"',
    '"quadruped"',
    '"legged"',
    '"jetson"',
    '"clearpath"',
    'boston dynamics spot',
    '"unitree"',
    'unitree go1',
    'unitree go2',
    '"simulation"',
]

var outcomes = [...combinationOfChoices([
    problemBeingSolved,
    groundingInNeuroScience,
    groundingInApplication,
])]

randomlyShuffle(outcomes)

// 
// start running them!
// 
for (let eachQuery of outcomes) {
    const query = eachQuery.join(" ")
    if (queryCache[query]) {
        continue
    }
    await Promise.all(Object.keys(main.searchOptions).map(async searchEngineName => {
        const searchEngine = main.searchOptions[searchEngineName]
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
        console.log(`[${gray(searchEngineName)}] ${cyan(newReferences.length)} new references from ${query}`)
        for (const each of newReferences.sort(main.referenceSorter({project: main.activeProject}))) {
            if (!each.title) {
                console.debug(`each is:`,each)
                throw Error(`each.title is undefined`)
            }
            console.log(`${main.score(each, main.activeProject)}  ${main.highlightKeywords(each.title)}`)
        }
    }))
    await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
    queryCache[query] = true
}