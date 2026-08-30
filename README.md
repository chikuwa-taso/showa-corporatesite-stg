# 昭和美術印刷 コーポレートLP

Astro（静的出力 / TypeScript）+ 素のCSS で構築した1枚もののLP。
仕様は `design_handoff_showa_lp/README.md` に準拠。

## 開発

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的出力
npm run preview
npm run check    # 型チェック
```

出力は完全な静的ファイルなので Vercel / Netlify / Cloudflare Pages のいずれでもホストできる。
クライアントJSはページ全体で約1.7KB（インライン）。

## 構成

```
src/
  styles/tokens/    デザインシステムのトークン（colors/typography/spacing/effects は verbatim）
  styles/tokens/lp.css  このLP固有のトークン（バンド高さ・duration・アイコンサイズ等）
  data/site.ts      ナビ・拠点・サービス・WORKSタイル・調整フラグ
  components/       SiteHeader / SectionRail / BackgroundVideo / WorkTile / ServiceIcon / LocationRow
  sections/         TOP / ABOUT / WORKS / SERVICE / NETWORK / CONTACT
  scripts/          scroll-spy.ts（IntersectionObserver）/ background-video.ts
```

色・間隔・duration・easing はすべて `src/styles/tokens/` に集約。
セクション固有のスタイルは各 `.astro` の `<style>` にスコープされる。

## 調整用フラグ

`src/data/site.ts` の `CONFIG` で一括変更できる。個別に上書きしたい場合は各セクションのpropsで渡す。

| フラグ | 既定 | 効果 |
|---|---|---|
| `useVideo` | `true` | `false` で全バンドの動画をフラットなグラデーションに差し替え |
| `showMap` | `true` | NETWORK の日本地図線画 |
| `serviceLabels` | `false` | SERVICE ピクトグラムのキャプション |
| `iconSize` | `150` | ピクトグラムの幅（100–220）。`--icon-size` を上書き |

バンド高さ・マーキー速度・ヘッダー高さなどは `src/styles/tokens/lp.css` の変数を触る。

## アセット

`public/assets/` はハンドオフのオリジナルを最適化したもの（37MB → 約5MB）。
再生成するには元バンドルを指定して実行する。

```sh
./scripts/optimize-assets.sh /path/to/design_handoff_showa_lp
```

必要なツール: `ffmpeg`, `cwebp`（`brew install ffmpeg webp`）, `sips`（macOS標準）。

- 動画は MP4(H.264) + WebM + 1フレーム目の `poster`、音声トラックは削除
- 画面外の動画は IntersectionObserver で一時停止し、未表示のものは読み込まない
- `prefers-reduced-motion: reduce` で動画と WORKS マーキーの両方を停止
- 画像は WebP + 元形式のフォールバック。幅はレイアウトの実表示サイズの2倍

## 未確定・要クライアント確認

- **実績写真** — WORKS の6タイルのうち本物の写真は1枚のみ。残りはデザインシステムのグラデーション/動画のプレースホルダー。差し替え時は `WORK_TILES`（`src/data/site.ts`）を編集する。1.503:1 と 1:1 の交互リズムは維持すること。また現行の写真はカンプからの切り出しなので、高解像度の原本が欲しい。
- **RECRUIT / 採用情報・お問い合わせのリンク先** — 専用セクションがないため現在はすべて `#contact`。
- **MAPリンク** — 住所から生成した Google Maps 検索URL。各拠点の正式なMap URLがあれば `mapHref()` を差し替える。
- **Adobe Fonts のドメイン登録** — ヘッダーナビの Adapter Mono PE Variable はキットがドメイン制限つき。本番ドメインを Adobe の Web プロジェクトに追加しないと、警告なくシステム等幅フォントにフォールバックする。
- **モバイルレイアウト** — 未設計のため、ブランドの構成ルール（レール非表示、ハンバーガー等のアイコンを使わない、角丸0、影なし）に沿って実装した。768px以下でレールを隠し、SERVICE の3+2とNETWORKの2カラムを縦積みにし、ナビは横スクロールする1行にしている。要デザイナー確認。
- **ABOUT の縦書きステートメント（モバイル）** — client提供の横長画像（2.687:1）をそのまま縮小しているため、狭い画面では文字が小さい。画像なので再組版はできない。モバイル用アートボードをクライアントから受け取るのが本筋。
