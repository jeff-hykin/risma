import { MultiSourceObject } from "./multi_source_object.js"
import { openAlexDataFromDoi, getLinkedOpenAlexArticles, openAlexFetch } from "./open_alex.js"
import { crossRefDataFromDoi, getLinkedCrossRefArticles, crossRefFetch } from "./cross_ref.js"


function openAlexWorkToPaper(each) {
    return {
        doi: each.doi,
        title: each.title,
        abstract: each.abstract,
        concepts: [
            ...new Set([ 
                ...(each.topics||[]).map(each=>each.display_name),
                ...(each.topics||[]).map(each=>each.subfield?.display_name),
                ...(each.keywords||[]).map(each=>each.display_name),
                ...(each.concepts||[]).map(each=>each.display_name) 
            ].filter(each=>each).map(each=>each.toLowerCase()))
        ],
        year: each.publication_year || each.created_date,
        authorNames: (each.authorships||[]).map(each=>each.author.display_name),
        url: each.primary_location?.landing_page_url || (each.locations||[]).map(each=>each.landing_page_url).filter(each=>each)[0],
        pdfUrl: each.primary_location?.pdf_url || (each.locations||[]).map(each=>each.pdf_url).filter(each=>each)[0],
        citationCount: (each.counts_by_year||[]).map(each=>each.cited_by_count).reduce((a,b)=>(a-0)+(b-0),0),
        // citedAlexIds: each.referenced_works,
        // relatedAlexIds: each.related_works,
        id: each.id.replace(/^https:\/\/openalex\.org\//,""),
    }
}

function crossRefWorkToPaper(crossrefData) {
    return {
        "doi": crossrefData.DOI,
        "title": (crossrefData.title||[]).at(-1) || (crossrefData["short-title"]||[]).at(-1),
        "abstract": (crossrefData.abstract||"")?.replace(/<\/?jats:\w+>/g,"").trim().replace(/^Abstract\b/i,"").trim(),
        "year": crossrefData?.published?.["date-parts"]?.[0]?.[0] || crossrefData?.issued?.["date-parts"]?.[0]?.[0] || crossrefData?.indexed?.["date-parts"]?.[0]?.[0],
        "authorNames": crossrefData.author.map(author => author.given + " " + author.family),
        "url": crossrefData.URL,
        "pdfUrl": (crossrefData.link||[])?.filter(each=>each.contentType=="application/pdf").map(each=>each.URL)[0],
        "citationCount": crossrefData["is-referenced-by-count"]-0,
        "citedDois": (crossrefData.reference||[]).map(each=>each.DOI).filter(each=>each),
    }
}

// attempt at common names:
//    {string} paper.doi - The DOI (Digital Object Identifier) of the paper.
//    {string} paper.title - The title of the paper.
//    {string} paper.abstract - A brief abstract or summary of the paper.
//    {Array<string>} paper.concepts - A list of concepts or keywords associated with the paper.
//    {number} paper.year - The year the paper was published.
//    {Array<string>} paper.authorNames - A list of the authors' names.
//    {string} paper.url - The URL to the paper's webpage.
//    {string} paper.pdfUrl - The URL to the PDF version of the paper.
//    {number} paper.citationCount - The number of times the paper has been cited.
//    {string} paper.id - A unique identifier for the paper.
//    {Array<string>} paper.cites
//    {Array<string>} paper.citedBy
export function Paper(sources) {
    const output = MultiSourceObject(sources)
    Object.setPrototypeOf(output, Paper.prototype)
    return output
}
Object.assign(Paper.prototype, {
    getConnectedPapers() {
        return Promise.all([
            this._getConnectedOpenAlexPapers(),
            this._getConnectedCrossRefPapers(),
        ]).then(result=>result.flat(1))
    },
    async _getConnectedOpenAlexPapers() {
        // get alex data if not already there
        if (this.doi && !this.$accordingTo?.openAlex) {
            try {
                this.$accordingTo.openAlex = openAlexWorkToPaper(await openAlexDataFromDoi(this.doi))
            } catch (error) {
                
            }
        }
        // get connected papers using alex data
        if (this.$accordingTo?.openAlex?.id) {
            if (!(this.$accordingTo?.openAlex?.cites instanceof Array)) {
                const {cites, citedBy} = await getLinkedOpenAlexArticles(this.$accordingTo?.openAlex?.id)
                this.$accordingTo.openAlex.cites = cites.map(openAlexWorkToPaper)
                this.$accordingTo.openAlex.citedBy = citedBy.map(openAlexWorkToPaper)
            }
            return [...this.$accordingTo.openAlex.cites, ...this.$accordingTo.openAlex.citedBy]
        }
        // on fail, return null
    },
    async _getConnectedCrossRefPapers() {
        // get alex data if not already there
        if (this.doi && !this.$accordingTo?.crossRef?.citedDois) {
            try {
                this.$accordingTo.crossRef = crossRefWorkToPaper(await crossRefDataFromDoi(this.doi))
            } catch (error) {
                
            }
        }
        // get connected papers using alex data
        if (this.doi && this.$accordingTo?.crossRef?.citedDois instanceof Array) {
            if (!(this.$accordingTo?.crossRef?.cites instanceof Array)) {
                const {cites} = await getLinkedCrossRefArticles(this.doi)
                this.$accordingTo.crossRef.cites = cites.map(crossRefWorkToPaper)
            }
            return this.$accordingTo?.crossRef.cites
        }
        // on fail, return null
    },
    [Symbol.for("Deno.customInspect")](inspect,options) {
        return inspect(
            {
                ...Object.fromEntries(
                    Reflect.ownKeys(this).map(each=>[each,Reflect.get(this,each)]),
                ),
                $accordingTo: this.$accordingTo,
            },
            options
        )
    },
})