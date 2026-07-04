import { copyFile, mkdir, rm, writeFile } from "node:fs/promises";

const files = ["index.html", "app.js", "styles.css"];

await rm("dist", { recursive: true, force: true });
await rm(".vercel/output", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await mkdir(".vercel/output/static", { recursive: true });

await Promise.all(files.flatMap((file) => [
  copyFile(file, `dist/${file}`),
  copyFile(file, `.vercel/output/static/${file}`)
]));
await writeFile(".vercel/output/config.json", JSON.stringify({ version: 3 }, null, 2));

console.log(`Built ${files.length} static files into dist/ and .vercel/output/`);
