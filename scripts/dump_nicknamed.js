#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from "https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js"
import { randomlyShuffle } from "https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import { createStorageObject } from "https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js"
import { indent } from "https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/indent.js"
import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.0/main/file_system.js"

let data = yaml.parse(await FileSystem.read(`${FileSystem.thisFolder}/../project.yaml`))
let references = Object.values(data.references)
let dataForEach = {}
for (let each of references) {
    if (each.notes.nickname) {
        dataForEach[each.notes.nickname] = [each.notes.nickname, each._.year, each._.citationCount]
        // FileSystem.write({
        //     data: yaml.stringify(each),
        //     path: `${FileSystem.thisFolder}/../pdfs/nicknamed/${each.notes.nickname}.yaml`,
        //     overwrite: true,
        // })
    }
}

for (let eachKey of ["LfvbSLAM", "VitaSLAM", "BatSLAM", "ORB-NeuroSLAM", "BowSLAM", "WhiskerSLAM", "CannFlyNet", "HsiSLAM", "VifSLAM", "KeySLAM"]) {
    console.log(dataForEach[eachKey].join("\t"))
}
