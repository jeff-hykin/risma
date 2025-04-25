#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from '../main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'

const references = Object.values(main.activeProject.references)
const discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)



// 
// auto tags
// 
for (const [key, reference] of Object.entries(references)) {
    reference.notes.keyTags = reference.notes.keyTags || []
    
    const title = reference.title.toLowerCase()
    const primaryBioRelated = !!title.match(/\bneuro|\bbio|\bhippocamp|\bbrain|\bhebbia|drosophila|visual(-| )cortex|ring(-| )attractor|continuous(-| )attractor|\bMD-CAN\b|head(-| )direction(-| )cell|grid(-| )cell|place(-| )cell|synaptic|\bmice\b|\brat|\bbee\b|mushroom(-| )bod|insect/i)
    const secondairlyBioRelated = !!title.match(/neuromorph|\bloihi|\bspiking neural network|hierarchical temporal memory|sparse distributed representation/i)
    const isSolvingAReleventProblem = !!title.match(/place(-| )recognition|localization|slam\b|pose(-| )estimation|navigation|landmark(-| )stability/i)
    const secondairlyReleventProblem = !!title.match(/sensori(-| |)motor(-| )control|\bpercept|scene(-| )understanding|proprioception|holistic(-| )scene|object(-| )detection|object(-| )tracking|locomotion/i)
    const usedReleventHardwareOfSomeKind = !!title.match(/robot|clearpath|unitree|\bloihi|event(-| )camera|stereo(-| )cameras|stereo(-| )vision|stereoscopic(-| )vision|jetson|\bugv\b|legged|quadruped|humanoid(-| )robot/i)
    const usedRelevantSoftwareOfSomeKind = !!title.match(/simulat|neuroSLAM|ratSLAM|neoSLAM|emulat|BINDSnet|\bros\b|ros2|bullet|python|pytorch|tensorflow|spiking neural network|\bsnn\b|c\+\+/i)
    
    // 
    // Biologically Based
    // 
    if (primaryBioRelated) {
        reference.notes.keyTags.push("biologicallyBased1")
        reference.notes.keyTags.push("biologicallyBased2")
    } else if (secondairlyBioRelated) {
        reference.notes.keyTags.push("biologicallyBased2")
    }
    
    // 
    // relevant task
    // 
    if (isSolvingAReleventProblem) {
        reference.notes.keyTags.push("relevantTask1")
        reference.notes.keyTags.push("relevantTask2")
    } else if (secondairlyReleventProblem) {
        reference.notes.keyTags.push("relevantTask2")
    }
    
    // 
    // tangible
    // 
    if (usedReleventHardwareOfSomeKind && usedRelevantSoftwareOfSomeKind) {
        reference.notes.keyTags.push("tangible1")
        reference.notes.keyTags.push("tangible2")
        reference.notes.keyTags.push("tangibleHardware")
        reference.notes.keyTags.push("tangibleSoftware")
    } else if (usedReleventHardwareOfSomeKind) {
        reference.notes.keyTags.push("tangible2")
        reference.notes.keyTags.push("tangibleHardware")
    } else if (usedRelevantSoftwareOfSomeKind) {
        reference.notes.keyTags.push("tangible2")
        reference.notes.keyTags.push("tangibleSoftware")
    }
}


// main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})