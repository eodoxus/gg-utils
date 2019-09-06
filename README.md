# GG Utils
A collection of handy little utilities that I personally use frequently. Stuff like file system utils, REST API interaction etc.

>*Note*: I prefer `yarn` to `npm`, so will use it in this documenation

## Installation
```
yarn global add lerna
git clone https://github.com/eodoxus/gg-utils
lerna install
cd restclient
yarn link
```

## Modules
| Package | Purpose |
| ------ | ------- |
| file-utils | A set of handy file system utilities for reading and parsing files |
| rest-utils | A REST client and handy ApiObject class, useful for simple REST API interaction |

## file-utils

## rest-utils

### RestClient
A super simple REST client that uses fetch for http requests. Has common REST methods for CRUD

| Method | Purpose |
| ------ | ------- |
| post | create or insert new data |
| get | read data |
| put | update data |
| delete | delete data |

**Example**

``` javascript
import {
    RestClient
} from "restclient";
const client = new RestClient();
let data = await client.get( `${this.$url}/${this.id}` );
console.log(data);
```

## ApiObject

Additionally, there is a handy `ApiObject` class that follows something like the `ActiveRecord` pattern where the object contains both raw data representing a single record from an API endpoint, and methods to act on the data.

| Method | Purpose |
| ------ | ------- |
| load | Fetch object data from remote API |
| save | Do a PUT or POST of object data back to server, depending on if object has a unique id set already |
| delete | Send a delete request to the API with the object's unique id |
| toJson | Return object as a JSON string |
| toPojo | Return object as a plain old Javascript object |

**Example**

``` javascript
import {
    ApiObject
} from "restclient"
ApiObject.setBasUrl("http://myapi.com");
const person = new ApiObject("people");
person.name = "Jason";
// Does a POST request, then updates object with the response data
person.save();
// Does a GET request, then updates object data with response data
person.load(person.id);
person.name = "Jason again";
// Does a PUT request since object has an id set at this point
person.save();
// Sends a DELETE request to API endpoint
person.delete();
```

