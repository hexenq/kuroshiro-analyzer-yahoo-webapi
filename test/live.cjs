"use strict";
const assert = require("node:assert/strict");
const Analyzer = require("..");

async function main() {
    assert.ok(process.env.YAHOO_APP_ID, "Set YAHOO_APP_ID to run the live API test");
    const analyzer = new Analyzer({ appId: process.env.YAHOO_APP_ID });
    await analyzer.init();
    const tokens = await analyzer.parse("日本語");
    assert.equal(tokens.map(token => token.surface_form).join(""), "日本語");
    assert.equal(tokens.map(token => token.reading).join(""), "にほんご");
    console.log("Live Yahoo V2 API test passed");
}
main().catch(error => {
    // Do not print request objects or credentials.
    console.error(error.message);
    process.exitCode = 1;
});
