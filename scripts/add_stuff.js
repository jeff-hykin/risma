#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { main } from '../main.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'
import { rankedCompare } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/ranked_compare.js'
import { indent } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/indent.js'
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"


const references = Object.values(main.activeProject.references).sort((a,b)=>rankedCompare(b.score,a.score))
const discoveryAttempts = Object.values(main.activeProject.discoveryAttempts)


// 
// link fixer
// 
    // const badLinks = JSON.parse(Deno.readTextFileSync("/Users/jeffhykin/repos/risma/links.json"))
    // let promises = []
    // let fixedCount = 0
    // for (let eachBadLink of badLinks) {
    //     const refWithBadLink = references.find(ref=>ref.link==eachBadLink)
    //     if (refWithBadLink) {
    //         promises.push(((async ()=>{
    //             let fixedTheLink = false
    //             try {
    //                 const fixedLink = await getRedirectedUrl(eachBadLink)
    //                 if (fixedLink) {
    //                     fixedCount++
    //                     console.log(`fixed: ${eachBadLink}`)
    //                     fixedTheLink = true
    //                     refWithBadLink.accordingTo.$manuallyEntered.oldLink = eachBadLink
    //                     refWithBadLink.accordingTo.$manuallyEntered.link = fixedLink
    //                     if (fixedCount % 10 == 0) {
    //                         await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
    //                     }
    //                 }
    //             } catch (error) {
                    
    //             }
    //             if (!fixedTheLink) {
    //                 console.warn(`could not fix link for ${refWithBadLink.title}: ${eachBadLink}`)
    //             }
    //         })()))
    //     }
    // }
    // await Promise.all(promises)
    // await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
    // Deno.exit()


// 
// list all tags
// 
    const allTags = new Set()
    for (const reference of references) {
        reference.notes.keyTags = reference.notes.keyTags || []
        allTags.add(...reference.notes.keyTags.filter(each=>each))
    }
    // console.debug(`allTags is:`,allTags)

// 
// categories
// 

const categories = {
    "qualifiedSystem": new Set(),
    "almostQualifiedSystem": new Set(),
    "surroundingWork": new Set(),
    "noteForQualifiedSystem": new Set(),
    "historicalNeuroscience": new Set(),
    "extraNeuroscience": new Set(),
    "directSupportNeuroscience": new Set(),
    "nonBioSlam": new Set(),
    "similarProblemSurveys": new Set(),
    "tooling": new Set(),
}
const allTitles = new Set()
for (const reference of references) {
    reference.notes.keyTags = reference.notes.keyTags || []
    const title = reference.title.toLowerCase()
    const nickname = reference.notes.nickname
    const isDuplicate = reference.notes.isDuplicate
    if (categories[title.category]) {
        categories[title.category].add(title)
        continue
    }
    if (nickname || isDuplicate) {
        continue
    }
    if (reference.notes.resumeStatus.startsWith("super-relevent")) {
        allTitles.add(title)
    }
    if (title.includes("neuroslam") || title.includes("neoslam") || title.includes("ratslam")) {
        allTitles.add(title)
    }
    if (title.match(/place recognition/i) && (title.includes("neuromorphic")||title.includes("spiking"))) {
        allTitles.add(title)
    }
    if (reference.notes.comment && reference.notes.comment != "") {
        allTitles.add(title)
    }
}
// for (let each of allTitles) {
//     console.debug(`- `,each)
// }

