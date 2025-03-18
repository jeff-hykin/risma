#!/usr/bin/env -S deno run --allow-all
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.13.5.0/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, allKeys } from "https://deno.land/x/good@1.13.5.0/value.js"
import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
// import { Parser, parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.1.3.0/main.js"
// import html from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/html.js"
import { toCamelCase } from "https://deno.land/x/good@1.13.5.0/flattened/to_camel_case.js"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import { openAlexDataFromDoi, getLinkedOpenAlexArticles } from "./citation_gather_tools/open_alex.js"
import { versionToList, versionSort } from "./misc.js"

import { DiscoveryMethod } from "./discovery_method.js"
import { Reference } from "./reference.js"

import { jsonFetch, createCachedJsonFetcher, createCachedTextFetcher } from "./citation_gather_tools/fetch_tools.js"

export const googleScholarFetcher = createCachedTextFetcher({
    cache: {},
    rateLimit: 15000, // google is picky and defensive
    onUpdateCache(url) {
       
    },
    urlNormalizer(url) {
        return new URL(url)
    }
})

export async function title2Doi(title, { cacheObject, onUpdateCache=_=>0,}={}) {
    cacheObject = cacheObject||title2Doi.cache
    if (cacheObject[title]) {
        return cacheObject[title]
    }
    const url = `https://search.crossref.org/search/works?q=${encodeURIComponent(title)}&from_ui=yes`
    const baseUrl = new URL(url).origin
    const getHref = (element)=>element.getAttribute("href").startsWith("/")?`${baseUrl}/${element.getAttribute("href")}`:element.getAttribute("href")
    let htmlResult
    try {
        let needToWait
        do {
            // avoid hitting rate limit
            const thresholdTime = title2Doi.lastFetchTime.getTime() + title2Doi.waitTime
            const now = new Date().getTime()
            needToWait = thresholdTime - now
            if (needToWait > 0) {
                await new Promise(r=>setTimeout(r, needToWait))
            }
        } while (needToWait > 0)
        title2Doi.lastFetchTime = new Date()
        htmlResult = await fetch(url).then(result=>result.text())
    } catch (error) {
        // console.debug(`error when getting ${url} is:`,error)
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
                    let output = doiHrefs[0].replace("https://doi.org/","")
                    cacheObject[title] = output
                    onUpdateCache(title)
                    return output
                }
            }
        }
    }
    return null
}
title2Doi.cache = {}
title2Doi.lastFetchTime = new Date()
title2Doi.waitTime = 100

