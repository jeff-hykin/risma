#!/usr/bin/env -S deno run --allow-all
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, allKeys } from "https://deno.land/x/good@1.13.5.0/value.js"
import { run, Out, Stdout, Stderr, returnAsString } from "https://deno.land/x/quickr@0.6.54/main/run.js"
import { FileSystem } from "https://deno.land/x/quickr@0.6.56/main/file_system.js"
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
// import { Parser, parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.1.3.0/main.js"
// import html from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/html.js"

import { versionToList, versionSort } from "./misc.js"

import { DiscoveryMethod } from "./discovery_method.js"
import { Reference } from "./reference.js"

const refreshCacheEvery = 1 // days

export async function title2Doi(title) {
    const url = `https://search.crossref.org/search/works?q=${encodeURIComponent(title)}&from_ui=yes`
    const baseUrl = new URL(url).origin
    const getHref = (element)=>element.getAttribute("href").startsWith("/")?`${baseUrl}/${element.getAttribute("href")}`:element.getAttribute("href")
    let htmlResult
    try {
        htmlResult = await fetch(url).then(result=>result.text())
    } catch (error) {
        console.debug(`error when getting ${url} is:`,error)
        return null
    }
    const document = new DOMParser().parseFromString(
        htmlResult,
        "text/html",
    )
    const results =  [...document.querySelector("tbody").children]
    for (let each of results) {
        let titleElement = each.querySelector("p.lead")
        if (titleElement) {
            if (titleElement.innerText.trim().toLowerCase() == title.toLowerCase()) {
                const linksEl = each.querySelector("div.item-links")
                const doiHrefs = [...linksEl.querySelectorAll("a")].map(each=>getHref(each)).filter(each=>each.startsWith("https://doi.org/"))
                if (doiHrefs.length >= 1) {
                    return doiHrefs[0].replace("https://doi.org/","")
                }
            }
        }
    }
    return null
}

