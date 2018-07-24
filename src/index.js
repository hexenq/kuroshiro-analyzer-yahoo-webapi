import jsonp from "jsonp-client";
import querystring from "querystring";

const YQL_URL = "http://query.yahooapis.com/v1/public/yql";
const API_URL = "http://jlp.yahooapis.jp/MAService/V1/parse";

function addCallback(url) {
    // The URL already has a callback
    if (url.match(/callback=[a-z]/i)) {
        return url;
    }
    return url + (`&callback=cb${Math.random()}`).replace(".", "");
}

/**
 * Yahoo WebAPI Analyzer
 */
class Analyzer {
    /**
     * Constructor
     * @param {string} [appId] Your Yahoo application ID.
     */
    constructor({ appId } = {}) {
        this._analyzer = null;
        this._appId = appId;
    }

    /**
     * Initialize the analyzer
     * @returns {Promise} Promise object represents the result of initialization
     */
    init() {
        return new Promise((resolve, reject) => {
            if (this._analyzer == null) {
                this._analyzer = "yahoo";
                resolve();
            }
            else {
                reject(new Error("This analyzer has already been initialized."));
            }
        });
    }

    /**
     * Parse the given string
     * @param {*} str input string
     * @returns {Promise} Promise object represents the result of parsing
     */
    parse(str = "") {
        const self = this;
        return new Promise((resolve, reject) => {
            const apiParamJson = {
                appid: self._appId,
                sentence: str,
                results: "ma"
            };
            const yqlQuery = `SELECT * FROM xml WHERE url = '${API_URL}?${querystring.stringify(apiParamJson)}'`;
            const queryJson = {
                q: yqlQuery,
                format: "json"
            };
            jsonp(
                addCallback(`${YQL_URL}?${querystring.stringify(queryJson)}`),
                (err, res) => {
                    if (err) return reject(err);
                    const result = [];
                    const resObj = res.query.results;
                    if (resObj.ResultSet.ma_result.total_count === "0") return resolve(result);
                    if (resObj.ResultSet.ma_result.total_count === "1") {
                        result.push({
                            surface_form: resObj.ResultSet.ma_result.word_list.word.surface,
                            pos: resObj.ResultSet.ma_result.word_list.word.pos,
                            reading: resObj.ResultSet.ma_result.word_list.word.reading
                        });
                    }
                    else {
                        for (let i = 0; i < resObj.ResultSet.ma_result.word_list.word.length; i++) {
                            result.push({
                                surface_form: resObj.ResultSet.ma_result.word_list.word[i].surface,
                                pos: resObj.ResultSet.ma_result.word_list.word[i].pos,
                                reading: resObj.ResultSet.ma_result.word_list.word[i].reading
                            });
                        }
                    }
                    resolve(result);
                }
            );
        });
    }
}

export default Analyzer;
