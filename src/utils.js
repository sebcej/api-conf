export async function parseIfAvailable(param, fallback = null, ...args) {
    if (param && param instanceof Function) {
        return param(...args) || fallback
    } else if (fallback !== null) {
        return fallback
    }

    return param
}

export function isObject(obj) {
    return typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null
}