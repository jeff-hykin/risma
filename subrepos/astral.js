var __defProp = Object.defineProperty
var __export = (target, all) => {
    for (var name in all) __defProp(target, name, { get: all[name], enumerable: true })
}

// https://esm.sh/@jsr/deno-library__progress@1.5.1/denonext/time.mjs
function h(n8, e6 = { withSpaces: false, toFixedVal: 1, longFormat: false }) {
    let t10 = n8 / 1e3
    if (t10 < 60) return r(t10, 0, e6)
    let u6 = Math.floor(t10 / 60)
    if (((t10 %= 60), u6 < 60)) return r(u6, 1, e6) + r(t10, 0, e6)
    let f4 = Math.floor(u6 / 60)
    if (((u6 %= 60), f4 < 24)) return r(f4, 2, e6) + r(u6, 1, e6) + r(t10, 0, e6)
    let c7 = Math.floor(f4 / 24)
    return (f4 %= 24), r(c7, 3, e6) + r(f4, 2, e6) + r(u6, 1, e6) + r(t10, 0, e6)
}
function r(n8, e6, { withSpaces: t10 = false, toFixedVal: u6 = 1, longFormat: f4 = false }) {
    let c7 = f4 ? ["second", "minute", "hour", "day"] : ["s", "m", "h", "d"],
        a4 = f4 && (n8 >= 2 || (n8 > 1 && u6 > 0)) ? c7[e6] + "s" : c7[e6]
    return e6 == 0 ? n8.toFixed(u6) + a4 : n8 + (t10 ? a4 + " " : a4)
}

// https://esm.sh/@jsr/std__fmt@1.0.3/denonext/colors.mjs
var { Deno: o } = globalThis
var p = typeof o?.noColor == "boolean" ? o.noColor : false
var i = !p
function t(n8, e6) {
    return { open: `\x1B[${n8.join(";")}m`, close: `\x1B[${e6}m`, regexp: new RegExp(`\\x1b\\[${e6}m`, "g") }
}
function r2(n8, e6) {
    return i ? `${e6.open}${n8.replace(e6.regexp, e6.open)}${e6.close}` : n8
}
function q(n8) {
    return r2(n8, t([42], 49))
}
function X(n8) {
    return r2(n8, t([47], 49))
}
var g = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TXZcf-nq-uy=><~]))"].join("|"), "g")
function en(n8) {
    return n8.replace(g, "")
}

// https://esm.sh/@jsr/std__io@0.225.0/denonext/write-all.mjs
async function r3(n8, e6) {
    let t10 = 0
    for (; t10 < e6.length; ) t10 += await n8.write(e6.subarray(t10))
}

// https://esm.sh/@jsr/deno-library__progress@1.5.1/denonext/deno-library__progress.mjs
var R = Deno.stdout.isTerminal
var k = Deno.stdout.isTerminal
var C = class {
    title
    total
    width
    complete
    preciseBar
    incomplete
    clear
    interval
    display
    prettyTime
    #e = false
    lastStr = ""
    lastStrLen = 0
    start = Date.now()
    lastRenderTime = 0
    encoder = new TextEncoder()
    writer
    constructor({ title: t10 = "", total: e6, width: a4 = 50, complete: r8 = q(" "), preciseBar: n8 = [], incomplete: l6 = X(" "), clear: i8 = false, interval: s9 = 16, display: m7, prettyTime: p6 = false, output: o8 = Deno.stdout } = {}) {
        ;(this.title = t10), (this.total = e6), (this.width = a4), (this.complete = r8), (this.preciseBar = n8.concat(r8)), (this.incomplete = l6), (this.clear = i8), (this.interval = s9), (this.display = m7 ?? ":title :percent :bar :time :completed/:total :text"), (this.prettyTime = p6), (this.writer = o8)
    }
    async render(t10, e6 = {}) {
        if (this.#e || !k) return
        if (t10 < 0) throw new Error("completed must greater than or equal to 0")
        let a4 = e6.total ?? this.total ?? 100,
            r8 = Date.now(),
            n8 = r8 - this.lastRenderTime,
            l6 = t10 >= a4
        if (n8 < this.interval && !l6) return
        this.lastRenderTime = r8
        let i8 = this.prettyTime ? h(r8 - this.start, e6.prettyTimeOptions) : ((r8 - this.start) / 1e3).toFixed(1) + "s",
            s9 = t10 >= a4 ? 0 : (a4 / t10 - 1) * (r8 - this.start),
            m7 = t10 == 0 ? "-" : this.prettyTime ? h(s9, e6.prettyTimeOptions) : (s9 / 1e3).toFixed(1) + "s",
            p6 = ((t10 / a4) * 100).toFixed(2) + "%",
            o8 = this.display
                .replace(":title", e6.title ?? this.title)
                .replace(":time", i8)
                .replace(":text", e6.text ?? "")
                .replace(":eta", m7)
                .replace(":percent", p6)
                .replace(":completed", t10 + "")
                .replace(":total", a4 + ""),
            L6 = Math.max(0, this.ttyColumns - en(o8.replace(":bar", "")).length),
            u6 = Math.min(this.width, L6),
            f4 = e6.preciseBar ?? this.preciseBar,
            h7 = f4.length > 1,
            b8 = (u6 * t10) / a4,
            d5 = Math.floor(b8),
            y5 = ""
        if (h7) {
            let c7 = b8 - d5
            y5 = l6 ? "" : f4[Math.floor(f4.length * c7)]
        }
        let S8 = new Array(d5).fill(e6.complete ?? this.complete).join(""),
            W5 = new Array(Math.max(u6 - d5 - (h7 ? 1 : 0), 0)).fill(e6.incomplete ?? this.incomplete).join("")
        if (((o8 = o8.replace(":bar", S8 + y5 + W5)), o8 !== this.lastStr)) {
            let c7 = en(o8).length
            c7 < this.lastStrLen && (o8 += " ".repeat(this.lastStrLen - c7)), await this.write(o8), (this.lastStr = o8), (this.lastStrLen = c7)
        }
        l6 && (await this.end())
    }
    async end() {
        this.#e || ((this.#e = true), this.clear ? (await this.stdoutWrite("\r"), await this.clearLine()) : await this.breakLine(), await this.showCursor())
    }
    async console(t10) {
        await this.clearLine(), await this.write(`${t10}`), await this.breakLine(), await this.write(this.lastStr)
    }
    write(t10) {
        return this.stdoutWrite(`\r${t10}\x1B[?25l`)
    }
    get ttyColumns() {
        return Deno.stdout.isTerminal() ? Deno.consoleSize().columns : 100
    }
    breakLine() {
        return this.stdoutWrite(`
`)
    }
    stdoutWrite(t10) {
        return r3(this.writer, this.encoder.encode(t10))
    }
    clearLine(t10 = 2) {
        switch (t10) {
            case 2:
                return this.stdoutWrite("\x1B[2K")
            case 0:
                return this.stdoutWrite("\x1B[1K")
            case 1:
                return this.stdoutWrite("\x1B[0K")
        }
    }
    showCursor() {
        return this.stdoutWrite("\x1B[?25h")
    }
}

// https://esm.sh/@jsr/std__async@1.0.12/denonext/abortable.mjs
function v(r8, e6) {
    return r8 instanceof Promise ? b(r8, e6) : u(r8, e6)
}
function b(r8, e6) {
    if (e6.aborted) return Promise.reject(e6.reason)
    let { promise: n8, reject: a4 } = Promise.withResolvers(),
        t10 = () => a4(e6.reason)
    return (
        e6.addEventListener("abort", t10, { once: true }),
        Promise.race([n8, r8]).finally(() => {
            e6.removeEventListener("abort", t10)
        })
    )
}
async function* u(r8, e6) {
    e6.throwIfAborted()
    let { promise: n8, reject: a4 } = Promise.withResolvers(),
        t10 = () => a4(e6.reason)
    e6.addEventListener("abort", t10, { once: true })
    let c7 = r8[Symbol.asyncIterator]()
    try {
        for (;;) {
            let o8 = Promise.race([n8, c7.next()])
            o8.catch(() => {
                e6.removeEventListener("abort", t10)
            })
            let { done: i8, value: s9 } = await o8
            if (i8) return e6.removeEventListener("abort", t10), (await c7.return?.(s9))?.value
            yield s9
        }
    } catch (o8) {
        throw (await c7.return?.(), o8)
    }
}

// https://esm.sh/@jsr/std__async@1.0.12/denonext/deadline.mjs
async function o2(i8, t10, a4 = {}) {
    let n8 = [AbortSignal.timeout(t10)]
    return a4.signal && n8.push(a4.signal), await v(i8, AbortSignal.any(n8))
}

// https://esm.sh/@jsr/std__async@1.0.12/denonext/_util.mjs
function r4(t10, n8, e6, o8, a4) {
    let i8 = Math.min(t10, n8 * o8 ** e6)
    return (1 - a4 * Math.random()) * i8
}

// https://esm.sh/@jsr/std__async@1.0.12/denonext/retry.mjs
var n = class extends Error {
    constructor(e6, r8) {
        super(`Retrying exceeded the maxAttempts (${r8}).`), (this.name = "RetryError"), (this.cause = e6)
    }
}
async function T(a4, e6) {
    let { multiplier: r8 = 2, maxTimeout: t10 = 6e4, maxAttempts: s9 = 5, minTimeout: i8 = 1e3, jitter: o8 = 1 } = e6 ?? {}
    if (t10 <= 0) throw new TypeError(`Cannot retry as 'maxTimeout' must be positive: current value is ${t10}`)
    if (i8 > t10) throw new TypeError(`Cannot retry as 'minTimeout' must be <= 'maxTimeout': current values 'minTimeout=${i8}', 'maxTimeout=${t10}'`)
    if (o8 > 1) throw new TypeError(`Cannot retry as 'jitter' must be <= 1: current value is ${o8}`)
    let m7 = 0
    for (;;) {
        try {
            return await a4()
        } catch (u6) {
            if (m7 + 1 >= s9) {
                throw new n(u6, s9)
            }
            let c7 = r4(t10, i8, m7, r8, o8)
            await new Promise((p6) => setTimeout(p6, c7))
        }
        m7++
    }
}

// https://esm.sh/@jsr/std__fs@1.0.13/denonext/_get_file_info_type.mjs
function e(i8) {
    return i8.isFile ? "file" : i8.isDirectory ? "dir" : i8.isSymlink ? "symlink" : void 0
}

// https://esm.sh/@jsr/std__fs@1.0.13/denonext/ensure-dir.mjs
async function c(t10) {
    try {
        let r8 = await Deno.stat(t10)
        e2(r8)
        return
    } catch (r8) {
        if (!(r8 instanceof Deno.errors.NotFound)) throw r8
    }
    try {
        await Deno.mkdir(t10, { recursive: true })
    } catch (r8) {
        if (!(r8 instanceof Deno.errors.AlreadyExists)) throw r8
        let o8 = await Deno.stat(t10)
        e2(o8)
    }
}
function s(t10) {
    try {
        let r8 = Deno.statSync(t10)
        e2(r8)
        return
    } catch (r8) {
        if (!(r8 instanceof Deno.errors.NotFound)) throw r8
    }
    try {
        Deno.mkdirSync(t10, { recursive: true })
    } catch (r8) {
        if (!(r8 instanceof Deno.errors.AlreadyExists)) throw r8
        let o8 = Deno.statSync(t10)
        e2(o8)
    }
}
function e2(t10) {
    if (!t10.isDirectory) throw new Error(`Failed to ensure directory exists: expected 'dir', got '${e(t10)}'`)
}

// https://esm.sh/@jsr/std__fs@1.0.15/denonext/exists.mjs
async function t2(i8, e6) {
    try {
        let r8 = await Deno.stat(i8)
        if (e6 && (e6.isReadable || e6.isDirectory || e6.isFile)) {
            if (e6.isDirectory && e6.isFile) throw new TypeError("ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together")
            if ((e6.isDirectory && !r8.isDirectory) || (e6.isFile && !r8.isFile)) return false
            if (e6.isReadable) return s2(r8)
        }
        return true
    } catch (r8) {
        if (r8 instanceof Deno.errors.NotFound) return false
        if (r8 instanceof Deno.errors.PermissionDenied && (await Deno.permissions.query({ name: "read", path: i8 })).state === "granted") return !e6?.isReadable
        throw r8
    }
}
function n2(i8, e6) {
    try {
        let r8 = Deno.statSync(i8)
        if (e6 && (e6.isReadable || e6.isDirectory || e6.isFile)) {
            if (e6.isDirectory && e6.isFile) throw new TypeError("ExistsOptions.options.isDirectory and ExistsOptions.options.isFile must not be true together")
            if ((e6.isDirectory && !r8.isDirectory) || (e6.isFile && !r8.isFile)) return false
            if (e6.isReadable) return s2(r8)
        }
        return true
    } catch (r8) {
        if (r8 instanceof Deno.errors.NotFound) return false
        if (r8 instanceof Deno.errors.PermissionDenied && Deno.permissions.querySync({ name: "read", path: i8 }).state === "granted") return !e6?.isReadable
        throw r8
    }
}
function s2(i8) {
    return i8.mode === null ? true : Deno.uid() === i8.uid ? (i8.mode & 256) === 256 : Deno.gid() === i8.gid ? (i8.mode & 32) === 32 : (i8.mode & 4) === 4
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_os.mjs
import __Process$ from "node:process"
var s3 = globalThis.Deno?.build.os === "windows" || globalThis.navigator?.platform?.startsWith("Win") || __Process$?.platform?.startsWith("win") || false

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/constants.mjs
var A = 65
var o3 = 97
var t3 = 90
var R2 = 122
var _ = 46
var C2 = 47
var E = 92
var c2 = 58

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/normalize_string.mjs
function C3(s9, d5, g7, c7) {
    let e6 = "",
        i8 = 0,
        t10 = -1,
        n8 = 0,
        f4
    for (let l6 = 0; l6 <= s9.length; ++l6) {
        if (l6 < s9.length) f4 = s9.charCodeAt(l6)
        else {
            if (c7(f4)) break
            f4 = C2
        }
        if (c7(f4)) {
            if (!(t10 === l6 - 1 || n8 === 1))
                if (t10 !== l6 - 1 && n8 === 2) {
                    if (e6.length < 2 || i8 !== 2 || e6.charCodeAt(e6.length - 1) !== _ || e6.charCodeAt(e6.length - 2) !== _) {
                        if (e6.length > 2) {
                            let o8 = e6.lastIndexOf(g7)
                            o8 === -1 ? ((e6 = ""), (i8 = 0)) : ((e6 = e6.slice(0, o8)), (i8 = e6.length - 1 - e6.lastIndexOf(g7))), (t10 = l6), (n8 = 0)
                            continue
                        } else if (e6.length === 2 || e6.length === 1) {
                            ;(e6 = ""), (i8 = 0), (t10 = l6), (n8 = 0)
                            continue
                        }
                    }
                    d5 && (e6.length > 0 ? (e6 += `${g7}..`) : (e6 = ".."), (i8 = 2))
                } else e6.length > 0 ? (e6 += g7 + s9.slice(t10 + 1, l6)) : (e6 = s9.slice(t10 + 1, l6)), (i8 = l6 - t10 - 1)
            ;(t10 = l6), (n8 = 0)
        } else f4 === _ && n8 !== -1 ? ++n8 : (n8 = -1)
    }
    return e6
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/assert_path.mjs
function t4(r8) {
    if (typeof r8 != "string") throw new TypeError(`Path must be a string, received "${JSON.stringify(r8)}"`)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/_util.mjs
function i2(r8) {
    return r8 === C2
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/resolve.mjs
function c3(...i8) {
    let e6 = "",
        t10 = false
    for (let o8 = i8.length - 1; o8 >= -1 && !t10; o8--) {
        let r8
        if (o8 >= 0) r8 = i8[o8]
        else {
            let { Deno: l6 } = globalThis
            if (typeof l6?.cwd != "function") throw new TypeError("Resolved a relative path without a current working directory (CWD)")
            r8 = l6.cwd()
        }
        t4(r8), r8.length !== 0 && ((e6 = `${r8}/${e6}`), (t10 = i2(r8.charCodeAt(0))))
    }
    return (e6 = C3(e6, !t10, "/", i2)), t10 ? (e6.length > 0 ? `/${e6}` : "/") : e6.length > 0 ? e6 : "."
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/_util.mjs
function o4(A7) {
    return A7 === C2
}
function S(A7) {
    return A7 === C2 || A7 === E
}
function E2(A7) {
    return (A7 >= o3 && A7 <= R2) || (A7 >= A && A7 <= t3)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/resolve.mjs
function k2(...w6) {
    let o8 = "",
        n8 = "",
        c7 = false
    for (let d5 = w6.length - 1; d5 >= -1; d5--) {
        let t10,
            { Deno: a4 } = globalThis
        if (d5 >= 0) t10 = w6[d5]
        else if (o8) {
            if (typeof a4?.env?.get != "function" || typeof a4?.cwd != "function") throw new TypeError("Resolved a relative path without a current working directory (CWD)")
            ;(t10 = a4.cwd()), (t10 === void 0 || t10.slice(0, 3).toLowerCase() !== `${o8.toLowerCase()}\\`) && (t10 = `${o8}\\`)
        } else {
            if (typeof a4?.cwd != "function") throw new TypeError("Resolved a drive-letter-less path without a current working directory (CWD)")
            t10 = a4.cwd()
        }
        t4(t10)
        let r8 = t10.length
        if (r8 === 0) continue
        let f4 = 0,
            s9 = "",
            h7 = false,
            u6 = t10.charCodeAt(0)
        if (r8 > 1)
            if (S(u6))
                if (((h7 = true), S(t10.charCodeAt(1)))) {
                    let e6 = 2,
                        i8 = e6
                    for (; e6 < r8 && !S(t10.charCodeAt(e6)); ++e6);
                    if (e6 < r8 && e6 !== i8) {
                        let C10 = t10.slice(i8, e6)
                        for (i8 = e6; e6 < r8 && S(t10.charCodeAt(e6)); ++e6);
                        if (e6 < r8 && e6 !== i8) {
                            for (i8 = e6; e6 < r8 && !S(t10.charCodeAt(e6)); ++e6);
                            e6 === r8 ? ((s9 = `\\\\${C10}\\${t10.slice(i8)}`), (f4 = e6)) : e6 !== i8 && ((s9 = `\\\\${C10}\\${t10.slice(i8, e6)}`), (f4 = e6))
                        }
                    }
                } else f4 = 1
            else E2(u6) && t10.charCodeAt(1) === c2 && ((s9 = t10.slice(0, 2)), (f4 = 2), r8 > 2 && S(t10.charCodeAt(2)) && ((h7 = true), (f4 = 3)))
        else S(u6) && ((f4 = 1), (h7 = true))
        if (!(s9.length > 0 && o8.length > 0 && s9.toLowerCase() !== o8.toLowerCase()) && (o8.length === 0 && s9.length > 0 && (o8 = s9), c7 || ((n8 = `${t10.slice(f4)}\\${n8}`), (c7 = h7)), c7 && o8.length > 0)) break
    }
    return (n8 = C3(n8, !c7, "\\", S)), o8 + (c7 ? "\\" : "") + n8 || "."
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/dirname.mjs
function n3(r8) {
    if ((t4(r8), r8.length === 0)) return "."
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/strip_trailing_separators.mjs
function a(r8, t10) {
    if (r8.length <= 1) return r8
    let l6 = r8.length
    for (let i8 = r8.length - 1; i8 > 0 && t10(r8.charCodeAt(i8)); i8--) l6 = i8
    return r8.slice(0, l6)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/dirname.mjs
function m(r8) {
    n3(r8)
    let t10 = -1,
        i8 = false
    for (let e6 = r8.length - 1; e6 >= 1; --e6)
        if (i2(r8.charCodeAt(e6))) {
            if (i8) {
                t10 = e6
                break
            }
        } else i8 = true
    return t10 === -1 ? (i2(r8.charCodeAt(0)) ? "/" : ".") : a(r8.slice(0, t10), i2)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/dirname.mjs
function g2(r8) {
    n3(r8)
    let i8 = r8.length,
        f4 = -1,
        l6 = -1,
        c7 = true,
        t10 = 0,
        a4 = r8.charCodeAt(0)
    if (i8 > 1)
        if (S(a4)) {
            if (((f4 = t10 = 1), S(r8.charCodeAt(1)))) {
                let e6 = 2,
                    s9 = e6
                for (; e6 < i8 && !S(r8.charCodeAt(e6)); ++e6);
                if (e6 < i8 && e6 !== s9) {
                    for (s9 = e6; e6 < i8 && S(r8.charCodeAt(e6)); ++e6);
                    if (e6 < i8 && e6 !== s9) {
                        for (s9 = e6; e6 < i8 && !S(r8.charCodeAt(e6)); ++e6);
                        if (e6 === i8) return r8
                        e6 !== s9 && (f4 = t10 = e6 + 1)
                    }
                }
            }
        } else E2(a4) && r8.charCodeAt(1) === c2 && ((f4 = t10 = 2), i8 > 2 && S(r8.charCodeAt(2)) && (f4 = t10 = 3))
    else if (S(a4)) return r8
    for (let e6 = i8 - 1; e6 >= t10; --e6)
        if (S(r8.charCodeAt(e6))) {
            if (!c7) {
                l6 = e6
                break
            }
        } else c7 = false
    if (l6 === -1) {
        if (f4 === -1) return "."
        l6 = f4
    }
    return a(r8.slice(0, l6), o4)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/dirname.mjs
function s4(r8) {
    return s3 ? g2(r8) : m(r8)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/from_file_url.mjs
function o5(e6) {
    if (((e6 = e6 instanceof URL ? e6 : new URL(e6)), e6.protocol !== "file:")) throw new TypeError(`URL must be a file URL: received "${e6.protocol}"`)
    return e6
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/from-file-url.mjs
function t5(e6) {
    return (e6 = o5(e6)), decodeURIComponent(e6.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"))
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/from-file-url.mjs
function n4(e6) {
    e6 = o5(e6)
    let a4 = decodeURIComponent(e6.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\")
    return e6.hostname !== "" && (a4 = `\\\\${e6.hostname}${a4}`), a4
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/from-file-url.mjs
function F(r8) {
    return s3 ? n4(r8) : t5(r8)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/_common/normalize.mjs
function n5(r8) {
    if ((t4(r8), r8.length === 0)) return "."
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/normalize.mjs
function l(r8) {
    n5(r8)
    let o8 = i2(r8.charCodeAt(0)),
        e6 = i2(r8.charCodeAt(r8.length - 1))
    return (r8 = C3(r8, !o8, "/", i2)), r8.length === 0 && !o8 && (r8 = "."), r8.length > 0 && e6 && (r8 += "/"), o8 ? `/${r8}` : r8
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/posix/join.mjs
function m2(...r8) {
    if (r8.length === 0) return "."
    r8.forEach((o8) => t4(o8))
    let n8 = r8.filter((o8) => o8.length > 0).join("/")
    return n8 === "" ? "." : l(n8)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/normalize.mjs
function k3(r8) {
    n5(r8)
    let t10 = r8.length,
        l6 = 0,
        n8,
        s9 = false,
        c7 = r8.charCodeAt(0)
    if (t10 > 1)
        if (S(c7))
            if (((s9 = true), S(r8.charCodeAt(1)))) {
                let e6 = 2,
                    o8 = e6
                for (; e6 < t10 && !S(r8.charCodeAt(e6)); ++e6);
                if (e6 < t10 && e6 !== o8) {
                    let d5 = r8.slice(o8, e6)
                    for (o8 = e6; e6 < t10 && S(r8.charCodeAt(e6)); ++e6);
                    if (e6 < t10 && e6 !== o8) {
                        for (o8 = e6; e6 < t10 && !S(r8.charCodeAt(e6)); ++e6);
                        if (e6 === t10) return `\\\\${d5}\\${r8.slice(o8)}\\`
                        e6 !== o8 && ((n8 = `\\\\${d5}\\${r8.slice(o8, e6)}`), (l6 = e6))
                    }
                }
            } else l6 = 1
        else E2(c7) && r8.charCodeAt(1) === c2 && ((n8 = r8.slice(0, 2)), (l6 = 2), t10 > 2 && S(r8.charCodeAt(2)) && ((s9 = true), (l6 = 3)))
    else if (S(c7)) return "\\"
    let i8
    return l6 < t10 ? (i8 = C3(r8.slice(l6), !s9, "\\", S)) : (i8 = ""), i8.length === 0 && !s9 && (i8 = "."), i8.length > 0 && S(r8.charCodeAt(t10 - 1)) && (i8 += "\\"), n8 === void 0 ? (s9 ? (i8.length > 0 ? `\\${i8}` : "\\") : i8) : s9 ? (i8.length > 0 ? `${n8}\\${i8}` : `${n8}\\`) : n8 + i8
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/windows/join.mjs
function m3(...r8) {
    if ((r8.forEach((t10) => t4(t10)), (r8 = r8.filter((t10) => t10.length > 0)), r8.length === 0)) return "."
    let n8 = true,
        e6 = 0,
        o8 = r8[0]
    if (S(o8.charCodeAt(0))) {
        ++e6
        let t10 = o8.length
        t10 > 1 && S(o8.charCodeAt(1)) && (++e6, t10 > 2 && (S(o8.charCodeAt(2)) ? ++e6 : (n8 = false)))
    }
    let i8 = r8.join("\\")
    if (n8) {
        for (; e6 < i8.length && S(i8.charCodeAt(e6)); ++e6);
        e6 >= 2 && (i8 = `\\${i8.slice(e6)}`)
    }
    return k3(i8)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/join.mjs
function f(...o8) {
    return s3 ? m3(...o8) : m2(...o8)
}

// https://esm.sh/@jsr/std__path@1.0.8/denonext/resolve.mjs
function v2(...o8) {
    return s3 ? k2(...o8) : c3(...o8)
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/constants.mjs
var _2 = 4294967295
var E3 = 65535
var T2 = 8
var I = 0
var A2 = 99
var R3 = 67324752
var N = 134695760
var D = 134695760
var L = 33639248
var n6 = 101010256
var o6 = 101075792
var t6 = 117853008
var c4 = 22
var s5 = 20
var O = 56
var F2 = 98
var S2 = 1
var P = 39169
var x = 10
var C4 = 1
var G = 21589
var U = 28789
var M = 25461
var X2 = 6534
var f2 = 1
var H = 6
var Y = 8
var Z = 2048
var e3 = 16
var B = 16384
var b2 = 73
var V = 420
var d = 20
var K = 45
var a2 = 51
var i3 = "/"
var u2 = new Date(2107, 11, 31)
var w = new Date(1980, 0, 1)
var p2 = void 0
var r5 = "undefined"
var g3 = "function"

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/streams/codecs/crc32.mjs
var s6 = []
for (let c7 = 0; c7 < 256; c7++) {
    let t10 = c7
    for (let e6 = 0; e6 < 8; e6++) t10 & 1 ? (t10 = (t10 >>> 1) ^ 3988292384) : (t10 = t10 >>> 1)
    s6[c7] = t10
}
var l2 = class {
    constructor(t10) {
        this.crc = t10 || -1
    }
    append(t10) {
        let e6 = this.crc | 0
        for (let r8 = 0, o8 = t10.length | 0; r8 < o8; r8++) e6 = (e6 >>> 8) ^ s6[(e6 ^ t10[r8]) & 255]
        this.crc = e6
    }
    get() {
        return ~this.crc
    }
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/util/encode-text.mjs
function c5(e6) {
    if (typeof TextEncoder == r5) {
        e6 = unescape(encodeURIComponent(e6))
        let t10 = new Uint8Array(e6.length)
        for (let n8 = 0; n8 < t10.length; n8++) t10[n8] = e6.charCodeAt(n8)
        return t10
    } else return new TextEncoder().encode(e6)
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/streams/codecs/sjcl.mjs
var _3 = {
    concat(t10, e6) {
        if (t10.length === 0 || e6.length === 0) return t10.concat(e6)
        let s9 = t10[t10.length - 1],
            n8 = _3.getPartial(s9)
        return n8 === 32 ? t10.concat(e6) : _3._shiftRight(e6, n8, s9 | 0, t10.slice(0, t10.length - 1))
    },
    bitLength(t10) {
        let e6 = t10.length
        if (e6 === 0) return 0
        let s9 = t10[e6 - 1]
        return (e6 - 1) * 32 + _3.getPartial(s9)
    },
    clamp(t10, e6) {
        if (t10.length * 32 < e6) return t10
        t10 = t10.slice(0, Math.ceil(e6 / 32))
        let s9 = t10.length
        return (e6 = e6 & 31), s9 > 0 && e6 && (t10[s9 - 1] = _3.partial(e6, t10[s9 - 1] & (2147483648 >> (e6 - 1)), 1)), t10
    },
    partial(t10, e6, s9) {
        return t10 === 32 ? e6 : (s9 ? e6 | 0 : e6 << (32 - t10)) + t10 * 1099511627776
    },
    getPartial(t10) {
        return Math.round(t10 / 1099511627776) || 32
    },
    _shiftRight(t10, e6, s9, n8) {
        for (n8 === void 0 && (n8 = []); e6 >= 32; e6 -= 32) n8.push(s9), (s9 = 0)
        if (e6 === 0) return n8.concat(t10)
        for (let c7 = 0; c7 < t10.length; c7++) n8.push(s9 | (t10[c7] >>> e6)), (s9 = t10[c7] << (32 - e6))
        let l6 = t10.length ? t10[t10.length - 1] : 0,
            r8 = _3.getPartial(l6)
        return n8.push(_3.partial((e6 + r8) & 31, e6 + r8 > 32 ? s9 : n8.pop(), 1)), n8
    },
}
var y = {
    bytes: {
        fromBits(t10) {
            let s9 = _3.bitLength(t10) / 8,
                n8 = new Uint8Array(s9),
                l6
            for (let r8 = 0; r8 < s9; r8++) r8 & 3 || (l6 = t10[r8 / 4]), (n8[r8] = l6 >>> 24), (l6 <<= 8)
            return n8
        },
        toBits(t10) {
            let e6 = [],
                s9,
                n8 = 0
            for (s9 = 0; s9 < t10.length; s9++) (n8 = (n8 << 8) | t10[s9]), (s9 & 3) === 3 && (e6.push(n8), (n8 = 0))
            return s9 & 3 && e6.push(_3.partial(8 * (s9 & 3), n8)), e6
        },
    },
}
var w2 = {}
w2.sha1 = class {
    constructor(t10) {
        let e6 = this
        ;(e6.blockSize = 512), (e6._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]), (e6._key = [1518500249, 1859775393, 2400959708, 3395469782]), t10 ? ((e6._h = t10._h.slice(0)), (e6._buffer = t10._buffer.slice(0)), (e6._length = t10._length)) : e6.reset()
    }
    reset() {
        let t10 = this
        return (t10._h = t10._init.slice(0)), (t10._buffer = []), (t10._length = 0), t10
    }
    update(t10) {
        let e6 = this
        typeof t10 == "string" && (t10 = y.utf8String.toBits(t10))
        let s9 = (e6._buffer = _3.concat(e6._buffer, t10)),
            n8 = e6._length,
            l6 = (e6._length = n8 + _3.bitLength(t10))
        if (l6 > 9007199254740991) throw new Error("Cannot hash more than 2^53 - 1 bits")
        let r8 = new Uint32Array(s9),
            c7 = 0
        for (let h7 = e6.blockSize + n8 - ((e6.blockSize + n8) & (e6.blockSize - 1)); h7 <= l6; h7 += e6.blockSize) e6._block(r8.subarray(16 * c7, 16 * (c7 + 1))), (c7 += 1)
        return s9.splice(0, 16 * c7), e6
    }
    finalize() {
        let t10 = this,
            e6 = t10._buffer,
            s9 = t10._h
        e6 = _3.concat(e6, [_3.partial(1, 1)])
        for (let n8 = e6.length + 2; n8 & 15; n8++) e6.push(0)
        for (e6.push(Math.floor(t10._length / 4294967296)), e6.push(t10._length | 0); e6.length; ) t10._block(e6.splice(0, 16))
        return t10.reset(), s9
    }
    _f(t10, e6, s9, n8) {
        if (t10 <= 19) return (e6 & s9) | (~e6 & n8)
        if (t10 <= 39) return e6 ^ s9 ^ n8
        if (t10 <= 59) return (e6 & s9) | (e6 & n8) | (s9 & n8)
        if (t10 <= 79) return e6 ^ s9 ^ n8
    }
    _S(t10, e6) {
        return (e6 << t10) | (e6 >>> (32 - t10))
    }
    _block(t10) {
        let e6 = this,
            s9 = e6._h,
            n8 = Array(80)
        for (let i8 = 0; i8 < 16; i8++) n8[i8] = t10[i8]
        let l6 = s9[0],
            r8 = s9[1],
            c7 = s9[2],
            h7 = s9[3],
            f4 = s9[4]
        for (let i8 = 0; i8 <= 79; i8++) {
            i8 >= 16 && (n8[i8] = e6._S(1, n8[i8 - 3] ^ n8[i8 - 8] ^ n8[i8 - 14] ^ n8[i8 - 16]))
            let o8 = (e6._S(5, l6) + e6._f(i8, r8, c7, h7) + f4 + n8[i8] + e6._key[Math.floor(i8 / 20)]) | 0
            ;(f4 = h7), (h7 = c7), (c7 = e6._S(30, r8)), (r8 = l6), (l6 = o8)
        }
        ;(s9[0] = (s9[0] + l6) | 0), (s9[1] = (s9[1] + r8) | 0), (s9[2] = (s9[2] + c7) | 0), (s9[3] = (s9[3] + h7) | 0), (s9[4] = (s9[4] + f4) | 0)
    }
}
var z = {}
z.aes = class {
    constructor(t10) {
        let e6 = this
        ;(e6._tables = [
            [[], [], [], [], []],
            [[], [], [], [], []],
        ]),
            e6._tables[0][0][0] || e6._precompute()
        let s9 = e6._tables[0][4],
            n8 = e6._tables[1],
            l6 = t10.length,
            r8,
            c7,
            h7,
            f4 = 1
        if (l6 !== 4 && l6 !== 6 && l6 !== 8) throw new Error("invalid aes key size")
        for (e6._key = [(c7 = t10.slice(0)), (h7 = [])], r8 = l6; r8 < 4 * l6 + 28; r8++) {
            let i8 = c7[r8 - 1]
            ;(r8 % l6 === 0 || (l6 === 8 && r8 % l6 === 4)) && ((i8 = (s9[i8 >>> 24] << 24) ^ (s9[(i8 >> 16) & 255] << 16) ^ (s9[(i8 >> 8) & 255] << 8) ^ s9[i8 & 255]), r8 % l6 === 0 && ((i8 = (i8 << 8) ^ (i8 >>> 24) ^ (f4 << 24)), (f4 = (f4 << 1) ^ ((f4 >> 7) * 283)))), (c7[r8] = c7[r8 - l6] ^ i8)
        }
        for (let i8 = 0; r8; i8++, r8--) {
            let o8 = c7[i8 & 3 ? r8 : r8 - 4]
            r8 <= 4 || i8 < 4 ? (h7[i8] = o8) : (h7[i8] = n8[0][s9[o8 >>> 24]] ^ n8[1][s9[(o8 >> 16) & 255]] ^ n8[2][s9[(o8 >> 8) & 255]] ^ n8[3][s9[o8 & 255]])
        }
    }
    encrypt(t10) {
        return this._crypt(t10, 0)
    }
    decrypt(t10) {
        return this._crypt(t10, 1)
    }
    _precompute() {
        let t10 = this._tables[0],
            e6 = this._tables[1],
            s9 = t10[4],
            n8 = e6[4],
            l6 = [],
            r8 = [],
            c7,
            h7,
            f4,
            i8
        for (let o8 = 0; o8 < 256; o8++) r8[(l6[o8] = (o8 << 1) ^ ((o8 >> 7) * 283)) ^ o8] = o8
        for (let o8 = (c7 = 0); !s9[o8]; o8 ^= h7 || 1, c7 = r8[c7] || 1) {
            let a4 = c7 ^ (c7 << 1) ^ (c7 << 2) ^ (c7 << 3) ^ (c7 << 4)
            ;(a4 = (a4 >> 8) ^ (a4 & 255) ^ 99), (s9[o8] = a4), (n8[a4] = o8), (i8 = l6[(f4 = l6[(h7 = l6[o8])])])
            let u6 = (i8 * 16843009) ^ (f4 * 65537) ^ (h7 * 257) ^ (o8 * 16843008),
                b8 = (l6[a4] * 257) ^ (a4 * 16843008)
            for (let p6 = 0; p6 < 4; p6++) (t10[p6][o8] = b8 = (b8 << 24) ^ (b8 >>> 8)), (e6[p6][a4] = u6 = (u6 << 24) ^ (u6 >>> 8))
        }
        for (let o8 = 0; o8 < 5; o8++) (t10[o8] = t10[o8].slice(0)), (e6[o8] = e6[o8].slice(0))
    }
    _crypt(t10, e6) {
        if (t10.length !== 4) throw new Error("invalid aes block size")
        let s9 = this._key[e6],
            n8 = s9.length / 4 - 2,
            l6 = [0, 0, 0, 0],
            r8 = this._tables[e6],
            c7 = r8[0],
            h7 = r8[1],
            f4 = r8[2],
            i8 = r8[3],
            o8 = r8[4],
            a4 = t10[0] ^ s9[0],
            u6 = t10[e6 ? 3 : 1] ^ s9[1],
            b8 = t10[2] ^ s9[2],
            p6 = t10[e6 ? 1 : 3] ^ s9[3],
            g7 = 4,
            m7,
            d5,
            k8
        for (let x6 = 0; x6 < n8; x6++) (m7 = c7[a4 >>> 24] ^ h7[(u6 >> 16) & 255] ^ f4[(b8 >> 8) & 255] ^ i8[p6 & 255] ^ s9[g7]), (d5 = c7[u6 >>> 24] ^ h7[(b8 >> 16) & 255] ^ f4[(p6 >> 8) & 255] ^ i8[a4 & 255] ^ s9[g7 + 1]), (k8 = c7[b8 >>> 24] ^ h7[(p6 >> 16) & 255] ^ f4[(a4 >> 8) & 255] ^ i8[u6 & 255] ^ s9[g7 + 2]), (p6 = c7[p6 >>> 24] ^ h7[(a4 >> 16) & 255] ^ f4[(u6 >> 8) & 255] ^ i8[b8 & 255] ^ s9[g7 + 3]), (g7 += 4), (a4 = m7), (u6 = d5), (b8 = k8)
        for (let x6 = 0; x6 < 4; x6++) (l6[e6 ? 3 & -x6 : x6] = (o8[a4 >>> 24] << 24) ^ (o8[(u6 >> 16) & 255] << 16) ^ (o8[(b8 >> 8) & 255] << 8) ^ o8[p6 & 255] ^ s9[g7++]), (m7 = a4), (a4 = u6), (u6 = b8), (b8 = p6), (p6 = m7)
        return l6
    }
}
var B2 = {
    getRandomValues(t10) {
        let e6 = new Uint32Array(t10.buffer),
            s9 = (n8) => {
                let l6 = 987654321,
                    r8 = 4294967295
                return function () {
                    return (l6 = (36969 * (l6 & 65535) + (l6 >> 16)) & r8), (n8 = (18e3 * (n8 & 65535) + (n8 >> 16)) & r8), ((((l6 << 16) + n8) & r8) / 4294967296 + 0.5) * (Math.random() > 0.5 ? 1 : -1)
                }
            }
        for (let n8 = 0, l6; n8 < t10.length; n8 += 4) {
            let r8 = s9((l6 || Math.random()) * 4294967296)
            ;(l6 = r8() * 987654071), (e6[n8 / 4] = (r8() * 4294967296) | 0)
        }
        return t10
    },
}
var S3 = {}
S3.ctrGladman = class {
    constructor(t10, e6) {
        ;(this._prf = t10), (this._initIv = e6), (this._iv = e6)
    }
    reset() {
        this._iv = this._initIv
    }
    update(t10) {
        return this.calculate(this._prf, t10, this._iv)
    }
    incWord(t10) {
        if (((t10 >> 24) & 255) === 255) {
            let e6 = (t10 >> 16) & 255,
                s9 = (t10 >> 8) & 255,
                n8 = t10 & 255
            e6 === 255 ? ((e6 = 0), s9 === 255 ? ((s9 = 0), n8 === 255 ? (n8 = 0) : ++n8) : ++s9) : ++e6, (t10 = 0), (t10 += e6 << 16), (t10 += s9 << 8), (t10 += n8)
        } else t10 += 1 << 24
        return t10
    }
    incCounter(t10) {
        ;(t10[0] = this.incWord(t10[0])) === 0 && (t10[1] = this.incWord(t10[1]))
    }
    calculate(t10, e6, s9) {
        let n8
        if (!(n8 = e6.length)) return []
        let l6 = _3.bitLength(e6)
        for (let r8 = 0; r8 < n8; r8 += 4) {
            this.incCounter(s9)
            let c7 = t10.encrypt(s9)
            ;(e6[r8] ^= c7[0]), (e6[r8 + 1] ^= c7[1]), (e6[r8 + 2] ^= c7[2]), (e6[r8 + 3] ^= c7[3])
        }
        return _3.clamp(e6, l6)
    }
}
var C5 = {
    importKey(t10) {
        return new C5.hmacSha1(y.bytes.toBits(t10))
    },
    pbkdf2(t10, e6, s9, n8) {
        if (((s9 = s9 || 1e4), n8 < 0 || s9 < 0)) throw new Error("invalid params to pbkdf2")
        let l6 = ((n8 >> 5) + 1) << 2,
            r8,
            c7,
            h7,
            f4,
            i8,
            o8 = new ArrayBuffer(l6),
            a4 = new DataView(o8),
            u6 = 0,
            b8 = _3
        for (e6 = y.bytes.toBits(e6), i8 = 1; u6 < (l6 || 1); i8++) {
            for (r8 = c7 = t10.encrypt(b8.concat(e6, [i8])), h7 = 1; h7 < s9; h7++) for (c7 = t10.encrypt(c7), f4 = 0; f4 < c7.length; f4++) r8[f4] ^= c7[f4]
            for (h7 = 0; u6 < (l6 || 1) && h7 < r8.length; h7++) a4.setInt32(u6, r8[h7]), (u6 += 4)
        }
        return o8.slice(0, n8 / 8)
    },
}
C5.hmacSha1 = class {
    constructor(t10) {
        let e6 = this,
            s9 = (e6._hash = w2.sha1),
            n8 = [[], []]
        e6._baseHash = [new s9(), new s9()]
        let l6 = e6._baseHash[0].blockSize / 32
        t10.length > l6 && (t10 = new s9().update(t10).finalize())
        for (let r8 = 0; r8 < l6; r8++) (n8[0][r8] = t10[r8] ^ 909522486), (n8[1][r8] = t10[r8] ^ 1549556828)
        e6._baseHash[0].update(n8[0]), e6._baseHash[1].update(n8[1]), (e6._resultHash = new s9(e6._baseHash[0]))
    }
    reset() {
        let t10 = this
        ;(t10._resultHash = new t10._hash(t10._baseHash[0])), (t10._updated = false)
    }
    update(t10) {
        let e6 = this
        ;(e6._updated = true), e6._resultHash.update(t10)
    }
    digest() {
        let t10 = this,
            e6 = t10._resultHash.finalize(),
            s9 = new t10._hash(t10._baseHash[1]).update(e6).finalize()
        return t10.reset(), s9
    }
    encrypt(t10) {
        if (this._updated) throw new Error("encrypt on already updated hmac called!")
        return this.update(t10), this.digest(t10)
    }
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/codec-pool.mjs
var U2 = class extends TransformStream {
    constructor() {
        let e6,
            n8 = new l2()
        super({
            transform(r8, s9) {
                n8.append(r8), s9.enqueue(r8)
            },
            flush() {
                let r8 = new Uint8Array(4)
                new DataView(r8.buffer).setUint32(0, n8.get()), (e6.value = r8)
            },
        }),
            (e6 = this)
    }
}
var Me = typeof crypto != r5 && typeof crypto.getRandomValues == g3
var w3 = "Invalid password"
var b3 = "Invalid signature"
var g4 = "zipjs-abort-check-password"
function F3(t10) {
    return Me ? crypto.getRandomValues(t10) : B2.getRandomValues(t10)
}
var I2 = 16
var Ye = "raw"
var ae = { name: "PBKDF2" }
var ze = { name: "HMAC" }
var Je = "SHA-1"
var Qe = Object.assign({ hash: ze }, ae)
var z2 = Object.assign({ iterations: 1e3, hash: { name: Je } }, ae)
var Xe = ["deriveBits"]
var L2 = [8, 12, 16]
var P2 = [16, 24, 32]
var R4 = 10
var Ze = [0, 0, 0, 0]
var G2 = typeof crypto != r5
var D2 = G2 && crypto.subtle
var ce = G2 && typeof D2 != r5
var T3 = y.bytes
var $e = z.aes
var ke = S3.ctrGladman
var et = C5.hmacSha1
var re = G2 && ce && typeof D2.importKey == g3
var se = G2 && ce && typeof D2.deriveBits == g3
var K2 = class extends TransformStream {
    constructor({ password: e6, rawPassword: n8, signed: r8, encryptionStrength: s9, checkPasswordOnly: i8 }) {
        super({
            start() {
                Object.assign(this, { ready: new Promise((o8) => (this.resolveReady = o8)), password: le(e6, n8), signed: r8, strength: s9 - 1, pending: new Uint8Array() })
            },
            async transform(o8, c7) {
                let a4 = this,
                    { password: p6, strength: l6, resolveReady: m7, ready: u6 } = a4
                p6 ? (await tt(a4, l6, p6, _4(o8, 0, L2[l6] + 2)), (o8 = _4(o8, L2[l6] + 2)), i8 ? c7.error(new Error(g4)) : m7()) : await u6
                let f4 = new Uint8Array(o8.length - R4 - ((o8.length - R4) % I2))
                c7.enqueue(ue(a4, o8, f4, 0, R4, true))
            },
            async flush(o8) {
                let { signed: c7, ctr: a4, hmac: p6, pending: l6, ready: m7 } = this
                if (p6 && a4) {
                    await m7
                    let u6 = _4(l6, 0, l6.length - R4),
                        f4 = _4(l6, l6.length - R4),
                        d5 = new Uint8Array()
                    if (u6.length) {
                        let E7 = V2(T3, u6)
                        p6.update(E7)
                        let y5 = a4.update(E7)
                        d5 = N2(T3, y5)
                    }
                    if (c7) {
                        let E7 = _4(N2(T3, p6.digest()), 0, R4)
                        for (let y5 = 0; y5 < R4; y5++) if (E7[y5] != f4[y5]) throw new Error(b3)
                    }
                    o8.enqueue(d5)
                }
            },
        })
    }
}
var x2 = class extends TransformStream {
    constructor({ password: e6, rawPassword: n8, encryptionStrength: r8 }) {
        let s9
        super({
            start() {
                Object.assign(this, { ready: new Promise((i8) => (this.resolveReady = i8)), password: le(e6, n8), strength: r8 - 1, pending: new Uint8Array() })
            },
            async transform(i8, o8) {
                let c7 = this,
                    { password: a4, strength: p6, resolveReady: l6, ready: m7 } = c7,
                    u6 = new Uint8Array()
                a4 ? ((u6 = await nt(c7, p6, a4)), l6()) : await m7
                let f4 = new Uint8Array(u6.length + i8.length - (i8.length % I2))
                f4.set(u6, 0), o8.enqueue(ue(c7, i8, f4, u6.length, 0))
            },
            async flush(i8) {
                let { ctr: o8, hmac: c7, pending: a4, ready: p6 } = this
                if (c7 && o8) {
                    await p6
                    let l6 = new Uint8Array()
                    if (a4.length) {
                        let m7 = o8.update(V2(T3, a4))
                        c7.update(m7), (l6 = N2(T3, m7))
                    }
                    ;(s9.signature = N2(T3, c7.digest()).slice(0, R4)), i8.enqueue(J(l6, s9.signature))
                }
            },
        }),
            (s9 = this)
    }
}
function ue(t10, e6, n8, r8, s9, i8) {
    let { ctr: o8, hmac: c7, pending: a4 } = t10,
        p6 = e6.length - s9
    a4.length && ((e6 = J(a4, e6)), (n8 = it(n8, p6 - (p6 % I2))))
    let l6
    for (l6 = 0; l6 <= p6 - I2; l6 += I2) {
        let m7 = V2(T3, _4(e6, l6, l6 + I2))
        i8 && c7.update(m7)
        let u6 = o8.update(m7)
        i8 || c7.update(u6), n8.set(N2(T3, u6), l6 + r8)
    }
    return (t10.pending = _4(e6, l6)), n8
}
async function tt(t10, e6, n8, r8) {
    let s9 = await fe(t10, e6, n8, _4(r8, 0, L2[e6])),
        i8 = _4(r8, L2[e6])
    if (s9[0] != i8[0] || s9[1] != i8[1]) throw new Error(w3)
}
async function nt(t10, e6, n8) {
    let r8 = F3(new Uint8Array(L2[e6])),
        s9 = await fe(t10, e6, n8, r8)
    return J(r8, s9)
}
async function fe(t10, e6, n8, r8) {
    t10.password = null
    let s9 = await rt(Ye, n8, Qe, false, Xe),
        i8 = await st(Object.assign({ salt: r8 }, z2), s9, 8 * (P2[e6] * 2 + 2)),
        o8 = new Uint8Array(i8),
        c7 = V2(T3, _4(o8, 0, P2[e6])),
        a4 = V2(T3, _4(o8, P2[e6], P2[e6] * 2)),
        p6 = _4(o8, P2[e6] * 2)
    return Object.assign(t10, { keys: { key: c7, authentication: a4, passwordVerification: p6 }, ctr: new ke(new $e(c7), Array.from(Ze)), hmac: new et(a4) }), p6
}
async function rt(t10, e6, n8, r8, s9) {
    if (re)
        try {
            return await D2.importKey(t10, e6, n8, r8, s9)
        } catch {
            return (re = false), C5.importKey(e6)
        }
    else return C5.importKey(e6)
}
async function st(t10, e6, n8) {
    if (se)
        try {
            return await D2.deriveBits(t10, e6, n8)
        } catch {
            return (se = false), C5.pbkdf2(e6, t10.salt, z2.iterations, n8)
        }
    else return C5.pbkdf2(e6, t10.salt, z2.iterations, n8)
}
function le(t10, e6) {
    return e6 === p2 ? c5(t10) : e6
}
function J(t10, e6) {
    let n8 = t10
    return t10.length + e6.length && ((n8 = new Uint8Array(t10.length + e6.length)), n8.set(t10, 0), n8.set(e6, t10.length)), n8
}
function it(t10, e6) {
    if (e6 && e6 > t10.length) {
        let n8 = t10
        ;(t10 = new Uint8Array(e6)), t10.set(n8, 0)
    }
    return t10
}
function _4(t10, e6, n8) {
    return t10.subarray(e6, n8)
}
function N2(t10, e6) {
    return t10.fromBits(e6)
}
function V2(t10, e6) {
    return t10.toBits(e6)
}
var O2 = 12
var M2 = class extends TransformStream {
    constructor({ password: e6, passwordVerification: n8, checkPasswordOnly: r8 }) {
        super({
            start() {
                Object.assign(this, { password: e6, passwordVerification: n8 }), Ee(this, e6)
            },
            transform(s9, i8) {
                let o8 = this
                if (o8.password) {
                    let c7 = me(o8, s9.subarray(0, O2))
                    if (((o8.password = null), c7[O2 - 1] != o8.passwordVerification)) throw new Error(w3)
                    s9 = s9.subarray(O2)
                }
                r8 ? i8.error(new Error(g4)) : i8.enqueue(me(o8, s9))
            },
        })
    }
}
var v3 = class extends TransformStream {
    constructor({ password: e6, passwordVerification: n8 }) {
        super({
            start() {
                Object.assign(this, { password: e6, passwordVerification: n8 }), Ee(this, e6)
            },
            transform(r8, s9) {
                let i8 = this,
                    o8,
                    c7
                if (i8.password) {
                    i8.password = null
                    let a4 = F3(new Uint8Array(O2))
                    ;(a4[O2 - 1] = i8.passwordVerification), (o8 = new Uint8Array(r8.length + a4.length)), o8.set(de(i8, a4), 0), (c7 = O2)
                } else (o8 = new Uint8Array(r8.length)), (c7 = 0)
                o8.set(de(i8, r8), c7), s9.enqueue(o8)
            },
        })
    }
}
function me(t10, e6) {
    let n8 = new Uint8Array(e6.length)
    for (let r8 = 0; r8 < e6.length; r8++) (n8[r8] = Se(t10) ^ e6[r8]), Q(t10, n8[r8])
    return n8
}
function de(t10, e6) {
    let n8 = new Uint8Array(e6.length)
    for (let r8 = 0; r8 < e6.length; r8++) (n8[r8] = Se(t10) ^ e6[r8]), Q(t10, e6[r8])
    return n8
}
function Ee(t10, e6) {
    let n8 = [305419896, 591751049, 878082192]
    Object.assign(t10, { keys: n8, crcKey0: new l2(n8[0]), crcKey2: new l2(n8[2]) })
    for (let r8 = 0; r8 < e6.length; r8++) Q(t10, e6.charCodeAt(r8))
}
function Q(t10, e6) {
    let [n8, r8, s9] = t10.keys
    t10.crcKey0.append([e6]), (n8 = ~t10.crcKey0.get()), (r8 = ye(Math.imul(ye(r8 + _e(n8)), 134775813) + 1)), t10.crcKey2.append([r8 >>> 24]), (s9 = ~t10.crcKey2.get()), (t10.keys = [n8, r8, s9])
}
function Se(t10) {
    let e6 = t10.keys[2] | 2
    return _e(Math.imul(e6, e6 ^ 1) >>> 8)
}
function _e(t10) {
    return t10 & 255
}
function ye(t10) {
    return t10 & 4294967295
}
var Te = "deflate-raw"
var B3 = class extends TransformStream {
    constructor(e6, { chunkSize: n8, CompressionStream: r8, CompressionStreamNative: s9 }) {
        super({})
        let { compressed: i8, encrypted: o8, useCompressionStream: c7, zipCrypto: a4, signed: p6, level: l6 } = e6,
            m7 = this,
            u6,
            f4,
            d5 = he(super.readable)
        ;(!o8 || a4) && p6 && ((u6 = new U2()), (d5 = h2(d5, u6))),
            i8 && (d5 = Ae(d5, c7, { level: l6, chunkSize: n8 }, s9, r8)),
            o8 && (a4 ? (d5 = h2(d5, new v3(e6))) : ((f4 = new x2(e6)), (d5 = h2(d5, f4)))),
            Re(m7, d5, () => {
                let E7
                o8 && !a4 && (E7 = f4.signature), (!o8 || a4) && p6 && (E7 = new DataView(u6.value.buffer).getUint32(0)), (m7.signature = E7)
            })
    }
}
var H2 = class extends TransformStream {
    constructor(e6, { chunkSize: n8, DecompressionStream: r8, DecompressionStreamNative: s9 }) {
        super({})
        let { zipCrypto: i8, encrypted: o8, signed: c7, signature: a4, compressed: p6, useCompressionStream: l6 } = e6,
            m7,
            u6,
            f4 = he(super.readable)
        o8 && (i8 ? (f4 = h2(f4, new M2(e6))) : ((u6 = new K2(e6)), (f4 = h2(f4, u6)))),
            p6 && (f4 = Ae(f4, l6, { chunkSize: n8 }, s9, r8)),
            (!o8 || i8) && c7 && ((m7 = new U2()), (f4 = h2(f4, m7))),
            Re(this, f4, () => {
                if ((!o8 || i8) && c7) {
                    let d5 = new DataView(m7.value.buffer)
                    if (a4 != d5.getUint32(0, false)) throw new Error(b3)
                }
            })
    }
}
function he(t10) {
    return h2(
        t10,
        new TransformStream({
            transform(e6, n8) {
                e6 && e6.length && n8.enqueue(e6)
            },
        })
    )
}
function Re(t10, e6, n8) {
    ;(e6 = h2(e6, new TransformStream({ flush: n8 }))),
        Object.defineProperty(t10, "readable", {
            get() {
                return e6
            },
        })
}
function Ae(t10, e6, n8, r8, s9) {
    try {
        let i8 = e6 && r8 ? r8 : s9
        t10 = h2(t10, new i8(Te, n8))
    } catch {
        if (e6)
            try {
                t10 = h2(t10, new s9(Te, n8))
            } catch {
                return t10
            }
        else return t10
    }
    return t10
}
function h2(t10, e6) {
    return t10.pipeThrough(e6)
}
var we = "message"
var ge = "start"
var be = "pull"
var X3 = "data"
var Ie = "ack"
var Z2 = "close"
var Oe = "deflate"
var Ce = "inflate"
var j = class extends TransformStream {
    constructor(e6, n8) {
        super({})
        let r8 = this,
            { codecType: s9 } = e6,
            i8
        s9.startsWith(Oe) ? (i8 = B3) : s9.startsWith(Ce) && (i8 = H2)
        let o8 = 0,
            c7 = 0,
            a4 = new i8(e6, n8),
            p6 = super.readable,
            l6 = new TransformStream({
                transform(u6, f4) {
                    u6 && u6.length && ((c7 += u6.length), f4.enqueue(u6))
                },
                flush() {
                    Object.assign(r8, { inputSize: c7 })
                },
            }),
            m7 = new TransformStream({
                transform(u6, f4) {
                    u6 && u6.length && ((o8 += u6.length), f4.enqueue(u6))
                },
                flush() {
                    let { signature: u6 } = a4
                    Object.assign(r8, { signature: u6, outputSize: o8, inputSize: c7 })
                },
            })
        Object.defineProperty(r8, "readable", {
            get() {
                return p6.pipeThrough(l6).pipeThrough(a4).pipeThrough(m7)
            },
        })
    }
}
var q2 = class extends TransformStream {
    constructor(e6) {
        let n8
        super({
            transform: r8,
            flush(s9) {
                n8 && n8.length && s9.enqueue(n8)
            },
        })
        function r8(s9, i8) {
            if (n8) {
                let o8 = new Uint8Array(n8.length + s9.length)
                o8.set(n8), o8.set(s9, n8.length), (s9 = o8), (n8 = null)
            }
            s9.length > e6 ? (i8.enqueue(s9.slice(0, e6)), r8(s9.slice(e6), i8)) : (n8 = s9)
        }
    }
}
var We = typeof Worker != r5
var C6 = class {
    constructor(e6, { readable: n8, writable: r8 }, { options: s9, config: i8, streamOptions: o8, useWebWorkers: c7, transferStreams: a4, scripts: p6 }, l6) {
        let { signal: m7 } = o8
        return (
            Object.assign(e6, {
                busy: true,
                readable: n8.pipeThrough(new q2(i8.chunkSize)).pipeThrough(new k4(n8, o8), { signal: m7 }),
                writable: r8,
                options: Object.assign({}, s9),
                scripts: p6,
                transferStreams: a4,
                terminate() {
                    return new Promise((u6) => {
                        let { worker: f4, busy: d5 } = e6
                        f4 ? (d5 ? (e6.resolveTerminated = u6) : (f4.terminate(), u6()), (e6.interface = null)) : u6()
                    })
                },
                onTaskFinished() {
                    let { resolveTerminated: u6 } = e6
                    u6 && ((e6.resolveTerminated = null), (e6.terminated = true), e6.worker.terminate(), u6()), (e6.busy = false), l6(e6)
                },
            }),
            (c7 && We ? ct : Le)(e6, i8)
        )
    }
}
var k4 = class extends TransformStream {
    constructor(e6, { onstart: n8, onprogress: r8, size: s9, onend: i8 }) {
        let o8 = 0
        super({
            async start() {
                n8 && (await $(n8, s9))
            },
            async transform(c7, a4) {
                ;(o8 += c7.length), r8 && (await $(r8, o8, s9)), a4.enqueue(c7)
            },
            async flush() {
                ;(e6.size = o8), i8 && (await $(i8, o8))
            },
        })
    }
}
async function $(t10, ...e6) {
    try {
        await t10(...e6)
    } catch {}
}
function Le(t10, e6) {
    return { run: () => ut(t10, e6) }
}
function ct(t10, e6) {
    let { baseURL: n8, chunkSize: r8 } = e6
    if (!t10.interface) {
        let s9
        try {
            s9 = pt(t10.scripts[0], n8, t10)
        } catch {
            return (We = false), Le(t10, e6)
        }
        Object.assign(t10, { worker: s9, interface: { run: () => ft(t10, { chunkSize: r8 }) } })
    }
    return t10.interface
}
async function ut({ options: t10, readable: e6, writable: n8, onTaskFinished: r8 }, s9) {
    try {
        let i8 = new j(t10, s9)
        await e6.pipeThrough(i8).pipeTo(n8, { preventClose: true, preventAbort: true })
        let { signature: o8, inputSize: c7, outputSize: a4 } = i8
        return { signature: o8, inputSize: c7, outputSize: a4 }
    } finally {
        r8()
    }
}
async function ft(t10, e6) {
    let n8,
        r8,
        s9 = new Promise((u6, f4) => {
            ;(n8 = u6), (r8 = f4)
        })
    Object.assign(t10, { reader: null, writer: null, resolveResult: n8, rejectResult: r8, result: s9 })
    let { readable: i8, options: o8, scripts: c7 } = t10,
        { writable: a4, closed: p6 } = lt(t10.writable),
        l6 = Y2({ type: ge, scripts: c7.slice(1), options: o8, config: e6, readable: i8, writable: a4 }, t10)
    l6 || Object.assign(t10, { reader: i8.getReader(), writer: a4.getWriter() })
    let m7 = await s9
    return l6 || (await a4.getWriter().close()), await p6, m7
}
function lt(t10) {
    let e6,
        n8 = new Promise((s9) => (e6 = s9))
    return {
        writable: new WritableStream({
            async write(s9) {
                let i8 = t10.getWriter()
                await i8.ready, await i8.write(s9), i8.releaseLock()
            },
            close() {
                e6()
            },
            abort(s9) {
                return t10.getWriter().abort(s9)
            },
        }),
        closed: n8,
    }
}
var Ue = true
var Pe = true
function pt(t10, e6, n8) {
    let r8 = { type: "module" },
        s9,
        i8
    typeof t10 == g3 && (t10 = t10())
    try {
        s9 = new URL(t10, e6)
    } catch {
        s9 = t10
    }
    if (Ue)
        try {
            i8 = new Worker(s9)
        } catch {
            ;(Ue = false), (i8 = new Worker(s9, r8))
        }
    else i8 = new Worker(s9, r8)
    return i8.addEventListener(we, (o8) => mt(o8, n8)), i8
}
function Y2(t10, { worker: e6, writer: n8, onTaskFinished: r8, transferStreams: s9 }) {
    try {
        let { value: i8, readable: o8, writable: c7 } = t10,
            a4 = []
        if ((i8 && (i8.byteLength < i8.buffer.byteLength ? (t10.value = i8.buffer.slice(0, i8.byteLength)) : (t10.value = i8.buffer), a4.push(t10.value)), s9 && Pe ? (o8 && a4.push(o8), c7 && a4.push(c7)) : (t10.readable = t10.writable = null), a4.length))
            try {
                return e6.postMessage(t10, a4), true
            } catch {
                ;(Pe = false), (t10.readable = t10.writable = null), e6.postMessage(t10)
            }
        else e6.postMessage(t10)
    } catch (i8) {
        throw (n8 && n8.releaseLock(), r8(), i8)
    }
}
async function mt({ data: t10 }, e6) {
    let { type: n8, value: r8, messageId: s9, result: i8, error: o8 } = t10,
        { reader: c7, writer: a4, resolveResult: p6, rejectResult: l6, onTaskFinished: m7 } = e6
    try {
        if (o8) {
            let { message: f4, stack: d5, code: E7, name: y5 } = o8,
                S8 = new Error(f4)
            Object.assign(S8, { stack: d5, code: E7, name: y5 }), u6(S8)
        } else {
            if (n8 == be) {
                let { value: f4, done: d5 } = await c7.read()
                Y2({ type: X3, value: f4, done: d5, messageId: s9 }, e6)
            }
            n8 == X3 && (await a4.ready, await a4.write(new Uint8Array(r8)), Y2({ type: Ie, messageId: s9 }, e6)), n8 == Z2 && u6(null, i8)
        }
    } catch (f4) {
        Y2({ type: Z2, messageId: s9 }, e6), u6(f4)
    }
    function u6(f4, d5) {
        f4 ? l6(f4) : p6(d5), a4 && a4.releaseLock(), m7()
    }
}
var A3 = []
var te = []
var Ne = 0
async function vt(t10, e6) {
    let { options: n8, config: r8 } = e6,
        { transferStreams: s9, useWebWorkers: i8, useCompressionStream: o8, codecType: c7, compressed: a4, signed: p6, encrypted: l6 } = n8,
        { workerScripts: m7, maxWorkers: u6 } = r8
    e6.transferStreams = s9 || s9 === p2
    let f4 = !a4 && !p6 && !l6 && !e6.transferStreams
    return (e6.useWebWorkers = !f4 && (i8 || (i8 === p2 && r8.useWebWorkers))), (e6.scripts = e6.useWebWorkers && m7 ? m7[c7] : []), (n8.useCompressionStream = o8 || (o8 === p2 && r8.useCompressionStream)), (await d5()).run()
    async function d5() {
        let y5 = A3.find((S8) => !S8.busy)
        if (y5) return ne(y5), new C6(y5, t10, e6, E7)
        if (A3.length < u6) {
            let S8 = { indexWorker: Ne }
            return Ne++, A3.push(S8), new C6(S8, t10, e6, E7)
        } else return new Promise((S8) => te.push({ resolve: S8, stream: t10, workerOptions: e6 }))
    }
    function E7(y5) {
        if (te.length) {
            let [{ resolve: S8, stream: Ve2, workerOptions: De4 }] = te.splice(0, 1)
            S8(new C6(y5, Ve2, De4, E7))
        } else y5.worker ? (ne(y5), dt(y5, e6)) : (A3 = A3.filter((S8) => S8 != y5))
    }
}
function dt(t10, e6) {
    let { config: n8 } = e6,
        { terminateWorkerTimeout: r8 } = n8
    Number.isFinite(r8) &&
        r8 >= 0 &&
        (t10.terminated
            ? (t10.terminated = false)
            : (t10.terminateTimeout = setTimeout(async () => {
                  A3 = A3.filter((s9) => s9 != t10)
                  try {
                      await t10.terminate()
                  } catch {}
              }, r8)))
}
function ne(t10) {
    let { terminateTimeout: e6 } = t10
    e6 && (clearTimeout(e6), (t10.terminateTimeout = null))
}
async function Bt() {
    await Promise.allSettled(A3.map((t10) => (ne(t10), t10.terminate())))
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/configuration.mjs
var i4 = class {
    constructor(t10) {
        return class extends TransformStream {
            constructor(S8, f4) {
                let a4 = new t10(f4)
                super({
                    transform(n8, s9) {
                        s9.enqueue(a4.append(n8))
                    },
                    flush(n8) {
                        let s9 = a4.flush()
                        s9 && n8.enqueue(s9)
                    },
                })
            }
        }
    }
}
var W = 64
var h3 = 2
try {
    typeof navigator != r5 && navigator.hardwareConcurrency && (h3 = navigator.hardwareConcurrency)
} catch {}
var y2 = { chunkSize: 512 * 1024, maxWorkers: h3, terminateWorkerTimeout: 5e3, useWebWorkers: true, useCompressionStream: true, workerScripts: p2, CompressionStreamNative: typeof CompressionStream != r5 && CompressionStream, DecompressionStreamNative: typeof DecompressionStream != r5 && DecompressionStream }
var e4 = Object.assign({}, y2)
function I3() {
    return e4
}
function U3(o8) {
    return Math.max(o8.chunkSize, W)
}
function b4(o8) {
    let { baseURL: t10, chunkSize: S8, maxWorkers: f4, terminateWorkerTimeout: a4, useCompressionStream: n8, useWebWorkers: s9, Deflate: k8, Inflate: w6, CompressionStream: D6, DecompressionStream: l6, workerScripts: C10 } = o8
    if ((r6("baseURL", t10), r6("chunkSize", S8), r6("maxWorkers", f4), r6("terminateWorkerTimeout", a4), r6("useCompressionStream", n8), r6("useWebWorkers", s9), k8 && (e4.CompressionStream = new i4(k8)), w6 && (e4.DecompressionStream = new i4(w6)), r6("CompressionStream", D6), r6("DecompressionStream", l6), C10 !== p2)) {
        let { deflate: m7, inflate: c7 } = C10
        if (((m7 || c7) && (e4.workerScripts || (e4.workerScripts = {})), m7)) {
            if (!Array.isArray(m7)) throw new Error("workerScripts.deflate must be an array")
            e4.workerScripts.deflate = m7
        }
        if (c7) {
            if (!Array.isArray(c7)) throw new Error("workerScripts.inflate must be an array")
            e4.workerScripts.inflate = c7
        }
    }
}
function r6(o8, t10) {
    t10 !== p2 && (e4[o8] = t10)
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/io.mjs
var io_exports = {}
__export(io_exports, {
    BlobReader: () => p3,
    BlobWriter: () => z3,
    Data64URIReader: () => R5,
    Data64URIWriter: () => x3,
    ERR_HTTP_RANGE: () => E4,
    ERR_ITERATOR_COMPLETED_TOO_SOON: () => Q2,
    HttpRangeReader: () => v4,
    HttpReader: () => N3,
    Reader: () => d2,
    SplitDataReader: () => h4,
    SplitDataWriter: () => y3,
    SplitZipReader: () => we2,
    SplitZipWriter: () => be2,
    TextReader: () => D3,
    TextWriter: () => L3,
    Uint8ArrayReader: () => q3,
    Uint8ArrayWriter: () => G3,
    Writer: () => g5,
    initReader: () => fe2,
    initStream: () => ce2,
    initWriter: () => de2,
    readUint8Array: () => S4,
})
var B4 = "HTTP error "
var E4 = "HTTP Range not supported"
var Q2 = "Writer iterator completed too soon"
var $2 = "text/plain"
var ee = "Content-Length"
var te2 = "Content-Range"
var se2 = "Accept-Ranges"
var ne2 = "Range"
var re2 = "Content-Type"
var ae2 = "HEAD"
var U4 = "GET"
var F4 = "bytes"
var ie = 64 * 1024
var P3 = "writable"
var b5 = class {
    constructor() {
        this.size = 0
    }
    init() {
        this.initialized = true
    }
}
var d2 = class extends b5 {
    get readable() {
        let e6 = this,
            { chunkSize: t10 = ie } = e6,
            n8 = new ReadableStream({
                start() {
                    this.chunkOffset = 0
                },
                async pull(r8) {
                    let { offset: i8 = 0, size: a4, diskNumberStart: c7 } = n8,
                        { chunkOffset: o8 } = this
                    r8.enqueue(await S4(e6, i8 + o8, Math.min(t10, a4 - o8), c7)), o8 + t10 > a4 ? r8.close() : (this.chunkOffset += t10)
                },
            })
        return n8
    }
}
var g5 = class extends b5 {
    constructor() {
        super()
        let e6 = this,
            t10 = new WritableStream({
                write(n8) {
                    return e6.writeUint8Array(n8)
                },
            })
        Object.defineProperty(e6, P3, {
            get() {
                return t10
            },
        })
    }
    writeUint8Array() {}
}
var R5 = class extends d2 {
    constructor(e6) {
        super()
        let t10 = e6.length
        for (; e6.charAt(t10 - 1) == "="; ) t10--
        let n8 = e6.indexOf(",") + 1
        Object.assign(this, { dataURI: e6, dataStart: n8, size: Math.floor((t10 - n8) * 0.75) })
    }
    readUint8Array(e6, t10) {
        let { dataStart: n8, dataURI: r8 } = this,
            i8 = new Uint8Array(t10),
            a4 = Math.floor(e6 / 3) * 4,
            c7 = atob(r8.substring(a4 + n8, Math.ceil((e6 + t10) / 3) * 4 + n8)),
            o8 = e6 - Math.floor(a4 / 4) * 3
        for (let u6 = o8; u6 < o8 + t10; u6++) i8[u6 - o8] = c7.charCodeAt(u6)
        return i8
    }
}
var x3 = class extends g5 {
    constructor(e6) {
        super(), Object.assign(this, { data: "data:" + (e6 || "") + ";base64,", pending: [] })
    }
    writeUint8Array(e6) {
        let t10 = this,
            n8 = 0,
            r8 = t10.pending,
            i8 = t10.pending.length
        for (t10.pending = "", n8 = 0; n8 < Math.floor((i8 + e6.length) / 3) * 3 - i8; n8++) r8 += String.fromCharCode(e6[n8])
        for (; n8 < e6.length; n8++) t10.pending += String.fromCharCode(e6[n8])
        r8.length > 2 ? (t10.data += btoa(r8)) : (t10.pending = r8)
    }
    getData() {
        return this.data + btoa(this.pending)
    }
}
var p3 = class extends d2 {
    constructor(e6) {
        super(), Object.assign(this, { blob: e6, size: e6.size })
    }
    async readUint8Array(e6, t10) {
        let n8 = this,
            r8 = e6 + t10,
            a4 = await (e6 || r8 < n8.size ? n8.blob.slice(e6, r8) : n8.blob).arrayBuffer()
        return a4.byteLength > t10 && (a4 = a4.slice(e6, r8)), new Uint8Array(a4)
    }
}
var z3 = class extends b5 {
    constructor(e6) {
        super()
        let t10 = this,
            n8 = new TransformStream(),
            r8 = []
        e6 && r8.push([re2, e6]),
            Object.defineProperty(t10, P3, {
                get() {
                    return n8.writable
                },
            }),
            (t10.blob = new Response(n8.readable, { headers: r8 }).blob())
    }
    getData() {
        return this.blob
    }
}
var D3 = class extends p3 {
    constructor(e6) {
        super(new Blob([e6], { type: $2 }))
    }
}
var L3 = class extends z3 {
    constructor(e6) {
        super(e6), Object.assign(this, { encoding: e6, utf8: !e6 || e6.toLowerCase() == "utf-8" })
    }
    async getData() {
        let { encoding: e6, utf8: t10 } = this,
            n8 = await super.getData()
        if (n8.text && t10) return n8.text()
        {
            let r8 = new FileReader()
            return new Promise((i8, a4) => {
                Object.assign(r8, { onload: ({ target: c7 }) => i8(c7.result), onerror: () => a4(r8.error) }), r8.readAsText(n8, e6)
            })
        }
    }
}
var H3 = class extends d2 {
    constructor(e6, t10) {
        super(), I4(this, e6, t10)
    }
    async init() {
        await W2(this, O3, j2), super.init()
    }
    readUint8Array(e6, t10) {
        return X4(this, e6, t10, O3, j2)
    }
}
var m4 = class extends d2 {
    constructor(e6, t10) {
        super(), I4(this, e6, t10)
    }
    async init() {
        await W2(this, _5, k5), super.init()
    }
    readUint8Array(e6, t10) {
        return X4(this, e6, t10, _5, k5)
    }
}
function I4(s9, e6, t10) {
    let { preventHeadRequest: n8, useRangeHeader: r8, forceRangeRequests: i8, combineSizeEocd: a4 } = t10
    ;(t10 = Object.assign({}, t10)), delete t10.preventHeadRequest, delete t10.useRangeHeader, delete t10.forceRangeRequests, delete t10.combineSizeEocd, delete t10.useXHR, Object.assign(s9, { url: e6, options: t10, preventHeadRequest: n8, useRangeHeader: r8, forceRangeRequests: i8, combineSizeEocd: a4 })
}
async function W2(s9, e6, t10) {
    let { url: n8, preventHeadRequest: r8, useRangeHeader: i8, forceRangeRequests: a4, combineSizeEocd: c7 } = s9
    if (oe(n8) && (i8 || a4) && (typeof r8 > "u" || r8)) {
        let o8 = await e6(U4, s9, Y3(s9, c7 ? -c4 : void 0))
        if (!a4 && o8.headers.get(se2) != F4) throw new Error(E4)
        {
            c7 && (s9.eocdCache = new Uint8Array(await o8.arrayBuffer()))
            let u6,
                l6 = o8.headers.get(te2)
            if (l6) {
                let f4 = l6.trim().split(/\s*\/\s*/)
                if (f4.length) {
                    let w6 = f4[1]
                    w6 && w6 != "*" && (u6 = Number(w6))
                }
            }
            u6 === p2 ? await M3(s9, e6, t10) : (s9.size = u6)
        }
    } else await M3(s9, e6, t10)
}
async function X4(s9, e6, t10, n8, r8) {
    let { useRangeHeader: i8, forceRangeRequests: a4, eocdCache: c7, size: o8, options: u6 } = s9
    if (i8 || a4) {
        if (c7 && e6 == o8 - c4 && t10 == c4) return c7
        let l6 = await n8(U4, s9, Y3(s9, e6, t10))
        if (l6.status != 206) throw new Error(E4)
        return new Uint8Array(await l6.arrayBuffer())
    } else {
        let { data: l6 } = s9
        return l6 || (await r8(s9, u6)), new Uint8Array(s9.data.subarray(e6, e6 + t10))
    }
}
function Y3(s9, e6 = 0, t10 = 1) {
    return Object.assign({}, C7(s9), { [ne2]: F4 + "=" + (e6 < 0 ? e6 : e6 + "-" + (e6 + t10 - 1)) })
}
function C7({ options: s9 }) {
    let { headers: e6 } = s9
    if (e6) return Symbol.iterator in e6 ? Object.fromEntries(e6) : e6
}
async function j2(s9) {
    await Z3(s9, O3)
}
async function k5(s9) {
    await Z3(s9, _5)
}
async function Z3(s9, e6) {
    let t10 = await e6(U4, s9, C7(s9))
    ;(s9.data = new Uint8Array(await t10.arrayBuffer())), s9.size || (s9.size = s9.data.length)
}
async function M3(s9, e6, t10) {
    if (s9.preventHeadRequest) await t10(s9, s9.options)
    else {
        let r8 = (await e6(ae2, s9, C7(s9))).headers.get(ee)
        r8 ? (s9.size = Number(r8)) : await t10(s9, s9.options)
    }
}
async function O3(s9, { options: e6, url: t10 }, n8) {
    let r8 = await fetch(t10, Object.assign({}, e6, { method: s9, headers: n8 }))
    if (r8.status < 400) return r8
    throw r8.status == 416 ? new Error(E4) : new Error(B4 + (r8.statusText || r8.status))
}
function _5(s9, { url: e6 }, t10) {
    return new Promise((n8, r8) => {
        let i8 = new XMLHttpRequest()
        if (
            (i8.addEventListener(
                "load",
                () => {
                    if (i8.status < 400) {
                        let a4 = []
                        i8
                            .getAllResponseHeaders()
                            .trim()
                            .split(/[\r\n]+/)
                            .forEach((c7) => {
                                let o8 = c7.trim().split(/\s*:\s*/)
                                ;(o8[0] = o8[0].trim().replace(/^[a-z]|-[a-z]/g, (u6) => u6.toUpperCase())), a4.push(o8)
                            }),
                            n8({ status: i8.status, arrayBuffer: () => i8.response, headers: new Map(a4) })
                    } else r8(i8.status == 416 ? new Error(E4) : new Error(B4 + (i8.statusText || i8.status)))
                },
                false
            ),
            i8.addEventListener("error", (a4) => r8(a4.detail ? a4.detail.error : new Error("Network error")), false),
            i8.open(s9, e6),
            t10)
        )
            for (let a4 of Object.entries(t10)) i8.setRequestHeader(a4[0], a4[1])
        ;(i8.responseType = "arraybuffer"), i8.send()
    })
}
var N3 = class extends d2 {
    constructor(e6, t10 = {}) {
        super(), Object.assign(this, { url: e6, reader: t10.useXHR ? new m4(e6, t10) : new H3(e6, t10) })
    }
    set size(e6) {}
    get size() {
        return this.reader.size
    }
    async init() {
        await this.reader.init(), super.init()
    }
    readUint8Array(e6, t10) {
        return this.reader.readUint8Array(e6, t10)
    }
}
var v4 = class extends N3 {
    constructor(e6, t10 = {}) {
        ;(t10.useRangeHeader = true), super(e6, t10)
    }
}
var q3 = class extends d2 {
    constructor(e6) {
        super(), Object.assign(this, { array: e6, size: e6.length })
    }
    readUint8Array(e6, t10) {
        return this.array.slice(e6, e6 + t10)
    }
}
var G3 = class extends g5 {
    init(e6 = 0) {
        Object.assign(this, { offset: 0, array: new Uint8Array(e6) }), super.init()
    }
    writeUint8Array(e6) {
        let t10 = this
        if (t10.offset + e6.length > t10.array.length) {
            let n8 = t10.array
            ;(t10.array = new Uint8Array(n8.length + e6.length)), t10.array.set(n8)
        }
        t10.array.set(e6, t10.offset), (t10.offset += e6.length)
    }
    getData() {
        return this.array
    }
}
var h4 = class extends d2 {
    constructor(e6) {
        super(), (this.readers = e6)
    }
    async init() {
        let e6 = this,
            { readers: t10 } = e6
        ;(e6.lastDiskNumber = 0),
            (e6.lastDiskOffset = 0),
            await Promise.all(
                t10.map(async (n8, r8) => {
                    await n8.init(), r8 != t10.length - 1 && (e6.lastDiskOffset += n8.size), (e6.size += n8.size)
                })
            ),
            super.init()
    }
    async readUint8Array(e6, t10, n8 = 0) {
        let r8 = this,
            { readers: i8 } = this,
            a4,
            c7 = n8
        c7 == -1 && (c7 = i8.length - 1)
        let o8 = e6
        for (; o8 >= i8[c7].size; ) (o8 -= i8[c7].size), c7++
        let u6 = i8[c7],
            l6 = u6.size
        if (o8 + t10 <= l6) a4 = await S4(u6, o8, t10)
        else {
            let f4 = l6 - o8
            ;(a4 = new Uint8Array(t10)), a4.set(await S4(u6, o8, f4)), a4.set(await r8.readUint8Array(e6 + f4, t10 - f4, n8), f4)
        }
        return (r8.lastDiskNumber = Math.max(c7, r8.lastDiskNumber)), a4
    }
}
var y3 = class extends b5 {
    constructor(e6, t10 = 4294967295) {
        super()
        let n8 = this
        Object.assign(n8, { diskNumber: 0, diskOffset: 0, size: 0, maxSize: t10, availableSize: t10 })
        let r8,
            i8,
            a4,
            c7 = new WritableStream({
                async write(l6) {
                    let { availableSize: f4 } = n8
                    if (a4) l6.length >= f4 ? (await o8(l6.slice(0, f4)), await u6(), (n8.diskOffset += r8.size), n8.diskNumber++, (a4 = null), await this.write(l6.slice(f4))) : await o8(l6)
                    else {
                        let { value: w6, done: V6 } = await e6.next()
                        if (V6 && !w6) throw new Error(Q2)
                        ;(r8 = w6), (r8.size = 0), r8.maxSize && (n8.maxSize = r8.maxSize), (n8.availableSize = n8.maxSize), await ce2(r8), (i8 = w6.writable), (a4 = i8.getWriter()), await this.write(l6)
                    }
                },
                async close() {
                    await a4.ready, await u6()
                },
            })
        Object.defineProperty(n8, P3, {
            get() {
                return c7
            },
        })
        async function o8(l6) {
            let f4 = l6.length
            f4 && (await a4.ready, await a4.write(l6), (r8.size += f4), (n8.size += f4), (n8.availableSize -= f4))
        }
        async function u6() {
            ;(i8.size = r8.size), await a4.close()
        }
    }
}
function oe(s9) {
    let { baseURL: e6 } = I3(),
        { protocol: t10 } = new URL(s9, e6)
    return t10 == "http:" || t10 == "https:"
}
async function ce2(s9, e6) {
    if (s9.init && !s9.initialized) await s9.init(e6)
    else return Promise.resolve()
}
function fe2(s9) {
    return Array.isArray(s9) && (s9 = new h4(s9)), s9 instanceof ReadableStream && (s9 = { readable: s9 }), s9
}
function de2(s9) {
    s9.writable === p2 && typeof s9.next == g3 && (s9 = new y3(s9)), s9 instanceof WritableStream && (s9 = { writable: s9 })
    let { writable: e6 } = s9
    return e6.size === p2 && (e6.size = 0), s9 instanceof y3 || Object.assign(s9, { diskNumber: 0, diskOffset: 0, availableSize: 1 / 0, maxSize: 1 / 0 }), s9
}
function S4(s9, e6, t10, n8) {
    return s9.readUint8Array(e6, t10, n8)
}
var we2 = h4
var be2 = y3

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/util/default-mime-type.mjs
function t7() {
    return "application/octet-stream"
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/util/stream-codec-shim.mjs
function g6(t10, a4 = {}, s9) {
    return { Deflate: u3(t10.Deflate, a4.deflate, s9), Inflate: u3(t10.Inflate, a4.inflate, s9) }
}
function h5(t10, a4) {
    return typeof Object.hasOwn === g3 ? Object.hasOwn(t10, a4) : t10.hasOwnProperty(a4)
}
function u3(t10, a4, s9) {
    return class {
        constructor(e6) {
            let n8 = this,
                f4 = (i8) => {
                    if (n8.pendingData) {
                        let r8 = n8.pendingData
                        n8.pendingData = new Uint8Array(r8.length + i8.length)
                        let { pendingData: l6 } = n8
                        l6.set(r8, 0), l6.set(i8, r8.length)
                    } else n8.pendingData = new Uint8Array(i8)
                }
            h5(e6, "level") && e6.level === p2 && delete e6.level, (n8.codec = new t10(Object.assign({}, a4, e6))), s9(n8.codec, f4)
        }
        append(e6) {
            return this.codec.push(e6), c7(this)
        }
        flush() {
            return this.codec.push(new Uint8Array(), true), c7(this)
        }
    }
    function c7(e6) {
        if (e6.pendingData) {
            let n8 = e6.pendingData
            return (e6.pendingData = null), n8
        } else return new Uint8Array()
    }
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-fs-core.mjs
var zip_fs_core_exports = {}
__export(zip_fs_core_exports, {
    fs: () => le2,
})

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-reader.mjs
var zip_reader_exports = {}
__export(zip_reader_exports, {
    ERR_BAD_FORMAT: () => et2,
    ERR_CENTRAL_DIRECTORY_NOT_FOUND: () => Ne2,
    ERR_ENCRYPTED: () => Le2,
    ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: () => Ie2,
    ERR_EOCDR_NOT_FOUND: () => pe,
    ERR_EXTRAFIELD_ZIP64_NOT_FOUND: () => Se2,
    ERR_INVALID_PASSWORD: () => w3,
    ERR_INVALID_SIGNATURE: () => b3,
    ERR_LOCAL_FILE_HEADER_NOT_FOUND: () => Pe2,
    ERR_SPLIT_ZIP_FILE: () => xt,
    ERR_UNSUPPORTED_COMPRESSION: () => Ct,
    ERR_UNSUPPORTED_ENCRYPTION: () => Ce2,
    ZipReader: () => at,
    ZipReaderStream: () => yt,
})

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-entry.mjs
var e5 = "filename"
var T4 = "rawFilename"
var A4 = "comment"
var P4 = "rawComment"
var s7 = "uncompressedSize"
var o7 = "compressedSize"
var n7 = "offset"
var t8 = "diskNumberStart"
var N4 = "lastModDate"
var c6 = "rawLastModDate"
var M4 = "lastAccessDate"
var p4 = "rawLastAccessDate"
var O4 = "creationDate"
var U5 = "rawCreationDate"
var a3 = "internalFileAttribute"
var i5 = "internalFileAttributes"
var r7 = "externalFileAttribute"
var Y4 = "externalFileAttributes"
var I5 = "msDosCompatible"
var S5 = "zip64"
var F5 = "encrypted"
var l3 = "version"
var C8 = "versionMadeBy"
var D4 = "zipCrypto"
var d3 = "directory"
var m5 = "executable"
var L4 = [e5, T4, o7, s7, N4, c6, A4, P4, M4, O4, n7, t8, t8, a3, i5, r7, Y4, I5, S5, F5, l3, C8, D4, d3, m5, "bitFlag", "signature", "filenameUTF8", "commentUTF8", "compressionMethod", "extraField", "rawExtraField", "extraFieldZip64", "extraFieldUnicodePath", "extraFieldUnicodeComment", "extraFieldAES", "extraFieldNTFS", "extraFieldExtendedTimestamp"]
var _6 = class {
    constructor(R7) {
        L4.forEach((E7) => (this[E7] = R7[E7]))
    }
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-reader.mjs
var Rt = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("")
var kt = Rt.length == 256
function Tt(r8) {
    if (kt) {
        let t10 = ""
        for (let n8 = 0; n8 < r8.length; n8++) t10 += Rt[r8[n8]]
        return t10
    } else return new TextDecoder().decode(r8)
}
function V3(r8, t10) {
    return t10 && t10.trim().toLowerCase() == "cp437" ? Tt(r8) : new TextDecoder(t10).decode(r8)
}
var et2 = "File format is not recognized"
var pe = "End of central directory not found"
var Ie2 = "End of Zip64 central directory locator not found"
var Ne2 = "Central directory header not found"
var Pe2 = "Local file header not found"
var Se2 = "Zip64 extra field not found"
var Le2 = "File contains encrypted entry"
var Ce2 = "Encryption method not supported"
var Ct = "Compression method not supported"
var xt = "Split zip file"
var bt = "utf-8"
var Mt = "cp437"
var xe = [
    [s7, _2],
    [o7, _2],
    [n7, _2],
    [t8, E3],
]
var be3 = { [E3]: { getValue: l4, bytes: 4 }, [_2]: { getValue: j3, bytes: 8 } }
var at = class {
    constructor(t10, n8 = {}) {
        Object.assign(this, { reader: fe2(t10), options: n8, config: I3() })
    }
    async *getEntriesGenerator(t10 = {}) {
        let n8 = this,
            { reader: e6 } = n8,
            { config: o8 } = n8
        if ((await ce2(e6), (e6.size === p2 || !e6.readUint8Array) && ((e6 = new p3(await new Response(e6.readable).blob())), await ce2(e6)), e6.size < c4)) throw new Error(et2)
        e6.chunkSize = U3(o8)
        let s9 = await Ye2(e6, n6, e6.size, c4, E3 * 16)
        if (!s9) {
            let h7 = await S4(e6, 0, 4),
                E7 = u4(h7)
            throw l4(E7) == N ? new Error(xt) : new Error(pe)
        }
        let i8 = u4(s9),
            c7 = l4(i8, 12),
            a4 = l4(i8, 16),
            R7 = s9.offset,
            D6 = T5(i8, 20),
            _9 = R7 + c4 + D6,
            f4 = T5(i8, 4),
            b8 = e6.lastDiskNumber || 0,
            p6 = T5(i8, 6),
            I8 = T5(i8, 8),
            A7 = 0,
            L6 = 0
        if (a4 == _2 || c7 == _2 || I8 == E3 || p6 == E3) {
            let h7 = await S4(e6, s9.offset - s5, s5),
                E7 = u4(h7)
            if (l4(E7, 0) == t6) {
                a4 = j3(E7, 8)
                let P6 = await S4(e6, a4, O, -1),
                    O6 = u4(P6),
                    C10 = s9.offset - s5 - O
                if (l4(O6, 0) != o6 && a4 != C10) {
                    let M6 = a4
                    ;(a4 = C10), (A7 = a4 - M6), (P6 = await S4(e6, a4, O, -1)), (O6 = u4(P6))
                }
                if (l4(O6, 0) != o6) throw new Error(Ie2)
                f4 == E3 && (f4 = l4(O6, 16)), p6 == E3 && (p6 = l4(O6, 20)), I8 == E3 && (I8 = j3(O6, 32)), c7 == _2 && (c7 = j3(O6, 40)), (a4 -= c7)
            }
        }
        if ((a4 >= e6.size && ((A7 = e6.size - a4 - c7 - c4), (a4 = e6.size - c7 - c4)), b8 != f4)) throw new Error(xt)
        if (a4 < 0) throw new Error(et2)
        let d5 = 0,
            w6 = await S4(e6, a4, c7, p6),
            g7 = u4(w6)
        if (c7) {
            let h7 = s9.offset - c7
            if (l4(g7, d5) != L && a4 != h7) {
                let E7 = a4
                ;(a4 = h7), (A7 += a4 - E7), (w6 = await S4(e6, a4, c7, p6)), (g7 = u4(w6))
            }
        }
        let N7 = s9.offset - a4 - (e6.lastDiskOffset || 0)
        if ((c7 != N7 && N7 >= 0 && ((c7 = N7), (w6 = await S4(e6, a4, c7, p6)), (g7 = u4(w6))), a4 < 0 || a4 >= e6.size)) throw new Error(et2)
        let W5 = F6(n8, t10, "filenameEncoding"),
            U7 = F6(n8, t10, "commentEncoding")
        for (let h7 = 0; h7 < I8; h7++) {
            let E7 = new st2(e6, o8, n8.options)
            if (l4(g7, d5) != L) throw new Error(Ne2)
            zt(E7, g7, d5 + 6)
            let P6 = !!E7.bitFlag.languageEncodingFlag,
                O6 = d5 + 46,
                C10 = O6 + E7.filenameLength,
                M6 = C10 + E7.extraFieldLength,
                B6 = T5(g7, d5 + 4),
                Z5 = B6 >> 8 == 0,
                k8 = B6 >> 8 == 3,
                S8 = w6.subarray(O6, C10),
                ot3 = T5(g7, d5 + 32),
                it4 = M6 + ot3,
                K4 = w6.subarray(M6, it4),
                ct4 = P6,
                Et3 = P6,
                q5 = l4(g7, d5 + 38),
                ft4 = (Z5 && (G4(g7, d5 + 38) & e3) == e3) || (k8 && ((q5 >> 16) & B) == B) || (S8.length && S8[S8.length - 1] == i3.charCodeAt(0)),
                Gt4 = k8 && ((q5 >> 16) & b2) == b2,
                lt4 = l4(g7, d5 + 42) + A7
            Object.assign(E7, { versionMadeBy: B6, msDosCompatible: Z5, compressedSize: 0, uncompressedSize: 0, commentLength: ot3, directory: ft4, offset: lt4, diskNumberStart: T5(g7, d5 + 34), internalFileAttributes: T5(g7, d5 + 36), externalFileAttributes: q5, rawFilename: S8, filenameUTF8: ct4, commentUTF8: Et3, rawExtraField: w6.subarray(C10, M6), executable: Gt4 }), (E7.internalFileAttribute = E7.internalFileAttributes), (E7.externalFileAttribute = E7.externalFileAttributes)
            let _t3 = F6(n8, t10, "decodeText") || V3,
                dt4 = ct4 ? bt : W5 || Mt,
                gt3 = Et3 ? bt : U7 || Mt,
                H6 = _t3(S8, dt4)
            H6 === p2 && (H6 = V3(S8, dt4))
            let J3 = _t3(K4, gt3)
            J3 === p2 && (J3 = V3(K4, gt3)), Object.assign(E7, { rawComment: K4, filename: H6, comment: J3, directory: ft4 || H6.endsWith(i3) }), (L6 = Math.max(lt4, L6)), Yt(E7, E7, g7, d5 + 6), (E7.zipCrypto = E7.encrypted && !E7.extraFieldAES)
            let Q4 = new _6(E7)
            ;(Q4.getData = (At3, Bt4) => E7.getData(At3, Q4, Bt4)), (d5 = it4)
            let { onprogress: Dt3 } = t10
            if (Dt3)
                try {
                    await Dt3(h7 + 1, I8, new _6(E7))
                } catch {}
            yield Q4
        }
        let v8 = F6(n8, t10, "extractPrependedData"),
            X6 = F6(n8, t10, "extractAppendedData")
        return v8 && (n8.prependedData = L6 > 0 ? await S4(e6, 0, L6) : new Uint8Array()), (n8.comment = D6 ? await S4(e6, R7 + c4, D6) : new Uint8Array()), X6 && (n8.appendedData = _9 < e6.size ? await S4(e6, _9, e6.size - _9) : new Uint8Array()), true
    }
    async getEntries(t10 = {}) {
        let n8 = []
        for await (let e6 of this.getEntriesGenerator(t10)) n8.push(e6)
        return n8
    }
    async close() {}
}
var yt = class {
    constructor(t10 = {}) {
        let { readable: n8, writable: e6 } = new TransformStream(),
            o8 = new at(n8, t10).getEntriesGenerator()
        ;(this.readable = new ReadableStream({
            async pull(s9) {
                let { done: i8, value: c7 } = await o8.next()
                if (i8) return s9.close()
                let a4 = {
                    ...c7,
                    readable: (function () {
                        let { readable: R7, writable: D6 } = new TransformStream()
                        if (c7.getData) return c7.getData(D6), R7
                    })(),
                }
                delete a4.getData, s9.enqueue(a4)
            },
        })),
            (this.writable = e6)
    }
}
var st2 = class {
    constructor(t10, n8, e6) {
        Object.assign(this, { reader: t10, config: n8, options: e6 })
    }
    async getData(t10, n8, e6 = {}) {
        let o8 = this,
            { reader: s9, offset: i8, diskNumberStart: c7, extraFieldAES: a4, compressionMethod: R7, config: D6, bitFlag: _9, signature: f4, rawLastModDate: b8, uncompressedSize: p6, compressedSize: I8 } = o8,
            A7 = (n8.localDirectory = {}),
            L6 = await S4(s9, i8, 30, c7),
            d5 = u4(L6),
            w6 = F6(o8, e6, "password"),
            g7 = F6(o8, e6, "rawPassword"),
            N7 = F6(o8, e6, "passThrough")
        if (((w6 = w6 && w6.length && w6), (g7 = g7 && g7.length && g7), a4 && a4.originalCompressionMethod != A2)) throw new Error(Ct)
        if (R7 != I && R7 != T2 && !N7) throw new Error(Ct)
        if (l4(d5, 0) != R3) throw new Error(Pe2)
        zt(A7, d5, 4), (A7.rawExtraField = A7.extraFieldLength ? await S4(s9, i8 + 30 + A7.filenameLength, A7.extraFieldLength, c7) : new Uint8Array()), Yt(o8, A7, d5, 4, true), Object.assign(n8, { lastAccessDate: A7.lastAccessDate, creationDate: A7.creationDate })
        let W5 = o8.encrypted && A7.encrypted && !N7,
            U7 = W5 && !a4
        if ((N7 || (n8.zipCrypto = U7), W5)) {
            if (!U7 && a4.strength === p2) throw new Error(Ce2)
            if (!w6 && !g7) throw new Error(Le2)
        }
        let v8 = i8 + 30 + A7.filenameLength + A7.extraFieldLength,
            X6 = I8,
            h7 = s9.readable
        Object.assign(h7, { diskNumberStart: c7, offset: v8, size: X6 })
        let E7 = F6(o8, e6, "signal"),
            P6 = F6(o8, e6, "checkPasswordOnly")
        P6 && (t10 = new WritableStream()), (t10 = de2(t10)), await ce2(t10, N7 ? I8 : p6)
        let { writable: O6 } = t10,
            { onstart: C10, onprogress: M6, onend: B6 } = e6,
            Z5 = { options: { codecType: Ce, password: w6, rawPassword: g7, zipCrypto: U7, encryptionStrength: a4 && a4.strength, signed: F6(o8, e6, "checkSignature") && !N7, passwordVerification: U7 && (_9.dataDescriptor ? (b8 >>> 8) & 255 : (f4 >>> 24) & 255), signature: f4, compressed: R7 != 0 && !N7, encrypted: o8.encrypted && !N7, useWebWorkers: F6(o8, e6, "useWebWorkers"), useCompressionStream: F6(o8, e6, "useCompressionStream"), transferStreams: F6(o8, e6, "transferStreams"), checkPasswordOnly: P6 }, config: D6, streamOptions: { signal: E7, size: X6, onstart: C10, onprogress: M6, onend: B6 } },
            k8 = 0
        try {
            ;({ outputSize: k8 } = await vt({ readable: h7, writable: O6 }, Z5))
        } catch (S8) {
            if (!P6 || S8.message != g4) throw S8
        } finally {
            let S8 = F6(o8, e6, "preventClose")
            ;(O6.size += k8), !S8 && !O6.locked && (await O6.getWriter().close())
        }
        return P6 ? p2 : t10.getData ? t10.getData() : O6
    }
}
function zt(r8, t10, n8) {
    let e6 = (r8.rawBitFlag = T5(t10, n8 + 2)),
        o8 = (e6 & f2) == f2,
        s9 = l4(t10, n8 + 6)
    Object.assign(r8, { encrypted: o8, version: T5(t10, n8), bitFlag: { level: (e6 & H) >> 1, dataDescriptor: (e6 & Y) == Y, languageEncodingFlag: (e6 & Z) == Z }, rawLastModDate: s9, lastModDate: Ge(s9), filenameLength: T5(t10, n8 + 22), extraFieldLength: T5(t10, n8 + 24) })
}
function Yt(r8, t10, n8, e6, o8) {
    let { rawExtraField: s9 } = t10,
        i8 = (t10.extraField = /* @__PURE__ */ new Map()),
        c7 = u4(new Uint8Array(s9)),
        a4 = 0
    try {
        for (; a4 < s9.length; ) {
            let L6 = T5(c7, a4),
                d5 = T5(c7, a4 + 2)
            i8.set(L6, { type: L6, data: s9.slice(a4 + 4, a4 + 4 + d5) }), (a4 += 4 + d5)
        }
    } catch {}
    let R7 = T5(n8, e6 + 4)
    Object.assign(t10, { signature: l4(n8, e6 + 10), uncompressedSize: l4(n8, e6 + 18), compressedSize: l4(n8, e6 + 14) })
    let D6 = i8.get(S2)
    D6 && (Me2(D6, t10), (t10.extraFieldZip64 = D6))
    let _9 = i8.get(U)
    _9 && (Ut(_9, e5, T4, t10, r8), (t10.extraFieldUnicodePath = _9))
    let f4 = i8.get(M)
    f4 && (Ut(f4, A4, P4, t10, r8), (t10.extraFieldUnicodeComment = f4))
    let b8 = i8.get(P)
    b8 ? (ye2(b8, t10, R7), (t10.extraFieldAES = b8)) : (t10.compressionMethod = R7)
    let p6 = i8.get(x)
    p6 && (Ue2(p6, t10), (t10.extraFieldNTFS = p6))
    let I8 = i8.get(G)
    I8 && (ze2(I8, t10, o8), (t10.extraFieldExtendedTimestamp = I8))
    let A7 = i8.get(X2)
    A7 && (t10.extraFieldUSDZ = A7)
}
function Me2(r8, t10) {
    t10.zip64 = true
    let n8 = u4(r8.data),
        e6 = xe.filter(([o8, s9]) => t10[o8] == s9)
    for (let o8 = 0, s9 = 0; o8 < e6.length; o8++) {
        let [i8, c7] = e6[o8]
        if (t10[i8] == c7) {
            let a4 = be3[c7]
            ;(t10[i8] = r8[i8] = a4.getValue(n8, s9)), (s9 += a4.bytes)
        } else if (r8[i8]) throw new Error(Se2)
    }
}
function Ut(r8, t10, n8, e6, o8) {
    let s9 = u4(r8.data),
        i8 = new l2()
    i8.append(o8[n8])
    let c7 = u4(new Uint8Array(4))
    c7.setUint32(0, i8.get(), true)
    let a4 = l4(s9, 1)
    Object.assign(r8, { version: G4(s9, 0), [t10]: V3(r8.data.subarray(5)), valid: !o8.bitFlag.languageEncodingFlag && a4 == l4(c7, 0) }), r8.valid && ((e6[t10] = r8[t10]), (e6[t10 + "UTF8"] = true))
}
function ye2(r8, t10, n8) {
    let e6 = u4(r8.data),
        o8 = G4(e6, 4)
    Object.assign(r8, { vendorVersion: G4(e6, 0), vendorId: G4(e6, 2), strength: o8, originalCompressionMethod: n8, compressionMethod: T5(e6, 5) }), (t10.compressionMethod = r8.compressionMethod)
}
function Ue2(r8, t10) {
    let n8 = u4(r8.data),
        e6 = 4,
        o8
    try {
        for (; e6 < r8.data.length && !o8; ) {
            let s9 = T5(n8, e6),
                i8 = T5(n8, e6 + 2)
            s9 == C4 && (o8 = r8.data.slice(e6 + 4, e6 + 4 + i8)), (e6 += 4 + i8)
        }
    } catch {}
    try {
        if (o8 && o8.length == 24) {
            let s9 = u4(o8),
                i8 = s9.getBigUint64(0, true),
                c7 = s9.getBigUint64(8, true),
                a4 = s9.getBigUint64(16, true)
            Object.assign(r8, { rawLastModDate: i8, rawLastAccessDate: c7, rawCreationDate: a4 })
            let R7 = nt2(i8),
                D6 = nt2(c7),
                _9 = nt2(a4),
                f4 = { lastModDate: R7, lastAccessDate: D6, creationDate: _9 }
            Object.assign(r8, f4), Object.assign(t10, f4)
        }
    } catch {}
}
function ze2(r8, t10, n8) {
    let e6 = u4(r8.data),
        o8 = G4(e6, 0),
        s9 = [],
        i8 = []
    n8 ? ((o8 & 1) == 1 && (s9.push(N4), i8.push(c6)), (o8 & 2) == 2 && (s9.push(M4), i8.push(p4)), (o8 & 4) == 4 && (s9.push(O4), i8.push(U5))) : r8.data.length >= 5 && (s9.push(N4), i8.push(c6))
    let c7 = 1
    s9.forEach((a4, R7) => {
        if (r8.data.length >= c7 + 4) {
            let D6 = l4(e6, c7)
            t10[a4] = r8[a4] = new Date(D6 * 1e3)
            let _9 = i8[R7]
            r8[_9] = D6
        }
        c7 += 4
    })
}
async function Ye2(r8, t10, n8, e6, o8) {
    let s9 = new Uint8Array(4),
        i8 = u4(s9)
    Be(i8, 0, t10)
    let c7 = e6 + o8
    return (await a4(e6)) || (await a4(Math.min(c7, n8)))
    async function a4(R7) {
        let D6 = n8 - R7,
            _9 = await S4(r8, D6, R7)
        for (let f4 = _9.length - e6; f4 >= 0; f4--) if (_9[f4] == s9[0] && _9[f4 + 1] == s9[1] && _9[f4 + 2] == s9[2] && _9[f4 + 3] == s9[3]) return { offset: D6 + f4, buffer: _9.slice(f4, f4 + e6).buffer }
    }
}
function F6(r8, t10, n8) {
    return t10[n8] === p2 ? r8.options[n8] : t10[n8]
}
function Ge(r8) {
    let t10 = (r8 & 4294901760) >> 16,
        n8 = r8 & 65535
    try {
        return new Date(1980 + ((t10 & 65024) >> 9), ((t10 & 480) >> 5) - 1, t10 & 31, (n8 & 63488) >> 11, (n8 & 2016) >> 5, (n8 & 31) * 2, 0)
    } catch {}
}
function nt2(r8) {
    return new Date(Number(r8 / BigInt(1e4) - BigInt(116444736e5)))
}
function G4(r8, t10) {
    return r8.getUint8(t10)
}
function T5(r8, t10) {
    return r8.getUint16(t10, true)
}
function l4(r8, t10) {
    return r8.getUint32(t10, true)
}
function j3(r8, t10) {
    return Number(r8.getBigUint64(t10, true))
}
function Be(r8, t10, n8) {
    r8.setUint32(t10, n8, true)
}
function u4(r8) {
    return new DataView(r8.buffer)
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-writer.mjs
var zip_writer_exports = {}
__export(zip_writer_exports, {
    ERR_DUPLICATED_NAME: () => Ut2,
    ERR_INVALID_COMMENT: () => Ct2,
    ERR_INVALID_ENCRYPTION_STRENGTH: () => kt2,
    ERR_INVALID_ENTRY_COMMENT: () => Pt,
    ERR_INVALID_ENTRY_NAME: () => Mt2,
    ERR_INVALID_EXTRAFIELD_DATA: () => zt2,
    ERR_INVALID_EXTRAFIELD_TYPE: () => Bt2,
    ERR_INVALID_VERSION: () => Ue3,
    ERR_UNDEFINED_UNCOMPRESSED_SIZE: () => Vt,
    ERR_UNSUPPORTED_FORMAT: () => Ie3,
    ZipWriter: () => Re2,
    ZipWriterStream: () => Me3,
})
var Ut2 = "File already exists"
var Ct2 = "Zip file comment exceeds 64KB"
var Pt = "File entry comment exceeds 64KB"
var Mt2 = "File entry name exceeds 64KB"
var Ue3 = "Version exceeds 65535"
var kt2 = "The strength must equal 1, 2, or 3"
var Bt2 = "Extra field type exceeds 65535"
var zt2 = "Extra field data exceeds 64KB"
var Ie3 = "Zip64 is not supported (make sure 'keepOrder' is set to 'true')"
var Vt = "Undefined uncompressed size"
var Ce3 = new Uint8Array([7, 0, 2, 0, 65, 69, 3, 0, 0])
var Fe = 0
var Pe3 = []
var Re2 = class {
    constructor(r8, i8 = {}) {
        r8 = de2(r8)
        let t10 = r8.availableSize !== p2 && r8.availableSize > 0 && r8.availableSize !== 1 / 0 && r8.maxSize !== p2 && r8.maxSize > 0 && r8.maxSize !== 1 / 0
        Object.assign(this, { writer: r8, addSplitZipSignature: t10, options: i8, config: I3(), files: /* @__PURE__ */ new Map(), filenames: /* @__PURE__ */ new Set(), offset: i8.offset === p2 ? r8.writable.size : i8.offset, pendingEntriesSize: 0, pendingAddFileCalls: /* @__PURE__ */ new Set(), bufferedWrites: 0 })
    }
    async add(r8 = "", i8, t10 = {}) {
        let a4 = this,
            { pendingAddFileCalls: o8, config: l6 } = a4
        Fe < l6.maxWorkers ? Fe++ : await new Promise((s9) => Pe3.push(s9))
        let f4
        try {
            if (((r8 = r8.trim()), a4.filenames.has(r8))) throw new Error(Ut2)
            return a4.filenames.add(r8), (f4 = Zt(a4, r8, i8, t10)), o8.add(f4), await f4
        } catch (s9) {
            throw (a4.filenames.delete(r8), s9)
        } finally {
            o8.delete(f4)
            let s9 = Pe3.shift()
            s9 ? s9() : Fe--
        }
    }
    async close(r8 = new Uint8Array(), i8 = {}) {
        let t10 = this,
            { pendingAddFileCalls: a4, writer: o8 } = this,
            { writable: l6 } = o8
        for (; a4.size; ) await Promise.allSettled(Array.from(a4))
        return await Jt(this, r8, i8), d4(t10, i8, "preventClose") || (await l6.getWriter().close()), o8.getData ? o8.getData() : l6
    }
}
var Me3 = class {
    constructor(r8 = {}) {
        let { readable: i8, writable: t10 } = new TransformStream()
        ;(this.readable = i8), (this.zipWriter = new Re2(t10, r8))
    }
    transform(r8) {
        let { readable: i8, writable: t10 } = new TransformStream({
            flush: () => {
                this.zipWriter.close()
            },
        })
        return this.zipWriter.add(r8, i8), { readable: this.readable, writable: t10 }
    }
    writable(r8) {
        let { readable: i8, writable: t10 } = new TransformStream()
        return this.zipWriter.add(r8, i8), t10
    }
    close(r8 = void 0, i8 = {}) {
        return this.zipWriter.close(r8, i8)
    }
}
async function Zt(e6, r8, i8, t10) {
    r8 = r8.trim()
    let a4 = d4(e6, t10, I5),
        o8 = d4(e6, t10, C8, a4 ? 20 : 768),
        l6 = d4(e6, t10, m5)
    if (o8 > E3) throw new Error(Ue3)
    let f4 = d4(e6, t10, Y4, 0)
    f4 === 0 && (f4 = d4(e6, t10, r7, 0)), !t10.directory && r8.endsWith(i3) && (t10.directory = true), d4(e6, t10, d3) ? (r8.endsWith(i3) || (r8 += i3), f4 === 0 && (a4 ? (f4 = e3) : (f4 = B << 16))) : !a4 && f4 === 0 && (l6 ? (f4 = (b2 | V) << 16) : (f4 = V << 16))
    let D6 = d4(e6, t10, "encodeText", c5),
        T7 = D6(r8)
    if ((T7 === p2 && (T7 = c5(r8)), w4(T7) > E3)) throw new Error(Mt2)
    let N7 = t10.comment || "",
        m7 = D6(N7)
    if ((m7 === p2 && (m7 = c5(N7)), w4(m7) > E3)) throw new Error(Pt)
    let A7 = d4(e6, t10, l3, d)
    if (A7 > E3) throw new Error(Ue3)
    let S8 = d4(e6, t10, N4, /* @__PURE__ */ new Date()),
        R7 = d4(e6, t10, M4),
        x6 = d4(e6, t10, O4),
        g7 = d4(e6, t10, i5, 0)
    g7 === 0 && (g7 = d4(e6, t10, a3, 0))
    let u6 = d4(e6, t10, "passThrough"),
        n8,
        y5
    u6 || ((n8 = d4(e6, t10, "password")), (y5 = d4(e6, t10, "rawPassword")))
    let P6 = d4(e6, t10, "encryptionStrength", 3),
        F8 = d4(e6, t10, D4),
        V6 = d4(e6, t10, "extendedTimestamp", true),
        c7 = d4(e6, t10, "keepOrder", true),
        I8 = d4(e6, t10, "level"),
        C10 = d4(e6, t10, "useWebWorkers"),
        h7 = d4(e6, t10, "bufferedWrite"),
        L6 = d4(e6, t10, "dataDescriptorSignature", false),
        B6 = d4(e6, t10, "signal"),
        U7 = d4(e6, t10, "useUnicodeFileNames", true),
        z6 = d4(e6, t10, "useCompressionStream"),
        O6 = d4(e6, t10, "compressionMethod"),
        Z5 = d4(e6, t10, "dataDescriptor", true),
        p6 = d4(e6, t10, S5)
    if (!F8 && (n8 !== p2 || y5 !== p2) && !(P6 >= 1 && P6 <= 3)) throw new Error(kt2)
    let G7 = new Uint8Array(),
        { extraField: $4 } = t10
    if ($4) {
        let te5 = 0,
            Q4 = 0
        $4.forEach((K4) => (te5 += 4 + w4(K4))),
            (G7 = new Uint8Array(te5)),
            $4.forEach((K4, ne5) => {
                if (ne5 > E3) throw new Error(Bt2)
                if (w4(K4) > E3) throw new Error(zt2)
                b6(G7, new Uint16Array([ne5]), Q4), b6(G7, new Uint16Array([w4(K4)]), Q4 + 2), b6(G7, K4, Q4 + 4), (Q4 += 4 + w4(K4))
            })
    }
    let q5 = 0,
        J3 = 0,
        X6 = 0
    if (u6 && (({ uncompressedSize: X6 } = t10), X6 === p2)) throw new Error(Vt)
    let W5 = p6 === true
    i8 && ((i8 = fe2(i8)), await ce2(i8), u6 ? (q5 = ke2(X6)) : i8.size === p2 ? ((Z5 = true), (p6 || p6 === p2) && ((p6 = true), (X6 = q5 = _2 + 1))) : ((X6 = i8.size), (q5 = ke2(X6))))
    let { diskOffset: le4, diskNumber: ce5, maxSize: ie4 } = e6.writer,
        ae5 = W5 || X6 > _2,
        oe3 = W5 || q5 > _2,
        fe5 = W5 || e6.offset + e6.pendingEntriesSize - le4 > _2,
        Ee4 = (d4(e6, t10, "supportZip64SplitFile", true) && W5) || ce5 + Math.ceil(e6.pendingEntriesSize / ie4) > E3
    if (fe5 || ae5 || oe3 || Ee4) {
        if (p6 === false || !c7) throw new Error(Ie3)
        p6 = true
    }
    p6 = p6 || false
    let _e4 = d4(e6, t10, F5),
        { signature: ue3 } = t10
    t10 = Object.assign({}, t10, { rawFilename: T7, rawComment: m7, version: A7, versionMadeBy: o8, lastModDate: S8, lastAccessDate: R7, creationDate: x6, rawExtraField: G7, zip64: p6, zip64UncompressedSize: ae5, zip64CompressedSize: oe3, zip64Offset: fe5, zip64DiskNumberStart: Ee4, password: n8, rawPassword: y5, level: !z6 && e6.config.CompressionStream === p2 && e6.config.CompressionStreamNative === p2 ? 0 : I8, useWebWorkers: C10, encryptionStrength: P6, extendedTimestamp: V6, zipCrypto: F8, bufferedWrite: h7, keepOrder: c7, useUnicodeFileNames: U7, dataDescriptor: Z5, dataDescriptorSignature: L6, signal: B6, msDosCompatible: a4, internalFileAttribute: g7, internalFileAttributes: g7, externalFileAttribute: f4, externalFileAttributes: f4, useCompressionStream: z6, passThrough: u6, encrypted: !!((n8 && w4(n8)) || (y5 && w4(y5))) || (u6 && _e4), signature: ue3, compressionMethod: O6 })
    let we5 = Ht(t10),
        ee4 = Xt(t10),
        de5 = w4(we5.localHeaderArray, ee4.dataDescriptorArray)
    ;(J3 = de5 + q5), e6.options.usdz && (J3 += J3 + 64), (e6.pendingEntriesSize += J3)
    let se4
    try {
        se4 = await Yt2(e6, r8, i8, { headerInfo: we5, dataDescriptorInfo: ee4, metadataSize: de5 }, t10)
    } finally {
        e6.pendingEntriesSize -= J3
    }
    return Object.assign(se4, { name: r8, comment: N7, extraField: $4 }), new _6(se4)
}
async function Yt2(e6, r8, i8, t10, a4) {
    let { files: o8, writer: l6 } = e6,
        { keepOrder: f4, dataDescriptor: s9, signal: D6 } = a4,
        { headerInfo: T7 } = t10,
        { usdz: N7 } = e6.options,
        m7 = Array.from(o8.values()).pop(),
        A7 = {},
        S8,
        R7,
        x6,
        g7,
        u6,
        n8,
        y5
    o8.set(r8, A7)
    try {
        let c7
        f4 && ((c7 = m7 && m7.lock), P6()), (a4.bufferedWrite || e6.writerLocked || (e6.bufferedWrites && f4) || !s9) && !N7 ? ((n8 = new TransformStream()), (y5 = new Response(n8.readable).blob()), (n8.writable.size = 0), (S8 = true), e6.bufferedWrites++, await ce2(l6)) : ((n8 = l6), await F8()), await ce2(n8)
        let { writable: I8 } = l6,
            { diskOffset: C10 } = l6
        if (e6.addSplitZipSignature) {
            delete e6.addSplitZipSignature
            let L6 = new Uint8Array(4),
                B6 = k6(L6)
            E5(B6, 0, N), await j4(I8, L6), (e6.offset += 4)
        }
        N7 && Gt(t10, e6.offset - C10), S8 || (await c7, await V6(I8))
        let { diskNumber: h7 } = l6
        if (((u6 = true), (A7.diskNumberStart = h7), (A7 = await vt2(i8, n8, A7, t10, e6.config, a4)), (u6 = false), o8.set(r8, A7), (A7.filename = r8), S8)) {
            await n8.writable.getWriter().close()
            let L6 = await y5
            await c7, await F8(), (g7 = true), s9 || (L6 = await jt(A7, L6, I8, a4)), await V6(I8), (A7.diskNumberStart = l6.diskNumber), (C10 = l6.diskOffset), await L6.stream().pipeTo(I8, { preventClose: true, preventAbort: true, signal: D6 }), (I8.size += L6.size), (g7 = false)
        }
        if (((A7.offset = e6.offset - C10), A7.zip64)) qt(A7, a4)
        else if (A7.offset > _2) throw new Error(Ie3)
        return (e6.offset += A7.size), A7
    } catch (c7) {
        if ((S8 && g7) || (!S8 && u6)) {
            if (((e6.hasCorruptedEntries = true), c7))
                try {
                    c7.corruptedEntry = true
                } catch {}
            S8 ? (e6.offset += n8.writable.size) : (e6.offset = n8.writable.size)
        }
        throw (o8.delete(r8), c7)
    } finally {
        S8 && e6.bufferedWrites--, x6 && x6(), R7 && R7()
    }
    function P6() {
        A7.lock = new Promise((c7) => (x6 = c7))
    }
    async function F8() {
        e6.writerLocked = true
        let { lockWriter: c7 } = e6
        ;(e6.lockWriter = new Promise(
            (I8) =>
                (R7 = () => {
                    ;(e6.writerLocked = false), I8()
                })
        )),
            await c7
    }
    async function V6(c7) {
        w4(T7.localHeaderArray) > l6.availableSize && ((l6.availableSize = 0), await j4(c7, new Uint8Array()))
    }
}
async function vt2(e6, r8, { diskNumberStart: i8, lock: t10 }, a4, o8, l6) {
    let { headerInfo: f4, dataDescriptorInfo: s9, metadataSize: D6 } = a4,
        { localHeaderArray: T7, headerArray: N7, lastModDate: m7, rawLastModDate: A7, encrypted: S8, compressed: R7, version: x6, compressionMethod: g7, rawExtraFieldExtendedTimestamp: u6, extraFieldExtendedTimestampFlag: n8, rawExtraFieldNTFS: y5, rawExtraFieldAES: P6 } = f4,
        { dataDescriptorArray: F8 } = s9,
        { rawFilename: V6, lastAccessDate: c7, creationDate: I8, password: C10, rawPassword: h7, level: L6, zip64: B6, zip64UncompressedSize: U7, zip64CompressedSize: z6, zip64Offset: O6, zip64DiskNumberStart: Z5, zipCrypto: p6, dataDescriptor: G7, directory: $4, executable: q5, versionMadeBy: J3, rawComment: X6, rawExtraField: W5, useWebWorkers: le4, onstart: ce5, onprogress: ie4, onend: ae5, signal: oe3, encryptionStrength: fe5, extendedTimestamp: Ne5, msDosCompatible: Ee4, internalFileAttributes: _e4, externalFileAttributes: ue3, useCompressionStream: we5, passThrough: ee4 } = l6,
        de5 = { lock: t10, versionMadeBy: J3, zip64: B6, directory: !!$4, executable: !!q5, filenameUTF8: true, rawFilename: V6, commentUTF8: true, rawComment: X6, rawExtraFieldExtendedTimestamp: u6, rawExtraFieldNTFS: y5, rawExtraFieldAES: P6, rawExtraField: W5, extendedTimestamp: Ne5, msDosCompatible: Ee4, internalFileAttributes: _e4, externalFileAttributes: ue3, diskNumberStart: i8 },
        { signature: se4, uncompressedSize: te5 } = l6,
        Q4 = 0
    ee4 || (te5 = 0)
    let { writable: K4 } = r8
    if (e6) {
        ;(e6.chunkSize = U3(o8)), await j4(K4, T7)
        let re6 = e6.readable,
            Ze4 = (re6.size = e6.size),
            Ye4 = { options: { codecType: Oe, level: L6, rawPassword: h7, password: C10, encryptionStrength: fe5, zipCrypto: S8 && p6, passwordVerification: S8 && p6 && (A7 >> 8) & 255, signed: !ee4, compressed: R7 && !ee4, encrypted: S8 && !ee4, useWebWorkers: le4, useCompressionStream: we5, transferStreams: false }, config: o8, streamOptions: { signal: oe3, size: Ze4, onstart: ce5, onprogress: ie4, onend: ae5 } },
            Te4 = await vt({ readable: re6, writable: K4 }, Ye4)
        ;(Q4 = Te4.outputSize), ee4 || ((te5 = Te4.inputSize), (se4 = Te4.signature)), (K4.size += te5)
    } else await j4(K4, T7)
    let ne5
    if (B6) {
        let re6 = 4
        U7 && (re6 += 8), z6 && (re6 += 8), O6 && (re6 += 8), Z5 && (re6 += 4), (ne5 = new Uint8Array(re6))
    } else ne5 = new Uint8Array()
    return Kt({ signature: se4, rawExtraFieldZip64: ne5, compressedSize: Q4, uncompressedSize: te5, headerInfo: f4, dataDescriptorInfo: s9 }, l6), G7 && (await j4(K4, F8)), Object.assign(de5, { uncompressedSize: te5, compressedSize: Q4, lastModDate: m7, rawLastModDate: A7, creationDate: I8, lastAccessDate: c7, encrypted: S8, zipCrypto: p6, size: D6 + Q4, compressionMethod: g7, version: x6, headerArray: N7, signature: se4, rawExtraFieldZip64: ne5, extraFieldExtendedTimestampFlag: n8, zip64UncompressedSize: U7, zip64CompressedSize: z6, zip64Offset: O6, zip64DiskNumberStart: Z5 }), de5
}
function Ht(e6) {
    let { rawFilename: r8, lastModDate: i8, lastAccessDate: t10, creationDate: a4, level: o8, zip64: l6, zipCrypto: f4, useUnicodeFileNames: s9, dataDescriptor: D6, directory: T7, rawExtraField: N7, encryptionStrength: m7, extendedTimestamp: A7, encrypted: S8 } = e6,
        { version: R7, compressionMethod: x6 } = e6,
        g7 = !T7 && (o8 > 0 || (o8 === p2 && x6 !== 0)),
        u6
    if (S8 && !f4) {
        u6 = new Uint8Array(w4(Ce3) + 2)
        let O6 = k6(u6)
        _7(O6, 0, P), b6(u6, Ce3, 2), ye3(O6, 8, m7)
    } else u6 = new Uint8Array()
    let n8, y5, P6
    if (A7) {
        y5 = new Uint8Array(9 + (t10 ? 4 : 0) + (a4 ? 4 : 0))
        let O6 = k6(y5)
        _7(O6, 0, G), _7(O6, 2, w4(y5) - 4), (P6 = 1 + (t10 ? 2 : 0) + (a4 ? 4 : 0)), ye3(O6, 4, P6)
        let Z5 = 5
        E5(O6, Z5, Math.floor(i8.getTime() / 1e3)), (Z5 += 4), t10 && (E5(O6, Z5, Math.floor(t10.getTime() / 1e3)), (Z5 += 4)), a4 && E5(O6, Z5, Math.floor(a4.getTime() / 1e3))
        try {
            n8 = new Uint8Array(36)
            let p6 = k6(n8),
                G7 = De(i8)
            _7(p6, 0, x), _7(p6, 2, 32), _7(p6, 8, C4), _7(p6, 10, 24), v5(p6, 12, G7), v5(p6, 20, De(t10) || G7), v5(p6, 28, De(a4) || G7)
        } catch {
            n8 = new Uint8Array()
        }
    } else n8 = y5 = new Uint8Array()
    let F8 = 0
    s9 && (F8 = F8 | Z), D6 && (F8 = F8 | Y), x6 === p2 && (x6 = g7 ? T2 : I), x6 == T2 && (o8 >= 1 && o8 < 3 && (F8 = F8 | 6), o8 >= 3 && o8 < 5 && (F8 = F8 | 1), o8 === 9 && (F8 = F8 | 2)), l6 && (R7 = R7 > K ? R7 : K), S8 && ((F8 = F8 | f2), f4 || ((R7 = R7 > a2 ? R7 : a2), (u6[9] = x6), (x6 = A2)))
    let V6 = new Uint8Array(26),
        c7 = k6(V6)
    _7(c7, 0, R7), _7(c7, 2, F8), _7(c7, 4, x6)
    let I8 = new Uint32Array(1),
        C10 = k6(I8),
        h7
    i8 < w ? (h7 = w) : i8 > u2 ? (h7 = u2) : (h7 = i8), _7(C10, 0, (((h7.getHours() << 6) | h7.getMinutes()) << 5) | (h7.getSeconds() / 2)), _7(C10, 2, ((((h7.getFullYear() - 1980) << 4) | (h7.getMonth() + 1)) << 5) | h7.getDate())
    let L6 = I8[0]
    E5(c7, 6, L6), _7(c7, 22, w4(r8))
    let B6 = w4(u6, y5, n8, N7)
    _7(c7, 24, B6)
    let U7 = new Uint8Array(30 + w4(r8) + B6),
        z6 = k6(U7)
    return E5(z6, 0, R3), b6(U7, V6, 4), b6(U7, r8, 30), b6(U7, u6, 30 + w4(r8)), b6(U7, y5, 30 + w4(r8, u6)), b6(U7, n8, 30 + w4(r8, u6, y5)), b6(U7, N7, 30 + w4(r8, u6, y5, n8)), { localHeaderArray: U7, headerArray: V6, headerView: c7, lastModDate: i8, rawLastModDate: L6, encrypted: S8, compressed: g7, version: R7, compressionMethod: x6, extraFieldExtendedTimestampFlag: P6, rawExtraFieldExtendedTimestamp: y5, rawExtraFieldNTFS: n8, rawExtraFieldAES: u6, extraFieldLength: B6 }
}
function Gt(e6, r8) {
    let { headerInfo: i8 } = e6,
        { localHeaderArray: t10, extraFieldLength: a4 } = i8,
        o8 = k6(t10),
        l6 = 64 - ((r8 + w4(t10)) % 64)
    l6 < 4 && (l6 += 64)
    let f4 = new Uint8Array(l6),
        s9 = k6(f4)
    _7(s9, 0, X2), _7(s9, 2, l6 - 2)
    let D6 = t10
    ;(i8.localHeaderArray = t10 = new Uint8Array(w4(D6) + l6)), b6(t10, D6), b6(t10, f4, w4(D6)), (o8 = k6(t10)), _7(o8, 28, a4 + l6), (e6.metadataSize += l6)
}
function Xt(e6) {
    let { zip64: r8, dataDescriptor: i8, dataDescriptorSignature: t10 } = e6,
        a4 = new Uint8Array(),
        o8,
        l6 = 0
    return i8 && ((a4 = new Uint8Array(r8 ? (t10 ? 24 : 20) : t10 ? 16 : 12)), (o8 = k6(a4)), t10 && ((l6 = 4), E5(o8, 0, D))), { dataDescriptorArray: a4, dataDescriptorView: o8, dataDescriptorOffset: l6 }
}
function Kt(e6, r8) {
    let { signature: i8, rawExtraFieldZip64: t10, compressedSize: a4, uncompressedSize: o8, headerInfo: l6, dataDescriptorInfo: f4 } = e6,
        { headerView: s9, encrypted: D6 } = l6,
        { dataDescriptorView: T7, dataDescriptorOffset: N7 } = f4,
        { zip64: m7, zip64UncompressedSize: A7, zip64CompressedSize: S8, zipCrypto: R7, dataDescriptor: x6 } = r8
    if (((!D6 || R7) && i8 !== p2 && (E5(s9, 10, i8), x6 && E5(T7, N7, i8)), m7)) {
        let g7 = k6(t10)
        _7(g7, 0, S2), _7(g7, 2, w4(t10) - 4)
        let u6 = 4
        A7 && (E5(s9, 18, _2), v5(g7, u6, BigInt(o8)), (u6 += 8)), S8 && (E5(s9, 14, _2), v5(g7, u6, BigInt(a4))), x6 && (v5(T7, N7 + 4, BigInt(a4)), v5(T7, N7 + 12, BigInt(o8)))
    } else E5(s9, 14, a4), E5(s9, 18, o8), x6 && (E5(T7, N7 + 4, a4), E5(T7, N7 + 8, o8))
}
async function jt(e6, r8, i8, { zipCrypto: t10 }) {
    let a4
    ;(a4 = await r8.slice(0, 26).arrayBuffer()), a4.byteLength != 26 && (a4 = a4.slice(0, 26))
    let o8 = new DataView(a4)
    return (!e6.encrypted || t10) && E5(o8, 14, e6.signature), e6.zip64 ? (E5(o8, 18, _2), E5(o8, 22, _2)) : (E5(o8, 18, e6.compressedSize), E5(o8, 22, e6.uncompressedSize)), await j4(i8, new Uint8Array(a4)), r8.slice(a4.byteLength)
}
function qt(e6, r8) {
    let { rawExtraFieldZip64: i8, offset: t10, diskNumberStart: a4 } = e6,
        { zip64UncompressedSize: o8, zip64CompressedSize: l6, zip64Offset: f4, zip64DiskNumberStart: s9 } = r8,
        D6 = k6(i8),
        T7 = 4
    o8 && (T7 += 8), l6 && (T7 += 8), f4 && (v5(D6, T7, BigInt(t10)), (T7 += 8)), s9 && E5(D6, T7, a4)
}
async function Jt(e6, r8, i8) {
    let { files: t10, writer: a4 } = e6,
        { diskOffset: o8, writable: l6 } = a4,
        { diskNumber: f4 } = a4,
        s9 = 0,
        D6 = 0,
        T7 = e6.offset - o8,
        N7 = t10.size
    for (let [, P6] of t10) {
        let { rawFilename: F8, rawExtraFieldZip64: V6, rawExtraFieldAES: c7, rawComment: I8, rawExtraFieldNTFS: C10, rawExtraField: h7, extendedTimestamp: L6, extraFieldExtendedTimestampFlag: B6, lastModDate: U7 } = P6,
            z6
        if (L6) {
            z6 = new Uint8Array(9)
            let O6 = k6(z6)
            _7(O6, 0, G), _7(O6, 2, 5), ye3(O6, 4, B6), E5(O6, 5, Math.floor(U7.getTime() / 1e3))
        } else z6 = new Uint8Array()
        ;(P6.rawExtraFieldCDExtendedTimestamp = z6), (D6 += 46 + w4(F8, I8, V6, c7, C10, z6, h7))
    }
    let m7 = new Uint8Array(D6),
        A7 = k6(m7)
    await ce2(a4)
    let S8 = 0
    for (let [P6, F8] of Array.from(t10.values()).entries()) {
        let { offset: V6, rawFilename: c7, rawExtraFieldZip64: I8, rawExtraFieldAES: C10, rawExtraFieldCDExtendedTimestamp: h7, rawExtraFieldNTFS: L6, rawExtraField: B6, rawComment: U7, versionMadeBy: z6, headerArray: O6, zip64: Z5, zip64UncompressedSize: p6, zip64CompressedSize: G7, zip64DiskNumberStart: $4, zip64Offset: q5, internalFileAttributes: J3, externalFileAttributes: X6, diskNumberStart: W5, uncompressedSize: le4, compressedSize: ce5 } = F8,
            ie4 = w4(I8, C10, h7, L6, B6)
        E5(A7, s9, L), _7(A7, s9 + 4, z6)
        let ae5 = k6(O6)
        p6 || E5(ae5, 18, le4), G7 || E5(ae5, 14, ce5), b6(m7, O6, s9 + 6), _7(A7, s9 + 30, ie4), _7(A7, s9 + 32, w4(U7)), _7(A7, s9 + 34, Z5 && $4 ? E3 : W5), _7(A7, s9 + 36, J3), X6 && E5(A7, s9 + 38, X6), E5(A7, s9 + 42, Z5 && q5 ? _2 : V6), b6(m7, c7, s9 + 46), b6(m7, I8, s9 + 46 + w4(c7)), b6(m7, C10, s9 + 46 + w4(c7, I8)), b6(m7, h7, s9 + 46 + w4(c7, I8, C10)), b6(m7, L6, s9 + 46 + w4(c7, I8, C10, h7)), b6(m7, B6, s9 + 46 + w4(c7, I8, C10, h7, L6)), b6(m7, U7, s9 + 46 + w4(c7) + ie4)
        let oe3 = 46 + w4(c7, U7) + ie4
        if ((s9 - S8 > a4.availableSize && ((a4.availableSize = 0), await j4(l6, m7.slice(S8, s9)), (S8 = s9)), (s9 += oe3), i8.onprogress))
            try {
                await i8.onprogress(P6 + 1, t10.size, new _6(F8))
            } catch {}
    }
    await j4(l6, S8 ? m7.slice(S8) : m7)
    let R7 = a4.diskNumber,
        { availableSize: x6 } = a4
    x6 < c4 && R7++
    let g7 = d4(e6, i8, S5)
    if (T7 > _2 || D6 > _2 || N7 > E3 || R7 > E3) {
        if (g7 === false) throw new Error(Ie3)
        g7 = true
    }
    let u6 = new Uint8Array(g7 ? F2 : c4),
        n8 = k6(u6)
    ;(s9 = 0), g7 && (E5(n8, 0, o6), v5(n8, 4, BigInt(44)), _7(n8, 12, 45), _7(n8, 14, 45), E5(n8, 16, R7), E5(n8, 20, f4), v5(n8, 24, BigInt(N7)), v5(n8, 32, BigInt(N7)), v5(n8, 40, BigInt(D6)), v5(n8, 48, BigInt(T7)), E5(n8, 56, t6), v5(n8, 64, BigInt(T7) + BigInt(D6)), E5(n8, 72, R7 + 1), d4(e6, i8, "supportZip64SplitFile", true) && ((R7 = E3), (f4 = E3)), (N7 = E3), (T7 = _2), (D6 = _2), (s9 += O + s5)), E5(n8, s9, n6), _7(n8, s9 + 4, R7), _7(n8, s9 + 6, f4), _7(n8, s9 + 8, N7), _7(n8, s9 + 10, N7), E5(n8, s9 + 12, D6), E5(n8, s9 + 16, T7)
    let y5 = w4(r8)
    if (y5)
        if (y5 <= E3) _7(n8, s9 + 20, y5)
        else throw new Error(Ct2)
    await j4(l6, u6), y5 && (await j4(l6, r8))
}
async function j4(e6, r8) {
    let i8 = e6.getWriter()
    try {
        await i8.ready, (e6.size += w4(r8)), await i8.write(r8)
    } finally {
        i8.releaseLock()
    }
}
function De(e6) {
    if (e6) return (BigInt(e6.getTime()) + BigInt(116444736e5)) * BigInt(1e4)
}
function d4(e6, r8, i8, t10) {
    let a4 = r8[i8] === p2 ? e6.options[i8] : r8[i8]
    return a4 === p2 ? t10 : a4
}
function ke2(e6) {
    return e6 + 5 * (Math.floor(e6 / 16383) + 1)
}
function ye3(e6, r8, i8) {
    e6.setUint8(r8, i8)
}
function _7(e6, r8, i8) {
    e6.setUint16(r8, i8, true)
}
function E5(e6, r8, i8) {
    e6.setUint32(r8, i8, true)
}
function v5(e6, r8, i8) {
    e6.setBigUint64(r8, i8, true)
}
function b6(e6, r8, i8) {
    e6.set(r8, i8)
}
function k6(e6) {
    return new DataView(e6.buffer)
}
function w4(...e6) {
    let r8 = 0
    return e6.forEach((i8) => i8 && (r8 += i8.length)), r8
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/core/zip-fs-core.mjs
var x4 = class {
    constructor(e6, t10, r8, a4) {
        let n8 = this
        if (e6.root && a4 && a4.getChildByName(t10)) throw new Error("Entry filename already exists")
        r8 || (r8 = {}), Object.assign(n8, { fs: e6, name: t10, data: r8.data, options: r8.options, id: e6.entries.length, parent: a4, children: [], uncompressedSize: r8.uncompressedSize || 0, passThrough: r8.passThrough }), e6.entries.push(n8), a4 && n8.parent.children.push(n8)
    }
    moveTo(e6) {
        let t10 = this
        t10.fs.move(t10, e6)
    }
    getFullname() {
        return this.getRelativeName()
    }
    getRelativeName(e6 = this.fs.root) {
        let t10 = this,
            r8 = t10.name,
            a4 = t10.parent
        for (; a4 && a4 != e6; ) (r8 = (a4.name ? a4.name + "/" : "") + r8), (a4 = a4.parent)
        return r8
    }
    isDescendantOf(e6) {
        let t10 = this.parent
        for (; t10 && t10.id != e6.id; ) t10 = t10.parent
        return !!t10
    }
    rename(e6) {
        let t10 = this.parent
        if (t10 && t10.getChildByName(e6)) throw new Error("Entry filename already exists")
        this.name = e6
    }
}
var S6 = class i6 extends x4 {
    constructor(e6, t10, r8, a4) {
        super(e6, t10, r8, a4)
        let n8 = this
        ;(n8.Reader = r8.Reader), (n8.Writer = r8.Writer), r8.getData && (n8.getData = r8.getData)
    }
    clone() {
        return new i6(this.fs, this.name, this)
    }
    async getData(e6, t10 = {}) {
        let r8 = this
        if (!e6 || (e6.constructor == r8.Writer && r8.data)) return r8.data
        {
            let a4 = (r8.reader = new r8.Reader(r8.data, t10)),
                n8 = r8.data ? r8.data.uncompressedSize : a4.size
            await Promise.all([ce2(a4), ce2(e6, n8)])
            let o8 = a4.readable
            return (o8.size = r8.uncompressedSize = a4.size), await o8.pipeTo(e6.writable), e6.getData ? e6.getData() : e6.writable
        }
    }
    isPasswordProtected() {
        return this.data.encrypted
    }
    async checkPassword(e6, t10 = {}) {
        let r8 = this
        if (r8.isPasswordProtected()) {
            ;(t10.password = e6), (t10.checkPasswordOnly = true)
            try {
                return await r8.data.getData(null, t10), true
            } catch (a4) {
                if (a4.message == w3) return false
                throw a4
            }
        } else return true
    }
    getText(e6, t10) {
        return this.getData(new L3(e6), t10)
    }
    getBlob(e6, t10) {
        return this.getData(new z3(e6), t10)
    }
    getData64URI(e6, t10) {
        return this.getData(new x3(e6), t10)
    }
    getUint8Array(e6) {
        return this.getData(new G3(), e6)
    }
    getWritable(e6 = new WritableStream(), t10) {
        return this.getData({ writable: e6 }, t10)
    }
    replaceBlob(e6) {
        Object.assign(this, { data: e6, Reader: p3, Writer: z3, reader: null })
    }
    replaceText(e6) {
        Object.assign(this, { data: e6, Reader: D3, Writer: L3, reader: null })
    }
    replaceData64URI(e6) {
        Object.assign(this, { data: e6, Reader: R5, Writer: x3, reader: null })
    }
    replaceUint8Array(e6) {
        Object.assign(this, { data: e6, Reader: q3, Writer: G3, reader: null })
    }
    replaceReadable(e6) {
        Object.assign(this, {
            data: null,
            Reader: function () {
                return { readable: e6 }
            },
            Writer: null,
            reader: null,
        })
    }
}
var y4 = class i7 extends x4 {
    constructor(e6, t10, r8, a4) {
        super(e6, t10, r8, a4), (this.directory = true)
    }
    clone(e6) {
        let t10 = this,
            r8 = new i7(t10.fs, t10.name)
        return (
            e6 &&
                (r8.children = t10.children.map((a4) => {
                    let n8 = a4.clone(e6)
                    return (n8.parent = r8), n8
                })),
            r8
        )
    }
    addDirectory(e6, t10) {
        return l5(this, e6, { options: t10 }, true)
    }
    addText(e6, t10, r8 = {}) {
        return l5(this, e6, { data: t10, Reader: D3, Writer: L3, options: r8, uncompressedSize: t10.length })
    }
    addBlob(e6, t10, r8 = {}) {
        return l5(this, e6, { data: t10, Reader: p3, Writer: z3, options: r8, uncompressedSize: t10.size })
    }
    addData64URI(e6, t10, r8 = {}) {
        let a4 = t10.length
        for (; t10.charAt(a4 - 1) == "="; ) a4--
        let n8 = t10.indexOf(",") + 1
        return l5(this, e6, { data: t10, Reader: R5, Writer: x3, options: r8, uncompressedSize: Math.floor((a4 - n8) * 0.75) })
    }
    addUint8Array(e6, t10, r8 = {}) {
        return l5(this, e6, { data: t10, Reader: q3, Writer: G3, options: r8, uncompressedSize: t10.length })
    }
    addHttpContent(e6, t10, r8 = {}) {
        return l5(this, e6, {
            data: t10,
            Reader: class extends N3 {
                constructor(a4) {
                    super(a4, r8)
                }
            },
            options: r8,
        })
    }
    addReadable(e6, t10, r8 = {}) {
        return l5(this, e6, {
            Reader: function () {
                return { readable: t10 }
            },
            options: r8,
        })
    }
    addFileSystemEntry(e6, t10 = {}) {
        return N5(this, e6, t10)
    }
    addFileSystemHandle(e6, t10 = {}) {
        return N5(this, e6, t10)
    }
    addFile(e6, t10 = {}) {
        return (
            t10.lastModDate || (t10.lastModDate = new Date(e6.lastModified)),
            l5(this, e6.name, {
                data: e6,
                Reader: function () {
                    let r8 = e6.stream(),
                        a4 = e6.size
                    return { readable: r8, size: a4 }
                },
                options: t10,
                uncompressedSize: e6.size,
            })
        )
    }
    addData(e6, t10) {
        return l5(this, e6, t10)
    }
    importBlob(e6, t10) {
        return this.importZip(new p3(e6), t10)
    }
    importData64URI(e6, t10) {
        return this.importZip(new R5(e6), t10)
    }
    importUint8Array(e6, t10) {
        return this.importZip(new q3(e6), t10)
    }
    importHttpContent(e6, t10) {
        return this.importZip(new N3(e6, t10), t10)
    }
    importReadable(e6, t10) {
        return this.importZip({ readable: e6 }, t10)
    }
    exportBlob(e6 = {}) {
        return this.exportZip(new z3(e6.mimeType || "application/zip"), e6)
    }
    exportData64URI(e6 = {}) {
        return this.exportZip(new x3(e6.mimeType || "application/zip"), e6)
    }
    exportUint8Array(e6 = {}) {
        return this.exportZip(new G3(), e6)
    }
    async exportWritable(e6 = new WritableStream(), t10 = {}) {
        return await this.exportZip({ writable: e6 }, t10), e6
    }
    async importZip(e6, t10 = {}) {
        await ce2(e6)
        let r8 = new at(e6, t10),
            a4 = [],
            n8 = await r8.getEntries()
        for (let o8 of n8) {
            let s9 = this
            try {
                let d5 = o8.filename.split("/"),
                    u6 = d5.pop()
                d5.forEach((p6, c7) => {
                    let w6 = s9
                    ;(s9 = s9.getChildByName(p6)), s9 || ((s9 = new i7(this.fs, p6, { data: c7 == d5.length - 1 ? o8 : null }, w6)), a4.push(s9))
                }),
                    o8.directory || a4.push(l5(s9, u6, { data: o8, Reader: re3(Object.assign({}, t10)), uncompressedSize: o8.uncompressedSize, passThrough: t10.passThrough }))
            } catch (d5) {
                try {
                    d5.cause = { entry: o8 }
                } catch {}
                throw d5
            }
        }
        return a4
    }
    async exportZip(e6, t10) {
        let r8 = this
        t10.bufferedWrite === p2 && (t10.bufferedWrite = true), await Promise.all([H4(r8, t10.readerOptions), ce2(e6)])
        let a4 = new Re2(e6, t10)
        return await ae3(a4, r8, te3([r8], "uncompressedSize"), t10), await a4.close(), e6.getData ? e6.getData() : e6.writable
    }
    getChildByName(e6) {
        let t10 = this.children
        for (let r8 = 0; r8 < t10.length; r8++) {
            let a4 = t10[r8]
            if (a4.name == e6) return a4
        }
    }
    isPasswordProtected() {
        let e6 = this.children
        for (let t10 = 0; t10 < e6.length; t10++) if (e6[t10].isPasswordProtected()) return true
        return false
    }
    async checkPassword(e6, t10 = {}) {
        let r8 = this.children
        return !(await Promise.all(r8.map((n8) => n8.checkPassword(e6, t10)))).includes(false)
    }
}
var A5 = class {
    constructor() {
        h6(this)
    }
    get children() {
        return this.root.children
    }
    remove(e6) {
        v6(e6), (this.entries[e6.id] = null)
    }
    move(e6, t10) {
        if (e6 == this.root) throw new Error("Root directory cannot be moved")
        if (t10.directory) {
            if (t10.isDescendantOf(e6)) throw new Error("Entry is a ancestor of target entry")
            if (e6 != t10) {
                if (t10.getChildByName(e6.name)) throw new Error("Entry filename already exists")
                v6(e6), (e6.parent = t10), t10.children.push(e6)
            }
        } else throw new Error("Target entry is not a directory")
    }
    find(e6) {
        let t10 = e6.split("/"),
            r8 = this.root
        for (let a4 = 0; r8 && a4 < t10.length; a4++) r8 = r8.getChildByName(t10[a4])
        return r8
    }
    getById(e6) {
        return this.entries[e6]
    }
    getChildByName(e6) {
        return this.root.getChildByName(e6)
    }
    addDirectory(e6, t10) {
        return this.root.addDirectory(e6, t10)
    }
    addText(e6, t10, r8) {
        return this.root.addText(e6, t10, r8)
    }
    addBlob(e6, t10, r8) {
        return this.root.addBlob(e6, t10, r8)
    }
    addData64URI(e6, t10, r8) {
        return this.root.addData64URI(e6, t10, r8)
    }
    addUint8Array(e6, t10, r8) {
        return this.root.addUint8Array(e6, t10, r8)
    }
    addHttpContent(e6, t10, r8) {
        return this.root.addHttpContent(e6, t10, r8)
    }
    addReadable(e6, t10, r8) {
        return this.root.addReadable(e6, t10, r8)
    }
    addFileSystemEntry(e6, t10) {
        return this.root.addFileSystemEntry(e6, t10)
    }
    addFileSystemHandle(e6, t10) {
        return this.root.addFileSystemHandle(e6, t10)
    }
    addFile(e6, t10) {
        return this.root.addFile(e6, t10)
    }
    addData(e6, t10) {
        return this.root.addData(e6, t10)
    }
    importBlob(e6, t10) {
        return h6(this), this.root.importBlob(e6, t10)
    }
    importData64URI(e6, t10) {
        return h6(this), this.root.importData64URI(e6, t10)
    }
    importUint8Array(e6, t10) {
        return h6(this), this.root.importUint8Array(e6, t10)
    }
    importHttpContent(e6, t10) {
        return h6(this), this.root.importHttpContent(e6, t10)
    }
    importReadable(e6, t10) {
        return h6(this), this.root.importReadable(e6, t10)
    }
    importZip(e6, t10) {
        return this.root.importZip(e6, t10)
    }
    exportBlob(e6) {
        return this.root.exportBlob(e6)
    }
    exportData64URI(e6) {
        return this.root.exportData64URI(e6)
    }
    exportUint8Array(e6) {
        return this.root.exportUint8Array(e6)
    }
    exportWritable(e6, t10) {
        return this.root.exportWritable(e6, t10)
    }
    isPasswordProtected() {
        return this.root.isPasswordProtected()
    }
    checkPassword(e6, t10) {
        return this.root.checkPassword(e6, t10)
    }
}
var le2 = { FS: A5, ZipDirectoryEntry: y4, ZipFileEntry: S6 }
function te3(i8, e6) {
    let t10 = 0
    return i8.forEach(r8), t10
    function r8(a4) {
        ;(t10 += a4[e6]), a4.children && a4.children.forEach(r8)
    }
}
function re3(i8) {
    return class extends d2 {
        constructor(e6, t10 = {}) {
            super(), (this.entry = e6), (this.options = t10)
        }
        async init() {
            let e6 = this
            e6.size = e6.entry.uncompressedSize
            let t10 = await e6.entry.getData(new z3(), Object.assign({}, e6.options, i8))
            ;(e6.data = t10), (e6.blobReader = new p3(t10)), super.init()
        }
        readUint8Array(e6, t10) {
            return this.blobReader.readUint8Array(e6, t10)
        }
    }
}
async function H4(i8, e6) {
    i8.children.length &&
        (await Promise.all(
            i8.children.map(async (t10) => {
                if (t10.directory) await H4(t10, e6)
                else {
                    let r8 = (t10.reader = new t10.Reader(t10.data, e6))
                    try {
                        await ce2(r8)
                    } catch (a4) {
                        try {
                            ;(a4.entryId = t10.id), (a4.cause = { entry: t10 })
                        } catch {}
                        throw a4
                    }
                    t10.uncompressedSize = r8.size
                }
            })
        ))
}
function v6(i8) {
    if (i8.parent) {
        let e6 = i8.parent.children
        e6.forEach((t10, r8) => {
            t10.id == i8.id && e6.splice(r8, 1)
        })
    }
}
async function ae3(i8, e6, t10, r8) {
    let a4 = e6,
        n8 = /* @__PURE__ */ new Map()
    await o8(i8, e6)
    async function o8(s9, d5) {
        await u6()
        async function u6() {
            if (r8.bufferedWrite) await Promise.allSettled(d5.children.map(p6))
            else for (let c7 of d5.children) await p6(c7)
        }
        async function p6(c7) {
            let w6 = r8.relativePath ? c7.getRelativeName(a4) : c7.getFullname(),
                k8 = c7.options || {},
                g7 = {}
            if (c7.data instanceof _6) {
                let { externalFileAttributes: E7, versionMadeBy: R7, comment: P6, lastModDate: M6, creationDate: _9, lastAccessDate: L6, uncompressedSize: V6, encrypted: q5, zipCrypto: G7, signature: J3, compressionMethod: F8, extraFieldAES: O6 } = c7.data
                if (((g7 = { externalFileAttributes: E7, versionMadeBy: R7, comment: P6, lastModDate: M6, creationDate: _9, lastAccessDate: L6 }), c7.passThrough)) {
                    let T7, C10
                    F8 === 0 && (T7 = 0), O6 && (C10 = O6.strength), (g7 = Object.assign(g7, { passThrough: true, encrypted: q5, zipCrypto: G7, signature: J3, uncompressedSize: V6, level: T7, encryptionStrength: C10, compressionMethod: F8 }))
                }
            }
            await s9.add(
                w6,
                c7.reader,
                Object.assign(
                    { directory: c7.directory },
                    Object.assign({}, r8, g7, k8, {
                        onprogress: async (E7) => {
                            if (r8.onprogress) {
                                n8.set(w6, E7)
                                try {
                                    await r8.onprogress(
                                        Array.from(n8.values()).reduce((R7, P6) => R7 + P6),
                                        t10
                                    )
                                } catch {}
                            }
                        },
                    })
                )
            ),
                await o8(s9, c7)
        }
    }
}
function N5(i8, e6, t10) {
    return r8(i8, e6, [])
    async function r8(a4, n8, o8) {
        if (n8)
            try {
                if (((n8.isFile || n8.isDirectory) && (n8 = await j5(n8)), n8.kind == "file")) {
                    let s9 = await n8.getFile()
                    o8.push(
                        a4.addData(s9.name, {
                            Reader: function () {
                                let d5 = s9.stream(),
                                    u6 = s9.size
                                return { readable: d5, size: u6 }
                            },
                            options: Object.assign({}, { lastModDate: new Date(s9.lastModified) }, t10),
                            uncompressedSize: s9.size,
                        })
                    )
                } else if (n8.kind == "directory") {
                    let s9 = a4.addDirectory(n8.name)
                    o8.push(s9)
                    for await (let d5 of n8.values()) await r8(s9, d5, o8)
                }
            } catch (s9) {
                let d5 = s9.message + (n8 ? " (" + n8.name + ")" : "")
                throw new Error(d5)
            }
        return o8
    }
}
async function j5(i8) {
    let e6 = { name: i8.name }
    if ((i8.isFile && ((e6.kind = "file"), (e6.getFile = () => new Promise((t10, r8) => i8.file(t10, r8)))), i8.isDirectory)) {
        e6.kind = "directory"
        let t10 = await ie2(i8)
        e6.values = () => t10
    }
    return e6
}
async function ie2(i8) {
    let e6 = []
    function t10(r8, a4, n8) {
        r8.readEntries(async (o8) => {
            if (!o8.length) a4(e6)
            else {
                for (let s9 of o8) e6.push(await j5(s9))
                t10(r8, a4, n8)
            }
        }, n8)
    }
    return (
        await new Promise((r8, a4) => t10(i8.createReader(), r8, a4)),
        {
            [Symbol.iterator]() {
                let r8 = 0
                return {
                    next() {
                        let a4 = { value: e6[r8], done: r8 === e6.length }
                        return r8++, a4
                    },
                }
            },
        }
    )
}
function h6(i8) {
    ;(i8.entries = []), (i8.root = new y4(i8))
}
function l5(i8, e6, t10, r8) {
    if (i8.directory) return r8 ? new y4(i8.fs, e6, t10, i8) : new S6(i8.fs, e6, t10, i8)
    throw new Error("Parent entry is not a directory")
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/lib/z-worker-inline.mjs
function s8(n8, r8 = {}) {
    let e6 = `const{Array:e,Object:t,Number:n,Math:r,Error:s,Uint8Array:i,Uint16Array:o,Uint32Array:c,Int32Array:f,Map:a,DataView:l,Promise:u,TextEncoder:w,crypto:h,postMessage:d,TransformStream:p,ReadableStream:y,WritableStream:m,CompressionStream:b,DecompressionStream:g}=self,k=void 0,v="undefined",S="function";class z{constructor(e){return class extends p{constructor(t,n){const r=new e(n);super({transform(e,t){t.enqueue(r.append(e))},flush(e){const t=r.flush();t&&e.enqueue(t)}})}}}}const C=[];for(let e=0;256>e;e++){let t=e;for(let e=0;8>e;e++)1&t?t=t>>>1^3988292384:t>>>=1;C[e]=t}class x{constructor(e){this.t=e||-1}append(e){let t=0|this.t;for(let n=0,r=0|e.length;r>n;n++)t=t>>>8^C[255&(t^e[n])];this.t=t}get(){return~this.t}}class A extends p{constructor(){let e;const t=new x;super({transform(e,n){t.append(e),n.enqueue(e)},flush(){const n=new i(4);new l(n.buffer).setUint32(0,t.get()),e.value=n}}),e=this}}const _={concat(e,t){if(0===e.length||0===t.length)return e.concat(t);const n=e[e.length-1],r=_.i(n);return 32===r?e.concat(t):_.o(t,r,0|n,e.slice(0,e.length-1))},l(e){const t=e.length;if(0===t)return 0;const n=e[t-1];return 32*(t-1)+_.i(n)},u(e,t){if(32*e.length<t)return e;const n=(e=e.slice(0,r.ceil(t/32))).length;return t&=31,n>0&&t&&(e[n-1]=_.h(t,e[n-1]&2147483648>>t-1,1)),e},h:(e,t,n)=>32===e?t:(n?0|t:t<<32-e)+1099511627776*e,i:e=>r.round(e/1099511627776)||32,o(e,t,n,r){for(void 0===r&&(r=[]);t>=32;t-=32)r.push(n),n=0;if(0===t)return r.concat(e);for(let s=0;s<e.length;s++)r.push(n|e[s]>>>t),n=e[s]<<32-t;const s=e.length?e[e.length-1]:0,i=_.i(s);return r.push(_.h(t+i&31,t+i>32?n:r.pop(),1)),r}},I={bytes:{p(e){const t=_.l(e)/8,n=new i(t);let r;for(let s=0;t>s;s++)3&s||(r=e[s/4]),n[s]=r>>>24,r<<=8;return n},m(e){const t=[];let n,r=0;for(n=0;n<e.length;n++)r=r<<8|e[n],3&~n||(t.push(r),r=0);return 3&n&&t.push(_.h(8*(3&n),r)),t}}},P=class{constructor(e){const t=this;t.blockSize=512,t.k=[1732584193,4023233417,2562383102,271733878,3285377520],t.v=[1518500249,1859775393,2400959708,3395469782],e?(t.S=e.S.slice(0),t.C=e.C.slice(0),t.A=e.A):t.reset()}reset(){const e=this;return e.S=e.k.slice(0),e.C=[],e.A=0,e}update(e){const t=this;"string"==typeof e&&(e=I._.m(e));const n=t.C=_.concat(t.C,e),r=t.A,i=t.A=r+_.l(e);if(i>9007199254740991)throw new s("Cannot hash more than 2^53 - 1 bits");const o=new c(n);let f=0;for(let e=t.blockSize+r-(t.blockSize+r&t.blockSize-1);i>=e;e+=t.blockSize)t.I(o.subarray(16*f,16*(f+1))),f+=1;return n.splice(0,16*f),t}P(){const e=this;let t=e.C;const n=e.S;t=_.concat(t,[_.h(1,1)]);for(let e=t.length+2;15&e;e++)t.push(0);for(t.push(r.floor(e.A/4294967296)),t.push(0|e.A);t.length;)e.I(t.splice(0,16));return e.reset(),n}D(e,t,n,r){return e>19?e>39?e>59?e>79?void 0:t^n^r:t&n|t&r|n&r:t^n^r:t&n|~t&r}V(e,t){return t<<e|t>>>32-e}I(t){const n=this,s=n.S,i=e(80);for(let e=0;16>e;e++)i[e]=t[e];let o=s[0],c=s[1],f=s[2],a=s[3],l=s[4];for(let e=0;79>=e;e++){16>e||(i[e]=n.V(1,i[e-3]^i[e-8]^i[e-14]^i[e-16]));const t=n.V(5,o)+n.D(e,c,f,a)+l+i[e]+n.v[r.floor(e/20)]|0;l=a,a=f,f=n.V(30,c),c=o,o=t}s[0]=s[0]+o|0,s[1]=s[1]+c|0,s[2]=s[2]+f|0,s[3]=s[3]+a|0,s[4]=s[4]+l|0}},D={getRandomValues(e){const t=new c(e.buffer),n=e=>{let t=987654321;const n=4294967295;return()=>(t=36969*(65535&t)+(t>>16)&n,(((t<<16)+(e=18e3*(65535&e)+(e>>16)&n)&n)/4294967296+.5)*(r.random()>.5?1:-1))};for(let s,i=0;i<e.length;i+=4){const e=n(4294967296*(s||r.random()));s=987654071*e(),t[i/4]=4294967296*e()|0}return e}},V={importKey:e=>new V.R(I.bytes.m(e)),B(e,t,n,r){if(n=n||1e4,0>r||0>n)throw new s("invalid params to pbkdf2");const i=1+(r>>5)<<2;let o,c,f,a,u;const w=new ArrayBuffer(i),h=new l(w);let d=0;const p=_;for(t=I.bytes.m(t),u=1;(i||1)>d;u++){for(o=c=e.encrypt(p.concat(t,[u])),f=1;n>f;f++)for(c=e.encrypt(c),a=0;a<c.length;a++)o[a]^=c[a];for(f=0;(i||1)>d&&f<o.length;f++)h.setInt32(d,o[f]),d+=4}return w.slice(0,r/8)},R:class{constructor(e){const t=this,n=t.M=P,r=[[],[]];t.U=[new n,new n];const s=t.U[0].blockSize/32;e.length>s&&(e=(new n).update(e).P());for(let t=0;s>t;t++)r[0][t]=909522486^e[t],r[1][t]=1549556828^e[t];t.U[0].update(r[0]),t.U[1].update(r[1]),t.K=new n(t.U[0])}reset(){const e=this;e.K=new e.M(e.U[0]),e.N=!1}update(e){this.N=!0,this.K.update(e)}digest(){const e=this,t=e.K.P(),n=new e.M(e.U[1]).update(t).P();return e.reset(),n}encrypt(e){if(this.N)throw new s("encrypt on already updated hmac called!");return this.update(e),this.digest(e)}}},R=typeof h!=v&&typeof h.getRandomValues==S,B="Invalid password",E="Invalid signature",M="zipjs-abort-check-password";function U(e){return R?h.getRandomValues(e):D.getRandomValues(e)}const K=16,N={name:"PBKDF2"},O=t.assign({hash:{name:"HMAC"}},N),T=t.assign({iterations:1e3,hash:{name:"SHA-1"}},N),W=["deriveBits"],j=[8,12,16],H=[16,24,32],L=10,F=[0,0,0,0],q=typeof h!=v,G=q&&h.subtle,J=q&&typeof G!=v,Q=I.bytes,X=class{constructor(e){const t=this;t.O=[[[],[],[],[],[]],[[],[],[],[],[]]],t.O[0][0][0]||t.T();const n=t.O[0][4],r=t.O[1],i=e.length;let o,c,f,a=1;if(4!==i&&6!==i&&8!==i)throw new s("invalid aes key size");for(t.v=[c=e.slice(0),f=[]],o=i;4*i+28>o;o++){let e=c[o-1];(o%i==0||8===i&&o%i==4)&&(e=n[e>>>24]<<24^n[e>>16&255]<<16^n[e>>8&255]<<8^n[255&e],o%i==0&&(e=e<<8^e>>>24^a<<24,a=a<<1^283*(a>>7))),c[o]=c[o-i]^e}for(let e=0;o;e++,o--){const t=c[3&e?o:o-4];f[e]=4>=o||4>e?t:r[0][n[t>>>24]]^r[1][n[t>>16&255]]^r[2][n[t>>8&255]]^r[3][n[255&t]]}}encrypt(e){return this.W(e,0)}decrypt(e){return this.W(e,1)}T(){const e=this.O[0],t=this.O[1],n=e[4],r=t[4],s=[],i=[];let o,c,f,a;for(let e=0;256>e;e++)i[(s[e]=e<<1^283*(e>>7))^e]=e;for(let l=o=0;!n[l];l^=c||1,o=i[o]||1){let i=o^o<<1^o<<2^o<<3^o<<4;i=i>>8^255&i^99,n[l]=i,r[i]=l,a=s[f=s[c=s[l]]];let u=16843009*a^65537*f^257*c^16843008*l,w=257*s[i]^16843008*i;for(let n=0;4>n;n++)e[n][l]=w=w<<24^w>>>8,t[n][i]=u=u<<24^u>>>8}for(let n=0;5>n;n++)e[n]=e[n].slice(0),t[n]=t[n].slice(0)}W(e,t){if(4!==e.length)throw new s("invalid aes block size");const n=this.v[t],r=n.length/4-2,i=[0,0,0,0],o=this.O[t],c=o[0],f=o[1],a=o[2],l=o[3],u=o[4];let w,h,d,p=e[0]^n[0],y=e[t?3:1]^n[1],m=e[2]^n[2],b=e[t?1:3]^n[3],g=4;for(let e=0;r>e;e++)w=c[p>>>24]^f[y>>16&255]^a[m>>8&255]^l[255&b]^n[g],h=c[y>>>24]^f[m>>16&255]^a[b>>8&255]^l[255&p]^n[g+1],d=c[m>>>24]^f[b>>16&255]^a[p>>8&255]^l[255&y]^n[g+2],b=c[b>>>24]^f[p>>16&255]^a[y>>8&255]^l[255&m]^n[g+3],g+=4,p=w,y=h,m=d;for(let e=0;4>e;e++)i[t?3&-e:e]=u[p>>>24]<<24^u[y>>16&255]<<16^u[m>>8&255]<<8^u[255&b]^n[g++],w=p,p=y,y=m,m=b,b=w;return i}},Y=class{constructor(e,t){this.j=e,this.H=t,this.L=t}reset(){this.L=this.H}update(e){return this.F(this.j,e,this.L)}q(e){if(255&~(e>>24))e+=1<<24;else{let t=e>>16&255,n=e>>8&255,r=255&e;255===t?(t=0,255===n?(n=0,255===r?r=0:++r):++n):++t,e=0,e+=t<<16,e+=n<<8,e+=r}return e}G(e){0===(e[0]=this.q(e[0]))&&(e[1]=this.q(e[1]))}F(e,t,n){let r;if(!(r=t.length))return[];const s=_.l(t);for(let s=0;r>s;s+=4){this.G(n);const r=e.encrypt(n);t[s]^=r[0],t[s+1]^=r[1],t[s+2]^=r[2],t[s+3]^=r[3]}return _.u(t,s)}},Z=V.R;let $=q&&J&&typeof G.importKey==S,ee=q&&J&&typeof G.deriveBits==S;class te extends p{constructor({password:e,rawPassword:n,signed:r,encryptionStrength:o,checkPasswordOnly:c}){super({start(){t.assign(this,{ready:new u((e=>this.J=e)),password:ie(e,n),signed:r,X:o-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:o,J:f,ready:a}=n;r?(await(async(e,t,n,r)=>{const i=await se(e,t,n,ce(r,0,j[t])),o=ce(r,j[t]);if(i[0]!=o[0]||i[1]!=o[1])throw new s(B)})(n,o,r,ce(e,0,j[o]+2)),e=ce(e,j[o]+2),c?t.error(new s(M)):f()):await a;const l=new i(e.length-L-(e.length-L)%K);t.enqueue(re(n,e,l,0,L,!0))},async flush(e){const{signed:t,Y:n,Z:r,pending:o,ready:c}=this;if(r&&n){await c;const f=ce(o,0,o.length-L),a=ce(o,o.length-L);let l=new i;if(f.length){const e=ae(Q,f);r.update(e);const t=n.update(e);l=fe(Q,t)}if(t){const e=ce(fe(Q,r.digest()),0,L);for(let t=0;L>t;t++)if(e[t]!=a[t])throw new s(E)}e.enqueue(l)}}})}}class ne extends p{constructor({password:e,rawPassword:n,encryptionStrength:r}){let s;super({start(){t.assign(this,{ready:new u((e=>this.J=e)),password:ie(e,n),X:r-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:s,J:o,ready:c}=n;let f=new i;r?(f=await(async(e,t,n)=>{const r=U(new i(j[t]));return oe(r,await se(e,t,n,r))})(n,s,r),o()):await c;const a=new i(f.length+e.length-e.length%K);a.set(f,0),t.enqueue(re(n,e,a,f.length,0))},async flush(e){const{Y:t,Z:n,pending:r,ready:o}=this;if(n&&t){await o;let c=new i;if(r.length){const e=t.update(ae(Q,r));n.update(e),c=fe(Q,e)}s.signature=fe(Q,n.digest()).slice(0,L),e.enqueue(oe(c,s.signature))}}}),s=this}}function re(e,t,n,r,s,o){const{Y:c,Z:f,pending:a}=e,l=t.length-s;let u;for(a.length&&(t=oe(a,t),n=((e,t)=>{if(t&&t>e.length){const n=e;(e=new i(t)).set(n,0)}return e})(n,l-l%K)),u=0;l-K>=u;u+=K){const e=ae(Q,ce(t,u,u+K));o&&f.update(e);const s=c.update(e);o||f.update(s),n.set(fe(Q,s),u+r)}return e.pending=ce(t,u),n}async function se(n,r,s,o){n.password=null;const c=await(async(e,t,n,r,s)=>{if(!$)return V.importKey(t);try{return await G.importKey("raw",t,n,!1,s)}catch(e){return $=!1,V.importKey(t)}})(0,s,O,0,W),f=await(async(e,t,n)=>{if(!ee)return V.B(t,e.salt,T.iterations,n);try{return await G.deriveBits(e,t,n)}catch(r){return ee=!1,V.B(t,e.salt,T.iterations,n)}})(t.assign({salt:o},T),c,8*(2*H[r]+2)),a=new i(f),l=ae(Q,ce(a,0,H[r])),u=ae(Q,ce(a,H[r],2*H[r])),w=ce(a,2*H[r]);return t.assign(n,{keys:{key:l,$:u,passwordVerification:w},Y:new Y(new X(l),e.from(F)),Z:new Z(u)}),w}function ie(e,t){return t===k?(e=>{if(typeof w==v){const t=new i((e=unescape(encodeURIComponent(e))).length);for(let n=0;n<t.length;n++)t[n]=e.charCodeAt(n);return t}return(new w).encode(e)})(e):t}function oe(e,t){let n=e;return e.length+t.length&&(n=new i(e.length+t.length),n.set(e,0),n.set(t,e.length)),n}function ce(e,t,n){return e.subarray(t,n)}function fe(e,t){return e.p(t)}function ae(e,t){return e.m(t)}class le extends p{constructor({password:e,passwordVerification:n,checkPasswordOnly:r}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;if(n.password){const t=we(n,e.subarray(0,12));if(n.password=null,t[11]!=n.passwordVerification)throw new s(B);e=e.subarray(12)}r?t.error(new s(M)):t.enqueue(we(n,e))}})}}class ue extends p{constructor({password:e,passwordVerification:n}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;let r,s;if(n.password){n.password=null;const t=U(new i(12));t[11]=n.passwordVerification,r=new i(e.length+t.length),r.set(he(n,t),0),s=12}else r=new i(e.length),s=0;r.set(he(n,e),s),t.enqueue(r)}})}}function we(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,n[r]);return n}function he(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,t[r]);return n}function de(e,n){const r=[305419896,591751049,878082192];t.assign(e,{keys:r,ee:new x(r[0]),te:new x(r[2])});for(let t=0;t<n.length;t++)pe(e,n.charCodeAt(t))}function pe(e,t){let[n,s,i]=e.keys;e.ee.append([t]),n=~e.ee.get(),s=be(r.imul(be(s+me(n)),134775813)+1),e.te.append([s>>>24]),i=~e.te.get(),e.keys=[n,s,i]}function ye(e){const t=2|e.keys[2];return me(r.imul(t,1^t)>>>8)}function me(e){return 255&e}function be(e){return 4294967295&e}const ge="deflate-raw";class ke extends p{constructor(e,{chunkSize:t,CompressionStream:n,CompressionStreamNative:r}){super({});const{compressed:s,encrypted:i,useCompressionStream:o,zipCrypto:c,signed:f,level:a}=e,u=this;let w,h,d=Se(super.readable);i&&!c||!f||(w=new A,d=xe(d,w)),s&&(d=Ce(d,o,{level:a,chunkSize:t},r,n)),i&&(c?d=xe(d,new ue(e)):(h=new ne(e),d=xe(d,h))),ze(u,d,(()=>{let e;i&&!c&&(e=h.signature),i&&!c||!f||(e=new l(w.value.buffer).getUint32(0)),u.signature=e}))}}class ve extends p{constructor(e,{chunkSize:t,DecompressionStream:n,DecompressionStreamNative:r}){super({});const{zipCrypto:i,encrypted:o,signed:c,signature:f,compressed:a,useCompressionStream:u}=e;let w,h,d=Se(super.readable);o&&(i?d=xe(d,new le(e)):(h=new te(e),d=xe(d,h))),a&&(d=Ce(d,u,{chunkSize:t},r,n)),o&&!i||!c||(w=new A,d=xe(d,w)),ze(this,d,(()=>{if((!o||i)&&c){const e=new l(w.value.buffer);if(f!=e.getUint32(0,!1))throw new s(E)}}))}}function Se(e){return xe(e,new p({transform(e,t){e&&e.length&&t.enqueue(e)}}))}function ze(e,n,r){n=xe(n,new p({flush:r})),t.defineProperty(e,"readable",{get:()=>n})}function Ce(e,t,n,r,s){try{e=xe(e,new(t&&r?r:s)(ge,n))}catch(r){if(!t)return e;try{e=xe(e,new s(ge,n))}catch(t){return e}}return e}function xe(e,t){return e.pipeThrough(t)}const Ae="data",_e="close";class Ie extends p{constructor(e,n){super({});const r=this,{codecType:s}=e;let i;s.startsWith("deflate")?i=ke:s.startsWith("inflate")&&(i=ve);let o=0,c=0;const f=new i(e,n),a=super.readable,l=new p({transform(e,t){e&&e.length&&(c+=e.length,t.enqueue(e))},flush(){t.assign(r,{inputSize:c})}}),u=new p({transform(e,t){e&&e.length&&(o+=e.length,t.enqueue(e))},flush(){const{signature:e}=f;t.assign(r,{signature:e,outputSize:o,inputSize:c})}});t.defineProperty(r,"readable",{get:()=>a.pipeThrough(l).pipeThrough(f).pipeThrough(u)})}}class Pe extends p{constructor(e){let t;super({transform:function n(r,s){if(t){const e=new i(t.length+r.length);e.set(t),e.set(r,t.length),r=e,t=null}r.length>e?(s.enqueue(r.slice(0,e)),n(r.slice(e),s)):t=r},flush(e){t&&t.length&&e.enqueue(t)}})}}const De=new a,Ve=new a;let Re,Be=0,Ee=!0;async function Me(e){try{const{options:t,scripts:r,config:s}=e;if(r&&r.length)try{Ee?importScripts.apply(k,r):await Ue(r)}catch(e){Ee=!1,await Ue(r)}self.initCodec&&self.initCodec(),s.CompressionStreamNative=self.CompressionStream,s.DecompressionStreamNative=self.DecompressionStream,self.Deflate&&(s.CompressionStream=new z(self.Deflate)),self.Inflate&&(s.DecompressionStream=new z(self.Inflate));const i={highWaterMark:1},o=e.readable||new y({async pull(e){const t=new u((e=>De.set(Be,e)));Ke({type:"pull",messageId:Be}),Be=(Be+1)%n.MAX_SAFE_INTEGER;const{value:r,done:s}=await t;e.enqueue(r),s&&e.close()}},i),c=e.writable||new m({async write(e){let t;const r=new u((e=>t=e));Ve.set(Be,t),Ke({type:Ae,value:e,messageId:Be}),Be=(Be+1)%n.MAX_SAFE_INTEGER,await r}},i),f=new Ie(t,s);Re=new AbortController;const{signal:a}=Re;await o.pipeThrough(f).pipeThrough(new Pe(s.chunkSize)).pipeTo(c,{signal:a,preventClose:!0,preventAbort:!0}),await c.getWriter().close();const{signature:l,inputSize:w,outputSize:h}=f;Ke({type:_e,result:{signature:l,inputSize:w,outputSize:h}})}catch(e){Ne(e)}}async function Ue(e){for(const t of e)await import(t)}function Ke(e){let{value:t}=e;if(t)if(t.length)try{t=new i(t),e.value=t.buffer,d(e,[e.value])}catch(t){d(e)}else d(e);else d(e)}function Ne(e=new s("Unknown error")){const{message:t,stack:n,code:r,name:i}=e;d({error:{message:t,stack:n,code:r,name:i}})}addEventListener("message",(({data:e})=>{const{type:t,messageId:n,value:r,done:s}=e;try{if("start"==t&&Me(e),t==Ae){const e=De.get(n);De.delete(n),e({value:new i(r),done:s})}if("ack"==t){const e=Ve.get(n);Ve.delete(n),e()}t==_e&&Re.abort()}catch(e){Ne(e)}}));const Oe=-2;function Te(t){return We(t.map((([t,n])=>new e(t).fill(n,0,t))))}function We(t){return t.reduce(((t,n)=>t.concat(e.isArray(n)?We(n):n)),[])}const je=[0,1,2,3].concat(...Te([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function He(){const e=this;function t(e,t){let n=0;do{n|=1&e,e>>>=1,n<<=1}while(--t>0);return n>>>1}e.ne=n=>{const s=e.re,i=e.ie.se,o=e.ie.oe;let c,f,a,l=-1;for(n.ce=0,n.fe=573,c=0;o>c;c++)0!==s[2*c]?(n.ae[++n.ce]=l=c,n.le[c]=0):s[2*c+1]=0;for(;2>n.ce;)a=n.ae[++n.ce]=2>l?++l:0,s[2*a]=1,n.le[a]=0,n.ue--,i&&(n.we-=i[2*a+1]);for(e.he=l,c=r.floor(n.ce/2);c>=1;c--)n.de(s,c);a=o;do{c=n.ae[1],n.ae[1]=n.ae[n.ce--],n.de(s,1),f=n.ae[1],n.ae[--n.fe]=c,n.ae[--n.fe]=f,s[2*a]=s[2*c]+s[2*f],n.le[a]=r.max(n.le[c],n.le[f])+1,s[2*c+1]=s[2*f+1]=a,n.ae[1]=a++,n.de(s,1)}while(n.ce>=2);n.ae[--n.fe]=n.ae[1],(t=>{const n=e.re,r=e.ie.se,s=e.ie.pe,i=e.ie.ye,o=e.ie.me;let c,f,a,l,u,w,h=0;for(l=0;15>=l;l++)t.be[l]=0;for(n[2*t.ae[t.fe]+1]=0,c=t.fe+1;573>c;c++)f=t.ae[c],l=n[2*n[2*f+1]+1]+1,l>o&&(l=o,h++),n[2*f+1]=l,f>e.he||(t.be[l]++,u=0,i>f||(u=s[f-i]),w=n[2*f],t.ue+=w*(l+u),r&&(t.we+=w*(r[2*f+1]+u)));if(0!==h){do{for(l=o-1;0===t.be[l];)l--;t.be[l]--,t.be[l+1]+=2,t.be[o]--,h-=2}while(h>0);for(l=o;0!==l;l--)for(f=t.be[l];0!==f;)a=t.ae[--c],a>e.he||(n[2*a+1]!=l&&(t.ue+=(l-n[2*a+1])*n[2*a],n[2*a+1]=l),f--)}})(n),((e,n,r)=>{const s=[];let i,o,c,f=0;for(i=1;15>=i;i++)s[i]=f=f+r[i-1]<<1;for(o=0;n>=o;o++)c=e[2*o+1],0!==c&&(e[2*o]=t(s[c]++,c))})(s,e.he,n.be)}}function Le(e,t,n,r,s){const i=this;i.se=e,i.pe=t,i.ye=n,i.oe=r,i.me=s}He.ge=[0,1,2,3,4,5,6,7].concat(...Te([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),He.ke=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],He.ve=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],He.Se=e=>256>e?je[e]:je[256+(e>>>7)],He.ze=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],He.Ce=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],He.xe=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],He.Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const Fe=Te([[144,8],[112,9],[24,7],[8,8]]);Le._e=We([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map(((e,t)=>[e,Fe[t]])));const qe=Te([[30,5]]);function Ge(e,t,n,r,s){const i=this;i.Ie=e,i.Pe=t,i.De=n,i.Ve=r,i.Re=s}Le.Be=We([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map(((e,t)=>[e,qe[t]]))),Le.Ee=new Le(Le._e,He.ze,257,286,15),Le.Me=new Le(Le.Be,He.Ce,0,30,15),Le.Ue=new Le(null,He.xe,0,19,7);const Je=[new Ge(0,0,0,0,0),new Ge(4,4,8,4,1),new Ge(4,5,16,8,1),new Ge(4,6,32,32,1),new Ge(4,4,16,16,2),new Ge(8,16,32,32,2),new Ge(8,16,128,128,2),new Ge(8,32,128,256,2),new Ge(32,128,258,1024,2),new Ge(32,258,258,4096,2)],Qe=["need dictionary","stream end","","","stream error","data error","","buffer error","",""],Xe=113,Ye=666,Ze=262;function $e(e,t,n,r){const s=e[2*t],i=e[2*n];return i>s||s==i&&r[t]<=r[n]}function et(){const e=this;let t,n,s,c,f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z,C,x,A,_,I,P,D,V,R,B,E,M,U;const K=new He,N=new He,O=new He;let T,W,j,H,L,F;function q(){let t;for(t=0;286>t;t++)E[2*t]=0;for(t=0;30>t;t++)M[2*t]=0;for(t=0;19>t;t++)U[2*t]=0;E[512]=1,e.ue=e.we=0,W=j=0}function G(e,t){let n,r=-1,s=e[1],i=0,o=7,c=4;0===s&&(o=138,c=3),e[2*(t+1)+1]=65535;for(let f=0;t>=f;f++)n=s,s=e[2*(f+1)+1],++i<o&&n==s||(c>i?U[2*n]+=i:0!==n?(n!=r&&U[2*n]++,U[32]++):i>10?U[36]++:U[34]++,i=0,r=n,0===s?(o=138,c=3):n==s?(o=6,c=3):(o=7,c=4))}function J(t){e.Ke[e.pending++]=t}function Q(e){J(255&e),J(e>>>8&255)}function X(e,t){let n;const r=t;F>16-r?(n=e,L|=n<<F&65535,Q(L),L=n>>>16-F,F+=r-16):(L|=e<<F&65535,F+=r)}function Y(e,t){const n=2*e;X(65535&t[n],65535&t[n+1])}function Z(e,t){let n,r,s=-1,i=e[1],o=0,c=7,f=4;for(0===i&&(c=138,f=3),n=0;t>=n;n++)if(r=i,i=e[2*(n+1)+1],++o>=c||r!=i){if(f>o)do{Y(r,U)}while(0!=--o);else 0!==r?(r!=s&&(Y(r,U),o--),Y(16,U),X(o-3,2)):o>10?(Y(18,U),X(o-11,7)):(Y(17,U),X(o-3,3));o=0,s=r,0===i?(c=138,f=3):r==i?(c=6,f=3):(c=7,f=4)}}function $(){16==F?(Q(L),L=0,F=0):8>F||(J(255&L),L>>>=8,F-=8)}function ee(t,n){let s,i,o;if(e.Ne[W]=t,e.Oe[W]=255&n,W++,0===t?E[2*n]++:(j++,t--,E[2*(He.ge[n]+256+1)]++,M[2*He.Se(t)]++),!(8191&W)&&D>2){for(s=8*W,i=C-k,o=0;30>o;o++)s+=M[2*o]*(5+He.Ce[o]);if(s>>>=3,j<r.floor(W/2)&&s<r.floor(i/2))return!0}return W==T-1}function te(t,n){let r,s,i,o,c=0;if(0!==W)do{r=e.Ne[c],s=e.Oe[c],c++,0===r?Y(s,t):(i=He.ge[s],Y(i+256+1,t),o=He.ze[i],0!==o&&(s-=He.ke[i],X(s,o)),r--,i=He.Se(r),Y(i,n),o=He.Ce[i],0!==o&&(r-=He.ve[i],X(r,o)))}while(W>c);Y(256,t),H=t[513]}function ne(){F>8?Q(L):F>0&&J(255&L),L=0,F=0}function re(t,n,r){X(0+(r?1:0),3),((t,n)=>{ne(),H=8,Q(n),Q(~n),e.Ke.set(u.subarray(t,t+n),e.pending),e.pending+=n})(t,n)}function se(n){((t,n,r)=>{let s,i,o=0;D>0?(K.ne(e),N.ne(e),o=(()=>{let t;for(G(E,K.he),G(M,N.he),O.ne(e),t=18;t>=3&&0===U[2*He.Ae[t]+1];t--);return e.ue+=14+3*(t+1),t})(),s=e.ue+3+7>>>3,i=e.we+3+7>>>3,i>s||(s=i)):s=i=n+5,n+4>s||-1==t?i==s?(X(2+(r?1:0),3),te(Le._e,Le.Be)):(X(4+(r?1:0),3),((e,t,n)=>{let r;for(X(e-257,5),X(t-1,5),X(n-4,4),r=0;n>r;r++)X(U[2*He.Ae[r]+1],3);Z(E,e-1),Z(M,t-1)})(K.he+1,N.he+1,o+1),te(E,M)):re(t,n,r),q(),r&&ne()})(0>k?-1:k,C-k,n),k=C,t.Te()}function ie(){let e,n,r,s;do{if(s=w-A-C,0===s&&0===C&&0===A)s=f;else if(-1==s)s--;else if(C>=f+f-Ze){u.set(u.subarray(f,f+f),0),x-=f,C-=f,k-=f,e=y,r=e;do{n=65535&d[--r],d[r]=f>n?0:n-f}while(0!=--e);e=f,r=e;do{n=65535&h[--r],h[r]=f>n?0:n-f}while(0!=--e);s+=f}if(0===t.We)return;e=t.je(u,C+A,s),A+=e,3>A||(p=255&u[C],p=(p<<g^255&u[C+1])&b)}while(Ze>A&&0!==t.We)}function oe(e){let t,n,r=I,s=C,i=_;const o=C>f-Ze?C-(f-Ze):0;let c=B;const a=l,w=C+258;let d=u[s+i-1],p=u[s+i];R>_||(r>>=2),c>A&&(c=A);do{if(t=e,u[t+i]==p&&u[t+i-1]==d&&u[t]==u[s]&&u[++t]==u[s+1]){s+=2,t++;do{}while(u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&w>s);if(n=258-(w-s),s=w-258,n>i){if(x=e,i=n,n>=c)break;d=u[s+i-1],p=u[s+i]}}}while((e=65535&h[e&a])>o&&0!=--r);return i>A?A:i}e.le=[],e.be=[],e.ae=[],E=[],M=[],U=[],e.de=(t,n)=>{const r=e.ae,s=r[n];let i=n<<1;for(;i<=e.ce&&(i<e.ce&&$e(t,r[i+1],r[i],e.le)&&i++,!$e(t,s,r[i],e.le));)r[n]=r[i],n=i,i<<=1;r[n]=s},e.He=(t,S,x,W,j,G)=>(W||(W=8),j||(j=8),G||(G=0),t.Le=null,-1==S&&(S=6),1>j||j>9||8!=W||9>x||x>15||0>S||S>9||0>G||G>2?Oe:(t.Fe=e,a=x,f=1<<a,l=f-1,m=j+7,y=1<<m,b=y-1,g=r.floor((m+3-1)/3),u=new i(2*f),h=[],d=[],T=1<<j+6,e.Ke=new i(4*T),s=4*T,e.Ne=new o(T),e.Oe=new i(T),D=S,V=G,(t=>(t.qe=t.Ge=0,t.Le=null,e.pending=0,e.Je=0,n=Xe,c=0,K.re=E,K.ie=Le.Ee,N.re=M,N.ie=Le.Me,O.re=U,O.ie=Le.Ue,L=0,F=0,H=8,q(),(()=>{w=2*f,d[y-1]=0;for(let e=0;y-1>e;e++)d[e]=0;P=Je[D].Pe,R=Je[D].Ie,B=Je[D].De,I=Je[D].Ve,C=0,k=0,A=0,v=_=2,z=0,p=0})(),0))(t))),e.Qe=()=>42!=n&&n!=Xe&&n!=Ye?Oe:(e.Oe=null,e.Ne=null,e.Ke=null,d=null,h=null,u=null,e.Fe=null,n==Xe?-3:0),e.Xe=(e,t,n)=>{let r=0;return-1==t&&(t=6),0>t||t>9||0>n||n>2?Oe:(Je[D].Re!=Je[t].Re&&0!==e.qe&&(r=e.Ye(1)),D!=t&&(D=t,P=Je[D].Pe,R=Je[D].Ie,B=Je[D].De,I=Je[D].Ve),V=n,r)},e.Ze=(e,t,r)=>{let s,i=r,o=0;if(!t||42!=n)return Oe;if(3>i)return 0;for(i>f-Ze&&(i=f-Ze,o=r-i),u.set(t.subarray(o,o+i),0),C=i,k=i,p=255&u[0],p=(p<<g^255&u[1])&b,s=0;i-3>=s;s++)p=(p<<g^255&u[s+2])&b,h[s&l]=d[p],d[p]=s;return 0},e.Ye=(r,i)=>{let o,w,m,I,R;if(i>4||0>i)return Oe;if(!r.$e||!r.et&&0!==r.We||n==Ye&&4!=i)return r.Le=Qe[4],Oe;if(0===r.tt)return r.Le=Qe[7],-5;var B;if(t=r,I=c,c=i,42==n&&(w=8+(a-8<<4)<<8,m=(D-1&255)>>1,m>3&&(m=3),w|=m<<6,0!==C&&(w|=32),w+=31-w%31,n=Xe,J((B=w)>>8&255),J(255&B)),0!==e.pending){if(t.Te(),0===t.tt)return c=-1,0}else if(0===t.We&&I>=i&&4!=i)return t.Le=Qe[7],-5;if(n==Ye&&0!==t.We)return r.Le=Qe[7],-5;if(0!==t.We||0!==A||0!=i&&n!=Ye){switch(R=-1,Je[D].Re){case 0:R=(e=>{let n,r=65535;for(r>s-5&&(r=s-5);;){if(1>=A){if(ie(),0===A&&0==e)return 0;if(0===A)break}if(C+=A,A=0,n=k+r,(0===C||C>=n)&&(A=C-n,C=n,se(!1),0===t.tt))return 0;if(C-k>=f-Ze&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 1:R=(e=>{let n,r=0;for(;;){if(Ze>A){if(ie(),Ze>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C),0===r||(C-r&65535)>f-Ze||2!=V&&(v=oe(r)),3>v)n=ee(0,255&u[C]),A--,C++;else if(n=ee(C-x,v-3),A-=v,v>P||3>A)C+=v,v=0,p=255&u[C],p=(p<<g^255&u[C+1])&b;else{v--;do{C++,p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C}while(0!=--v);C++}if(n&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 2:R=(e=>{let n,r,s=0;for(;;){if(Ze>A){if(ie(),Ze>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C),_=v,S=x,v=2,0!==s&&P>_&&f-Ze>=(C-s&65535)&&(2!=V&&(v=oe(s)),5>=v&&(1==V||3==v&&C-x>4096)&&(v=2)),3>_||v>_)if(0!==z){if(n=ee(0,255&u[C-1]),n&&se(!1),C++,A--,0===t.tt)return 0}else z=1,C++,A--;else{r=C+A-3,n=ee(C-1-S,_-3),A-=_-1,_-=2;do{++C>r||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C)}while(0!=--_);if(z=0,v=2,C++,n&&(se(!1),0===t.tt))return 0}}return 0!==z&&(n=ee(0,255&u[C-1]),z=0),se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i)}if(2!=R&&3!=R||(n=Ye),0==R||2==R)return 0===t.tt&&(c=-1),0;if(1==R){if(1==i)X(2,3),Y(256,Le._e),$(),9>1+H+10-F&&(X(2,3),Y(256,Le._e),$()),H=7;else if(re(0,0,!1),3==i)for(o=0;y>o;o++)d[o]=0;if(t.Te(),0===t.tt)return c=-1,0}}return 4!=i?0:1}}function tt(){const e=this;e.nt=0,e.rt=0,e.We=0,e.qe=0,e.tt=0,e.Ge=0}function nt(e){const t=new tt,n=(o=e&&e.chunkSize?e.chunkSize:65536)+5*(r.floor(o/16383)+1);var o;const c=new i(n);let f=e?e.level:-1;void 0===f&&(f=-1),t.He(f),t.$e=c,this.append=(e,r)=>{let o,f,a=0,l=0,u=0;const w=[];if(e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,o=t.Ye(0),0!=o)throw new s("deflating: "+t.Le);t.rt&&(t.rt==n?w.push(new i(c)):w.push(c.subarray(0,t.rt))),u+=t.rt,r&&t.nt>0&&t.nt!=a&&(r(t.nt),a=t.nt)}while(t.We>0||0===t.tt);return w.length>1?(f=new i(u),w.forEach((e=>{f.set(e,l),l+=e.length}))):f=w[0]?new i(w[0]):new i,f}},this.flush=()=>{let e,r,o=0,f=0;const a=[];do{if(t.rt=0,t.tt=n,e=t.Ye(4),1!=e&&0!=e)throw new s("deflating: "+t.Le);n-t.tt>0&&a.push(c.slice(0,t.rt)),f+=t.rt}while(t.We>0||0===t.tt);return t.Qe(),r=new i(f),a.forEach((e=>{r.set(e,o),o+=e.length})),r}}tt.prototype={He(e,t){const n=this;return n.Fe=new et,t||(t=15),n.Fe.He(n,e,t)},Ye(e){const t=this;return t.Fe?t.Fe.Ye(t,e):Oe},Qe(){const e=this;if(!e.Fe)return Oe;const t=e.Fe.Qe();return e.Fe=null,t},Xe(e,t){const n=this;return n.Fe?n.Fe.Xe(n,e,t):Oe},Ze(e,t){const n=this;return n.Fe?n.Fe.Ze(n,e,t):Oe},je(e,t,n){const r=this;let s=r.We;return s>n&&(s=n),0===s?0:(r.We-=s,e.set(r.et.subarray(r.nt,r.nt+s),t),r.nt+=s,r.qe+=s,s)},Te(){const e=this;let t=e.Fe.pending;t>e.tt&&(t=e.tt),0!==t&&(e.$e.set(e.Fe.Ke.subarray(e.Fe.Je,e.Fe.Je+t),e.rt),e.rt+=t,e.Fe.Je+=t,e.Ge+=t,e.tt-=t,e.Fe.pending-=t,0===e.Fe.pending&&(e.Fe.Je=0))}};const rt=-2,st=-3,it=-5,ot=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],ct=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],ft=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],at=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],lt=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],ut=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],wt=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function ht(){let e,t,n,r,s,i;function o(e,t,o,c,f,a,l,u,w,h,d){let p,y,m,b,g,k,v,S,z,C,x,A,_,I,P;C=0,g=o;do{n[e[t+C]]++,C++,g--}while(0!==g);if(n[0]==o)return l[0]=-1,u[0]=0,0;for(S=u[0],k=1;15>=k&&0===n[k];k++);for(v=k,k>S&&(S=k),g=15;0!==g&&0===n[g];g--);for(m=g,S>g&&(S=g),u[0]=S,I=1<<k;g>k;k++,I<<=1)if(0>(I-=n[k]))return st;if(0>(I-=n[g]))return st;for(n[g]+=I,i[1]=k=0,C=1,_=2;0!=--g;)i[_]=k+=n[C],_++,C++;g=0,C=0;do{0!==(k=e[t+C])&&(d[i[k]++]=g),C++}while(++g<o);for(o=i[m],i[0]=g=0,C=0,b=-1,A=-S,s[0]=0,x=0,P=0;m>=v;v++)for(p=n[v];0!=p--;){for(;v>A+S;){if(b++,A+=S,P=m-A,P=P>S?S:P,(y=1<<(k=v-A))>p+1&&(y-=p+1,_=v,P>k))for(;++k<P&&(y<<=1)>n[++_];)y-=n[_];if(P=1<<k,h[0]+P>1440)return st;s[b]=x=h[0],h[0]+=P,0!==b?(i[b]=g,r[0]=k,r[1]=S,k=g>>>A-S,r[2]=x-s[b-1]-k,w.set(r,3*(s[b-1]+k))):l[0]=x}for(r[1]=v-A,o>C?d[C]<c?(r[0]=256>d[C]?0:96,r[2]=d[C++]):(r[0]=a[d[C]-c]+16+64,r[2]=f[d[C++]-c]):r[0]=192,y=1<<v-A,k=g>>>A;P>k;k+=y)w.set(r,3*(x+k));for(k=1<<v-1;g&k;k>>>=1)g^=k;for(g^=k,z=(1<<A)-1;(g&z)!=i[b];)b--,A-=S,z=(1<<A)-1}return 0!==I&&1!=m?it:0}function c(o){let c;for(e||(e=[],t=[],n=new f(16),r=[],s=new f(15),i=new f(16)),t.length<o&&(t=[]),c=0;o>c;c++)t[c]=0;for(c=0;16>c;c++)n[c]=0;for(c=0;3>c;c++)r[c]=0;s.set(n.subarray(0,15),0),i.set(n.subarray(0,16),0)}this.st=(n,r,s,i,f)=>{let a;return c(19),e[0]=0,a=o(n,0,19,19,null,null,s,r,i,e,t),a==st?f.Le="oversubscribed dynamic bit lengths tree":a!=it&&0!==r[0]||(f.Le="incomplete dynamic bit lengths tree",a=st),a},this.it=(n,r,s,i,f,a,l,u,w)=>{let h;return c(288),e[0]=0,h=o(s,0,n,257,at,lt,a,i,u,e,t),0!=h||0===i[0]?(h==st?w.Le="oversubscribed literal/length tree":-4!=h&&(w.Le="incomplete literal/length tree",h=st),h):(c(288),h=o(s,n,r,0,ut,wt,l,f,u,e,t),0!=h||0===f[0]&&n>257?(h==st?w.Le="oversubscribed distance tree":h==it?(w.Le="incomplete distance tree",h=st):-4!=h&&(w.Le="empty distance tree with lengths",h=st),h):0)}}function dt(){const e=this;let t,n,r,s,i=0,o=0,c=0,f=0,a=0,l=0,u=0,w=0,h=0,d=0;function p(e,t,n,r,s,i,o,c){let f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z;d=c.nt,p=c.We,w=o.ot,h=o.ct,y=o.write,m=y<o.read?o.read-y-1:o.end-y,b=ot[e],g=ot[t];do{for(;20>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(f=w&b,a=n,l=r,z=3*(l+f),0!==(u=a[z]))for(;;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15,k=a[z+2]+(w&ot[u]),w>>=u,h-=u;15>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;for(f=w&g,a=s,l=i,z=3*(l+f),u=a[z];;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15;u>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(v=a[z+2]+(w&ot[u]),w>>=u,h-=u,m-=k,v>y){S=y-v;do{S+=o.end}while(0>S);if(u=o.end-S,k>u){if(k-=u,y-S>0&&u>y-S)do{o.lt[y++]=o.lt[S++]}while(0!=--u);else o.lt.set(o.lt.subarray(S,S+u),y),y+=u,S+=u,u=0;S=0}}else S=y-v,y-S>0&&2>y-S?(o.lt[y++]=o.lt[S++],o.lt[y++]=o.lt[S++],k-=2):(o.lt.set(o.lt.subarray(S,S+2),y),y+=2,S+=2,k-=2);if(y-S>0&&k>y-S)do{o.lt[y++]=o.lt[S++]}while(0!=--k);else o.lt.set(o.lt.subarray(S,S+k),y),y+=k,S+=k,k=0;break}if(64&u)return c.Le="invalid distance code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,st;f+=a[z+2],f+=w&ot[u],z=3*(l+f),u=a[z]}break}if(64&u)return 32&u?(k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,1):(c.Le="invalid literal/length code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,st);if(f+=a[z+2],f+=w&ot[u],z=3*(l+f),0===(u=a[z])){w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--;break}}else w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--}while(m>=258&&p>=10);return k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,0}e.init=(e,i,o,c,f,a)=>{t=0,u=e,w=i,r=o,h=c,s=f,d=a,n=null},e.ut=(e,y,m)=>{let b,g,k,v,S,z,C,x=0,A=0,_=0;for(_=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S;;)switch(t){case 0:if(z>=258&&v>=10&&(e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,m=p(u,w,r,h,s,d,e,y),_=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S,0!=m)){t=1==m?7:9;break}c=u,n=r,o=h,t=1;case 1:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}if(g=3*(o+(x&ot[b])),x>>>=n[g+1],A-=n[g+1],k=n[g],0===k){f=n[g+2],t=6;break}if(16&k){a=15&k,i=n[g+2],t=2;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}if(32&k){t=7;break}return t=9,y.Le="invalid literal/length code",m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 2:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}i+=x&ot[b],x>>=b,A-=b,c=w,n=s,o=d,t=3;case 3:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}if(g=3*(o+(x&ot[b])),x>>=n[g+1],A-=n[g+1],k=n[g],16&k){a=15&k,l=n[g+2],t=4;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}return t=9,y.Le="invalid distance code",m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 4:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(_++))<<A,A+=8}l+=x&ot[b],x>>=b,A-=b,t=5;case 5:for(C=S-l;0>C;)C+=e.end;for(;0!==i;){if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);e.lt[S++]=e.lt[C++],z--,C==e.end&&(C=0),i--}t=0;break;case 6:if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);m=0,e.lt[S++]=f,z--,t=0;break;case 7:if(A>7&&(A-=8,v++,_--),e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,e.read!=e.write)return e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);t=8;case 8:return m=1,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);case 9:return m=st,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m);default:return m=rt,e.ot=x,e.ct=A,y.We=v,y.qe+=_-y.nt,y.nt=_,e.write=S,e.wt(y,m)}},e.ht=()=>{}}ht.dt=(e,t,n,r)=>(e[0]=9,t[0]=5,n[0]=ct,r[0]=ft,0);const pt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function yt(e,t){const n=this;let r,s=0,o=0,c=0,a=0;const l=[0],u=[0],w=new dt;let h=0,d=new f(4320);const p=new ht;n.ct=0,n.ot=0,n.lt=new i(t),n.end=t,n.read=0,n.write=0,n.reset=(e,t)=>{t&&(t[0]=0),6==s&&w.ht(e),s=0,n.ct=0,n.ot=0,n.read=n.write=0},n.reset(e,null),n.wt=(e,t)=>{let r,s,i;return s=e.rt,i=n.read,r=(i>n.write?n.end:n.write)-i,r>e.tt&&(r=e.tt),0!==r&&t==it&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r,i==n.end&&(i=0,n.write==n.end&&(n.write=0),r=n.write-i,r>e.tt&&(r=e.tt),0!==r&&t==it&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r),e.rt=s,n.read=i,t},n.ut=(e,t)=>{let i,f,y,m,b,g,k,v;for(m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g;;){let S,z,C,x,A,_,I,P;switch(s){case 0:for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}switch(i=7&f,h=1&i,i>>>1){case 0:f>>>=3,y-=3,i=7&y,f>>>=i,y-=i,s=1;break;case 1:S=[],z=[],C=[[]],x=[[]],ht.dt(S,z,C,x),w.init(S[0],z[0],C[0],0,x[0],0),f>>>=3,y-=3,s=6;break;case 2:f>>>=3,y-=3,s=3;break;case 3:return f>>>=3,y-=3,s=9,e.Le="invalid block type",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}break;case 1:for(;32>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if((~f>>>16&65535)!=(65535&f))return s=9,e.Le="invalid stored block lengths",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);o=65535&f,f=y=0,s=0!==o?2:0!==h?7:0;break;case 2:if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(0===k&&(g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k&&(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k)))return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(t=0,i=o,i>b&&(i=b),i>k&&(i=k),n.lt.set(e.je(m,i),g),m+=i,b-=i,g+=i,k-=i,0!=(o-=i))break;s=0!==h?7:0;break;case 3:for(;14>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(c=i=16383&f,(31&i)>29||(i>>5&31)>29)return s=9,e.Le="too many length or distance symbols",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(i=258+(31&i)+(i>>5&31),!r||r.length<i)r=[];else for(v=0;i>v;v++)r[v]=0;f>>>=14,y-=14,a=0,s=4;case 4:for(;4+(c>>>10)>a;){for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}r[pt[a++]]=7&f,f>>>=3,y-=3}for(;19>a;)r[pt[a++]]=0;if(l[0]=7,i=p.st(r,l,u,d,e),0!=i)return(t=i)==st&&(r=null,s=9),n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);a=0,s=5;case 5:for(;i=c,258+(31&i)+(i>>5&31)>a;){let o,w;for(i=l[0];i>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(i=d[3*(u[0]+(f&ot[i]))+1],w=d[3*(u[0]+(f&ot[i]))+2],16>w)f>>>=i,y-=i,r[a++]=w;else{for(v=18==w?7:w-14,o=18==w?11:3;i+v>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(f>>>=i,y-=i,o+=f&ot[v],f>>>=v,y-=v,v=a,i=c,v+o>258+(31&i)+(i>>5&31)||16==w&&1>v)return r=null,s=9,e.Le="invalid bit length repeat",t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w=16==w?r[v-1]:0;do{r[v++]=w}while(0!=--o);a=v}}if(u[0]=-1,A=[],_=[],I=[],P=[],A[0]=9,_[0]=6,i=c,i=p.it(257+(31&i),1+(i>>5&31),r,A,_,I,P,d,e),0!=i)return i==st&&(r=null,s=9),t=i,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w.init(A[0],_[0],d,I[0],d,P[0]),s=6;case 6:if(n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,1!=(t=w.ut(n,e,t)))return n.wt(e,t);if(t=0,w.ht(e),m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g,0===h){s=0;break}s=7;case 7:if(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);s=8;case 8:return t=1,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);case 9:return t=st,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);default:return t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}}},n.ht=e=>{n.reset(e,null),n.lt=null,d=null},n.yt=(e,t,r)=>{n.lt.set(e.subarray(t,t+r),0),n.read=n.write=r},n.bt=()=>1==s?1:0}const mt=13,bt=[0,0,255,255];function gt(){const e=this;function t(e){return e&&e.gt?(e.qe=e.Ge=0,e.Le=null,e.gt.mode=7,e.gt.kt.reset(e,null),0):rt}e.mode=0,e.method=0,e.vt=[0],e.St=0,e.marker=0,e.zt=0,e.Ct=t=>(e.kt&&e.kt.ht(t),e.kt=null,0),e.xt=(n,r)=>(n.Le=null,e.kt=null,8>r||r>15?(e.Ct(n),rt):(e.zt=r,n.gt.kt=new yt(n,1<<r),t(n),0)),e.At=(e,t)=>{let n,r;if(!e||!e.gt||!e.et)return rt;const s=e.gt;for(t=4==t?it:0,n=it;;)switch(s.mode){case 0:if(0===e.We)return n;if(n=t,e.We--,e.qe++,8!=(15&(s.method=e.ft(e.nt++)))){s.mode=mt,e.Le="unknown compression method",s.marker=5;break}if(8+(s.method>>4)>s.zt){s.mode=mt,e.Le="invalid win size",s.marker=5;break}s.mode=1;case 1:if(0===e.We)return n;if(n=t,e.We--,e.qe++,r=255&e.ft(e.nt++),((s.method<<8)+r)%31!=0){s.mode=mt,e.Le="incorrect header check",s.marker=5;break}if(!(32&r)){s.mode=7;break}s.mode=2;case 2:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St=(255&e.ft(e.nt++))<<24&4278190080,s.mode=3;case 3:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<16&16711680,s.mode=4;case 4:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<8&65280,s.mode=5;case 5:return 0===e.We?n:(n=t,e.We--,e.qe++,s.St+=255&e.ft(e.nt++),s.mode=6,2);case 6:return s.mode=mt,e.Le="need dictionary",s.marker=0,rt;case 7:if(n=s.kt.ut(e,n),n==st){s.mode=mt,s.marker=0;break}if(0==n&&(n=t),1!=n)return n;n=t,s.kt.reset(e,s.vt),s.mode=12;case 12:return e.We=0,1;case mt:return st;default:return rt}},e._t=(e,t,n)=>{let r=0,s=n;if(!e||!e.gt||6!=e.gt.mode)return rt;const i=e.gt;return s<1<<i.zt||(s=(1<<i.zt)-1,r=n-s),i.kt.yt(t,r,s),i.mode=7,0},e.It=e=>{let n,r,s,i,o;if(!e||!e.gt)return rt;const c=e.gt;if(c.mode!=mt&&(c.mode=mt,c.marker=0),0===(n=e.We))return it;for(r=e.nt,s=c.marker;0!==n&&4>s;)e.ft(r)==bt[s]?s++:s=0!==e.ft(r)?0:4-s,r++,n--;return e.qe+=r-e.nt,e.nt=r,e.We=n,c.marker=s,4!=s?st:(i=e.qe,o=e.Ge,t(e),e.qe=i,e.Ge=o,c.mode=7,0)},e.Pt=e=>e&&e.gt&&e.gt.kt?e.gt.kt.bt():rt}function kt(){}function vt(e){const t=new kt,n=e&&e.chunkSize?r.floor(2*e.chunkSize):131072,o=new i(n);let c=!1;t.xt(),t.$e=o,this.append=(e,r)=>{const f=[];let a,l,u=0,w=0,h=0;if(0!==e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,0!==t.We||c||(t.nt=0,c=!0),a=t.At(0),c&&a===it){if(0!==t.We)throw new s("inflating: bad input")}else if(0!==a&&1!==a)throw new s("inflating: "+t.Le);if((c||1===a)&&t.We===e.length)throw new s("inflating: bad input");t.rt&&(t.rt===n?f.push(new i(o)):f.push(o.subarray(0,t.rt))),h+=t.rt,r&&t.nt>0&&t.nt!=u&&(r(t.nt),u=t.nt)}while(t.We>0||0===t.tt);return f.length>1?(l=new i(h),f.forEach((e=>{l.set(e,w),w+=e.length}))):l=f[0]?new i(f[0]):new i,l}},this.flush=()=>{t.Ct()}}kt.prototype={xt(e){const t=this;return t.gt=new gt,e||(e=15),t.gt.xt(t,e)},At(e){const t=this;return t.gt?t.gt.At(t,e):rt},Ct(){const e=this;if(!e.gt)return rt;const t=e.gt.Ct(e);return e.gt=null,t},It(){const e=this;return e.gt?e.gt.It(e):rt},_t(e,t){const n=this;return n.gt?n.gt._t(n,e,t):rt},ft(e){return this.et[e]},je(e,t){return this.et.subarray(e,e+t)}},self.initCodec=()=>{self.Deflate=nt,self.Inflate=vt};\n`,
        t10 = () => (r8.useDataURI ? "data:text/javascript," + encodeURIComponent(e6) : URL.createObjectURL(new Blob([e6], { type: "text/javascript" })))
    n8({ workerScripts: { inflate: [t10], deflate: [t10] } })
}

// https://esm.sh/@jsr/zip-js__zip-js@2.7.57/denonext/zip-js__zip-js.mjs
var nt3 = Object.defineProperty
var Pt2 = Object.getOwnPropertyDescriptor
var Yt3 = Object.getOwnPropertyNames
var Xt2 = Object.prototype.hasOwnProperty
var Wt = (t10, d5) => {
    for (var e6 in d5) nt3(t10, e6, { get: d5[e6], enumerable: true })
}
var tt2 = (t10, d5, e6, c7) => {
    if ((d5 && typeof d5 == "object") || typeof d5 == "function") for (let l6 of Yt3(d5)) !Xt2.call(t10, l6) && l6 !== e6 && nt3(t10, l6, { get: () => d5[l6], enumerable: !(c7 = Pt2(d5, l6)) || c7.enumerable })
    return t10
}
var I6 = (t10, d5, e6) => (tt2(t10, d5, "default"), e6 && tt2(e6, d5, "default"))
function Ze2(t10) {
    return Te2(t10.map(([d5, e6]) => new Array(d5).fill(e6, 0, d5)))
}
function Te2(t10) {
    return t10.reduce((d5, e6) => d5.concat(Array.isArray(e6) ? Te2(e6) : e6), [])
}
var it2 = [0, 1, 2, 3].concat(
    ...Ze2([
        [2, 4],
        [2, 5],
        [4, 6],
        [4, 7],
        [8, 8],
        [8, 9],
        [16, 10],
        [16, 11],
        [32, 12],
        [32, 13],
        [64, 14],
        [64, 15],
        [2, 0],
        [1, 16],
        [1, 17],
        [2, 18],
        [2, 19],
        [4, 20],
        [4, 21],
        [8, 22],
        [8, 23],
        [16, 24],
        [16, 25],
        [32, 26],
        [32, 27],
        [64, 28],
        [64, 29],
    ])
)
function W3() {
    let t10 = this
    function d5(l6) {
        let x6 = t10.dyn_tree,
            w6 = t10.stat_desc.static_tree,
            S8 = t10.stat_desc.extra_bits,
            u6 = t10.stat_desc.extra_base,
            N7 = t10.stat_desc.max_length,
            A7,
            O6,
            Z5,
            M6,
            B6,
            a4,
            n8 = 0
        for (M6 = 0; M6 <= 15; M6++) l6.bl_count[M6] = 0
        for (x6[l6.heap[l6.heap_max] * 2 + 1] = 0, A7 = l6.heap_max + 1; A7 < 573; A7++) (O6 = l6.heap[A7]), (M6 = x6[x6[O6 * 2 + 1] * 2 + 1] + 1), M6 > N7 && ((M6 = N7), n8++), (x6[O6 * 2 + 1] = M6), !(O6 > t10.max_code) && (l6.bl_count[M6]++, (B6 = 0), O6 >= u6 && (B6 = S8[O6 - u6]), (a4 = x6[O6 * 2]), (l6.opt_len += a4 * (M6 + B6)), w6 && (l6.static_len += a4 * (w6[O6 * 2 + 1] + B6)))
        if (n8 !== 0) {
            do {
                for (M6 = N7 - 1; l6.bl_count[M6] === 0; ) M6--
                l6.bl_count[M6]--, (l6.bl_count[M6 + 1] += 2), l6.bl_count[N7]--, (n8 -= 2)
            } while (n8 > 0)
            for (M6 = N7; M6 !== 0; M6--) for (O6 = l6.bl_count[M6]; O6 !== 0; ) (Z5 = l6.heap[--A7]), !(Z5 > t10.max_code) && (x6[Z5 * 2 + 1] != M6 && ((l6.opt_len += (M6 - x6[Z5 * 2 + 1]) * x6[Z5 * 2]), (x6[Z5 * 2 + 1] = M6)), O6--)
        }
    }
    function e6(l6, x6) {
        let w6 = 0
        do (w6 |= l6 & 1), (l6 >>>= 1), (w6 <<= 1)
        while (--x6 > 0)
        return w6 >>> 1
    }
    function c7(l6, x6, w6) {
        let S8 = [],
            u6 = 0,
            N7,
            A7,
            O6
        for (N7 = 1; N7 <= 15; N7++) S8[N7] = u6 = (u6 + w6[N7 - 1]) << 1
        for (A7 = 0; A7 <= x6; A7++) (O6 = l6[A7 * 2 + 1]), O6 !== 0 && (l6[A7 * 2] = e6(S8[O6]++, O6))
    }
    t10.build_tree = function (l6) {
        let x6 = t10.dyn_tree,
            w6 = t10.stat_desc.static_tree,
            S8 = t10.stat_desc.elems,
            u6,
            N7,
            A7 = -1,
            O6
        for (l6.heap_len = 0, l6.heap_max = 573, u6 = 0; u6 < S8; u6++) x6[u6 * 2] !== 0 ? ((l6.heap[++l6.heap_len] = A7 = u6), (l6.depth[u6] = 0)) : (x6[u6 * 2 + 1] = 0)
        for (; l6.heap_len < 2; ) (O6 = l6.heap[++l6.heap_len] = A7 < 2 ? ++A7 : 0), (x6[O6 * 2] = 1), (l6.depth[O6] = 0), l6.opt_len--, w6 && (l6.static_len -= w6[O6 * 2 + 1])
        for (t10.max_code = A7, u6 = Math.floor(l6.heap_len / 2); u6 >= 1; u6--) l6.pqdownheap(x6, u6)
        O6 = S8
        do (u6 = l6.heap[1]), (l6.heap[1] = l6.heap[l6.heap_len--]), l6.pqdownheap(x6, 1), (N7 = l6.heap[1]), (l6.heap[--l6.heap_max] = u6), (l6.heap[--l6.heap_max] = N7), (x6[O6 * 2] = x6[u6 * 2] + x6[N7 * 2]), (l6.depth[O6] = Math.max(l6.depth[u6], l6.depth[N7]) + 1), (x6[u6 * 2 + 1] = x6[N7 * 2 + 1] = O6), (l6.heap[1] = O6++), l6.pqdownheap(x6, 1)
        while (l6.heap_len >= 2)
        ;(l6.heap[--l6.heap_max] = l6.heap[1]), d5(l6), c7(x6, t10.max_code, l6.bl_count)
    }
}
W3._length_code = [0, 1, 2, 3, 4, 5, 6, 7].concat(
    ...Ze2([
        [2, 8],
        [2, 9],
        [2, 10],
        [2, 11],
        [4, 12],
        [4, 13],
        [4, 14],
        [4, 15],
        [8, 16],
        [8, 17],
        [8, 18],
        [8, 19],
        [16, 20],
        [16, 21],
        [16, 22],
        [16, 23],
        [32, 24],
        [32, 25],
        [32, 26],
        [31, 27],
        [1, 28],
    ])
)
W3.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0]
W3.base_dist = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576]
W3.d_code = function (t10) {
    return t10 < 256 ? it2[t10] : it2[256 + (t10 >>> 7)]
}
W3.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
W3.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
W3.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
W3.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
function G5(t10, d5, e6, c7, l6) {
    let x6 = this
    ;(x6.static_tree = t10), (x6.extra_bits = d5), (x6.extra_base = e6), (x6.elems = c7), (x6.max_length = l6)
}
var Vt2 = [12, 140, 76, 204, 44, 172, 108, 236, 28, 156, 92, 220, 60, 188, 124, 252, 2, 130, 66, 194, 34, 162, 98, 226, 18, 146, 82, 210, 50, 178, 114, 242, 10, 138, 74, 202, 42, 170, 106, 234, 26, 154, 90, 218, 58, 186, 122, 250, 6, 134, 70, 198, 38, 166, 102, 230, 22, 150, 86, 214, 54, 182, 118, 246, 14, 142, 78, 206, 46, 174, 110, 238, 30, 158, 94, 222, 62, 190, 126, 254, 1, 129, 65, 193, 33, 161, 97, 225, 17, 145, 81, 209, 49, 177, 113, 241, 9, 137, 73, 201, 41, 169, 105, 233, 25, 153, 89, 217, 57, 185, 121, 249, 5, 133, 69, 197, 37, 165, 101, 229, 21, 149, 85, 213, 53, 181, 117, 245, 13, 141, 77, 205, 45, 173, 109, 237, 29, 157, 93, 221, 61, 189, 125, 253, 19, 275, 147, 403, 83, 339, 211, 467, 51, 307, 179, 435, 115, 371, 243, 499, 11, 267, 139, 395, 75, 331, 203, 459, 43, 299, 171, 427, 107, 363, 235, 491, 27, 283, 155, 411, 91, 347, 219, 475, 59, 315, 187, 443, 123, 379, 251, 507, 7, 263, 135, 391, 71, 327, 199, 455, 39, 295, 167, 423, 103, 359, 231, 487, 23, 279, 151, 407, 87, 343, 215, 471, 55, 311, 183, 439, 119, 375, 247, 503, 15, 271, 143, 399, 79, 335, 207, 463, 47, 303, 175, 431, 111, 367, 239, 495, 31, 287, 159, 415, 95, 351, 223, 479, 63, 319, 191, 447, 127, 383, 255, 511, 0, 64, 32, 96, 16, 80, 48, 112, 8, 72, 40, 104, 24, 88, 56, 120, 4, 68, 36, 100, 20, 84, 52, 116, 3, 131, 67, 195, 35, 163, 99, 227]
var Gt2 = Ze2([
    [144, 8],
    [112, 9],
    [24, 7],
    [8, 8],
])
G5.static_ltree = Te2(Vt2.map((t10, d5) => [t10, Gt2[d5]]))
var Jt2 = [0, 16, 8, 24, 4, 20, 12, 28, 2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3, 19, 11, 27, 7, 23]
var Qt = Ze2([[30, 5]])
G5.static_dtree = Te2(Jt2.map((t10, d5) => [t10, Qt[d5]]))
G5.static_l_desc = new G5(G5.static_ltree, W3.extra_lbits, 257, 286, 15)
G5.static_d_desc = new G5(G5.static_dtree, W3.extra_dbits, 0, 30, 15)
G5.static_bl_desc = new G5(null, W3.extra_blbits, 0, 19, 7)
var $t = 9
var zt3 = 8
function re4(t10, d5, e6, c7, l6) {
    let x6 = this
    ;(x6.good_length = t10), (x6.max_lazy = d5), (x6.nice_length = e6), (x6.max_chain = c7), (x6.func = l6)
}
var lt2 = 0
var Oe2 = 1
var _e2 = 2
var de3 = [new re4(0, 0, 0, 0, lt2), new re4(4, 4, 8, 4, Oe2), new re4(4, 5, 16, 8, Oe2), new re4(4, 6, 32, 32, Oe2), new re4(4, 4, 16, 16, _e2), new re4(8, 16, 32, 32, _e2), new re4(8, 16, 128, 128, _e2), new re4(8, 32, 128, 256, _e2), new re4(32, 128, 258, 1024, _e2), new re4(32, 258, 258, 4096, _e2)]
var Re3 = ["need dictionary", "stream end", "", "", "stream error", "data error", "", "buffer error", "", ""]
var ne3 = 0
var ke3 = 1
var he2 = 2
var Ee2 = 3
var en2 = 32
var je = 42
var ye4 = 113
var ge2 = 666
var Ue4 = 8
var tn = 0
var Ce4 = 1
var nn = 2
var V4 = 3
var Ae2 = 258
var z4 = Ae2 + V4 + 1
function at2(t10, d5, e6, c7) {
    let l6 = t10[d5 * 2],
        x6 = t10[e6 * 2]
    return l6 < x6 || (l6 == x6 && c7[d5] <= c7[e6])
}
function an() {
    let t10 = this,
        d5,
        e6,
        c7,
        l6,
        x6,
        w6,
        S8,
        u6,
        N7,
        A7,
        O6,
        Z5,
        M6,
        B6,
        a4,
        n8,
        i8,
        r8,
        b8,
        y5,
        _9,
        s9,
        f4,
        v8,
        R7,
        k8,
        E7,
        C10,
        D6,
        P6,
        j7,
        L6,
        H6,
        Y6 = new W3(),
        se4 = new W3(),
        U7 = new W3()
    t10.depth = []
    let ie4, q5, X6, ue3, te5, J3
    ;(t10.bl_count = []), (t10.heap = []), (j7 = []), (L6 = []), (H6 = [])
    function It2() {
        ;(N7 = 2 * x6), (O6[M6 - 1] = 0)
        for (let o8 = 0; o8 < M6 - 1; o8++) O6[o8] = 0
        ;(k8 = de3[E7].max_lazy), (D6 = de3[E7].good_length), (P6 = de3[E7].nice_length), (R7 = de3[E7].max_chain), (_9 = 0), (i8 = 0), (f4 = 0), (r8 = v8 = V4 - 1), (y5 = 0), (Z5 = 0)
    }
    function Ye4() {
        let o8
        for (o8 = 0; o8 < 286; o8++) j7[o8 * 2] = 0
        for (o8 = 0; o8 < 30; o8++) L6[o8 * 2] = 0
        for (o8 = 0; o8 < 19; o8++) H6[o8 * 2] = 0
        ;(j7[256 * 2] = 1), (t10.opt_len = t10.static_len = 0), (q5 = X6 = 0)
    }
    function Nt2() {
        ;(Y6.dyn_tree = j7), (Y6.stat_desc = G5.static_l_desc), (se4.dyn_tree = L6), (se4.stat_desc = G5.static_d_desc), (U7.dyn_tree = H6), (U7.stat_desc = G5.static_bl_desc), (te5 = 0), (J3 = 0), (ue3 = 8), Ye4()
    }
    t10.pqdownheap = function (o8, h7) {
        let m7 = t10.heap,
            g7 = m7[h7],
            T7 = h7 << 1
        for (; T7 <= t10.heap_len && (T7 < t10.heap_len && at2(o8, m7[T7 + 1], m7[T7], t10.depth) && T7++, !at2(o8, g7, m7[T7], t10.depth)); ) (m7[h7] = m7[T7]), (h7 = T7), (T7 <<= 1)
        m7[h7] = g7
    }
    function Xe3(o8, h7) {
        let m7 = -1,
            g7,
            T7 = o8[0 * 2 + 1],
            F8 = 0,
            K4 = 7,
            $4 = 4
        T7 === 0 && ((K4 = 138), ($4 = 3)), (o8[(h7 + 1) * 2 + 1] = 65535)
        for (let le4 = 0; le4 <= h7; le4++) (g7 = T7), (T7 = o8[(le4 + 1) * 2 + 1]), !(++F8 < K4 && g7 == T7) && (F8 < $4 ? (H6[g7 * 2] += F8) : g7 !== 0 ? (g7 != m7 && H6[g7 * 2]++, H6[16 * 2]++) : F8 <= 10 ? H6[17 * 2]++ : H6[18 * 2]++, (F8 = 0), (m7 = g7), T7 === 0 ? ((K4 = 138), ($4 = 3)) : g7 == T7 ? ((K4 = 6), ($4 = 3)) : ((K4 = 7), ($4 = 4)))
    }
    function Mt4() {
        let o8
        for (Xe3(j7, Y6.max_code), Xe3(L6, se4.max_code), U7.build_tree(t10), o8 = 18; o8 >= 3 && H6[W3.bl_order[o8] * 2 + 1] === 0; o8--);
        return (t10.opt_len += 3 * (o8 + 1) + 5 + 5 + 4), o8
    }
    function me3(o8) {
        t10.pending_buf[t10.pending++] = o8
    }
    function ve2(o8) {
        me3(o8 & 255), me3((o8 >>> 8) & 255)
    }
    function Lt2(o8) {
        me3((o8 >> 8) & 255), me3(o8 & 255 & 255)
    }
    function Q4(o8, h7) {
        let m7,
            g7 = h7
        J3 > 16 - g7 ? ((m7 = o8), (te5 |= (m7 << J3) & 65535), ve2(te5), (te5 = m7 >>> (16 - J3)), (J3 += g7 - 16)) : ((te5 |= (o8 << J3) & 65535), (J3 += g7))
    }
    function ae5(o8, h7) {
        let m7 = o8 * 2
        Q4(h7[m7] & 65535, h7[m7 + 1] & 65535)
    }
    function We3(o8, h7) {
        let m7,
            g7 = -1,
            T7,
            F8 = o8[0 * 2 + 1],
            K4 = 0,
            $4 = 7,
            le4 = 4
        for (F8 === 0 && (($4 = 138), (le4 = 3)), m7 = 0; m7 <= h7; m7++)
            if (((T7 = F8), (F8 = o8[(m7 + 1) * 2 + 1]), !(++K4 < $4 && T7 == F8))) {
                if (K4 < le4)
                    do ae5(T7, H6)
                    while (--K4 !== 0)
                else T7 !== 0 ? (T7 != g7 && (ae5(T7, H6), K4--), ae5(16, H6), Q4(K4 - 3, 2)) : K4 <= 10 ? (ae5(17, H6), Q4(K4 - 3, 3)) : (ae5(18, H6), Q4(K4 - 11, 7))
                ;(K4 = 0), (g7 = T7), F8 === 0 ? (($4 = 138), (le4 = 3)) : T7 == F8 ? (($4 = 6), (le4 = 3)) : (($4 = 7), (le4 = 4))
            }
    }
    function Ft2(o8, h7, m7) {
        let g7
        for (Q4(o8 - 257, 5), Q4(h7 - 1, 5), Q4(m7 - 4, 4), g7 = 0; g7 < m7; g7++) Q4(H6[W3.bl_order[g7] * 2 + 1], 3)
        We3(j7, o8 - 1), We3(L6, h7 - 1)
    }
    function Ve2() {
        J3 == 16 ? (ve2(te5), (te5 = 0), (J3 = 0)) : J3 >= 8 && (me3(te5 & 255), (te5 >>>= 8), (J3 -= 8))
    }
    function jt3() {
        Q4(Ce4 << 1, 3), ae5(256, G5.static_ltree), Ve2(), 1 + ue3 + 10 - J3 < 9 && (Q4(Ce4 << 1, 3), ae5(256, G5.static_ltree), Ve2()), (ue3 = 7)
    }
    function be5(o8, h7) {
        let m7, g7, T7
        if (((t10.dist_buf[q5] = o8), (t10.lc_buf[q5] = h7 & 255), q5++, o8 === 0 ? j7[h7 * 2]++ : (X6++, o8--, j7[(W3._length_code[h7] + 256 + 1) * 2]++, L6[W3.d_code(o8) * 2]++), !(q5 & 8191) && E7 > 2)) {
            for (m7 = q5 * 8, g7 = _9 - i8, T7 = 0; T7 < 30; T7++) m7 += L6[T7 * 2] * (5 + W3.extra_dbits[T7])
            if (((m7 >>>= 3), X6 < Math.floor(q5 / 2) && m7 < Math.floor(g7 / 2))) return true
        }
        return q5 == ie4 - 1
    }
    function Ge3(o8, h7) {
        let m7,
            g7,
            T7 = 0,
            F8,
            K4
        if (q5 !== 0)
            do (m7 = t10.dist_buf[T7]), (g7 = t10.lc_buf[T7]), T7++, m7 === 0 ? ae5(g7, o8) : ((F8 = W3._length_code[g7]), ae5(F8 + 256 + 1, o8), (K4 = W3.extra_lbits[F8]), K4 !== 0 && ((g7 -= W3.base_length[F8]), Q4(g7, K4)), m7--, (F8 = W3.d_code(m7)), ae5(F8, h7), (K4 = W3.extra_dbits[F8]), K4 !== 0 && ((m7 -= W3.base_dist[F8]), Q4(m7, K4)))
            while (T7 < q5)
        ae5(256, o8), (ue3 = o8[256 * 2 + 1])
    }
    function Je3() {
        J3 > 8 ? ve2(te5) : J3 > 0 && me3(te5 & 255), (te5 = 0), (J3 = 0)
    }
    function Ut4(o8, h7, m7) {
        Je3(), (ue3 = 8), m7 && (ve2(h7), ve2(~h7)), t10.pending_buf.set(u6.subarray(o8, o8 + h7), t10.pending), (t10.pending += h7)
    }
    function Qe3(o8, h7, m7) {
        Q4((tn << 1) + (m7 ? 1 : 0), 3), Ut4(o8, h7, true)
    }
    function Ct4(o8, h7, m7) {
        let g7,
            T7,
            F8 = 0
        E7 > 0 ? (Y6.build_tree(t10), se4.build_tree(t10), (F8 = Mt4()), (g7 = (t10.opt_len + 3 + 7) >>> 3), (T7 = (t10.static_len + 3 + 7) >>> 3), T7 <= g7 && (g7 = T7)) : (g7 = T7 = h7 + 5), h7 + 4 <= g7 && o8 != -1 ? Qe3(o8, h7, m7) : T7 == g7 ? (Q4((Ce4 << 1) + (m7 ? 1 : 0), 3), Ge3(G5.static_ltree, G5.static_dtree)) : (Q4((nn << 1) + (m7 ? 1 : 0), 3), Ft2(Y6.max_code + 1, se4.max_code + 1, F8 + 1), Ge3(j7, L6)), Ye4(), m7 && Je3()
    }
    function oe3(o8) {
        Ct4(i8 >= 0 ? i8 : -1, _9 - i8, o8), (i8 = _9), d5.flush_pending()
    }
    function Le4() {
        let o8, h7, m7, g7
        do {
            if (((g7 = N7 - f4 - _9), g7 === 0 && _9 === 0 && f4 === 0)) g7 = x6
            else if (g7 == -1) g7--
            else if (_9 >= x6 + x6 - z4) {
                u6.set(u6.subarray(x6, x6 + x6), 0), (s9 -= x6), (_9 -= x6), (i8 -= x6), (o8 = M6), (m7 = o8)
                do (h7 = O6[--m7] & 65535), (O6[m7] = h7 >= x6 ? h7 - x6 : 0)
                while (--o8 !== 0)
                ;(o8 = x6), (m7 = o8)
                do (h7 = A7[--m7] & 65535), (A7[m7] = h7 >= x6 ? h7 - x6 : 0)
                while (--o8 !== 0)
                g7 += x6
            }
            if (d5.avail_in === 0) return
            ;(o8 = d5.read_buf(u6, _9 + f4, g7)), (f4 += o8), f4 >= V4 && ((Z5 = u6[_9] & 255), (Z5 = ((Z5 << n8) ^ (u6[_9 + 1] & 255)) & a4))
        } while (f4 < z4 && d5.avail_in !== 0)
    }
    function qt3(o8) {
        let h7 = 65535,
            m7
        for (h7 > c7 - 5 && (h7 = c7 - 5); ; ) {
            if (f4 <= 1) {
                if ((Le4(), f4 === 0 && o8 == 0)) return ne3
                if (f4 === 0) break
            }
            if (((_9 += f4), (f4 = 0), (m7 = i8 + h7), ((_9 === 0 || _9 >= m7) && ((f4 = _9 - m7), (_9 = m7), oe3(false), d5.avail_out === 0)) || (_9 - i8 >= x6 - z4 && (oe3(false), d5.avail_out === 0)))) return ne3
        }
        return oe3(o8 == 4), d5.avail_out === 0 ? (o8 == 4 ? he2 : ne3) : o8 == 4 ? Ee2 : ke3
    }
    function $e3(o8) {
        let h7 = R7,
            m7 = _9,
            g7,
            T7,
            F8 = v8,
            K4 = _9 > x6 - z4 ? _9 - (x6 - z4) : 0,
            $4 = P6,
            le4 = S8,
            Fe3 = _9 + Ae2,
            ze4 = u6[m7 + F8 - 1],
            et4 = u6[m7 + F8]
        v8 >= D6 && (h7 >>= 2), $4 > f4 && ($4 = f4)
        do
            if (((g7 = o8), !(u6[g7 + F8] != et4 || u6[g7 + F8 - 1] != ze4 || u6[g7] != u6[m7] || u6[++g7] != u6[m7 + 1]))) {
                ;(m7 += 2), g7++
                do;
                while (u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && u6[++m7] == u6[++g7] && m7 < Fe3)
                if (((T7 = Ae2 - (Fe3 - m7)), (m7 = Fe3 - Ae2), T7 > F8)) {
                    if (((s9 = o8), (F8 = T7), T7 >= $4)) break
                    ;(ze4 = u6[m7 + F8 - 1]), (et4 = u6[m7 + F8])
                }
            }
        while ((o8 = A7[o8 & le4] & 65535) > K4 && --h7 !== 0)
        return F8 <= f4 ? F8 : f4
    }
    function Bt4(o8) {
        let h7 = 0,
            m7
        for (;;) {
            if (f4 < z4) {
                if ((Le4(), f4 < z4 && o8 == 0)) return ne3
                if (f4 === 0) break
            }
            if ((f4 >= V4 && ((Z5 = ((Z5 << n8) ^ (u6[_9 + (V4 - 1)] & 255)) & a4), (h7 = O6[Z5] & 65535), (A7[_9 & S8] = O6[Z5]), (O6[Z5] = _9)), h7 !== 0 && ((_9 - h7) & 65535) <= x6 - z4 && C10 != 2 && (r8 = $e3(h7)), r8 >= V4))
                if (((m7 = be5(_9 - s9, r8 - V4)), (f4 -= r8), r8 <= k8 && f4 >= V4)) {
                    r8--
                    do _9++, (Z5 = ((Z5 << n8) ^ (u6[_9 + (V4 - 1)] & 255)) & a4), (h7 = O6[Z5] & 65535), (A7[_9 & S8] = O6[Z5]), (O6[Z5] = _9)
                    while (--r8 !== 0)
                    _9++
                } else (_9 += r8), (r8 = 0), (Z5 = u6[_9] & 255), (Z5 = ((Z5 << n8) ^ (u6[_9 + 1] & 255)) & a4)
            else (m7 = be5(0, u6[_9] & 255)), f4--, _9++
            if (m7 && (oe3(false), d5.avail_out === 0)) return ne3
        }
        return oe3(o8 == 4), d5.avail_out === 0 ? (o8 == 4 ? he2 : ne3) : o8 == 4 ? Ee2 : ke3
    }
    function Kt3(o8) {
        let h7 = 0,
            m7,
            g7
        for (;;) {
            if (f4 < z4) {
                if ((Le4(), f4 < z4 && o8 == 0)) return ne3
                if (f4 === 0) break
            }
            if ((f4 >= V4 && ((Z5 = ((Z5 << n8) ^ (u6[_9 + (V4 - 1)] & 255)) & a4), (h7 = O6[Z5] & 65535), (A7[_9 & S8] = O6[Z5]), (O6[Z5] = _9)), (v8 = r8), (b8 = s9), (r8 = V4 - 1), h7 !== 0 && v8 < k8 && ((_9 - h7) & 65535) <= x6 - z4 && (C10 != 2 && (r8 = $e3(h7)), r8 <= 5 && (C10 == 1 || (r8 == V4 && _9 - s9 > 4096)) && (r8 = V4 - 1)), v8 >= V4 && r8 <= v8)) {
                ;(g7 = _9 + f4 - V4), (m7 = be5(_9 - 1 - b8, v8 - V4)), (f4 -= v8 - 1), (v8 -= 2)
                do ++_9 <= g7 && ((Z5 = ((Z5 << n8) ^ (u6[_9 + (V4 - 1)] & 255)) & a4), (h7 = O6[Z5] & 65535), (A7[_9 & S8] = O6[Z5]), (O6[Z5] = _9))
                while (--v8 !== 0)
                if (((y5 = 0), (r8 = V4 - 1), _9++, m7 && (oe3(false), d5.avail_out === 0))) return ne3
            } else if (y5 !== 0) {
                if (((m7 = be5(0, u6[_9 - 1] & 255)), m7 && oe3(false), _9++, f4--, d5.avail_out === 0)) return ne3
            } else (y5 = 1), _9++, f4--
        }
        return y5 !== 0 && ((m7 = be5(0, u6[_9 - 1] & 255)), (y5 = 0)), oe3(o8 == 4), d5.avail_out === 0 ? (o8 == 4 ? he2 : ne3) : o8 == 4 ? Ee2 : ke3
    }
    function Ht3(o8) {
        return (o8.total_in = o8.total_out = 0), (o8.msg = null), (t10.pending = 0), (t10.pending_out = 0), (e6 = ye4), (l6 = 0), Nt2(), It2(), 0
    }
    ;(t10.deflateInit = function (o8, h7, m7, g7, T7, F8) {
        return g7 || (g7 = Ue4), T7 || (T7 = zt3), F8 || (F8 = 0), (o8.msg = null), h7 == -1 && (h7 = 6), T7 < 1 || T7 > $t || g7 != Ue4 || m7 < 9 || m7 > 15 || h7 < 0 || h7 > 9 || F8 < 0 || F8 > 2 ? -2 : ((o8.dstate = t10), (w6 = m7), (x6 = 1 << w6), (S8 = x6 - 1), (B6 = T7 + 7), (M6 = 1 << B6), (a4 = M6 - 1), (n8 = Math.floor((B6 + V4 - 1) / V4)), (u6 = new Uint8Array(x6 * 2)), (A7 = []), (O6 = []), (ie4 = 1 << (T7 + 6)), (t10.pending_buf = new Uint8Array(ie4 * 4)), (c7 = ie4 * 4), (t10.dist_buf = new Uint16Array(ie4)), (t10.lc_buf = new Uint8Array(ie4)), (E7 = h7), (C10 = F8), Ht3(o8))
    }),
        (t10.deflateEnd = function () {
            return e6 != je && e6 != ye4 && e6 != ge2 ? -2 : ((t10.lc_buf = null), (t10.dist_buf = null), (t10.pending_buf = null), (O6 = null), (A7 = null), (u6 = null), (t10.dstate = null), e6 == ye4 ? -3 : 0)
        }),
        (t10.deflateParams = function (o8, h7, m7) {
            let g7 = 0
            return h7 == -1 && (h7 = 6), h7 < 0 || h7 > 9 || m7 < 0 || m7 > 2 ? -2 : (de3[E7].func != de3[h7].func && o8.total_in !== 0 && (g7 = o8.deflate(1)), E7 != h7 && ((E7 = h7), (k8 = de3[E7].max_lazy), (D6 = de3[E7].good_length), (P6 = de3[E7].nice_length), (R7 = de3[E7].max_chain)), (C10 = m7), g7)
        }),
        (t10.deflateSetDictionary = function (o8, h7, m7) {
            let g7 = m7,
                T7,
                F8 = 0
            if (!h7 || e6 != je) return -2
            if (g7 < V4) return 0
            for (g7 > x6 - z4 && ((g7 = x6 - z4), (F8 = m7 - g7)), u6.set(h7.subarray(F8, F8 + g7), 0), _9 = g7, i8 = g7, Z5 = u6[0] & 255, Z5 = ((Z5 << n8) ^ (u6[1] & 255)) & a4, T7 = 0; T7 <= g7 - V4; T7++) (Z5 = ((Z5 << n8) ^ (u6[T7 + (V4 - 1)] & 255)) & a4), (A7[T7 & S8] = O6[Z5]), (O6[Z5] = T7)
            return 0
        }),
        (t10.deflate = function (o8, h7) {
            let m7, g7, T7, F8, K4
            if (h7 > 4 || h7 < 0) return -2
            if (!o8.next_out || (!o8.next_in && o8.avail_in !== 0) || (e6 == ge2 && h7 != 4)) return (o8.msg = Re3[4]), -2
            if (o8.avail_out === 0) return (o8.msg = Re3[7]), -5
            if (((d5 = o8), (F8 = l6), (l6 = h7), e6 == je && ((g7 = (Ue4 + ((w6 - 8) << 4)) << 8), (T7 = ((E7 - 1) & 255) >> 1), T7 > 3 && (T7 = 3), (g7 |= T7 << 6), _9 !== 0 && (g7 |= en2), (g7 += 31 - (g7 % 31)), (e6 = ye4), Lt2(g7)), t10.pending !== 0)) {
                if ((d5.flush_pending(), d5.avail_out === 0)) return (l6 = -1), 0
            } else if (d5.avail_in === 0 && h7 <= F8 && h7 != 4) return (d5.msg = Re3[7]), -5
            if (e6 == ge2 && d5.avail_in !== 0) return (o8.msg = Re3[7]), -5
            if (d5.avail_in !== 0 || f4 !== 0 || (h7 != 0 && e6 != ge2)) {
                switch (((K4 = -1), de3[E7].func)) {
                    case lt2:
                        K4 = qt3(h7)
                        break
                    case Oe2:
                        K4 = Bt4(h7)
                        break
                    case _e2:
                        K4 = Kt3(h7)
                        break
                    default:
                }
                if (((K4 == he2 || K4 == Ee2) && (e6 = ge2), K4 == ne3 || K4 == he2)) return d5.avail_out === 0 && (l6 = -1), 0
                if (K4 == ke3) {
                    if (h7 == 1) jt3()
                    else if ((Qe3(0, 0, false), h7 == 3)) for (m7 = 0; m7 < M6; m7++) O6[m7] = 0
                    if ((d5.flush_pending(), d5.avail_out === 0)) return (l6 = -1), 0
                }
            }
            return h7 != 4 ? 0 : 1
        })
}
function dt2() {
    let t10 = this
    ;(t10.next_in_index = 0), (t10.next_out_index = 0), (t10.avail_in = 0), (t10.total_in = 0), (t10.avail_out = 0), (t10.total_out = 0)
}
dt2.prototype = {
    deflateInit(t10, d5) {
        let e6 = this
        return (e6.dstate = new an()), d5 || (d5 = 15), e6.dstate.deflateInit(e6, t10, d5)
    },
    deflate(t10) {
        let d5 = this
        return d5.dstate ? d5.dstate.deflate(d5, t10) : -2
    },
    deflateEnd() {
        let t10 = this
        if (!t10.dstate) return -2
        let d5 = t10.dstate.deflateEnd()
        return (t10.dstate = null), d5
    },
    deflateParams(t10, d5) {
        let e6 = this
        return e6.dstate ? e6.dstate.deflateParams(e6, t10, d5) : -2
    },
    deflateSetDictionary(t10, d5) {
        let e6 = this
        return e6.dstate ? e6.dstate.deflateSetDictionary(e6, t10, d5) : -2
    },
    read_buf(t10, d5, e6) {
        let c7 = this,
            l6 = c7.avail_in
        return l6 > e6 && (l6 = e6), l6 === 0 ? 0 : ((c7.avail_in -= l6), t10.set(c7.next_in.subarray(c7.next_in_index, c7.next_in_index + l6), d5), (c7.next_in_index += l6), (c7.total_in += l6), l6)
    },
    flush_pending() {
        let t10 = this,
            d5 = t10.dstate.pending
        d5 > t10.avail_out && (d5 = t10.avail_out), d5 !== 0 && (t10.next_out.set(t10.dstate.pending_buf.subarray(t10.dstate.pending_out, t10.dstate.pending_out + d5), t10.next_out_index), (t10.next_out_index += d5), (t10.dstate.pending_out += d5), (t10.total_out += d5), (t10.avail_out -= d5), (t10.dstate.pending -= d5), t10.dstate.pending === 0 && (t10.dstate.pending_out = 0))
    },
}
function rt2(t10) {
    let d5 = this,
        e6 = new dt2(),
        c7 = ln(t10 && t10.chunkSize ? t10.chunkSize : 64 * 1024),
        l6 = 0,
        x6 = new Uint8Array(c7),
        w6 = t10 ? t10.level : -1
    typeof w6 > "u" && (w6 = -1),
        e6.deflateInit(w6),
        (e6.next_out = x6),
        (d5.append = function (S8, u6) {
            let N7,
                A7,
                O6 = 0,
                Z5 = 0,
                M6 = 0,
                B6 = []
            if (S8.length) {
                ;(e6.next_in_index = 0), (e6.next_in = S8), (e6.avail_in = S8.length)
                do {
                    if (((e6.next_out_index = 0), (e6.avail_out = c7), (N7 = e6.deflate(l6)), N7 != 0)) throw new Error("deflating: " + e6.msg)
                    e6.next_out_index && (e6.next_out_index == c7 ? B6.push(new Uint8Array(x6)) : B6.push(x6.subarray(0, e6.next_out_index))), (M6 += e6.next_out_index), u6 && e6.next_in_index > 0 && e6.next_in_index != O6 && (u6(e6.next_in_index), (O6 = e6.next_in_index))
                } while (e6.avail_in > 0 || e6.avail_out === 0)
                return (
                    B6.length > 1
                        ? ((A7 = new Uint8Array(M6)),
                          B6.forEach(function (a4) {
                              A7.set(a4, Z5), (Z5 += a4.length)
                          }))
                        : (A7 = B6[0] ? new Uint8Array(B6[0]) : new Uint8Array()),
                    A7
                )
            }
        }),
        (d5.flush = function () {
            let S8,
                u6,
                N7 = 0,
                A7 = 0,
                O6 = []
            do {
                if (((e6.next_out_index = 0), (e6.avail_out = c7), (S8 = e6.deflate(4)), S8 != 1 && S8 != 0)) throw new Error("deflating: " + e6.msg)
                c7 - e6.avail_out > 0 && O6.push(x6.slice(0, e6.next_out_index)), (A7 += e6.next_out_index)
            } while (e6.avail_in > 0 || e6.avail_out === 0)
            return (
                e6.deflateEnd(),
                (u6 = new Uint8Array(A7)),
                O6.forEach(function (Z5) {
                    u6.set(Z5, N7), (N7 += Z5.length)
                }),
                u6
            )
        })
}
function ln(t10) {
    return t10 + 5 * (Math.floor(t10 / 16383) + 1)
}
var ee2 = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535]
var At = 1440
var dn = 0
var rn = 4
var sn = 9
var on = 5
var fn = [96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 160, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 145, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255]
var cn = [80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513, 84, 5, 33, 92, 5, 8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5, 24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577]
var _n = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]
var xn = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112]
var mn = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]
var pn = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
var fe3 = 15
function He() {
    let t10 = this,
        d5,
        e6,
        c7,
        l6,
        x6,
        w6
    function S8(N7, A7, O6, Z5, M6, B6, a4, n8, i8, r8, b8) {
        let y5, _9, s9, f4, v8, R7, k8, E7, C10, D6, P6, j7, L6, H6, Y6
        ;(D6 = 0), (v8 = O6)
        do c7[N7[A7 + D6]]++, D6++, v8--
        while (v8 !== 0)
        if (c7[0] == O6) return (a4[0] = -1), (n8[0] = 0), 0
        for (E7 = n8[0], R7 = 1; R7 <= fe3 && c7[R7] === 0; R7++);
        for (k8 = R7, E7 < R7 && (E7 = R7), v8 = fe3; v8 !== 0 && c7[v8] === 0; v8--);
        for (s9 = v8, E7 > v8 && (E7 = v8), n8[0] = E7, H6 = 1 << R7; R7 < v8; R7++, H6 <<= 1) if ((H6 -= c7[R7]) < 0) return -3
        if ((H6 -= c7[v8]) < 0) return -3
        for (c7[v8] += H6, w6[1] = R7 = 0, D6 = 1, L6 = 2; --v8 !== 0; ) (w6[L6] = R7 += c7[D6]), L6++, D6++
        ;(v8 = 0), (D6 = 0)
        do (R7 = N7[A7 + D6]) !== 0 && (b8[w6[R7]++] = v8), D6++
        while (++v8 < O6)
        for (O6 = w6[s9], w6[0] = v8 = 0, D6 = 0, f4 = -1, j7 = -E7, x6[0] = 0, P6 = 0, Y6 = 0; k8 <= s9; k8++)
            for (y5 = c7[k8]; y5-- !== 0; ) {
                for (; k8 > j7 + E7; ) {
                    if ((f4++, (j7 += E7), (Y6 = s9 - j7), (Y6 = Y6 > E7 ? E7 : Y6), (_9 = 1 << (R7 = k8 - j7)) > y5 + 1 && ((_9 -= y5 + 1), (L6 = k8), R7 < Y6))) for (; ++R7 < Y6 && !((_9 <<= 1) <= c7[++L6]); ) _9 -= c7[L6]
                    if (((Y6 = 1 << R7), r8[0] + Y6 > At)) return -3
                    ;(x6[f4] = P6 = r8[0]), (r8[0] += Y6), f4 !== 0 ? ((w6[f4] = v8), (l6[0] = R7), (l6[1] = E7), (R7 = v8 >>> (j7 - E7)), (l6[2] = P6 - x6[f4 - 1] - R7), i8.set(l6, (x6[f4 - 1] + R7) * 3)) : (a4[0] = P6)
                }
                for (l6[1] = k8 - j7, D6 >= O6 ? (l6[0] = 192) : b8[D6] < Z5 ? ((l6[0] = b8[D6] < 256 ? 0 : 96), (l6[2] = b8[D6++])) : ((l6[0] = B6[b8[D6] - Z5] + 16 + 64), (l6[2] = M6[b8[D6++] - Z5])), _9 = 1 << (k8 - j7), R7 = v8 >>> j7; R7 < Y6; R7 += _9) i8.set(l6, (P6 + R7) * 3)
                for (R7 = 1 << (k8 - 1); v8 & R7; R7 >>>= 1) v8 ^= R7
                for (v8 ^= R7, C10 = (1 << j7) - 1; (v8 & C10) != w6[f4]; ) f4--, (j7 -= E7), (C10 = (1 << j7) - 1)
            }
        return H6 !== 0 && s9 != 1 ? -5 : 0
    }
    function u6(N7) {
        let A7
        for (d5 || ((d5 = []), (e6 = []), (c7 = new Int32Array(fe3 + 1)), (l6 = []), (x6 = new Int32Array(fe3)), (w6 = new Int32Array(fe3 + 1))), e6.length < N7 && (e6 = []), A7 = 0; A7 < N7; A7++) e6[A7] = 0
        for (A7 = 0; A7 < fe3 + 1; A7++) c7[A7] = 0
        for (A7 = 0; A7 < 3; A7++) l6[A7] = 0
        x6.set(c7.subarray(0, fe3), 0), w6.set(c7.subarray(0, fe3 + 1), 0)
    }
    ;(t10.inflate_trees_bits = function (N7, A7, O6, Z5, M6) {
        let B6
        return u6(19), (d5[0] = 0), (B6 = S8(N7, 0, 19, 19, null, null, O6, A7, Z5, d5, e6)), B6 == -3 ? (M6.msg = "oversubscribed dynamic bit lengths tree") : (B6 == -5 || A7[0] === 0) && ((M6.msg = "incomplete dynamic bit lengths tree"), (B6 = -3)), B6
    }),
        (t10.inflate_trees_dynamic = function (N7, A7, O6, Z5, M6, B6, a4, n8, i8) {
            let r8
            return u6(288), (d5[0] = 0), (r8 = S8(O6, 0, N7, 257, _n, xn, B6, Z5, n8, d5, e6)), r8 != 0 || Z5[0] === 0 ? (r8 == -3 ? (i8.msg = "oversubscribed literal/length tree") : r8 != -4 && ((i8.msg = "incomplete literal/length tree"), (r8 = -3)), r8) : (u6(288), (r8 = S8(O6, N7, A7, 0, mn, pn, a4, M6, n8, d5, e6)), r8 != 0 || (M6[0] === 0 && N7 > 257) ? (r8 == -3 ? (i8.msg = "oversubscribed distance tree") : r8 == -5 ? ((i8.msg = "incomplete distance tree"), (r8 = -3)) : r8 != -4 && ((i8.msg = "empty distance tree with lengths"), (r8 = -3)), r8) : 0)
        })
}
He.inflate_trees_fixed = function (t10, d5, e6, c7) {
    return (t10[0] = sn), (d5[0] = on), (e6[0] = fn), (c7[0] = cn), 0
}
var Se3 = 0
var st3 = 1
var ot = 2
var ft2 = 3
var ct2 = 4
var _t = 5
var xt2 = 6
var qe = 7
var mt2 = 8
var De2 = 9
function un() {
    let t10 = this,
        d5,
        e6 = 0,
        c7,
        l6 = 0,
        x6 = 0,
        w6 = 0,
        S8 = 0,
        u6 = 0,
        N7 = 0,
        A7 = 0,
        O6,
        Z5 = 0,
        M6,
        B6 = 0
    function a4(n8, i8, r8, b8, y5, _9, s9, f4) {
        let v8, R7, k8, E7, C10, D6, P6, j7, L6, H6, Y6, se4, U7, ie4, q5, X6
        ;(P6 = f4.next_in_index), (j7 = f4.avail_in), (C10 = s9.bitb), (D6 = s9.bitk), (L6 = s9.write), (H6 = L6 < s9.read ? s9.read - L6 - 1 : s9.end - L6), (Y6 = ee2[n8]), (se4 = ee2[i8])
        do {
            for (; D6 < 20; ) j7--, (C10 |= (f4.read_byte(P6++) & 255) << D6), (D6 += 8)
            if (((v8 = C10 & Y6), (R7 = r8), (k8 = b8), (X6 = (k8 + v8) * 3), (E7 = R7[X6]) === 0)) {
                ;(C10 >>= R7[X6 + 1]), (D6 -= R7[X6 + 1]), (s9.win[L6++] = R7[X6 + 2]), H6--
                continue
            }
            do {
                if (((C10 >>= R7[X6 + 1]), (D6 -= R7[X6 + 1]), E7 & 16)) {
                    for (E7 &= 15, U7 = R7[X6 + 2] + (C10 & ee2[E7]), C10 >>= E7, D6 -= E7; D6 < 15; ) j7--, (C10 |= (f4.read_byte(P6++) & 255) << D6), (D6 += 8)
                    ;(v8 = C10 & se4), (R7 = y5), (k8 = _9), (X6 = (k8 + v8) * 3), (E7 = R7[X6])
                    do
                        if (((C10 >>= R7[X6 + 1]), (D6 -= R7[X6 + 1]), E7 & 16)) {
                            for (E7 &= 15; D6 < E7; ) j7--, (C10 |= (f4.read_byte(P6++) & 255) << D6), (D6 += 8)
                            if (((ie4 = R7[X6 + 2] + (C10 & ee2[E7])), (C10 >>= E7), (D6 -= E7), (H6 -= U7), L6 >= ie4)) (q5 = L6 - ie4), L6 - q5 > 0 && 2 > L6 - q5 ? ((s9.win[L6++] = s9.win[q5++]), (s9.win[L6++] = s9.win[q5++]), (U7 -= 2)) : (s9.win.set(s9.win.subarray(q5, q5 + 2), L6), (L6 += 2), (q5 += 2), (U7 -= 2))
                            else {
                                q5 = L6 - ie4
                                do q5 += s9.end
                                while (q5 < 0)
                                if (((E7 = s9.end - q5), U7 > E7)) {
                                    if (((U7 -= E7), L6 - q5 > 0 && E7 > L6 - q5))
                                        do s9.win[L6++] = s9.win[q5++]
                                        while (--E7 !== 0)
                                    else s9.win.set(s9.win.subarray(q5, q5 + E7), L6), (L6 += E7), (q5 += E7), (E7 = 0)
                                    q5 = 0
                                }
                            }
                            if (L6 - q5 > 0 && U7 > L6 - q5)
                                do s9.win[L6++] = s9.win[q5++]
                                while (--U7 !== 0)
                            else s9.win.set(s9.win.subarray(q5, q5 + U7), L6), (L6 += U7), (q5 += U7), (U7 = 0)
                            break
                        } else if (!(E7 & 64)) (v8 += R7[X6 + 2]), (v8 += C10 & ee2[E7]), (X6 = (k8 + v8) * 3), (E7 = R7[X6])
                        else return (f4.msg = "invalid distance code"), (U7 = f4.avail_in - j7), (U7 = D6 >> 3 < U7 ? D6 >> 3 : U7), (j7 += U7), (P6 -= U7), (D6 -= U7 << 3), (s9.bitb = C10), (s9.bitk = D6), (f4.avail_in = j7), (f4.total_in += P6 - f4.next_in_index), (f4.next_in_index = P6), (s9.write = L6), -3
                    while (true)
                    break
                }
                if (E7 & 64) return E7 & 32 ? ((U7 = f4.avail_in - j7), (U7 = D6 >> 3 < U7 ? D6 >> 3 : U7), (j7 += U7), (P6 -= U7), (D6 -= U7 << 3), (s9.bitb = C10), (s9.bitk = D6), (f4.avail_in = j7), (f4.total_in += P6 - f4.next_in_index), (f4.next_in_index = P6), (s9.write = L6), 1) : ((f4.msg = "invalid literal/length code"), (U7 = f4.avail_in - j7), (U7 = D6 >> 3 < U7 ? D6 >> 3 : U7), (j7 += U7), (P6 -= U7), (D6 -= U7 << 3), (s9.bitb = C10), (s9.bitk = D6), (f4.avail_in = j7), (f4.total_in += P6 - f4.next_in_index), (f4.next_in_index = P6), (s9.write = L6), -3)
                if (((v8 += R7[X6 + 2]), (v8 += C10 & ee2[E7]), (X6 = (k8 + v8) * 3), (E7 = R7[X6]) === 0)) {
                    ;(C10 >>= R7[X6 + 1]), (D6 -= R7[X6 + 1]), (s9.win[L6++] = R7[X6 + 2]), H6--
                    break
                }
            } while (true)
        } while (H6 >= 258 && j7 >= 10)
        return (U7 = f4.avail_in - j7), (U7 = D6 >> 3 < U7 ? D6 >> 3 : U7), (j7 += U7), (P6 -= U7), (D6 -= U7 << 3), (s9.bitb = C10), (s9.bitk = D6), (f4.avail_in = j7), (f4.total_in += P6 - f4.next_in_index), (f4.next_in_index = P6), (s9.write = L6), 0
    }
    ;(t10.init = function (n8, i8, r8, b8, y5, _9) {
        ;(d5 = Se3), (N7 = n8), (A7 = i8), (O6 = r8), (Z5 = b8), (M6 = y5), (B6 = _9), (c7 = null)
    }),
        (t10.proc = function (n8, i8, r8) {
            let b8,
                y5,
                _9,
                s9 = 0,
                f4 = 0,
                v8 = 0,
                R7,
                k8,
                E7,
                C10
            for (v8 = i8.next_in_index, R7 = i8.avail_in, s9 = n8.bitb, f4 = n8.bitk, k8 = n8.write, E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8; ; )
                switch (d5) {
                    case Se3:
                        if (E7 >= 258 && R7 >= 10 && ((n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), (r8 = a4(N7, A7, O6, Z5, M6, B6, n8, i8)), (v8 = i8.next_in_index), (R7 = i8.avail_in), (s9 = n8.bitb), (f4 = n8.bitk), (k8 = n8.write), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8), r8 != 0)) {
                            d5 = r8 == 1 ? qe : De2
                            break
                        }
                        ;(x6 = N7), (c7 = O6), (l6 = Z5), (d5 = st3)
                    case st3:
                        for (b8 = x6; f4 < b8; ) {
                            if (R7 !== 0) r8 = 0
                            else return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                            R7--, (s9 |= (i8.read_byte(v8++) & 255) << f4), (f4 += 8)
                        }
                        if (((y5 = (l6 + (s9 & ee2[b8])) * 3), (s9 >>>= c7[y5 + 1]), (f4 -= c7[y5 + 1]), (_9 = c7[y5]), _9 === 0)) {
                            ;(w6 = c7[y5 + 2]), (d5 = xt2)
                            break
                        }
                        if (_9 & 16) {
                            ;(S8 = _9 & 15), (e6 = c7[y5 + 2]), (d5 = ot)
                            break
                        }
                        if (!(_9 & 64)) {
                            ;(x6 = _9), (l6 = y5 / 3 + c7[y5 + 2])
                            break
                        }
                        if (_9 & 32) {
                            d5 = qe
                            break
                        }
                        return (d5 = De2), (i8.msg = "invalid literal/length code"), (r8 = -3), (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                    case ot:
                        for (b8 = S8; f4 < b8; ) {
                            if (R7 !== 0) r8 = 0
                            else return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                            R7--, (s9 |= (i8.read_byte(v8++) & 255) << f4), (f4 += 8)
                        }
                        ;(e6 += s9 & ee2[b8]), (s9 >>= b8), (f4 -= b8), (x6 = A7), (c7 = M6), (l6 = B6), (d5 = ft2)
                    case ft2:
                        for (b8 = x6; f4 < b8; ) {
                            if (R7 !== 0) r8 = 0
                            else return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                            R7--, (s9 |= (i8.read_byte(v8++) & 255) << f4), (f4 += 8)
                        }
                        if (((y5 = (l6 + (s9 & ee2[b8])) * 3), (s9 >>= c7[y5 + 1]), (f4 -= c7[y5 + 1]), (_9 = c7[y5]), _9 & 16)) {
                            ;(S8 = _9 & 15), (u6 = c7[y5 + 2]), (d5 = ct2)
                            break
                        }
                        if (!(_9 & 64)) {
                            ;(x6 = _9), (l6 = y5 / 3 + c7[y5 + 2])
                            break
                        }
                        return (d5 = De2), (i8.msg = "invalid distance code"), (r8 = -3), (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                    case ct2:
                        for (b8 = S8; f4 < b8; ) {
                            if (R7 !== 0) r8 = 0
                            else return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                            R7--, (s9 |= (i8.read_byte(v8++) & 255) << f4), (f4 += 8)
                        }
                        ;(u6 += s9 & ee2[b8]), (s9 >>= b8), (f4 -= b8), (d5 = _t)
                    case _t:
                        for (C10 = k8 - u6; C10 < 0; ) C10 += n8.end
                        for (; e6 !== 0; ) {
                            if (E7 === 0 && (k8 == n8.end && n8.read !== 0 && ((k8 = 0), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8)), E7 === 0 && ((n8.write = k8), (r8 = n8.inflate_flush(i8, r8)), (k8 = n8.write), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8), k8 == n8.end && n8.read !== 0 && ((k8 = 0), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8)), E7 === 0))) return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                            ;(n8.win[k8++] = n8.win[C10++]), E7--, C10 == n8.end && (C10 = 0), e6--
                        }
                        d5 = Se3
                        break
                    case xt2:
                        if (E7 === 0 && (k8 == n8.end && n8.read !== 0 && ((k8 = 0), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8)), E7 === 0 && ((n8.write = k8), (r8 = n8.inflate_flush(i8, r8)), (k8 = n8.write), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8), k8 == n8.end && n8.read !== 0 && ((k8 = 0), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8)), E7 === 0))) return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                        ;(r8 = 0), (n8.win[k8++] = w6), E7--, (d5 = Se3)
                        break
                    case qe:
                        if ((f4 > 7 && ((f4 -= 8), R7++, v8--), (n8.write = k8), (r8 = n8.inflate_flush(i8, r8)), (k8 = n8.write), (E7 = k8 < n8.read ? n8.read - k8 - 1 : n8.end - k8), n8.read != n8.write)) return (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                        d5 = mt2
                    case mt2:
                        return (r8 = 1), (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                    case De2:
                        return (r8 = -3), (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                    default:
                        return (r8 = -2), (n8.bitb = s9), (n8.bitk = f4), (i8.avail_in = R7), (i8.total_in += v8 - i8.next_in_index), (i8.next_in_index = v8), (n8.write = k8), n8.inflate_flush(i8, r8)
                }
        }),
        (t10.free = function () {})
}
var pt2 = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
var pe2 = 0
var Be2 = 1
var ut2 = 2
var vt3 = 3
var bt2 = 4
var ht = 5
var Ie4 = 6
var Ne3 = 7
var gt = 8
var xe2 = 9
function vn(t10, d5) {
    let e6 = this,
        c7 = pe2,
        l6 = 0,
        x6 = 0,
        w6 = 0,
        S8,
        u6 = [0],
        N7 = [0],
        A7 = new un(),
        O6 = 0,
        Z5 = new Int32Array(At * 3),
        M6 = 0,
        B6 = new He()
    ;(e6.bitk = 0),
        (e6.bitb = 0),
        (e6.win = new Uint8Array(d5)),
        (e6.end = d5),
        (e6.read = 0),
        (e6.write = 0),
        (e6.reset = function (a4, n8) {
            n8 && (n8[0] = M6), c7 == Ie4 && A7.free(a4), (c7 = pe2), (e6.bitk = 0), (e6.bitb = 0), (e6.read = e6.write = 0)
        }),
        e6.reset(t10, null),
        (e6.inflate_flush = function (a4, n8) {
            let i8, r8, b8
            return (r8 = a4.next_out_index), (b8 = e6.read), (i8 = (b8 <= e6.write ? e6.write : e6.end) - b8), i8 > a4.avail_out && (i8 = a4.avail_out), i8 !== 0 && n8 == -5 && (n8 = 0), (a4.avail_out -= i8), (a4.total_out += i8), a4.next_out.set(e6.win.subarray(b8, b8 + i8), r8), (r8 += i8), (b8 += i8), b8 == e6.end && ((b8 = 0), e6.write == e6.end && (e6.write = 0), (i8 = e6.write - b8), i8 > a4.avail_out && (i8 = a4.avail_out), i8 !== 0 && n8 == -5 && (n8 = 0), (a4.avail_out -= i8), (a4.total_out += i8), a4.next_out.set(e6.win.subarray(b8, b8 + i8), r8), (r8 += i8), (b8 += i8)), (a4.next_out_index = r8), (e6.read = b8), n8
        }),
        (e6.proc = function (a4, n8) {
            let i8, r8, b8, y5, _9, s9, f4, v8
            for (y5 = a4.next_in_index, _9 = a4.avail_in, r8 = e6.bitb, b8 = e6.bitk, s9 = e6.write, f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9; ; ) {
                let R7, k8, E7, C10, D6, P6, j7, L6
                switch (c7) {
                    case pe2:
                        for (; b8 < 3; ) {
                            if (_9 !== 0) n8 = 0
                            else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                            _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                        }
                        switch (((i8 = r8 & 7), (O6 = i8 & 1), i8 >>> 1)) {
                            case 0:
                                ;(r8 >>>= 3), (b8 -= 3), (i8 = b8 & 7), (r8 >>>= i8), (b8 -= i8), (c7 = Be2)
                                break
                            case 1:
                                ;(R7 = []), (k8 = []), (E7 = [[]]), (C10 = [[]]), He.inflate_trees_fixed(R7, k8, E7, C10), A7.init(R7[0], k8[0], E7[0], 0, C10[0], 0), (r8 >>>= 3), (b8 -= 3), (c7 = Ie4)
                                break
                            case 2:
                                ;(r8 >>>= 3), (b8 -= 3), (c7 = vt3)
                                break
                            case 3:
                                return (r8 >>>= 3), (b8 -= 3), (c7 = xe2), (a4.msg = "invalid block type"), (n8 = -3), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        }
                        break
                    case Be2:
                        for (; b8 < 32; ) {
                            if (_9 !== 0) n8 = 0
                            else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                            _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                        }
                        if (((~r8 >>> 16) & 65535) != (r8 & 65535)) return (c7 = xe2), (a4.msg = "invalid stored block lengths"), (n8 = -3), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        ;(l6 = r8 & 65535), (r8 = b8 = 0), (c7 = l6 !== 0 ? ut2 : O6 !== 0 ? Ne3 : pe2)
                        break
                    case ut2:
                        if (_9 === 0 || (f4 === 0 && (s9 == e6.end && e6.read !== 0 && ((s9 = 0), (f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9)), f4 === 0 && ((e6.write = s9), (n8 = e6.inflate_flush(a4, n8)), (s9 = e6.write), (f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9), s9 == e6.end && e6.read !== 0 && ((s9 = 0), (f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9)), f4 === 0)))) return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        if (((n8 = 0), (i8 = l6), i8 > _9 && (i8 = _9), i8 > f4 && (i8 = f4), e6.win.set(a4.read_buf(y5, i8), s9), (y5 += i8), (_9 -= i8), (s9 += i8), (f4 -= i8), (l6 -= i8) !== 0)) break
                        c7 = O6 !== 0 ? Ne3 : pe2
                        break
                    case vt3:
                        for (; b8 < 14; ) {
                            if (_9 !== 0) n8 = 0
                            else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                            _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                        }
                        if (((x6 = i8 = r8 & 16383), (i8 & 31) > 29 || ((i8 >> 5) & 31) > 29)) return (c7 = xe2), (a4.msg = "too many length or distance symbols"), (n8 = -3), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        if (((i8 = 258 + (i8 & 31) + ((i8 >> 5) & 31)), !S8 || S8.length < i8)) S8 = []
                        else for (v8 = 0; v8 < i8; v8++) S8[v8] = 0
                        ;(r8 >>>= 14), (b8 -= 14), (w6 = 0), (c7 = bt2)
                    case bt2:
                        for (; w6 < 4 + (x6 >>> 10); ) {
                            for (; b8 < 3; ) {
                                if (_9 !== 0) n8 = 0
                                else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                                _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                            }
                            ;(S8[pt2[w6++]] = r8 & 7), (r8 >>>= 3), (b8 -= 3)
                        }
                        for (; w6 < 19; ) S8[pt2[w6++]] = 0
                        if (((u6[0] = 7), (i8 = B6.inflate_trees_bits(S8, u6, N7, Z5, a4)), i8 != 0)) return (n8 = i8), n8 == -3 && ((S8 = null), (c7 = xe2)), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        ;(w6 = 0), (c7 = ht)
                    case ht:
                        for (; (i8 = x6), !(w6 >= 258 + (i8 & 31) + ((i8 >> 5) & 31)); ) {
                            let H6, Y6
                            for (i8 = u6[0]; b8 < i8; ) {
                                if (_9 !== 0) n8 = 0
                                else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                                _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                            }
                            if (((i8 = Z5[(N7[0] + (r8 & ee2[i8])) * 3 + 1]), (Y6 = Z5[(N7[0] + (r8 & ee2[i8])) * 3 + 2]), Y6 < 16)) (r8 >>>= i8), (b8 -= i8), (S8[w6++] = Y6)
                            else {
                                for (v8 = Y6 == 18 ? 7 : Y6 - 14, H6 = Y6 == 18 ? 11 : 3; b8 < i8 + v8; ) {
                                    if (_9 !== 0) n8 = 0
                                    else return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                                    _9--, (r8 |= (a4.read_byte(y5++) & 255) << b8), (b8 += 8)
                                }
                                if (((r8 >>>= i8), (b8 -= i8), (H6 += r8 & ee2[v8]), (r8 >>>= v8), (b8 -= v8), (v8 = w6), (i8 = x6), v8 + H6 > 258 + (i8 & 31) + ((i8 >> 5) & 31) || (Y6 == 16 && v8 < 1))) return (S8 = null), (c7 = xe2), (a4.msg = "invalid bit length repeat"), (n8 = -3), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                                Y6 = Y6 == 16 ? S8[v8 - 1] : 0
                                do S8[v8++] = Y6
                                while (--H6 !== 0)
                                w6 = v8
                            }
                        }
                        if (((N7[0] = -1), (D6 = []), (P6 = []), (j7 = []), (L6 = []), (D6[0] = 9), (P6[0] = 6), (i8 = x6), (i8 = B6.inflate_trees_dynamic(257 + (i8 & 31), 1 + ((i8 >> 5) & 31), S8, D6, P6, j7, L6, Z5, a4)), i8 != 0)) return i8 == -3 && ((S8 = null), (c7 = xe2)), (n8 = i8), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        A7.init(D6[0], P6[0], Z5, j7[0], Z5, L6[0]), (c7 = Ie4)
                    case Ie4:
                        if (((e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), (n8 = A7.proc(e6, a4, n8)) != 1)) return e6.inflate_flush(a4, n8)
                        if (((n8 = 0), A7.free(a4), (y5 = a4.next_in_index), (_9 = a4.avail_in), (r8 = e6.bitb), (b8 = e6.bitk), (s9 = e6.write), (f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9), O6 === 0)) {
                            c7 = pe2
                            break
                        }
                        c7 = Ne3
                    case Ne3:
                        if (((e6.write = s9), (n8 = e6.inflate_flush(a4, n8)), (s9 = e6.write), (f4 = s9 < e6.read ? e6.read - s9 - 1 : e6.end - s9), e6.read != e6.write)) return (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                        c7 = gt
                    case gt:
                        return (n8 = 1), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                    case xe2:
                        return (n8 = -3), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                    default:
                        return (n8 = -2), (e6.bitb = r8), (e6.bitk = b8), (a4.avail_in = _9), (a4.total_in += y5 - a4.next_in_index), (a4.next_in_index = y5), (e6.write = s9), e6.inflate_flush(a4, n8)
                }
            }
        }),
        (e6.free = function (a4) {
            e6.reset(a4, null), (e6.win = null), (Z5 = null)
        }),
        (e6.set_dictionary = function (a4, n8, i8) {
            e6.win.set(a4.subarray(n8, n8 + i8), 0), (e6.read = e6.write = i8)
        }),
        (e6.sync_point = function () {
            return c7 == Be2 ? 1 : 0
        })
}
var bn = 32
var hn = 8
var gn = 0
var wt = 1
var Rt2 = 2
var kt3 = 3
var Et = 4
var yt2 = 5
var Ke = 6
var we3 = 7
var Ot = 12
var ce3 = 13
var wn = [0, 0, 255, 255]
function Rn() {
    let t10 = this
    ;(t10.mode = 0), (t10.method = 0), (t10.was = [0]), (t10.need = 0), (t10.marker = 0), (t10.wbits = 0)
    function d5(e6) {
        return !e6 || !e6.istate ? -2 : ((e6.total_in = e6.total_out = 0), (e6.msg = null), (e6.istate.mode = we3), e6.istate.blocks.reset(e6, null), 0)
    }
    ;(t10.inflateEnd = function (e6) {
        return t10.blocks && t10.blocks.free(e6), (t10.blocks = null), 0
    }),
        (t10.inflateInit = function (e6, c7) {
            return (e6.msg = null), (t10.blocks = null), c7 < 8 || c7 > 15 ? (t10.inflateEnd(e6), -2) : ((t10.wbits = c7), (e6.istate.blocks = new vn(e6, 1 << c7)), d5(e6), 0)
        }),
        (t10.inflate = function (e6, c7) {
            let l6, x6
            if (!e6 || !e6.istate || !e6.next_in) return -2
            let w6 = e6.istate
            for (c7 = c7 == rn ? -5 : 0, l6 = -5; ; )
                switch (w6.mode) {
                    case gn:
                        if (e6.avail_in === 0) return l6
                        if (((l6 = c7), e6.avail_in--, e6.total_in++, ((w6.method = e6.read_byte(e6.next_in_index++)) & 15) != hn)) {
                            ;(w6.mode = ce3), (e6.msg = "unknown compression method"), (w6.marker = 5)
                            break
                        }
                        if ((w6.method >> 4) + 8 > w6.wbits) {
                            ;(w6.mode = ce3), (e6.msg = "invalid win size"), (w6.marker = 5)
                            break
                        }
                        w6.mode = wt
                    case wt:
                        if (e6.avail_in === 0) return l6
                        if (((l6 = c7), e6.avail_in--, e6.total_in++, (x6 = e6.read_byte(e6.next_in_index++) & 255), ((w6.method << 8) + x6) % 31 !== 0)) {
                            ;(w6.mode = ce3), (e6.msg = "incorrect header check"), (w6.marker = 5)
                            break
                        }
                        if (!(x6 & bn)) {
                            w6.mode = we3
                            break
                        }
                        w6.mode = Rt2
                    case Rt2:
                        if (e6.avail_in === 0) return l6
                        ;(l6 = c7), e6.avail_in--, e6.total_in++, (w6.need = ((e6.read_byte(e6.next_in_index++) & 255) << 24) & 4278190080), (w6.mode = kt3)
                    case kt3:
                        if (e6.avail_in === 0) return l6
                        ;(l6 = c7), e6.avail_in--, e6.total_in++, (w6.need += ((e6.read_byte(e6.next_in_index++) & 255) << 16) & 16711680), (w6.mode = Et)
                    case Et:
                        if (e6.avail_in === 0) return l6
                        ;(l6 = c7), e6.avail_in--, e6.total_in++, (w6.need += ((e6.read_byte(e6.next_in_index++) & 255) << 8) & 65280), (w6.mode = yt2)
                    case yt2:
                        return e6.avail_in === 0 ? l6 : ((l6 = c7), e6.avail_in--, e6.total_in++, (w6.need += e6.read_byte(e6.next_in_index++) & 255), (w6.mode = Ke), 2)
                    case Ke:
                        return (w6.mode = ce3), (e6.msg = "need dictionary"), (w6.marker = 0), -2
                    case we3:
                        if (((l6 = w6.blocks.proc(e6, l6)), l6 == -3)) {
                            ;(w6.mode = ce3), (w6.marker = 0)
                            break
                        }
                        if ((l6 == 0 && (l6 = c7), l6 != 1)) return l6
                        ;(l6 = c7), w6.blocks.reset(e6, w6.was), (w6.mode = Ot)
                    case Ot:
                        return (e6.avail_in = 0), 1
                    case ce3:
                        return -3
                    default:
                        return -2
                }
        }),
        (t10.inflateSetDictionary = function (e6, c7, l6) {
            let x6 = 0,
                w6 = l6
            if (!e6 || !e6.istate || e6.istate.mode != Ke) return -2
            let S8 = e6.istate
            return w6 >= 1 << S8.wbits && ((w6 = (1 << S8.wbits) - 1), (x6 = l6 - w6)), S8.blocks.set_dictionary(c7, x6, w6), (S8.mode = we3), 0
        }),
        (t10.inflateSync = function (e6) {
            let c7, l6, x6, w6, S8
            if (!e6 || !e6.istate) return -2
            let u6 = e6.istate
            if ((u6.mode != ce3 && ((u6.mode = ce3), (u6.marker = 0)), (c7 = e6.avail_in) === 0)) return -5
            for (l6 = e6.next_in_index, x6 = u6.marker; c7 !== 0 && x6 < 4; ) e6.read_byte(l6) == wn[x6] ? x6++ : e6.read_byte(l6) !== 0 ? (x6 = 0) : (x6 = 4 - x6), l6++, c7--
            return (e6.total_in += l6 - e6.next_in_index), (e6.next_in_index = l6), (e6.avail_in = c7), (u6.marker = x6), x6 != 4 ? -3 : ((w6 = e6.total_in), (S8 = e6.total_out), d5(e6), (e6.total_in = w6), (e6.total_out = S8), (u6.mode = we3), 0)
        }),
        (t10.inflateSyncPoint = function (e6) {
            return !e6 || !e6.istate || !e6.istate.blocks ? -2 : e6.istate.blocks.sync_point()
        })
}
function Zt2() {}
Zt2.prototype = {
    inflateInit(t10) {
        let d5 = this
        return (d5.istate = new Rn()), t10 || (t10 = 15), d5.istate.inflateInit(d5, t10)
    },
    inflate(t10) {
        let d5 = this
        return d5.istate ? d5.istate.inflate(d5, t10) : -2
    },
    inflateEnd() {
        let t10 = this
        if (!t10.istate) return -2
        let d5 = t10.istate.inflateEnd(t10)
        return (t10.istate = null), d5
    },
    inflateSync() {
        let t10 = this
        return t10.istate ? t10.istate.inflateSync(t10) : -2
    },
    inflateSetDictionary(t10, d5) {
        let e6 = this
        return e6.istate ? e6.istate.inflateSetDictionary(e6, t10, d5) : -2
    },
    read_byte(t10) {
        return this.next_in[t10]
    },
    read_buf(t10, d5) {
        return this.next_in.subarray(t10, t10 + d5)
    },
}
function Tt2(t10) {
    let d5 = this,
        e6 = new Zt2(),
        c7 = t10 && t10.chunkSize ? Math.floor(t10.chunkSize * 2) : 128 * 1024,
        l6 = dn,
        x6 = new Uint8Array(c7),
        w6 = false
    e6.inflateInit(),
        (e6.next_out = x6),
        (d5.append = function (S8, u6) {
            let N7 = [],
                A7,
                O6,
                Z5 = 0,
                M6 = 0,
                B6 = 0
            if (S8.length !== 0) {
                ;(e6.next_in_index = 0), (e6.next_in = S8), (e6.avail_in = S8.length)
                do {
                    if (((e6.next_out_index = 0), (e6.avail_out = c7), e6.avail_in === 0 && !w6 && ((e6.next_in_index = 0), (w6 = true)), (A7 = e6.inflate(l6)), w6 && A7 === -5)) {
                        if (e6.avail_in !== 0) throw new Error("inflating: bad input")
                    } else if (A7 !== 0 && A7 !== 1) throw new Error("inflating: " + e6.msg)
                    if ((w6 || A7 === 1) && e6.avail_in === S8.length) throw new Error("inflating: bad input")
                    e6.next_out_index && (e6.next_out_index === c7 ? N7.push(new Uint8Array(x6)) : N7.push(x6.subarray(0, e6.next_out_index))), (B6 += e6.next_out_index), u6 && e6.next_in_index > 0 && e6.next_in_index != Z5 && (u6(e6.next_in_index), (Z5 = e6.next_in_index))
                } while (e6.avail_in > 0 || e6.avail_out === 0)
                return (
                    N7.length > 1
                        ? ((O6 = new Uint8Array(B6)),
                          N7.forEach(function (a4) {
                              O6.set(a4, M6), (M6 += a4.length)
                          }))
                        : (O6 = N7[0] ? new Uint8Array(N7[0]) : new Uint8Array()),
                    O6
                )
            }
        }),
        (d5.flush = function () {
            e6.inflateEnd()
        })
}
var Pe4 = { application: { "andrew-inset": "ez", annodex: "anx", "atom+xml": "atom", "atomcat+xml": "atomcat", "atomserv+xml": "atomsrv", bbolin: "lin", "cu-seeme": "cu", "davmount+xml": "davmount", dsptype: "tsp", ecmascript: ["es", "ecma"], futuresplash: "spl", hta: "hta", "java-archive": "jar", "java-serialized-object": "ser", "java-vm": "class", m3g: "m3g", "mac-binhex40": "hqx", mathematica: ["nb", "ma", "mb"], msaccess: "mdb", msword: ["doc", "dot", "wiz"], mxf: "mxf", oda: "oda", ogg: "ogx", pdf: "pdf", "pgp-keys": "key", "pgp-signature": ["asc", "sig"], "pics-rules": "prf", postscript: ["ps", "ai", "eps", "epsi", "epsf", "eps2", "eps3"], rar: "rar", "rdf+xml": "rdf", "rss+xml": "rss", rtf: "rtf", "xhtml+xml": ["xhtml", "xht"], xml: ["xml", "xsl", "xsd", "xpdl"], "xspf+xml": "xspf", zip: "zip", "vnd.android.package-archive": "apk", "vnd.cinderella": "cdy", "vnd.google-earth.kml+xml": "kml", "vnd.google-earth.kmz": "kmz", "vnd.mozilla.xul+xml": "xul", "vnd.ms-excel": ["xls", "xlb", "xlt", "xlm", "xla", "xlc", "xlw"], "vnd.ms-pki.seccat": "cat", "vnd.ms-pki.stl": "stl", "vnd.ms-powerpoint": ["ppt", "pps", "pot", "ppa", "pwz"], "vnd.oasis.opendocument.chart": "odc", "vnd.oasis.opendocument.database": "odb", "vnd.oasis.opendocument.formula": "odf", "vnd.oasis.opendocument.graphics": "odg", "vnd.oasis.opendocument.graphics-template": "otg", "vnd.oasis.opendocument.image": "odi", "vnd.oasis.opendocument.presentation": "odp", "vnd.oasis.opendocument.presentation-template": "otp", "vnd.oasis.opendocument.spreadsheet": "ods", "vnd.oasis.opendocument.spreadsheet-template": "ots", "vnd.oasis.opendocument.text": "odt", "vnd.oasis.opendocument.text-master": ["odm", "otm"], "vnd.oasis.opendocument.text-template": "ott", "vnd.oasis.opendocument.text-web": "oth", "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx", "vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx", "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx", "vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx", "vnd.openxmlformats-officedocument.presentationml.template": "potx", "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx", "vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx", "vnd.smaf": "mmf", "vnd.stardivision.calc": "sdc", "vnd.stardivision.chart": "sds", "vnd.stardivision.draw": "sda", "vnd.stardivision.impress": "sdd", "vnd.stardivision.math": ["sdf", "smf"], "vnd.stardivision.writer": ["sdw", "vor"], "vnd.stardivision.writer-global": "sgl", "vnd.sun.xml.calc": "sxc", "vnd.sun.xml.calc.template": "stc", "vnd.sun.xml.draw": "sxd", "vnd.sun.xml.draw.template": "std", "vnd.sun.xml.impress": "sxi", "vnd.sun.xml.impress.template": "sti", "vnd.sun.xml.math": "sxm", "vnd.sun.xml.writer": "sxw", "vnd.sun.xml.writer.global": "sxg", "vnd.sun.xml.writer.template": "stw", "vnd.symbian.install": ["sis", "sisx"], "vnd.visio": ["vsd", "vst", "vss", "vsw", "vsdx", "vssx", "vstx", "vssm", "vstm"], "vnd.wap.wbxml": "wbxml", "vnd.wap.wmlc": "wmlc", "vnd.wap.wmlscriptc": "wmlsc", "vnd.wordperfect": "wpd", "vnd.wordperfect5.1": "wp5", "x-123": "wk", "x-7z-compressed": "7z", "x-abiword": "abw", "x-apple-diskimage": "dmg", "x-bcpio": "bcpio", "x-bittorrent": "torrent", "x-cbr": ["cbr", "cba", "cbt", "cb7"], "x-cbz": "cbz", "x-cdf": ["cdf", "cda"], "x-cdlink": "vcd", "x-chess-pgn": "pgn", "x-cpio": "cpio", "x-csh": "csh", "x-director": ["dir", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "x-dms": "dms", "x-doom": "wad", "x-dvi": "dvi", "x-httpd-eruby": "rhtml", "x-font": "pcf.Z", "x-freemind": "mm", "x-gnumeric": "gnumeric", "x-go-sgf": "sgf", "x-graphing-calculator": "gcf", "x-gtar": ["gtar", "taz"], "x-hdf": "hdf", "x-httpd-php": ["phtml", "pht", "php"], "x-httpd-php-source": "phps", "x-httpd-php3": "php3", "x-httpd-php3-preprocessed": "php3p", "x-httpd-php4": "php4", "x-httpd-php5": "php5", "x-ica": "ica", "x-info": "info", "x-internet-signup": ["ins", "isp"], "x-iphone": "iii", "x-iso9660-image": "iso", "x-java-jnlp-file": "jnlp", "x-jmol": "jmz", "x-killustrator": "kil", "x-latex": "latex", "x-lyx": "lyx", "x-lzx": "lzx", "x-maker": ["frm", "fb", "fbdoc"], "x-ms-wmd": "wmd", "x-msdos-program": ["com", "exe", "bat", "dll"], "x-netcdf": ["nc"], "x-ns-proxy-autoconfig": ["pac", "dat"], "x-nwc": "nwc", "x-object": "o", "x-oz-application": "oza", "x-pkcs7-certreqresp": "p7r", "x-python-code": ["pyc", "pyo"], "x-qgis": ["qgs", "shp", "shx"], "x-quicktimeplayer": "qtl", "x-redhat-package-manager": ["rpm", "rpa"], "x-ruby": "rb", "x-sh": "sh", "x-shar": "shar", "x-shockwave-flash": ["swf", "swfl"], "x-silverlight": "scr", "x-stuffit": "sit", "x-sv4cpio": "sv4cpio", "x-sv4crc": "sv4crc", "x-tar": "tar", "x-tex-gf": "gf", "x-tex-pk": "pk", "x-texinfo": ["texinfo", "texi"], "x-trash": ["~", "%", "bak", "old", "sik"], "x-ustar": "ustar", "x-wais-source": "src", "x-wingz": "wz", "x-x509-ca-cert": ["crt", "der", "cer"], "x-xcf": "xcf", "x-xfig": "fig", "x-xpinstall": "xpi", applixware: "aw", "atomsvc+xml": "atomsvc", "ccxml+xml": "ccxml", "cdmi-capability": "cdmia", "cdmi-container": "cdmic", "cdmi-domain": "cdmid", "cdmi-object": "cdmio", "cdmi-queue": "cdmiq", "docbook+xml": "dbk", "dssc+der": "dssc", "dssc+xml": "xdssc", "emma+xml": "emma", "epub+zip": "epub", exi: "exi", "font-tdpfr": "pfr", "gml+xml": "gml", "gpx+xml": "gpx", gxf: "gxf", hyperstudio: "stk", "inkml+xml": ["ink", "inkml"], ipfix: "ipfix", "jsonml+json": "jsonml", "lost+xml": "lostxml", "mads+xml": "mads", marc: "mrc", "marcxml+xml": "mrcx", "mathml+xml": ["mathml", "mml"], mbox: "mbox", "mediaservercontrol+xml": "mscml", "metalink+xml": "metalink", "metalink4+xml": "meta4", "mets+xml": "mets", "mods+xml": "mods", mp21: ["m21", "mp21"], mp4: "mp4s", "oebps-package+xml": "opf", "omdoc+xml": "omdoc", onenote: ["onetoc", "onetoc2", "onetmp", "onepkg"], oxps: "oxps", "patch-ops-error+xml": "xer", "pgp-encrypted": "pgp", pkcs10: "p10", "pkcs7-mime": ["p7m", "p7c"], "pkcs7-signature": "p7s", pkcs8: "p8", "pkix-attr-cert": "ac", "pkix-crl": "crl", "pkix-pkipath": "pkipath", pkixcmp: "pki", "pls+xml": "pls", "prs.cww": "cww", "pskc+xml": "pskcxml", "reginfo+xml": "rif", "relax-ng-compact-syntax": "rnc", "resource-lists+xml": "rl", "resource-lists-diff+xml": "rld", "rls-services+xml": "rs", "rpki-ghostbusters": "gbr", "rpki-manifest": "mft", "rpki-roa": "roa", "rsd+xml": "rsd", "sbml+xml": "sbml", "scvp-cv-request": "scq", "scvp-cv-response": "scs", "scvp-vp-request": "spq", "scvp-vp-response": "spp", sdp: "sdp", "set-payment-initiation": "setpay", "set-registration-initiation": "setreg", "shf+xml": "shf", "sparql-query": "rq", "sparql-results+xml": "srx", srgs: "gram", "srgs+xml": "grxml", "sru+xml": "sru", "ssdl+xml": "ssdl", "ssml+xml": "ssml", "tei+xml": ["tei", "teicorpus"], "thraud+xml": "tfi", "timestamped-data": "tsd", "vnd.3gpp.pic-bw-large": "plb", "vnd.3gpp.pic-bw-small": "psb", "vnd.3gpp.pic-bw-var": "pvb", "vnd.3gpp2.tcap": "tcap", "vnd.3m.post-it-notes": "pwn", "vnd.accpac.simply.aso": "aso", "vnd.accpac.simply.imp": "imp", "vnd.acucobol": "acu", "vnd.acucorp": ["atc", "acutc"], "vnd.adobe.air-application-installer-package+zip": "air", "vnd.adobe.formscentral.fcdt": "fcdt", "vnd.adobe.fxp": ["fxp", "fxpl"], "vnd.adobe.xdp+xml": "xdp", "vnd.adobe.xfdf": "xfdf", "vnd.ahead.space": "ahead", "vnd.airzip.filesecure.azf": "azf", "vnd.airzip.filesecure.azs": "azs", "vnd.amazon.ebook": "azw", "vnd.americandynamics.acc": "acc", "vnd.amiga.ami": "ami", "vnd.anser-web-certificate-issue-initiation": "cii", "vnd.anser-web-funds-transfer-initiation": "fti", "vnd.antix.game-component": "atx", "vnd.apple.installer+xml": "mpkg", "vnd.apple.mpegurl": "m3u8", "vnd.aristanetworks.swi": "swi", "vnd.astraea-software.iota": "iota", "vnd.audiograph": "aep", "vnd.blueice.multipass": "mpm", "vnd.bmi": "bmi", "vnd.businessobjects": "rep", "vnd.chemdraw+xml": "cdxml", "vnd.chipnuts.karaoke-mmd": "mmd", "vnd.claymore": "cla", "vnd.cloanto.rp9": "rp9", "vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "vnd.cluetrust.cartomobile-config": "c11amc", "vnd.cluetrust.cartomobile-config-pkg": "c11amz", "vnd.commonspace": "csp", "vnd.contact.cmsg": "cdbcmsg", "vnd.cosmocaller": "cmc", "vnd.crick.clicker": "clkx", "vnd.crick.clicker.keyboard": "clkk", "vnd.crick.clicker.palette": "clkp", "vnd.crick.clicker.template": "clkt", "vnd.crick.clicker.wordbank": "clkw", "vnd.criticaltools.wbs+xml": "wbs", "vnd.ctc-posml": "pml", "vnd.cups-ppd": "ppd", "vnd.curl.car": "car", "vnd.curl.pcurl": "pcurl", "vnd.dart": "dart", "vnd.data-vision.rdz": "rdz", "vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "vnd.dece.ttml+xml": ["uvt", "uvvt"], "vnd.dece.unspecified": ["uvx", "uvvx"], "vnd.dece.zip": ["uvz", "uvvz"], "vnd.denovo.fcselayout-link": "fe_launch", "vnd.dna": "dna", "vnd.dolby.mlp": "mlp", "vnd.dpgraph": "dpg", "vnd.dreamfactory": "dfac", "vnd.ds-keypoint": "kpxx", "vnd.dvb.ait": "ait", "vnd.dvb.service": "svc", "vnd.dynageo": "geo", "vnd.ecowin.chart": "mag", "vnd.enliven": "nml", "vnd.epson.esf": "esf", "vnd.epson.msf": "msf", "vnd.epson.quickanime": "qam", "vnd.epson.salt": "slt", "vnd.epson.ssf": "ssf", "vnd.eszigno3+xml": ["es3", "et3"], "vnd.ezpix-album": "ez2", "vnd.ezpix-package": "ez3", "vnd.fdf": "fdf", "vnd.fdsn.mseed": "mseed", "vnd.fdsn.seed": ["seed", "dataless"], "vnd.flographit": "gph", "vnd.fluxtime.clip": "ftc", "vnd.framemaker": ["fm", "frame", "maker", "book"], "vnd.frogans.fnc": "fnc", "vnd.frogans.ltf": "ltf", "vnd.fsc.weblaunch": "fsc", "vnd.fujitsu.oasys": "oas", "vnd.fujitsu.oasys2": "oa2", "vnd.fujitsu.oasys3": "oa3", "vnd.fujitsu.oasysgp": "fg5", "vnd.fujitsu.oasysprs": "bh2", "vnd.fujixerox.ddd": "ddd", "vnd.fujixerox.docuworks": "xdw", "vnd.fujixerox.docuworks.binder": "xbd", "vnd.fuzzysheet": "fzs", "vnd.genomatix.tuxedo": "txd", "vnd.geogebra.file": "ggb", "vnd.geogebra.tool": "ggt", "vnd.geometry-explorer": ["gex", "gre"], "vnd.geonext": "gxt", "vnd.geoplan": "g2w", "vnd.geospace": "g3w", "vnd.gmx": "gmx", "vnd.grafeq": ["gqf", "gqs"], "vnd.groove-account": "gac", "vnd.groove-help": "ghf", "vnd.groove-identity-message": "gim", "vnd.groove-injector": "grv", "vnd.groove-tool-message": "gtm", "vnd.groove-tool-template": "tpl", "vnd.groove-vcard": "vcg", "vnd.hal+xml": "hal", "vnd.handheld-entertainment+xml": "zmm", "vnd.hbci": "hbci", "vnd.hhe.lesson-player": "les", "vnd.hp-hpgl": "hpgl", "vnd.hp-hpid": "hpid", "vnd.hp-hps": "hps", "vnd.hp-jlyt": "jlt", "vnd.hp-pcl": "pcl", "vnd.hp-pclxl": "pclxl", "vnd.hydrostatix.sof-data": "sfd-hdstx", "vnd.ibm.minipay": "mpy", "vnd.ibm.modcap": ["afp", "listafp", "list3820"], "vnd.ibm.rights-management": "irm", "vnd.ibm.secure-container": "sc", "vnd.iccprofile": ["icc", "icm"], "vnd.igloader": "igl", "vnd.immervision-ivp": "ivp", "vnd.immervision-ivu": "ivu", "vnd.insors.igm": "igm", "vnd.intercon.formnet": ["xpw", "xpx"], "vnd.intergeo": "i2g", "vnd.intu.qbo": "qbo", "vnd.intu.qfx": "qfx", "vnd.ipunplugged.rcprofile": "rcprofile", "vnd.irepository.package+xml": "irp", "vnd.is-xpr": "xpr", "vnd.isac.fcs": "fcs", "vnd.jam": "jam", "vnd.jcp.javame.midlet-rms": "rms", "vnd.jisp": "jisp", "vnd.joost.joda-archive": "joda", "vnd.kahootz": ["ktz", "ktr"], "vnd.kde.karbon": "karbon", "vnd.kde.kchart": "chrt", "vnd.kde.kformula": "kfo", "vnd.kde.kivio": "flw", "vnd.kde.kontour": "kon", "vnd.kde.kpresenter": ["kpr", "kpt"], "vnd.kde.kspread": "ksp", "vnd.kde.kword": ["kwd", "kwt"], "vnd.kenameaapp": "htke", "vnd.kidspiration": "kia", "vnd.kinar": ["kne", "knp"], "vnd.koan": ["skp", "skd", "skt", "skm"], "vnd.kodak-descriptor": "sse", "vnd.las.las+xml": "lasxml", "vnd.llamagraphics.life-balance.desktop": "lbd", "vnd.llamagraphics.life-balance.exchange+xml": "lbe", "vnd.lotus-1-2-3": "123", "vnd.lotus-approach": "apr", "vnd.lotus-freelance": "pre", "vnd.lotus-notes": "nsf", "vnd.lotus-organizer": "org", "vnd.lotus-screencam": "scm", "vnd.lotus-wordpro": "lwp", "vnd.macports.portpkg": "portpkg", "vnd.mcd": "mcd", "vnd.medcalcdata": "mc1", "vnd.mediastation.cdkey": "cdkey", "vnd.mfer": "mwf", "vnd.mfmp": "mfm", "vnd.micrografx.flo": "flo", "vnd.micrografx.igx": "igx", "vnd.mif": "mif", "vnd.mobius.daf": "daf", "vnd.mobius.dis": "dis", "vnd.mobius.mbk": "mbk", "vnd.mobius.mqy": "mqy", "vnd.mobius.msl": "msl", "vnd.mobius.plc": "plc", "vnd.mobius.txf": "txf", "vnd.mophun.application": "mpn", "vnd.mophun.certificate": "mpc", "vnd.ms-artgalry": "cil", "vnd.ms-cab-compressed": "cab", "vnd.ms-excel.addin.macroenabled.12": "xlam", "vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb", "vnd.ms-excel.sheet.macroenabled.12": "xlsm", "vnd.ms-excel.template.macroenabled.12": "xltm", "vnd.ms-fontobject": "eot", "vnd.ms-htmlhelp": "chm", "vnd.ms-ims": "ims", "vnd.ms-lrm": "lrm", "vnd.ms-officetheme": "thmx", "vnd.ms-powerpoint.addin.macroenabled.12": "ppam", "vnd.ms-powerpoint.presentation.macroenabled.12": "pptm", "vnd.ms-powerpoint.slide.macroenabled.12": "sldm", "vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm", "vnd.ms-powerpoint.template.macroenabled.12": "potm", "vnd.ms-project": ["mpp", "mpt"], "vnd.ms-word.document.macroenabled.12": "docm", "vnd.ms-word.template.macroenabled.12": "dotm", "vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "vnd.ms-wpl": "wpl", "vnd.ms-xpsdocument": "xps", "vnd.mseq": "mseq", "vnd.musician": "mus", "vnd.muvee.style": "msty", "vnd.mynfc": "taglet", "vnd.neurolanguage.nlu": "nlu", "vnd.nitf": ["ntf", "nitf"], "vnd.noblenet-directory": "nnd", "vnd.noblenet-sealer": "nns", "vnd.noblenet-web": "nnw", "vnd.nokia.n-gage.data": "ngdat", "vnd.nokia.n-gage.symbian.install": "n-gage", "vnd.nokia.radio-preset": "rpst", "vnd.nokia.radio-presets": "rpss", "vnd.novadigm.edm": "edm", "vnd.novadigm.edx": "edx", "vnd.novadigm.ext": "ext", "vnd.oasis.opendocument.chart-template": "otc", "vnd.oasis.opendocument.formula-template": "odft", "vnd.oasis.opendocument.image-template": "oti", "vnd.olpc-sugar": "xo", "vnd.oma.dd2+xml": "dd2", "vnd.openofficeorg.extension": "oxt", "vnd.openxmlformats-officedocument.presentationml.slide": "sldx", "vnd.osgeo.mapguide.package": "mgp", "vnd.osgi.dp": "dp", "vnd.osgi.subsystem": "esa", "vnd.palm": ["pdb", "pqa", "oprc"], "vnd.pawaafile": "paw", "vnd.pg.format": "str", "vnd.pg.osasli": "ei6", "vnd.picsel": "efif", "vnd.pmi.widget": "wg", "vnd.pocketlearn": "plf", "vnd.powerbuilder6": "pbd", "vnd.previewsystems.box": "box", "vnd.proteus.magazine": "mgz", "vnd.publishare-delta-tree": "qps", "vnd.pvi.ptid1": "ptid", "vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "vnd.realvnc.bed": "bed", "vnd.recordare.musicxml": "mxl", "vnd.recordare.musicxml+xml": "musicxml", "vnd.rig.cryptonote": "cryptonote", "vnd.rn-realmedia": "rm", "vnd.rn-realmedia-vbr": "rmvb", "vnd.route66.link66+xml": "link66", "vnd.sailingtracker.track": "st", "vnd.seemail": "see", "vnd.sema": "sema", "vnd.semd": "semd", "vnd.semf": "semf", "vnd.shana.informed.formdata": "ifm", "vnd.shana.informed.formtemplate": "itp", "vnd.shana.informed.interchange": "iif", "vnd.shana.informed.package": "ipk", "vnd.simtech-mindmapper": ["twd", "twds"], "vnd.smart.teacher": "teacher", "vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "vnd.spotfire.dxp": "dxp", "vnd.spotfire.sfs": "sfs", "vnd.stepmania.package": "smzip", "vnd.stepmania.stepchart": "sm", "vnd.sus-calendar": ["sus", "susp"], "vnd.svd": "svd", "vnd.syncml+xml": "xsm", "vnd.syncml.dm+wbxml": "bdm", "vnd.syncml.dm+xml": "xdm", "vnd.tao.intent-module-archive": "tao", "vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "vnd.tmobile-livetv": "tmo", "vnd.trid.tpt": "tpt", "vnd.triscape.mxs": "mxs", "vnd.trueapp": "tra", "vnd.ufdl": ["ufd", "ufdl"], "vnd.uiq.theme": "utz", "vnd.umajin": "umj", "vnd.unity": "unityweb", "vnd.uoml+xml": "uoml", "vnd.vcx": "vcx", "vnd.visionary": "vis", "vnd.vsf": "vsf", "vnd.webturbo": "wtb", "vnd.wolfram.player": "nbp", "vnd.wqd": "wqd", "vnd.wt.stf": "stf", "vnd.xara": "xar", "vnd.xfdl": "xfdl", "vnd.yamaha.hv-dic": "hvd", "vnd.yamaha.hv-script": "hvs", "vnd.yamaha.hv-voice": "hvp", "vnd.yamaha.openscoreformat": "osf", "vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg", "vnd.yamaha.smaf-audio": "saf", "vnd.yamaha.smaf-phrase": "spf", "vnd.yellowriver-custom-menu": "cmp", "vnd.zul": ["zir", "zirz"], "vnd.zzazz.deck+xml": "zaz", "voicexml+xml": "vxml", widget: "wgt", winhlp: "hlp", "wsdl+xml": "wsdl", "wspolicy+xml": "wspolicy", "x-ace-compressed": "ace", "x-authorware-bin": ["aab", "x32", "u32", "vox"], "x-authorware-map": "aam", "x-authorware-seg": "aas", "x-blorb": ["blb", "blorb"], "x-bzip": "bz", "x-bzip2": ["bz2", "boz"], "x-cfs-compressed": "cfs", "x-chat": "chat", "x-conference": "nsc", "x-dgc-compressed": "dgc", "x-dtbncx+xml": "ncx", "x-dtbook+xml": "dtb", "x-dtbresource+xml": "res", "x-eva": "eva", "x-font-bdf": "bdf", "x-font-ghostscript": "gsf", "x-font-linux-psf": "psf", "x-font-pcf": "pcf", "x-font-snf": "snf", "x-font-ttf": ["ttf", "ttc"], "x-font-type1": ["pfa", "pfb", "pfm", "afm"], "x-freearc": "arc", "x-gca-compressed": "gca", "x-glulx": "ulx", "x-gramps-xml": "gramps", "x-install-instructions": "install", "x-lzh-compressed": ["lzh", "lha"], "x-mie": "mie", "x-mobipocket-ebook": ["prc", "mobi"], "x-ms-application": "application", "x-ms-shortcut": "lnk", "x-ms-xbap": "xbap", "x-msbinder": "obd", "x-mscardfile": "crd", "x-msclip": "clp", "application/x-ms-installer": "msi", "x-msmediaview": ["mvb", "m13", "m14"], "x-msmetafile": ["wmf", "wmz", "emf", "emz"], "x-msmoney": "mny", "x-mspublisher": "pub", "x-msschedule": "scd", "x-msterminal": "trm", "x-mswrite": "wri", "x-nzb": "nzb", "x-pkcs12": ["p12", "pfx"], "x-pkcs7-certificates": ["p7b", "spc"], "x-research-info-systems": "ris", "x-silverlight-app": "xap", "x-sql": "sql", "x-stuffitx": "sitx", "x-subrip": "srt", "x-t3vm-image": "t3", "x-tex-tfm": "tfm", "x-tgif": "obj", "x-xliff+xml": "xlf", "x-xz": "xz", "x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "xaml+xml": "xaml", "xcap-diff+xml": "xdf", "xenc+xml": "xenc", "xml-dtd": "dtd", "xop+xml": "xop", "xproc+xml": "xpl", "xslt+xml": "xslt", "xv+xml": ["mxml", "xhvml", "xvml", "xvm"], yang: "yang", "yin+xml": "yin", envoy: "evy", fractals: "fif", "internet-property-stream": "acx", olescript: "axs", "vnd.ms-outlook": "msg", "vnd.ms-pkicertstore": "sst", "x-compress": "z", "x-perfmon": ["pma", "pmc", "pmr", "pmw"], "ynd.ms-pkipko": "pko", gzip: ["gz", "tgz"], "smil+xml": ["smi", "smil"], "vnd.debian.binary-package": ["deb", "udeb"], "vnd.hzn-3d-crossword": "x3d", "vnd.sqlite3": ["db", "sqlite", "sqlite3", "db-wal", "sqlite-wal", "db-shm", "sqlite-shm"], "vnd.wap.sic": "sic", "vnd.wap.slc": "slc", "x-krita": ["kra", "krz"], "x-perl": ["pm", "pl"], yaml: ["yaml", "yml"] }, audio: { amr: "amr", "amr-wb": "awb", annodex: "axa", basic: ["au", "snd"], flac: "flac", midi: ["mid", "midi", "kar", "rmi"], mpeg: ["mpga", "mpega", "mp3", "m4a", "mp2a", "m2a", "m3a"], mpegurl: "m3u", ogg: ["oga", "ogg", "spx"], "prs.sid": "sid", "x-aiff": "aifc", "x-gsm": "gsm", "x-ms-wma": "wma", "x-ms-wax": "wax", "x-pn-realaudio": "ram", "x-realaudio": "ra", "x-sd2": "sd2", adpcm: "adp", mp4: "mp4a", s3m: "s3m", silk: "sil", "vnd.dece.audio": ["uva", "uvva"], "vnd.digital-winds": "eol", "vnd.dra": "dra", "vnd.dts": "dts", "vnd.dts.hd": "dtshd", "vnd.lucent.voice": "lvp", "vnd.ms-playready.media.pya": "pya", "vnd.nuera.ecelp4800": "ecelp4800", "vnd.nuera.ecelp7470": "ecelp7470", "vnd.nuera.ecelp9600": "ecelp9600", "vnd.rip": "rip", webm: "weba", "x-caf": "caf", "x-matroska": "mka", "x-pn-realaudio-plugin": "rmp", xm: "xm", aac: "aac", aiff: ["aiff", "aif", "aff"], opus: "opus", wav: "wav" }, chemical: { "x-alchemy": "alc", "x-cache": ["cac", "cache"], "x-cache-csf": "csf", "x-cactvs-binary": ["cbin", "cascii", "ctab"], "x-cdx": "cdx", "x-chem3d": "c3d", "x-cif": "cif", "x-cmdf": "cmdf", "x-cml": "cml", "x-compass": "cpa", "x-crossfire": "bsd", "x-csml": ["csml", "csm"], "x-ctx": "ctx", "x-cxf": ["cxf", "cef"], "x-embl-dl-nucleotide": ["emb", "embl"], "x-gamess-input": ["inp", "gam", "gamin"], "x-gaussian-checkpoint": ["fch", "fchk"], "x-gaussian-cube": "cub", "x-gaussian-input": ["gau", "gjc", "gjf"], "x-gaussian-log": "gal", "x-gcg8-sequence": "gcg", "x-genbank": "gen", "x-hin": "hin", "x-isostar": ["istr", "ist"], "x-jcamp-dx": ["jdx", "dx"], "x-kinemage": "kin", "x-macmolecule": "mcm", "x-macromodel-input": "mmod", "x-mdl-molfile": "mol", "x-mdl-rdfile": "rd", "x-mdl-rxnfile": "rxn", "x-mdl-sdfile": "sd", "x-mdl-tgf": "tgf", "x-mmcif": "mcif", "x-mol2": "mol2", "x-molconn-Z": "b", "x-mopac-graph": "gpt", "x-mopac-input": ["mop", "mopcrt", "zmt"], "x-mopac-out": "moo", "x-ncbi-asn1": "asn", "x-ncbi-asn1-ascii": ["prt", "ent"], "x-ncbi-asn1-binary": "val", "x-rosdal": "ros", "x-swissprot": "sw", "x-vamas-iso14976": "vms", "x-vmd": "vmd", "x-xtel": "xtel", "x-xyz": "xyz" }, font: { otf: "otf", woff: "woff", woff2: "woff2" }, image: { gif: "gif", ief: "ief", jpeg: ["jpeg", "jpg", "jpe", "jfif", "jfif-tbnl", "jif"], pcx: "pcx", png: "png", "svg+xml": ["svg", "svgz"], tiff: ["tiff", "tif"], "vnd.djvu": ["djvu", "djv"], "vnd.wap.wbmp": "wbmp", "x-canon-cr2": "cr2", "x-canon-crw": "crw", "x-cmu-raster": "ras", "x-coreldraw": "cdr", "x-coreldrawpattern": "pat", "x-coreldrawtemplate": "cdt", "x-corelphotopaint": "cpt", "x-epson-erf": "erf", "x-icon": "ico", "x-jg": "art", "x-jng": "jng", "x-nikon-nef": "nef", "x-olympus-orf": "orf", "x-portable-anymap": "pnm", "x-portable-bitmap": "pbm", "x-portable-graymap": "pgm", "x-portable-pixmap": "ppm", "x-rgb": "rgb", "x-xbitmap": "xbm", "x-xpixmap": "xpm", "x-xwindowdump": "xwd", bmp: "bmp", cgm: "cgm", g3fax: "g3", ktx: "ktx", "prs.btif": "btif", sgi: "sgi", "vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "vnd.dwg": "dwg", "vnd.dxf": "dxf", "vnd.fastbidsheet": "fbs", "vnd.fpx": "fpx", "vnd.fst": "fst", "vnd.fujixerox.edmics-mmr": "mmr", "vnd.fujixerox.edmics-rlc": "rlc", "vnd.ms-modi": "mdi", "vnd.ms-photo": "wdp", "vnd.net-fpx": "npx", "vnd.xiff": "xif", webp: "webp", "x-3ds": "3ds", "x-cmx": "cmx", "x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "x-pict": ["pic", "pct"], "x-tga": "tga", "cis-cod": "cod", avif: "avifs", heic: ["heif", "heic"], pjpeg: ["pjpg"], "vnd.adobe.photoshop": "psd", "x-adobe-dng": "dng", "x-fuji-raf": "raf", "x-icns": "icns", "x-kodak-dcr": "dcr", "x-kodak-k25": "k25", "x-kodak-kdc": "kdc", "x-minolta-mrw": "mrw", "x-panasonic-raw": ["raw", "rw2", "rwl"], "x-pentax-pef": ["pef", "ptx"], "x-sigma-x3f": "x3f", "x-sony-arw": "arw", "x-sony-sr2": "sr2", "x-sony-srf": "srf" }, message: { rfc822: ["eml", "mime", "mht", "mhtml", "nws"] }, model: { iges: ["igs", "iges"], mesh: ["msh", "mesh", "silo"], vrml: ["wrl", "vrml"], "x3d+vrml": ["x3dv", "x3dvz"], "x3d+xml": "x3dz", "x3d+binary": ["x3db", "x3dbz"], "vnd.collada+xml": "dae", "vnd.dwf": "dwf", "vnd.gdl": "gdl", "vnd.gtw": "gtw", "vnd.mts": "mts", "vnd.usdz+zip": "usdz", "vnd.vtu": "vtu" }, text: { "cache-manifest": ["manifest", "appcache"], calendar: ["ics", "icz", "ifb"], css: "css", csv: "csv", h323: "323", html: ["html", "htm", "shtml", "stm"], iuls: "uls", plain: ["txt", "text", "brf", "conf", "def", "list", "log", "in", "bas", "diff", "ksh"], richtext: "rtx", scriptlet: ["sct", "wsc"], texmacs: "tm", "tab-separated-values": "tsv", "vnd.sun.j2me.app-descriptor": "jad", "vnd.wap.wml": "wml", "vnd.wap.wmlscript": "wmls", "x-bibtex": "bib", "x-boo": "boo", "x-c++hdr": ["h++", "hpp", "hxx", "hh"], "x-c++src": ["c++", "cpp", "cxx", "cc"], "x-component": "htc", "x-dsrc": "d", "x-diff": "patch", "x-haskell": "hs", "x-java": "java", "x-literate-haskell": "lhs", "x-moc": "moc", "x-pascal": ["p", "pas", "pp", "inc"], "x-pcs-gcd": "gcd", "x-python": "py", "x-scala": "scala", "x-setext": "etx", "x-tcl": ["tcl", "tk"], "x-tex": ["tex", "ltx", "sty", "cls"], "x-vcalendar": "vcs", "x-vcard": "vcf", n3: "n3", "prs.lines.tag": "dsc", sgml: ["sgml", "sgm"], troff: ["t", "tr", "roff", "man", "me", "ms"], turtle: "ttl", "uri-list": ["uri", "uris", "urls"], vcard: "vcard", "vnd.curl": "curl", "vnd.curl.dcurl": "dcurl", "vnd.curl.scurl": "scurl", "vnd.curl.mcurl": "mcurl", "vnd.dvb.subtitle": "sub", "vnd.fly": "fly", "vnd.fmi.flexstor": "flx", "vnd.graphviz": "gv", "vnd.in3d.3dml": "3dml", "vnd.in3d.spot": "spot", "x-asm": ["s", "asm"], "x-c": ["c", "h", "dic"], "x-fortran": ["f", "for", "f77", "f90"], "x-opml": "opml", "x-nfo": "nfo", "x-sfv": "sfv", "x-uuencode": "uu", webviewhtml: "htt", javascript: "js", json: "json", markdown: ["md", "markdown", "mdown", "markdn"], "vnd.wap.si": "si", "vnd.wap.sl": "sl" }, video: { avif: "avif", "3gpp": "3gp", annodex: "axv", dl: "dl", dv: ["dif", "dv"], fli: "fli", gl: "gl", mpeg: ["mpeg", "mpg", "mpe", "m1v", "m2v", "mp2", "mpa", "mpv2"], mp4: ["mp4", "mp4v", "mpg4"], quicktime: ["qt", "mov"], ogg: "ogv", "vnd.mpegurl": ["mxu", "m4u"], "x-flv": "flv", "x-la-asf": ["lsf", "lsx"], "x-mng": "mng", "x-ms-asf": ["asf", "asx", "asr"], "x-ms-wm": "wm", "x-ms-wmv": "wmv", "x-ms-wmx": "wmx", "x-ms-wvx": "wvx", "x-msvideo": "avi", "x-sgi-movie": "movie", "x-matroska": ["mpv", "mkv", "mk3d", "mks"], "3gpp2": "3g2", h261: "h261", h263: "h263", h264: "h264", jpeg: "jpgv", jpm: ["jpm", "jpgm"], mj2: ["mj2", "mjp2"], "vnd.dece.hd": ["uvh", "uvvh"], "vnd.dece.mobile": ["uvm", "uvvm"], "vnd.dece.pd": ["uvp", "uvvp"], "vnd.dece.sd": ["uvs", "uvvs"], "vnd.dece.video": ["uvv", "uvvv"], "vnd.dvb.file": "dvb", "vnd.fvt": "fvt", "vnd.ms-playready.media.pyv": "pyv", "vnd.uvvu.mp4": ["uvu", "uvvu"], "vnd.vivo": "viv", webm: "webm", "x-f4v": "f4v", "x-m4v": "m4v", "x-ms-vob": "vob", "x-smv": "smv", mp2t: "ts" }, "x-conference": { "x-cooltalk": "ice" }, "x-world": { "x-vrml": ["vrm", "flr", "wrz", "xaf", "xof"] } }
var En = (() => {
    let t10 = {}
    for (let d5 of Object.keys(Pe4))
        for (let e6 of Object.keys(Pe4[d5])) {
            let c7 = Pe4[d5][e6]
            if (typeof c7 == "string") t10[c7] = d5 + "/" + e6
            else for (let l6 = 0; l6 < c7.length; l6++) t10[c7[l6]] = d5 + "/" + e6
        }
    return t10
})()
var p5 = {}
Wt(p5, { configure: () => b4, getMimeType: () => t7, initShimAsyncCodec: () => g6, terminateWorkers: () => Bt })
I6(p5, io_exports)
I6(p5, zip_reader_exports)
I6(p5, zip_writer_exports)
I6(p5, zip_fs_core_exports)
var Dt
try {
    Dt = import.meta.url
} catch {}
b4({ baseURL: Dt })
s8(b4)
b4({ Deflate: rt2, Inflate: Tt2 })
var export_BlobReader = p5.BlobReader
var export_BlobWriter = p5.BlobWriter
var export_Data64URIReader = p5.Data64URIReader
var export_Data64URIWriter = p5.Data64URIWriter
var export_ERR_BAD_FORMAT = p5.ERR_BAD_FORMAT
var export_ERR_CENTRAL_DIRECTORY_NOT_FOUND = p5.ERR_CENTRAL_DIRECTORY_NOT_FOUND
var export_ERR_DUPLICATED_NAME = p5.ERR_DUPLICATED_NAME
var export_ERR_ENCRYPTED = p5.ERR_ENCRYPTED
var export_ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = p5.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND
var export_ERR_EOCDR_NOT_FOUND = p5.ERR_EOCDR_NOT_FOUND
var export_ERR_EXTRAFIELD_ZIP64_NOT_FOUND = p5.ERR_EXTRAFIELD_ZIP64_NOT_FOUND
var export_ERR_HTTP_RANGE = p5.ERR_HTTP_RANGE
var export_ERR_INVALID_COMMENT = p5.ERR_INVALID_COMMENT
var export_ERR_INVALID_ENCRYPTION_STRENGTH = p5.ERR_INVALID_ENCRYPTION_STRENGTH
var export_ERR_INVALID_ENTRY_COMMENT = p5.ERR_INVALID_ENTRY_COMMENT
var export_ERR_INVALID_ENTRY_NAME = p5.ERR_INVALID_ENTRY_NAME
var export_ERR_INVALID_EXTRAFIELD_DATA = p5.ERR_INVALID_EXTRAFIELD_DATA
var export_ERR_INVALID_EXTRAFIELD_TYPE = p5.ERR_INVALID_EXTRAFIELD_TYPE
var export_ERR_INVALID_PASSWORD = p5.ERR_INVALID_PASSWORD
var export_ERR_INVALID_SIGNATURE = p5.ERR_INVALID_SIGNATURE
var export_ERR_INVALID_VERSION = p5.ERR_INVALID_VERSION
var export_ERR_ITERATOR_COMPLETED_TOO_SOON = p5.ERR_ITERATOR_COMPLETED_TOO_SOON
var export_ERR_LOCAL_FILE_HEADER_NOT_FOUND = p5.ERR_LOCAL_FILE_HEADER_NOT_FOUND
var export_ERR_SPLIT_ZIP_FILE = p5.ERR_SPLIT_ZIP_FILE
var export_ERR_UNDEFINED_UNCOMPRESSED_SIZE = p5.ERR_UNDEFINED_UNCOMPRESSED_SIZE
var export_ERR_UNSUPPORTED_COMPRESSION = p5.ERR_UNSUPPORTED_COMPRESSION
var export_ERR_UNSUPPORTED_ENCRYPTION = p5.ERR_UNSUPPORTED_ENCRYPTION
var export_ERR_UNSUPPORTED_FORMAT = p5.ERR_UNSUPPORTED_FORMAT
var export_HttpRangeReader = p5.HttpRangeReader
var export_HttpReader = p5.HttpReader
var export_Reader = p5.Reader
var export_SplitDataReader = p5.SplitDataReader
var export_SplitDataWriter = p5.SplitDataWriter
var export_SplitZipReader = p5.SplitZipReader
var export_SplitZipWriter = p5.SplitZipWriter
var export_TextReader = p5.TextReader
var export_TextWriter = p5.TextWriter
var export_Uint8ArrayReader = p5.Uint8ArrayReader
var export_Uint8ArrayWriter = p5.Uint8ArrayWriter
var export_Writer = p5.Writer
var export_ZipReader = p5.ZipReader
var export_ZipReaderStream = p5.ZipReaderStream
var export_ZipWriter = p5.ZipWriter
var export_ZipWriterStream = p5.ZipWriterStream
var export_fs = p5.fs

// https://esm.sh/@jsr/astral__astral@0.5.2/denonext/astral__astral.mjs
var A6 = Deno.permissions.querySync
if (!A6) {
    let t10 = { run: "denied", read: "granted", write: "denied", net: "granted", env: "granted", sys: "denied", ffi: "denied" }
    A6 = ({ name: e6 }) => ({
        state: t10[e6],
        onchange: null,
        partial: false,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
            return false
        },
    })
}
var k7 = A6({ name: "env", variable: "DEBUG" }).state === "granted" && !!Deno.env.get("DEBUG")
function ca(t10) {
    t10.addEventListener("message", (r8) => {
        console.log("<--", r8.data)
    })
    let e6 = t10.send.bind(t10)
    t10.send = (r8) => (console.log("-->", r8), e6(r8))
}
var ua = "1.3"
var N6 = class extends CustomEvent {
    constructor(e6) {
        super("Accessibility.loadComplete", { detail: e6 })
    }
}
var M5 = class extends CustomEvent {
    constructor(e6) {
        super("Accessibility.nodesUpdated", { detail: e6 })
    }
}
var I7 = class extends CustomEvent {
    constructor(e6) {
        super("Animation.animationCanceled", { detail: e6 })
    }
}
var R6 = class extends CustomEvent {
    constructor(e6) {
        super("Animation.animationCreated", { detail: e6 })
    }
}
var B5 = class extends CustomEvent {
    constructor(e6) {
        super("Animation.animationStarted", { detail: e6 })
    }
}
var K3 = class extends CustomEvent {
    constructor(e6) {
        super("Audits.issueAdded", { detail: e6 })
    }
}
var L5 = class extends CustomEvent {
    constructor(e6) {
        super("Autofill.addressFormFilled", { detail: e6 })
    }
}
var W4 = class extends CustomEvent {
    constructor(e6) {
        super("BackgroundService.recordingStateChanged", { detail: e6 })
    }
}
var U6 = class extends CustomEvent {
    constructor(e6) {
        super("BackgroundService.backgroundServiceEventReceived", { detail: e6 })
    }
}
var H5 = class extends CustomEvent {
    constructor(e6) {
        super("Browser.downloadWillBegin", { detail: e6 })
    }
}
var q4 = class extends CustomEvent {
    constructor(e6) {
        super("Browser.downloadProgress", { detail: e6 })
    }
}
var V5 = class extends CustomEvent {
    constructor(e6) {
        super("CSS.fontsUpdated", { detail: e6 })
    }
}
var j6 = class extends CustomEvent {
    constructor(e6) {
        super("CSS.styleSheetAdded", { detail: e6 })
    }
}
var $3 = class extends CustomEvent {
    constructor(e6) {
        super("CSS.styleSheetChanged", { detail: e6 })
    }
}
var G6 = class extends CustomEvent {
    constructor(e6) {
        super("CSS.styleSheetRemoved", { detail: e6 })
    }
}
var z5 = class extends CustomEvent {
    constructor(e6) {
        super("Cast.sinksUpdated", { detail: e6 })
    }
}
var Q3 = class extends CustomEvent {
    constructor(e6) {
        super("Cast.issueUpdated", { detail: e6 })
    }
}
var X5 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.attributeModified", { detail: e6 })
    }
}
var J2 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.attributeRemoved", { detail: e6 })
    }
}
var Y5 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.characterDataModified", { detail: e6 })
    }
}
var Z4 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.childNodeCountUpdated", { detail: e6 })
    }
}
var _8 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.childNodeInserted", { detail: e6 })
    }
}
var ee3 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.childNodeRemoved", { detail: e6 })
    }
}
var te4 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.distributedNodesUpdated", { detail: e6 })
    }
}
var re5 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.inlineStyleInvalidated", { detail: e6 })
    }
}
var ae4 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.pseudoElementAdded", { detail: e6 })
    }
}
var se3 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.pseudoElementRemoved", { detail: e6 })
    }
}
var oe2 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.setChildNodes", { detail: e6 })
    }
}
var ne4 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.shadowRootPopped", { detail: e6 })
    }
}
var ie3 = class extends CustomEvent {
    constructor(e6) {
        super("DOM.shadowRootPushed", { detail: e6 })
    }
}
var ce4 = class extends CustomEvent {
    constructor(e6) {
        super("DOMStorage.domStorageItemAdded", { detail: e6 })
    }
}
var ue2 = class extends CustomEvent {
    constructor(e6) {
        super("DOMStorage.domStorageItemRemoved", { detail: e6 })
    }
}
var de4 = class extends CustomEvent {
    constructor(e6) {
        super("DOMStorage.domStorageItemUpdated", { detail: e6 })
    }
}
var le3 = class extends CustomEvent {
    constructor(e6) {
        super("DOMStorage.domStorageItemsCleared", { detail: e6 })
    }
}
var ye5 = class extends CustomEvent {
    constructor(e6) {
        super("Database.addDatabase", { detail: e6 })
    }
}
var he3 = class extends CustomEvent {
    constructor(e6) {
        super("Input.dragIntercepted", { detail: e6 })
    }
}
var pe3 = class extends CustomEvent {
    constructor(e6) {
        super("Inspector.detached", { detail: e6 })
    }
}
var ge3 = class extends CustomEvent {
    constructor(e6) {
        super("LayerTree.layerPainted", { detail: e6 })
    }
}
var we4 = class extends CustomEvent {
    constructor(e6) {
        super("LayerTree.layerTreeDidChange", { detail: e6 })
    }
}
var me2 = class extends CustomEvent {
    constructor(e6) {
        super("Log.entryAdded", { detail: e6 })
    }
}
var ke4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.dataReceived", { detail: e6 })
    }
}
var Ce5 = class extends CustomEvent {
    constructor(e6) {
        super("Network.eventSourceMessageReceived", { detail: e6 })
    }
}
var Se4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.loadingFailed", { detail: e6 })
    }
}
var fe4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.loadingFinished", { detail: e6 })
    }
}
var xe3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.requestIntercepted", { detail: e6 })
    }
}
var be4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.requestServedFromCache", { detail: e6 })
    }
}
var De3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.requestWillBeSent", { detail: e6 })
    }
}
var ve = class extends CustomEvent {
    constructor(e6) {
        super("Network.resourceChangedPriority", { detail: e6 })
    }
}
var Oe3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.signedExchangeReceived", { detail: e6 })
    }
}
var Pe5 = class extends CustomEvent {
    constructor(e6) {
        super("Network.responseReceived", { detail: e6 })
    }
}
var Ee3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketClosed", { detail: e6 })
    }
}
var Te3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketCreated", { detail: e6 })
    }
}
var Fe2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketFrameError", { detail: e6 })
    }
}
var Ae3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketFrameReceived", { detail: e6 })
    }
}
var Ne4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketFrameSent", { detail: e6 })
    }
}
var Me4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketHandshakeResponseReceived", { detail: e6 })
    }
}
var Ie5 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webSocketWillSendHandshakeRequest", { detail: e6 })
    }
}
var Re4 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webTransportCreated", { detail: e6 })
    }
}
var Be3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webTransportConnectionEstablished", { detail: e6 })
    }
}
var Ke2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.webTransportClosed", { detail: e6 })
    }
}
var Le3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.requestWillBeSentExtraInfo", { detail: e6 })
    }
}
var We2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.responseReceivedExtraInfo", { detail: e6 })
    }
}
var Ue5 = class extends CustomEvent {
    constructor(e6) {
        super("Network.responseReceivedEarlyHints", { detail: e6 })
    }
}
var He2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.trustTokenOperationDone", { detail: e6 })
    }
}
var qe2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.subresourceWebBundleMetadataReceived", { detail: e6 })
    }
}
var Ve = class extends CustomEvent {
    constructor(e6) {
        super("Network.subresourceWebBundleMetadataError", { detail: e6 })
    }
}
var je2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.subresourceWebBundleInnerResponseParsed", { detail: e6 })
    }
}
var $e2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.subresourceWebBundleInnerResponseError", { detail: e6 })
    }
}
var Ge2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.reportingApiReportAdded", { detail: e6 })
    }
}
var ze3 = class extends CustomEvent {
    constructor(e6) {
        super("Network.reportingApiReportUpdated", { detail: e6 })
    }
}
var Qe2 = class extends CustomEvent {
    constructor(e6) {
        super("Network.reportingApiEndpointsChangedForOrigin", { detail: e6 })
    }
}
var Xe2 = class extends CustomEvent {
    constructor(e6) {
        super("Overlay.inspectNodeRequested", { detail: e6 })
    }
}
var Je2 = class extends CustomEvent {
    constructor(e6) {
        super("Overlay.nodeHighlightRequested", { detail: e6 })
    }
}
var Ye3 = class extends CustomEvent {
    constructor(e6) {
        super("Overlay.screenshotRequested", { detail: e6 })
    }
}
var Ze3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.domContentEventFired", { detail: e6 })
    }
}
var _e3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.fileChooserOpened", { detail: e6 })
    }
}
var et3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameAttached", { detail: e6 })
    }
}
var tt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameClearedScheduledNavigation", { detail: e6 })
    }
}
var rt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameDetached", { detail: e6 })
    }
}
var at3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameNavigated", { detail: e6 })
    }
}
var st4 = class extends CustomEvent {
    constructor(e6) {
        super("Page.documentOpened", { detail: e6 })
    }
}
var ot2 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameRequestedNavigation", { detail: e6 })
    }
}
var nt4 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameScheduledNavigation", { detail: e6 })
    }
}
var it3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameStartedLoading", { detail: e6 })
    }
}
var ct3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.frameStoppedLoading", { detail: e6 })
    }
}
var ut3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.downloadWillBegin", { detail: e6 })
    }
}
var dt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.downloadProgress", { detail: e6 })
    }
}
var lt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.javascriptDialogClosed", { detail: e6 })
    }
}
var yt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.javascriptDialogOpening", { detail: e6 })
    }
}
var ht2 = class extends CustomEvent {
    constructor(e6) {
        super("Page.lifecycleEvent", { detail: e6 })
    }
}
var pt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.backForwardCacheNotUsed", { detail: e6 })
    }
}
var gt2 = class extends CustomEvent {
    constructor(e6) {
        super("Page.loadEventFired", { detail: e6 })
    }
}
var wt2 = class extends CustomEvent {
    constructor(e6) {
        super("Page.navigatedWithinDocument", { detail: e6 })
    }
}
var mt3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.screencastFrame", { detail: e6 })
    }
}
var kt4 = class extends CustomEvent {
    constructor(e6) {
        super("Page.screencastVisibilityChanged", { detail: e6 })
    }
}
var Ct3 = class extends CustomEvent {
    constructor(e6) {
        super("Page.windowOpen", { detail: e6 })
    }
}
var St = class extends CustomEvent {
    constructor(e6) {
        super("Page.compilationCacheProduced", { detail: e6 })
    }
}
var ft3 = class extends CustomEvent {
    constructor(e6) {
        super("Performance.metrics", { detail: e6 })
    }
}
var xt3 = class extends CustomEvent {
    constructor(e6) {
        super("PerformanceTimeline.timelineEventAdded", { detail: e6 })
    }
}
var bt3 = class extends CustomEvent {
    constructor(e6) {
        super("Security.certificateError", { detail: e6 })
    }
}
var Dt2 = class extends CustomEvent {
    constructor(e6) {
        super("Security.visibleSecurityStateChanged", { detail: e6 })
    }
}
var vt4 = class extends CustomEvent {
    constructor(e6) {
        super("Security.securityStateChanged", { detail: e6 })
    }
}
var Ot2 = class extends CustomEvent {
    constructor(e6) {
        super("ServiceWorker.workerErrorReported", { detail: e6 })
    }
}
var Pt3 = class extends CustomEvent {
    constructor(e6) {
        super("ServiceWorker.workerRegistrationUpdated", { detail: e6 })
    }
}
var Et2 = class extends CustomEvent {
    constructor(e6) {
        super("ServiceWorker.workerVersionUpdated", { detail: e6 })
    }
}
var Tt3 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.cacheStorageContentUpdated", { detail: e6 })
    }
}
var Ft = class extends CustomEvent {
    constructor(e6) {
        super("Storage.cacheStorageListUpdated", { detail: e6 })
    }
}
var At2 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.indexedDBContentUpdated", { detail: e6 })
    }
}
var Nt = class extends CustomEvent {
    constructor(e6) {
        super("Storage.indexedDBListUpdated", { detail: e6 })
    }
}
var Mt3 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.interestGroupAccessed", { detail: e6 })
    }
}
var It = class extends CustomEvent {
    constructor(e6) {
        super("Storage.interestGroupAuctionEventOccurred", { detail: e6 })
    }
}
var Rt3 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.interestGroupAuctionNetworkRequestCreated", { detail: e6 })
    }
}
var Bt3 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.sharedStorageAccessed", { detail: e6 })
    }
}
var Kt2 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.storageBucketCreatedOrUpdated", { detail: e6 })
    }
}
var Lt = class extends CustomEvent {
    constructor(e6) {
        super("Storage.storageBucketDeleted", { detail: e6 })
    }
}
var Wt2 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.attributionReportingSourceRegistered", { detail: e6 })
    }
}
var Ut3 = class extends CustomEvent {
    constructor(e6) {
        super("Storage.attributionReportingTriggerRegistered", { detail: e6 })
    }
}
var Ht2 = class extends CustomEvent {
    constructor(e6) {
        super("Target.attachedToTarget", { detail: e6 })
    }
}
var qt2 = class extends CustomEvent {
    constructor(e6) {
        super("Target.detachedFromTarget", { detail: e6 })
    }
}
var Vt3 = class extends CustomEvent {
    constructor(e6) {
        super("Target.receivedMessageFromTarget", { detail: e6 })
    }
}
var jt2 = class extends CustomEvent {
    constructor(e6) {
        super("Target.targetCreated", { detail: e6 })
    }
}
var $t2 = class extends CustomEvent {
    constructor(e6) {
        super("Target.targetDestroyed", { detail: e6 })
    }
}
var Gt3 = class extends CustomEvent {
    constructor(e6) {
        super("Target.targetCrashed", { detail: e6 })
    }
}
var zt4 = class extends CustomEvent {
    constructor(e6) {
        super("Target.targetInfoChanged", { detail: e6 })
    }
}
var Qt2 = class extends CustomEvent {
    constructor(e6) {
        super("Tethering.accepted", { detail: e6 })
    }
}
var Xt3 = class extends CustomEvent {
    constructor(e6) {
        super("Tracing.bufferUsage", { detail: e6 })
    }
}
var Jt3 = class extends CustomEvent {
    constructor(e6) {
        super("Tracing.dataCollected", { detail: e6 })
    }
}
var Yt4 = class extends CustomEvent {
    constructor(e6) {
        super("Tracing.tracingComplete", { detail: e6 })
    }
}
var Zt3 = class extends CustomEvent {
    constructor(e6) {
        super("Fetch.requestPaused", { detail: e6 })
    }
}
var _t2 = class extends CustomEvent {
    constructor(e6) {
        super("Fetch.authRequired", { detail: e6 })
    }
}
var er = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.contextCreated", { detail: e6 })
    }
}
var tr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.contextWillBeDestroyed", { detail: e6 })
    }
}
var rr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.contextChanged", { detail: e6 })
    }
}
var ar = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioListenerCreated", { detail: e6 })
    }
}
var sr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioListenerWillBeDestroyed", { detail: e6 })
    }
}
var or = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioNodeCreated", { detail: e6 })
    }
}
var nr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioNodeWillBeDestroyed", { detail: e6 })
    }
}
var ir = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioParamCreated", { detail: e6 })
    }
}
var cr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.audioParamWillBeDestroyed", { detail: e6 })
    }
}
var ur = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.nodesConnected", { detail: e6 })
    }
}
var dr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.nodesDisconnected", { detail: e6 })
    }
}
var lr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.nodeParamConnected", { detail: e6 })
    }
}
var yr = class extends CustomEvent {
    constructor(e6) {
        super("WebAudio.nodeParamDisconnected", { detail: e6 })
    }
}
var hr = class extends CustomEvent {
    constructor(e6) {
        super("WebAuthn.credentialAdded", { detail: e6 })
    }
}
var pr = class extends CustomEvent {
    constructor(e6) {
        super("WebAuthn.credentialAsserted", { detail: e6 })
    }
}
var gr = class extends CustomEvent {
    constructor(e6) {
        super("Media.playerPropertiesChanged", { detail: e6 })
    }
}
var wr = class extends CustomEvent {
    constructor(e6) {
        super("Media.playerEventsAdded", { detail: e6 })
    }
}
var mr = class extends CustomEvent {
    constructor(e6) {
        super("Media.playerMessagesLogged", { detail: e6 })
    }
}
var kr = class extends CustomEvent {
    constructor(e6) {
        super("Media.playerErrorsRaised", { detail: e6 })
    }
}
var Cr = class extends CustomEvent {
    constructor(e6) {
        super("Media.playersCreated", { detail: e6 })
    }
}
var Sr = class extends CustomEvent {
    constructor(e6) {
        super("DeviceAccess.deviceRequestPrompted", { detail: e6 })
    }
}
var fr = class extends CustomEvent {
    constructor(e6) {
        super("Preload.ruleSetUpdated", { detail: e6 })
    }
}
var xr = class extends CustomEvent {
    constructor(e6) {
        super("Preload.ruleSetRemoved", { detail: e6 })
    }
}
var br = class extends CustomEvent {
    constructor(e6) {
        super("Preload.preloadEnabledStateUpdated", { detail: e6 })
    }
}
var Dr = class extends CustomEvent {
    constructor(e6) {
        super("Preload.prefetchStatusUpdated", { detail: e6 })
    }
}
var vr = class extends CustomEvent {
    constructor(e6) {
        super("Preload.prerenderStatusUpdated", { detail: e6 })
    }
}
var Or = class extends CustomEvent {
    constructor(e6) {
        super("Preload.preloadingAttemptSourcesUpdated", { detail: e6 })
    }
}
var Pr = class extends CustomEvent {
    constructor(e6) {
        super("FedCm.dialogShown", { detail: e6 })
    }
}
var Er = class extends CustomEvent {
    constructor(e6) {
        super("FedCm.dialogClosed", { detail: e6 })
    }
}
var Tr = class extends CustomEvent {
    constructor(e6) {
        super("Console.messageAdded", { detail: e6 })
    }
}
var Fr = class extends CustomEvent {
    constructor(e6) {
        super("Debugger.breakpointResolved", { detail: e6 })
    }
}
var Ar = class extends CustomEvent {
    constructor(e6) {
        super("Debugger.paused", { detail: e6 })
    }
}
var Nr = class extends CustomEvent {
    constructor(e6) {
        super("Debugger.scriptFailedToParse", { detail: e6 })
    }
}
var Mr = class extends CustomEvent {
    constructor(e6) {
        super("Debugger.scriptParsed", { detail: e6 })
    }
}
var Ir = class extends CustomEvent {
    constructor(e6) {
        super("HeapProfiler.addHeapSnapshotChunk", { detail: e6 })
    }
}
var Rr = class extends CustomEvent {
    constructor(e6) {
        super("HeapProfiler.heapStatsUpdate", { detail: e6 })
    }
}
var Br = class extends CustomEvent {
    constructor(e6) {
        super("HeapProfiler.lastSeenObjectId", { detail: e6 })
    }
}
var Kr = class extends CustomEvent {
    constructor(e6) {
        super("HeapProfiler.reportHeapSnapshotProgress", { detail: e6 })
    }
}
var Lr = class extends CustomEvent {
    constructor(e6) {
        super("Profiler.consoleProfileFinished", { detail: e6 })
    }
}
var Wr = class extends CustomEvent {
    constructor(e6) {
        super("Profiler.consoleProfileStarted", { detail: e6 })
    }
}
var Ur = class extends CustomEvent {
    constructor(e6) {
        super("Profiler.preciseCoverageDeltaUpdate", { detail: e6 })
    }
}
var Hr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.bindingCalled", { detail: e6 })
    }
}
var qr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.consoleAPICalled", { detail: e6 })
    }
}
var Vr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.exceptionRevoked", { detail: e6 })
    }
}
var jr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.exceptionThrown", { detail: e6 })
    }
}
var $r = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.executionContextCreated", { detail: e6 })
    }
}
var Gr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.executionContextDestroyed", { detail: e6 })
    }
}
var zr = class extends CustomEvent {
    constructor(e6) {
        super("Runtime.inspectRequested", { detail: e6 })
    }
}
var xa = { "Accessibility.loadComplete": N6, "Accessibility.nodesUpdated": M5, "Animation.animationCanceled": I7, "Animation.animationCreated": R6, "Animation.animationStarted": B5, "Audits.issueAdded": K3, "Autofill.addressFormFilled": L5, "BackgroundService.recordingStateChanged": W4, "BackgroundService.backgroundServiceEventReceived": U6, "Browser.downloadWillBegin": H5, "Browser.downloadProgress": q4, "CSS.fontsUpdated": V5, "CSS.mediaQueryResultChanged": Event, "CSS.styleSheetAdded": j6, "CSS.styleSheetChanged": $3, "CSS.styleSheetRemoved": G6, "Cast.sinksUpdated": z5, "Cast.issueUpdated": Q3, "DOM.attributeModified": X5, "DOM.attributeRemoved": J2, "DOM.characterDataModified": Y5, "DOM.childNodeCountUpdated": Z4, "DOM.childNodeInserted": _8, "DOM.childNodeRemoved": ee3, "DOM.distributedNodesUpdated": te4, "DOM.documentUpdated": Event, "DOM.inlineStyleInvalidated": re5, "DOM.pseudoElementAdded": ae4, "DOM.topLayerElementsUpdated": Event, "DOM.pseudoElementRemoved": se3, "DOM.setChildNodes": oe2, "DOM.shadowRootPopped": ne4, "DOM.shadowRootPushed": ie3, "DOMStorage.domStorageItemAdded": ce4, "DOMStorage.domStorageItemRemoved": ue2, "DOMStorage.domStorageItemUpdated": de4, "DOMStorage.domStorageItemsCleared": le3, "Database.addDatabase": ye5, "Emulation.virtualTimeBudgetExpired": Event, "Input.dragIntercepted": he3, "Inspector.detached": pe3, "Inspector.targetCrashed": Event, "Inspector.targetReloadedAfterCrash": Event, "LayerTree.layerPainted": ge3, "LayerTree.layerTreeDidChange": we4, "Log.entryAdded": me2, "Network.dataReceived": ke4, "Network.eventSourceMessageReceived": Ce5, "Network.loadingFailed": Se4, "Network.loadingFinished": fe4, "Network.requestIntercepted": xe3, "Network.requestServedFromCache": be4, "Network.requestWillBeSent": De3, "Network.resourceChangedPriority": ve, "Network.signedExchangeReceived": Oe3, "Network.responseReceived": Pe5, "Network.webSocketClosed": Ee3, "Network.webSocketCreated": Te3, "Network.webSocketFrameError": Fe2, "Network.webSocketFrameReceived": Ae3, "Network.webSocketFrameSent": Ne4, "Network.webSocketHandshakeResponseReceived": Me4, "Network.webSocketWillSendHandshakeRequest": Ie5, "Network.webTransportCreated": Re4, "Network.webTransportConnectionEstablished": Be3, "Network.webTransportClosed": Ke2, "Network.requestWillBeSentExtraInfo": Le3, "Network.responseReceivedExtraInfo": We2, "Network.responseReceivedEarlyHints": Ue5, "Network.trustTokenOperationDone": He2, "Network.subresourceWebBundleMetadataReceived": qe2, "Network.subresourceWebBundleMetadataError": Ve, "Network.subresourceWebBundleInnerResponseParsed": je2, "Network.subresourceWebBundleInnerResponseError": $e2, "Network.reportingApiReportAdded": Ge2, "Network.reportingApiReportUpdated": ze3, "Network.reportingApiEndpointsChangedForOrigin": Qe2, "Overlay.inspectNodeRequested": Xe2, "Overlay.nodeHighlightRequested": Je2, "Overlay.screenshotRequested": Ye3, "Overlay.inspectModeCanceled": Event, "Page.domContentEventFired": Ze3, "Page.fileChooserOpened": _e3, "Page.frameAttached": et3, "Page.frameClearedScheduledNavigation": tt3, "Page.frameDetached": rt3, "Page.frameNavigated": at3, "Page.documentOpened": st4, "Page.frameResized": Event, "Page.frameRequestedNavigation": ot2, "Page.frameScheduledNavigation": nt4, "Page.frameStartedLoading": it3, "Page.frameStoppedLoading": ct3, "Page.downloadWillBegin": ut3, "Page.downloadProgress": dt3, "Page.interstitialHidden": Event, "Page.interstitialShown": Event, "Page.javascriptDialogClosed": lt3, "Page.javascriptDialogOpening": yt3, "Page.lifecycleEvent": ht2, "Page.backForwardCacheNotUsed": pt3, "Page.loadEventFired": gt2, "Page.navigatedWithinDocument": wt2, "Page.screencastFrame": mt3, "Page.screencastVisibilityChanged": kt4, "Page.windowOpen": Ct3, "Page.compilationCacheProduced": St, "Performance.metrics": ft3, "PerformanceTimeline.timelineEventAdded": xt3, "Security.certificateError": bt3, "Security.visibleSecurityStateChanged": Dt2, "Security.securityStateChanged": vt4, "ServiceWorker.workerErrorReported": Ot2, "ServiceWorker.workerRegistrationUpdated": Pt3, "ServiceWorker.workerVersionUpdated": Et2, "Storage.cacheStorageContentUpdated": Tt3, "Storage.cacheStorageListUpdated": Ft, "Storage.indexedDBContentUpdated": At2, "Storage.indexedDBListUpdated": Nt, "Storage.interestGroupAccessed": Mt3, "Storage.interestGroupAuctionEventOccurred": It, "Storage.interestGroupAuctionNetworkRequestCreated": Rt3, "Storage.sharedStorageAccessed": Bt3, "Storage.storageBucketCreatedOrUpdated": Kt2, "Storage.storageBucketDeleted": Lt, "Storage.attributionReportingSourceRegistered": Wt2, "Storage.attributionReportingTriggerRegistered": Ut3, "Target.attachedToTarget": Ht2, "Target.detachedFromTarget": qt2, "Target.receivedMessageFromTarget": Vt3, "Target.targetCreated": jt2, "Target.targetDestroyed": $t2, "Target.targetCrashed": Gt3, "Target.targetInfoChanged": zt4, "Tethering.accepted": Qt2, "Tracing.bufferUsage": Xt3, "Tracing.dataCollected": Jt3, "Tracing.tracingComplete": Yt4, "Fetch.requestPaused": Zt3, "Fetch.authRequired": _t2, "WebAudio.contextCreated": er, "WebAudio.contextWillBeDestroyed": tr, "WebAudio.contextChanged": rr, "WebAudio.audioListenerCreated": ar, "WebAudio.audioListenerWillBeDestroyed": sr, "WebAudio.audioNodeCreated": or, "WebAudio.audioNodeWillBeDestroyed": nr, "WebAudio.audioParamCreated": ir, "WebAudio.audioParamWillBeDestroyed": cr, "WebAudio.nodesConnected": ur, "WebAudio.nodesDisconnected": dr, "WebAudio.nodeParamConnected": lr, "WebAudio.nodeParamDisconnected": yr, "WebAuthn.credentialAdded": hr, "WebAuthn.credentialAsserted": pr, "Media.playerPropertiesChanged": gr, "Media.playerEventsAdded": wr, "Media.playerMessagesLogged": mr, "Media.playerErrorsRaised": kr, "Media.playersCreated": Cr, "DeviceAccess.deviceRequestPrompted": Sr, "Preload.ruleSetUpdated": fr, "Preload.ruleSetRemoved": xr, "Preload.preloadEnabledStateUpdated": br, "Preload.prefetchStatusUpdated": Dr, "Preload.prerenderStatusUpdated": vr, "Preload.preloadingAttemptSourcesUpdated": Or, "FedCm.dialogShown": Pr, "FedCm.dialogClosed": Er, "Console.messageAdded": Tr, "Debugger.breakpointResolved": Fr, "Debugger.paused": Ar, "Debugger.resumed": Event, "Debugger.scriptFailedToParse": Nr, "Debugger.scriptParsed": Mr, "HeapProfiler.addHeapSnapshotChunk": Ir, "HeapProfiler.heapStatsUpdate": Rr, "HeapProfiler.lastSeenObjectId": Br, "HeapProfiler.reportHeapSnapshotProgress": Kr, "HeapProfiler.resetProfiles": Event, "Profiler.consoleProfileFinished": Lr, "Profiler.consoleProfileStarted": Wr, "Profiler.preciseCoverageDeltaUpdate": Ur, "Runtime.bindingCalled": Hr, "Runtime.consoleAPICalled": qr, "Runtime.exceptionRevoked": Vr, "Runtime.exceptionThrown": jr, "Runtime.executionContextCreated": $r, "Runtime.executionContextDestroyed": Gr, "Runtime.executionContextsCleared": Event, "Runtime.inspectRequested": zr }
var w5 = class extends EventTarget {
    ws
    #r
    #t = 0
    #a = /* @__PURE__ */ new Map()
    constructor(e6) {
        super(),
            (this.ws = e6),
            k7 && ca(e6),
            (this.ws.onmessage = (o8) => {
                let n8 = JSON.parse(o8.data),
                    i8 = this.#a.get(n8.id)
                if (i8) i8(n8.result), this.#a.delete(n8.id)
                else {
                    let d5 = xa[n8.method]
                    if (d5 === void 0) {
                        k7 && console.error("[CELESTIAL] Unknown event", n8)
                        return
                    }
                    n8.params ? this.dispatchEvent(new d5(n8.params)) : this.dispatchEvent(new d5())
                }
            })
        let { promise: r8, resolve: a4 } = Promise.withResolvers()
        this.#r = r8
        let s9 = () => {
            if (this.ws.readyState === WebSocket.CLOSED) {
                a4(true)
                return
            }
            setTimeout(s9, 100)
        }
        this.ws.onclose = s9
    }
    async close() {
        this.ws.close(), await this.#r
    }
    addEventListener(e6, r8, a4) {
        super.addEventListener(e6, r8, a4)
    }
    #e(e6, r8) {
        return (
            this.ws.send(JSON.stringify({ id: ++this.#t, method: e6, params: r8 })),
            new Promise((a4) => {
                this.#a.set(this.#t, a4)
            })
        )
    }
    Accessibility = { disable: async () => await this.#e("Accessibility.disable"), enable: async () => await this.#e("Accessibility.enable"), getPartialAXTree: async (e6) => await this.#e("Accessibility.getPartialAXTree", e6), getFullAXTree: async (e6) => await this.#e("Accessibility.getFullAXTree", e6), getRootAXNode: async (e6) => await this.#e("Accessibility.getRootAXNode", e6), getAXNodeAndAncestors: async (e6) => await this.#e("Accessibility.getAXNodeAndAncestors", e6), getChildAXNodes: async (e6) => await this.#e("Accessibility.getChildAXNodes", e6), queryAXTree: async (e6) => await this.#e("Accessibility.queryAXTree", e6) }
    Animation = { disable: async () => await this.#e("Animation.disable"), enable: async () => await this.#e("Animation.enable"), getCurrentTime: async (e6) => await this.#e("Animation.getCurrentTime", e6), getPlaybackRate: async () => await this.#e("Animation.getPlaybackRate"), releaseAnimations: async (e6) => await this.#e("Animation.releaseAnimations", e6), resolveAnimation: async (e6) => await this.#e("Animation.resolveAnimation", e6), seekAnimations: async (e6) => await this.#e("Animation.seekAnimations", e6), setPaused: async (e6) => await this.#e("Animation.setPaused", e6), setPlaybackRate: async (e6) => await this.#e("Animation.setPlaybackRate", e6), setTiming: async (e6) => await this.#e("Animation.setTiming", e6) }
    Audits = { getEncodedResponse: async (e6) => await this.#e("Audits.getEncodedResponse", e6), disable: async () => await this.#e("Audits.disable"), enable: async () => await this.#e("Audits.enable"), checkContrast: async (e6) => await this.#e("Audits.checkContrast", e6), checkFormsIssues: async () => await this.#e("Audits.checkFormsIssues") }
    Autofill = { trigger: async (e6) => await this.#e("Autofill.trigger", e6), setAddresses: async (e6) => await this.#e("Autofill.setAddresses", e6), disable: async () => await this.#e("Autofill.disable"), enable: async () => await this.#e("Autofill.enable") }
    BackgroundService = { startObserving: async (e6) => await this.#e("BackgroundService.startObserving", e6), stopObserving: async (e6) => await this.#e("BackgroundService.stopObserving", e6), setRecording: async (e6) => await this.#e("BackgroundService.setRecording", e6), clearEvents: async (e6) => await this.#e("BackgroundService.clearEvents", e6) }
    Browser = { setPermission: async (e6) => await this.#e("Browser.setPermission", e6), grantPermissions: async (e6) => await this.#e("Browser.grantPermissions", e6), resetPermissions: async (e6) => await this.#e("Browser.resetPermissions", e6), setDownloadBehavior: async (e6) => await this.#e("Browser.setDownloadBehavior", e6), cancelDownload: async (e6) => await this.#e("Browser.cancelDownload", e6), close: async () => await this.#e("Browser.close"), crash: async () => await this.#e("Browser.crash"), crashGpuProcess: async () => await this.#e("Browser.crashGpuProcess"), getVersion: async () => await this.#e("Browser.getVersion"), getBrowserCommandLine: async () => await this.#e("Browser.getBrowserCommandLine"), getHistograms: async (e6) => await this.#e("Browser.getHistograms", e6), getHistogram: async (e6) => await this.#e("Browser.getHistogram", e6), getWindowBounds: async (e6) => await this.#e("Browser.getWindowBounds", e6), getWindowForTarget: async (e6) => await this.#e("Browser.getWindowForTarget", e6), setWindowBounds: async (e6) => await this.#e("Browser.setWindowBounds", e6), setDockTile: async (e6) => await this.#e("Browser.setDockTile", e6), executeBrowserCommand: async (e6) => await this.#e("Browser.executeBrowserCommand", e6), addPrivacySandboxEnrollmentOverride: async (e6) => await this.#e("Browser.addPrivacySandboxEnrollmentOverride", e6) }
    CSS = { addRule: async (e6) => await this.#e("CSS.addRule", e6), collectClassNames: async (e6) => await this.#e("CSS.collectClassNames", e6), createStyleSheet: async (e6) => await this.#e("CSS.createStyleSheet", e6), disable: async () => await this.#e("CSS.disable"), enable: async () => await this.#e("CSS.enable"), forcePseudoState: async (e6) => await this.#e("CSS.forcePseudoState", e6), getBackgroundColors: async (e6) => await this.#e("CSS.getBackgroundColors", e6), getComputedStyleForNode: async (e6) => await this.#e("CSS.getComputedStyleForNode", e6), getInlineStylesForNode: async (e6) => await this.#e("CSS.getInlineStylesForNode", e6), getMatchedStylesForNode: async (e6) => await this.#e("CSS.getMatchedStylesForNode", e6), getMediaQueries: async () => await this.#e("CSS.getMediaQueries"), getPlatformFontsForNode: async (e6) => await this.#e("CSS.getPlatformFontsForNode", e6), getStyleSheetText: async (e6) => await this.#e("CSS.getStyleSheetText", e6), getLayersForNode: async (e6) => await this.#e("CSS.getLayersForNode", e6), getLocationForSelector: async (e6) => await this.#e("CSS.getLocationForSelector", e6), trackComputedStyleUpdates: async (e6) => await this.#e("CSS.trackComputedStyleUpdates", e6), takeComputedStyleUpdates: async () => await this.#e("CSS.takeComputedStyleUpdates"), setEffectivePropertyValueForNode: async (e6) => await this.#e("CSS.setEffectivePropertyValueForNode", e6), setPropertyRulePropertyName: async (e6) => await this.#e("CSS.setPropertyRulePropertyName", e6), setKeyframeKey: async (e6) => await this.#e("CSS.setKeyframeKey", e6), setMediaText: async (e6) => await this.#e("CSS.setMediaText", e6), setContainerQueryText: async (e6) => await this.#e("CSS.setContainerQueryText", e6), setSupportsText: async (e6) => await this.#e("CSS.setSupportsText", e6), setScopeText: async (e6) => await this.#e("CSS.setScopeText", e6), setRuleSelector: async (e6) => await this.#e("CSS.setRuleSelector", e6), setStyleSheetText: async (e6) => await this.#e("CSS.setStyleSheetText", e6), setStyleTexts: async (e6) => await this.#e("CSS.setStyleTexts", e6), startRuleUsageTracking: async () => await this.#e("CSS.startRuleUsageTracking"), stopRuleUsageTracking: async () => await this.#e("CSS.stopRuleUsageTracking"), takeCoverageDelta: async () => await this.#e("CSS.takeCoverageDelta"), setLocalFontsEnabled: async (e6) => await this.#e("CSS.setLocalFontsEnabled", e6) }
    CacheStorage = { deleteCache: async (e6) => await this.#e("CacheStorage.deleteCache", e6), deleteEntry: async (e6) => await this.#e("CacheStorage.deleteEntry", e6), requestCacheNames: async (e6) => await this.#e("CacheStorage.requestCacheNames", e6), requestCachedResponse: async (e6) => await this.#e("CacheStorage.requestCachedResponse", e6), requestEntries: async (e6) => await this.#e("CacheStorage.requestEntries", e6) }
    Cast = { enable: async (e6) => await this.#e("Cast.enable", e6), disable: async () => await this.#e("Cast.disable"), setSinkToUse: async (e6) => await this.#e("Cast.setSinkToUse", e6), startDesktopMirroring: async (e6) => await this.#e("Cast.startDesktopMirroring", e6), startTabMirroring: async (e6) => await this.#e("Cast.startTabMirroring", e6), stopCasting: async (e6) => await this.#e("Cast.stopCasting", e6) }
    DOM = { collectClassNamesFromSubtree: async (e6) => await this.#e("DOM.collectClassNamesFromSubtree", e6), copyTo: async (e6) => await this.#e("DOM.copyTo", e6), describeNode: async (e6) => await this.#e("DOM.describeNode", e6), scrollIntoViewIfNeeded: async (e6) => await this.#e("DOM.scrollIntoViewIfNeeded", e6), disable: async () => await this.#e("DOM.disable"), discardSearchResults: async (e6) => await this.#e("DOM.discardSearchResults", e6), enable: async (e6) => await this.#e("DOM.enable", e6), focus: async (e6) => await this.#e("DOM.focus", e6), getAttributes: async (e6) => await this.#e("DOM.getAttributes", e6), getBoxModel: async (e6) => await this.#e("DOM.getBoxModel", e6), getContentQuads: async (e6) => await this.#e("DOM.getContentQuads", e6), getDocument: async (e6) => await this.#e("DOM.getDocument", e6), getFlattenedDocument: async (e6) => await this.#e("DOM.getFlattenedDocument", e6), getNodesForSubtreeByStyle: async (e6) => await this.#e("DOM.getNodesForSubtreeByStyle", e6), getNodeForLocation: async (e6) => await this.#e("DOM.getNodeForLocation", e6), getOuterHTML: async (e6) => await this.#e("DOM.getOuterHTML", e6), getRelayoutBoundary: async (e6) => await this.#e("DOM.getRelayoutBoundary", e6), getSearchResults: async (e6) => await this.#e("DOM.getSearchResults", e6), hideHighlight: async () => await this.#e("DOM.hideHighlight"), highlightNode: async () => await this.#e("DOM.highlightNode"), highlightRect: async () => await this.#e("DOM.highlightRect"), markUndoableState: async () => await this.#e("DOM.markUndoableState"), moveTo: async (e6) => await this.#e("DOM.moveTo", e6), performSearch: async (e6) => await this.#e("DOM.performSearch", e6), pushNodeByPathToFrontend: async (e6) => await this.#e("DOM.pushNodeByPathToFrontend", e6), pushNodesByBackendIdsToFrontend: async (e6) => await this.#e("DOM.pushNodesByBackendIdsToFrontend", e6), querySelector: async (e6) => await this.#e("DOM.querySelector", e6), querySelectorAll: async (e6) => await this.#e("DOM.querySelectorAll", e6), getTopLayerElements: async () => await this.#e("DOM.getTopLayerElements"), redo: async () => await this.#e("DOM.redo"), removeAttribute: async (e6) => await this.#e("DOM.removeAttribute", e6), removeNode: async (e6) => await this.#e("DOM.removeNode", e6), requestChildNodes: async (e6) => await this.#e("DOM.requestChildNodes", e6), requestNode: async (e6) => await this.#e("DOM.requestNode", e6), resolveNode: async (e6) => await this.#e("DOM.resolveNode", e6), setAttributeValue: async (e6) => await this.#e("DOM.setAttributeValue", e6), setAttributesAsText: async (e6) => await this.#e("DOM.setAttributesAsText", e6), setFileInputFiles: async (e6) => await this.#e("DOM.setFileInputFiles", e6), setNodeStackTracesEnabled: async (e6) => await this.#e("DOM.setNodeStackTracesEnabled", e6), getNodeStackTraces: async (e6) => await this.#e("DOM.getNodeStackTraces", e6), getFileInfo: async (e6) => await this.#e("DOM.getFileInfo", e6), setInspectedNode: async (e6) => await this.#e("DOM.setInspectedNode", e6), setNodeName: async (e6) => await this.#e("DOM.setNodeName", e6), setNodeValue: async (e6) => await this.#e("DOM.setNodeValue", e6), setOuterHTML: async (e6) => await this.#e("DOM.setOuterHTML", e6), undo: async () => await this.#e("DOM.undo"), getFrameOwner: async (e6) => await this.#e("DOM.getFrameOwner", e6), getContainerForNode: async (e6) => await this.#e("DOM.getContainerForNode", e6), getQueryingDescendantsForContainer: async (e6) => await this.#e("DOM.getQueryingDescendantsForContainer", e6) }
    DOMDebugger = { getEventListeners: async (e6) => await this.#e("DOMDebugger.getEventListeners", e6), removeDOMBreakpoint: async (e6) => await this.#e("DOMDebugger.removeDOMBreakpoint", e6), removeEventListenerBreakpoint: async (e6) => await this.#e("DOMDebugger.removeEventListenerBreakpoint", e6), removeInstrumentationBreakpoint: async (e6) => await this.#e("DOMDebugger.removeInstrumentationBreakpoint", e6), removeXHRBreakpoint: async (e6) => await this.#e("DOMDebugger.removeXHRBreakpoint", e6), setBreakOnCSPViolation: async (e6) => await this.#e("DOMDebugger.setBreakOnCSPViolation", e6), setDOMBreakpoint: async (e6) => await this.#e("DOMDebugger.setDOMBreakpoint", e6), setEventListenerBreakpoint: async (e6) => await this.#e("DOMDebugger.setEventListenerBreakpoint", e6), setInstrumentationBreakpoint: async (e6) => await this.#e("DOMDebugger.setInstrumentationBreakpoint", e6), setXHRBreakpoint: async (e6) => await this.#e("DOMDebugger.setXHRBreakpoint", e6) }
    EventBreakpoints = { setInstrumentationBreakpoint: async (e6) => await this.#e("EventBreakpoints.setInstrumentationBreakpoint", e6), removeInstrumentationBreakpoint: async (e6) => await this.#e("EventBreakpoints.removeInstrumentationBreakpoint", e6), disable: async () => await this.#e("EventBreakpoints.disable") }
    DOMSnapshot = { disable: async () => await this.#e("DOMSnapshot.disable"), enable: async () => await this.#e("DOMSnapshot.enable"), getSnapshot: async (e6) => await this.#e("DOMSnapshot.getSnapshot", e6), captureSnapshot: async (e6) => await this.#e("DOMSnapshot.captureSnapshot", e6) }
    DOMStorage = { clear: async (e6) => await this.#e("DOMStorage.clear", e6), disable: async () => await this.#e("DOMStorage.disable"), enable: async () => await this.#e("DOMStorage.enable"), getDOMStorageItems: async (e6) => await this.#e("DOMStorage.getDOMStorageItems", e6), removeDOMStorageItem: async (e6) => await this.#e("DOMStorage.removeDOMStorageItem", e6), setDOMStorageItem: async (e6) => await this.#e("DOMStorage.setDOMStorageItem", e6) }
    Database = { disable: async () => await this.#e("Database.disable"), enable: async () => await this.#e("Database.enable"), executeSQL: async (e6) => await this.#e("Database.executeSQL", e6), getDatabaseTableNames: async (e6) => await this.#e("Database.getDatabaseTableNames", e6) }
    DeviceOrientation = { clearDeviceOrientationOverride: async () => await this.#e("DeviceOrientation.clearDeviceOrientationOverride"), setDeviceOrientationOverride: async (e6) => await this.#e("DeviceOrientation.setDeviceOrientationOverride", e6) }
    Emulation = { canEmulate: async () => await this.#e("Emulation.canEmulate"), clearDeviceMetricsOverride: async () => await this.#e("Emulation.clearDeviceMetricsOverride"), clearGeolocationOverride: async () => await this.#e("Emulation.clearGeolocationOverride"), resetPageScaleFactor: async () => await this.#e("Emulation.resetPageScaleFactor"), setFocusEmulationEnabled: async (e6) => await this.#e("Emulation.setFocusEmulationEnabled", e6), setAutoDarkModeOverride: async (e6) => await this.#e("Emulation.setAutoDarkModeOverride", e6), setCPUThrottlingRate: async (e6) => await this.#e("Emulation.setCPUThrottlingRate", e6), setDefaultBackgroundColorOverride: async (e6) => await this.#e("Emulation.setDefaultBackgroundColorOverride", e6), setDeviceMetricsOverride: async (e6) => await this.#e("Emulation.setDeviceMetricsOverride", e6), setDevicePostureOverride: async (e6) => await this.#e("Emulation.setDevicePostureOverride", e6), clearDevicePostureOverride: async () => await this.#e("Emulation.clearDevicePostureOverride"), setScrollbarsHidden: async (e6) => await this.#e("Emulation.setScrollbarsHidden", e6), setDocumentCookieDisabled: async (e6) => await this.#e("Emulation.setDocumentCookieDisabled", e6), setEmitTouchEventsForMouse: async (e6) => await this.#e("Emulation.setEmitTouchEventsForMouse", e6), setEmulatedMedia: async (e6) => await this.#e("Emulation.setEmulatedMedia", e6), setEmulatedVisionDeficiency: async (e6) => await this.#e("Emulation.setEmulatedVisionDeficiency", e6), setGeolocationOverride: async (e6) => await this.#e("Emulation.setGeolocationOverride", e6), getOverriddenSensorInformation: async (e6) => await this.#e("Emulation.getOverriddenSensorInformation", e6), setSensorOverrideEnabled: async (e6) => await this.#e("Emulation.setSensorOverrideEnabled", e6), setSensorOverrideReadings: async (e6) => await this.#e("Emulation.setSensorOverrideReadings", e6), setIdleOverride: async (e6) => await this.#e("Emulation.setIdleOverride", e6), clearIdleOverride: async () => await this.#e("Emulation.clearIdleOverride"), setNavigatorOverrides: async (e6) => await this.#e("Emulation.setNavigatorOverrides", e6), setPageScaleFactor: async (e6) => await this.#e("Emulation.setPageScaleFactor", e6), setScriptExecutionDisabled: async (e6) => await this.#e("Emulation.setScriptExecutionDisabled", e6), setTouchEmulationEnabled: async (e6) => await this.#e("Emulation.setTouchEmulationEnabled", e6), setVirtualTimePolicy: async (e6) => await this.#e("Emulation.setVirtualTimePolicy", e6), setLocaleOverride: async (e6) => await this.#e("Emulation.setLocaleOverride", e6), setTimezoneOverride: async (e6) => await this.#e("Emulation.setTimezoneOverride", e6), setVisibleSize: async (e6) => await this.#e("Emulation.setVisibleSize", e6), setDisabledImageTypes: async (e6) => await this.#e("Emulation.setDisabledImageTypes", e6), setHardwareConcurrencyOverride: async (e6) => await this.#e("Emulation.setHardwareConcurrencyOverride", e6), setUserAgentOverride: async (e6) => await this.#e("Emulation.setUserAgentOverride", e6), setAutomationOverride: async (e6) => await this.#e("Emulation.setAutomationOverride", e6) }
    HeadlessExperimental = { beginFrame: async (e6) => await this.#e("HeadlessExperimental.beginFrame", e6), disable: async () => await this.#e("HeadlessExperimental.disable"), enable: async () => await this.#e("HeadlessExperimental.enable") }
    IO = { close: async (e6) => await this.#e("IO.close", e6), read: async (e6) => await this.#e("IO.read", e6), resolveBlob: async (e6) => await this.#e("IO.resolveBlob", e6) }
    IndexedDB = { clearObjectStore: async (e6) => await this.#e("IndexedDB.clearObjectStore", e6), deleteDatabase: async (e6) => await this.#e("IndexedDB.deleteDatabase", e6), deleteObjectStoreEntries: async (e6) => await this.#e("IndexedDB.deleteObjectStoreEntries", e6), disable: async () => await this.#e("IndexedDB.disable"), enable: async () => await this.#e("IndexedDB.enable"), requestData: async (e6) => await this.#e("IndexedDB.requestData", e6), getMetadata: async (e6) => await this.#e("IndexedDB.getMetadata", e6), requestDatabase: async (e6) => await this.#e("IndexedDB.requestDatabase", e6), requestDatabaseNames: async (e6) => await this.#e("IndexedDB.requestDatabaseNames", e6) }
    Input = { dispatchDragEvent: async (e6) => await this.#e("Input.dispatchDragEvent", e6), dispatchKeyEvent: async (e6) => await this.#e("Input.dispatchKeyEvent", e6), insertText: async (e6) => await this.#e("Input.insertText", e6), imeSetComposition: async (e6) => await this.#e("Input.imeSetComposition", e6), dispatchMouseEvent: async (e6) => await this.#e("Input.dispatchMouseEvent", e6), dispatchTouchEvent: async (e6) => await this.#e("Input.dispatchTouchEvent", e6), cancelDragging: async () => await this.#e("Input.cancelDragging"), emulateTouchFromMouseEvent: async (e6) => await this.#e("Input.emulateTouchFromMouseEvent", e6), setIgnoreInputEvents: async (e6) => await this.#e("Input.setIgnoreInputEvents", e6), setInterceptDrags: async (e6) => await this.#e("Input.setInterceptDrags", e6), synthesizePinchGesture: async (e6) => await this.#e("Input.synthesizePinchGesture", e6), synthesizeScrollGesture: async (e6) => await this.#e("Input.synthesizeScrollGesture", e6), synthesizeTapGesture: async (e6) => await this.#e("Input.synthesizeTapGesture", e6) }
    Inspector = { disable: async () => await this.#e("Inspector.disable"), enable: async () => await this.#e("Inspector.enable") }
    LayerTree = { compositingReasons: async (e6) => await this.#e("LayerTree.compositingReasons", e6), disable: async () => await this.#e("LayerTree.disable"), enable: async () => await this.#e("LayerTree.enable"), loadSnapshot: async (e6) => await this.#e("LayerTree.loadSnapshot", e6), makeSnapshot: async (e6) => await this.#e("LayerTree.makeSnapshot", e6), profileSnapshot: async (e6) => await this.#e("LayerTree.profileSnapshot", e6), releaseSnapshot: async (e6) => await this.#e("LayerTree.releaseSnapshot", e6), replaySnapshot: async (e6) => await this.#e("LayerTree.replaySnapshot", e6), snapshotCommandLog: async (e6) => await this.#e("LayerTree.snapshotCommandLog", e6) }
    Log = { clear: async () => await this.#e("Log.clear"), disable: async () => await this.#e("Log.disable"), enable: async () => await this.#e("Log.enable"), startViolationsReport: async (e6) => await this.#e("Log.startViolationsReport", e6), stopViolationsReport: async () => await this.#e("Log.stopViolationsReport") }
    Memory = { getDOMCounters: async () => await this.#e("Memory.getDOMCounters"), prepareForLeakDetection: async () => await this.#e("Memory.prepareForLeakDetection"), forciblyPurgeJavaScriptMemory: async () => await this.#e("Memory.forciblyPurgeJavaScriptMemory"), setPressureNotificationsSuppressed: async (e6) => await this.#e("Memory.setPressureNotificationsSuppressed", e6), simulatePressureNotification: async (e6) => await this.#e("Memory.simulatePressureNotification", e6), startSampling: async (e6) => await this.#e("Memory.startSampling", e6), stopSampling: async () => await this.#e("Memory.stopSampling"), getAllTimeSamplingProfile: async () => await this.#e("Memory.getAllTimeSamplingProfile"), getBrowserSamplingProfile: async () => await this.#e("Memory.getBrowserSamplingProfile"), getSamplingProfile: async () => await this.#e("Memory.getSamplingProfile") }
    Network = { setAcceptedEncodings: async (e6) => await this.#e("Network.setAcceptedEncodings", e6), clearAcceptedEncodingsOverride: async () => await this.#e("Network.clearAcceptedEncodingsOverride"), canClearBrowserCache: async () => await this.#e("Network.canClearBrowserCache"), canClearBrowserCookies: async () => await this.#e("Network.canClearBrowserCookies"), canEmulateNetworkConditions: async () => await this.#e("Network.canEmulateNetworkConditions"), clearBrowserCache: async () => await this.#e("Network.clearBrowserCache"), clearBrowserCookies: async () => await this.#e("Network.clearBrowserCookies"), continueInterceptedRequest: async (e6) => await this.#e("Network.continueInterceptedRequest", e6), deleteCookies: async (e6) => await this.#e("Network.deleteCookies", e6), disable: async () => await this.#e("Network.disable"), emulateNetworkConditions: async (e6) => await this.#e("Network.emulateNetworkConditions", e6), enable: async (e6) => await this.#e("Network.enable", e6), getAllCookies: async () => await this.#e("Network.getAllCookies"), getCertificate: async (e6) => await this.#e("Network.getCertificate", e6), getCookies: async (e6) => await this.#e("Network.getCookies", e6), getResponseBody: async (e6) => await this.#e("Network.getResponseBody", e6), getRequestPostData: async (e6) => await this.#e("Network.getRequestPostData", e6), getResponseBodyForInterception: async (e6) => await this.#e("Network.getResponseBodyForInterception", e6), takeResponseBodyForInterceptionAsStream: async (e6) => await this.#e("Network.takeResponseBodyForInterceptionAsStream", e6), replayXHR: async (e6) => await this.#e("Network.replayXHR", e6), searchInResponseBody: async (e6) => await this.#e("Network.searchInResponseBody", e6), setBlockedURLs: async (e6) => await this.#e("Network.setBlockedURLs", e6), setBypassServiceWorker: async (e6) => await this.#e("Network.setBypassServiceWorker", e6), setCacheDisabled: async (e6) => await this.#e("Network.setCacheDisabled", e6), setCookie: async (e6) => await this.#e("Network.setCookie", e6), setCookies: async (e6) => await this.#e("Network.setCookies", e6), setExtraHTTPHeaders: async (e6) => await this.#e("Network.setExtraHTTPHeaders", e6), setAttachDebugStack: async (e6) => await this.#e("Network.setAttachDebugStack", e6), setRequestInterception: async (e6) => await this.#e("Network.setRequestInterception", e6), setUserAgentOverride: async (e6) => await this.#e("Network.setUserAgentOverride", e6), streamResourceContent: async (e6) => await this.#e("Network.streamResourceContent", e6), getSecurityIsolationStatus: async (e6) => await this.#e("Network.getSecurityIsolationStatus", e6), enableReportingApi: async (e6) => await this.#e("Network.enableReportingApi", e6), loadNetworkResource: async (e6) => await this.#e("Network.loadNetworkResource", e6) }
    Overlay = { disable: async () => await this.#e("Overlay.disable"), enable: async () => await this.#e("Overlay.enable"), getHighlightObjectForTest: async (e6) => await this.#e("Overlay.getHighlightObjectForTest", e6), getGridHighlightObjectsForTest: async (e6) => await this.#e("Overlay.getGridHighlightObjectsForTest", e6), getSourceOrderHighlightObjectForTest: async (e6) => await this.#e("Overlay.getSourceOrderHighlightObjectForTest", e6), hideHighlight: async () => await this.#e("Overlay.hideHighlight"), highlightFrame: async (e6) => await this.#e("Overlay.highlightFrame", e6), highlightNode: async (e6) => await this.#e("Overlay.highlightNode", e6), highlightQuad: async (e6) => await this.#e("Overlay.highlightQuad", e6), highlightRect: async (e6) => await this.#e("Overlay.highlightRect", e6), highlightSourceOrder: async (e6) => await this.#e("Overlay.highlightSourceOrder", e6), setInspectMode: async (e6) => await this.#e("Overlay.setInspectMode", e6), setShowAdHighlights: async (e6) => await this.#e("Overlay.setShowAdHighlights", e6), setPausedInDebuggerMessage: async (e6) => await this.#e("Overlay.setPausedInDebuggerMessage", e6), setShowDebugBorders: async (e6) => await this.#e("Overlay.setShowDebugBorders", e6), setShowFPSCounter: async (e6) => await this.#e("Overlay.setShowFPSCounter", e6), setShowGridOverlays: async (e6) => await this.#e("Overlay.setShowGridOverlays", e6), setShowFlexOverlays: async (e6) => await this.#e("Overlay.setShowFlexOverlays", e6), setShowScrollSnapOverlays: async (e6) => await this.#e("Overlay.setShowScrollSnapOverlays", e6), setShowContainerQueryOverlays: async (e6) => await this.#e("Overlay.setShowContainerQueryOverlays", e6), setShowPaintRects: async (e6) => await this.#e("Overlay.setShowPaintRects", e6), setShowLayoutShiftRegions: async (e6) => await this.#e("Overlay.setShowLayoutShiftRegions", e6), setShowScrollBottleneckRects: async (e6) => await this.#e("Overlay.setShowScrollBottleneckRects", e6), setShowHitTestBorders: async (e6) => await this.#e("Overlay.setShowHitTestBorders", e6), setShowWebVitals: async (e6) => await this.#e("Overlay.setShowWebVitals", e6), setShowViewportSizeOnResize: async (e6) => await this.#e("Overlay.setShowViewportSizeOnResize", e6), setShowHinge: async (e6) => await this.#e("Overlay.setShowHinge", e6), setShowIsolatedElements: async (e6) => await this.#e("Overlay.setShowIsolatedElements", e6), setShowWindowControlsOverlay: async (e6) => await this.#e("Overlay.setShowWindowControlsOverlay", e6) }
    Page = { addScriptToEvaluateOnLoad: async (e6) => await this.#e("Page.addScriptToEvaluateOnLoad", e6), addScriptToEvaluateOnNewDocument: async (e6) => await this.#e("Page.addScriptToEvaluateOnNewDocument", e6), bringToFront: async () => await this.#e("Page.bringToFront"), captureScreenshot: async (e6) => await this.#e("Page.captureScreenshot", e6), captureSnapshot: async (e6) => await this.#e("Page.captureSnapshot", e6), clearDeviceMetricsOverride: async () => await this.#e("Page.clearDeviceMetricsOverride"), clearDeviceOrientationOverride: async () => await this.#e("Page.clearDeviceOrientationOverride"), clearGeolocationOverride: async () => await this.#e("Page.clearGeolocationOverride"), createIsolatedWorld: async (e6) => await this.#e("Page.createIsolatedWorld", e6), deleteCookie: async (e6) => await this.#e("Page.deleteCookie", e6), disable: async () => await this.#e("Page.disable"), enable: async () => await this.#e("Page.enable"), getAppManifest: async () => await this.#e("Page.getAppManifest"), getInstallabilityErrors: async () => await this.#e("Page.getInstallabilityErrors"), getManifestIcons: async () => await this.#e("Page.getManifestIcons"), getAppId: async () => await this.#e("Page.getAppId"), getAdScriptId: async (e6) => await this.#e("Page.getAdScriptId", e6), getFrameTree: async () => await this.#e("Page.getFrameTree"), getLayoutMetrics: async () => await this.#e("Page.getLayoutMetrics"), getNavigationHistory: async () => await this.#e("Page.getNavigationHistory"), resetNavigationHistory: async () => await this.#e("Page.resetNavigationHistory"), getResourceContent: async (e6) => await this.#e("Page.getResourceContent", e6), getResourceTree: async () => await this.#e("Page.getResourceTree"), handleJavaScriptDialog: async (e6) => await this.#e("Page.handleJavaScriptDialog", e6), navigate: async (e6) => await this.#e("Page.navigate", e6), navigateToHistoryEntry: async (e6) => await this.#e("Page.navigateToHistoryEntry", e6), printToPDF: async (e6) => await this.#e("Page.printToPDF", e6), reload: async (e6) => await this.#e("Page.reload", e6), removeScriptToEvaluateOnLoad: async (e6) => await this.#e("Page.removeScriptToEvaluateOnLoad", e6), removeScriptToEvaluateOnNewDocument: async (e6) => await this.#e("Page.removeScriptToEvaluateOnNewDocument", e6), screencastFrameAck: async (e6) => await this.#e("Page.screencastFrameAck", e6), searchInResource: async (e6) => await this.#e("Page.searchInResource", e6), setAdBlockingEnabled: async (e6) => await this.#e("Page.setAdBlockingEnabled", e6), setBypassCSP: async (e6) => await this.#e("Page.setBypassCSP", e6), getPermissionsPolicyState: async (e6) => await this.#e("Page.getPermissionsPolicyState", e6), getOriginTrials: async (e6) => await this.#e("Page.getOriginTrials", e6), setDeviceMetricsOverride: async (e6) => await this.#e("Page.setDeviceMetricsOverride", e6), setDeviceOrientationOverride: async (e6) => await this.#e("Page.setDeviceOrientationOverride", e6), setFontFamilies: async (e6) => await this.#e("Page.setFontFamilies", e6), setFontSizes: async (e6) => await this.#e("Page.setFontSizes", e6), setDocumentContent: async (e6) => await this.#e("Page.setDocumentContent", e6), setDownloadBehavior: async (e6) => await this.#e("Page.setDownloadBehavior", e6), setGeolocationOverride: async (e6) => await this.#e("Page.setGeolocationOverride", e6), setLifecycleEventsEnabled: async (e6) => await this.#e("Page.setLifecycleEventsEnabled", e6), setTouchEmulationEnabled: async (e6) => await this.#e("Page.setTouchEmulationEnabled", e6), startScreencast: async (e6) => await this.#e("Page.startScreencast", e6), stopLoading: async () => await this.#e("Page.stopLoading"), crash: async () => await this.#e("Page.crash"), close: async () => await this.#e("Page.close"), setWebLifecycleState: async (e6) => await this.#e("Page.setWebLifecycleState", e6), stopScreencast: async () => await this.#e("Page.stopScreencast"), produceCompilationCache: async (e6) => await this.#e("Page.produceCompilationCache", e6), addCompilationCache: async (e6) => await this.#e("Page.addCompilationCache", e6), clearCompilationCache: async () => await this.#e("Page.clearCompilationCache"), setSPCTransactionMode: async (e6) => await this.#e("Page.setSPCTransactionMode", e6), setRPHRegistrationMode: async (e6) => await this.#e("Page.setRPHRegistrationMode", e6), generateTestReport: async (e6) => await this.#e("Page.generateTestReport", e6), waitForDebugger: async () => await this.#e("Page.waitForDebugger"), setInterceptFileChooserDialog: async (e6) => await this.#e("Page.setInterceptFileChooserDialog", e6), setPrerenderingAllowed: async (e6) => await this.#e("Page.setPrerenderingAllowed", e6) }
    Performance = { disable: async () => await this.#e("Performance.disable"), enable: async (e6) => await this.#e("Performance.enable", e6), setTimeDomain: async (e6) => await this.#e("Performance.setTimeDomain", e6), getMetrics: async () => await this.#e("Performance.getMetrics") }
    PerformanceTimeline = { enable: async (e6) => await this.#e("PerformanceTimeline.enable", e6) }
    Security = { disable: async () => await this.#e("Security.disable"), enable: async () => await this.#e("Security.enable"), setIgnoreCertificateErrors: async (e6) => await this.#e("Security.setIgnoreCertificateErrors", e6), handleCertificateError: async (e6) => await this.#e("Security.handleCertificateError", e6), setOverrideCertificateErrors: async (e6) => await this.#e("Security.setOverrideCertificateErrors", e6) }
    ServiceWorker = { deliverPushMessage: async (e6) => await this.#e("ServiceWorker.deliverPushMessage", e6), disable: async () => await this.#e("ServiceWorker.disable"), dispatchSyncEvent: async (e6) => await this.#e("ServiceWorker.dispatchSyncEvent", e6), dispatchPeriodicSyncEvent: async (e6) => await this.#e("ServiceWorker.dispatchPeriodicSyncEvent", e6), enable: async () => await this.#e("ServiceWorker.enable"), inspectWorker: async (e6) => await this.#e("ServiceWorker.inspectWorker", e6), setForceUpdateOnPageLoad: async (e6) => await this.#e("ServiceWorker.setForceUpdateOnPageLoad", e6), skipWaiting: async (e6) => await this.#e("ServiceWorker.skipWaiting", e6), startWorker: async (e6) => await this.#e("ServiceWorker.startWorker", e6), stopAllWorkers: async () => await this.#e("ServiceWorker.stopAllWorkers"), stopWorker: async (e6) => await this.#e("ServiceWorker.stopWorker", e6), unregister: async (e6) => await this.#e("ServiceWorker.unregister", e6), updateRegistration: async (e6) => await this.#e("ServiceWorker.updateRegistration", e6) }
    Storage = { getStorageKeyForFrame: async (e6) => await this.#e("Storage.getStorageKeyForFrame", e6), clearDataForOrigin: async (e6) => await this.#e("Storage.clearDataForOrigin", e6), clearDataForStorageKey: async (e6) => await this.#e("Storage.clearDataForStorageKey", e6), getCookies: async (e6) => await this.#e("Storage.getCookies", e6), setCookies: async (e6) => await this.#e("Storage.setCookies", e6), clearCookies: async (e6) => await this.#e("Storage.clearCookies", e6), getUsageAndQuota: async (e6) => await this.#e("Storage.getUsageAndQuota", e6), overrideQuotaForOrigin: async (e6) => await this.#e("Storage.overrideQuotaForOrigin", e6), trackCacheStorageForOrigin: async (e6) => await this.#e("Storage.trackCacheStorageForOrigin", e6), trackCacheStorageForStorageKey: async (e6) => await this.#e("Storage.trackCacheStorageForStorageKey", e6), trackIndexedDBForOrigin: async (e6) => await this.#e("Storage.trackIndexedDBForOrigin", e6), trackIndexedDBForStorageKey: async (e6) => await this.#e("Storage.trackIndexedDBForStorageKey", e6), untrackCacheStorageForOrigin: async (e6) => await this.#e("Storage.untrackCacheStorageForOrigin", e6), untrackCacheStorageForStorageKey: async (e6) => await this.#e("Storage.untrackCacheStorageForStorageKey", e6), untrackIndexedDBForOrigin: async (e6) => await this.#e("Storage.untrackIndexedDBForOrigin", e6), untrackIndexedDBForStorageKey: async (e6) => await this.#e("Storage.untrackIndexedDBForStorageKey", e6), getTrustTokens: async () => await this.#e("Storage.getTrustTokens"), clearTrustTokens: async (e6) => await this.#e("Storage.clearTrustTokens", e6), getInterestGroupDetails: async (e6) => await this.#e("Storage.getInterestGroupDetails", e6), setInterestGroupTracking: async (e6) => await this.#e("Storage.setInterestGroupTracking", e6), setInterestGroupAuctionTracking: async (e6) => await this.#e("Storage.setInterestGroupAuctionTracking", e6), getSharedStorageMetadata: async (e6) => await this.#e("Storage.getSharedStorageMetadata", e6), getSharedStorageEntries: async (e6) => await this.#e("Storage.getSharedStorageEntries", e6), setSharedStorageEntry: async (e6) => await this.#e("Storage.setSharedStorageEntry", e6), deleteSharedStorageEntry: async (e6) => await this.#e("Storage.deleteSharedStorageEntry", e6), clearSharedStorageEntries: async (e6) => await this.#e("Storage.clearSharedStorageEntries", e6), resetSharedStorageBudget: async (e6) => await this.#e("Storage.resetSharedStorageBudget", e6), setSharedStorageTracking: async (e6) => await this.#e("Storage.setSharedStorageTracking", e6), setStorageBucketTracking: async (e6) => await this.#e("Storage.setStorageBucketTracking", e6), deleteStorageBucket: async (e6) => await this.#e("Storage.deleteStorageBucket", e6), runBounceTrackingMitigations: async () => await this.#e("Storage.runBounceTrackingMitigations"), setAttributionReportingLocalTestingMode: async (e6) => await this.#e("Storage.setAttributionReportingLocalTestingMode", e6), setAttributionReportingTracking: async (e6) => await this.#e("Storage.setAttributionReportingTracking", e6), sendPendingAttributionReports: async () => await this.#e("Storage.sendPendingAttributionReports"), getRelatedWebsiteSets: async () => await this.#e("Storage.getRelatedWebsiteSets") }
    SystemInfo = { getInfo: async () => await this.#e("SystemInfo.getInfo"), getFeatureState: async (e6) => await this.#e("SystemInfo.getFeatureState", e6), getProcessInfo: async () => await this.#e("SystemInfo.getProcessInfo") }
    Target = { activateTarget: async (e6) => await this.#e("Target.activateTarget", e6), attachToTarget: async (e6) => await this.#e("Target.attachToTarget", e6), attachToBrowserTarget: async () => await this.#e("Target.attachToBrowserTarget"), closeTarget: async (e6) => await this.#e("Target.closeTarget", e6), exposeDevToolsProtocol: async (e6) => await this.#e("Target.exposeDevToolsProtocol", e6), createBrowserContext: async (e6) => await this.#e("Target.createBrowserContext", e6), getBrowserContexts: async () => await this.#e("Target.getBrowserContexts"), createTarget: async (e6) => await this.#e("Target.createTarget", e6), detachFromTarget: async (e6) => await this.#e("Target.detachFromTarget", e6), disposeBrowserContext: async (e6) => await this.#e("Target.disposeBrowserContext", e6), getTargetInfo: async (e6) => await this.#e("Target.getTargetInfo", e6), getTargets: async (e6) => await this.#e("Target.getTargets", e6), sendMessageToTarget: async (e6) => await this.#e("Target.sendMessageToTarget", e6), setAutoAttach: async (e6) => await this.#e("Target.setAutoAttach", e6), autoAttachRelated: async (e6) => await this.#e("Target.autoAttachRelated", e6), setDiscoverTargets: async (e6) => await this.#e("Target.setDiscoverTargets", e6), setRemoteLocations: async (e6) => await this.#e("Target.setRemoteLocations", e6) }
    Tethering = { bind: async (e6) => await this.#e("Tethering.bind", e6), unbind: async (e6) => await this.#e("Tethering.unbind", e6) }
    Tracing = { end: async () => await this.#e("Tracing.end"), getCategories: async () => await this.#e("Tracing.getCategories"), recordClockSyncMarker: async (e6) => await this.#e("Tracing.recordClockSyncMarker", e6), requestMemoryDump: async (e6) => await this.#e("Tracing.requestMemoryDump", e6), start: async (e6) => await this.#e("Tracing.start", e6) }
    Fetch = { disable: async () => await this.#e("Fetch.disable"), enable: async (e6) => await this.#e("Fetch.enable", e6), failRequest: async (e6) => await this.#e("Fetch.failRequest", e6), fulfillRequest: async (e6) => await this.#e("Fetch.fulfillRequest", e6), continueRequest: async (e6) => await this.#e("Fetch.continueRequest", e6), continueWithAuth: async (e6) => await this.#e("Fetch.continueWithAuth", e6), continueResponse: async (e6) => await this.#e("Fetch.continueResponse", e6), getResponseBody: async (e6) => await this.#e("Fetch.getResponseBody", e6), takeResponseBodyAsStream: async (e6) => await this.#e("Fetch.takeResponseBodyAsStream", e6) }
    WebAudio = { enable: async () => await this.#e("WebAudio.enable"), disable: async () => await this.#e("WebAudio.disable"), getRealtimeData: async (e6) => await this.#e("WebAudio.getRealtimeData", e6) }
    WebAuthn = { enable: async (e6) => await this.#e("WebAuthn.enable", e6), disable: async () => await this.#e("WebAuthn.disable"), addVirtualAuthenticator: async (e6) => await this.#e("WebAuthn.addVirtualAuthenticator", e6), setResponseOverrideBits: async (e6) => await this.#e("WebAuthn.setResponseOverrideBits", e6), removeVirtualAuthenticator: async (e6) => await this.#e("WebAuthn.removeVirtualAuthenticator", e6), addCredential: async (e6) => await this.#e("WebAuthn.addCredential", e6), getCredential: async (e6) => await this.#e("WebAuthn.getCredential", e6), getCredentials: async (e6) => await this.#e("WebAuthn.getCredentials", e6), removeCredential: async (e6) => await this.#e("WebAuthn.removeCredential", e6), clearCredentials: async (e6) => await this.#e("WebAuthn.clearCredentials", e6), setUserVerified: async (e6) => await this.#e("WebAuthn.setUserVerified", e6), setAutomaticPresenceSimulation: async (e6) => await this.#e("WebAuthn.setAutomaticPresenceSimulation", e6), setCredentialProperties: async (e6) => await this.#e("WebAuthn.setCredentialProperties", e6) }
    Media = { enable: async () => await this.#e("Media.enable"), disable: async () => await this.#e("Media.disable") }
    DeviceAccess = { enable: async () => await this.#e("DeviceAccess.enable"), disable: async () => await this.#e("DeviceAccess.disable"), selectPrompt: async (e6) => await this.#e("DeviceAccess.selectPrompt", e6), cancelPrompt: async (e6) => await this.#e("DeviceAccess.cancelPrompt", e6) }
    Preload = { enable: async () => await this.#e("Preload.enable"), disable: async () => await this.#e("Preload.disable") }
    FedCm = { enable: async (e6) => await this.#e("FedCm.enable", e6), disable: async () => await this.#e("FedCm.disable"), selectAccount: async (e6) => await this.#e("FedCm.selectAccount", e6), clickDialogButton: async (e6) => await this.#e("FedCm.clickDialogButton", e6), openUrl: async (e6) => await this.#e("FedCm.openUrl", e6), dismissDialog: async (e6) => await this.#e("FedCm.dismissDialog", e6), resetCooldown: async () => await this.#e("FedCm.resetCooldown") }
    PWA = { getOsAppState: async (e6) => await this.#e("PWA.getOsAppState", e6) }
    Console = { clearMessages: async () => await this.#e("Console.clearMessages"), disable: async () => await this.#e("Console.disable"), enable: async () => await this.#e("Console.enable") }
    Debugger = { continueToLocation: async (e6) => await this.#e("Debugger.continueToLocation", e6), disable: async () => await this.#e("Debugger.disable"), enable: async (e6) => await this.#e("Debugger.enable", e6), evaluateOnCallFrame: async (e6) => await this.#e("Debugger.evaluateOnCallFrame", e6), getPossibleBreakpoints: async (e6) => await this.#e("Debugger.getPossibleBreakpoints", e6), getScriptSource: async (e6) => await this.#e("Debugger.getScriptSource", e6), disassembleWasmModule: async (e6) => await this.#e("Debugger.disassembleWasmModule", e6), nextWasmDisassemblyChunk: async (e6) => await this.#e("Debugger.nextWasmDisassemblyChunk", e6), getWasmBytecode: async (e6) => await this.#e("Debugger.getWasmBytecode", e6), getStackTrace: async (e6) => await this.#e("Debugger.getStackTrace", e6), pause: async () => await this.#e("Debugger.pause"), pauseOnAsyncCall: async (e6) => await this.#e("Debugger.pauseOnAsyncCall", e6), removeBreakpoint: async (e6) => await this.#e("Debugger.removeBreakpoint", e6), restartFrame: async (e6) => await this.#e("Debugger.restartFrame", e6), resume: async (e6) => await this.#e("Debugger.resume", e6), searchInContent: async (e6) => await this.#e("Debugger.searchInContent", e6), setAsyncCallStackDepth: async (e6) => await this.#e("Debugger.setAsyncCallStackDepth", e6), setBlackboxPatterns: async (e6) => await this.#e("Debugger.setBlackboxPatterns", e6), setBlackboxedRanges: async (e6) => await this.#e("Debugger.setBlackboxedRanges", e6), setBreakpoint: async (e6) => await this.#e("Debugger.setBreakpoint", e6), setInstrumentationBreakpoint: async (e6) => await this.#e("Debugger.setInstrumentationBreakpoint", e6), setBreakpointByUrl: async (e6) => await this.#e("Debugger.setBreakpointByUrl", e6), setBreakpointOnFunctionCall: async (e6) => await this.#e("Debugger.setBreakpointOnFunctionCall", e6), setBreakpointsActive: async (e6) => await this.#e("Debugger.setBreakpointsActive", e6), setPauseOnExceptions: async (e6) => await this.#e("Debugger.setPauseOnExceptions", e6), setReturnValue: async (e6) => await this.#e("Debugger.setReturnValue", e6), setScriptSource: async (e6) => await this.#e("Debugger.setScriptSource", e6), setSkipAllPauses: async (e6) => await this.#e("Debugger.setSkipAllPauses", e6), setVariableValue: async (e6) => await this.#e("Debugger.setVariableValue", e6), stepInto: async (e6) => await this.#e("Debugger.stepInto", e6), stepOut: async () => await this.#e("Debugger.stepOut"), stepOver: async (e6) => await this.#e("Debugger.stepOver", e6) }
    HeapProfiler = { addInspectedHeapObject: async (e6) => await this.#e("HeapProfiler.addInspectedHeapObject", e6), collectGarbage: async () => await this.#e("HeapProfiler.collectGarbage"), disable: async () => await this.#e("HeapProfiler.disable"), enable: async () => await this.#e("HeapProfiler.enable"), getHeapObjectId: async (e6) => await this.#e("HeapProfiler.getHeapObjectId", e6), getObjectByHeapObjectId: async (e6) => await this.#e("HeapProfiler.getObjectByHeapObjectId", e6), getSamplingProfile: async () => await this.#e("HeapProfiler.getSamplingProfile"), startSampling: async (e6) => await this.#e("HeapProfiler.startSampling", e6), startTrackingHeapObjects: async (e6) => await this.#e("HeapProfiler.startTrackingHeapObjects", e6), stopSampling: async () => await this.#e("HeapProfiler.stopSampling"), stopTrackingHeapObjects: async (e6) => await this.#e("HeapProfiler.stopTrackingHeapObjects", e6), takeHeapSnapshot: async (e6) => await this.#e("HeapProfiler.takeHeapSnapshot", e6) }
    Profiler = { disable: async () => await this.#e("Profiler.disable"), enable: async () => await this.#e("Profiler.enable"), getBestEffortCoverage: async () => await this.#e("Profiler.getBestEffortCoverage"), setSamplingInterval: async (e6) => await this.#e("Profiler.setSamplingInterval", e6), start: async () => await this.#e("Profiler.start"), startPreciseCoverage: async (e6) => await this.#e("Profiler.startPreciseCoverage", e6), stop: async () => await this.#e("Profiler.stop"), stopPreciseCoverage: async () => await this.#e("Profiler.stopPreciseCoverage"), takePreciseCoverage: async () => await this.#e("Profiler.takePreciseCoverage") }
    Runtime = { awaitPromise: async (e6) => await this.#e("Runtime.awaitPromise", e6), callFunctionOn: async (e6) => await this.#e("Runtime.callFunctionOn", e6), compileScript: async (e6) => await this.#e("Runtime.compileScript", e6), disable: async () => await this.#e("Runtime.disable"), discardConsoleEntries: async () => await this.#e("Runtime.discardConsoleEntries"), enable: async () => await this.#e("Runtime.enable"), evaluate: async (e6) => await this.#e("Runtime.evaluate", e6), getIsolateId: async () => await this.#e("Runtime.getIsolateId"), getHeapUsage: async () => await this.#e("Runtime.getHeapUsage"), getProperties: async (e6) => await this.#e("Runtime.getProperties", e6), globalLexicalScopeNames: async (e6) => await this.#e("Runtime.globalLexicalScopeNames", e6), queryObjects: async (e6) => await this.#e("Runtime.queryObjects", e6), releaseObject: async (e6) => await this.#e("Runtime.releaseObject", e6), releaseObjectGroup: async (e6) => await this.#e("Runtime.releaseObjectGroup", e6), runIfWaitingForDebugger: async () => await this.#e("Runtime.runIfWaitingForDebugger"), runScript: async (e6) => await this.#e("Runtime.runScript", e6), setAsyncCallStackDepth: async (e6) => await this.#e("Runtime.setAsyncCallStackDepth", e6), setCustomObjectFormatterEnabled: async (e6) => await this.#e("Runtime.setCustomObjectFormatterEnabled", e6), setMaxCallStackSizeToCapture: async (e6) => await this.#e("Runtime.setMaxCallStackSizeToCapture", e6), terminateExecution: async () => await this.#e("Runtime.terminateExecution"), addBinding: async (e6) => await this.#e("Runtime.addBinding", e6), removeBinding: async (e6) => await this.#e("Runtime.removeBinding", e6), getExceptionDetails: async (e6) => await this.#e("Runtime.getExceptionDetails", e6) }
    Schema = { getDomains: async () => await this.#e("Schema.getDomains") }
}
var da = { chrome: "125.0.6400.0", firefox: "116.0" }
var pa = "cache.json"
var m6 = {}
async function Fa() {
    return await (await fetch("https://googlechromelabs.github.io/chrome-for-testing/known-good-versions-with-downloads.json")).json()
}
function Aa() {
    switch (Deno.build.os) {
        case "linux": {
            let t10 = Deno.env.get("XDG_CACHE_HOME")
            if (t10) return t10
            let e6 = Deno.env.get("HOME")
            if (e6) return `${e6}/.cache`
            break
        }
        case "darwin": {
            let t10 = Deno.env.get("HOME")
            if (t10) return `${t10}/Library/Caches`
            break
        }
        case "windows":
            return Deno.env.get("LOCALAPPDATA") ?? null
    }
    return null
}
function C9() {
    let t10 = Aa()
    if (!t10) throw new Error("couldn't determine default cache directory")
    return f(t10, "astral")
}
function la({ cache: t10 = C9() } = {}) {
    try {
        return JSON.parse(Deno.readTextFileSync(v2(t10, pa)))
    } catch {
        return {}
    }
}
async function Za({ cache: t10 = C9() } = {}) {
    try {
        ;(await t2(t10)) && (delete m6[t10], await Deno.remove(t10, { recursive: true }))
    } catch (e6) {
        console.warn(`Failed to clean cache: ${e6}`)
    }
}
async function ga() {
    if ((await Deno.permissions.query({ name: "env", variable: "CI" })).state === "granted" && `${Deno.env.get("CI") ?? ""}`.length) return true
    if ((await Deno.permissions.query({ name: "env", variable: "ASTRAL_QUIET_INSTALL" })).state === "granted") {
        let r8 = `${Deno.env.get("ASTRAL_QUIET_INSTALL") ?? ""}`
        return r8.length && !/^(0|[Nn]o?|NO|[Oo]ff|OFF|[Ff]alse|FALSE)$/.test(r8)
    }
    return false
}
async function Na(t10, e6) {
    let r8 = await ga(),
        a4 = await Deno.open(t10),
        s9 = new export_ZipReader(a4),
        o8 = await s9.getEntries(),
        n8 = r8 ? null : new C({ title: `Inflating ${e6}`, total: o8.length, clear: true, display: ":title :bar :percent", output: Deno.stderr }),
        i8 = 0
    for (let d5 of o8) {
        if (!d5.directory && d5.getData) {
            let c7 = f(e6, d5.filename)
            await c(s4(c7))
            let l6 = await Deno.open(c7, { create: true, truncate: true, write: true, mode: 493 })
            await d5.getData(l6, { checkSignature: true, useWebWorkers: false })
        }
        i8++, n8?.render(i8)
    }
    await s9.close(),
        r8 ||
            console.error(`
Browser saved to ${e6}`)
}
async function Xr(t10, { cache: e6 = C9(), timeout: r8 = 6e4 } = {}) {
    let a4 = da[t10],
        s9 = `${t10}-${da[t10]}`,
        o8 = la({ cache: e6 })
    if ((!o8[a4] && m6[e6]?.[s9]?.exists() && (await m6[e6]?.[s9]?.waitRelease({ timeout: r8 }), Object.assign(o8, la({ cache: e6 }))), !o8[a4])) {
        let i8 = await ga(),
            l6 = (await Fa()).versions
                .filter((y5) => y5.version === a4)[0]
                .downloads.chrome.filter((y5) => {
                    if (Deno.build.os === "darwin" && Deno.build.arch === "aarch64") return y5.platform === "mac-arm64"
                    if (Deno.build.os === "darwin" && Deno.build.arch === "x86_64") return y5.platform === "mac-x64"
                    if (Deno.build.os === "windows") return y5.platform === "win64"
                    if (Deno.build.os === "linux") return y5.platform === "linux64"
                    throw new Error("Unsupported platform, provide a path to a chromium or firefox binary instead")
                })[0]
        s(e6)
        let p6 = new Qr({ cache: e6 })
        if (((m6[e6] ??= {}), (m6[e6][s9] = p6), !p6.create())) return Xr(t10, { cache: e6, timeout: r8 })
        try {
            let y5 = await fetch(l6.url)
            if (!y5.body) throw new Error("Download failed, please check your internet connection and try again")
            if (i8) await Deno.writeFile(v2(e6, `raw_${a4}.zip`), y5.body)
            else {
                let g7 = y5.body.getReader(),
                    oa = await Deno.open(v2(e6, `raw_${a4}.zip`), { write: true, truncate: true, create: true }),
                    Sa = new C({ title: `Downloading ${t10} ${a4}`, total: Number(y5.headers.get("Content-Length") ?? 0), clear: true, display: ":title :bar :percent", output: Deno.stderr }),
                    na = 0
                for (;;) {
                    let { done: fa, value: ia } = await g7.read()
                    if (fa) break
                    await oa.write(ia), (na += ia.length), Sa.render(na)
                }
                oa.close(),
                    console.error(`
Download complete (${t10} version ${a4})`)
            }
            await Na(v2(e6, `raw_${a4}.zip`), v2(e6, a4)), (o8[a4] = v2(e6, a4)), Deno.writeTextFileSync(v2(e6, pa), JSON.stringify(o8))
        } finally {
            m6[e6]?.[s9]?.release()
        }
    }
    let n8 = o8[a4]
    if (Deno.build.os === "darwin" && Deno.build.arch === "aarch64") return v2(n8, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing")
    if (Deno.build.os === "darwin" && Deno.build.arch === "x86_64") return v2(n8, "chrome-mac-x64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing")
    if (Deno.build.os === "windows") return v2(n8, "chrome-win64", "chrome.exe")
    if (Deno.build.os === "linux") return v2(n8, "chrome-linux64", "chrome")
    throw new Error("Unsupported platform, provide a path to a chromium or firefox binary instead")
}
var Qr = class {
    path
    constructor({ cache: e6 = C9() } = {}) {
        ;(this.path = v2(e6, ".lock")), this.removeExpiredLockPath()
    }
    removeExpiredLockPath() {
        try {
            let e6 = Deno.statSync(this.path),
                r8 = 1800 * 1e3
            e6.birthtime && Date.now() - e6.birthtime.getTime() > r8 && (Deno.removeSync(this.path), console.log(`%c There is an old lock file (${this.path}), this is probably due to a failed download. It has been removed automatically.`, "color: #ff0000"))
        } catch (e6) {
            if (!(e6 instanceof Deno.errors.NotFound)) throw e6
        }
    }
    exists() {
        return n2(this.path)
    }
    create() {
        try {
            return Deno.writeTextFileSync(this.path, `${Deno.pid}`, { createNew: true }), true
        } catch (e6) {
            if (!(e6 instanceof Deno.errors.AlreadyExists)) throw e6
            return false
        }
    }
    release() {
        try {
            Deno.readTextFileSync(this.path) === `${Deno.pid}` && Deno.removeSync(this.path)
        } catch (e6) {
            if (!(e6 instanceof Deno.errors.NotFound)) throw e6
        }
    }
    async waitRelease({ timeout: e6 = 6e4 } = {}) {
        await T(
            () => {
                if (this.exists()) throw new Error(`Timeout while waiting for lockfile release at: ${this.path}`)
            },
            { maxTimeout: e6, maxAttempts: 1 / 0, multiplier: 1, minTimeout: 100 }
        )
    }
}
var S7 = class {
    #r
    defaultValue
    message
    type
    constructor(e6, r8) {
        ;(this.#r = e6), (this.defaultValue = r8.defaultPrompt ?? ""), (this.message = r8.message), (this.type = r8.type)
    }
    async accept(e6) {
        await this.#r.Page.handleJavaScriptDialog({ accept: true, promptText: e6 })
    }
    async dismiss() {
        await this.#r.Page.handleJavaScriptDialog({ accept: false })
    }
}
var wa = /ws:\/\/(.*:.*?)\//
async function f3(t10) {
    await new Promise((e6) => {
        t10.onopen = () => {
            e6()
        }
    })
}
function Jr(t10) {
    let e6 = atob(t10)
    return new Uint8Array([...e6].map((r8) => r8.charCodeAt(0)))
}
function u5(t10, e6) {
    return T(() => o2(t10, e6))
}
function x5(t10) {
    let e6 = []
    for (let r8 = 0; r8 < t10.length; r8 += 2) e6.push({ x: t10[r8], y: t10[r8 + 1] })
    return e6
}
function ma(t10) {
    let e6 = t10[0]
    for (let r8 of t10) r8.x < e6.x && r8.y < e6.y && (e6 = r8)
    return e6
}
var b7 = class t9 {
    #r
    #t
    #a
    constructor(e6, r8, a4) {
        ;(this.#r = e6), (this.#t = r8), (this.#a = a4)
    }
    async $(e6) {
        let r8 = await u5(this.#t.DOM.querySelector({ nodeId: this.#r, selector: e6 }), this.#a.timeout)
        return r8?.nodeId ? new t9(r8.nodeId, this.#t, this.#a) : null
    }
    async $$(e6) {
        let r8 = await u5(this.#t.DOM.querySelectorAll({ nodeId: this.#r, selector: e6 }), this.#a.timeout)
        return r8 ? r8.nodeIds.map((a4) => new t9(a4, this.#t, this.#a)) : []
    }
    async boundingBox() {
        let e6 = await this.boxModel()
        if (!e6) return null
        let { x: r8, y: a4 } = ma(e6.content)
        return { x: r8, y: a4, width: e6.width, height: e6.height }
    }
    async boxModel() {
        let e6 = await u5(this.#t.DOM.getBoxModel({ nodeId: this.#r }), this.#a.timeout)
        if (!e6) return null
        let { model: r8 } = e6
        return { border: x5(r8.border), content: x5(r8.content), height: r8.height, margin: x5(r8.margin), padding: x5(r8.padding), width: r8.width }
    }
    async click(e6) {
        await this.scrollIntoView()
        let r8 = await this.boxModel()
        if (!r8) throw new Error("Unable to get stable box model to click on")
        let { x: a4, y: s9 } = ma(r8.content)
        e6?.offset ? await this.#a.mouse.click(a4 + e6.offset.x, s9 + e6.offset.y) : await this.#a.mouse.click(a4 + r8.width / 2, s9 + r8.height / 2)
    }
    async focus() {
        await u5(this.#t.DOM.focus({ nodeId: this.#r }), this.#a.timeout)
    }
    async innerHTML() {
        return await u5(
            (async () => {
                let { object: e6 } = await this.#t.DOM.resolveNode({ nodeId: this.#r })
                return (await this.#t.Runtime.callFunctionOn({ functionDeclaration: "(element)=>element.innerHTML", objectId: e6.objectId, arguments: [{ objectId: e6.objectId }], awaitPromise: true, returnByValue: true })).result.value
            })(),
            this.#a.timeout
        )
    }
    async innerText() {
        return await u5(
            (async () => {
                let { object: e6 } = await this.#t.DOM.resolveNode({ nodeId: this.#r })
                return (await this.#t.Runtime.callFunctionOn({ functionDeclaration: "(element)=>element.innerText", objectId: e6.objectId, arguments: [{ objectId: e6.objectId }], awaitPromise: true, returnByValue: true })).result.value
            })(),
            this.#a.timeout
        )
    }
    async screenshot(e6) {
        await this.scrollIntoView()
        let r8 = await this.boundingBox()
        if (!r8) throw new Error("No bounding box found when trying to screenshot element")
        return await this.#a.screenshot({ ...e6, clip: { ...r8, scale: 1 } })
    }
    async scrollIntoView() {
        await u5(this.#t.DOM.scrollIntoViewIfNeeded({ nodeId: this.#r }), this.#a.timeout)
    }
    async type(e6, r8) {
        await this.focus(), await this.#a.keyboard.type(e6, r8)
    }
    async waitForSelector(e6, r8) {
        try {
            return await o2(
                (async () => {
                    for (;;) {
                        let a4 = await this.#t.DOM.querySelector({ nodeId: this.#r, selector: e6 })
                        if (a4?.nodeId) return new t9(a4.nodeId, this.#t, this.#a)
                    }
                })(),
                r8?.timeout || this.#a.timeout
            )
        } catch {
            throw new Error(`Unable to get element from selector: ${e6}`)
        }
    }
    async getAttributes() {
        return await u5(
            (async () => {
                let { attributes: e6 } = await this.#t.DOM.getAttributes({ nodeId: this.#r }),
                    r8 = {}
                for (let a4 = 0; a4 < e6.length; a4 += 2) {
                    let s9 = e6[a4],
                        o8 = e6[a4 + 1]
                    r8[s9] = o8
                }
                return r8
            })(),
            this.#a.timeout
        )
    }
    async getAttribute(e6) {
        return await u5(
            (async () => {
                let { object: r8 } = await this.#t.DOM.resolveNode({ nodeId: this.#r })
                return (await this.#t.Runtime.callFunctionOn({ functionDeclaration: "(element,name)=>element.getAttribute(name)", objectId: r8.objectId, arguments: [{ objectId: r8.objectId }, { value: e6 }], awaitPromise: true, returnByValue: true })).result.value
            })(),
            this.#a.timeout
        )
    }
    async evaluate(e6, r8) {
        let { object: a4 } = await u5(this.#t.DOM.resolveNode({ nodeId: this.#r }), this.#a.timeout),
            s9 = [{ objectId: a4.objectId }]
        if (r8?.args) for (let i8 of r8.args) Number.isNaN(i8) ? s9.push({ unserializableValue: "NaN" }) : s9.push({ value: i8 })
        let { result: o8, exceptionDetails: n8 } = await u5(this.#t.Runtime.callFunctionOn({ functionDeclaration: e6.toString(), objectId: a4.objectId, arguments: s9, awaitPromise: true, returnByValue: true }), this.#a.timeout)
        if (n8) throw n8
        if (o8.type === "bigint") return BigInt(o8.unserializableValue.slice(0, -1))
        if (o8.type === "undefined") return
        if (o8.type === "object") {
            if (o8.subtype === "null") return null
        } else if (o8.type === "number" && o8.unserializableValue === "NaN") return NaN
        return o8.value
    }
}
var D5 = class {
    #r
    #t
    multiple
    constructor(e6, r8) {
        ;(this.multiple = r8.mode === "selectMultiple"), (this.#r = e6), (this.#t = r8.backendNodeId)
    }
    async setFiles(e6) {
        await this.#r.DOM.setFileInputFiles({ files: e6.map((r8) => v2(r8)), backendNodeId: this.#t })
    }
}
var Yr = { 0: { keyCode: 48, key: "0", code: "Digit0" }, 1: { keyCode: 49, key: "1", code: "Digit1" }, 2: { keyCode: 50, key: "2", code: "Digit2" }, 3: { keyCode: 51, key: "3", code: "Digit3" }, 4: { keyCode: 52, key: "4", code: "Digit4" }, 5: { keyCode: 53, key: "5", code: "Digit5" }, 6: { keyCode: 54, key: "6", code: "Digit6" }, 7: { keyCode: 55, key: "7", code: "Digit7" }, 8: { keyCode: 56, key: "8", code: "Digit8" }, 9: { keyCode: 57, key: "9", code: "Digit9" }, Power: { key: "Power", code: "Power" }, Eject: { key: "Eject", code: "Eject" }, Abort: { keyCode: 3, code: "Abort", key: "Cancel" }, Help: { keyCode: 6, code: "Help", key: "Help" }, Backspace: { keyCode: 8, code: "Backspace", key: "Backspace" }, Tab: { keyCode: 9, code: "Tab", key: "Tab" }, Numpad5: { keyCode: 12, shiftKeyCode: 101, key: "Clear", code: "Numpad5", shiftKey: "5", location: 3 }, NumpadEnter: { keyCode: 13, code: "NumpadEnter", key: "Enter", text: "\r", location: 3 }, Enter: { keyCode: 13, code: "Enter", key: "Enter", text: "\r" }, "\r": { keyCode: 13, code: "Enter", key: "Enter", text: "\r" }, "\n": { keyCode: 13, code: "Enter", key: "Enter", text: "\r" }, ShiftLeft: { keyCode: 16, code: "ShiftLeft", key: "Shift", location: 1 }, ShiftRight: { keyCode: 16, code: "ShiftRight", key: "Shift", location: 2 }, ControlLeft: { keyCode: 17, code: "ControlLeft", key: "Control", location: 1 }, ControlRight: { keyCode: 17, code: "ControlRight", key: "Control", location: 2 }, AltLeft: { keyCode: 18, code: "AltLeft", key: "Alt", location: 1 }, AltRight: { keyCode: 18, code: "AltRight", key: "Alt", location: 2 }, Pause: { keyCode: 19, code: "Pause", key: "Pause" }, CapsLock: { keyCode: 20, code: "CapsLock", key: "CapsLock" }, Escape: { keyCode: 27, code: "Escape", key: "Escape" }, Convert: { keyCode: 28, code: "Convert", key: "Convert" }, NonConvert: { keyCode: 29, code: "NonConvert", key: "NonConvert" }, Space: { keyCode: 32, code: "Space", key: " " }, Numpad9: { keyCode: 33, shiftKeyCode: 105, key: "PageUp", code: "Numpad9", shiftKey: "9", location: 3 }, PageUp: { keyCode: 33, code: "PageUp", key: "PageUp" }, Numpad3: { keyCode: 34, shiftKeyCode: 99, key: "PageDown", code: "Numpad3", shiftKey: "3", location: 3 }, PageDown: { keyCode: 34, code: "PageDown", key: "PageDown" }, End: { keyCode: 35, code: "End", key: "End" }, Numpad1: { keyCode: 35, shiftKeyCode: 97, key: "End", code: "Numpad1", shiftKey: "1", location: 3 }, Home: { keyCode: 36, code: "Home", key: "Home" }, Numpad7: { keyCode: 36, shiftKeyCode: 103, key: "Home", code: "Numpad7", shiftKey: "7", location: 3 }, ArrowLeft: { keyCode: 37, code: "ArrowLeft", key: "ArrowLeft" }, Numpad4: { keyCode: 37, shiftKeyCode: 100, key: "ArrowLeft", code: "Numpad4", shiftKey: "4", location: 3 }, Numpad8: { keyCode: 38, shiftKeyCode: 104, key: "ArrowUp", code: "Numpad8", shiftKey: "8", location: 3 }, ArrowUp: { keyCode: 38, code: "ArrowUp", key: "ArrowUp" }, ArrowRight: { keyCode: 39, code: "ArrowRight", key: "ArrowRight" }, Numpad6: { keyCode: 39, shiftKeyCode: 102, key: "ArrowRight", code: "Numpad6", shiftKey: "6", location: 3 }, Numpad2: { keyCode: 40, shiftKeyCode: 98, key: "ArrowDown", code: "Numpad2", shiftKey: "2", location: 3 }, ArrowDown: { keyCode: 40, code: "ArrowDown", key: "ArrowDown" }, Select: { keyCode: 41, code: "Select", key: "Select" }, Open: { keyCode: 43, code: "Open", key: "Execute" }, PrintScreen: { keyCode: 44, code: "PrintScreen", key: "PrintScreen" }, Insert: { keyCode: 45, code: "Insert", key: "Insert" }, Numpad0: { keyCode: 45, shiftKeyCode: 96, key: "Insert", code: "Numpad0", shiftKey: "0", location: 3 }, Delete: { keyCode: 46, code: "Delete", key: "Delete" }, NumpadDecimal: { keyCode: 46, shiftKeyCode: 110, code: "NumpadDecimal", key: "\0", shiftKey: ".", location: 3 }, Digit0: { keyCode: 48, code: "Digit0", shiftKey: ")", key: "0" }, Digit1: { keyCode: 49, code: "Digit1", shiftKey: "!", key: "1" }, Digit2: { keyCode: 50, code: "Digit2", shiftKey: "@", key: "2" }, Digit3: { keyCode: 51, code: "Digit3", shiftKey: "#", key: "3" }, Digit4: { keyCode: 52, code: "Digit4", shiftKey: "$", key: "4" }, Digit5: { keyCode: 53, code: "Digit5", shiftKey: "%", key: "5" }, Digit6: { keyCode: 54, code: "Digit6", shiftKey: "^", key: "6" }, Digit7: { keyCode: 55, code: "Digit7", shiftKey: "&", key: "7" }, Digit8: { keyCode: 56, code: "Digit8", shiftKey: "*", key: "8" }, Digit9: { keyCode: 57, code: "Digit9", shiftKey: "(", key: "9" }, KeyA: { keyCode: 65, code: "KeyA", shiftKey: "A", key: "a" }, KeyB: { keyCode: 66, code: "KeyB", shiftKey: "B", key: "b" }, KeyC: { keyCode: 67, code: "KeyC", shiftKey: "C", key: "c" }, KeyD: { keyCode: 68, code: "KeyD", shiftKey: "D", key: "d" }, KeyE: { keyCode: 69, code: "KeyE", shiftKey: "E", key: "e" }, KeyF: { keyCode: 70, code: "KeyF", shiftKey: "F", key: "f" }, KeyG: { keyCode: 71, code: "KeyG", shiftKey: "G", key: "g" }, KeyH: { keyCode: 72, code: "KeyH", shiftKey: "H", key: "h" }, KeyI: { keyCode: 73, code: "KeyI", shiftKey: "I", key: "i" }, KeyJ: { keyCode: 74, code: "KeyJ", shiftKey: "J", key: "j" }, KeyK: { keyCode: 75, code: "KeyK", shiftKey: "K", key: "k" }, KeyL: { keyCode: 76, code: "KeyL", shiftKey: "L", key: "l" }, KeyM: { keyCode: 77, code: "KeyM", shiftKey: "M", key: "m" }, KeyN: { keyCode: 78, code: "KeyN", shiftKey: "N", key: "n" }, KeyO: { keyCode: 79, code: "KeyO", shiftKey: "O", key: "o" }, KeyP: { keyCode: 80, code: "KeyP", shiftKey: "P", key: "p" }, KeyQ: { keyCode: 81, code: "KeyQ", shiftKey: "Q", key: "q" }, KeyR: { keyCode: 82, code: "KeyR", shiftKey: "R", key: "r" }, KeyS: { keyCode: 83, code: "KeyS", shiftKey: "S", key: "s" }, KeyT: { keyCode: 84, code: "KeyT", shiftKey: "T", key: "t" }, KeyU: { keyCode: 85, code: "KeyU", shiftKey: "U", key: "u" }, KeyV: { keyCode: 86, code: "KeyV", shiftKey: "V", key: "v" }, KeyW: { keyCode: 87, code: "KeyW", shiftKey: "W", key: "w" }, KeyX: { keyCode: 88, code: "KeyX", shiftKey: "X", key: "x" }, KeyY: { keyCode: 89, code: "KeyY", shiftKey: "Y", key: "y" }, KeyZ: { keyCode: 90, code: "KeyZ", shiftKey: "Z", key: "z" }, MetaLeft: { keyCode: 91, code: "MetaLeft", key: "Meta", location: 1 }, MetaRight: { keyCode: 92, code: "MetaRight", key: "Meta", location: 2 }, ContextMenu: { keyCode: 93, code: "ContextMenu", key: "ContextMenu" }, NumpadMultiply: { keyCode: 106, code: "NumpadMultiply", key: "*", location: 3 }, NumpadAdd: { keyCode: 107, code: "NumpadAdd", key: "+", location: 3 }, NumpadSubtract: { keyCode: 109, code: "NumpadSubtract", key: "-", location: 3 }, NumpadDivide: { keyCode: 111, code: "NumpadDivide", key: "/", location: 3 }, F1: { keyCode: 112, code: "F1", key: "F1" }, F2: { keyCode: 113, code: "F2", key: "F2" }, F3: { keyCode: 114, code: "F3", key: "F3" }, F4: { keyCode: 115, code: "F4", key: "F4" }, F5: { keyCode: 116, code: "F5", key: "F5" }, F6: { keyCode: 117, code: "F6", key: "F6" }, F7: { keyCode: 118, code: "F7", key: "F7" }, F8: { keyCode: 119, code: "F8", key: "F8" }, F9: { keyCode: 120, code: "F9", key: "F9" }, F10: { keyCode: 121, code: "F10", key: "F10" }, F11: { keyCode: 122, code: "F11", key: "F11" }, F12: { keyCode: 123, code: "F12", key: "F12" }, F13: { keyCode: 124, code: "F13", key: "F13" }, F14: { keyCode: 125, code: "F14", key: "F14" }, F15: { keyCode: 126, code: "F15", key: "F15" }, F16: { keyCode: 127, code: "F16", key: "F16" }, F17: { keyCode: 128, code: "F17", key: "F17" }, F18: { keyCode: 129, code: "F18", key: "F18" }, F19: { keyCode: 130, code: "F19", key: "F19" }, F20: { keyCode: 131, code: "F20", key: "F20" }, F21: { keyCode: 132, code: "F21", key: "F21" }, F22: { keyCode: 133, code: "F22", key: "F22" }, F23: { keyCode: 134, code: "F23", key: "F23" }, F24: { keyCode: 135, code: "F24", key: "F24" }, NumLock: { keyCode: 144, code: "NumLock", key: "NumLock" }, ScrollLock: { keyCode: 145, code: "ScrollLock", key: "ScrollLock" }, AudioVolumeMute: { keyCode: 173, code: "AudioVolumeMute", key: "AudioVolumeMute" }, AudioVolumeDown: { keyCode: 174, code: "AudioVolumeDown", key: "AudioVolumeDown" }, AudioVolumeUp: { keyCode: 175, code: "AudioVolumeUp", key: "AudioVolumeUp" }, MediaTrackNext: { keyCode: 176, code: "MediaTrackNext", key: "MediaTrackNext" }, MediaTrackPrevious: { keyCode: 177, code: "MediaTrackPrevious", key: "MediaTrackPrevious" }, MediaStop: { keyCode: 178, code: "MediaStop", key: "MediaStop" }, MediaPlayPause: { keyCode: 179, code: "MediaPlayPause", key: "MediaPlayPause" }, Semicolon: { keyCode: 186, code: "Semicolon", shiftKey: ":", key: ";" }, Equal: { keyCode: 187, code: "Equal", shiftKey: "+", key: "=" }, NumpadEqual: { keyCode: 187, code: "NumpadEqual", key: "=", location: 3 }, Comma: { keyCode: 188, code: "Comma", shiftKey: "<", key: "," }, Minus: { keyCode: 189, code: "Minus", shiftKey: "_", key: "-" }, Period: { keyCode: 190, code: "Period", shiftKey: ">", key: "." }, Slash: { keyCode: 191, code: "Slash", shiftKey: "?", key: "/" }, Backquote: { keyCode: 192, code: "Backquote", shiftKey: "~", key: "`" }, BracketLeft: { keyCode: 219, code: "BracketLeft", shiftKey: "{", key: "[" }, Backslash: { keyCode: 220, code: "Backslash", shiftKey: "|", key: "\\" }, BracketRight: { keyCode: 221, code: "BracketRight", shiftKey: "}", key: "]" }, Quote: { keyCode: 222, code: "Quote", shiftKey: '"', key: "'" }, AltGraph: { keyCode: 225, code: "AltGraph", key: "AltGraph" }, Props: { keyCode: 247, code: "Props", key: "CrSel" }, Cancel: { keyCode: 3, key: "Cancel", code: "Abort" }, Clear: { keyCode: 12, key: "Clear", code: "Numpad5", location: 3 }, Shift: { keyCode: 16, key: "Shift", code: "ShiftLeft", location: 1 }, Control: { keyCode: 17, key: "Control", code: "ControlLeft", location: 1 }, Alt: { keyCode: 18, key: "Alt", code: "AltLeft", location: 1 }, Accept: { keyCode: 30, key: "Accept" }, ModeChange: { keyCode: 31, key: "ModeChange" }, " ": { keyCode: 32, key: " ", code: "Space" }, Print: { keyCode: 42, key: "Print" }, Execute: { keyCode: 43, key: "Execute", code: "Open" }, "\0": { keyCode: 46, key: "\0", code: "NumpadDecimal", location: 3 }, a: { keyCode: 65, key: "a", code: "KeyA" }, b: { keyCode: 66, key: "b", code: "KeyB" }, c: { keyCode: 67, key: "c", code: "KeyC" }, d: { keyCode: 68, key: "d", code: "KeyD" }, e: { keyCode: 69, key: "e", code: "KeyE" }, f: { keyCode: 70, key: "f", code: "KeyF" }, g: { keyCode: 71, key: "g", code: "KeyG" }, h: { keyCode: 72, key: "h", code: "KeyH" }, i: { keyCode: 73, key: "i", code: "KeyI" }, j: { keyCode: 74, key: "j", code: "KeyJ" }, k: { keyCode: 75, key: "k", code: "KeyK" }, l: { keyCode: 76, key: "l", code: "KeyL" }, m: { keyCode: 77, key: "m", code: "KeyM" }, n: { keyCode: 78, key: "n", code: "KeyN" }, o: { keyCode: 79, key: "o", code: "KeyO" }, p: { keyCode: 80, key: "p", code: "KeyP" }, q: { keyCode: 81, key: "q", code: "KeyQ" }, r: { keyCode: 82, key: "r", code: "KeyR" }, s: { keyCode: 83, key: "s", code: "KeyS" }, t: { keyCode: 84, key: "t", code: "KeyT" }, u: { keyCode: 85, key: "u", code: "KeyU" }, v: { keyCode: 86, key: "v", code: "KeyV" }, w: { keyCode: 87, key: "w", code: "KeyW" }, x: { keyCode: 88, key: "x", code: "KeyX" }, y: { keyCode: 89, key: "y", code: "KeyY" }, z: { keyCode: 90, key: "z", code: "KeyZ" }, Meta: { keyCode: 91, key: "Meta", code: "MetaLeft", location: 1 }, "*": { keyCode: 106, key: "*", code: "NumpadMultiply", location: 3 }, "+": { keyCode: 107, key: "+", code: "NumpadAdd", location: 3 }, "-": { keyCode: 109, key: "-", code: "NumpadSubtract", location: 3 }, "/": { keyCode: 111, key: "/", code: "NumpadDivide", location: 3 }, ";": { keyCode: 186, key: ";", code: "Semicolon" }, "=": { keyCode: 187, key: "=", code: "Equal" }, ",": { keyCode: 188, key: ",", code: "Comma" }, ".": { keyCode: 190, key: ".", code: "Period" }, "`": { keyCode: 192, key: "`", code: "Backquote" }, "[": { keyCode: 219, key: "[", code: "BracketLeft" }, "\\": { keyCode: 220, key: "\\", code: "Backslash" }, "]": { keyCode: 221, key: "]", code: "BracketRight" }, "'": { keyCode: 222, key: "'", code: "Quote" }, Attn: { keyCode: 246, key: "Attn" }, CrSel: { keyCode: 247, key: "CrSel", code: "Props" }, ExSel: { keyCode: 248, key: "ExSel" }, EraseEof: { keyCode: 249, key: "EraseEof" }, Play: { keyCode: 250, key: "Play" }, ZoomOut: { keyCode: 251, key: "ZoomOut" }, ")": { keyCode: 48, key: ")", code: "Digit0" }, "!": { keyCode: 49, key: "!", code: "Digit1" }, "@": { keyCode: 50, key: "@", code: "Digit2" }, "#": { keyCode: 51, key: "#", code: "Digit3" }, $: { keyCode: 52, key: "$", code: "Digit4" }, "%": { keyCode: 53, key: "%", code: "Digit5" }, "^": { keyCode: 54, key: "^", code: "Digit6" }, "&": { keyCode: 55, key: "&", code: "Digit7" }, "(": { keyCode: 57, key: "(", code: "Digit9" }, A: { keyCode: 65, key: "A", code: "KeyA" }, B: { keyCode: 66, key: "B", code: "KeyB" }, C: { keyCode: 67, key: "C", code: "KeyC" }, D: { keyCode: 68, key: "D", code: "KeyD" }, E: { keyCode: 69, key: "E", code: "KeyE" }, F: { keyCode: 70, key: "F", code: "KeyF" }, G: { keyCode: 71, key: "G", code: "KeyG" }, H: { keyCode: 72, key: "H", code: "KeyH" }, I: { keyCode: 73, key: "I", code: "KeyI" }, J: { keyCode: 74, key: "J", code: "KeyJ" }, K: { keyCode: 75, key: "K", code: "KeyK" }, L: { keyCode: 76, key: "L", code: "KeyL" }, M: { keyCode: 77, key: "M", code: "KeyM" }, N: { keyCode: 78, key: "N", code: "KeyN" }, O: { keyCode: 79, key: "O", code: "KeyO" }, P: { keyCode: 80, key: "P", code: "KeyP" }, Q: { keyCode: 81, key: "Q", code: "KeyQ" }, R: { keyCode: 82, key: "R", code: "KeyR" }, S: { keyCode: 83, key: "S", code: "KeyS" }, T: { keyCode: 84, key: "T", code: "KeyT" }, U: { keyCode: 85, key: "U", code: "KeyU" }, V: { keyCode: 86, key: "V", code: "KeyV" }, W: { keyCode: 87, key: "W", code: "KeyW" }, X: { keyCode: 88, key: "X", code: "KeyX" }, Y: { keyCode: 89, key: "Y", code: "KeyY" }, Z: { keyCode: 90, key: "Z", code: "KeyZ" }, ":": { keyCode: 186, key: ":", code: "Semicolon" }, "<": { keyCode: 188, key: "<", code: "Comma" }, _: { keyCode: 189, key: "_", code: "Minus" }, ">": { keyCode: 190, key: ">", code: "Period" }, "?": { keyCode: 191, key: "?", code: "Slash" }, "~": { keyCode: 192, key: "~", code: "Backquote" }, "{": { keyCode: 219, key: "{", code: "BracketLeft" }, "|": { keyCode: 220, key: "|", code: "Backslash" }, "}": { keyCode: 221, key: "}", code: "BracketRight" }, '"': { keyCode: 222, key: '"', code: "Quote" }, SoftLeft: { key: "SoftLeft", code: "SoftLeft", location: 4 }, SoftRight: { key: "SoftRight", code: "SoftRight", location: 4 }, Camera: { keyCode: 44, key: "Camera", code: "Camera", location: 4 }, Call: { key: "Call", code: "Call", location: 4 }, EndCall: { keyCode: 95, key: "EndCall", code: "EndCall", location: 4 }, VolumeDown: { keyCode: 182, key: "VolumeDown", code: "VolumeDown", location: 4 }, VolumeUp: { keyCode: 183, key: "VolumeUp", code: "VolumeUp", location: 4 } }
var v7 = class {
    #r
    #t = 0
    #a = /* @__PURE__ */ new Set()
    constructor(e6) {
        this.#r = e6
    }
    #e(e6) {
        return e6 === "Alt" ? 1 : e6 === "Control" ? 2 : e6 === "Meta" ? 4 : e6 === "Shift" ? 8 : 0
    }
    #s(e6) {
        let r8 = this.#t & 8,
            a4 = { key: "", keyCode: 0, code: "", text: "", location: 0 },
            s9 = Yr[e6]
        if (!s9) throw new Error(`Unknown key: "${e6}"`)
        return s9.key && (a4.key = s9.key), r8 && s9.shiftKey && (a4.key = s9.shiftKey), s9.keyCode && (a4.keyCode = s9.keyCode), r8 && s9.shiftKeyCode && (a4.keyCode = s9.shiftKeyCode), s9.code && (a4.code = s9.code), s9.location && (a4.location = s9.location), a4.key && a4.key.length === 1 && (a4.text = a4.key), s9.text && (a4.text = s9.text), r8 && s9.shiftText && (a4.text = s9.shiftText), this.#t & -9 && (a4.text = ""), a4
    }
    async down(e6, r8 = {}) {
        let a4 = this.#s(e6),
            s9 = this.#a.has(a4.code || "")
        a4.code && this.#a.add(a4.code), a4.key && (this.#t |= this.#e(a4.key))
        let o8 = r8.text === void 0 ? a4.text : r8.text
        await this.#r.Input.dispatchKeyEvent({ type: o8 ? "keyDown" : "rawKeyDown", modifiers: this.#t, windowsVirtualKeyCode: a4.keyCode, code: a4.code, key: a4.key, text: o8, unmodifiedText: o8, autoRepeat: s9, location: a4.location, isKeypad: a4.location === 3 })
    }
    async up(e6) {
        let r8 = this.#s(e6)
        r8.key && (this.#t &= ~this.#e(r8.key)), r8.code && this.#a.delete(r8.code), await this.#r.Input.dispatchKeyEvent({ type: "keyUp", modifiers: this.#t, windowsVirtualKeyCode: r8.keyCode, key: r8.key, code: r8.code, location: r8.location })
    }
    async sendCharacter(e6) {
        await this.#r.Input.insertText({ text: e6 })
    }
    async press(e6, r8 = {}) {
        let a4 = r8.delay
        await this.down(e6, r8), a4 && (await new Promise((s9) => setTimeout(s9, a4))), await this.up(e6)
    }
    async type(e6, r8 = {}) {
        let a4 = r8.delay
        for (let s9 of e6) {
            let o8 = s9
            o8 in Yr ? await this.press(o8, { delay: a4 }) : (a4 && (await new Promise((n8) => setTimeout(n8, a4))), await this.sendCharacter(s9))
        }
    }
}
var O5 = class {
    #r
    #t
    #a
    constructor(e6, r8, a4) {
        ;(this.#r = e6), (this.#t = r8), (this.#a = a4)
    }
    async click() {
        await T(async () => {
            let e6 = this.#e()
            await o2(e6, this.#a)
        })
    }
    async #e() {
        await this.#r.waitForSelector(this.#t)
        let e6 = await this.#r.$(this.#t)
        if (e6 === null) throw new Error(`Selector "${this.#t}" not found.`)
        await e6.click()
    }
    async fill(e6) {
        await T(async () => {
            let r8 = this.#s(e6)
            await o2(r8, this.#a)
        })
    }
    async #s(e6) {
        await this.#r.waitForSelector(this.#t)
        let r8 = await this.#r.$(this.#t)
        if (r8 === null) throw new Error(`Selector "${this.#t}" not found.`)
        await r8.type(e6)
    }
    async wait() {
        return await this.#r.waitForSelector(this.#t)
    }
    async evaluate(e6) {
        return await T(async () => {
            let r8 = this.#o(e6)
            return await o2(r8, this.#a)
        })
    }
    async #o(e6) {
        await this.#r.waitForSelector(this.#t)
        let r8 = await this.#r.$(this.#t)
        if (r8 === null) throw new Error(`Selector "${this.#t}" not found.`)
        return await r8.evaluate(e6, { args: [r8] })
    }
}
var P5 = class {
    #r
    #t = 0
    #a = 0
    constructor(e6) {
        this.#r = e6
    }
    async click(e6, r8, a4) {
        await this.move(e6, r8)
        let s9 = a4?.count ?? 1
        for (; s9 > 0; ) s9--, await this.down(), await new Promise((o8) => setTimeout(o8, a4?.delay ?? 0)), await this.up()
    }
    async down(e6) {
        await this.#r.Input.dispatchMouseEvent({ type: "mousePressed", x: this.#t, y: this.#a, button: e6?.button ?? "left", clickCount: e6?.clickCount ?? 1 })
    }
    async move(e6, r8, a4) {
        let s9 = this.#t,
            o8 = this.#a,
            n8 = a4?.steps ?? 1,
            i8 = n8
        for (; i8 > 0; ) i8--, (this.#t += (e6 - s9) / n8), (this.#a += (r8 - o8) / n8), await this.#r.Input.dispatchMouseEvent({ type: "mouseMoved", x: this.#t, y: this.#a })
    }
    async reset() {
        ;(this.#t = 0), (this.#a = 0), await this.#r.Input.dispatchMouseEvent({ type: "mouseMoved", x: 0, y: 0 })
    }
    async up(e6) {
        await this.#r.Input.dispatchMouseEvent({ type: "mouseReleased", x: this.#t, y: this.#a, button: e6?.button ?? "left", clickCount: e6?.clickCount ?? 1 })
    }
    async wheel(e6) {
        await this.#r.Input.dispatchMouseEvent({ type: "mouseWheel", x: this.#t, y: this.#a, deltaX: e6?.deltaX ?? 0, deltaY: e6?.deltaY ?? 0 })
    }
}
var E6 = class {
    #r
    constructor(e6) {
        this.#r = e6
    }
    async tap(e6, r8) {
        await this.touchStart(e6, r8), await this.touchEnd()
    }
    async touchEnd() {
        await this.#r.Input.dispatchTouchEvent({ type: "touchEnd", touchPoints: [] })
    }
    async touchMove(e6, r8) {
        await this.#r.Input.dispatchTouchEvent({ type: "touchMove", touchPoints: [{ x: e6, y: r8 }] })
    }
    async touchStart(e6, r8) {
        await this.#r.Input.dispatchTouchEvent({ type: "touchStart", touchPoints: [{ x: e6, y: r8 }] })
    }
}
var ka
var ea = class extends CustomEvent {
    constructor(e6) {
        super("console", { detail: e6 })
    }
}
var ta = class extends CustomEvent {
    constructor(e6) {
        super("dialog", { detail: e6 })
    }
}
var ra = class extends CustomEvent {
    constructor(e6) {
        super("filechooser", { detail: e6 })
    }
}
var aa = class extends CustomEvent {
    constructor(e6) {
        super("pageerror", { detail: e6 })
    }
}
ka = Symbol.asyncDispose
var T6 = class extends EventTarget {
    #r
    #t
    #a
    #e
    timeout = 1e4
    mouse
    keyboard
    touchscreen
    constructor(e6, r8, a4, s9, o8) {
        super(),
            (this.#r = e6),
            (this.#e = r8 ?? "about:blank"),
            (this.#t = new w5(a4)),
            (this.#a = s9),
            this.#t.addEventListener("Page.frameNavigated", (n8) => {
                let { frame: i8 } = n8.detail
                this.#e = i8.urlFragment ?? i8.url
            }),
            this.#t.addEventListener("Page.javascriptDialogOpening", (n8) => {
                this.dispatchEvent(new ta(new S7(this.#t, n8.detail)))
            }),
            this.#t.addEventListener("Page.fileChooserOpened", (n8) => {
                let { frameId: i8, mode: d5, backendNodeId: c7 } = n8.detail
                c7 && this.dispatchEvent(new ra(new D5(this.#t, { frameId: i8, mode: d5, backendNodeId: c7 })))
            }),
            this.#t.addEventListener("Runtime.consoleAPICalled", (n8) => {
                let { type: i8, args: d5 } = n8.detail,
                    c7 = ""
                for (let l6 of d5) {
                    if ((c7 !== "" && (c7 += " "), l6.type === "bigint")) {
                        c7 += l6.unserializableValue
                        continue
                    } else if (l6.type === "undefined") {
                        c7 += "undefined"
                        continue
                    } else if (l6.type === "object" && l6.subtype === "null") {
                        c7 += "null"
                        continue
                    }
                    c7 += l6.value
                }
                this.dispatchEvent(new ea({ type: i8, text: c7 }))
            }),
            this.#t.addEventListener("Runtime.exceptionThrown", (n8) => {
                let { exceptionDetails: i8 } = n8.detail
                this.dispatchEvent(new aa(new Error(i8.exception?.description ?? "Unknown error")))
            }),
            o8?.sandbox &&
                this.#t.addEventListener("Fetch.requestPaused", async (n8) => {
                    let { requestId: i8 } = n8.detail
                    return (await this.#s(n8.detail)) ? this.#t.Fetch.continueRequest({ requestId: i8 }) : this.#t.Fetch.failRequest({ requestId: i8, errorReason: "AccessDenied" })
                }),
            (this.mouse = new P5(this.#t)),
            (this.keyboard = new v7(this.#t)),
            (this.touchscreen = new E6(this.#t))
    }
    [ka]() {
        return this.close()
    }
    async #s({ request: e6 }) {
        let { protocol: r8, host: a4, href: s9 } = new URL(e6.url)
        if (a4) {
            let { state: o8 } = await Deno.permissions.request({ name: "net", host: a4 })
            return o8 === "granted"
        }
        if (r8 === "file:") {
            let o8 = F(s9),
                { state: n8 } = await Deno.permissions.request({ name: "read", path: o8 })
            return n8 === "granted"
        }
        return true
    }
    async #o() {
        let e6 = await u5(
            (async () => {
                for (;;) {
                    let r8 = await this.#t.DOM.getDocument({ depth: 0 })
                    if (r8) return r8
                }
            })(),
            this.timeout
        )
        return new b7(e6.root.nodeId, this.#t, this)
    }
    async setUserAgent(e6) {
        await this.#t.Emulation.setUserAgentOverride({ userAgent: e6 })
    }
    addEventListener(e6, r8, a4) {
        super.addEventListener(e6, r8, a4)
    }
    unsafelyGetCelestialBindings() {
        return this.#t
    }
    authenticate({ username: e6, password: r8 }) {
        function a4(o8) {
            let n8 = new TextEncoder().encode(o8)
            return btoa(String.fromCharCode(...n8))
        }
        let s9 = a4(`${e6}:${r8}`)
        return this.#t.Network.setExtraHTTPHeaders({ headers: { Authorization: `Basic ${s9}` } })
    }
    async $(e6) {
        return (await this.#o()).$(e6)
    }
    async $$(e6) {
        let r8 = await this.#o()
        return u5(r8.$$(e6), this.timeout)
    }
    locator(e6) {
        return new O5(this, e6, this.timeout)
    }
    async bringToFront() {
        await u5(this.#t.Page.bringToFront(), this.timeout)
    }
    browser() {
        return this.#a
    }
    async close() {
        let e6,
            r8 = ""
        if (this.#a.isRemoteConnection) await this.#t.close(), (e6 = this.#a.pages.includes(this))
        else {
            let a4 = new URL(this.#t.ws.url)
            ;(r8 = await (await fetch(`http://${a4.host}/json/close/${this.#r}`)).text()), (e6 = r8 === "Target is closing")
        }
        if (e6) {
            let a4 = this.#a.pages.indexOf(this)
            a4 > -1 && this.#a.pages.splice(a4, 1)
            return
        }
        throw (await this.#t.close(), new Error(`Page has already been closed or doesn't exist (${r8})`))
    }
    async content() {
        return await this.evaluate(`"<!DOCTYPE " + document.doctype.name + (document.doctype.publicId ? ' PUBLIC "' + document.doctype.publicId + '"' : '') + (!document.doctype.publicId && document.doctype.systemId ? ' SYSTEM' : '') + (document.doctype.systemId ? ' "' + document.doctype.systemId + '"' : '') + '>\\n' + document.documentElement.outerHTML`)
    }
    async setContent(e6) {
        await this.evaluate(
            (r8) => {
                let { document: a4 } = globalThis
                a4.open(), a4.write(r8), a4.close()
            },
            { args: [e6] }
        )
    }
    async emulateMediaFeatures(e6) {
        for (let r8 of e6)
            if (r8.name === "prefers-color-scheme") {
                if (r8.value !== "dark" && r8.value !== "light") throw new Error(`Unsupported value "${r8.value}" for media feature "prefers-color-scheme"`)
            } else if (r8.name === "prefers-reduced-motion") {
                if (r8.value !== "no-preference" && r8.value !== "reduce") throw new Error(`Unsupported value "${r8.value}" for media feature "prefers-reduced-motion"`)
            } else throw new Error(`Unsupported media feature "${r8.name}"`)
        await this.#t.Emulation.setEmulatedMedia({ features: e6 })
    }
    async setViewportSize(e6) {
        await this.#t.Emulation.setDeviceMetricsOverride({ ...e6, deviceScaleFactor: 0, mobile: false })
    }
    async cookies(...e6) {
        return (await u5(this.#t.Network.getCookies({ urls: e6.length ? e6 : void 0 }), this.timeout)).cookies
    }
    async setCookies(e6) {
        await u5(this.#t.Network.setCookies({ cookies: e6 }), this.timeout)
    }
    async deleteCookies(e6) {
        await u5(this.#t.Network.deleteCookies(e6), this.timeout)
    }
    async emulateCPUThrottling(e6) {
        await u5(this.#t.Emulation.setCPUThrottlingRate({ rate: e6 }), this.timeout)
    }
    async evaluate(e6, r8) {
        if (typeof e6 == "function") {
            let o8 = r8?.args ?? []
            e6 = `(${e6.toString()})(${o8.map((n8) => `${JSON.stringify(n8)}`).join(",")})`
        }
        let { result: a4, exceptionDetails: s9 } = await u5(this.#t.Runtime.evaluate({ expression: e6, awaitPromise: true, returnByValue: true }), this.timeout)
        if (s9) throw s9
        return a4.type === "bigint" ? BigInt(a4.unserializableValue.slice(0, -1)) : a4.type === "undefined" ? void 0 : a4.type === "object" && a4.subtype === "null" ? null : a4.value
    }
    async goBack(e6) {
        await this.#n(-1, e6)
    }
    async goForward(e6) {
        await this.#n(1, e6)
    }
    async #n(e6, r8) {
        let a4 = await u5(this.#t.Page.getNavigationHistory(), this.timeout),
            s9 = a4.entries[a4.currentIndex + e6]
        if (!s9) throw new Error("Tried to navigate to history entry that does not exist.")
        return (await Promise.all([this.waitForNavigation(r8), this.#t.Page.navigateToHistoryEntry({ entryId: s9.id })]))[0]
    }
    async goto(e6, r8) {
        ;(r8 = r8 ?? {}), await Promise.all([this.waitForNavigation(r8), u5(this.#t.Page.navigate({ url: e6, ...r8 }), this.timeout)])
    }
    async pdf(e6) {
        e6 = e6 ?? {}
        let { data: r8 } = await u5(this.#t.Page.printToPDF({ ...e6, transferMode: "ReturnAsBase64" }), this.timeout)
        return Jr(r8)
    }
    async reload(e6) {
        await Promise.all([this.waitForNavigation(e6), u5(this.#t.Page.reload({}), this.timeout)])
    }
    async screenshot(e6) {
        e6 = e6 ?? {}
        let { data: r8 } = await u5(this.#t.Page.captureScreenshot(e6), this.timeout)
        return Jr(r8)
    }
    get url() {
        return this.#e
    }
    waitForEvent(e6) {
        return new Promise((r8) => {
            this.addEventListener(e6, (a4) => r8(a4.detail), { once: true })
        })
    }
    async waitForFunction(e6, r8) {
        await o2(
            (async () => {
                for (;;) {
                    let a4 = await this.evaluate(e6, r8)
                    if (a4) return a4
                }
            })(),
            this.timeout
        )
    }
    async waitForNavigation(e6) {
        if (((e6 = e6 ?? { waitUntil: "networkidle2" }), e6.waitUntil !== "none"))
            return (
                e6.waitUntil !== "load" && (await this.waitForNavigation({ waitUntil: "load" })),
                u5(
                    new Promise((r8, reject) => {
                        e6?.waitUntil === "load"
                            ? this.#t.addEventListener("Page.loadEventFired", () => r8(), { once: true })
                            : e6?.waitUntil === "networkidle0"
                            ? this.waitForNetworkIdle({ idleTime: 500 }).then(() => {
                                  r8()
                              }).catch(reject)
                            : this.waitForNetworkIdle({ idleTime: 500, idleConnections: 2 }).then(() => {
                                  r8()
                              }).catch(reject)
                    }),
                    this.timeout
                )
            )
    }
    waitForNetworkIdle(e6) {
        let r8 = e6?.idleTime ?? 500,
            a4 = e6?.idleConnections ?? 0
        return u5(
            new Promise((s9) => {
                let o8 = () => {
                        this.#t.removeEventListener("Network.requestWillBeSent", d5), this.#t.removeEventListener("Network.loadingFailed", c7), this.#t.removeEventListener("Network.loadingFinished", c7), s9()
                    },
                    n8 = setTimeout(o8, r8),
                    i8 = 0,
                    d5 = () => {
                        i8++, i8 > a4 && clearTimeout(n8)
                    },
                    c7 = () => {
                        i8 !== 0 && (i8--, i8 === a4 && (n8 = setTimeout(o8, r8)))
                    }
                this.#t.addEventListener("Network.requestWillBeSent", d5), this.#t.addEventListener("Network.loadingFailed", c7), this.#t.addEventListener("Network.loadingFinished", c7)
            }),
            this.timeout
        )
    }
    async waitForSelector(e6, r8) {
        return (await this.#o()).waitForSelector(e6, r8)
    }
    async waitForTimeout(e6) {
        await new Promise((r8) => setTimeout(r8, e6))
    }
}
var Ca
async function sa(t10, { retries: e6 = 60 } = {}) {
    let r8 = t10.spawn(),
        a4 = null,
        s9 = new TextDecoder(),
        o8 = [],
        n8 = true
    for await (let i8 of r8.stderr) {
        let d5 = s9.decode(i8)
        if ((o8.push(d5), (a4 = d5.trim().match(wa)?.[1]), a4)) {
            n8 = false
            break
        }
        if (d5.includes("SingletonLock")) {
            let c7 = d5.split("Failed to create ")[1].split(":")[0]
            r8.kill(), await r8.status
            try {
                Deno.removeSync(c7)
            } catch (l6) {
                if (!(l6 instanceof Deno.errors.NotFound)) throw l6
            }
            return sa(t10)
        }
    }
    if (n8) {
        let { code: i8 } = await r8.status
        if ((o8.push(`Process exited with code ${i8}`), Deno.build.os === "windows" && i8 === 21 && e6 > 0)) return sa(t10, { retries: e6 - 1 })
        throw (
            (console.error(
                o8.join(`
`)
            ),
            o8.join("").includes("error while loading shared libraries")
                ? new Error(`Your binary refused to boot due to missing system dependencies. This can happen if you are using a minimal Docker image. If you're running in a Debian-based container, the following code could work:

RUN apt-get update && apt-get install -y wget gnupg && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && apt-get update && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends && rm -rf /var/lib/apt/lists/*

Look at puppeteer docs for more information: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker`)
                : new Error("Your binary refused to boot"))
        )
    }
    if (!a4) throw new Error("Somehow did not get a websocket endpoint")
    return { process: r8, endpoint: a4 }
}
Ca = Symbol.asyncDispose
var F7 = class {
    #r
    #t
    #a
    pages = []
    constructor(e6, r8, a4) {
        ;(this.#t = new w5(e6)), (this.#a = r8), (this.#r = a4)
    }
    [Ca]() {
        return this.isRemoteConnection ? this.disconnect() : this.close()
    }
    get isRemoteConnection() {
        return !this.#a
    }
    unsafelyGetCelestialBindings() {
        return this.#t
    }
    async disconnect() {
        await this.#t.close()
    }
    async close() {
        await this.#t.Browser.close(), await this.#t.close()
        let e6 = this.#a
        if (!e6) await Promise.allSettled(this.pages.map((r8) => r8.close()))
        else
            try {
                e6.kill(), await o2(e6.status, 10 * 1e3)
            } catch {
                e6.kill("SIGKILL"), await e6.status
            }
    }
    async newPage(e6, r8) {
        let { targetId: a4 } = await this.#t.Target.createTarget({ url: "" }),
            s9 = new URL(this.#t.ws.url),
            o8 = `${s9.origin}/devtools/page/${a4}${s9.search}`,
            n8 = new WebSocket(o8)
        await f3(n8)
        let { waitUntil: i8, sandbox: d5 } = r8 ?? {},
            c7 = new T6(a4, e6, n8, this, { sandbox: d5 })
        this.pages.push(c7)
        let l6 = c7.unsafelyGetCelestialBindings(),
            { userAgent: p6 } = await l6.Browser.getVersion(),
            y5 = r8?.userAgent || this.#r.userAgent || p6.replaceAll("Headless", "")
        return await Promise.all([l6.Emulation.setUserAgentOverride({ userAgent: y5 }), l6.Page.enable(), l6.Runtime.enable(), l6.Network.enable({}), l6.Page.setInterceptFileChooserDialog({ enabled: true }), d5 ? l6.Fetch.enable({}) : null]), e6 && (await c7.goto(e6, { waitUntil: i8 })), c7
    }
    async userAgent() {
        let { userAgent: e6 } = await this.#t.Browser.getVersion()
        return e6
    }
    async version() {
        let { product: e6, revision: r8 } = await this.#t.Browser.getVersion()
        return `${e6}/${r8}`
    }
    wsEndpoint() {
        return this.#t.ws.url
    }
    get closed() {
        return this.#t.ws.readyState === WebSocket.CLOSED
    }
}
async function Bs(t10) {
    let { wsEndpoint: e6, product: r8 = "chrome" } = t10,
        a4 = { product: r8 },
        s9 = new WebSocket(e6)
    return await f3(s9), new F7(s9, null, a4)
}
async function Ks(t10) {
    let e6 = t10?.headless ?? true,
        r8 = t10?.product ?? "chrome",
        a4 = t10?.args ?? [],
        s9 = t10?.cache,
        o8 = t10?.path,
        n8 = { headless: e6, product: r8 }
    if ((o8 || (o8 = await Xr(r8, { cache: s9 })), !a4.find((g7) => g7.startsWith("--user-data-dir=")))) {
        let g7 = Deno.makeTempDirSync()
        a4.push(`--user-data-dir=${g7}`)
    }
    let i8 = ["--remote-debugging-port=0", "--no-first-run", "--password-store=basic", "--use-mock-keychain", ...(r8 === "chrome" ? ["--disable-blink-features=AutomationControlled"] : []), ...(e6 ? [r8 === "chrome" ? "--headless=new" : "--headless", "--hide-scrollbars"] : []), ...a4]
    k7 && console.log(`Launching: ${o8} ${i8.join(" ")}`)
    let d5 = new Deno.Command(o8, { args: i8, stderr: "piped" }),
        { process: c7, endpoint: l6 } = await sa(d5),
        p6 = await T(async () => await (await fetch(`http://${l6}/json/version`)).json())
    if (p6["Protocol-Version"] !== ua) throw new Error("Differing protocol versions between binary and bindings.")
    let y5 = new WebSocket(p6.webSocketDebuggerUrl)
    return await f3(y5), new F7(y5, c7, n8)
}
export { F7 as Browser, ea as ConsoleEvent, S7 as Dialog, ta as DialogEvent, b7 as ElementHandle, D5 as FileChooser, ra as FileChooserEvent, v7 as Keyboard, P5 as Mouse, T6 as Page, aa as PageErrorEvent, da as SUPPORTED_VERSIONS, E6 as Touchscreen, wa as WEBSOCKET_ENDPOINT_REGEX, Za as cleanCache, Bs as connect, Jr as convertToUint8Array, Xr as getBinary, C9 as getDefaultCachePath, Ks as launch, u5 as retryDeadline, f3 as websocketReady }
/*! Bundled license information:

@jsr/astral__astral/src/keyboard/layout.js:
  (**
   * @license
   * Copyright 2017 Google Inc.
   * SPDX-License-Identifier: Apache-2.0
   *)
*/
