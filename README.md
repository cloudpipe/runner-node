## Usage

Pass a base64-decoded (i.e. regular UTF-8 string), serialized by [sdk-node](https://github.com/cloudpipe/sdk-node) via STDIN to the runner:

```bash
$ echo '{"f":"_$$ND_FUNC$$_function (x, y, callback) {\n    callback(null, x + y);\n}","options":{},"args":{"0":2,"1":4,"2":"_$$ND_FUNC$$_function (err, result) {\n  // err == null\n  // result == 6\n}"}}' | node bin/runner.js --result-path /tmp/.result
```

## TODO
See `TODO`s in `bin/runner.js`.
