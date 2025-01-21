let allReferences = []
export class Reference {
    constructor({
        notes={
            comment:"",
            customKeywords:[],
            resumeStatus:"unseen|title",
            reasonsNotRelevant:[],
            reasonsRelevant:[],
            discoveryMethod:{},
            events:{},
        },
        accordingTo={
            $manuallyEntered: {},
        },
        ...other
    }={}) {
        this.notes = notes||{}
        this.accordingTo = { $manuallyEntered: {}, ...(accordingTo||{}) }
        const commonKeys = ["title","doi","year","publisherFlags","authorNames","link","pdfLink","cites","citedBy","abstract"]
        
        // pretend note properties are top level
        for (const [key, value] of Object.entries(this?.notes||{})) {
            if (this[key]) {
                this.notes[key] = value
                delete this[key]
            }
            Object.defineProperty(this, key, {
                get() {
                    return this.notes[key]
                },
                set(value) {
                    this.notes = this.notes || {}
                    this.notes[key] = value
                },
            })
        }
        
        // grab data from other sources
        this.accordingTo.$manuallyEntered = {
            // this is to preserve the order in the yaml and add missing fields
            ...Object.fromEntries(Object.keys(this.accordingTo.$manuallyEntered).concat(commonKeys).map(each=>[each,this.accordingTo.$manuallyEntered[each]])),
        }
        let thingsToDefine = []
        for (const key of commonKeys) {
            let value = this[key]
            if (["accordingTo","notes"].includes(key)) {
                continue
            }
            if (value != null) {
                this.accordingTo.$manuallyEntered[key] = value
            }
            delete this[key]
            thingsToDefine.push(key)
        }
        for (let key of thingsToDefine) {
            Object.defineProperty(this, key, {
                get() {
                    this.accordingTo.$manuallyEntered = this.accordingTo.$manuallyEntered || {}
                    if (this.accordingTo.$manuallyEntered[key]) {
                        return this.accordingTo.$manuallyEntered[key]
                    }
                    for (const [sourceName,eachInfoSource] of Object.entries(this.accordingTo)) {
                        if (sourceName == "$manuallyEntered") {
                            continue
                        }
                        if (eachInfoSource[key]) {
                            return eachInfoSource[key]
                        }
                    }
                },
                set(value) {
                    try {
                        throw Error("here")
                    } catch (error) {
                        if (key == "authorNames") {
                            console.debug(`error.stack is:`,error.stack)
                        }
                    }
                    this.accordingTo.$manuallyEntered = this.accordingTo.$manuallyEntered || {}
                    this.accordingTo.$manuallyEntered[key] = value
                },
            })
        }
    }
    beforeSave() {
        this._ = {}
        for (const [key, value] of Object.entries(this.accordingTo.$manuallyEntered)) {
            // structuredClone is needed to preserve references in the yaml
            // this _ field only exists to make it easier to query the yaml
            this._[key] = structuredClone(this[key])
        }
    }
}