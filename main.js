import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
// import { FileSystem } from "https://deno.land/x/quickr@0.6.51/main/file_system.js"
// import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.13.5.0/string.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.73/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.73/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.73/main/console.js"
import { OperatingSystem } from "https://deno.land/x/quickr@0.6.73/main/operating_system.js"
// import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import * as yaml from "./tools/yaml.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/deno.js'
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.13.5.0/flattened/parse_args.js" 
import { rankedCompare } from "https://deno.land/x/good@1.13.5.0/flattened/ranked_compare.js" 

import { version } from "./tools/version.js"
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write, clearScreen } from "./tools/input_tools.js"  
import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, getOpenAlexData, openAlexToSimpleFormat } from "./tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "./tools/misc.js"
import { DiscoveryMethod } from "./tools/discovery_method.js"
import { Reference } from "./tools/reference.js"
import { loadProject, saveProject, score, referenceSorter, sortReferencesByDate, rateDiscoveryAttempts } from "./tools/project_tools.js"

// TODO: make sorter and keywords real time editable (reload from file)
// TODO: make relevence score of discoveryMethod, list most helpful searches
// TODO: find a way to add info to a manually entered reference

// done: have a better system for sorting
    // account for:
    // reference count
    // publication year
    // keyword combos
    // specific author included

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
            'super-relevent|title': 0,
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

