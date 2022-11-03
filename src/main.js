import {fetchData} from "./fetcher"

// Wrapper for global configurator
export default function (fetcher, fetcherConfig) {
    // Wrapper for single route configuration
    return function (routeConfig) {
        // Wrapper for route call
        return function (data) {
            return fetchData(fetcher, fetcherConfig, routeConfig, data)
        }
    }
}