// 
// get abstracts
// 
    import { Reference, search, loadReferences, getReferences } from '../../academic_api/main/main.js'
    import { coerceInsignificantEdgeCases } from '../../academic_api/main/reference.js'
    import { getRedirectedUrl } from '../../academic_api/main/tools/fetch_tools.js'
    import { toRepresentation } from '../../academic_api/main/imports/good.js'
    console.log(`running add_stuff`)
    console.group()
    const processNext = [
        
    ]
    const refsToProcess = []
    for (let each of processNext) {
        try {
            let match = references.find(ref=>ref.title==each)
            if (match) {
                refsToProcess.push(
                    match
                )
            } else {
                let match = references.find(ref=>ref.title.toLowerCase()==each.toLowerCase())
                if (match) {
                    refsToProcess.push(
                        match
                    )
                } else {
                    console.debug(`    no match for:`,each)
                }
            }
        } catch (error) {
            console.debug(`    error is:`,error)
        }
    }
    console.debug(`refsToProcess.length is:`,refsToProcess.length)
    for (let each of refsToProcess) {
        if (!(each.accordingTo instanceof Object)) {
            console.debug(`each is:`,each)
        }
    }
    // convert to newer cleaner format
    let processed = refsToProcess.map(each=>({
        $accordingTo: Object.fromEntries(Object.entries(each.accordingTo).map(
            ([key, value])=>{
                if (key=="crossref") {
                    key="crossRef"
                }
                value = structuredClone(value)
                value.url = value.link
                delete value.link
                value.pdfUrl = value.pdfLink
                delete value.pdfLink
                coerceInsignificantEdgeCases(value)
                const allNulls = Object.values(value).every(each=>!each)
                if (allNulls) {
                    value = null
                } else {
                    value.title = value.title||each.title
                }
                return [key, value]
            }
        )),
    }))
    
    loadReferences(
        processed
    )
    const otherReferences = getReferences()
    
    // import { launch } from "https://esm.sh/jsr/@astral/astral@0.5.2"
    import { launch } from "../subrepos/astral.js"
    const astralBrowser = await launch()
    try {
        let resumeAt = null
        for (const reference of refsToProcess) {
            // skip to specific title
            if (resumeAt) {
                if (reference.title==resumeAt) {
                    resumeAt = null
                } else {
                    continue
                }
            }

            // skip if already has abstract
            if (reference.abstract || reference?.link?.startsWith?.("https://books.google.com/")) {
                // console.log(`has abstract already`)
                // console.groupEnd()
                continue
            } else {
                console.log(`reference.title is:`,blue`${JSON.stringify(reference.title)}`)
            }
            console.group()
            
            let otherRef
            // unify by doi
            if (typeof reference.doi == "string") {
                try {
                    otherRef = otherReferences.find(each=>each.doi==reference.doi)
                } catch (error) {
                    
                }
            }
            // fallback unify by title
            if (!otherRef && typeof reference.title == "string") {
                try {
                    otherRef = otherReferences.find(each=>each.title==reference.title)
                } catch (error) {
                    
                }
            }
            // 
            // get abstract
            // 
            if (otherRef && !reference.abstract) {
                // 
                // get redirected doi value
                // 
                for (const [source, value] of Object.entries(otherRef.$accordingTo)) {
                    if ((value?.url||"").startsWith("https://www.doi.org/")) {
                        const newUrl = await getRedirectedUrl(value.url)
                        if (typeof newUrl =="string" && !newUrl.startsWith("https://validate.perfdrive.com")) {
                            value.url = newUrl
                        }
                    }
                }
                // for (const [source, value] of Object.entries(reference.accordingTo)) {
                //     if ((value?.link||"").startsWith("https://www.doi.org/")) {
                //         const newUrl = await getRedirectedUrl(value.link)
                //         if (typeof newUrl =="string" && !newUrl.startsWith("https://validate.perfdrive.com")) {
                //             value.link = newUrl
                //         }
                //     }
                // }

                try {
                    const { abstracts, warnings } = await otherRef.fillAbstractsFromHtml({astralBrowser})
                    console.debug(`abstracts is:`,JSON.stringify(abstracts))
                    const hadAbstract = abstracts.length >= 1
                    if (hadAbstract) {
                        // save it on old object
                        reference.accordingTo.$manuallyEntered.abstract = abstracts[0]
                    }
                    const hadWarnings = (Object.values(warnings||{}).length > 0)
                    if (hadWarnings) {
                        console.warn(`warnings:`)
                        console.warn(warnings)
                        try {
                            reference.accordingTo.$manuallyEntered.warnings = JSON.parse(JSON.stringify(warnings,0,4))
                        } catch (error) {
                            console.error(error)
                        }
                    } else {
                        delete reference.accordingTo.$manuallyEntered.warnings
                    }
                    if (hadWarnings || hadAbstract) {
                        await main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})
                    }
                    try {
                        if (Object.values(warnings||{}).length > 0) {
                            console.warn(`warnings:`)
                        }
                        for (const [key, warningMessage] of Object.entries(warnings||{})) {
                            let message
                            try {
                                message = warningMessage.stack
                            } catch (error) {
                                
                            }
                            if (!message) {
                                message = warningMessage
                            }
                            console.log(`     warning ${key}:`, yellow`${indent({string: toRepresentation(warningMessage), by: "    "})}`)
                        }
                    } catch (error) {
                        console.warn(`error is:`,error)
                    }
                } catch (error) {
                    console.warn(`error is:`,error)
                }
            }
            console.groupEnd()
        }
    } finally {
        astralBrowser.close()
    }

