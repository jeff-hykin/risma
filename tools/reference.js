export class Reference {
    constructor({
        title,
        resumeStatus,
        possibleYear,
        notesConsideredRelevent,
        notesCustomKeywords,
        notesComment,
        notesWasRelatedTo,
        notesIsCitedByTitles,
        notesCites,
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
        ...other
    }) {
        Object.assign(this,{
            title,
            resumeStatus,
            reasonsNotRelevant,
            relevanceStages,
            possibleYear,
            notesConsideredRelevent,
            notesCustomKeywords,
            notesComment,
            notesWasRelatedTo,
            notesIsCitedByTitles,
            notesCites,
            discoveryMethod,
            authorNames,
            pdfLink,
            link,
            citationId,
            multiArticleId,
            citedByLink,
            publisherInfo,
        },other)
        // for yaml
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                this[key] = null
            }
        }
    }
}