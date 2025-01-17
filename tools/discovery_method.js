import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
export class DiscoveryMethod {
    constructor({
        query,
        dateTime,
        searchEngine,
        referenceLinks=[],
        score=NaN,
        ...other
    }) {
        Object.assign(this,{
            query,
            score,
            dateTime,
            searchEngine,
            ...other,
            referenceLinks
        },)
        // for yaml
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                this[key] = null
            }
        }
        // this.searchTicket = `(${this.date}) ${this.query}`
    }
}