// 
// auto tags
// 
    
    // for (const [key, reference] of Object.entries(references)) {
    //     reference.notes.keyTags = reference.notes.keyTags || []
        
    //     const title = reference.title.toLowerCase()
    //     const primaryBioRelated = !!title.match(/\bneuro|\bbio|\bhippocamp|\bbrain|\bhebbia|drosophila|visual(-| )cortex|ring(-| )attractor|continuous(-| )attractor|\bMD-CAN\b|head(-| )direction(-| )cell|grid(-| )cell|place(-| )cell|synaptic|\bmice\b|\brat|\bbee\b|mushroom(-| )bod|insect/i)
    //     const secondairlyBioRelated = !!title.match(/neuromorph|\bloihi|\bspiking neural network|hierarchical temporal memory|sparse distributed representation/i)
    //     const isSolvingAReleventProblem = !!title.match(/place(-| )recognition|localization|slam\b|pose(-| )estimation|navigation|landmark(-| )stability/i)
    //     const secondairlyReleventProblem = !!title.match(/sensori(-| |)motor(-| )control|\bpercept|scene(-| )understanding|proprioception|holistic(-| )scene|object(-| )detection|object(-| )tracking|locomotion/i)
    //     const usedReleventHardwareOfSomeKind = !!title.match(/robot|clearpath|unitree|\bloihi|event(-| )camera|stereo(-| )cameras|stereo(-| )vision|stereoscopic(-| )vision|jetson|\bugv\b|legged|quadruped|humanoid(-| )robot/i)
    //     const usedRelevantSoftwareOfSomeKind = !!title.match(/simulat|neuroSLAM|ratSLAM|neoSLAM|emulat|BINDSnet|\bros\b|ros2|bullet|python|pytorch|tensorflow|spiking neural network|\bsnn\b|c\+\+/i)
        
    //     // 
    //     // Biologically Based
    //     // 
    //     if (primaryBioRelated) {
    //         reference.notes.keyTags.push("biologicallyBased1")
    //         reference.notes.keyTags.push("biologicallyBased2")
    //     } else if (secondairlyBioRelated) {
    //         reference.notes.keyTags.push("biologicallyBased2")
    //     }
        
    //     // 
    //     // relevant task
    //     // 
    //     if (isSolvingAReleventProblem) {
    //         reference.notes.keyTags.push("relevantTask1")
    //         reference.notes.keyTags.push("relevantTask2")
    //     } else if (secondairlyReleventProblem) {
    //         reference.notes.keyTags.push("relevantTask2")
    //     }
        
    //     // 
    //     // tangible
    //     // 
    //     if (usedReleventHardwareOfSomeKind && usedRelevantSoftwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible1")
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleHardware")
    //         reference.notes.keyTags.push("tangibleSoftware")
    //     } else if (usedReleventHardwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleHardware")
    //     } else if (usedRelevantSoftwareOfSomeKind) {
    //         reference.notes.keyTags.push("tangible2")
    //         reference.notes.keyTags.push("tangibleSoftware")
    //     }
    // }


// main.saveProject({activeProject: main.activeProject, path: main.storageObject.activeProjectPath})