let outerCache = {}
export async function doiToCrossrefInfo(doi, { cacheObject, onUpdateCache=_=>0,}) {
    cacheObject = cacheObject||outerCache
    if (!cacheObject[doi]) {
        let url = `https://api.crossref.org/works/${doi}`
        const result = await fetch(url)
        if (result.ok) {
            let output = (await result.json()).message
            if (output instanceof Object) {
                cacheObject[doi] = output
                await onUpdateCache(doi)
            }
        } else {
            throw Error(`when fetching ${url} I got an error response`, result)
        }
    }
    return cacheObject[doi]
    // result.DOI
    // result.abstract
    // result.author[0].given // first name
    // result.author[0].family // last name
    // result.created["date-time"] // string timestamp
    // result.published["date-parts"] // string timestamp
    // result.title[0]
    // result["short-container-title"]
    // result["reference-count"]
    // {
    //     "status": "ok",
    //     "message-type": "work",
    //     "message-version": "1.0.0",
    //     "message": {
    //         "indexed": {
    //             "date-parts": [
    //                 [
    //                     2023,
    //                     9,
    //                     3
    //                 ]
    //             ],
    //             "date-time": "2023-09-03T04:57:00Z",
    //             "timestamp": 1693717020763
    //         },
    //         "reference-count": 60,
    //         "publisher": "Hindawi Limited",
    //         "license": [
    //             {
    //                 "start": {
    //                     "date-parts": [
    //                         [
    //                             2014,
    //                             1,
    //                             1
    //                         ]
    //                     ],
    //                     "date-time": "2014-01-01T00:00:00Z",
    //                     "timestamp": 1388534400000
    //                 },
    //                 "content-version": "unspecified",
    //                 "delay-in-days": 0,
    //                 "URL": "http://creativecommons.org/licenses/by/3.0/"
    //             }
    //         ],
    //         "funder": [
    //             {
    //                 "name": "ITMS 26240120020-Establishment of the Centre for the Research on Composite Materials for Structural Engineering and Medical Applications-CEKOMAT II.",
    //                 "award": [
    //                     "VEGA 2/0084/10",
    //                     "APVV-0523-10"
    //                 ]
    //             }
    //         ],
    //         "content-domain": {
    //             "domain": [],
    //             "crossmark-restriction": false
    //         },
    //         "short-container-title": [
    //             "BioMed Research International"
    //         ],
    //         "published-print": {
    //             "date-parts": [
    //                 [
    //                     2014
    //                 ]
    //             ]
    //         },
    //         "abstract": "<jats:p>This study investigated the influence of chronic crowding stress on nitric oxide (NO) production, vascular function and oxidative status in young Wistar-Kyoto (WKY), borderline hypertensive (BHR) and spontaneously hypertensive (SHR) female rats. Five-week old rats were exposed to crowding for two weeks. Crowding elevated plasma corticosterone<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" id=\"M1\"><mml:mo stretchy=\"false\">(</mml:mo><mml:mi>P</mml:mi><mml:mo>&lt;</mml:mo><mml:mn>0.05</mml:mn><mml:mo stretchy=\"false\">)</mml:mo></mml:math>and accelerated BP (<mml:math xmlns:mml=\"http://www.w3.org/1998/Math/MathML\" id=\"M2\"><mml:mi>P</mml:mi><mml:mo>&lt;</mml:mo><mml:mn>0.01</mml:mn></mml:math>versus basal) only in BHR. NO production and superoxide concentration were significantly higher in the aortas of control BHR and SHR versus WKY. Total acetylcholine (ACh)-induced relaxation in the femoral artery was reduced in control SHR versus WKY and BHR, and stress did not affect it significantly in any genotype. The attenuation of ACh-induced relaxation in SHR versus WKY was associated with reduction of its NO-independent component. Crowding elevated NO production in all strains investigated but superoxide concentration was increased only in WKY, which resulted in reduced NO-dependent relaxation in WKY. In crowded BHR and SHR, superoxide concentration was either unchanged or reduced, respectively, but NO-dependent relaxation was unchanged in both BHR and SHR versus their respective control group. This study points to genotype-related differences in stress vulnerability in young female rats. The most pronounced negative influence of stress was observed in BHR despite preserved endothelial function.</jats:p>",
    //         "DOI": "10.1155/2014/413629",
    //         "type": "journal-article",
    //         "created": {
    //             "date-parts": [
    //                 [
    //                     2014,
    //                     3,
    //                     9
    //                 ]
    //             ],
    //             "date-time": "2014-03-09T09:21:03Z",
    //             "timestamp": 1394356863000
    //         },
    //         "page": "1-11",
    //         "source": "Crossref",
    //         "is-referenced-by-count": 17,
    //         "title": [
    //             "Genotype-Related Effect of Crowding Stress on Blood Pressure and Vascular Function in Young Female Rats"
    //         ],
    //         "prefix": "10.1155",
    //         "volume": "2014",
    //         "author": [
    //             {
    //                 "ORCID": "http://orcid.org/0000-0001-9757-3283",
    //                 "authenticated-orcid": true,
    //                 "given": "Peter",
    //                 "family": "Slezak",
    //                 "sequence": "first",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "given": "Angelika",
    //                 "family": "Puzserova",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "given": "Peter",
    //                 "family": "Balis",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "given": "Natalia",
    //                 "family": "Sestakova",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "ORCID": "http://orcid.org/0000-0001-8748-4279",
    //                 "authenticated-orcid": true,
    //                 "given": "Miroslava",
    //                 "family": "Majzunova",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "given": "Ima",
    //                 "family": "Dovinova",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "given": "Michal",
    //                 "family": "Kluknavsky",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "ORCID": "http://orcid.org/0000-0002-6120-706X",
    //                 "authenticated-orcid": true,
    //                 "given": "Iveta",
    //                 "family": "Bernatova",
    //                 "sequence": "additional",
    //                 "affiliation": [
    //                     {
    //                         "name": "Institute of Normal and Pathological Physiology, Centre of Excellence for Examination of Regulatory Role of Nitric Oxide in Civilization Diseases, Slovak Academy of Sciences, Sienkiewiczova 1, 813 71 Bratislava, Slovakia"
    //                     }
    //                 ]
    //             }
    //         ],
    //         "member": "98",
    //         "reference": [
    //             {
    //                 "issue": "4",
    //                 "key": "1",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "141",
    //                 "DOI": "10.1080/08964280209596039",
    //                 "volume": "27",
    //                 "year": "2002",
    //                 "journal-title": "Behavioral Medicine"
    //             },
    //             {
    //                 "key": "2",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.brainresbull.2003.12.001"
    //             },
    //             {
    //                 "key": "3",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/S0140-6736(04)17019-0"
    //             },
    //             {
    //                 "key": "4",
    //                 "first-page": "1",
    //                 "volume-title": "Introduction to cardiovascular disease, stress and adaptation",
    //                 "year": "2012"
    //             },
    //             {
    //                 "key": "5",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1111/j.1440-1681.2008.04904.x"
    //             },
    //             {
    //                 "key": "6",
    //                 "first-page": "273",
    //                 "volume-title": "The causal role of chronic mental stress in the pathogenesis of essential hypertension",
    //                 "year": "2012"
    //             },
    //             {
    //                 "key": "7",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1186/1471-2458-8-357"
    //             },
    //             {
    //                 "key": "8",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1038/jhh.2008.74"
    //             },
    //             {
    //                 "key": "9",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1007/s10571-011-9768-0"
    //             },
    //             {
    //                 "issue": "4",
    //                 "key": "10",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "1227",
    //                 "DOI": "10.1152/physrev.1999.79.4.1227",
    //                 "volume": "79",
    //                 "year": "1999",
    //                 "journal-title": "Physiological Reviews"
    //             },
    //             {
    //                 "key": "11",
    //                 "first-page": "S9",
    //                 "volume": "61",
    //                 "year": "2012",
    //                 "journal-title": "Physiological Research"
    //             },
    //             {
    //                 "key": "12",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1042/CS20050271"
    //             },
    //             {
    //                 "issue": "3",
    //                 "key": "13",
    //                 "first-page": "367",
    //                 "volume": "50",
    //                 "year": "1999",
    //                 "journal-title": "Journal of Physiology and Pharmacology"
    //             },
    //             {
    //                 "issue": "1",
    //                 "key": "14",
    //                 "first-page": "67",
    //                 "volume": "52",
    //                 "year": "2003",
    //                 "journal-title": "Physiological Research"
    //             },
    //             {
    //                 "key": "15",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "331",
    //                 "volume": "16",
    //                 "year": "2013",
    //                 "journal-title": "Stress",
    //                 "DOI": "10.3109/10253890.2012.725116"
    //             },
    //             {
    //                 "key": "16",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1023/A:1016627224865"
    //             },
    //             {
    //                 "key": "17",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1007/s00424-011-1022-6"
    //             },
    //             {
    //                 "issue": "5",
    //                 "key": "18",
    //                 "first-page": "667",
    //                 "volume": "56",
    //                 "year": "2007",
    //                 "journal-title": "Physiological Research"
    //             },
    //             {
    //                 "issue": "6",
    //                 "key": "19",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "854",
    //                 "DOI": "10.1161/01.HYP.26.6.854",
    //                 "volume": "26",
    //                 "year": "1995",
    //                 "journal-title": "Hypertension"
    //             },
    //             {
    //                 "key": "20",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1080/10253890802234168"
    //             },
    //             {
    //                 "issue": "2",
    //                 "key": "21",
    //                 "first-page": "103",
    //                 "volume": "59",
    //                 "year": "2008",
    //                 "journal-title": "Journal of Physiology and Pharmacology"
    //             },
    //             {
    //                 "key": "22",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.physbeh.2009.05.011"
    //             },
    //             {
    //                 "key": "23",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1097/01.hjh.0000358834.18311.fc"
    //             },
    //             {
    //                 "key": "24",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/S0008-6363(01)00508-9"
    //             },
    //             {
    //                 "key": "25",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "897",
    //                 "volume": "2",
    //                 "year": "2010",
    //                 "journal-title": "Health",
    //                 "DOI": "10.4236/health.2010.28133"
    //             },
    //             {
    //                 "key": "26",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.biopsycho.2004.11.009"
    //             },
    //             {
    //                 "key": "27",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1007/s10517-007-0043-9"
    //             },
    //             {
    //                 "key": "29",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.niox.2011.12.008"
    //             },
    //             {
    //                 "key": "30",
    //                 "first-page": "73",
    //                 "volume-title": "Measurement of vascular reactive oxygen species production by chemiluminescence",
    //                 "year": "2005"
    //             },
    //             {
    //                 "issue": "4",
    //                 "key": "31",
    //                 "first-page": "405",
    //                 "volume": "13",
    //                 "year": "1995",
    //                 "journal-title": "Journal of Hypertension"
    //             },
    //             {
    //                 "key": "32",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "2611",
    //                 "volume": "38",
    //                 "year": "2013",
    //                 "journal-title": "Psychoneuroendocrinology",
    //                 "DOI": "10.1016/j.psyneuen.2013.06.014"
    //             },
    //             {
    //                 "key": "33",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.appet.2012.02.046"
    //             },
    //             {
    //                 "key": "34",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "217",
    //                 "volume": "177",
    //                 "year": "2013",
    //                 "journal-title": "Autonomic Neuroscience",
    //                 "DOI": "10.1016/j.autneu.2013.05.001"
    //             },
    //             {
    //                 "key": "35",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "142",
    //                 "volume": "246",
    //                 "year": "2013",
    //                 "journal-title": "Neuroscience",
    //                 "DOI": "10.1016/j.neuroscience.2013.04.052"
    //             },
    //             {
    //                 "key": "36",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1186/1744-9081-7-11"
    //             },
    //             {
    //                 "key": "37",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1113/jphysiol.2007.141580"
    //             },
    //             {
    //                 "key": "38",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.nlm.2008.07.001"
    //             },
    //             {
    //                 "key": "39",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.3109/10253890.2011.586446"
    //             },
    //             {
    //                 "issue": "3",
    //                 "key": "40",
    //                 "first-page": "487",
    //                 "volume": "58",
    //                 "year": "2007",
    //                 "journal-title": "Journal of Physiology and Pharmacology"
    //             },
    //             {
    //                 "key": "41",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1152/ajpregu.00095.2008"
    //             },
    //             {
    //                 "key": "42",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1113/expphysiol.2010.055970"
    //             },
    //             {
    //                 "issue": "5",
    //                 "key": "43",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "R527",
    //                 "DOI": "10.1152/ajpregu.1985.249.5.R527",
    //                 "volume": "249",
    //                 "year": "1985",
    //                 "journal-title": "American Journal of Physiology—Regulatory Integrative and Comparative Physiology"
    //             },
    //             {
    //                 "key": "44",
    //                 "first-page": "111",
    //                 "volume": "116",
    //                 "year": "2002",
    //                 "journal-title": "Indian Journal of Medical Research"
    //             },
    //             {
    //                 "key": "45",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/0031-9384(96)00020-0"
    //             },
    //             {
    //                 "key": "46",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1007/s00467-011-1928-4"
    //             },
    //             {
    //                 "key": "47",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1155/2013/427640"
    //             },
    //             {
    //                 "key": "48",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.jacc.2005.03.068"
    //             },
    //             {
    //                 "key": "49",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1074/jbc.271.39.23928"
    //             },
    //             {
    //                 "key": "50",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1007/s00424-010-0797-1"
    //             },
    //             {
    //                 "key": "51",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1016/j.physbeh.2011.09.017"
    //             },
    //             {
    //                 "key": "52",
    //                 "first-page": "615",
    //                 "volume": "62",
    //                 "year": "2013",
    //                 "journal-title": "Physiological Research"
    //             },
    //             {
    //                 "key": "53",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "233",
    //                 "volume": "16",
    //                 "year": "2013",
    //                 "journal-title": "Stress",
    //                 "DOI": "10.3109/10253890.2012.719052"
    //             },
    //             {
    //                 "issue": "1",
    //                 "key": "54",
    //                 "first-page": "53",
    //                 "volume": "46",
    //                 "year": "2009",
    //                 "journal-title": "Indian Journal of Biochemistry and Biophysics"
    //             },
    //             {
    //                 "key": "61",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1161/01.RES.0000082524.34487.31"
    //             },
    //             {
    //                 "key": "55",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1124/pr.59.3.3"
    //             },
    //             {
    //                 "issue": "6",
    //                 "key": "56",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "R1719",
    //                 "DOI": "10.1152/ajpregu.2001.280.6.R1719",
    //                 "volume": "280",
    //                 "year": "2001",
    //                 "journal-title": "American Journal of Physiology—Regulatory Integrative and Comparative Physiology"
    //             },
    //             {
    //                 "key": "59"
    //             },
    //             {
    //                 "issue": "4",
    //                 "key": "60",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "393",
    //                 "DOI": "10.1161/01.HYP.12.4.393",
    //                 "volume": "12",
    //                 "year": "1988",
    //                 "journal-title": "Hypertension"
    //             },
    //             {
    //                 "key": "57",
    //                 "doi-asserted-by": "crossref",
    //                 "first-page": "341",
    //                 "volume": "78",
    //                 "year": "2013",
    //                 "journal-title": "Steroids",
    //                 "DOI": "10.1016/j.steroids.2012.11.018"
    //             },
    //             {
    //                 "key": "58",
    //                 "doi-asserted-by": "publisher",
    //                 "DOI": "10.1097/00004872-200309000-00019"
    //             }
    //         ],
    //         "container-title": [
    //             "BioMed Research International"
    //         ],
    //         "original-title": [],
    //         "language": "en",
    //         "link": [
    //             {
    //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.pdf",
    //                 "content-type": "application/pdf",
    //                 "content-version": "vor",
    //                 "intended-application": "text-mining"
    //             },
    //             {
    //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.xml",
    //                 "content-type": "application/xml",
    //                 "content-version": "vor",
    //                 "intended-application": "text-mining"
    //             },
    //             {
    //                 "URL": "http://downloads.hindawi.com/journals/bmri/2014/413629.pdf",
    //                 "content-type": "unspecified",
    //                 "content-version": "vor",
    //                 "intended-application": "similarity-checking"
    //             }
    //         ],
    //         "deposited": {
    //             "date-parts": [
    //                 [
    //                     2019,
    //                     8,
    //                     8
    //                 ]
    //             ],
    //             "date-time": "2019-08-08T08:38:00Z",
    //             "timestamp": 1565253480000
    //         },
    //         "score": 1,
    //         "resource": {
    //             "primary": {
    //                 "URL": "http://www.hindawi.com/journals/bmri/2014/413629/"
    //             }
    //         },
    //         "subtitle": [],
    //         "short-title": [],
    //         "issued": {
    //             "date-parts": [
    //                 [
    //                     2014
    //                 ]
    //             ]
    //         },
    //         "references-count": 60,
    //         "alternative-id": [
    //             "413629",
    //             "413629"
    //         ],
    //         "URL": "http://dx.doi.org/10.1155/2014/413629",
    //         "relation": {},
    //         "ISSN": [
    //             "2314-6133",
    //             "2314-6141"
    //         ],
    //         "issn-type": [
    //             {
    //                 "value": "2314-6133",
    //                 "type": "print"
    //             },
    //             {
    //                 "value": "2314-6141",
    //                 "type": "electronic"
    //             }
    //         ],
    //         "subject": [
    //             "General Immunology and Microbiology",
    //             "General Biochemistry, Genetics and Molecular Biology",
    //             "General Medicine"
    //         ],
    //         "published": {
    //             "date-parts": [
    //                 [
    //                     2014
    //                 ]
    //             ]
    //         }
    //     }
    // }
}

