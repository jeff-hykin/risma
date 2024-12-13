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
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write } from "./tools/input_tools.js"  
import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, getOpenAlexData } from "./tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "./tools/misc.js"
import { DiscoveryMethod } from "./tools/discovery_method.js"
import { Reference } from "./tools/reference.js"

// TODO: make relevence score of discoveryMethod, list most helpful searches
// TODO: put keywords into a settings section
// TODO: make something for related work discovery
// TODO: find a way to add info to a manually entered reference

// done: have a better system for sorting
    // account for:
    // reference count
    // publication year
    // keyword combos
    // specific author included

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
    const loadProject = async () => {
        const defaultObject = {
            settings: {
                keywords: {
                    positive: [],
                    negative: [],
                    neutral: [],
                },
            },
            references: {},
            discoveryAttempts: [],
        }
        activeProject = await FileSystem.read(storageObject.activeProjectPath) || JSON.stringify(defaultObject)
        activeProject = yaml.parse(activeProject)
        if (!activeProject.discoveryAttempts || !activeProject.references) {
            activeProject = defaultObject
        }
        activeProject.settings = activeProject.settings || {}
        activeProject.settings.keywords = activeProject.settings.keywords || {}
        for (const [key, value] of Object.entries(activeProject.references)) {
            activeProject.references[key] = new Reference(value)
            try {
                activeProject.references[key].score = score(activeProject.references[key])
            } catch (error) {
                
            }
        }
        for (let eachDiscoveryAttempt of activeProject.discoveryAttempts) {
            for (let each of eachDiscoveryAttempt.referenceLinks) {
                each.link = activeProject.references[each.title]
            }
        }
        // console.log(`active project is: `,cyan(storageObject.activeProjectPath))
        for (let each of Object.values(activeProject.references)) {
            each.publisherInfo = (each.publisherInfo||"").replace(/�|…/g,"").trim()
            // for papers added manually
            if (!each.doi) {
                // this is pretty slow so we do it in the background
                title2Doi(each.title).then(doi=>{
                    if (doi) {
                        try {
                            each.accordingTo = each.accordingTo || {}
                            each.accordingTo.crossref = each.accordingTo.crossref || {}
                            each.accordingTo.crossref.doi = doi
                            saveProject()
                        } catch (error) {
                            
                        }
                    }
                }).catch(error=>{
                    // console.warn(`error getting doi for ${title}`,error)
                })
            }
            
        }
    }
    await loadProject()
    
    const saveProject = async ()=>{
        // fixup references
        for (const [key, value] of Object.entries(activeProject.references)) {
            activeProject.references[key] = new Reference(value)
        }
        // fixup links
        for (let eachDiscoveryAttempt of activeProject.discoveryAttempts) {
            for (let each of eachDiscoveryAttempt.referenceLinks) {
                each.link = activeProject.references[each.title]
            }
        }
        await FileSystem.write({path: storageObject.activeProjectPath, data: yaml.stringify(activeProject,{ indent: 4, lineWidth: Infinity, skipInvalid: true, })})
    }

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

    const score = (each)=>{
        //
        // keyword count
        //
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
        function getKeywordCount(title) {
            if (!title) {
                return {good: 0, bad: 0, neutral: 0}
            }
            let numberOfGoodKeywords = 0
            let numberOfBadKeywords = 0
            let numberOfNeutralKeywords = 0
            let index = -1
            for (let char of title) {
                index++
                if (!title.slice(0,index).match(/[a-zA-Z0-9_]$/)) {
                    const remaining = title.slice(index,).toLowerCase()
                    let matching
                    // FIXME: need to sort by length of keyword 
                    if (goodKeywords.some(each=>(remaining.startsWith(matching=each)))) {
                        numberOfGoodKeywords++
                        index += matching.length
                    } else if (badKeywords.some(each=>remaining.startsWith(matching=each))) {
                        numberOfBadKeywords++
                        index += matching.length
                    } else if (neutralKeywords.some(each=>remaining.startsWith(matching=each))) {
                        numberOfNeutralKeywords++
                        index += matching.length
                    }
                }
            }
            return {good: numberOfGoodKeywords, bad: numberOfBadKeywords, neutral: numberOfNeutralKeywords}
        }
        
        // 
        // evaluate user-defined scoring functions
        // 
        let scoreList = [0,0,0]
        for (const [key, value] of Object.entries(activeProject.settings.scoreGivers||{})) {
            try {
                const func = eval(value)
                func(
                    each,
                    scoreList,
                    {
                        keywords,
                        settings: activeProject.settings,
                        numberOfGoodKeywordsIn: (title)=>getKeywordCount(title).good,
                        numberOfBadKeywordsIn: (title)=>getKeywordCount(title).bad,
                        numberOfNeutralKeywordsIn: (title)=>getKeywordCount(title).neutral,
                    }
                )
            } catch (error) {
                console.debug(`\nerror when calculating score with ${key}() for `, value)
                throw error
            }
        }
        if (Object.values(activeProject.settings.scoreGivers).length == 0) {
            // use year (currently gets added to keyword score)
            scoreList[0] += (each.year-0||0)
        }
        
        return scoreList
    }

    function referenceSorter(reverse) {
        // const activeReferences = references.filter(each=>each.resumeStatus == whatKind)
        // for (let each of activeReferences) {
        //     console.debug(`each.title, score(each) is:`,highlightKeywords(each.title), score(each))
        // }
        if (reverse) {
            return (b,a)=>rankedCompare(score(b),score(a))
        } else {
            return (a,b)=>rankedCompare(score(b),score(a))
        }
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
            "get related work",
            "change project",
            "modify keywords",
            "explore references",
            "exit",
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
                discoveryMethod: { dateTime: discoveryMethod.dateTime, query: discoveryMethod.query, searchEngine: discoveryMethod.searchEngine },
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
        activeProject.discoveryAttempts.unshift(discoveryMethod)
        await saveProject()
        prompt(`\n\nAdded ${cyan(addedReferences)} references\ncheck them out under ${cyan("review references")} -> ${cyan("unseen|title")}\n(press enter to continue)\n`)
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
            message: "which group?",
            options: [
                "positive",
                "negative",
                "neutral",
            ],
        })
        const keywords = (await askForParagraph(`list keyterms to add, one per line, press enter twice to submit list`)).split("\n").map(each=>each.trim()).filter(each=>each.length>0)
        const possibleForDelete = [...activeProject.settings.keywords[kind]]
        activeProject.settings.keywords[kind].push(...keywords)
        if (await Console.askFor.yesNo(`delete some keywords? (y/n)`)) {
            const onesToDelete = await selectMany({
                message: "Ones with checkmark will be deleted",
                options: possibleForDelete,
            })
            activeProject.settings.keywords[kind] = activeProject.settings.keywords[kind].filter(each=>!onesToDelete.includes(each))
        }
        saveProject()
    } else if (whichAction == "review references") {
        reviewLoop: while (true) {
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
            // title review
            // 
            if (whatKind == "nothing (quit)") {
                continue mainLoop
            } else if (whatKind == "unseen|title" || whatKind == "skipped|title") {
                console.log(cyan`\nCONTROLS: g=relevent (good), b=not relevent (bad), u=unclear, n=skip (next), q=quit`)
                nextReferenceLoop: for (let each of references.filter(each=>each.resumeStatus == whatKind).sort(referenceSorter())) {
                    // TODO: highlight good and bad keywords
                    let message = `${cyan`(${each?.year}, ${score(each)}) `}${highlightKeywords(each.title)}: `
                    write(message)
                    for await (let { name: keyName, sequence, code, ctrl, meta, shift } of listenToKeypresses()) {
                        if (keyName == "q" || (ctrl && keyName == "c")) {
                            console.log(cyan`quit`)
                            continue reviewLoop
                        }
                        each.reasonsNotRelevant = each.reasonsNotRelevant || []
                        each.reasonsRelevant = each.reasonsRelevant || []
                        each.events = each.events || {}
                        each.events["sawTitle"] =  each.events["sawTitle"] || new DateTime().toISOString()
                        saveProject()
                        const maxTagLength = 23
                        if (keyName == "n") {
                            console.log(`\r${cyan`⏺  skipped`}`.padEnd(maxTagLength), message)
                            continue nextReferenceLoop
                        } else {
                            if (keyName == "g") {
                                console.log(`\r${green`✅ relevent`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "relevent|title"
                                each.reasonsRelevant.push("title")
                            } else if (keyName == "u") {
                                console.log(`\r${magenta`❔ unclear`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "unclear|title"
                            } else if (keyName == "b") {
                                console.log(`\r${red`❌ irrelevent`}`.padEnd(maxTagLength), message)
                                each.resumeStatus = "irrelevent|title"
                                each.reasonsNotRelevant.push("title")
                            } else {
                                console.log(`\runrecognized key: ${keyName}`)
                                continue
                            }
                            await saveProject()
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
                        await saveProject()
                        prompt(`finished reviewing ${whatKind}! (press enter to continue)`)
                        continue reviewLoop
                    }
                    // TODO: sort by publisher and year, allow ranking publishers
                    activeReferences.sort(referenceSorter())
                    const colorObject = Object.fromEntries(activeReferences.map(each=>[ dim(`${highlightKeywords(each.title)}`), each]))
                    const active = await selectOne({
                        message: "Which title do you want to explore?",
                        options: colorObject,
                        optionDescriptions: activeReferences.map(each=>cyan`${each.year}`),
                        descriptionHighlighter: dim,
                    })
                    if (active == quit) {
                        continue mainLoop
                    }
                    // TODO: fetch the webpage and attempt parsing some of it
                    await OperatingSystem.openUrl(active.link||active.pdfLink)
                    if (!active.abstract) {
                        active.abstract = await askForParagraph(reset`paste in the abstract (press enter twice to submit)`)
                        active.events = active.events || {}
                        active.events["sawAbstract"] =  active.events["sawAbstract"] || new DateTime().toISOString()
                        saveProject()
                    }
                    if (active.pdfLink && !active.pdfWasDownloaded) {
                        const downloadPath = FileSystem.parentPath(storageObject.activeProjectPath) + "/pdfs/"+active.title+".pdf"
                        if (await Console.askFor.yesNo(reset`want me to download the pdf for you?\n` + cyan(downloadPath))+"\n\n") {
                            FileSystem.write({
                                path: downloadPath,
                                data: await fetch(active.pdfLink).then(each=>each.arrayBuffer().then(buffer=>new Uint8Array(buffer))).catch(error=>`error: ${error}`),
                            }).then(()=>{
                                active.pdfWasDownloaded = true
                                saveProject()
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
                    active.reasonsRelevant = active.reasonsRelevant || [ ]
                    active.reasonsNotRelevant = active.reasonsNotRelevant || []
                    active.resumeStatus = `${choice}|abstract`
                    if (choice == "irrelevent" || choice == "slightly-irrelevent") {
                        active.reasonsNotRelevant.push("abstract")
                    }
                    if (choice == "relevent" || choice == "super-relevent") {
                        active.reasonsRelevant.push("abstract")
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
                        await saveProject()
                        prompt(`finished getting references for ${whatKind}! (press enter to continue)`)
                        continue mainLoop
                    }
                    activeReferences.sort(referenceSorter())
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
                        activeProject.references[title] = each
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
                    activeProject.discoveryAttempts.unshift(discoveryMethod)
                    await saveProject()
                    prompt(`\n\nAdded ${cyan(addedReferences)} references\ncheck them out under ${cyan("review references")} -> ${cyan("unseen|title")}\n(press enter to continue)\n`)
                }
            }
            
            break 
        }
    } else if (whichAction == "exit") {
        break mainLoop
    } else if (whichAction == "explore references") {
        throw Error(`not implemented yet`)
    }
}
