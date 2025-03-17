// https://esm.sh/@jsr/denosaurs__tty@0.2.1/denonext/denosaurs__tty.mjs
const consoleLog = globalThis.console.log
function monkeyPatch(object, attrName, createNewFunction) {
    let prevObj = null
    while (!Object.getOwnPropertyNames(object).includes(attrName)) {
        prevObj = object
        object = Object.getPrototypeOf(object)
        if (prevObj === object) {
            throw new Error(`Could not find ${attrName} on ${object}`)
        }
    }
    const originalFunction = object[attrName]
    let theThis
    const wrappedOriginal = function(...args) {
        return originalFunction.apply(theThis, args)
    }
    const innerReplacement = createNewFunction(wrappedOriginal)
    object[attrName] = function(...args) {
        theThis = this
        return innerReplacement.apply(this, args)
    }
}
var W = new TextEncoder()
function i(x2) {
    return W.encode(x2)
}
function N(x2, t2) {
    t2.writeSync(i(x2))
}
function e(x2, t2 = Deno.stdout) {
    N(r + x2, t2)
}
function s0(x2 = Deno.stdout) {
    e(s, x2)
}
function u0(x2 = Deno.stdout) {
    e(u, x2)
}
function S0(x2 = Deno.stdout) {
    e(w, x2)
}
function _0(x2 = 1, t2 = Deno.stdout) {
    e(x2 + D, t2)
}
function A0(x2 = 1, t2 = Deno.stdout) {
    e(`${x2}${R}`, t2)
}
var a = [
    [768, 879],
    [1155, 1158],
    [1160, 1161],
    [1425, 1469],
    [1471, 1471],
    [1473, 1474],
    [1476, 1477],
    [1479, 1479],
    [1536, 1539],
    [1552, 1557],
    [1611, 1630],
    [1648, 1648],
    [1750, 1764],
    [1767, 1768],
    [1770, 1773],
    [1807, 1807],
    [1809, 1809],
    [1840, 1866],
    [1958, 1968],
    [2027, 2035],
    [2305, 2306],
    [2364, 2364],
    [2369, 2376],
    [2381, 2381],
    [2385, 2388],
    [2402, 2403],
    [2433, 2433],
    [2492, 2492],
    [2497, 2500],
    [2509, 2509],
    [2530, 2531],
    [2561, 2562],
    [2620, 2620],
    [2625, 2626],
    [2631, 2632],
    [2635, 2637],
    [2672, 2673],
    [2689, 2690],
    [2748, 2748],
    [2753, 2757],
    [2759, 2760],
    [2765, 2765],
    [2786, 2787],
    [2817, 2817],
    [2876, 2876],
    [2879, 2879],
    [2881, 2883],
    [2893, 2893],
    [2902, 2902],
    [2946, 2946],
    [3008, 3008],
    [3021, 3021],
    [3134, 3136],
    [3142, 3144],
    [3146, 3149],
    [3157, 3158],
    [3260, 3260],
    [3263, 3263],
    [3270, 3270],
    [3276, 3277],
    [3298, 3299],
    [3393, 3395],
    [3405, 3405],
    [3530, 3530],
    [3538, 3540],
    [3542, 3542],
    [3633, 3633],
    [3636, 3642],
    [3655, 3662],
    [3761, 3761],
    [3764, 3769],
    [3771, 3772],
    [3784, 3789],
    [3864, 3865],
    [3893, 3893],
    [3895, 3895],
    [3897, 3897],
    [3953, 3966],
    [3968, 3972],
    [3974, 3975],
    [3984, 3991],
    [3993, 4028],
    [4038, 4038],
    [4141, 4144],
    [4146, 4146],
    [4150, 4151],
    [4153, 4153],
    [4184, 4185],
    [4448, 4607],
    [4959, 4959],
    [5906, 5908],
    [5938, 5940],
    [5970, 5971],
    [6002, 6003],
    [6068, 6069],
    [6071, 6077],
    [6086, 6086],
    [6089, 6099],
    [6109, 6109],
    [6155, 6157],
    [6313, 6313],
    [6432, 6434],
    [6439, 6440],
    [6450, 6450],
    [6457, 6459],
    [6679, 6680],
    [6912, 6915],
    [6964, 6964],
    [6966, 6970],
    [6972, 6972],
    [6978, 6978],
    [7019, 7027],
    [7616, 7626],
    [7678, 7679],
    [8203, 8207],
    [8234, 8238],
    [8288, 8291],
    [8298, 8303],
    [8400, 8431],
    [12330, 12335],
    [12441, 12442],
    [43014, 43014],
    [43019, 43019],
    [43045, 43046],
    [64286, 64286],
    [65024, 65039],
    [65056, 65059],
    [65279, 65279],
    [65529, 65531],
    [68097, 68099],
    [68101, 68102],
    [68108, 68111],
    [68152, 68154],
    [68159, 68159],
    [119143, 119145],
    [119155, 119170],
    [119173, 119179],
    [119210, 119213],
    [119362, 119364],
    [917505, 917505],
    [917536, 917631],
    [917760, 917999],
]
function h0(x2, { nul: t2 = 0, control: n2 = 0 } = {}) {
    let c = { nul: t2, control: n2 }
    if (typeof x2 != "string") return h(x2, c)
    let I = 0
    for (let A2 = 0; A2 < x2.length; A2++) {
        let H = h(x2.charCodeAt(A2), c)
        if (H < 0) return -1
        I += H
    }
    return I
}
function h(x2, { nul: t2 = 0, control: n2 = 0 } = {}) {
    return x2 === 0 ? t2 : x2 < 32 || (x2 >= 127 && x2 < 160) ? n2 : v(x2) ? 0 : 1 + (x2 >= 4352 && (x2 <= 4447 || x2 == 9001 || x2 == 9002 || (x2 >= 11904 && x2 <= 42191 && x2 != 12351) || (x2 >= 44032 && x2 <= 55203) || (x2 >= 63744 && x2 <= 64255) || (x2 >= 65040 && x2 <= 65049) || (x2 >= 65072 && x2 <= 65135) || (x2 >= 65280 && x2 <= 65376) || (x2 >= 65504 && x2 <= 65510) || (x2 >= 131072 && x2 <= 196605) || (x2 >= 196608 && x2 <= 262141)) ? 1 : 0)
}
function v(x2) {
    let t2 = 0,
        n2 = a.length - 1,
        c
    if (x2 < a[0][0] || x2 > a[n2][1]) return false
    for (; n2 >= t2; )
        if (((c = Math.floor((t2 + n2) / 2)), x2 > a[c][1])) t2 = c + 1
        else if (x2 < a[c][0]) n2 = c - 1
        else return true
    return false
}
function P({ onlyFirst: x2 = false } = {}) {
    let t2 = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|")
    return new RegExp(t2, x2 ? void 0 : "g")
}
function v0(x2) {
    return x2.replace(P(), "")
}
function B0(x2) {
    return x2.isTerminal()
}
var U = (await Deno.permissions.query({ name: "env" })).state === "granted" ? Deno.env.get("TERM_PROGRAM") === "Apple_Terminal" : false
var r = "\x1B["
var V0 = U ? "\x1B7" : r + "s"
var d = U ? "\x1B8" : r + "u"
var s = "?25l"
var u = "?25h"
var D = "A"
var R = "C"
var w = "2K"

