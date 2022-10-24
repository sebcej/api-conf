# api-conf

## Dead simple self-contained preconfigurator for fetch libraries

___api-conf___ is a wrapper library that allows to preconfigure all the fetch routes and use them with only the route itself as dependency.

This way a project can have all the api logic placed in a single location, simplifying mantenibility.

## Example

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
    config:{
        headers: {}
    },
    parseRequestData: data => ({...data, isTest: true}),
    parseResponseData: (response, config) => response.data,
    parseRequestConfig: (conf, data) => ({...conf, headers: {}})
})
```

### And then use it with plain functions
We don't need to know where and how the data is being fetched or saved

`usermanager.js`
```javascript
import {getUserData, saveUserData} from 'userapi'

const userData = await getUserData(1)

const response = await saveUserData({
    name: 'User',
    password: 'password'
})

```

## Build

```
npm i
npm run build
```