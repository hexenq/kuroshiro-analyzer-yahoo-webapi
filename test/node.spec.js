/**
 * @jest-environment node
 */

import Analyzer from "../src";

describe("kuroshiro-analyzer-yahoo-webapi Node Test", () => {
    const EXAMPLE_TEXT = "すもももももも";
    const APPID = "DUMMY_PLEASE_USE_YOUR_OWN_APPID";

    let analyzer;

    it("Initialization", async (done) => {
        analyzer = new Analyzer({
            appId: APPID
        });
        await analyzer.init();
        done();
    });

    it("Repeated Initialization", async (done) => {
        analyzer = new Analyzer({
            appId: APPID
        });
        try {
            await analyzer.init();
            await analyzer.init();
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });

    it("Parse Sentence", async (done) => {
        analyzer = new Analyzer({
            appId: APPID
        });
        await analyzer.init();

        const ori = EXAMPLE_TEXT;
        analyzer.parse(ori)
            .then((result) => {
                // console.debug(result);
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(4);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("Parse Null", async (done) => {
        analyzer = new Analyzer({
            appId: APPID
        });
        await analyzer.init();

        analyzer.parse()
            .then((result) => {
                // console.debug(result);
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(0);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });
});
