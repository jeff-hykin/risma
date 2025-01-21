var withAbstracts = true
;((async ()=>{
    var $$ = (...args)=>[...document.querySelectorAll(...args)]
    var newData = {}
    var pageNumber = 1
    while (true) {
        for (let each of $$(".result-item-content")) {
            each.scrollIntoView()
            var title = each.querySelector(".anchor-text-container")?.innerText
            var downloadLink = each.querySelector(".download-link")
            var publisherAndDate = each.querySelector(".srctitle-date-fields")
            var abstractText = ""
            if (withAbstracts) {
                // wait for UI to load to get the abstract
                try {
                    const maxWait = 1000
                    const checkRate = 50
                    each.querySelector(".PreviewButton").childNodes[0].click()
                    let foundArea = false
                    abstractText = await new Promise((resolve, reject)=>{
                        let isResovled = false
                        let interval = setInterval(() => {
                            if (foundArea) {
                                if (!isResovled) {
                                    resolve(foundArea?.innerText)
                                }
                                clearInterval(interval)
                            }
                            foundArea = each.querySelector(".abstract-section")
                        }, checkRate)
                        setTimeout(() => {
                            clearInterval(interval)
                            if (!isResovled) {
                                resolve(foundArea?.innerText)
                            }
                        }, maxWait)
                    })
                } catch (error) {
                    console.error("in the abstract section", error)
                }
            }
            var year = null
            var publisher = null
            if (publisherAndDate) {
                let children = [...publisherAndDate.childNodes]
                let publicationTimeString
                if (children.length > 0) {
                    let lastElement = children.at(-1)
                    if (lastElement && lastElement.innerText.match(/\b\d{4}$/)) {
                        publicationTimeString = lastElement.innerText
                        year = lastElement.innerText.split(/\s/).at(-1)-0
                    }
                }
                if (publicationTimeString) {
                    publisher = publisherAndDate.innerText.slice(0, -publicationTimeString.length-1)
                }
            }
            newData[title] = {
                accordingTo:{
                    scienceDirect: {
                        link: downloadLink?.href,
                        title,
                        abstract: abstractText,
                        year: year,
                        publisher,
                    },
                }
            }
            if (!downloadLink?.href) {
                delete newData[title].accordingTo.scienceDirect.link
            }
            if (!year) {
                delete newData[title].accordingTo.scienceDirect.year
            }
            if (!publisher) {
                delete newData[title].accordingTo.scienceDirect.publisher
            }
        }
        console.log(`JSON.stringify(newData,0,4) is:`,JSON.stringify(newData,0,4))
        
        const neededNumberOfResults = 100
        // always click the 100
        for (let each of $$('a[data-aa-region="srp-pagination-options"]')) {
            if (each.innerText.match(`${neededNumberOfResults}`)) {
                each.click()
                await new Promise(r=>setTimeout(r,5000))
                break
            }
        }
        let nextButton = document.querySelector(".pagination-link.next-link")
        if (nextButton) {
            nextButton.children[0].click()
            await new Promise(r=>setTimeout(r,500))
            while ($$(".result-item-content").length < neededNumberOfResults) {
                await new Promise(r=>setTimeout(r,100))
                console.log(`waiting for more results`)
            }
            console.log(`next page ${++pageNumber} ... ${$$("#srp-pagination").at(0)?.innerText} results`)
            await new Promise(r=>setTimeout(r,2000))
            continue
        }
        break
    }
})())