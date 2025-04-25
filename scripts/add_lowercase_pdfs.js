#!/usr/bin/env -S deno run --allow-all --no-lock
import { FileSystem, glob } from "https://deno.land/x/quickr@0.7.6/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.7.6/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.7.6/main/console.js"


const paths = await FileSystem.listPathsIn("/Users/jeffhykin/repos/risma/pdfs")
for (let each of paths) {
    if (!each.endsWith(".old")) {
        continue
    }
    try {
        const newPath = each.replace(".old","")
        const info = await FileSystem.info(newPath)
        if (info.isSymlink) {
            console.log(`removing ${each}`)
            // await FileSystem.remove(each)
        }
        await FileSystem.rename({from: each, to: newPath})
        // const [folders, name, ext] = FileSystem.pathPieces(each)
    } catch (error) {
        
    }
    // console.debug(`- ${name}`)
    // await FileSystem.relativeLink({existingItem: each, newItem: `${folders.join("/")}/${name.toLowerCase()}${ext}`})
    // await FileSystem.copy({from: each, to: `${folders}/${name.toLowerCase()}${ext}`})
}