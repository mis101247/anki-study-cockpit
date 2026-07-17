# Anki 學習夥伴

本機學習網站，透過 AnkiConnect 讀取 Anki 牌組與卡片；Anki 沒開時會使用示範資料。介面包含卡片複習、顯示答案、Again/Hard/Good/Easy 評分、筆記、標籤、CSV/TXT 匯入與瀏覽器發音。

## 使用

```bash
npm run dev
```

然後打開：

```text
http://localhost:4182
```

## Vercel 靜態部署

這個專案可以只部署成 Vercel 靜態網站。Vercel 會執行：

```bash
npm run build
```

並部署 `dist/` 目錄。`dist/` 只包含：

```text
index.html
app.js
styles.css
```

`server.mjs` 只是本機 proxy 用，不會被放進 Vercel 靜態輸出。

部署後第一次打開網站，右側 `設定` 分頁會要求填 `Anki API URL`。如果你用 ngrok 公開 AnkiConnect，就填 ngrok 給你的 `https://...` 網址。

## 部署網站 + ngrok 公開 AnkiConnect

網站可以部署到外部主機，然後用 ngrok 公開本機 AnkiConnect：

```bash
ngrok http 8765
```

ngrok 會給一個 `https://...ngrok...` 網址。到部署好的網站右側 `設定` 分頁，把 `Anki API URL` 填成那個 ngrok 網址。

如果 AnkiConnect 設了 `apiKey`，也把同一組 key 填進網站的 `API Key` 欄位。網站會把它放在 AnkiConnect request body 的 `key` 欄位。

建議 AnkiConnect config 至少要這樣設定：

```json
{
  "apiKey": "換成一組長隨機字串",
  "apiLogPath": null,
  "ignoreOriginList": [],
  "webBindAddress": "127.0.0.1",
  "webBindPort": 8765,
  "webCorsOriginList": [
    "https://你的部署網域"
  ]
}
```

注意事項：

- 不建議用 `"apiKey": null` 公開到 ngrok；拿到 URL 的人可能操作你的 Anki。
- `webCorsOriginList` 要填網站部署後的 origin，例如 `https://your-site.example`，不是 ngrok URL。
- 部署網站若是 `https://`，Anki API URL 也要用 ngrok 的 `https://`，不要用 `http://`。
- Mac 上的 Anki 桌面版和 AnkiConnect 必須保持開啟。
- Mac 不能睡眠，ngrok 要持續執行。

## 本機 proxy + ngrok 公開網站

如果要用 ngrok 把網站開到外網，請使用內建 proxy server，不要直接把 AnkiConnect 的 `8765` port 暴露出去。

```bash
BASIC_AUTH=anki:你的密碼 npm run dev:remote
```

接著開另一個終端機：

```bash
ngrok http 4182
```

ngrok 會給一個 `https://...ngrok...` 網址。手機打開那個網址後，瀏覽器會先要求輸入帳號密碼：

```text
帳號：anki
密碼：你的密碼
```

這個模式下，網站會透過同網域的 `/anki` 轉發到你 Mac 上的：

```text
http://127.0.0.1:8765
```

注意事項：

- Mac 上的 Anki 桌面版和 AnkiConnect 必須保持開啟。
- Mac 不能睡眠，ngrok 和 `npm run dev:remote` 都要持續執行。
- 不要執行 `ngrok http 8765`，那會把 AnkiConnect 直接公開到外網。
- 如果 `4182` 已經被佔用，可以改用 `PORT=4192 BASIC_AUTH=anki:你的密碼 npm run dev:remote`，再執行 `ngrok http 4192`。

## AnkiConnect

1. 在 Anki 選 `Tools > Add-ons > Get Add-ons`。
2. 貼上 AnkiConnect add-on code：`2055492159`。
3. 安裝後重新啟動 Anki，並保持 Anki 桌面版開啟。
4. 在 `Tools > Add-ons` 選 AnkiConnect，按 `Config`，確認允許本站 origin。

網站會呼叫：

```text
http://127.0.0.1:8765
```

## AI 教練

右側 `AI 教練` 分頁可以針對目前卡片產生單字講解、例句、發音提示、記憶鉤子與小練習。

到連線設定填入 `AI API URL`，可以使用同網域 proxy：

```text
https://你的-cli-proxy-api.example
```

Vercel 靜態部署不會自動提供 `/api/cli-proxy`。如果你另外部署了同網域 API route，才需要填 `/api/cli-proxy`。網站會送出 OpenAI-compatible `messages` payload；如果 proxy 不支援，會退回 `{ "prompt": "..." }` 的簡單格式。

本機開發建議 config：

```json
{
  "apiKey": null,
  "apiLogPath": null,
  "ignoreOriginList": [],
  "webBindAddress": "127.0.0.1",
  "webBindPort": 8765,
  "webCorsOriginList": [
    "http://localhost",
    "http://localhost:4182",
    "http://127.0.0.1:4182"
  ]
}
```

這個 `apiKey: null` 範例只適合 `localhost` 本機開發。只要透過 ngrok、Vercel 或任何外部網址使用 AnkiConnect，就應該設定 `apiKey`，並把部署網站的 origin 加到 `webCorsOriginList`。

## 匯入格式

CSV / TXT 每行一張卡：

```text
正面,背面,音標或發音提示,例句
```

也支援 tab 分隔與 `正面 - 背面`。

## Cloze 顯示

Anki cloze 牌組會優先讀 `Text` / `文字` 欄位，並依目前卡片序號處理：

```text
{{c1::aan}} -> [...]
{{c1::aan::介系詞}} -> [介系詞]
```

答案面會展開完整文字，`Extra` / `背面額外內容` 會放在例句/補充區。
