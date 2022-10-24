import { parseIfAvailable } from "./utils"

export async function fetchData(fetcher, fetcherConfig = {}, routeConfig = {}, initialData) {
    const data = parseIfAvailable(routeConfig.parseRequestData, initialData, initialData, routeConfig, fetcherConfig)

    // Create main configuration with default values.
    // These values can be permanently changed with beforeRequest function
    const requestConfig = {
        method: routeConfig.method || 'GET',
        url: parseIfAvailable(routeConfig.url, null, data, routeConfig, fetcherConfig),
        data,
        ...routeConfig.config
    }

    let conf = parseIfAvailable(routeConfig.parseRequestConfig, requestConfig, requestConfig, routeConfig, data, fetcherConfig)
    conf = parseIfAvailable(fetcherConfig.beforeRequest, conf, conf)

    let response

    try {
        response = await fetcher(conf)
    } catch (e) {
        if (routeConfig.onError) {
            response = parseIfAvailable(routeConfig.onError, null, e, conf, fetcherConfig)
        } else if (fetcherConfig.onError) {
            response = parseIfAvailable(fetcherConfig.onError, null, e, conf, fetcherConfig)
        } else {
            throw e
        }
    }

    response = parseIfAvailable(fetcherConfig.afterResponse, response, response, conf)
    response = parseIfAvailable(routeConfig.parseResponseData, response, response, conf)
    
    return response
}