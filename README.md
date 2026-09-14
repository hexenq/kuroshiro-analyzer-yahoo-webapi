# kuroshiro-analyzer-yahoo-webapi

[![CI](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi/actions/workflows/ci.yml/badge.svg)](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/kuroshiro-analyzer-yahoo-webapi.svg)](http://badge.fury.io/js/kuroshiro-analyzer-yahoo-webapi)

<table>
    <tr>
        <td>Package</td>
        <td colspan=2>kuroshiro-analyzer-yahoo-webapi</td>
    </tr>
    <tr>
        <td>Description</td>
        <td colspan=2>Yahoo WebAPI morphological analyzer for <a href="https://github.com/hexenq/kuroshiro">kuroshiro</a>.</td>
    </tr>
    <tr>
        <td rowspan=2>Compatibility</td>
        <td>Node</td>
        <td>✓ (>=6)</td>
    </tr>
    <tr>
        <td>Browser</td>
        <td>✗</td>
    </tr>
</table>

## Attention
This is a Node-only adapter. The source in this branch uses Yahoo's JSON-RPC V2 morphological analysis API. Earlier XML V1 requests are obsolete; see the [official V2 migration announcement](https://developer.yahoo.co.jp/changelog/2022-07-14-jlp.html). This migration has not yet been published to npm.

## Install
```sh
$ npm install kuroshiro-analyzer-yahoo-webapi
```

## Usage with kuroshiro
### Configure analyzer
This analyzer utilizes [Yahoo's V2 morphological analysis service](https://developer.yahoo.co.jp/webapi/jlp/ma/v2/parse.html).

Before you start, you should register your application in Yahoo to get a APP ID. Please visit the link above for more information. 

You need to specify your Yahoo application ID when initializing the analyzer.

```js
import YahooWebAnalyzer from "kuroshiro-analyzer-yahoo-webapi";

const analyzer = new YahooWebAnalyzer({
    appId: "YOUR_YAHOO_APP_ID",
});

await kuroshiro.init(analyzer);
```

### Initialization Parameters
- `appId`: Your Yahoo application ID
- `timeout`: *Optional* Request timeout in millisecond

CommonJS is also supported: `const YahooWebAnalyzer = require("kuroshiro-analyzer-yahoo-webapi")`.

`init()` configures the adapter locally. Non-empty parsing requires a valid application ID and sends text to Yahoo; empty input resolves to `[]` without a request. Keep application IDs in server-side configuration. The public token fields remain `surface_form`, `pos` and `reading`; readings use the service's returned strings.

The transport uses Node's built-in HTTPS module. Request failures reject with an Error; HTTP failures expose `statusCode`, JSON-RPC failures expose the service error `code`, and timeouts use `code: "ETIMEDOUT"`. Axios-specific error fields are no longer available. Non-string input rejects with TypeError.

## Development

Use Node.js 22.13+ on the 22.x line or Node.js 24+ for development. This requirement applies to tooling; the runtime build still targets Node.js 6. Keep `.babelrc`, edit source files and leave package version updates to release preparation.

```sh
npm ci
npm test
npm pack --dry-run
```

`npm test` exercises the request transport against a local HTTP fixture service and checks package exports. The tests redirect the HTTPS destination locally and need no Yahoo credentials; they do not verify Yahoo's live service or TLS handshake. CI runs these checks on Node.js 22 and 24. Use `npm install` or `npm uninstall` for intentional dependency changes and include the lockfile. Write English Conventional Commits.

For live verification, build the package and set `YAHOO_APP_ID` in your local environment, then run `npm run test:live`. This sends the fixed sample `日本語` to Yahoo. The command fails if the ID is absent or the service request fails. Do not commit credentials or expose them to pull-request workflows. Actual legacy-runtime network compatibility also needs verification before release.

## Notice
This analyzer might not give optimized converted result when converting kanji to romaji with kuroshiro since Yahoo Web API lacks information of pronunciation in analysis result.
