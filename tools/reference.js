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
        if (arguments[0] instanceof Reference) {
            Object.assign(this,arguments[0])
            return
        }
        this.notes = notes
        this.accordingTo = { $manuallyEntered: {}, ...accordingTo }
        const commonKeys = ["title","doi","year","publisherFlags","authorNames","link","pdfLink","cites","citedBy",]
        
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
        for (const key of ["title","doi","year","publisherFlags","authorNames","link","pdfLink","cites","citedBy","sources"]) {
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
    toYAML() {
        // const output = {...this}
        // // for yaml
        // for (const [key, value] of Object.entries(this)) {
        //     if (value == undefined) {
        //         this[key] = null
        //     }
        // }
        // return output
        return this
    }
}