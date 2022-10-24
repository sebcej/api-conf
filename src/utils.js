export async function parseIfAvailable(param, fallback = null, ...args) {
    if (param && param instanceof Function) {
        return param(...args)
    } else if (fallback !== null) {
        return fallback
    }

    return param
}