export async function doiToCrossrefInfo(doi, { cacheObject, onUpdateCache=_=>0,}={}) {
    cacheObject = cacheObject||doiToCrossrefInfo.cache
    if (!cacheObject[doi]) {
        let needToWait
        do {
            // avoid hitting rate limit
            const thresholdTime = doiToCrossrefInfo.lastFetchTime.getTime() + doiToCrossrefInfo.waitTime
            const now = new Date().getTime()
            needToWait = thresholdTime - now
            if (needToWait > 0) {
                await new Promise(r=>setTimeout(r, needToWait))
            }
        } while (needToWait > 0)
        doiToCrossrefInfo.lastFetchTime = new Date()

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
doiToCrossrefInfo.cache = {}
doiToCrossrefInfo.lastFetchTime = new Date()
doiToCrossrefInfo.waitTime = 100


/**
 * @example
 * ```js
 * console.log(Object.keys((await getRelatedArticles({ doi: "10.1109/icra48891.2023.10161288" })).relatedArticles))
 * ```
 */
export async function getRelatedArticles(reference, onProgress) {
    onProgress = onProgress||(function(){})
    if (!reference.doi) {
        console.warn(`no doi for reference`, reference.name)
        return {discoveryMethod: {}, relatedArticles: {}}
    }
    const doi = reference.doi
    let relatedArticles = {}
    const openAlexData = reference?.accordingTo?.openAlex || (await openAlexDataFromDoi(doi))
    const discoveryMethod = new DiscoveryMethod({
        wasRelatedTo: reference.title,
        dateTime: new Date().toISOString(),
        searchEngine: "openAlex",
    })
    const relatedIds = ((openAlexData.related_works||openAlexData.relatedAlexIds)||[]).concat((openAlexData.referenced_works||openAlexData.citedAlexIds)||[])
    // bulk request all related articles
    const { citedBy, cites } = await getLinkedOpenAlexArticles(openAlexData.id.replace("https://openalex.org/",""))
    for (let each of citedBy.concat(cites)) {
        if (!relatedArticles[each.title]) {
            relatedArticles[each.title] = new Reference()
            relatedArticles[each.title].discoveryMethod = { dateTime: discoveryMethod.dateTime, originallyWasRelatedTo: discoveryMethod.title, searchEngine: discoveryMethod.searchEngine }
        }
        relatedArticles[each.title].accordingTo = relatedArticles[each.title].accordingTo || {}
        relatedArticles[each.title].accordingTo.openAlex = openAlexToSimpleFormat(each)
    }
    const output = {discoveryMethod,relatedArticles}
    return output
}

export function crossrefToSimpleFormat(crossrefData) {
    return {
        "doi": crossrefData.DOI,
        "title": (crossrefData.title||[]).at(-1) || (crossrefData["short-title"]||[]).at(-1),
        "subtitle": (crossrefData.subtitle||[]).at(-1),
        "abstract": crossrefData.abstract.replace(/<\/?jats:\w+>/g,"").trim().replace(/^Abstract\b/i,"").trim(),
        "year": crossrefData?.published?.["date-parts"]?.[0]?.[0] || crossrefData?.issued?.["date-parts"]?.[0]?.[0] || crossrefData?.indexed?.["date-parts"]?.[0]?.[0],
        "authorNames": crossrefData.author.map(author => author.given + " " + author.family),
        "link": crossrefData.URL,
        "pdfLink": crossrefData.link?.filter(each=>each.contentType=="application/pdf").map(each=>each.URL)[0],
        "citationCount": crossrefData["is-referenced-by-count"]-0,
        "citedDois": (crossrefData.reference||[]).map(each=>each.DOI).filter(each=>each),
    }
}

export function openAlexToSimpleFormat(each) {
    //     topics: [
    //         { id: "https://openalex.org/T10653", display_name: "Robot Manipulation and Learning", score: 0.9985, subfield: { id: "https://openalex.org/subfields/2207", display_name: "Control and Systems Engineering" }, field: { id: "https://openalex.org/fields/22", display_name: "Engineering" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //         { id: "https://openalex.org/T10531", display_name: "Advanced Vision and Imaging", score: 0.9978, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //         { id: "https://openalex.org/T12549", display_name: "Image and Object Detection Techniques", score: 0.9897, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
    //     ],
    //     keywords: [{ id: "https://openalex.org/keywords/affordance", display_name: "Affordance", score: 0.94692224 }],
    //     concepts: [
    //         { id: "https://openalex.org/C194995250", wikidata: "https://www.wikidata.org/wiki/Q531136", display_name: "Affordance", level: 2, score: 0.94692224 },
    //         { id: "https://openalex.org/C41008148", wikidata: "https://www.wikidata.org/wiki/Q21198", display_name: "Computer science", level: 0, score: 0.6867339 },
    //         { id: "https://openalex.org/C90509273", wikidata: "https://www.wikidata.org/wiki/Q11012", display_name: "Robot", level: 2, score: 0.6247663 },
    //         { id: "https://openalex.org/C107457646", wikidata: "https://www.wikidata.org/wiki/Q207434", display_name: "Human–computer interaction", level: 1, score: 0.59470433 },
    //         { id: "https://openalex.org/C154945302", wikidata: "https://www.wikidata.org/wiki/Q11660", display_name: "Artificial intelligence", level: 1, score: 0.49061385 },
    //     ],
    if (!each.title) {
        console.debug(`openAlexToSimpleFormat() got a reference that has no title:`,each)
    }
    return {
        doi: each.doi,
        title: each.title,
        abstract: each.abstract,
        concepts: [...new Set([ 
            ...(each.topics||[]).map(each=>each.display_name),
            ...(each.topics||[]).map(each=>each?.subfield?.display_name),
            ...(each.keywords||[]).map(each=>each.display_name),
            ...(each.concepts||[]).map(each=>each.display_name) 
        ].filter(each=>each).map(each=>each.toLowerCase()))],
        year: each.publication_year || each.created_date,
        authorNames: (each.authorships||[]).map(each=>each.author.display_name),
        link: each?.primary_location?.landing_page_url || (each.locations||[]).map(each=>each.landing_page_url).filter(each=>each)[0],
        pdfLink: each?.primary_location?.pdf_url || (each.locations||[]).map(each=>each.pdf_url).filter(each=>each)[0],
        citationCount: (each.counts_by_year||[]).map(each=>each.cited_by_count).reduce((a,b)=>(a-0)+(b-0),0),
        citedAlexIds: each.referenced_works,
        relatedAlexIds: each.related_works,
        openAlexId: each.id.replace("https://openalex.org/",""),
    }
}

let debugCount = 0
export const searchOptions = {
    "openAlex": {
        "base": "https://api.openalex.org/works",
        searchStringToParams(string) {
            return `?page=1&filter=default.search:${encodeURIComponent(string)}&sort=relevance_score:desc&per_page=10`
            // {
            // 	"results": [
            // 		{
            // 			"id": "https://openalex.org/W4383108856",
            // 			"short_id": "works/W4383108856",
            // 			"display_name": "Visual Affordance Prediction for Guiding Robot Exploration",
            // 			"hint": "Homanga Bharadhwaj, Abhinav Gupta, Shubham Tulsiani",
            // 			"cited_by_count": 8,
            // 			"works_count": null,
            // 			"entity_type": "work",
            // 			"external_id": "https://doi.org/10.1109/icra48891.2023.10161288",
            // 			"filter_key": "id"
            // 		},
            // 		{
            // 			"id": "https://openalex.org/W4378768585",
            // 			"short_id": "works/W4378768585",
            // 			"display_name": "Visual Affordance Prediction for Guiding Robot Exploration",
            // 			"hint": "Homanga Bharadhwaj, Abhinav Gupta, Shubham Tulsiani",
            // 			"cited_by_count": 0,
            // 			"works_count": null,
            // 			"entity_type": "work",
            // 			"external_id": "https://doi.org/10.48550/arxiv.2305.17783",
            // 			"filter_key": "id"
            // 		}
            // 	]
            // }
        },
        async urlToListOfResults(url) {

            const baseUrl = new URL(url).origin
            try {
                return jsonFetch(url).then(
                    json=>json.results.map(openAlexToSimpleFormat)
                        // each=>{
                        //     console.debug(`each is:`,each)
                        //     const output = {
                        //         title: each.display_name,
                        //     }
                        //     if (each.external_id.startsWith("https://doi.org/")) {
                        //         output.doi = each.external_id.replace("https://doi.org/","")
                        //     }
                        //     jsonFetch(each.id).then(each=>{
                        //         return Object.assign(output, openAlexToSimpleFormat(each))
                        //         // Object.assign(output, each)
                        //         // output.year = each.publication_year || each.created_date
                        //         // output.authorNames = each.authorships.map(each=>each.author.display_name)
                        //         // output.link = each.primary_location.landing_page_url || (each.locations||[]).map(each=>each.landing_page_url).filter(each=>each)[0]
                        //         // output.pdfLink = each.primary_location.pdf_url || (each.locations||[]).map(each=>each.pdf_url).filter(each=>each)[0]
                        //         // output.citationCount = (each.counts_by_year||[]).map(each=>each.cited_by_count).reduce((a,b)=>(a-0)+(b-0),0)

                        //         // {
                        //         //     id: "https://openalex.org/W4383108856",
                        //         //     doi: "https://doi.org/10.1109/icra48891.2023.10161288",
                        //         //     title: "Visual Affordance Prediction for Guiding Robot Exploration",
                        //         //     display_name: "Visual Affordance Prediction for Guiding Robot Exploration",
                        //         //     publication_year: 2023,
                        //         //     publication_date: "2023-05-29",
                        //         //     ids: { openalex: "https://openalex.org/W4383108856", doi: "https://doi.org/10.1109/icra48891.2023.10161288" },
                        //         //     language: "en",
                        //         //     primary_location: { is_oa: false, landing_page_url: "https://doi.org/10.1109/icra48891.2023.10161288", pdf_url: null, source: null, license: null, license_id: null, version: null, is_accepted: false, is_published: false },
                        //         //     type: "article",
                        //         //     type_crossref: "proceedings-article",
                        //         //     indexed_in: ["crossref"],
                        //         //     open_access: { is_oa: true, oa_status: "green", oa_url: "https://arxiv.org/pdf/2305.17783", any_repository_has_fulltext: true },
                        //         //     authorships: [
                        //         //         { author_position: "first", author: { id: "https://openalex.org/A5064794691", display_name: "Homanga Bharadhwaj", orcid: "https://orcid.org/0000-0001-5056-8516" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Homanga Bharadhwaj", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
                        //         //         { author_position: "middle", author: { id: "https://openalex.org/A5101761266", display_name: "Abhinav Gupta", orcid: "https://orcid.org/0000-0002-3646-2421" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Abhinav Gupta", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
                        //         //         { author_position: "last", author: { id: "https://openalex.org/A5029932788", display_name: "Shubham Tulsiani", orcid: "https://orcid.org/0000-0001-5651-9424" }, institutions: [{ id: "https://openalex.org/I74973139", display_name: "Carnegie Mellon University", ror: "https://ror.org/05x2bcf33", country_code: "US", type: "education", lineage: [Array] }], countries: ["US"], is_corresponding: false, raw_author_name: "Shubham Tulsiani", raw_affiliation_strings: ["Robotics Institute, Carnegie Mellon University"], affiliations: [{ raw_affiliation_string: "Robotics Institute, Carnegie Mellon University", institution_ids: [Array] }] },
                        //         //     ],
                        //         //     institution_assertions: [],
                        //         //     countries_distinct_count: 1,
                        //         //     institutions_distinct_count: 1,
                        //         //     corresponding_author_ids: [],
                        //         //     corresponding_institution_ids: [],
                        //         //     apc_list: null,
                        //         //     apc_paid: null,
                        //         //     fwci: 3.366,
                        //         //     has_fulltext: false,
                        //         //     cited_by_count: 8,
                        //         //     citation_normalized_percentile: { value: 0.620722, is_in_top_1_percent: false, is_in_top_10_percent: false },
                        //         //     cited_by_percentile_year: { min: 94, max: 95 },
                        //         //     biblio: { volume: null, issue: null, first_page: "3029", last_page: "3036" },
                        //         //     is_retracted: false,
                        //         //     is_paratext: false,
                        //         //     primary_topic: { id: "https://openalex.org/T10653", display_name: "Robot Manipulation and Learning", score: 0.9985, subfield: { id: "https://openalex.org/subfields/2207", display_name: "Control and Systems Engineering" }, field: { id: "https://openalex.org/fields/22", display_name: "Engineering" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
                        //         //     topics: [
                        //         //         { id: "https://openalex.org/T10653", display_name: "Robot Manipulation and Learning", score: 0.9985, subfield: { id: "https://openalex.org/subfields/2207", display_name: "Control and Systems Engineering" }, field: { id: "https://openalex.org/fields/22", display_name: "Engineering" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
                        //         //         { id: "https://openalex.org/T10531", display_name: "Advanced Vision and Imaging", score: 0.9978, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
                        //         //         { id: "https://openalex.org/T12549", display_name: "Image and Object Detection Techniques", score: 0.9897, subfield: { id: "https://openalex.org/subfields/1707", display_name: "Computer Vision and Pattern Recognition" }, field: { id: "https://openalex.org/fields/17", display_name: "Computer Science" }, domain: { id: "https://openalex.org/domains/3", display_name: "Physical Sciences" } },
                        //         //     ],
                        //         //     keywords: [{ id: "https://openalex.org/keywords/affordance", display_name: "Affordance", score: 0.94692224 }],
                        //         //     concepts: [
                        //         //         { id: "https://openalex.org/C194995250", wikidata: "https://www.wikidata.org/wiki/Q531136", display_name: "Affordance", level: 2, score: 0.94692224 },
                        //         //         { id: "https://openalex.org/C41008148", wikidata: "https://www.wikidata.org/wiki/Q21198", display_name: "Computer science", level: 0, score: 0.6867339 },
                        //         //         { id: "https://openalex.org/C90509273", wikidata: "https://www.wikidata.org/wiki/Q11012", display_name: "Robot", level: 2, score: 0.6247663 },
                        //         //         { id: "https://openalex.org/C107457646", wikidata: "https://www.wikidata.org/wiki/Q207434", display_name: "Human–computer interaction", level: 1, score: 0.59470433 },
                        //         //         { id: "https://openalex.org/C154945302", wikidata: "https://www.wikidata.org/wiki/Q11660", display_name: "Artificial intelligence", level: 1, score: 0.49061385 },
                        //         //     ],
                        //         //     mesh: [],
                        //         //     locations_count: 2,
                        //         //     locations: [
                        //         //         { is_oa: false, landing_page_url: "https://doi.org/10.1109/icra48891.2023.10161288", pdf_url: null, source: null, license: null, license_id: null, version: null, is_accepted: false, is_published: false },
                        //         //         { is_oa: true, landing_page_url: "https://arxiv.org/abs/2305.17783", pdf_url: "https://arxiv.org/pdf/2305.17783", source: { id: "https://openalex.org/S4306400194", display_name: "arXiv (Cornell University)", issn_l: null, issn: null, is_oa: true, is_in_doaj: false, is_core: false, host_organization: "https://openalex.org/I205783295", host_organization_name: "Cornell University", host_organization_lineage: ["https://openalex.org/I205783295"], host_organization_lineage_names: ["Cornell University"], type: "repository" }, license: null, license_id: null, version: "submittedVersion", is_accepted: false, is_published: false },
                        //         //     ],
                        //         //     best_oa_location: { is_oa: true, landing_page_url: "https://arxiv.org/abs/2305.17783", pdf_url: "https://arxiv.org/pdf/2305.17783", source: { id: "https://openalex.org/S4306400194", display_name: "arXiv (Cornell University)", issn_l: null, issn: null, is_oa: true, is_in_doaj: false, is_core: false, host_organization: "https://openalex.org/I205783295", host_organization_name: "Cornell University", host_organization_lineage: ["https://openalex.org/I205783295"], host_organization_lineage_names: ["Cornell University"], type: "repository" }, license: null, license_id: null, version: "submittedVersion", is_accepted: false, is_published: false },
                        //         //     sustainable_development_goals: [],
                        //         //     grants: [],
                        //         //     datasets: [],
                        //         //     versions: [],
                        //         //     referenced_works_count: 43,
                        //         //     referenced_works: ["https://openalex.org/W1524842461", "https://openalex.org/W1933657216", "https://openalex.org/W1960578971", "https://openalex.org/W2032293070", "https://openalex.org/W2188365844", "https://openalex.org/W2201912979", "https://openalex.org/W2612034718", "https://openalex.org/W2625366777", "https://openalex.org/W2823112946", "https://openalex.org/W2895453875", "https://openalex.org/W2908390575", "https://openalex.org/W2952716587", "https://openalex.org/W2953469440", "https://openalex.org/W2962770929", "https://openalex.org/W2962785568", "https://openalex.org/W2962793481", "https://openalex.org/W2962793652", "https://openalex.org/W2963049618", "https://openalex.org/W2963073614", "https://openalex.org/W2963523627", "https://openalex.org/W2963799213", "https://openalex.org/W2964067469", "https://openalex.org/W2980216391", "https://openalex.org/W2983465317", "https://openalex.org/W3003651690", "https://openalex.org/W3006227479", "https://openalex.org/W3032077725", "https://openalex.org/W3034445277", "https://openalex.org/W3035574324", "https://openalex.org/W3035622854", "https://openalex.org/W3035717769", "https://openalex.org/W3089793705", "https://openalex.org/W3104898494", "https://openalex.org/W3120441392", "https://openalex.org/W3180355996", "https://openalex.org/W3207837114", "https://openalex.org/W3207908209", "https://openalex.org/W4287251598", "https://openalex.org/W4287686848", "https://openalex.org/W4287994983", "https://openalex.org/W4288349972", "https://openalex.org/W4300799055", "https://openalex.org/W4301206121"],
                        //         //     related_works: ["https://openalex.org/W4391375266", "https://openalex.org/W3089455568", "https://openalex.org/W3049116993", "https://openalex.org/W2899084033", "https://openalex.org/W2748952813", "https://openalex.org/W2417026147", "https://openalex.org/W2346831895", "https://openalex.org/W2248634132", "https://openalex.org/W1972718289", "https://openalex.org/W1791514435"],
                        //         //     abstract_inverted_index: { Motivated: [0], by: [1], the: [2, 8, 14, 66, 85, 105, 115, 120, 125, 130], intuitive: [3], understanding: [4, 22], humans: [5], have: [6], about: [7], space: [9, 67], of: [10, 39, 68, 124], possible: [11], "interactions,": [12], and: [13, 74, 99, 103, 122, 127], ease: [15], with: [16, 56, 71], which: [17], they: [18], can: [19, 51, 94, 134], generalize: [20], this: [21], to: [23, 79, 111], previously: [24], unseen: [25], "scenes,": [26], we: [27, 42, 64], develop: [28], an: [29, 36], approach: [30], for: [31, 137], learning: [32, 144], "'visual": [33], "affordances'.": [34], Given: [35], input: [37], image: [38], a: [40, 44, 72, 76, 81], "scene,": [41], infer: [43], distribution: [45, 83], over: [46], plausible: [47, 62], future: [48], states: [49], that: [50, 91, 104], be: [52, 95, 135], achieved: [53], via: [54], interactions: [55], "it.": [57], To: [58], allow: [59], predicting: [60], diverse: [61, 100, 112], "futures,": [63], discretize: [65], continuous: [69], images: [70], "VQ-VAE": [73], use: [75], "Transformer-based": [77], model: [78, 133], learn: [80], conditional: [82], in: [84, 145], latent: [86], embedding: [87], "space.": [88], We: [89, 118], show: [90], these: [92], models: [93, 107], trained: [96, 131], using: [97], "large-scale": [98], passive: [101], "data,": [102], learned: [106], exhibit: [108], compositional: [109], generalization: [110], objects: [113], beyond: [114], training: [116], "distribution.": [117], evaluate: [119], quality: [121], diversity: [123], "generations,": [126], demonstrate: [128], how: [129], affordance: [132], used: [136], guiding: [138], exploration: [139], during: [140], visual: [141], "goal-conditioned": [142], policy: [143], robotic: [146], "manipulation.": [147] },
                        //         //     cited_by_api_url: "https://api.openalex.org/works?filter=cites:W4383108856",
                        //         //     counts_by_year: [{ year: 2024, cited_by_count: 8 }],
                        //         //     updated_date: "2024-12-13T13:55:24.466451",
                        //         //     created_date: "2023-07-05",
                        //         // }
                        //     }).catch(error=>{
                        //         console.warn(`getting extra data from open alex ${each.id}`,error)
                        //     })
                        //     return output
                        // }
                ).catch(error=>{
                    console.debug(`error when getting ${url} is:`,error)
                    return []
                })
            } catch (error) {
                console.debug(`error when getting ${url} is:`,error)
                return []
            }
        },
    },
    "googleScholar": {
        "base": "https://scholar.google.com/scholar",
        searchStringToParams(string) {
            // https://scholar.google.com/scholar?q=imagination+based+affordance+recognition&btnG=
            return "?q="+encodeURIComponent(string)
        },
        // example results for for function below:
        // [
        //         Reference {
        //             title: "RAIL: Robot Affordance Imagination with Large Language Models",
        //             year: "1936",
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
        //             year: "2024",
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
        //             year: "2019",
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
        //             year: "2020",
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
        //             year: "2019",
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
        //             year: "2019",
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
        //             year: "2009",
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
        //             year: "2020",
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
        //             year: "2024",
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
        //             year: "2019",
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
        async urlToListOfResults(url) {
            let htmlResult
            const baseUrl = new URL(url).origin
            const getHref = (element)=>element.getAttribute("href").startsWith("/")?`${baseUrl}/${element.getAttribute("href")}`:element.getAttribute("href")
            
            // 
            // fetch
            // 
            try {
                htmlResult = await googleScholarFetcher(url, {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:133.0) Gecko/20100101 Firefox/133.0",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Sec-GPC": "1",
                        "Upgrade-Insecure-Requests": "1",
                        "Sec-Fetch-Dest": "document",
                        "Sec-Fetch-Mode": "navigate",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=0, i",
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    },
                    "referrer": "https://scholar.google.com/",
                    "method": "GET",
                    "mode": "cors"
                })
            } catch (error) {
                if (error.message.match(/too many requests/i)) {
                    console.debug(`detected too many requests error, doubling rate limit`,error)
                    googleScholarFetcher.rateLimit = googleScholarFetcher.rateLimit*2
                }
                throw error
            }
            let document
            try {
                document = new DOMParser().parseFromString(
                    htmlResult,
                    "text/html",
                )
            } catch (error) {
                console.debug(`htmlResult is:`,htmlResult)
                // // debug:
                // FileSystem.write({
                //     path: `${debugCount++}.html`,
                //     data: htmlResult,
                // })
                throw error
            }
            // 
            // pull article info
            // 
            let articles = []
            try {
                let links = [...document.querySelectorAll("h3 a")]
                for (let each of links) {
                    const title = each.innerText
                    const link = getHref(each)
                    const reference = {
                        title,
                        // discoveryMethod,
                        authorNames: null,
                        pdfLink: null,
                        link,
                        citationId: null,
                        multiArticleId: null,
                        citedByLink: null,
                        publisherInfo: null,
                    }
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
                                    let pieces = probablyAuthorsElement.innerText.split("-")
                                    let source = pieces.at(-1).trim()
                                    let publishInstanceInfo = pieces.at(-2)||""
                                    let authorInfoString = pieces.slice(0,-2).join("-") // join is just to be defensive, should be 1 item
                                    articleObject.authorNames = authorInfoString.split(",").map(each=>each.replace(/…|�/g,"").trim())
                                    let year
                                    // yep sadly this code will break in the year 2100
                                    if (year = publishInstanceInfo.match(/\b((?:20|19)(?:\d\d))$/)) {
                                        articleObject.year = year[1]-0
                                    } else if (year = publishInstanceInfo.match(/, ?((?:20|19)(?:\d\d))/)) {
                                        articleObject.year = year[1]-0
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
                        
                        // 
                        // citationLink
                        // 
                            // no href for citation link :(
                            // try {
                            //     const citationLinkElement = [...eachArticleElement.querySelectorAll("a")].filter(each=>each.innerText=="Cite"))[0]
                            //     if (citationLinkElement) {
                            //         articleObject.citationLink = getHref(citationLinkElement)
                            //     }
                            // } catch (error) {
                            // }
                        
                        // 
                        // related articles link
                        // 
                        try {
                            const linkElement = [...eachArticleElement.querySelectorAll("a")].filter(each=>each.innerText=="Related Articles")[0]
                            if (linkElement) {
                                articleObject.linkToRelatedArticles = getHref(linkElement)
                            }
                        } catch (error) {
                        }
                        
                        // 
                        // citedBy
                        // 
                        try {
                            const linkElement = [...eachArticleElement.querySelectorAll("a")].filter(each=>each.innerText.match(/cited by (\d+)/i))[0]
                            if (linkElement) {
                                articleObject.linkToCitedBy = getHref(linkElement)
                                articleObject.citedByCount = linkElement.innerText.match(/cited by (\d+)/i)[1]-0
                            }
                        } catch (error) {
                        }
                        
                        // 
                        // abstract (basically never is avaiable)
                        // 
                        try {
                            const abstractElement = eachArticleElement.querySelector(".gs_rs.gs_fma_s")
                            if (abstractElement) {
                                articleObject.abstract = abstractElement.innerText.trim()
                            } else {
                                // unable to get abstract cause google detects it as bot (too fast)
                                
                                // // when there is only one result, google tends to show the abstract
                                // try {
                                //     const query = articleObject.title+" "+(articleObject.authorNames||[]).join(" ")
                                //     const url = `${searchOptions.googleScholar.base}${searchOptions.googleScholar.searchStringToParams(query)}`
                                //     let htmlResult
                                //     try {
                                //         htmlResult = await fetch(new URL(url)).then(result=>result.text())
                                //     } catch (error) {
                                //         console.debug(`error when getting ${url} is:`,error)
                                //         return []
                                //     }
                                //     const document = new DOMParser().parseFromString(
                                //         htmlResult,
                                //         "text/html",
                                //     )
                                //     FileSystem.write({
                                //         path: `${debugCount++}.html`,
                                //         data: htmlResult,
                                //     })
                                //     const abstractElement = document.querySelector(".gs_rs.gs_fma_s")
                                //     console.debug(`abstractElement is:`,abstractElement)
                                //     articleObject.abstract = abstractElement.innerText.trim()
                                // } catch (error) {
                                //     console.warn(`issue getting abstract`, error)
                                // }
                            }
                            // /scholar?q=related:e4ZuT8QNQM8J:scholar.google.com/&scioq=Affordance-Based+Goal+Imagination&hl=en&as_sdt=0,44
                            // https://scholar.googleusercontent.com/scholar.bib?q=info:e4ZuT8QNQM8J:scholar.google.com/&output=citation&scisdr=ClEVMutuEMztnOqBQJ0:AFWwaeYAAAAAZ1yHWJ3RbrZHSuLGSUL_1SPMIgs&scisig=AFWwaeYAAAAAZ1yHWCl6VuL-prnamkSUfJ77dHM&scisf=4&ct=citation&cd=-1&hl=en
                        } catch (error) {
                            console.warn(`issue getting abstract`, error)
                        }
                    }
                }
            } catch (error) {
                console.error(`Error while trying to extract links from search ${error}`)
            }
            return articles
        },
        async *chronologicalSearch(
            query, {
                timeDelay=200,
                yearRanges=[
                    [1995, 1995,],
                    [1996, 1996,],
                    [1997, 1997,],
                    [1998, 1998,],
                    [1999, 1999,],
                    [2000, 2000,],
                    [2001, 2001,],
                    [2002, 2002,],
                    [2003, 2003,],
                    [2004, 2004,],
                    [2005, 2005,],
                    [2006, 2006,],
                    [2007, 2007,],
                    [2008, 2008,],
                    [2009, 2009,],
                    [2010, 2010,],
                    [2011, 2011,],
                    [2012, 2012,],
                    [2013, 2013,],
                    [2014, 2014,],
                    [2015, 2015,],
                    [2016, 2016,],
                    [2017, 2017,],
                    [2018, 2018,],
                    [2019, 2019,],
                    [2020, 2020,],
                    [2021, 2021,],
                    [2022, 2022,],
                    [2023, 2023,],
                    [2024, 2024,],
                    [2025, 2025,],
                ],
            }={},
        ) {
            const output = new Map()
            for (let [startYear, endYear] of yearRanges) {
                yield [
                    [startYear, endYear],
                    await this.urlToListOfResults(`https://scholar.google.com/scholar?q=${encodeURIComponent(query)}&hl=en&as_sdt=0%2C44&as_ylo=${startYear}&as_yhi=${endYear}`),
                ]
            }
        },
    },
    // "science-direct": {
    // },
}

