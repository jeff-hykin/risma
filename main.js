import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.4.0/array.js"
// import { FileSystem } from "https://deno.land/x/quickr@0.6.51/main/file_system.js"
// import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.13.4.0/string.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.73/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.73/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.73/main/console.js"
import { OperatingSystem } from "https://deno.land/x/quickr@0.6.73/main/operating_system.js"
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/deno.js'
import DateTime from "https://deno.land/x/good@1.13.4.0/date.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.13.4.0/flattened/parse_args.js" 

import { version } from "./tools/version.js"
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap } from "./tools/input_tools.js"  
import { searchOptions, title2Doi } from "./tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "./tools/misc.js"
import { DiscoveryMethod } from "./tools/discovery_method.js"

const posixShellEscape = (string)=>"'"+string.replace(/'/g, `'"'"'`)+"'"
const clearScreen = ()=>console.log('\x1B[2J')

const argsInfo = parseArgs({
    rawArgs: Deno.args,
    fields: [
        // [["--version", ], flag, ],
        [["--cache-path", ], initialValue(`${FileSystem.home}/.cache/risma/`), ],
        // [["--set-output"], initialValue(null),],
    ],
    namedArgsStopper: "--",
    allowNameRepeats: true,
    valueTransformer: JSON.parse,
    isolateArgsAfterStopper: false,
    argsByNameSatisfiesNumberedArg: true,
    implicitNamePattern: /^(--|-)[a-zA-Z0-9\-_]+$/,
    implictFlagPattern: null,
})
didYouMean({
    givenWords: Object.keys(argsInfo.implicitArgsByName).filter(each=>each.startsWith(`-`)),
    possibleWords: Object.keys(argsInfo.explicitArgsByName).filter(each=>each.startsWith(`-`)),
    autoThrow: true,
    suggestionLimit: 1,
})
const options = argsInfo.simplifiedNames

const cacheFolder = options.cachePath
const cacheItemPath = `${cacheFolder}/cache.json`
const storageObject = createStorageObject(cacheItemPath)

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
    const loadProject = async () => {
        const defaultObject = {
            keywords: {
                positive: [],
                negative: [],
                neutral: [],
            },
            references: {},
            discoveryAttempts: [],
        }
        activeProject = await FileSystem.read(storageObject.activeProjectPath) || JSON.stringify(defaultObject)
        activeProject = yaml.parse(activeProject)
        if (!activeProject.discoveryAttempts || !activeProject.references) {
            activeProject = defaultObject
        }
        activeProject.keywords = activeProject.keywords || {}
        // console.log(`active project is: `,cyan(storageObject.activeProjectPath))
        for (let each of Object.values(activeProject.references)) {
            each.publisherInfo = each.publisherInfo.replace(/�|…/g,"").trim()
            // for papers added manually
            if (!each.doi) {
                // this is pretty slow so we do it in the background
                title2Doi(each.title).then(doi=>{
                    if (doi) {
                        each.doi = doi
                    }
                    saveProject()
                }).catch(error=>{
                    // console.warn(`error getting doi for ${title}`,error)
                })
            }
            
        }
    }
    await loadProject()
    
    const saveProject = async ()=>{
        await FileSystem.write({path: storageObject.activeProjectPath, data: yaml.stringify(activeProject,{ lineWidth: Infinity, })})
    }

    function getReferenceStatusCounts() {
        const counts = {}
        const references = Object.values(activeProject.references)
        const statuses = Object.values(activeProject.references).map(each=>each.resumeStatus)
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
        console.log(yaml.stringify({
            totalReferences: Object.keys(activeProject.references).length, 
            ...counts
        }))
    }
    
    function highlightKeywords(text) {
        activeProject.keywords.positive = activeProject.keywords.positive || []
        activeProject.keywords.negative = activeProject.keywords.negative || []
        activeProject.keywords.neutral = activeProject.keywords.neutral || []
        activeProject.keywords.positive = activeProject.keywords.positive.map(each=>each.toLowerCase())
        activeProject.keywords.negative = activeProject.keywords.negative.map(each=>each.toLowerCase())
        activeProject.keywords.neutral = activeProject.keywords.neutral.map(each=>each.toLowerCase())
        const goodKeywords = activeProject.keywords.positive
        const badKeywords = activeProject.keywords.negative
        const neuralKeywords = activeProject.keywords.neutral
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
                } else if (neuralKeywords.some(each=>remaining.startsWith(matching=each))) {
                    const replacement = `${magenta(matching)}`
                    text = text.slice(0, index) + replacement + text.slice(index + matching.length,)
                    index += replacement.length
                }
            }
        }
        return reset``+text
    }
