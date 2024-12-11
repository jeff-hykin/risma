#!/usr/bin/env -S deno run --allow-all
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorType,isAsyncIterable, isSyncIterable, isTechnicallyIterable, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.5.1.0/value.js"
import { run, Out, Stdout, Stderr, returnAsString } from "https://deno.land/x/quickr@0.6.54/main/run.js"
import { FileSystem } from "https://deno.land/x/quickr@0.6.56/main/file_system.js"
import DateTime from "https://deno.land/x/good@1.5.1.2/date.js"

// import { Parser, parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.1.3.0/main.js"
// import html from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/html.js"

import { versionToList, versionSort } from "./misc.js"

import { DiscoveryMethod } from "./discovery_method.js"
import { Reference } from "./reference.js"

const refreshCacheEvery = 1 // days

export const searchOptions = {
    "scholar": {
        "base": "https://scholar.google.com/scholar",
        searchStringToParams(string) {
            // https://scholar.google.com/scholar?q=imagination+based+affordance+recognition&btnG=
            return "?q="+encodeURIComponent(string)
        },
        async urlToListOfResults(url, discoveryMethod) {
            let htmlResult
            const baseUrl = new URL(url).origin
            const getHref = (element)=>`${baseUrl}/${element.getAttribute("href")}`
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
                    articles.push(new Reference({
                        title,
                        possibleYear: null,
                        notesConsideredRelevent: null,
                        notesCustomKeywords: [],
                        notesComment: null,
                        notesWasRelatedTo: [],
                        notesIsCitedByTitles: [],
                        notesCites: [],
                        discoveryMethod,
                        authorNames: null,
                        pdfLink: null,
                        link,
                        citationId: null,
                        multiArticleId: null,
                        citedByLink: null,
                        publisherInfo: null,
                    }))
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
                                    articleObject.authorNames = authorInfoString.split(",").map(each=>each.trim())
                                    let year
                                    // yep sadly this code will break in the year 2100
                                    if (year = publishInstanceInfo.match(/((?:20|19)(?:\d\d))/)) {
                                        articleObject.possibleYear = year[0]
                                    }
                                    if (publishInstanceInfo) {
                                        articleObject.publisherInfo = publishInstanceInfo
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