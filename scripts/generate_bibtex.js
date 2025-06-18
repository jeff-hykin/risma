#!/usr/bin/env -S deno run --allow-all --reload

import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
// import { FileSystem } from "https://deno.land/x/quickr@0.6.51/main/file_system.js"
// import $ from "https://deno.land/x/dax@0.39.2/mod.ts"
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix, didYouMean } from "https://deno.land/x/good@1.13.5.0/string.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.73/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo } from "https://deno.land/x/quickr@0.6.73/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground } from "https://deno.land/x/quickr@0.6.73/main/console.js"
import { OperatingSystem } from "https://deno.land/x/quickr@0.6.73/main/operating_system.js"
// import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import * as yaml from "../tools/yaml.js"
import { createStorageObject } from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/deno.js"
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
import { parseArgs, flag, required, initialValue } from "https://deno.land/x/good@1.13.5.0/flattened/parse_args.js"
import { rankedCompare } from "https://deno.land/x/good@1.13.5.0/flattened/ranked_compare.js"

import { version } from "../tools/version.js"
import { selectMany, selectOne, askForFilePath, askForParagraph, withSpinner, listenToKeypresses, dim, wordWrap, write, clearScreen } from "../tools/input_tools.js"
// import { searchOptions, title2Doi, crossrefToSimpleFormat, doiToCrossrefInfo, getRelatedArticles, openAlexToSimpleFormat, relatedWorkIncludes, autofillDataFor } from "../tools/search_tools.js"
import { versionSort, versionToList, executeConversation } from "../tools/misc.js"
import { DiscoveryMethod } from "../tools/discovery_method.js"
import { Reference } from "../tools/reference.js"
import { loadProject, saveProject, score, referenceSorter, sortReferencesByDate } from "../tools/project_tools.js"
import { zipShort } from "https://deno.land/x/good@1.13.1.0/flattened/zip_short.js"
import { frequencyCount } from "https://esm.sh/gh/jeff-hykin/good-js@1.14.2.0/source/flattened/frequency_count.js"
import { DataFrame, Series } from "https://esm.sh/data-forge@1.10.2?dev"

import { openAlexDataFromDoi, openAlexFetch } from "https://esm.sh/gh/jeff-hykin/academic_api@0.0.3.0/main/plugins/openAlex/1_fetchers.js"

const defaultCachePath = `${FileSystem.home}/.cache/risma/`
let options = {
    cachePath: defaultCachePath 
}
const openAlexCachePath = `${defaultCachePath}/openAlexCache.json`
openAlexFetch.cache = createStorageObject(openAlexCachePath)

const openAlexToBibTexSometimes = (data, nickname) => {
    const authors = data.authorships.map((author) => author.raw_author_name).join(" and ")
    const title = data.title
    const journal = data?.primary_location?.source?.display_name || ""
    const year = data.publication_year
    const volume = data.biblio.volume
    const pages = `${data.biblio?.first_page}--${data.biblio?.last_page}`
    if (!data.biblio?.first_page) {
        return ""
    }
    const doi = data.ids.doi.split("/").pop()
    const bibtex = `
@article{${nickname || authors.replace(/ /g, "")}_${year},
    author = {${authors}},
    title = {${title}},
    journal = {${journal}},
    year = {${year}},
    volume = {${volume}},
    pages = {${pages}},
    doi = {${doi}}
}`
    return bibtex
}

const refs = yaml.parse(await FileSystem.read(`${FileSystem.thisFolder}/../nicknamed.yaml`))
for (let each of refs) {
    if (each.doi) {
        const data = await openAlexDataFromDoi(each.doi)
        console.log(openAlexToBibTexSometimes(data, each.nickname))
    }
}
// .then(
//     text=>{
//         const data = yaml.load(text)
//         const bibtex = data.references.map(each=>each.bibtex).join(`\n\n`)
//         FileSystem.write(`${Deno.cwd()}/data/risma.bib`, bibtex)
//     }
