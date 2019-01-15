# kuroshiro-analyzer-yahoo-webapi

[![Build Status](https://travis-ci.com/hexenq/kuroshiro-analyzer-yahoo-webapi.svg?branch=master)](https://travis-ci.org/hexenq/kuroshiro-analyzer-yahoo-webapi)
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
This plugin will no longer be compatible with browser since Yahoo YQL service was retired at Jan 3, 2019. Please update to the latest version of kuroshiro-analyzer-yahoo-webapi.

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