// 
// main loop
// 
mainLoop: while (true) {
    showProjectStatus()
    const whichAction = await selectOne({
        message: "next action",
        options: [
            "review references",
            "gather references (search internet)",
            "change project",
            "modify keywords",
            "explore references",
        ],
    })
    // in case file has been edited
    await loadProject()
    
    if (whichAction == "gather references (search internet)") {
        const searchEngineName = await selectOne({
            message: "which engine?",
            options: Object.keys(searchOptions),
        })
        const searchEngine = searchOptions[searchEngineName]
        const query = await Console.askFor.line(`What's the search query?`)
        const discoveryMethod = new DiscoveryMethod({
            query,
            dateTime: new Date().getTime(),
            searchEngine: searchEngineName,
        })
        const references = await withSpinner("searching", 
            ()=>searchEngine.urlToListOfResults(`${searchEngine.base}${searchEngine.searchStringToParams(query, discoveryMethod)}`)
        )
        // example references: [
        //         Reference {
        //             title: "RAIL: Robot Affordance Imagination with Large Language Models",
        //             possibleYear: "1936",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "C Zhang", "X Meng", "D Qi", "GS Chirikjian�" ],
        //             pdfLink: "https://scholar.google.com/https://arxiv.org/pdf/2403.19369",
        //             link: "https://scholar.google.com/https://arxiv.org/abs/2403.19369",
        //             citationId: "8172269612940938567",
        //             multiArticleId: "8172269612940938567",
        //             citedByLink: "https://scholar.google.com//scholar?cites=8172269612940938567&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " arXiv preprint arXiv:2403.19369, 2024 "
        //         },
        // ]
        let unseenReferences = {}
        for (let each of references) {
            const hadBeenSeenBefore = !!activeProject.references[each.title]
            discoveryMethod.referenceLinks.push({
                hadBeenSeenBefore,
                title: each.title,
                // link to object directly rather than spread so that yaml will make it a anchor to it
                link: each,
            })
            if (!hadBeenSeenBefore) {
                activeProject.references[each.title] = each
                unseenReferences[each.title] = each
                each.resumeStatus = "unseen:title"
                each.events = each.events || {}
                each.events["added"] =  each.events["added"] || new DateTime().toISOString()
            }
        }
        activeProject.discoveryAttempts.unshift(discoveryMethod)
        saveProject()
        console.log(`added a bunch of references, check them out with "review references" "unseen:title"`)
    } else if (whichAction == "change project") {
        const options = ["<new project>"].concat(Object.keys(storageObject.previouslyActiveProjectPaths).map(each=>`- ${each}`))
        let project = await selectOne({
            message: "pick a project",
            options,
        })
        if (project == "<new project>") {
            storageObject.activeProjectPath = FileSystem.makeAbsolutePath(await askForFilePath(`What is the path to the yaml file? (if what you enter doesn't exist, I'll create it)`,))
            let name = (await Console.askFor.line(`What is a good name for this project? (empty will use date)`)) || new DateTime().date
            storageObject.previouslyActiveProjectPaths[name] = storageObject.activeProjectPath
            await loadProject()
        } else {
            project = project.replace(/^- /, "")
            storageObject.activeProjectPath = storageObject.previouslyActiveProjectPaths[project]
            await loadProject()
        }
    } else if (whichAction == "modify keywords") {
        const kind = await selectOne({
            message: "next action",
            options: [
                "positive",
                "negative",
                "neural",
            ],
        })
        const keywords = (await askForParagraph(`press enter twice to submit list`)).split("\n").map(each=>each.trim()).filter(each=>each.length>0)
        const possibleForDelete = [...activeProject.keywords[kind]]
        activeProject.keywords[kind].push(...keywords)
        if (await Console.askFor.yesNo(`delete some keywords?`)) {
            const onesToDelete = await selectMany({
                message: "Ones with checkmark will be deleted",
                options: possibleForDelete,
            })
            activeProject.keywords[kind] = activeProject.keywords[kind].filter(each=>!onesToDelete.includes(each))
        }
        saveProject()
    } else if (whichAction == "review references") {
        reviewLoop: while (true) {
            const references = Object.values(activeProject.references)
            const statuses = Object.values(activeProject.references).map(each=>each.resumeStatus)
            const counts = getReferenceStatusCounts()
            
            const whatKind = await selectOne({
                message: "what to review?",
                options: Object.keys(counts).concat(["nothing (quit)"]),
                optionDescriptions: Object.values(counts).map(each=>`(${each} references)`).concat([""]),
                showInfo: true,
            })
            
            // 
            // title review
            // 
            if (whatKind == "nothing (quit)") {
                continue mainLoop
            } else if (whatKind == "unseen:title" || whatKind == "skipped:title") {
                console.log(cyan`\ng=relevent (good), b=not relevent (bad), u=unclear, n=skip (next), q=quit`)
                nextReferenceLoop: for (let each of references.filter(each=>each.resumeStatus == whatKind)) {
                    // TODO: highlight good and bad keywords
                    console.log(`${cyan`title: `}${highlightKeywords(each.title)}`)
                    for await (let { name: keyName, sequence, code, ctrl, meta, shift } of listenToKeypresses()) {
                        if (keyName == "q" || (ctrl && keyName == "c")) {
                            console.log(cyan`quit`)
                            continue reviewLoop
                        }
                        each.reasonsNotRelevant = each.reasonsNotRelevant || []
                        each.relevanceStages = each.relevanceStages || []
                        each.events = each.events || {}
                        each.events["saw title"] =  each.events["saw title"] || new DateTime().toISOString()
                        saveProject()
                        if (keyName == "n") {
                            console.log(cyan`⏺  skipped`)
                            continue nextReferenceLoop
                        } else {
                            if (keyName == "g") {
                                console.log(green`✅ relevent`)
                                each.resumeStatus = "relevent:title"
                                each.relevanceStages.push("title")
                            } else if (keyName == "u") {
                                console.log(magenta`❔ unclear`)
                                each.resumeStatus = "unclear:title"
                            } else if (keyName == "b") {
                                console.log(red`❌ irrelevent`)
                                each.resumeStatus = "irrelevent:title"
                                each.reasonsNotRelevant.push("title")
                            } else {
                                console.log(`unrecognized key: ${keyName}`)
                                continue
                            }
                            console.log(`saving`)
                            await saveProject()
                        }
                        break
                    }
                }
                console.log(`\n🎉 finished reviewing ${whatKind}! 🎉\n`)
            } else if (whatKind == "relevent:title") {
                let quit = { title: "quit", }
                let activeReferences
                nextReferenceLoop: while (1) {
                    activeReferences = references.filter(each=>each.resumeStatus == whatKind).concat([quit])
                    if (activeReferences.length == 1) {
                        await saveProject()
                        prompt(`finished reviewing ${whatKind}! (press enter to continue)`)
                        continue reviewLoop
                    }
                    // TODO: sort by publisher and year, allow ranking publishers
                    const colorObject = Object.fromEntries(activeReferences.map(each=>[ dim(`${highlightKeywords(each.title)}`), each]))
                    const active = await selectOne({
                        message: "Which title do you want to explore?",
                        options: colorObject,
                        optionDescriptions: activeReferences.map(each=>cyan`${each.possibleYear}`),
                        descriptionHighlighter: dim,
                    })
                    if (active == quit) {
                        continue mainLoop
                    }
                    // TODO: add filtering words that could be fetched here
                    // TODO: wget the result into a file
                    // TODO: if it's a pdf, download it
                    await OperatingSystem.openUrl(active.link||active.pdfLink)
                    if (!active.abstract) {
                        active.abstract = await askForParagraph(reset`paste in the abstract (press enter twice to submit)`)
                    }
                    if (active.pdfLink) {
                        const downloadPath = FileSystem.parentPath(storageObject.activeProjectPath) + "/pdfs/"+active.title+".pdf"
                        if (await Console.askFor.yesNo(`want me to download the pdf for you?\n` + cyan(downloadPath))+"\n") {
                            FileSystem.write({
                                path: downloadPath,
                                data: fetch(active.pdfLink).then(each=>each.arrayBuffer()).catch(error=>`error: ${error}`),
                            }).then(()=>{
                                active.pdfWasDownloaded = true
                            })
                        }
                    }
                    console.log(`abstract:\n\n${highlightKeywords(wordWrap(active.abstract, 80))}\n`)
                    // TODO: highlight good and bad keywords
                    const choice = await selectOne({
                        message: "abstract was",
                        options: [
                            "irrelevent",
                            "unclear",
                            "relevent",
                            "super-relevent",
                        ],
                    })
                    active.relevanceStages = active.relevanceStages || [ ]
                    active.reasonsNotRelevant = active.reasonsNotRelevant || []
                    active.resumeStatus = `${choice}:abstract`
                    if (choice == "irrelevent" || choice == "super-relevent") {
                        active.reasonsNotRelevant.push("abstract")
                    }
                    if (choice == "relevent") {
                        active.relevanceStages.push("abstract")
                    }
                    saveProject()
                }
            } else {
                let quit = { title: "quit", }
                let activeReferences
                nextReferenceLoop: while (1) {
                    activeReferences = [quit].concat(references.filter(each=>each.resumeStatus == whatKind))
                    if (activeReferences.length == 1) {
                        await saveProject()
                        prompt(`finished reviewing ${whatKind}! (press enter to continue)`)
                        continue reviewLoop
                    }
                    const active = await selectOne({
                        message: "Which title do you want to explore?",
                        options: Object.fromEntries(activeReferences.map(each=>[each.title, each])),
                    })
                    if (active == quit) {
                        continue mainLoop
                    }
                    await OperatingSystem.openUrl(active.link||active.pdfLink)
                }
            }

            break 
        }
    } else if (whichAction == "explore references") {
        throw Error(`not implemented yet`)
    }
            
}