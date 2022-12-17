import { parseIfAvailable } from "./utils"

export async function fetchData(fetcher, fetcherConfig = {}, routeConfig = {}, initialData) {
    const recall = () => fetchData(fetcher, fetcherConfig, routeConfig, initialData);
    const callMiddleware = fetcherConfig.middleware ? fetcherConfig.middleware : async (fetcher, conf) => fetcher(conf) 

    // We merge data from config (fixed params) and initialData (passed on final function call)
    const mergedData = {
        ...routeConfig.data,
        ...initialData
    }

    // Call the request data parser (routeConfig) if present
    const data = await parseIfAvailable(routeConfig.parseRequestData, mergedData, mergedData, {routeConfig, fetcherConfig})
    const allReqInfo = {routeConfig, data, fetcherConfig, recall}

    // Create main configuration with default values.
    // These values can be permanently changed with beforeRequest function
    const requestConfig = {
        method: routeConfig.method || 'GET',
        url: await parseIfAvailable(routeConfig.url, null, mergedData, allReqInfo),
        data,
        ...routeConfig.config
    }

    allReqInfo.requestConfig = requestConfig

    // Allow the complete configuration override by route and then by generic conf
    let conf = await parseIfAvailable(routeConfig.parseRequestConfig, requestConfig, requestConfig, allReqInfo)
    conf = await parseIfAvailable(fetcherConfig.beforeRequest, conf, conf, allReqInfo)

    let response

    try {
        response = await callMiddleware(fetcher, conf)
    } catch (e) {
        if (routeConfig.onError) {
            return parseIfAvailable(routeConfig.onError, null, e, conf, allReqInfo)
        } else if (fetcherConfig.onError) {
            return parseIfAvailable(fetcherConfig.onError, null, e, conf, allReqInfo)
        } else {
            throw e
        }
    }

    // Allow complete response override by generic conf and then by route
    response = await parseIfAvailable(fetcherConfig.afterResponse, response, response, allReqInfo)
    response = await parseIfAvailable(routeConfig.parseResponseData, response, response, allReqInfo)
    
    return response
}