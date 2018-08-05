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
        <td>✓</td>
    </tr>
</table>

## Install
```sh
$ npm install kuroshiro-analyzer-yahoo-webapi
```
*For legacy frontend workflows, you could include `dist/kuroshiro-analyzer-yahoo-webapi.min.js` in your page and the exported name is `YahooWebAnalyzer`. (you may first build it from source with `npm run build` after `npm install`)*

## Usage with kuroshiro
### Configure analyzer
This analyzer utilizes [Yahoo WebAPI of morphological analysis service](https://developer.yahoo.co.jp/webapi/jlp/ma/v1/parse.html). 

Before you start, you should register your application in Yahoo to get a APP ID. Please visit the link above for more information. 

You need to specify your Yahoo application ID when initializing the analyzer.

```js
import YahooWebAnalyzer from "kuroshiro-analyzer-yahoo-webapi";

const analyzer = new YahooWebAnalyzer({
    appId: "YOUR_YAHOO_APP_ID"
});

await kuroshiro.init(analyzer);
```

### Initialization Parameters
- `appId`: Your Yahoo application ID