import { parseIfAvailable } from "./utils"

export async function fetchData(fetcher, fetcherConfig, routeConfig, initialData) {
    const data = await parseIfAvailable(routeConfig.parseRequestData, initialData, initialData, routeConfig, fetcherConfig)

    // Create main configuration with default values.
    // These values can be permanently changed with beforeRequest function
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