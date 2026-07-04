import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 4182);
const ANKI_TARGET = process.env.ANKI_TARGET || "http://127.0.0.1:8765";
const BASIC_AUTH = process.env.BASIC_AUTH || "";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    if (!isAuthorized(request)) {
      response.writeHead(401, { "WWW-Authenticate": 'Basic realm="Anki Study"' });
      response.end("Authentication required");
      return;
    }

    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    if (url.pathname === "/anki") {
      await proxyAnki(request, response);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
});

server.listen(PORT, HOST, () => {
  const authMessage = BASIC_AUTH ? "basic auth enabled" : "no basic auth";
  console.log(`Anki study server running at http://${HOST}:${PORT} (${authMessage})`);
});

function isAuthorized(request) {
  if (!BASIC_AUTH) return true;
  const expected = `Basic ${Buffer.from(BASIC_AUTH).toString("base64")}`;
  return request.headers.authorization === expected;
}

async function proxyAnki(request, response) {
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method !== "POST") {
    response.writeHead(405, { "Allow": "POST", "Content-Type": "text/plain; charset=utf-8" });
    response.end("Anki proxy only accepts POST");
    return;
  }

  const body = await readRequestBody(request);
  const ankiResponse = await fetch(ANKI_TARGET, {
    method: "POST",
    headers: { "Content-Type": request.headers["content-type"] || "application/json" },
    body
  });

  response.writeHead(ankiResponse.status, {
    "Content-Type": ankiResponse.headers.get("content-type") || "application/json; charset=utf-8"
  });
  response.end(Buffer.from(await ankiResponse.arrayBuffer()));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

async function serveStatic(pathname, response) {
  const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const filePath = path.resolve(ROOT, `.${safePath}`);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  const fileStat = await stat(filePath).catch(() => null);
  if (!fileStat?.isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
  });
  response.end(await readFile(filePath));
}
