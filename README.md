# GGPT-2.1 — Generative Grandpa Pattern Talker

> **Archived generation / 保存版**  
> GGPT-2.1 は、LLMを使わず「そこにいる感じ」をどこまで作れるか試した、極小の静的チャットアプリです。現在はこの世代を大きく改修せず、当時の実装と挙動を残しています。
>
> 後継版 **GGPT-3**: https://github.com/yo4e/ggpt-3  
> GGPT-3 Live: https://yo4e.github.io/ggpt-3/

## Live archive

https://ggpt.pages.dev/

GGPT-2.1 の公開版は Cloudflare Pages 上に保存しています。

## What is GGPT?

爺口調のテンプレート、ユーザー発話から学習する単語ビグラム、小さな和室の world model を組み合わせた、サーバ不要・API不要・ログイン不要のブラウザ内チャットです。

目標は知識量や推論能力ではなく、**間・相槌・揺らぎ・誤り・忘却・生活感によって「誰かがそこにいる」ように感じられるか**を試すことでした。

特に後期の設計では、会話生成とは独立して進む「小さな和室」を導入しています。雨、窓、湯呑、布団、眠気などの状態が先に存在し、その状態が独り言や返答へ影響します。

## Features

- 静的ファイルのみで動作
- サーバ / API / アカウント不要
- `localStorage` に会話ログ・学習状態・world state を保存
- 古い会話ログの自動忘却
- 爺口調テンプレート + 確率的な揺らぎ
- ユーザー発話のみを単語ビグラムで学習
- ランダムな返答遅延と入力中表示
- 聞き損じ・誤タイプなどの意図的な不完全さ
- 会話と独立して進む小さな和室の world model
- world state に由来する独り言と生活感

## Design documents

- [`GGPT.md`](./GGPT.md) — 初期の会話・記憶・ビグラム生成設計
- [`WORLD DESIGN.md`](./WORLD%20DESIGN.md) — 「返答装置」から「そこに居る存在」へ寄せるための小さな世界モデル
- [`TODO.md`](./TODO.md) — 当時の検討・作業メモ

これらは GGPT-2.1 当時の設計資料として残しています。

## GGPT-3

GGPT-2.1 の思想を残しつつ、実装上の粗さを整理した後継世代です。

**Repository:** https://github.com/yo4e/ggpt-3  
**Live:** https://yo4e.github.io/ggpt-3/

GGPT-3 では、LLMなし・サーバなし・ブラウザだけで動くコンパクトさを維持しながら、world / memory / language / agent を分離し、日本語トークナイズ、可変長 Markov、有限記憶、実時間で進む世界などを再設計しています。

## Run locally

`index.html` をブラウザで開くだけで動作します。ビルド工程はありません。

## Deploy

GGPT-2.1 の保存版は Cloudflare Pages で公開されています。

- Framework preset: **None / No framework**
- Build command: なし
- Build output directory: `/`

## Project status

GGPT-2.1 は保存世代です。重大な不具合修正などを除き、新しい実験は GGPT-3 側で行います。

## License

MIT License. See [`LICENSE`](./LICENSE).