// https://esm.sh/@jsr/std__fmt@1.0.6/denonext/colors.mjs
var { Deno: o } = globalThis
var p = typeof o?.noColor == "boolean" ? o.noColor : false
var i2 = !p
function t(n2, e3) {
    return { open: `\x1B[${n2.join(";")}m`, close: `\x1B[${e3}m`, regexp: new RegExp(`\\x1b\\[${e3}m`, "g") }
}
function r2(n2, e3) {
    return i2 ? `${e3.open}${n2.replace(e3.regexp, e3.open)}${e3.close}` : n2
}
function s2(n2) {
    return r2(n2, t([30], 39))
}
function R2(n2) {
    return r2(n2, t([31], 39))
}
function A(n2) {
    return r2(n2, t([32], 39))
}
function w2(n2) {
    return r2(n2, t([33], 39))
}
function M(n2) {
    return r2(n2, t([34], 39))
}
function $(n2) {
    return r2(n2, t([35], 39))
}
function k(n2) {
    return r2(n2, t([36], 39))
}
function E(n2) {
    return r2(n2, t([37], 39))
}
function T(n2) {
    return x(n2)
}
function x(n2) {
    return r2(n2, t([90], 39))
}
var g = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))"].join("|"), "g")

// https://esm.sh/@jsr/denosaurs__wait@0.2.2/denonext/log_symbols.mjs
var e2 = true
;(await Deno.permissions.query({ name: "env" })).state === "granted" && (e2 = e2 && (!!Deno.env.get("CI") || Deno.env.get("TERM") === "xterm-256color"))
var r3 = { info: M("ℹ"), success: A("✔"), warning: w2("⚠"), error: R2("✖") }
var s3 = { info: M("i"), success: A("√"), warning: w2("‼"), error: R2("×") }
var n = e2 ? r3 : s3

