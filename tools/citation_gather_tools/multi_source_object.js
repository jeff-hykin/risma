export function MultiSourceObject(sources) {
    const originalThing = { $accordingTo: sources }
    const proxyObject = new Proxy(originalThing, {
        // Object.keys
        ownKeys(original, ...args) {
            return [
                ...new Set([...Object.values(originalThing?.$accordingTo).map(each=>Reflect.ownKeys(each)).flat(1)])
            ]
        },
        // Object.keys only does what you think it will if getOwnPropertyDescriptor says the key is enumerable and configurable
        getOwnPropertyDescriptor(original, prop) {
            return {
                enumerable: true,
                configurable: true
            }
        },
        get(original, key, ...args) {
            if (key == "$accordingTo") {
                return originalThing.$accordingTo
            }
            if (typeof key != "string") {
                return originalThing[key]
            }
            for (const [source, value] of Object.entries(originalThing?.$accordingTo||{})) {
                if (Reflect.has(value, key)) {
                    return Reflect.get(value, key, ...args)
                }
            }
            return Object.getPrototypeOf(proxyObject)[key]
        },
        set(original, key, ...args) {
            if (key == "$accordingTo" || typeof key != "string") {
                return Reflect.set(original, key, ...args)
            } else {
                throw Error(`setting key ${key} is not allowed, set the value of .$accordingTo[something].${key} instead`)
            }
        },
        has: Reflect.has,
        deleteProperty: Reflect.deleteProperty,
        isExtensible: Reflect.isExtensible,
        preventExtensions: Reflect.preventExtensions,
        setPrototypeOf: Reflect.setPrototypeOf,
        defineProperty: Reflect.defineProperty,
        getPrototypeOf: Reflect.getPrototypeOf,
    })
    return proxyObject
}