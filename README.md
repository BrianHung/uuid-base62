## uuid-base62

This is a library for converting between formatted uuid and its base62 representation, which is URL-safe.
In contrast to other libraries, we do not depend on `buffer` (which requires polyfill outside node.js) or 
on `BigInt` (which is currently not supported by Safari). To extend the library past base62, define
the character set to a desired base N. Any base from 1 to N is then valid for `convertBase`.

### Usage

```bash
npm install --save @brianhung/uuid-base62
```

```js
import { v4 as uuidv4 } from "uuid";
import { uuidEncodeBase62, uuidDecodeBase62 } from "uuid-base62";

var uuid = uuidv4();
var base62 = uuidEncodeBase62(uuid);
console.log(uuid, uuidDecodeBase62(base62))
```