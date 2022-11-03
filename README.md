# api-conf

## Dead simple self-contained rest client

___api-conf___ is a rest client that allows to preconfigure all the fetch routes and use them with only the route itself as dependency.

This way a project can have all the api logic placed in a single location, simplifying maintainability.

## Installation

```
npm i api-conf
```

## Usage

### Let's prepare the library

`api.js`
```javascript
import axios from 'axios'
import createApiSource from 'api-conf'

/**
 * We can use anything we want as fetcher
*/

const apiConf = axios.create({
    baseUrl: 'https://example.com/api/'
})

export default const = createApiSource(apiConf, {
    beforeRequest: req => {...}, // Manage the request before is sent to fetcher (ex. axios)
    afterResponse: (response, config) => {...} // Manage the data response before is sent back to you
})
```

### Then we declare and configure the custom self-contained api routes

`userapi.js`
```javascript
import declareApi from 'api.js'

export const getUserData = declareApi({
    method: 'GET',
    url: id => `user/${id}/account`,
    config: {
        headers: {
            'X-Custom-Route-Header': 'custom-header-data'
        }
    }
})

export const saveUserData = declareApi({
    method: 'POST',
    url: 'user/account',
    data: { // Data param can be added in config phase. This object will be merged with the one passed on request
        userType: 'tester'
    },
    config: { // Custom config attributes will be directly merged to fetcher config, so it supports all the fetcher (ex. axios) params
        headers: {}
    },
    parseRequestData: data => ({...data, isTest: true}),
    parseResponseData: (response, config) => response.data,
    parseRequestConfig: (conf, data) => ({...conf, headers: {}})
})
```

### And then use it with plain functions
We don't need to know where and how the data is being fetched from or saved

`usermanager.js`
```javascript
import {getUserData, saveUserData} from 'userapi'

const userData = await getUserData(1)

const response = await saveUserData({
    name: 'User',
    password: 'password'
})

```

## Documentation

The documentation is created by using `axios` as fetcher

### Instance creation

The `api-conf` instance can be created by calling `createApiSource` with two params:

* `apiConf` - The axios object or the axios pre-configured instance. see [this](https://axios-http.com/docs/req_config) for reference
* `fetcherConfig` - Fetcher main configuration. This object will change the library behavior globally. Available callbacks are:
    * `beforeRequest` - Called immediately before the request, after the single route modifications has been applied
    * `afterResponse` - Last callback after all modifications to the data has been applied by the single route modifi
    * `onError` - Called when an exception is throwed during api call. The single route error has the priority if present. If no error callback is present on both the route and fetcherConfig the default exception is throwed

### Route creation

The single route is created by using the instance created by above function. Available attributes & functions:

* `method` - Method used ['GET', 'POST', ...]
* `url` - Url of the api. Can be a function that will be parsed and will have data and config available
* `data` - POST data that will be merged with data passed from the main function
* `config` - [Configuration object](https://axios-http.com/docs/req_config) that will be directly merged to the object passed to the fetcher. Useful for passing headers, timeouts etc. If method, url and data are present in this object will override the parsed ones
* `parseRequestData` - Called before the request and has the request POST data as parameter. Returned data will be passed to the fetcher
* `parseRequestConfig` - Called after `parseRequestData`, will contain all the config sent to fetcher. Useful for dynamic config/headers management
* `parseResponseData` - When data is returned we can parse it in order to return it in different format
* `onError` - Called when an exception is throwed during api call.

All the callbacks does have the informations about the data and configs that are available at that moment

### Recaller

Sometimes a api call must be redone because of external factors, such as JWT token that has expired or network errors.
The `recall` function allows to redo ana pi call without changing its params

```javascript
export const saveUserData = declareApi({
    method: 'POST',
    url: 'user/account',
    onError: (e, {recall}) => {
        ...
        return recall()
    }
})
```

### Api call usage

After route declaration we can finally perform all our API calls directly, without thinking about urls and request/data parsing. The library will pass the data to url if is a function or to data if is not a GET

```javascript
const response = getUser(10)
```

## Test & build

```
npm i

npm test

npm run build
```
