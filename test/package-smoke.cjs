"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const acorn = require("acorn");

async function main() {
    const root = path.resolve(__dirname, "..");
    const Legacy = require(path.join(root, "lib/index.js"));
    assert.equal(typeof Legacy, "function");
    assert.equal(Legacy.default, Legacy);
    const Analyzer = require(root);
    assert.equal(Analyzer, Legacy);
    for (const file of ["index.js", "lib/index.js"]) {
        assert.equal((await import(pathToFileURL(path.join(root, file)))).default, Analyzer);
    }
    for (const file of ["index.js", "lib/index.js", "lib/request.js"]) {
        acorn.parse(fs.readFileSync(path.join(root, file), "utf8"), { ecmaVersion: 2015 });
    }
    const analyzer = new Analyzer();
    await analyzer.init();
    assert.deepEqual(await analyzer.parse(), []);
    await assert.rejects(analyzer.init(), /already been initialized/);
    console.log("CommonJS, legacy entry, native ESM and ES2015 package checks passed");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
