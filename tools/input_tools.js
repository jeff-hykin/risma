import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://deno.land/x/good@1.5.1.0/array.js"
import { Input } from "../subrepos/cliffy/prompt/input.ts"
import { Checkbox } from "../subrepos/cliffy/prompt/checkbox.ts"
import { stripColor } from "../subrepos/cliffy/prompt/deps.ts"
import { distance } from "../subrepos/cliffy/_utils/distance.ts"
import { isValidPathStringForFilePosix } from "https://deno.land/x/good@1.13.4.3/flattened/is_valid_path_string_for_file_posix.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.73/main/console.js"

export function selectOne({ message, showList=true, mustBeOnList=true, showInfo, options, optionDescriptions, autocompleteOnSubmit=true }) {
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
    while (true) {  
        const answer = await Input.prompt({
            message,
            list: showList,
            info: showInfo,
            suggestions,
            suggestionDescriptions,
            completeOnSubmit: autocompleteOnSubmit,
        })
        const isAlreadyValidOption = optionStrings.includes(answer)
        if (isAlreadyValidOption) {
            return options[answer]
        }

        if (autocompleteOnSubmit) {
            // autocomplete on submit
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

        if (mustBeOnList) {
            const suggestions = await didYouMean({
                givenWord: answer,
                possibleWords: Object.keys(options),
                suggestionLimit: 1,
            })
            if (await Console.askFor.yesNo(`Did you mean ${suggestions[0]}? (y/n)`)) {
                return options[suggestions[0]]
            } else {
                prompt(`okay, here is the full list again (press enter to continue)`)
            }
            continue
        }
        return answer

        break // sanity check for if more code is added
    }
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

export const askForPath = async (message, other={}) => {
    return Input.prompt({
        message,
        list: true,
        info: true,
        files: true,
        ...other
    })
}

export const askForFilePath = async (message, other={}) => {
    while (true) {
        const response = await askForPath(message, other)
        if (response) {
            if (isValidPathStringForFilePosix(response)) {
                return response
            } else {
                console.log(`Sorry, that's not a valid posix path for a file`)
            }
        }
    }
}

export const askForParagraph = async (message, other={}) => {
    console.log(message)
    let lastWasNewline = false
    let paragraph = []
    while (1) {
        const response = await Console.askFor.line("")
        if (response == "") {
            if (lastWasNewline) {
                break
            }
            lastWasNewline = true
            continue
        } else {
            paragraph.push(response)
        }
    }
    return paragraph.join("\n")
}


import { TerminalSpinner, SpinnerTypes } from "https://deno.land/x/spinners@v1.1.2/mod.ts"
export const withSpinner = async (taskName, func) => {
    const terminalSpinner = new TerminalSpinner({
        text: "fetching",
        color: "green",
        spinner: SpinnerTypes.dots, // check the file - see import
        indent: 0, // The level of indentation of the spinner in spaces
        cursor: false, // Whether or not to display a cursor when the spinner is active
        writer: Deno.stderr
    })
    terminalSpinner.start()
    return Promise.resolve(func()).finally(()=>terminalSpinner.succeed(taskName))
}

