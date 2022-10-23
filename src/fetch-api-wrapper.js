
async function parseIfAvailable(param, fallback = null, ...args) {
    if (param && param instanceof Function) {
        return param(...args)
    } else if (fallback !== null) {
        return fallback
    }

    return param
}

async function fetchData(fetcher, fetcherConfig, routeConfig, initialData) {
    const data = await parseIfAvailable(routeConfig.parseRequestData, initialData, initialData, routeConfig, fetcherConfig)

    const requestConfig = {
        method: routeConfig.method,
        url: parseIfAvailable(routeConfig.url, null, data, routeConfig, fetcherConfig),
        ...routeConfig.config
    }

    let conf = await parseIfAvailable(routeConfig.parseRequestConfig, requestConfig, requestConfig, routeConfig, data, fetcherConfig)
    conf = await parseIfAvailable(fetcherConfig.beforeRequest, conf, conf)

    let response = await fetcher(conf)

    response = await parseIfAvailable(fetcherConfig.afterResponse, response, response, conf)
    response = await parseIfAvailable(routeConfig.parseResponseData, response, response, conf)
    
    return response
}

export default function (fetcher, fetcherConfig) {
    return function (routeConfig) {
        return function (data) {
            return fetchData(fetcher, fetcherConfig, routeConfig, data)
        }
    }
}