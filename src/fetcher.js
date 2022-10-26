import { parseIfAvailable } from "./utils"

export async function fetchData(fetcher, fetcherConfig = {}, routeConfig = {}, initialData) {
    // We merge data from config (fixed params) and initialData (passed on final function call)
    const mergedData = {
        ...routeConfig.data,
        ...initialData
    }

    // Call the request data parser (routeConfig) if present
    const data = await parseIfAvailable(routeConfig.parseRequestData, mergedData, mergedData, routeConfig, fetcherConfig)

    // Create main configuration with default values.
    // These values can be permanently changed with beforeRequest function
    const requestConfig = {
        method: routeConfig.method || 'GET',
        url: await parseIfAvailable(routeConfig.url, null, data, routeConfig, fetcherConfig),
        data,
        ...routeConfig.config
    }

    // Allow the complete configuration override by route and then by generic conf
    let conf = await parseIfAvailable(routeConfig.parseRequestConfig, requestConfig, requestConfig, routeConfig, data, fetcherConfig)
    conf = await parseIfAvailable(fetcherConfig.beforeRequest, conf, conf)

    let response

    try {
        response = await fetcher(conf)
    } catch (e) {
        if (routeConfig.onError) {
            response = await parseIfAvailable(routeConfig.onError, null, e, conf, fetcherConfig)
        } else if (fetcherConfig.onError) {
            response = await parseIfAvailable(fetcherConfig.onError, null, e, conf, fetcherConfig)
        } else {
            throw e
        }
    }

    // Allow complete response override by generic conf and then by route
    response = await parseIfAvailable(fetcherConfig.afterResponse, response, response, conf)
    response = await parseIfAvailable(routeConfig.parseResponseData, response, response, conf)
    
    return response
}