// 
// main loop
// 
activeProject = await loadProject(storageObject.activeProjectPath)
await saveProject({activeProject, path: storageObject.activeProjectPath}) // immediately format
mainLoop: while (true) {
    showProjectStatus()
    const whichAction = await selectOne({
        message: "next action",
        options: [
            "review references",
            "gather references (search internet)",
            "get related work",
            "change project",
            "modify keywords",
            "explore references",
            "autofill data",
            "score the discovery attempts",
            "exit",
        ],
    })
    // in case file has been edited
    activeProject = await loadProject(storageObject.activeProjectPath)
    
    if (whichAction == "gather references (search internet)") {
        const searchEngineName = await selectOne({
            message: "which engine?",
            options: Object.keys(searchOptions),
        })
        const searchEngine = searchOptions[searchEngineName]
        const query = await Console.askFor.line(cyan`What's the search query?`)
        const discoveryMethod = new DiscoveryMethod({
            query,
            dateTime: new Date().toISOString(),
            searchEngine: searchEngineName,
        })
        const references = await withSpinner("searching",
            ()=>searchEngine.urlToListOfResults(`${searchEngine.base}${searchEngine.searchStringToParams(query)}`)
        ).then(all=>all.map(each=>new Reference({
            title: each.title,
            notes: {
                resumeStatus: "unseen|title",
                comment: "",
                reasonsRelevant: [],
                reasonsNotRelevant: [],
                customKeywords: [],
                discoveryMethod: { dateTime: discoveryMethod.dateTime, originalQuery: discoveryMethod.query, searchEngine: discoveryMethod.searchEngine },
                events: {},
            },
            accordingTo: {
                crossref: {},
                [searchEngineName]: each,
            },
        })))
        let count = 0
        await withSpinner("getting full data for each result",
            (mention)=>Promise.all(references.map(async each=>{
                if (!each?.doi) {
                    try {
                        each.accordingTo.crossref = { doi: await title2Doi(each.title) }
                    } catch (error) {
                    }
                }
                if (each.doi) {
                    try {
                        each.accordingTo.crossref = crossrefToSimpleFormat(
                            await doiToCrossrefInfo(each.doi, { cacheObject: crossrefCacheObject, })
                        )
                    } catch (error) {
                    }
                }
                count++
                mention(`got ${count} of ${references.length}`)
            }))
        )
        // example references: [
        //         Reference {
        //             title: "RAIL: Robot Affordance Imagination with Large Language Models",
        //             year: "1936",
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
        let addedReferences = 0
        for (let each of references) {
            const hadBeenSeenBefore = !!activeProject.references[each.title]
            discoveryMethod.referenceLinks.push({
                hadBeenSeenBefore,
                title: each.title,
                // link to object directly rather than spread so that yaml will make it a anchor to it
                link: each,
            })
            if (!hadBeenSeenBefore) {
                addedReferences++
                activeProject.references[each.title] = each
                unseenReferences[each.title] = each
                each.resumeStatus = "unseen|title"
                each.events = each.events || {}
                each.events["added"] =  each.events["added"] || new DateTime().toISOString()
            }
        }
        activeProject.discoveryAttempts.push(discoveryMethod)
        for (const each of Object.values(unseenReferences).sort(referenceSorter({project: activeProject}))) {
            console.log(`${score(each, activeProject)}  ${highlightKeywords(each.title)}`)
        }
        await saveProject({activeProject, path: storageObject.activeProjectPath})
        prompt(`\n\nAdded ${cyan(addedReferences)} references\ncheck them out under ${cyan("review references")} -> ${cyan("unseen|title")}\n(press enter to continue)\n`)
    } else if (whichAction == "change project") {
        const options = ["<new project>"].concat(Object.keys(storageObject.previouslyActiveProjectPaths).map(each=>`- ${each}`))
        let project = await selectOne({
            message: "pick a project",
            options,
        })
        if (project == "<new project>") {
            storageObject.activeProjectPath = FileSystem.makeAbsolutePath(await askForFilePath(`What is the path to the yaml file? (if what you enter doesn't exist, I'll create it)`,))
            let name = (await Console.askFor.line(`What is a good nickname for this project? (empty will use date)`)) || new DateTime().date
            storageObject.previouslyActiveProjectPaths[name] = storageObject.activeProjectPath
            activeProject = await loadProject(storageObject.activeProjectPath)
        } else {
            project = project.replace(/^- /, "")
            storageObject.activeProjectPath = storageObject.previouslyActiveProjectPaths[project]
            activeProject = await loadProject(storageObject.activeProjectPath)
        }
    } else if (whichAction == "modify keywords") {
        const kind = await selectOne({
            message: "which group?",
            options: [
                "positive",
                "negative",
                "neutral",
            ],
        })
        const keywords = (await askForParagraph(`list keyterms to add, one per line, press enter 3 times to submit list`)).split("\n").map(each=>each.trim()).filter(each=>each.length>0)
        const possibleForDelete = [...activeProject.settings.keywords[kind]]
        activeProject.settings.keywords[kind].push(...keywords)
        if (await Console.askFor.yesNo(`delete some keywords? (y/n)`)) {
            const onesToDelete = await selectMany({
                message: "Ones with checkmark will be deleted",
                options: possibleForDelete,
            })
            activeProject.settings.keywords[kind] = activeProject.settings.keywords[kind].filter(each=>!onesToDelete.includes(each))
        }
        saveProject({activeProject, path: storageObject.activeProjectPath})
    } else if (whichAction == "review references") {
        reviewLoop: while (true) {
            let references = Object.values(activeProject.references)
            const statuses = Object.values(activeProject.references).map(each=>each.resumeStatus)
            const counts = getReferenceStatusCounts()
            
            const whatKind = await selectOne({
                message: "which group do you want to review?",
                options: Object.keys(counts).concat(["nothing (quit)"]),
                optionDescriptions: Object.values(counts).map(each=>`(${each} references)`).concat([""]),
                showInfo: true,
            })
            
            // 
            // title review
            // 
            if (whatKind == "nothing (quit)") {
                continue mainLoop
            } else if (whatKind == "unseen|title" || whatKind == "skipped|title") {
                console.log(cyan`\nCONTROLS: g=relevent (good), s=super relevent, b=not relevent (bad), u=unclear, n=skip (next), q=quit`)
                nextReferenceLoop: for (let each of references.filter(each=>each.resumeStatus == whatKind).sort(referenceSorter({project: activeProject}))) {
                    // TODO: highlight good and bad keywords
                    let message = `${cyan`${score(each, activeProject)} (${each?.year}) `}${highlightKeywords(each.title)}: `
                    write(message)
                    each.reasonsNotRelevant = each.reasonsNotRelevant || []
                    each.reasonsRelevant = each.reasonsRelevant || []
                    each.events = each.events || {}
                    each.events["sawTitle"] =  each.events["sawTitle"] || new DateTime().toISOString()
                    await saveProject({activeProject, path: storageObject.activeProjectPath})
                    for await (let { name: keyName, sequence, code, ctrl, meta, shift } of listenToKeypresses()) {
                        activeProject = await loadProject(storageObject.activeProjectPath)
                        // to handle live reloading of data
                        each = activeProject.references[each.title]
                        
                        if (keyName == "q" || (ctrl && keyName == "c")) {
                            console.log(cyan`quit`)
                            continue reviewLoop
                        }
                        const maxTagLength = 23
                        if (keyName == "n") {
                            console.log(`\r${cyan`⏺  skipped`}`.padEnd(maxTagLength), message)
                            continue nextReferenceLoop
                        } else {
                            if (keyName == "g") {
                                console.log(`\r${green`✅ relevent`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "relevent|title"
                                each.reasonsRelevant.push("title")
                            } else if (keyName == "s") {
                                console.log(`\r${green`⭐️ super  `}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "super-relevent|title"
                                each.reasonsRelevant.push("title")
                            } else if (keyName == "u") {
                                console.log(`\r${magenta`❔ unclear`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "unclear|title"
                            } else if (keyName == "b") {
                                console.log(`\r${red`❌ irrelevent`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "irrelevent|title"
                                each.reasonsNotRelevant.push("title")
                            } else {
                                console.log(`\nunrecognized key: ${keyName}                                `)
                                continue
                            }
                            await saveProject({activeProject, path: storageObject.activeProjectPath})
                        }
                        break
                    }
                }
                console.log(`\n🎉 finished reviewing ${whatKind}! 🎉\n`)
            } else if (whatKind.endsWith("|title")) {
                let quit = { title: "quit", }
                let activeReferences
                nextReferenceLoop: while (1) {
                    activeReferences = references.filter(each=>each.resumeStatus == whatKind).concat([quit])
                    if (activeReferences.length == 1) {
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
                        prompt(`finished reviewing ${whatKind}! (press enter to continue)`)
                        continue reviewLoop
                    }
                    // TODO: sort by publisher and year, allow ranking publishers
                    activeReferences.sort(referenceSorter({project: activeProject}))
                    const colorObject = Object.fromEntries(activeReferences.map(each=>[ dim(`${highlightKeywords(each.title)}`), each]))
                    let active = await selectOne({
                        message: "which title do you want to explore?",
                        options: colorObject,
                        optionDescriptions: activeReferences.map(each=>cyan`${each.year}`),
                        descriptionHighlighter: dim,
                    })
                    active = activeProject.references[active.title]
                    if (active == quit || !active) {
                        continue mainLoop
                    }
                    // TODO: fetch the webpage and attempt parsing some of it
                    await OperatingSystem.openUrl(active.link||active.pdfLink)
                    if (!active.abstract) {
                        activeProject = await loadProject(storageObject.activeProjectPath)
                        references = Object.values(activeProject.references)
                        active = activeProject.references[active.title]

                        active.accordingTo = active.accordingTo || {}
                        active.accordingTo.$manuallyEntered = active.accordingTo.$manuallyEntered || {}
                        active.accordingTo.$manuallyEntered.abstract = await askForParagraph(reset`paste in the abstract (press enter 3 times to submit)`)
                        active.events = active.events || {}
                        active.events["sawAbstract"] =  active.events["sawAbstract"] || new DateTime().toISOString()
                        saveProject({activeProject, path: storageObject.activeProjectPath})
                    }
                    if (active.pdfLink && !active.pdfWasDownloaded) {
                        const downloadPath = FileSystem.parentPath(storageObject.activeProjectPath) + "/pdfs/"+active.title+".pdf"
                        if (await Console.askFor.yesNo(reset`want me to download the pdf for you?\n` + cyan(downloadPath))+"\n\n") {
                            FileSystem.write({
                                path: downloadPath,
                                data: await fetch(active.pdfLink).then(each=>each.arrayBuffer().then(buffer=>new Uint8Array(buffer))).catch(error=>`error: ${error}`),
                            }).then(async ()=>{
                                activeProject = await loadProject(storageObject.activeProjectPath)
                                references = Object.values(activeProject.references)
                                active = activeProject.references[active.title]
                                active.pdfWasDownloaded = true
                                saveProject({activeProject, path: storageObject.activeProjectPath})
                            })
                        }
                    }
                    console.log(`\nabstract:\n\n${highlightKeywords(wordWrap(active.abstract, 80))}\n`)
                    const choice = await selectOne({
                        message: "abstract was",
                        options: [
                            "irrelevent",
                            "slightly-irrelevent",
                            "unclear",
                            "appendix",
                            "relevent",
                            "super-relevent",
                        ],
                    })
                    activeProject = await loadProject(storageObject.activeProjectPath)
                    references = Object.values(activeProject.references)
                    active = activeProject.references[active.title]
                    active.reasonsRelevant = active.reasonsRelevant || [ ]
                    active.reasonsNotRelevant = active.reasonsNotRelevant || []
                    active.resumeStatus = `${choice}|abstract`
                    if (choice == "irrelevent" || choice == "slightly-irrelevent") {
                        active.reasonsNotRelevant.push("abstract")
                    }
                    if (choice == "relevent" || choice == "super-relevent") {
                        active.reasonsRelevant.push("abstract")
                    }
                    saveProject({activeProject, path: storageObject.activeProjectPath})
                }
            } else {
                let quit = { title: "quit", }
                let activeReferences
                nextReferenceLoop: while (1) {
                    activeReferences = [quit].concat(references.filter(each=>each.resumeStatus == whatKind))
                    if (activeReferences.length == 1) {
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
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
    } else if (whichAction == "get related work") {
        getRelatedLoop: while (true) {
            const references = Object.values(activeProject.references)
            const statuses = Object.values(activeProject.references).map(each=>each.resumeStatus)
            const counts = getReferenceStatusCounts()
            
            const whatKind = await selectOne({
                message: "which group do you want to review?",
                options: Object.keys(counts).concat(["nothing (quit)"]),
                optionDescriptions: Object.values(counts).map(each=>`(${each} references)`).concat([""]),
                showInfo: true,
            })
            
            // 
            // pick
            // 
            if (whatKind == "nothing (quit)") {
                continue mainLoop
            } else {
                let quit = { title: "quit", }
                let activeReferences
                nextReferenceLoop: while (1) {
                    activeReferences = references.filter(each=>each.resumeStatus == whatKind).concat([quit])
                    if (activeReferences.length == 1) {
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
                        prompt(`finished getting references for ${whatKind}! (press enter to continue)`)
                        continue mainLoop
                    }
                    activeReferences.sort(referenceSorter({project: activeProject}))
                    const colorObject = Object.fromEntries(activeReferences.map(each=>[ dim(`${highlightKeywords(each.title)}`), each]))
                    const active = await selectOne({
                        message: "Which title do you want to explore related work of?",
                        options: colorObject,
                        optionDescriptions: activeReferences.map(each=>cyan`${each.year}`),
                        descriptionHighlighter: dim,
                    })
                    if (active == quit) {
                        continue mainLoop
                    }
                    const {discoveryMethod,relatedArticles} = await withSpinner("getting related articles", 
                        (mention)=>getRelatedArticles(active, (index,total)=>mention(`got ${index} of ${total}`))
                    )
                    let addedReferences = 0
                    let unseenReferences = {}
                    for (const [title, each] of Object.entries(relatedArticles)) {
                        if (!each.title) {
                            console.debug(`each is:`,each)
                            console.debug(`title is:`,title)
                            each.title = title
                        }
                        const hadBeenSeenBefore = !!activeProject.references[title]
                        discoveryMethod.referenceLinks.push({
                            hadBeenSeenBefore,
                            title: title,
                            // link to object directly rather than spread so that yaml will make it a anchor to it
                            link: each,
                        })
                        if (!hadBeenSeenBefore) {
                            addedReferences++
                            activeProject.references[title] = each
                            unseenReferences[title] = each
                            each.resumeStatus = "unseen|title"
                            each.events = each.events || {}
                            each.events["added"] =  each.events["added"] || new DateTime().toISOString()
                        } else {
                            active.notes.alreadyConnectedTo = [...new Set(active.notes.alreadyConnectedTo||[])]
                            active.notes.alreadyConnectedTo.push(title)
                        }
                    }
                    console.debug(`discoveryMethod is:`,discoveryMethod)
                    activeProject.discoveryAttempts.push(discoveryMethod)
                    await saveProject({activeProject, path: storageObject.activeProjectPath})
                    prompt(`\n\nAdded ${cyan(addedReferences)} references\ncheck them out under ${cyan("review references")} -> ${cyan("unseen|title")}\n(press enter to continue)\n`)
                }
            }
            
            break 
        }
    } else if (whichAction == "autofill data") {
        const references = sortReferencesByDate(Object.values(activeProject.references))
        const referencesNoDoi = references.filter(each=>!each.doi)
        const referencesToScan = references.filter(each=>each.doi&&(!each.accordingTo?.openAlex))
        console.log(`${references.length} references`)
        console.log(`   ${referencesToScan.length} with doi but no openAlex data`)
        console.log(`   ${referencesNoDoi.length} without doi`)
        console.log(`   `)
        await withSpinner("getting openAlex info",
            async (mention)=>{
                let index = -1
                for (let each of referencesToScan) {
                    // this has to be done because saveProject({activeProject, path: storageObject.activeProjectPath}) refreshes activeProject
                    each = activeProject.references[each.title]
                    index++
                    await mention(`getting ${index+1} of ${referencesToScan.length}`)
                    try {
                        each.accordingTo.openAlex = openAlexToSimpleFormat(await getOpenAlexData(each.doi))
                        // wait a bit to avoid hitting rate limit
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
                        await new Promise(r=>setTimeout(r,1000))
                    } catch (error) {
                        await mention(`getting ${index+1} of ${referencesToScan.length}: hit error ${error}`)
                        await new Promise(r=>setTimeout(r,2000))
                    }
                }
            }
        )
        await withSpinner("attempting to get doi's for articles missing one",
            async (mention)=>{
                let index = -1
                for (let each of referencesNoDoi) {
                    // this has to be done because saveProject({activeProject, path: storageObject.activeProjectPath}) refreshes activeProject
                    each = activeProject.references[each.title]
                    index++
                    await mention(`getting ${index+1} of ${referencesNoDoi.length}`)
                    try {
                        let doi = await title2Doi(each.title)
                        each.accordingTo = each.accordingTo || {}
                        each.accordingTo.crossref = each.accordingTo.crossref || {}
                        each.accordingTo.crossref.doi = doi
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
                    } catch (error) {
                        await mention(`getting ${index+1} of ${referencesNoDoi.length}: hit error ${error}`)
                        await new Promise(r=>setTimeout(r,2000))
                    }
                }
            }
        )
        // lingering articles
        const lingeringReferences = referencesNoDoi.filter(each=>each.doi)
        await withSpinner("getting remaining articles info",
            async (mention)=>{
                let index = -1
                for (let each of lingeringReferences) {
                    // this has to be done because saveProject({activeProject, path: storageObject.activeProjectPath}) refreshes activeProject
                    each = activeProject.references[each.title]
                    index++
                    await mention(`getting ${index+1} of ${lingeringReferences.length}`)
                    try {
                        each.accordingTo.openAlex = openAlexToSimpleFormat(await getOpenAlexData(each.doi))
                        // wait a bit to avoid hitting rate limit
                        await saveProject({activeProject, path: storageObject.activeProjectPath})
                        await new Promise(r=>setTimeout(r,1000))
                    } catch (error) {
                        await mention(`getting ${index+1} of ${lingeringReferences.length}: hit error ${error}`)
                        await new Promise(r=>setTimeout(r,2000))
                    }
                }
            }
        )
        saveProject({activeProject, path: storageObject.activeProjectPath})
        console.log(`data added`)
    } else if (whichAction == "score the discovery attempts") {
        rateDiscoveryAttempts(activeProject.discoveryAttempts)
        activeProject.discoveryAttempts = activeProject.discoveryAttempts.map(each=>new DiscoveryMethod(each))
        await saveProject({activeProject, path: storageObject.activeProjectPath})
        const sorted = [...activeProject.discoveryAttempts].map(each=>new DiscoveryMethod(each))
        sorted.sort((a,b)=>b.score-a.score)
        console.log(`sorted:`)
        for (let each of sorted) {
            console.log(`    ${red(each.score)}: ${cyan(each.query||each.wasRelatedTo)}`)
        }
        prompt("")
        break mainLoop
    } else if (whichAction == "exit") {
        await saveProject({activeProject, path: storageObject.activeProjectPath})
        break mainLoop
    } else if (whichAction == "explore references") {
        throw Error(`not implemented yet`)
    }
}