// https://esm.sh/@jsr/denosaurs__wait@0.2.2/denonext/spinners.mjs
var _ = { dots: { interval: 80, frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] }, dots2: { interval: 80, frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"] }, dots3: { interval: 80, frames: ["⠋", "⠙", "⠚", "⠞", "⠖", "⠦", "⠴", "⠲", "⠳", "⠓"] }, dots4: { interval: 80, frames: ["⠄", "⠆", "⠇", "⠋", "⠙", "⠸", "⠰", "⠠", "⠰", "⠸", "⠙", "⠋", "⠇", "⠆"] }, dots5: { interval: 80, frames: ["⠋", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋"] }, dots6: { interval: 80, frames: ["⠁", "⠉", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠤", "⠄", "⠄", "⠤", "⠴", "⠲", "⠒", "⠂", "⠂", "⠒", "⠚", "⠙", "⠉", "⠁"] }, dots7: { interval: 80, frames: ["⠈", "⠉", "⠋", "⠓", "⠒", "⠐", "⠐", "⠒", "⠖", "⠦", "⠤", "⠠", "⠠", "⠤", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋", "⠉", "⠈"] }, dots8: { interval: 80, frames: ["⠁", "⠁", "⠉", "⠙", "⠚", "⠒", "⠂", "⠂", "⠒", "⠲", "⠴", "⠤", "⠄", "⠄", "⠤", "⠠", "⠠", "⠤", "⠦", "⠖", "⠒", "⠐", "⠐", "⠒", "⠓", "⠋", "⠉", "⠈", "⠈"] }, dots9: { interval: 80, frames: ["⢹", "⢺", "⢼", "⣸", "⣇", "⡧", "⡗", "⡏"] }, dots10: { interval: 80, frames: ["⢄", "⢂", "⢁", "⡁", "⡈", "⡐", "⡠"] }, dots11: { interval: 100, frames: ["⠁", "⠂", "⠄", "⡀", "⢀", "⠠", "⠐", "⠈"] }, dots12: { interval: 80, frames: ["⢀⠀", "⡀⠀", "⠄⠀", "⢂⠀", "⡂⠀", "⠅⠀", "⢃⠀", "⡃⠀", "⠍⠀", "⢋⠀", "⡋⠀", "⠍⠁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⢈⠩", "⡀⢙", "⠄⡙", "⢂⠩", "⡂⢘", "⠅⡘", "⢃⠨", "⡃⢐", "⠍⡐", "⢋⠠", "⡋⢀", "⠍⡁", "⢋⠁", "⡋⠁", "⠍⠉", "⠋⠉", "⠋⠉", "⠉⠙", "⠉⠙", "⠉⠩", "⠈⢙", "⠈⡙", "⠈⠩", "⠀⢙", "⠀⡙", "⠀⠩", "⠀⢘", "⠀⡘", "⠀⠨", "⠀⢐", "⠀⡐", "⠀⠠", "⠀⢀", "⠀⡀"] }, dots8Bit: { interval: 80, frames: ["⠀", "⠁", "⠂", "⠃", "⠄", "⠅", "⠆", "⠇", "⡀", "⡁", "⡂", "⡃", "⡄", "⡅", "⡆", "⡇", "⠈", "⠉", "⠊", "⠋", "⠌", "⠍", "⠎", "⠏", "⡈", "⡉", "⡊", "⡋", "⡌", "⡍", "⡎", "⡏", "⠐", "⠑", "⠒", "⠓", "⠔", "⠕", "⠖", "⠗", "⡐", "⡑", "⡒", "⡓", "⡔", "⡕", "⡖", "⡗", "⠘", "⠙", "⠚", "⠛", "⠜", "⠝", "⠞", "⠟", "⡘", "⡙", "⡚", "⡛", "⡜", "⡝", "⡞", "⡟", "⠠", "⠡", "⠢", "⠣", "⠤", "⠥", "⠦", "⠧", "⡠", "⡡", "⡢", "⡣", "⡤", "⡥", "⡦", "⡧", "⠨", "⠩", "⠪", "⠫", "⠬", "⠭", "⠮", "⠯", "⡨", "⡩", "⡪", "⡫", "⡬", "⡭", "⡮", "⡯", "⠰", "⠱", "⠲", "⠳", "⠴", "⠵", "⠶", "⠷", "⡰", "⡱", "⡲", "⡳", "⡴", "⡵", "⡶", "⡷", "⠸", "⠹", "⠺", "⠻", "⠼", "⠽", "⠾", "⠿", "⡸", "⡹", "⡺", "⡻", "⡼", "⡽", "⡾", "⡿", "⢀", "⢁", "⢂", "⢃", "⢄", "⢅", "⢆", "⢇", "⣀", "⣁", "⣂", "⣃", "⣄", "⣅", "⣆", "⣇", "⢈", "⢉", "⢊", "⢋", "⢌", "⢍", "⢎", "⢏", "⣈", "⣉", "⣊", "⣋", "⣌", "⣍", "⣎", "⣏", "⢐", "⢑", "⢒", "⢓", "⢔", "⢕", "⢖", "⢗", "⣐", "⣑", "⣒", "⣓", "⣔", "⣕", "⣖", "⣗", "⢘", "⢙", "⢚", "⢛", "⢜", "⢝", "⢞", "⢟", "⣘", "⣙", "⣚", "⣛", "⣜", "⣝", "⣞", "⣟", "⢠", "⢡", "⢢", "⢣", "⢤", "⢥", "⢦", "⢧", "⣠", "⣡", "⣢", "⣣", "⣤", "⣥", "⣦", "⣧", "⢨", "⢩", "⢪", "⢫", "⢬", "⢭", "⢮", "⢯", "⣨", "⣩", "⣪", "⣫", "⣬", "⣭", "⣮", "⣯", "⢰", "⢱", "⢲", "⢳", "⢴", "⢵", "⢶", "⢷", "⣰", "⣱", "⣲", "⣳", "⣴", "⣵", "⣶", "⣷", "⢸", "⢹", "⢺", "⢻", "⢼", "⢽", "⢾", "⢿", "⣸", "⣹", "⣺", "⣻", "⣼", "⣽", "⣾", "⣿"] }, line: { interval: 130, frames: ["-", "\\", "|", "/"] }, line2: { interval: 100, frames: ["⠂", "-", "–", "—", "–", "-"] }, pipe: { interval: 100, frames: ["┤", "┘", "┴", "└", "├", "┌", "┬", "┐"] }, simpleDots: { interval: 400, frames: [".  ", ".. ", "...", "   "] }, simpleDotsScrolling: { interval: 200, frames: [".  ", ".. ", "...", " ..", "  .", "   "] }, star: { interval: 70, frames: ["✶", "✸", "✹", "✺", "✹", "✷"] }, star2: { interval: 80, frames: ["+", "x", "*"] }, flip: { interval: 70, frames: ["_", "_", "_", "-", "`", "`", "'", "´", "-", "_", "_", "_"] }, hamburger: { interval: 100, frames: ["☱", "☲", "☴"] }, growVertical: { interval: 120, frames: ["▁", "▃", "▄", "▅", "▆", "▇", "▆", "▅", "▄", "▃"] }, growHorizontal: { interval: 120, frames: ["▏", "▎", "▍", "▌", "▋", "▊", "▉", "▊", "▋", "▌", "▍", "▎"] }, balloon: { interval: 140, frames: [" ", ".", "o", "O", "@", "*", " "] }, balloon2: { interval: 120, frames: [".", "o", "O", "°", "O", "o", "."] }, noise: { interval: 100, frames: ["▓", "▒", "░"] }, bounce: { interval: 120, frames: ["⠁", "⠂", "⠄", "⠂"] }, boxBounce: { interval: 120, frames: ["▖", "▘", "▝", "▗"] }, boxBounce2: { interval: 100, frames: ["▌", "▀", "▐", "▄"] }, triangle: { interval: 50, frames: ["◢", "◣", "◤", "◥"] }, arc: { interval: 100, frames: ["◜", "◠", "◝", "◞", "◡", "◟"] }, circle: { interval: 120, frames: ["◡", "⊙", "◠"] }, squareCorners: { interval: 180, frames: ["◰", "◳", "◲", "◱"] }, circleQuarters: { interval: 120, frames: ["◴", "◷", "◶", "◵"] }, circleHalves: { interval: 50, frames: ["◐", "◓", "◑", "◒"] }, squish: { interval: 100, frames: ["╫", "╪"] }, toggle: { interval: 250, frames: ["⊶", "⊷"] }, toggle2: { interval: 80, frames: ["▫", "▪"] }, toggle3: { interval: 120, frames: ["□", "■"] }, toggle4: { interval: 100, frames: ["■", "□", "▪", "▫"] }, toggle5: { interval: 100, frames: ["▮", "▯"] }, toggle6: { interval: 300, frames: ["ဝ", "၀"] }, toggle7: { interval: 80, frames: ["⦾", "⦿"] }, toggle8: { interval: 100, frames: ["◍", "◌"] }, toggle9: { interval: 100, frames: ["◉", "◎"] }, toggle10: { interval: 100, frames: ["㊂", "㊀", "㊁"] }, toggle11: { interval: 50, frames: ["⧇", "⧆"] }, toggle12: { interval: 120, frames: ["☗", "☖"] }, toggle13: { interval: 80, frames: ["=", "*", "-"] }, arrow: { interval: 100, frames: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"] }, arrow2: { interval: 80, frames: ["⬆️ ", "↗️ ", "➡️ ", "↘️ ", "⬇️ ", "↙️ ", "⬅️ ", "↖️ "] }, arrow3: { interval: 120, frames: ["▹▹▹▹▹", "▸▹▹▹▹", "▹▸▹▹▹", "▹▹▸▹▹", "▹▹▹▸▹", "▹▹▹▹▸"] }, bouncingBar: { interval: 80, frames: ["[    ]", "[=   ]", "[==  ]", "[=== ]", "[ ===]", "[  ==]", "[   =]", "[    ]", "[   =]", "[  ==]", "[ ===]", "[====]", "[=== ]", "[==  ]", "[=   ]"] }, bouncingBall: { interval: 80, frames: ["( ●    )", "(  ●   )", "(   ●  )", "(    ● )", "(     ●)", "(    ● )", "(   ●  )", "(  ●   )", "( ●    )", "(●     )"] }, smiley: { interval: 200, frames: ["😄 ", "😝 "] }, monkey: { interval: 300, frames: ["🙈 ", "🙈 ", "🙉 ", "🙊 "] }, hearts: { interval: 100, frames: ["💛 ", "💙 ", "💜 ", "💚 ", "❤️ "] }, clock: { interval: 100, frames: ["🕛 ", "🕐 ", "🕑 ", "🕒 ", "🕓 ", "🕔 ", "🕕 ", "🕖 ", "🕗 ", "🕘 ", "🕙 ", "🕚 "] }, earth: { interval: 180, frames: ["🌍 ", "🌎 ", "🌏 "] }, material: { interval: 17, frames: ["█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "██████▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "███████▁▁▁▁▁▁▁▁▁▁▁▁▁", "████████▁▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "██████████▁▁▁▁▁▁▁▁▁▁", "███████████▁▁▁▁▁▁▁▁▁", "█████████████▁▁▁▁▁▁▁", "██████████████▁▁▁▁▁▁", "██████████████▁▁▁▁▁▁", "▁██████████████▁▁▁▁▁", "▁██████████████▁▁▁▁▁", "▁██████████████▁▁▁▁▁", "▁▁██████████████▁▁▁▁", "▁▁▁██████████████▁▁▁", "▁▁▁▁█████████████▁▁▁", "▁▁▁▁██████████████▁▁", "▁▁▁▁██████████████▁▁", "▁▁▁▁▁██████████████▁", "▁▁▁▁▁██████████████▁", "▁▁▁▁▁██████████████▁", "▁▁▁▁▁▁██████████████", "▁▁▁▁▁▁██████████████", "▁▁▁▁▁▁▁█████████████", "▁▁▁▁▁▁▁█████████████", "▁▁▁▁▁▁▁▁████████████", "▁▁▁▁▁▁▁▁████████████", "▁▁▁▁▁▁▁▁▁███████████", "▁▁▁▁▁▁▁▁▁███████████", "▁▁▁▁▁▁▁▁▁▁██████████", "▁▁▁▁▁▁▁▁▁▁██████████", "▁▁▁▁▁▁▁▁▁▁▁▁████████", "▁▁▁▁▁▁▁▁▁▁▁▁▁███████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁██████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████", "█▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████", "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███", "██▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███", "███▁▁▁▁▁▁▁▁▁▁▁▁▁▁███", "████▁▁▁▁▁▁▁▁▁▁▁▁▁▁██", "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█", "█████▁▁▁▁▁▁▁▁▁▁▁▁▁▁█", "██████▁▁▁▁▁▁▁▁▁▁▁▁▁█", "████████▁▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "█████████▁▁▁▁▁▁▁▁▁▁▁", "███████████▁▁▁▁▁▁▁▁▁", "████████████▁▁▁▁▁▁▁▁", "████████████▁▁▁▁▁▁▁▁", "██████████████▁▁▁▁▁▁", "██████████████▁▁▁▁▁▁", "▁██████████████▁▁▁▁▁", "▁██████████████▁▁▁▁▁", "▁▁▁█████████████▁▁▁▁", "▁▁▁▁▁████████████▁▁▁", "▁▁▁▁▁████████████▁▁▁", "▁▁▁▁▁▁███████████▁▁▁", "▁▁▁▁▁▁▁▁█████████▁▁▁", "▁▁▁▁▁▁▁▁█████████▁▁▁", "▁▁▁▁▁▁▁▁▁█████████▁▁", "▁▁▁▁▁▁▁▁▁█████████▁▁", "▁▁▁▁▁▁▁▁▁▁█████████▁", "▁▁▁▁▁▁▁▁▁▁▁████████▁", "▁▁▁▁▁▁▁▁▁▁▁████████▁", "▁▁▁▁▁▁▁▁▁▁▁▁███████▁", "▁▁▁▁▁▁▁▁▁▁▁▁███████▁", "▁▁▁▁▁▁▁▁▁▁▁▁▁███████", "▁▁▁▁▁▁▁▁▁▁▁▁▁███████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁████", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁███", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁██", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁█", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁", "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁"] }, moon: { interval: 80, frames: ["🌑 ", "🌒 ", "🌓 ", "🌔 ", "🌕 ", "🌖 ", "🌗 ", "🌘 "] }, runner: { interval: 140, frames: ["🚶 ", "🏃 "] }, pong: { interval: 80, frames: ["▐⠂       ▌", "▐⠈       ▌", "▐ ⠂      ▌", "▐ ⠠      ▌", "▐  ⡀     ▌", "▐  ⠠     ▌", "▐   ⠂    ▌", "▐   ⠈    ▌", "▐    ⠂   ▌", "▐    ⠠   ▌", "▐     ⡀  ▌", "▐     ⠠  ▌", "▐      ⠂ ▌", "▐      ⠈ ▌", "▐       ⠂▌", "▐       ⠠▌", "▐       ⡀▌", "▐      ⠠ ▌", "▐      ⠂ ▌", "▐     ⠈  ▌", "▐     ⠂  ▌", "▐    ⠠   ▌", "▐    ⡀   ▌", "▐   ⠠    ▌", "▐   ⠂    ▌", "▐  ⠈     ▌", "▐  ⠂     ▌", "▐ ⠠      ▌", "▐ ⡀      ▌", "▐⠠       ▌"] }, shark: { interval: 120, frames: ["▐|\\____________▌", "▐_|\\___________▌", "▐__|\\__________▌", "▐___|\\_________▌", "▐____|\\________▌", "▐_____|\\_______▌", "▐______|\\______▌", "▐_______|\\_____▌", "▐________|\\____▌", "▐_________|\\___▌", "▐__________|\\__▌", "▐___________|\\_▌", "▐____________|\\▌", "▐____________/|▌", "▐___________/|_▌", "▐__________/|__▌", "▐_________/|___▌", "▐________/|____▌", "▐_______/|_____▌", "▐______/|______▌", "▐_____/|_______▌", "▐____/|________▌", "▐___/|_________▌", "▐__/|__________▌", "▐_/|___________▌", "▐/|____________▌"] }, dqpb: { interval: 100, frames: ["d", "q", "p", "b"] }, weather: { interval: 100, frames: ["☀️ ", "☀️ ", "☀️ ", "🌤 ", "⛅️ ", "🌥 ", "☁️ ", "🌧 ", "🌨 ", "🌧 ", "🌨 ", "🌧 ", "🌨 ", "⛈ ", "🌨 ", "🌧 ", "🌨 ", "☁️ ", "🌥 ", "⛅️ ", "🌤 ", "☀️ ", "☀️ "] }, christmas: { interval: 400, frames: ["🌲", "🎄"] }, grenade: { interval: 80, frames: ["،   ", "′   ", " ´ ", " ‾ ", "  ⸌", "  ⸊", "  |", "  ⁎", "  ⁕", " ෴ ", "  ⁓", "   ", "   ", "   "] }, point: { interval: 125, frames: ["∙∙∙", "●∙∙", "∙●∙", "∙∙●", "∙∙∙"] }, layer: { interval: 150, frames: ["-", "=", "≡"] }, betaWave: { interval: 80, frames: ["ρββββββ", "βρβββββ", "ββρββββ", "βββρβββ", "ββββρββ", "βββββρβ", "ββββββρ"] } }

// https://esm.sh/@jsr/denosaurs__wait@0.2.2/denonext/mod.ts.mjs
var p2 = new TextEncoder()
var d2 = { black: s2, red: R2, green: A, yellow: w2, blue: M, magenta: $, cyan: k, white: E, gray: T }
function g2(n2) {
    return typeof n2 == "string" && (n2 = { text: n2 }), new l({ text: n2.text, prefix: n2.prefix ?? "", color: n2.color ?? k, spinner: n2.spinner ?? "dots", hideCursor: n2.hideCursor ?? true, indent: n2.indent ?? 0, interval: n2.interval ?? 100, stream: n2.stream ?? Deno.stdout, enabled: true, discardStdin: true, interceptConsole: n2.interceptConsole ?? true })
}
var l = class {
    #t
    isSpinning
    #i
    indent
    interval
    #h = 0
    #n
    #e
    #r
    #l
    constructor(t2) {
        ;(this.#t = t2),
            (this.#i = this.#t.stream),
            (this.text = this.#t.text),
            (this.prefix = this.#t.prefix),
            (this.color = this.#t.color),
            (this.spinner = this.#t.spinner),
            (this.indent = this.#t.indent),
            (this.interval = this.#t.interval),
            (this.isSpinning = false),
            (this.#e = 0),
            (this.#r = 0),
            (this.#l = 1),
            (this.#n = typeof t2.enabled == "boolean" ? t2.enabled : B0(this.#i)),
            t2.hideCursor &&
                addEventListener("unload", () => {
                    u0(this.#i)
                }),
            t2.interceptConsole && this.#d()
    }
    #s = _.dots
    #o = k
    #c = ""
    #p = ""
    #d() {
        for (let each of ["log", "debug", "info", "dir", "dirxml", "warn", "error", "assert", "count", "countReset", "table", "time", "timeLog", "timeEnd", "group", "groupCollapsed", "groupEnd", "clear", "trace", "profile", "profileEnd", "timeStamp"]) {
            monkeyPatch(console, each, (originalFunction) => {
                return (...args) => this.isSpinning ? (this.stop(), this.clear(), originalFunction(...args), this.start()) : originalFunction(...args)
            })
        }
    }
    set spinner(t2) {
        ;(this.#e = 0), typeof t2 == "string" ? (this.#s = _[t2]) : (this.#s = t2)
    }
    get spinner() {
        return this.#s
    }
    set color(t2) {
        typeof t2 == "string" ? (this.#o = d2[t2]) : (this.#o = t2)
    }
    get color() {
        return this.#o
    }
    set text(t2) {
        ;(this.#c = t2), this.updateLines()
    }
    get text() {
        return this.#c
    }
    set prefix(t2) {
        ;(this.#p = t2), this.updateLines()
    }
    get prefix() {
        return this.#p
    }
    #a(t2) {
        this.#i.writeSync(p2.encode(t2))
    }
    start() {
        return this.#n
            ? this.isSpinning
                ? this
                : (this.#t.hideCursor && s0(this.#i), (this.isSpinning = true), this.render(), (this.#h = setInterval(this.render.bind(this), this.interval)), this)
            : (this.text &&
                  this.#a(`- ${this.text}
`),
              this)
    }
    render() {
        this.clear(),
            this.#a(`${this.frame()}
`),
            this.updateLines(),
            (this.#r = this.#l)
    }
    frame() {
        let { frames: t2 } = this.#s,
            r4 = t2[this.#e]
        ;(r4 = this.#o(r4)), (this.#e = ++this.#e % t2.length)
        let o2 = typeof this.prefix == "string" && this.prefix !== "" ? this.prefix + " " : "",
            s4 = typeof this.text == "string" ? " " + this.text : ""
        return o2 + r4 + s4
    }
    clear() {
        if (this.#n) {
            for (let t2 = 0; t2 < this.#r; t2++) _0(1, this.#i), S0(this.#i), A0(this.indent - 1, this.#i)
            this.#r = 0
        }
    }
    updateLines() {
        let t2 = 80
        try {
            t2 = Deno.consoleSize().columns ?? t2
        } catch {}
        let r4 = typeof this.prefix == "string" ? this.prefix + "-" : ""
        this.#l = v0(r4 + "--" + this.text)
            .split(
                `
`
            )
            .reduce((o2, s4) => o2 + Math.max(1, Math.ceil(h0(s4) / t2)), 0)
    }
    stop() {
        this.#n && (clearInterval(this.#h), (this.#h = -1), (this.#e = 0), this.clear(), (this.isSpinning = false), this.#t.hideCursor && u0(this.#i))
    }
    stopAndPersist(t2 = {}) {
        let r4 = t2.prefix || this.prefix,
            o2 = typeof r4 == "string" && r4 !== "" ? r4 + " " : "",
            s4 = t2.text || this.text,
            c = typeof s4 == "string" ? " " + s4 : ""
        this.stop(),
            this.#a(`${o2}${t2.symbol || " "}${c}
`)
    }
    succeed(t2) {
        return this.stopAndPersist({ symbol: n.success, text: t2 })
    }
    fail(t2) {
        return this.stopAndPersist({ symbol: n.error, text: t2 })
    }
    warn(t2) {
        return this.stopAndPersist({ symbol: n.warning, text: t2 })
    }
    info(t2) {
        return this.stopAndPersist({ symbol: n.info, text: t2 })
    }
}
export { l as Spinner, _ as spinners, n as symbols, g2 as wait }
