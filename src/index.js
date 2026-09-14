import request from "./request.js";

/** Yahoo morphological analysis adapter (JSON-RPC V2). */
class Analyzer {
    constructor({ appId, timeout } = {}) {
        this._analyzer = null;
        this._appId = appId;
        this._timeout = timeout || 5000;
    }

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

    parse(str = "") {
        return Promise.resolve().then(() => {
            if (typeof str !== "string") throw new TypeError("Input must be a string.");
            if (str === "") return [];
            if (typeof this._appId !== "string" || !this._appId.trim()) {
                throw new Error("A Yahoo application ID is required.");
            }
            return request(this._appId, str, this._timeout).then((response) => {
                if (response && response.error) {
                    const error = new Error(response.error.message || "Yahoo API error");
                    error.code = response.error.code;
                    throw error;
                }
                const tokens = response && response.result && response.result.tokens;
                if (!Array.isArray(tokens)) throw new Error("Invalid Yahoo API response.");
                return tokens.map((token) => {
                    if (!Array.isArray(token) || [0, 1, 3].some(index => typeof token[index] !== "string")) {
                        throw new Error("Invalid Yahoo API token.");
                    }
                    return { surface_form: token[0], pos: token[3], reading: token[1] };
                });
            });
        });
    }
}

export default Analyzer;
