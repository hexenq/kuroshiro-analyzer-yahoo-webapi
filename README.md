# kuroshiro-analyzer-yahoo-webapi

## Maintenance status

**Maintenance is paused. The API migration is incomplete, and this analyzer is not recommended for new projects.**

The implementation on the default branch and the published npm package use the legacy API. A migration to Yahoo's V2 API is in progress in [draft PR #9](https://github.com/hexenq/kuroshiro-analyzer-yahoo-webapi/pull/9), but it has not been released or validated against the live service. Passing offline tests does not establish live API compatibility. See [Yahoo's V2 migration announcement](https://developer.yahoo.co.jp/changelog/2022-07-14-jlp.html).

Progress is blocked by account access: the maintainer currently cannot access the existing Yahoo! JAPAN account, and the new-account registration flow requires a Japanese phone number that the maintainer does not have available.

Before this analyzer can be recommended again, a valid application ID must be available and both live API verification and integration testing with the maintained kuroshiro core must pass. There is no release date at present. Do not post application IDs, passwords or other credentials in issues or pull requests.

The installation and usage instructions below describe the legacy release; they are retained for reference, not as confirmation that the current service works. For new projects, consider [kuroshiro-analyzer-kuromoji](https://github.com/hexenq/kuroshiro-analyzer-kuromoji).

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
This plugin is Node.js-only following the retirement of Yahoo YQL. Updating to the current npm release does not complete the pending API migration; see the maintenance status above.

## Install
```sh
$ npm install kuroshiro-analyzer-yahoo-webapi
```

## Usage with kuroshiro
### Configure analyzer
This analyzer utilizes [Yahoo WebAPI of morphological analysis service](https://developer.yahoo.co.jp/webapi/jlp/ma/v1/parse.html). 

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

## Notice
This analyzer might not give optimized converted result when converting kanji to romaji with kuroshiro since Yahoo Web API lacks information of pronunciation in analysis result.
