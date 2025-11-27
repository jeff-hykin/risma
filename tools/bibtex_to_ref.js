// import { Cite } from 'https://esm.sh/citation-js@0.7.20'
import { parse } from 'https://esm.sh/gh/jeff-hykin/academic_api@8b1de11/main/tools/cite_bundle.js'
import { indent } from 'https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/flattened/indent.js'
import { zipShort } from 'https://esm.sh/gh/jeff-hykin/good-js@1.18.2.0/source/flattened/zip_short.js'
import { normalizeDoiString } from "https://esm.sh/gh/jeff-hykin/academic_api@8b1de11/main/tools//doi_tools.js"
// import * as a from 'https://esm.sh/@citation-js/plugin-bibtex@0.7.18'

export const escapeBibtexString = (string)=>string.replace(/\s?\n|\n\s?/g," ").replace(/{/g,"{{").replace(/}/g,"}}")

/**
 * convert a bibtex string to a reference structure
 *
 * @example
 * ```js
 * // Your BibTeX data
 * var bibtex = `
 * @article{smith2020deep,
 *   title={Deep learning for citation parsing},
 *   author={Smith, John and Doe, Jane},
 *   journal={Journal of Citation Studies},
 *   volume={10},
 *   number={2},
 *   pages={123-145},
 *   year={2020},
 *   publisher={Citation Press}
 * }
 * @article{smith2021deep,
 *   title={Deep learning for citation parsing},
 *   author={Smith, John and Doe, Jane},
 *   journal={Journal of Citation Studies},
 *   volume={10},
 *   number={2},
 *   pages={123-145},
 *   year={2021},
 *   publisher={Citation Press}
 * }
 * `
 * const refStructure = bibtexToRefs(bibtex)
 * Deno.writeTextFileSync(
 *     "references.yaml",
 *     Yaml.stringify(
 *         refStructure
 *     )
 * )
 * ```
 */
export function bibtexToRef(bibtex) {
    const array = parse.bibtex.text(bibtex)
    const texts = bibtex.split(/^\s*(?=@)/gm).filter(each=>each.startsWith("@"))
    if (texts.length != array.length) {
        throw new Error(`bibtex content:${indent({string: bibtex})}\n\nThis is a problem with academic api library: when importing a bibtex file I try to match the parsed-data with the bibtex entry, but I got ${texts.length} entries, but the parsed data has ${array.length} entries. Bibtex data above`)
    }
    // [
    //     {
    //         type: "article",
    //         label: "smith2020deep",
    //         properties: {
    //         title: "Deep learning for citation parsing",
    //         author: "Smith, John and Doe, Jane",
    //         journal: "Journal of Citation Studies",
    //         volume: "10",
    //         number: "2",
    //         pages: "123-145",
    //         year: "2020",
    //         publisher: "Citation Press"
    //         }
    //     },
    //     {
    //         type: "article",
    //         label: "smith2021deep",
    //         properties: {
    //         title: "Deep learning for citation parsing",
    //         author: "Smith, John and Doe, Jane",
    //         journal: "Journal of Citation Studies",
    //         volume: "10",
    //         number: "2",
    //         pages: "123-145",
    //         year: "2021",
    //         publisher: "Citation Press"
    //         }
    //     }
    // ]
    return zipShort(array,texts).map(([each,text])=>{
        each.properties.type = each.type
        each.properties.label = each.label
        each = each.properties
        if (typeof each.year == "string" && each.year.match(/^\d{4}$/)) {
            each.year = parseInt(each.year)
        }
        if (each.author) {
            each.authorNames = each.author.split(" and ")
        }
        each.bibtex = text
        if (each.URL) {
            each.link = each.URL
            delete each.URL
        }
        if (each.url) {
            each.link = each.url
            delete each.url
        }
        if (each.DOI) {
            each.doi = each.DOI
            delete each.DOI
        }
        if (each.doi) {
            each.doi = normalizeDoiString(each.doi)
        }
        if (!each.link && each.doi) {
            each.link = `https://doi.org/${each.doi}`
        }
        return each
    })
}