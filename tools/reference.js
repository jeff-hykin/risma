export class Reference {
    constructor({
        title,
        notes={
            resumeStatus:"unseen|title",
            reasonsNotRelevant:[],
            customKeywords:[],
            comment:"",
            discoveryMethod:{},
            events:{},
        },
        doi,
        year,
        publisherFlags,
        authorNames,
        link,
        pdfLink,
        cites={},
        citedBy={},
        sources={},
        accordingTo={
            $manuallyEntered: {},
        },
        ...other
    }) {
        Object.assign(this,{
            title,
            doi,
            year,
            publisherFlags,
            authorNames,
            link,
            pdfLink,
            cites,
            citedBy,
            sources,
        }, other, { accordingTo })
        
        // pretend note properties are top level
        for (const [key, value] of Object.entries(this?.notes||{})) {
            Object.defineProperty(this, key, {
                get() {
                    this.notes[keys]
                },
                set(value) {
                    this.notes = this.notes || {}
                    this.notes[keys] = value
                },
            })
        }
        
        // grab data from other sources
        for (const [key, value] of Object.entries(this)) {
            if (value == null) {
                Object.defineProperty(this, key, {
                    get() {
                        this.accordingTo.$manuallyEntered = this.accordingTo.$manuallyEntered || {}
                        if (this.accordingTo.$manuallyEntered[key]) {
                            return this.accordingTo.$manuallyEntered[key]
                        }
                        for (const [key,eachInfoSource] of Object.entries(this.accordingTo)) {
                            if (eachInfoSource[key]) {
                                return eachInfoSource[key]
                            }
                        }
                    },
                    set(value) {
                        this.accordingTo.$manuallyEntered = this.accordingTo.$manuallyEntered || {}
                        this.accordingTo.$manuallyEntered[key] = value
                    },
                })
            }
        }
    }
    toYAML() {
        console.debug(`toYAML is:`,)
        const output = {...this}
        // for yaml
        for (const [key, value] of Object.entries(this)) {
            if (value == undefined) {
                this[key] = null
            }
        }
        return output
    }
}