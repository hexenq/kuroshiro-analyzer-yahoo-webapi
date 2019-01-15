/**
 * @jest-environment node
 */

import Kuroshiro from "kuroshiro";
import Analyzer from "../src";

describe("kuroshiro-analyzer-yahoo-webapi Node Test", () => {
    const EXAMPLE_TEXT = "すもももももも";

    let analyzer;

    it("Initialization", async (done) => {
        analyzer = new Analyzer({
            appId: process.env.YAHOO_APP_ID
        });
        await analyzer.init();
        done();
    });

    it("Repeated Initialization", async (done) => {
        analyzer = new Analyzer({
            appId: process.env.YAHOO_APP_ID
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
            appId: process.env.YAHOO_APP_ID
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
            appId: process.env.YAHOO_APP_ID
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

describe("kuroshiro-analyzer-yahoo-webapi Node Integration Test", () => {
    const EXAMPLE_TEXT = "可愛い";
    const EXAMPLE_TEXT2 = "2000年";

    let kuroshiro;

    beforeAll(async () => {
        kuroshiro = new Kuroshiro();
        await kuroshiro.init(new Analyzer({
            appId: process.env.YAHOO_APP_ID
        }));
    });

    it("Kanji to Hiragana(1)", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("かわいい");
    });
    it("Kanji to Hiragana(2)", async () => {
        const ori = EXAMPLE_TEXT2;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("2000ねん");
    });
    it("Kanji to Hiragana with furigana(1)", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "furigana", to: "hiragana" });
        expect(result).toEqual("<ruby>可愛<rp>(</rp><rt>かわい</rt><rp>)</rp></ruby>い");
    });
    it("Kanji to Hiragana with furigana(2)", async () => {
        const ori = EXAMPLE_TEXT2;
        const result = await kuroshiro.convert(ori, { mode: "furigana", to: "hiragana" });
        expect(result).toEqual("2000<ruby>年<rp>(</rp><rt>ねん</rt><rp>)</rp></ruby>");
    });
});
