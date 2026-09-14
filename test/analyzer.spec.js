import http from "node:http";
import https from "node:https";
import Analyzer from "../src/index.js";

describe("Yahoo JSON-RPC adapter over local HTTP", () => {
    let server;
    let redirect;
    let handler;
    let requests;
    const sockets = new Set();
    const token = ["日本語", "にほんご", "日本語", "名詞", "普通名詞", "*", "*"];

    beforeAll(async () => {
        server = http.createServer((req, res) => {
            const chunks = [];
            req.on("data", chunk => chunks.push(chunk));
            req.on("end", () => {
                requests.push({ method: req.method, url: req.url, headers: req.headers, body: Buffer.concat(chunks).toString("utf8") });
                handler(req, res);
            });
        });
        server.on("connection", socket => {
            sockets.add(socket);
            socket.on("close", () => sockets.delete(socket));
        });
        await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
        // Exercise the real HTTP request/response code with a local fake service.
        // Only the HTTPS destination is replaced; no external requests are made.
        redirect = jest.spyOn(https, "request").mockImplementation((options, callback) => {
            expect(options.hostname).toBe("jlp.yahooapis.jp");
            return http.request({ ...options, hostname: "127.0.0.1", port: server.address().port }, callback);
        });
    });

    beforeEach(() => {
        requests = [];
        redirect.mockClear();
        handler = (_req, res) => res.end(JSON.stringify({ jsonrpc: "2.0", id: "kuroshiro", result: { tokens: [token] } }));
    });

    afterAll(async () => {
        redirect.mockRestore();
        for (const socket of sockets) socket.destroy();
        await new Promise(resolve => server.close(resolve));
    });

    it("sends JSON-RPC and authenticates through the documented header", async () => {
        const analyzer = new Analyzer({ appId: "test-app" });
        await analyzer.init();
        expect(await analyzer.parse("日本語 & 😀")).toEqual([{ surface_form: "日本語", pos: "名詞", reading: "にほんご" }]);
        expect(requests[0]).toMatchObject({ method: "POST", url: "/jsonrpc", headers: { "user-agent": "Yahoo AppID: test-app", "content-type": "application/json" } });
        expect(JSON.parse(requests[0].body)).toEqual({ id: "kuroshiro", jsonrpc: "2.0", method: "jlp.maservice.parse", params: { q: "日本語 & 😀" } });
        expect(Number(requests[0].headers["content-length"])).toBe(Buffer.byteLength(requests[0].body));
    });

    it("preserves string values, whitespace and token order", async () => {
        handler = (_req, res) => res.end(JSON.stringify({ result: { tokens: [["001", "001", "001", "名詞"], [" ", " ", " ", "特殊"], token] } }));
        expect(await new Analyzer({ appId: "test-app" }).parse("001 日本語")).toEqual([
            { surface_form: "001", reading: "001", pos: "名詞" },
            { surface_form: " ", reading: " ", pos: "特殊" },
            { surface_form: "日本語", reading: "にほんご", pos: "名詞" }
        ]);
    });

    it.each([undefined, ""])("returns [] without a request for %p", async input => {
        await expect(new Analyzer().parse(input)).resolves.toEqual([]);
        expect(redirect).not.toHaveBeenCalled();
    });

    it("accepts an empty token array", async () => {
        handler = (_req, res) => res.end(JSON.stringify({ result: { tokens: [] } }));
        await expect(new Analyzer({ appId: "test-app" }).parse(" ")).resolves.toEqual([]);
    });

    it("rejects repeat initialization", async () => {
        const analyzer = new Analyzer();
        await analyzer.init();
        await expect(analyzer.init()).rejects.toThrow("already been initialized");
    });

    it("rejects missing application ID before sending text", async () => {
        await expect(new Analyzer().parse("日本語")).rejects.toThrow("application ID");
        expect(redirect).not.toHaveBeenCalled();
    });

    it("rejects non-string input asynchronously", async () => {
        await expect(new Analyzer().parse(null)).rejects.toBeInstanceOf(TypeError);
    });

    it("rejects JSON-RPC errors returned with HTTP 200", async () => {
        handler = (_req, res) => res.end(JSON.stringify({ error: { code: -32600, message: "Invalid request" } }));
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toMatchObject({ message: "Invalid request", code: -32600 });
    });

    it.each([401, 429, 500])("rejects HTTP %i", async status => {
        handler = (_req, res) => { res.writeHead(status); res.end("error"); };
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toMatchObject({ statusCode: status });
    });

    it("rejects invalid JSON", async () => {
        handler = (_req, res) => res.end("not JSON");
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toThrow("Invalid JSON");
    });

    it.each([{ result: {} }, { result: { tokens: [null] } }])("rejects malformed token data: %j", async body => {
        handler = (_req, res) => res.end(JSON.stringify(body));
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toThrow("Invalid Yahoo API");
    });

    it("rejects connection failures", async () => {
        handler = (req, _res) => req.socket.destroy();
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toMatchObject({ code: "ECONNRESET" });
    });

    it("times out stalled responses", async () => {
        handler = () => {};
        await expect(new Analyzer({ appId: "test-app", timeout: 50 }).parse("日本語")).rejects.toMatchObject({ code: "ETIMEDOUT" });
    });

    it("decodes Unicode split across response chunks", async () => {
        handler = (_req, res) => {
            const bytes = Buffer.from(JSON.stringify({ result: { tokens: [token] } }));
            const split = bytes.indexOf(Buffer.from("日")) + 1;
            res.write(bytes.slice(0, split));
            setImmediate(() => res.end(bytes.slice(split)));
        };
        expect((await new Analyzer({ appId: "test-app" }).parse("日本語"))[0].surface_form).toBe("日本語");
    });

    it("rejects responses interrupted after headers", async () => {
        handler = (_req, res) => {
            res.writeHead(200, { "Content-Length": 1000 });
            res.write("{");
            setImmediate(() => res.destroy());
        };
        await expect(new Analyzer({ appId: "test-app" }).parse("日本語")).rejects.toThrow();
    });
});
