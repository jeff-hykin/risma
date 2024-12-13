import DateTime from "https://deno.land/x/good@1.13.5.0/date.js"
export class DiscoveryMethod {
    constructor({
        query,
        dateTime,
        searchEngine,
        referenceLinks=[],
        ...other
    }) {
        Object.assign(this,{
            query,
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