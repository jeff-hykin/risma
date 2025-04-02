#!/usr/bin/env -S deno run --allow-all --no-lock
import { combinationOfChoices } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/combination_of_choices.js'
import { randomlyShuffle } from 'https://esm.sh/gh/jeff-hykin/good-js@06a5077/source/flattened/randomly_shuffle.js'
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"
import {createStorageObject} from 'https://esm.sh/gh/jeff-hykin/storage-object@4b807ad/deno.js'

var problemBeingSolved = [
    "place recognition",
    "spatial navigation",
    "SLAM",
]
var groundingInNeuroScience = [
    'neuro inspired',
    'biologically plausible',
    'neuromorphic',
]
var groundingInApplication = [
    'robotics',
    'simulation',
    'quadruped',
]

var outcomes = [...combinationOfChoices([
    problemBeingSolved,
    groundingInApplication,
    groundingInNeuroScience,
])]
console.debug(`outcomes is:`,outcomes)
console.debug(`outcomes.length is:`,outcomes.length)