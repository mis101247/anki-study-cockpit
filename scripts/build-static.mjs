import { copyFile, mkdir, rm } from "node:fs/promises";

const files = ["index.html", "app.js", "styles.css"];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

await Promise.all(files.map((file) => copyFile(file, `dist/${file}`)));

console.log(`Built ${files.length} static files into dist/`);
