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
import { displayReferences } from "../tools/project_tools.js"
for (const reference of references) {
    if (typeof reference.notes?.category == "string") {
        categories.push(reference.notes.category)
    }
}

for (const reference of references) {
    try {
        if (!reference.notes.category) {
            displayReferences([reference])
            const skipOption = "skip (ignore)"
            const whichAction = await selectOne({
                message: "which category?",
                options: [
                    ...categories,
                    skipOption,
                ],
            })
            if (whichAction == skipOption) {
                continue
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
await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
Deno.exit()