let ramCache = new Map()
export async function autofillDataFor(reference, {crossrefCacheObject, openAlexCacheObject, }={}) {
    const original = reference
    if (ramCache.has(reference)) {
        return ramCache.get(reference)
    }
    // make it a proper object
    if (!(reference instanceof Reference)) {
        reference = new Reference(reference)
    }
    
    // get DOI
        // try to get it from crossref
        if (!reference.doi && reference.title) {
            reference.accordingTo = reference.accordingTo || {}
            reference.accordingTo.crossref = reference.accordingTo.crossref || {}
            try {
                reference.accordingTo.crossref.doi = await title2Doi(reference.title)
            } catch (error) {
                
            }
        }
    
    // get data
    if (reference.doi) {
        let promises = []
        // Crossref
        if (Object.keys(reference.accordingTo.crossref||{}).length > 1) { // doi is sometimes the only thing, and we want more info
            promises.push((async ()=>{
                try {
                    reference.accordingTo.crossref = crossrefToSimpleFormat(
                        await doiToCrossrefInfo(reference.doi, { cacheObject: crossrefCacheObject, })
                    )
                } catch (error) {
                }
            })())
        }
        // OpenAlex
        if (Object.keys(reference.accordingTo.openAlex||{}).length == 0) {
            promises.push((async ()=>{
                try {
                    reference.accordingTo.openAlex = openAlexToSimpleFormat(await openAlexDataFromDoi(reference.doi))
                } catch (error) {
                }
            })())
        }
        await Promise.all(promises)
    }
    ramCache.set(original, reference)
    return reference
}

export async function relatedWorkIncludes({source, }, refChecker) {
    let reference = await autofillDataFor(source)
    if (reference.accordingTo?.openAlex?.citedAlexIds instanceof Array) {
        const { citedBy, cites } = await getLinkedOpenAlexArticles(reference.accordingTo.openAlex.openAlexId)
        for (let each of citedBy.concat(cites)) {
            let citedWork = openAlexToSimpleFormat(each)
            if (citedWork) {
                if (await refChecker(citedWork)) {
                    return true
                }
            }
        }
        return false
    }
}