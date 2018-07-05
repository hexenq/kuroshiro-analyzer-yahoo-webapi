import axios from "axios";
import querystring from "querystring";
import xmlParser from "fast-xml-parser";

const API_URL = "https://jlp.yahooapis.jp/MAService/V1/parse";

/**
 * Yahoo WebAPI Analyzer
 */
class Analyzer {
    /**
     * Constructor
     * @param {string} [appId] Your Yahoo application ID.
     * @param {Number} [timeout] Request timeout in millisecond.
     */
    constructor({ appId, timeout } = {}) {
        this._analyzer = null;
        this._appId = appId;
        this._timeout = timeout || 5000;
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
            const paramJson = {
                appid: self._appId,
                sentence: str,
                results: "ma"
            };
            axios({
                method: "post",
                url: API_URL,
                data: querystring.stringify(paramJson),
                timeout: self._timeout
            })
                .then((res) => {
                    const result = [];
                    const resObj = xmlParser.parse(res.data, {
                        trimValues: false // in case of the whitespace character
                    });
                    if (resObj.ResultSet.ma_result.total_count === 0) return resolve(result);
                    if (resObj.ResultSet.ma_result.total_count === 1) {
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
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default Analyzer;
