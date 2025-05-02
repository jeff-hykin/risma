import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.5/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.2/elements.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.2/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.2/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.2/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"

import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"
import encryptedPdf from "./encrypted_pdf.binaryified.js"

import DateTime from "https://esm.sh/gh/jeff-hykin/good-js@1.17.0.0/source/date.js"
import { simpleSymmetric } from "https://esm.sh/gh/jeff-hykin/good-js@5e576f6/source/encryption.js"


const { html } = Elemental({
    ...components,
})

function download(filename, textOrBlob) {
    const element = document.createElement('a')
    let url
    if (typeof textOrBlob == "string") {
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(textOrBlob))
    } else {
        if (textOrBlob instanceof Uint8Array) {
            textOrBlob = new Blob([textOrBlob], { type: 'application/octet-stream' });
        }
        url = URL.createObjectURL(textOrBlob)
        element.href = url
    }
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    url && URL.revokeObjectURL(url)
}
const password = new URL(window.location.href).hash.slice(1)

download("paper.pdf", await simpleSymmetric.decrypt({message:encryptedPdf, password}))

let responseElement = document.createElement("div")
document.body = html`
    <body font-size=15px background-color=whitesmoke overflow=scroll width=100vw>
        Decrypting... 
    </body>
`