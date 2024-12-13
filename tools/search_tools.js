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