#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from '../main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'
import { rankedCompare } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/ranked_compare.js'
import { indent } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/indent.js'
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import { selectOne } from "../tools/input_tools.js"
import { displayReferences, removeDuplicates } from "../tools/project_tools.js"

const references = Object.values(main.activeProject.references).sort((a,b)=>rankedCompare(b.score,a.score))
const discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)

const categories = [
    "qualifiedSystem",
    "almostQualifiedSystem",
    "surroundingWork",
    "noteForQualifiedSystem",
    "historicalNeuroscience",
    "extraNeuroscience",
    "directSupportNeuroscience",
    "nonBioSlam",
    "similarProblemSurveys",
    "tooling",
]

for (const reference of references) {
    if (typeof reference.notes?.category == "string") {
        categories.push(reference.notes.category)
    }
}

const importantSources = [
    "https://ieeexplore.ieee.org",
    "https://www.science.org",
    "https://www.mdpi.com",
    "https://link.springer.com",
    "https://linkinghub.elsevier.com",
]
let filteredRefs = removeDuplicates(references).filter(
    // source filter
    // each=>importantSources.some(source=>each.link.startsWith(source))
    each=>each
).filter(
    each=>each.score[0]>105, // e.g. from right source 
)
const total = filteredRefs.length
let index = -1
for (const reference of filteredRefs) {
    index++
    try {
        // tag ideas:
            // bio inspired (hippocampus, hippocampal, entorhinal cortex, neurophysiologically)
                // spiking
                // ring attractor
                // continuous attractor
                // grid cell
                // place cell
                // pose cell
                // spatial cell
            // non rgb input
                // lidar input
                // infared (rgb-d)
                // tactile input
                // event camera (neuromorphic camera)
                // echo location
            // neuromorphic hardware
            // phsyical robot
                // spot
                // go2
                // husky
                // jackal
                // custom
            // legged robot 
            // wheeled robot
            // humanoid robot
            // underwater robot
            // flying robot
            // code available
            // solves mobility problem
                // enhancing navigation
                // enhancing locomotion
                // enhancing mapping
                // enhancing place recognition
                    // enhancing visual place recognition
                // enhancing visual processing
                    // scene perception
                // enhancing localization
                // enhancing head direction
                // enhancing path planning
                // enhancing loop closure (closed-loop detection)
                // enhancing simultaneous localization and mapping
                // enhancing memory
            // reinforcement learning
            // deep learning
            // simulated environment
        if (!reference.notes.category) {
            await displayReferences([reference])
            const skipOption = "skip (ignore)"
            const quitOption = "quit (save)"
            const saveOption = "save"
            console.log(``)
            console.log(`(${index+1}/${total})`)
            console.log(``)
            const whichAction = await selectOne({
                message: "which category?",
                options: [
                    skipOption,
                    ...categories,
                    quitOption,
                    saveOption,
                ],
            })
            if (whichAction == skipOption) {
                continue
            } else if (whichAction == saveOption) {
                console.log(`saving`)
                await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
                console.log(`done saving`)
            } else if (whichAction == quitOption) {
                console.log(`saving`)
                await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
                console.log(`done saving`)
                Deno.exit()
            } else {
                reference.notes.category = whichAction
            }
        }
    } catch (error) {
        console.log(`saving`)
        await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
        console.log(`done saving`)
        throw error
    }
}
console.log(`saving`)
await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
console.log(`done saving`)
Deno.exit()