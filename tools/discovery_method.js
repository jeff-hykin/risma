export class DiscoveryMethod {
    constructor({
        searchEngine,
        query,
        dateTime,
    }) {
        Object.assign(this,{
            searchEngine,
            query,
            dateTime,
        })
    }
}