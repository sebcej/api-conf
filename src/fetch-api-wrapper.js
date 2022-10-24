import {fetchData} from "./fetcher"

export default function (fetcher, fetcherConfig) {
    return function (routeConfig) {
        return function (data) {
            return fetchData(fetcher, fetcherConfig, routeConfig, data)
        }
    }
}