export class Reference {
    constructor({
        resumeStatus,
        doi,
        possibleYear,
        cites,
        isCitedBy,
        discoveryMethod,
        authorNames,
        pdfLink,
        link,
        citationId,
        multiArticleId,
        citedByLink,
        publisherInfo,
        reasonsNotRelevant=[],
        relevanceStages=[],
        title,
        ...other
    }) {
        Object.assign(this,{
            resumeStatus,
            possibleYear,
            doi,
            reasonsNotRelevant,
            relevanceStages,
            cites,
            isCitedBy,
            discoveryMethod,
            authorNames,
            pdfLink,
            link,
            citationId,
            multiArticleId,
            citedByLink,
            publisherInfo,
            title,
        },other)
        // for yaml
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                this[key] = null
            }
        }
    }
}