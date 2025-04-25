#!/usr/bin/env -S deno run --allow-all

// import { makeHtmlTable } from "./make_html_table.js"
import { makeHtmlTable, nicknameToFormalName } from "/Users/jeffhykin/repos/risma/visuals/make_html_table.js"
import { enumerate } from "https://esm.sh/gh/jeff-hykin/good-js@1.17.0.0/source/array.js"
import { parseCsv, createCsv } from "https://esm.sh/gh/jeff-hykin/good-js@1.17.0.0/source/csv.js"

var {comments, columnNames, rows} = await parseCsv({
    separator: "\t",
    input: nicknameToFormalName(`        	RatSLAM	WaterSLAM1	EpisodicSLAM	AdaptSLAM	ResetSLAM	NeuroSLAM1	BionicSLAM	NeuroSLAM2	NeoSLAM1	NeuroGPR	SurfSLAM	NeoSLAM2	SbcSLAM	WaterSLAM2
RatSLAM	NA													
WaterSLAM1		NA												
EpisodicSLAM	✓		NA											
AdaptSLAM				NA										
ResetSLAM					NA									
NeuroSLAM1						NA								
BionicSLAM							NA							
NeuroSLAM2								NA						
NeoSLAM1	✓								NA					
NeuroGPR										NA				
SurfSLAM	✓										NA			
NeoSLAM2												NA		
SbcSLAM						✓							NA	
WaterSLAM2														NA
    `.trimEnd()),
})

// const rows = [
//     [       "",       "Elongation","Vestibular","Local v Distant"             ,"Contrast"                 ,"Color v Mono"                 ,"Pose Cell Quantity",],
//     [ "RatSLAM",               "?",         "x",                           "?",                        "?",                               "~",              "x",],
//     [ "WhiskerSLAM",           "?",         "_",                           "?",                        "?",                               "?",              "?",],
//     [ "VitaSLAM",              "?",         "~",                           "?",                        "?",                               "?",              "?",],
//     [ "FlyNet",                "?",         "x",                           "?",                        "?",                               "?",              "?",],
//     [ "NeuroSLAM",             "?",         "~",                           "?",                        "?",                               "?",              "?",],
//     [ "ORB-NeuroSLAM",         "?",         "~",                           "?",                        "?",                               "?",              "?",],
//     [ "HsiSLAM",               "?",         "~",                           "?",                        "✓",                               "?",              "?",],
//     [ "NeoSLAM",               "?",         "~",                           "?",                        "?",                               "?",              "?",],
//     [ "NeuroGPR",              "?",         "~",                           "?",                        "?",                               "?",              "?",],
//     [ "SurfSLAM",              "?",         "~",                           "?",                        "?",                               "?",              "?",],
// ]
const contentToStyle = ({content, columnIndex, rowIndex, thisRow, rows, thisColumnHeader}) => ({
    backgroundColor: ({
        "?": "gray",
        "~": "burlywood",
        "✓": "mediumseagreen",
        "✓": "mediumseagreen",
        "x": "salmon",
    })[content] || "transparent",
    
    classes: [
        (columnIndex <= rowIndex ? "null" : " "),
        (content == "" ? "empty" : "filled"),
        (thisColumnHeader == "" ? "emptyColumn" : "nonEmptyColumn"),
    ],
})
const css = `
    body {
        font-size: 12pt !important;
        background-color: white !important;
    }
    .header .cell {
        writing-mode: sideways-lr;
        vertical-align: bottom;
        padding: 1rem;
        text-align: center;
        max-width: 48px;
        transform: translate(1.6rem,1rem) rotate(45deg);
        border: none;
    }
    .cell {
        padding: 8px;
        border: 1px solid gray;
        text-align: center;
        background-color: transparent;
        width: 5rem; /* wide version (shallow version is none) */
    }
    .cell.null {
        background-color: rgba(128, 128, 128, 0.652) !important;
    }
    .cell.emptyColumn {
        border: none;
        background: transparent;
        color: black;
    }
    .cell.filled.emptyColumn {
        text-align: right;
    }
    .cell.filled:not(.emptyColumn) {
        color: white;
        background: mediumseagreen;
    }
    .cell.questionMark { background-color: gray; }
    .cell.tilde        { background-color: burlywood; }
    .cell.checkMark    { background-color: mediumseagreen; }
    .cell.x            { background-color: salmon; }
`
var htmlContent = makeHtmlTable({rows, contentToStyle, css})
import { FileSystem, glob } from "https://deno.land/x/quickr@0.8.0/main/file_system.js"
const path = `${FileSystem.thisFolder}/self_compare_table.html`
await FileSystem.write({path:path, data: htmlContent, overwrite: true})

import $ from "https://esm.sh/@jsr/david__dax@0.43.0/mod.ts"
const $$ = (...args)=>$(...args).noThrow()
// await $$`false`
// await $$`false`.text("stderr")
await $`open -a "Zen Browser" ${path}`