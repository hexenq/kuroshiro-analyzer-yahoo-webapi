import https from "https";

export default function request(appId, text, timeout) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            id: "kuroshiro",
            jsonrpc: "2.0",
            method: "jlp.maservice.parse",
            params: { q: text }
        });
        let timer;
        let finished = false;
        const finish = (error, result) => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            if (error) reject(error);
            else resolve(result);
        };
        const req = https.request({
            hostname: "jlp.yahooapis.jp",
            path: "/jsonrpc",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(body),
                "User-Agent": `Yahoo AppID: ${appId}`
            }
        }, (response) => {
            const chunks = [];
            response.on("data", chunk => chunks.push(chunk));
            response.on("error", error => finish(error));
            response.on("aborted", () => finish(new Error("Yahoo API response was aborted.")));
            response.on("end", () => {
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    const error = new Error(`Yahoo API HTTP error: ${response.statusCode}`);
                    error.statusCode = response.statusCode;
                    finish(error);
                    return;
                }
                try {
                    finish(null, JSON.parse(Buffer.concat(chunks).toString("utf8")));
                }
                catch (_error) {
                    finish(new Error("Invalid JSON from Yahoo API."));
                }
            });
        });
        req.on("error", error => finish(error));
        timer = setTimeout(() => {
            const error = new Error("Yahoo API request timed out.");
            error.code = "ETIMEDOUT";
            finish(error);
            req.abort();
        }, timeout);
        req.end(body);
    });
}
