# GGPT-1.1 — Generative Grandpa Pattern Talker

最小構成の静的チャットアプリ。爺口調のテンプレート + ユーザー発話のビグラム学習で雑談っぽさを出します。

## Preview
- https://ggpt.pages.dev/

## Features
- ログイン不要・サーバ不要（静的配布）
- localStorage に会話ログと学習状態を保存
- 古いログの自動忘却（maxMessages / maxChars）
- 爺口調テンプレ + 低確率の揺らぎ
- ユーザー発話のみ学習（bigram）
- 返答にランダム遅延
- NGワードは聞き損じ系の返しに切り替え
- 広告枠（PR表記）

## Run locally
ブラウザで `index.html` を開くだけで動きます。

## Deploy (Cloudflare Pages)
- Framework preset: **None / No framework**
- Build command: 空欄
- Build output directory: `/`

## Notes
- 返答品質はテンプレ比率や学習量で変わります。
- 既存の学習データをリセットする場合は右上の歯車からリセット。
- 広告枠は下部に配置。Spotifyの埋め込みは `index.html` 内の iframe を差し替えできます。
