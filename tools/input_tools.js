import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"
import { Input } from "../subrepos/cliffy/prompt/input.ts"
import { Checkbox } from "../subrepos/cliffy/prompt/checkbox.ts"
import { stripColor } from "../subrepos/cliffy/prompt/deps.ts"
import { distance } from "../subrepos/cliffy/_utils/distance.ts"

export function selectOne({ message, showList, showInfo, options, optionDescriptions, autocompleteOnSubmit=true }) {
    let optionStrings
    if (options instanceof Array) {
        optionStrings = options
        options = Object.fromEntries(optionStrings.map(each=>[each,each]))
    } else {
        optionStrings = Object.keys(options)
    }
    const { rows, columns } = Deno.consoleSize()
    const maxOptionWidth = columns-3
    const longest = Math.max(...optionStrings.map(each=>each.length))
    const suggestions = optionStrings
    const suggestionDescriptions = []
    if (optionDescriptions) {
        for (let [suggestion, description] of zip(suggestions, optionDescriptions)) {
            let offset = 2
            suggestionDescriptions.push(
                stripColor(suggestion.padEnd(longest+offset," ")+": "+description).slice(0,maxOptionWidth).slice(suggestion.length+2)
            )
        }
    }
    
    return Input.prompt({
        message,
        list: showList,
        info: showInfo,
        suggestions,
        suggestionDescriptions,
        completeOnSubmit: autocompleteOnSubmit,
    }).then((answer)=>{
        if (!autocompleteOnSubmit) {
            return answer
        }
        
        if (optionStrings.includes(answer)) {
            return options[answer]
        } else {
            // Note: this sort NEEDs to exactly match https://github.com/c4spar/deno-cliffy/blob/aa1311f8d0891f535805395b0fb7d99de0b01b74/prompt/_generic_suggestions.ts#L242
            //       in order for it to work
            //       (this is why we pin versions)
            optionStrings = optionStrings.filter((value) =>
                stripColor(value.toString())
                .toLowerCase()
                .startsWith(answer)
            ).sort((a, b) =>
                distance((a || a).toString(), answer) -
                distance((b || b).toString(), answer)
            )
            // return closest match
            return options[optionStrings[0]]
        }
    })
}
// note: this can go in the options array
// Checkbox.separator("--------"),

export function selectMany({ message, options, ...other}) {
    let optionStrings
    if (options instanceof Array) {
        optionStrings = options
        options = Object.fromEntries(optionStrings.map(each=>[each,each]))
    } else {
        optionStrings = Object.keys(options)
    }
    const { rows, columns } = Deno.consoleSize()
    const maxOptionWidth = columns-3
    const longest = Math.max(...optionStrings.map(each=>each.length))
    const suggestions = optionStrings
    return Checkbox.prompt({
        message,
        options: suggestions,
        ...other,
    }).then((answers)=>answers.map(each=>options[each]))
}