export const searchOptions = {
    "scholar": {
        "base": "https://scholar.google.com/scholar",
        searchStringToParams(string) {
            // https://scholar.google.com/scholar?q=imagination+based+affordance+recognition&btnG=
            return "?q="+encodeURIComponent(string)
        },
        // example results for for function below:
        // [
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
        //         Reference {
        //             title: "Affordance-Based Goal Imagination for Embodied AI Agents",
        //             possibleYear: "2024",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "V Aregbede", "SS Abraham", "A Persson…�" ],
        //             pdfLink: "https://scholar.google.com/https://ieeexplore.ieee.org/iel8/10644131/10644157/10644764.pdf",
        //             link: "https://scholar.google.com/https://ieeexplore.ieee.org/abstract/document/10644764/",
        //             citationId: null,
        //             multiArticleId: null,
        //             citedByLink: null,
        //             publisherInfo: " …�on Development and�…, 2024 "
        //         },
        //         Reference {
        //             title: "Affordance-based Generation of Pretend Object Interaction Variants For Human-Computer Improvisational Theater.",
        //             possibleYear: "2019",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "M Jacob", "P Chawla", "L Douglas", "Z He", "J Lee…�" ],
        //             pdfLink: "https://scholar.google.com/https://computationalcreativity.net/iccc2019/papers/iccc19-paper-53.pdf",
        //             link: "https://scholar.google.com/https://computationalcreativity.net/iccc2019/papers/iccc19-paper-53.pdf",
        //             citationId: "1507682225119270119",
        //             multiArticleId: "1507682225119270119",
        //             citedByLink: "https://scholar.google.com//scholar?cites=1507682225119270119&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " ICCC, 2019 "
        //         },
        //         Reference {
        //             title: "Learning to anticipate egocentric actions by imagination",
        //             possibleYear: "2020",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "Y Wu", "L Zhu", "X Wang", "Y Yang…�" ],
        //             pdfLink: "https://scholar.google.com/https://ieeexplore.ieee.org/iel7/83/9263394/09280353.pdf",
        //             link: "https://scholar.google.com/https://ieeexplore.ieee.org/abstract/document/9280353/",
        //             citationId: "6012752103031775791",
        //             multiArticleId: "6012752103031775791",
        //             citedByLink: "https://scholar.google.com//scholar?cites=6012752103031775791&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " IEEE Transactions on�…, 2020 "
        //         },
        //         Reference {
        //             title: "Imagine that! Leveraging emergent affordances for 3d tool synthesis",
        //             possibleYear: "2019",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "Y Wu", "S Kasewa", "O Groth", "S Salter", "L Sun…�" ],
        //             pdfLink: "https://scholar.google.com/https://arxiv.org/pdf/1909.13561",
        //             link: "https://scholar.google.com/https://arxiv.org/abs/1909.13561",
        //             citationId: "1893778644382906900",
        //             multiArticleId: "1893778644382906900",
        //             citedByLink: "https://scholar.google.com//scholar?cites=1893778644382906900&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " arXiv preprint arXiv�…, 2019 "
        //         },
        //         Reference {
        //             title: "Imagine that! leveraging emergent affordances for tool synthesis in reaching tasks",
        //             possibleYear: "2019",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "Y Wu", "S Kasewa", "O Groth", "S Salter", "L Sun", "OP Jones…" ],
        //             pdfLink: "https://scholar.google.com/https://openreview.net/pdf?id=BkeyOxrYwH",
        //             link: "https://scholar.google.com/https://openreview.net/forum?id=BkeyOxrYwH",
        //             citationId: "2961549995427504858",
        //             multiArticleId: null,
        //             citedByLink: "https://scholar.google.com//scholar?cites=2961549995427504858&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " 2019 "
        //         },
        //         Reference {
        //             title: "Designing to support reasoned imagination through embodied metaphor",
        //             possibleYear: "2009",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "AN Antle", "G Corness", "S Bakker", "M Droumeva…�" ],
        //             pdfLink: "https://scholar.google.com/https://dl.acm.org/doi/pdf/10.1145/1640233.1640275",
        //             link: "https://scholar.google.com/https://dl.acm.org/doi/abs/10.1145/1640233.1640275",
        //             citationId: "2411282799326683271",
        //             multiArticleId: "2411282799326683271",
        //             citedByLink: "https://scholar.google.com//scholar?cites=2411282799326683271&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " Proceedings of the�…, 2009 "
        //         },
        //         Reference {
        //             title: "Is that a chair? imagining affordances using simulations of an articulated human body",
        //             possibleYear: "2020",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "H Wu", "D Misra", "GS Chirikjian�" ],
        //             pdfLink: "https://scholar.google.com/https://ieeexplore.ieee.org/iel7/9187508/9196508/09197384.pdf",
        //             link: "https://scholar.google.com/https://ieeexplore.ieee.org/abstract/document/9197384/",
        //             citationId: "17460003043367084993",
        //             multiArticleId: "17460003043367084993",
        //             citedByLink: "https://scholar.google.com//scholar?cites=17460003043367084993&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " 2020 IEEE international�…, 2020 "
        //         },
        //         Reference {
        //             title: "Understanding effects of observing affordance-driven action during motor imagery through EEG analysis",
        //             possibleYear: "2024",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "S Bordoloi", "CN Gupta", "SM Hazarika�" ],
        //             pdfLink: null,
        //             link: "https://scholar.google.com/https://link.springer.com/article/10.1007/s00221-024-06912-w",
        //             citationId: null,
        //             multiArticleId: "679006825711270763",
        //             citedByLink: null,
        //             publisherInfo: " Experimental Brain Research, 2024 "
        //         },
        //         Reference {
        //             title: "Rethinking affordance",
        //             possibleYear: "2019",
        //             notesConsideredRelevent: null,
        //             notesCustomKeywords: [],
        //             notesComment: null,
        //             notesWasRelatedTo: [],
        //             notesIsCitedByTitles: [],
        //             notesCites: [],
        //             discoveryMethod: undefined,
        //             authorNames: [ "A Scarlett", "M Zeilinger�" ],
        //             pdfLink: "https://scholar.google.com/https://rke.abertay.ac.uk/files/17329869/Zeilinger_RethinkingAffordance_Published_2019.pdf",
        //             link: "https://scholar.google.com/https://rke.abertay.ac.uk/files/17329869/Zeilinger_RethinkingAffordance_Published_2019.pdf",
        //             citationId: "7525425764402934640",
        //             multiArticleId: "7525425764402934640",
        //             citedByLink: "https://scholar.google.com//scholar?cites=7525425764402934640&as_sdt=5,44&sciodt=0,44&hl=en&oe=ASCII",
        //             publisherInfo: " Media Theory, 2019 "
        //         }
        //     ]
        async urlToListOfResults(url, discoveryMethod) {
            let htmlResult
            const baseUrl = new URL(url).origin
            const getHref = (element)=>element.getAttribute("href").startsWith("/")?`${baseUrl}/${element.getAttribute("href")}`:element.getAttribute("href")
            try {
                htmlResult = await fetch(new URL(url)).then(result=>result.text())
            } catch (error) {
                console.debug(`error when getting ${url} is:`,error)
                return []
            }
            const document = new DOMParser().parseFromString(
                htmlResult,
                "text/html",
            )
            // 
            // pull article info
            // 
            let articles = []
            try {
                let links = [...document.querySelectorAll("h3 a")]
                for (let each of links) {
                    const title = each.innerText
                    const link = getHref(each)
                    const reference = new Reference({
                        title,
                        possibleYear: null,
                        notesConsideredRelevent: null,
                        notesCustomKeywords: [],
                        notesComment: null,
                        notesWasRelatedTo: [],
                        notesIsCitedByTitles: [],
                        notesCites: [],
                        // discoveryMethod,
                        authorNames: null,
                        pdfLink: null,
                        link,
                        citationId: null,
                        multiArticleId: null,
                        citedByLink: null,
                        publisherInfo: null,
                    })
                    // this is pretty slow so we do it in the background
                    title2Doi(title).then(doi=>{
                        if (doi) {
                            reference.doi = doi
                        }
                    }).catch(error=>{
                        // console.warn(`error getting doi for ${title}`,error)
                    })
                    articles.push(reference)
                }
                if (links.length > 0) {
                    // try to get main list
                    let parent = links[0].parentElement
                    while (parent && parent != document.body) {
                        // found parent as soon as it captures all children
                        if ([...parent.querySelectorAll("h3 a")].length == links.length) {
                            break
                        }
                        parent = parent.parentElement
                    }
                    const articlesElements = [...parent.children]
                    for (let eachArticleElement of articlesElements) {
                        let title
                        let articleObject
                        try {
                            title = eachArticleElement.querySelector("h3 a")?.innerText
                            articleObject = articles.filter(each=>each.title==title)[0]
                        } catch (error) {
                            console.warn(`    error getting article title for a child element`, error)
                        }
                        // ignore unknown thing
                        if (!articleObject) {
                            continue
                        }
                        
                        let articleLinks = [...eachArticleElement.querySelectorAll("a")]
                        for (let eachLinkElement of articleLinks) {
                            // 
                            // citationId
                            // 
                            if (eachLinkElement.innerText.startsWith("[PDF]") && eachLinkElement.innerHTML.startsWith("<span")) {
                                articleObject.pdfLink = getHref(eachLinkElement)
                            }

                            // 
                            // citationId
                            // 
                            if (eachLinkElement.innerText.startsWith("Cited by")) {
                                articleObject.citedByLink = getHref(eachLinkElement)
                                try {
                                    let url = new URL(getHref(eachLinkElement))
                                    let citationId
                                    if (citationId = url.searchParams.get("cites")) {
                                        articleObject.citationId = citationId
                                    }
                                } catch (error) {
                                    console.warn(error)
                                }
                            }
                            // 
                            // multiArticleId
                            // 
                            if (eachLinkElement.innerText.match(/\bAll \d+ versions\b/)) {
                                try {
                                    let url = new URL(getHref(eachLinkElement))
                                    let multiArticleId
                                    if (multiArticleId = url.searchParams.get("cluster")) {
                                        articleObject.multiArticleId = multiArticleId
                                    }
                                } catch (error) {
                                    console.warn(error)
                                }
                            }
                        }
                        // 
                        // year, authors, & publisherInfo
                        // 
                        try {
                            let titleElement = eachArticleElement.querySelector("h3")
                            if (titleElement) {
                                let probablyAuthorsElement = titleElement.nextElementSibling
                                if (probablyAuthorsElement && probablyAuthorsElement.innerText.match(/.+-.+-/)) {
                                    // let probablyAuthorLinks = [...probablyAuthorsElement.querySelectorAll("a")]
                                    let pieces = probablyAuthorsElement.innerText.replace(/…|�/g,"").split("-")
                                    let source = pieces.at(-1).trim()
                                    let publishInstanceInfo = pieces.at(-2)||""
                                    let authorInfoString = pieces.slice(0,-2).join("-") // join is just to be defensive, should be 1 item
                                    articleObject.authorNames = authorInfoString.split(",").map(each=>each.trim())
                                    let year
                                    // yep sadly this code will break in the year 2100
                                    if (year = publishInstanceInfo.match(/((?:20|19)(?:\d\d))/)) {
                                        articleObject.possibleYear = year[0]
                                    }
                                    if (publishInstanceInfo) {
                                        articleObject.publisherInfo = publishInstanceInfo.trim().replace(/�|…/g,"")
                                        if (articleObject.publisherInfo.match(/^(20|19)\d\d$/)) {
                                            articleObject.publisherInfo = null
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            console.warn(`issue getting year & author`, error)
                        }
                    }
                }
            } catch (error) {
                console.error(`Error while trying to extract links from search ${error}`)
            }
            return articles
            // let newArticlesFound = false
            // const existingArticleTitles = new Set(allData.activeSession.articles.map(each=>each.title))
            // let newArticles = []
            // for (let eachArticleObject of articles) {
            //     if (existingArticleTitles.has(eachArticleObject.title)) {
            //         continue
            //     }
            //     newArticlesFound = true
            //     newArticles.push(eachArticleObject)
            //     allData.activeSession.articles.push(eachArticleObject)
            // }
        },
    },
    // "science-direct": {
    // },
    
}