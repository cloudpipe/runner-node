## Usage

Pass a base64-decoded (i.e. regular UTF-8 string), serialized by [sdk-node](https://github.com/cloudpipe/sdk-node) via STDIN to the runner:

```bash
$ echo '{"f":"_$$ND_FUNC$$_function (x, y, callback) {\n    callback(null, x + y);\n}","options":{},"args":{"0":2,"1":4,"2":"_$$ND_FUNC$$_function (err, result) {\n  // err == null\n  // result == 6\n}"}}' | node bin/runner.js --result-path /tmp/.result
```

## Testing

1. Use the [`cloudpipe` module](https://github.com/cloudpipe/sdk-node) to generate a base64-encoded payload string:

    `index.js`:

    ```javascript
    var cloudpipe = require('cloudpipe');
    
    var pipe = cloudpipe.init({
      url: 'http://192.168.59.103:8000/v1',
      username: 'admin',
      apiKey: '12345'
    });
    
    var add = function(x, y, callback) {
      callback(null, x + y);
      return 17;
    };
    
    var cloudAdd = pipe.create(add);
    cloudAdd(2, 4, function(err, result) {
      // err == null
      // result == 6
      console.log(result);
    });
    ```
    
    ```bash
    $ node index.js | python -mjson.tool | grep stdin | awk -F\" '{print $4}'
    eyJmIjoiXyQkTkRfRlVOQyQkX2Z1bmN0aW9uICh4LCB5LCBjYWxsYmFjaykge1xuICBjYWxsYmFjayhudWxsLCB4ICsgeSk7XG4gIHJldHVybiAxNztcbn0iLCJvcHRpb25zIjp7fSwiYXJncyI6eyIwIjoyLCIxIjo0LCIyIjoiXyQkTkRfRlVOQyQkX2Z1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAvLyBlcnIgPT0gbnVsbFxuICAvLyByZXN1bHQgPT0gNlxuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xufSJ9fQ==
    ```

2. Base-64 decode the string output in the previous step.

    *Note: this requires the `base64` program, available as part of the `coreutils` package.*

    ```bash
    $ payload=$(echo 'eyJmIjoiXyQkTkRfRlVOQyQkX2Z1bmN0aW9uICh4LCB5LCBjYWxsYmFjaykge1xuICBjYWxsYmFjayhudWxsLCB4ICsgeSk7XG4gIHJldHVybiAxNztcbn0iLCJvcHRpb25zIjp7fSwiYXJncyI6eyIwIjoyLCIxIjo0LCIyIjoiXyQkTkRfRlVOQyQkX2Z1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAvLyBlcnIgPT0gbnVsbFxuICAvLyByZXN1bHQgPT0gNlxuICBjb25zb2xlLmxvZyhyZXN1bHQpO1xufSJ9fQ==' | base64 --decode)
    ```

3. Pipe the payload over STDIN to the runner.

    ```bash
    $ echo $payload | ./bin/runner.js --result-file /tmp/.result
    ```

4. Confirm that `6` was output on STDOUT and `/tmp/.result` contains `17`.
