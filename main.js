import { TerminalSpinner, SpinnerTypes } from "https://deno.land/x/spinners@v1.1.2/mod.ts"
import { Command, EnumType } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.4.0/array.js"
// import { FileSystem } from "https://deno.land/x/quickr@0.6.51/main/file_system.js"
// import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.13.4.0/string.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.73/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.73/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.73/main/console.js"
import { OperatingSystem } from "https://deno.land/x/quickr@0.6.73/main/operating_system.js"
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"

import { version } from "./tools/version.js"
import { selectMany, selectOne, askForFilePath, askForParagraph } from "./tools/input_tools.js"  
import { searchOptions } from "./tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "./tools/misc.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/deno.js'
import DateTime from "https://deno.land/x/good@1.13.4.0/date.js"
import { DiscoveryMethod } from "./tools/discovery_method.js"

const posixShellEscape = (string)=>"'"+string.replace(/'/g, `'"'"'`)+"'"
const clearScreen = ()=>console.log('\x1B[2J')

const cacheFolder = `${FileSystem.home}/.cache/rizma/`
const explainPath = `${cacheFolder}/prev_explain.json`
const cacheItemPath = `${cacheFolder}/cache.json`
const storageObject = createStorageObject(cacheItemPath)

const saveExplain = (explanationConversation)=>{
    FileSystem.write({
        path: explainPath,
        data: JSON.stringify(explanationConversation)
    }).catch(console.error)
}

const maxNameBroadeningRetries = 10

import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.13.4.0/flattened/parse_args.js"

const argsInfo = parseArgs({
    rawArgs: Deno.args,
    fields: [
        [["--help", ], flag, ],
        [["--search"], initialValue(null), ],
        [["--set-output"], initialValue(null),],
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

// const command =new Command()
//     .name("Research CLI Recorder")
//     .version(version)
//     .description(`
//         Misc:
//             The cache folder is: ${JSON.stringify(cacheFolder)}
//     `.replace(/\n        /g,"\n"))
//     .globalOption("--set-output", "Choose which project file is active")
//     .option("--search", "Search under a particular project")
//     .arguments("[...args:string]")
//     .action(async function (options, ...args) {

        // 
        // arg boilerplate
        // 
            const numberedArgs = argsInfo.argList

            globalThis.debugMode = options.debug
            const commandWithExplainFlag = green`rizma `+yellow`--explain `+dim`${Deno.args.map(posixShellEscape).join(" ")}`
        
        // 
        // --set-output
        // 
            if (options.setOutput) {
                storageObject.activeProject = FileSystem.makeAbsolutePath(options.setOutput)
            }
        // 
        // get active project   
        //
            if (!storageObject.activeProject) {
                if (await Console.askFor.yesNo(`No active project set (path to a yaml file), do you want to set one now?`)) {
                    storageObject.activeProject = FileSystem.makeAbsolutePath(await askForFilePath(`What is the path to the yaml file? (if what you enter doesn't exist, I'll create it)`,))
                } else {
                    console.log(`okay, you can set the active project with --set-output <path to a yaml file>`)
                    Deno.exit(1)
                }
            }
            console.log(`active project is: `,cyan(storageObject.activeProject))
            let activeProject = await FileSystem.read(storageObject.activeProject) || {
                keywords: [],
                references: {},
                discoveryAttempts: [],
            }
            if (!activeProject.discoveryAttempts || !activeProject.references) {
                activeProject ={
                    keywords: [],
                    references: {},
                    discoveryAttempts: [],
                }
            }
            console.debug(`activeProject.references is:`,activeProject.references)
            
            const saveProject = async ()=>{
                await FileSystem.write({path: storageObject.activeProject, data: yaml.stringify(activeProject)})
            }
            // if (!activeProject) {
            //     if (await Console.askFor.yesNo(`Project file doesn't exist, do you want to create it?`)) {
            //         console.log(`creating project file`)
            //         await FileSystem.write(storageObject.activeProject, yaml.stringify(activeProject))
            //     }
            // }
        
        // 
        // boilerplate
        // 
            const terminalSpinner = new TerminalSpinner({
                text: "fetching",
                color: "green",
                spinner: SpinnerTypes.dots, // check the file - see import
                indent: 0, // The level of indentation of the spinner in spaces
                cursor: false, // Whether or not to display a cursor when the spinner is active
                writer: Deno.stderr
            })
            terminalSpinner.start()

            // clear out the previous explain
            FileSystem.write({
                path: explainPath,
                data: ""
            }).catch(_=>0)
        
        // 
        // normal search
        // 
            const searchEngineName = options.search
            const searchEngine = searchOptions[searchEngineName]
            if (!searchEngine) {
                didYouMean({ givenWord: searchEngineName, possibleWords: Object.keys(searchOptions), autoThrow: true, suggestionLimit: 1 })
            }
            
            const query = numberedArgs.join(" ")
            const discoveryMethod = new DiscoveryMethod({
                query,
                dateTime: new Date().getTime(),
                searchEngine: searchEngineName,
            })
            const references = await searchEngine.urlToListOfResults(`${searchEngine.base}${searchEngine.searchStringToParams(query, discoveryMethod)}`)
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
            await terminalSpinner.succeed(`finished fetching ${references.length} references`)
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
                }
            }
            activeProject.discoveryAttempts.unshift(discoveryMethod)
            saveProject()
        // 
        // 
        // mark good titles
        // 
        //
            const stage2References = {}
            const stage2ReferenceKeys = await selectMany({
                message: "Which titles are good enough to view the abstracts for?",
                options: Object.keys(unseenReferences),
            })
            // mark irrelvent/relevant
            for (const [key, value] of Object.entries(unseenReferences)) {

                if (!stage2ReferenceKeys.includes(key)) {
                    value.reasonsNotRelevant = value.reasonsNotRelevant || []
                    value.reasonsNotRelevant.push("title")
                    value.resumeStatus = "irrelevent:title"
                } else {
                    stage2References[key] = value
                    value.relevanceStages = [ "title", ]
                    value.resumeStatus = "relevent:title"
                }
            }
            saveProject()
        // 
        // explore
        //
            const choice = await selectOne({
                message: "next action",
                options: [
                    "explore pending",
                    "search",
                ],
                showList: true,
            })
            if (choice == "explore pending") {
                let stage3References = {}
                while (Object.values(stage2References).length > 0) {
                    const title = await selectOne({
                        message: "Which title do you want to explore?",
                        options: Object.keys(stage2References),
                        showList: true,
                    })
                    const active = stage2References[title]
                    delete stage2References[title]
                    // TODO: add filtering words that could be fetched here
                    // TODO: wget the result into a file
                    // TODO: if it's a pdf, download it
                    await OperatingSystem.openUrl(active.link||active.pdfLink)
                    active.abstract = await askForParagraph(`paste in the abstract (press enter twice to submit):`)
                    // TODO: highlight good and bad keywords
                    const choice = await selectOne({
                        message: "abstract was",
                        options: [
                            "irrelevent",
                            "unclear",
                            "relevent",
                        ],
                        showList: true,
                    })
                    active.relevanceStages = active.relevanceStages || [ ]
                    active.reasonsNotRelevant = active.reasonsNotRelevant || []
                    active.resumeStatus = `${choice}:abstract`
                    if (choice == "irrelevent") {
                        active.reasonsNotRelevant.push("abstract")
                    }
                    if (choice == "relevent") {
                        active.relevanceStages.push("abstract")
                    }
                }
            }
            
    // })

// await command.parse(Deno.args)