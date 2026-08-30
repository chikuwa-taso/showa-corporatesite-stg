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
クライアントJSはページ全体で約2.5KB（インライン）。

## 構成

```
src/
  styles/tokens/    デザインシステムのトークン（colors/typography/spacing/effects は verbatim）
  styles/tokens/lp.css  このLP固有のトークン（バンド高さ・duration・アイコンサイズ等）
  data/site.ts      ナビ・拠点・サービス・WORKSタイル・調整フラグ
  components/       SiteHeader / SectionRail / BackgroundVideo / WorkTile / ServiceIcon
                    ServiceModal / LocationRow / LinkButton / ContactActions / SpecTable
  sections/         TOP / ABOUT / WORKS / SERVICE / NETWORK / CONTACT
  scripts/          scroll-spy.ts（IntersectionObserver）/ background-video.ts
                    service-modal.ts（SERVICEポップアップ）
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
| `iconSize` | `300` | ピクトグラムの幅の上限。`--icon-size-base` を上書き |

バンド高さ・マーキー速度・ヘッダー高さなどは `src/styles/tokens/lp.css` の変数を触る。

`iconSize` は上限値で、実際の描画サイズは SERVICE 側で算出する。3列並びの1行目が
レールの内側に収まらない幅ではアイコンが縮み、横スクロールは発生しない
（1366px以上で300px、1280pxで291px、900pxで164px）。768px以下では
`--icon-mobile-scale`（0.72）を掛けた値になる（300px → 216px）。

## SERVICE のポップアップ

各ピクトグラムはボタンで、クリックすると対応する `<dialog>` が開く。
ネイティブの `<dialog>` なので Esc・フォーカストラップ・背面の inert 化・
フォーカスの復帰はブラウザ任せ。`service-modal.ts` が足すのは開くクリック、
スクロールロック、スクリムのクリックで閉じる処理、写真の先読みだけ。

- ヘッダーの下端から始まり `::backdrop` は透明。ヘッダーだけが鮮明に残る
- スクリムは `--popup-scrim`（白 94%）。背面のピクトグラムが約6%で透ける
  ＝カンプの「うっすら見える」状態。セクション側のレールは重複するので開いている間だけ隠す
- スクロールロックは `open` 属性を MutationObserver で見て同期する。`close`
  イベント頼みだと取りこぼした時にページが二度とスクロールできなくなる
- 版面の比率は `--popup-*` トークン（`lp.css`）に集約。カンプの実寸を
  7681px幅で割った値なので、どの横幅でも構図が保たれる

文言は `SERVICE_ROWS` の `titleLines` / `body`。`titleLines` は縦組みの列で、
先頭が一番右の列になる（例：`['オフリン', '印刷']`）。

## アセット

`public/assets/` はハンドオフのオリジナルを最適化したもの。
再生成するには元バンドルを指定して実行する。第2引数は
POPUP素材フォルダ（`昭和美術印刷LP素材_印刷アイコンからのPOPUP表示`）。

```sh
./scripts/optimize-assets.sh /path/to/design_handoff_showa_lp [/path/to/popup-material]
```

このバンドルに無いもの（`mail-circle` と WORKS 写真は別便の素材）はスキップされる。

必要なツール: `ffmpeg`, `cwebp`（`brew install ffmpeg webp`）, `sips`（macOS標準）。

- 動画は MP4(H.264) + WebM + 1フレーム目の `poster`、音声トラックは削除
- 画面外の動画は IntersectionObserver で一時停止し、未表示のものは読み込まない
- `prefers-reduced-motion: reduce` で動画と WORKS マーキーの両方を停止
- 画像は WebP + 元形式のフォールバック。幅はレイアウトの実表示サイズの2倍
- SERVICEポップアップの写真は、支給された合成PNG（写真＋文字が焼き込まれた1枚絵）から
  写真部分だけを切り出したもの。5枚とも同じ 3432x1974 の位置にあるので切り抜き矩形は共通

## 未確定・要クライアント確認

- **実績写真** — WORKS の6タイルのうち本物の写真は1枚のみ。残りはデザインシステムのグラデーション/動画のプレースホルダー。差し替え時は `WORK_TILES`（`src/data/site.ts`）を編集する。1.503:1 と 1:1 の交互リズムは維持すること。また現行の写真はカンプからの切り出しなので、高解像度の原本が欲しい。
- **RECRUIT / 採用情報・お問い合わせのリンク先** — 専用セクションがないため現在はすべて `#contact`。
- **「設備一覧」ボタンのリンク先** — POPUPカンプのナビには `FACILITY` があるが、本サイトには
  該当ページがない。暫定で CONTACT に飛ばしている（`FACILITY_HREF`、1箇所）。
  FACILITYページを作るのか、設備一覧をポップアップ内に載せるのかを要確認。
- **ポップアップの文言（画像 → テキスト化）** — 支給素材は写真に文字が焼き込まれた1枚絵だが、
  そのまま貼るとスマホで本文が数px相当になり、選択・読み上げ・翻訳もできない。
  写真だけを切り出し、見出しと本文は縦組みのテキストとして組み直している。
  そのため改行位置がカンプと一部異なる（3列という構成は同じ）。
  例：カンプ「データ制作・色調整・／ＣＴＰ出力など、品質を左右／する準備作業を行う部門。」
  実装「データ制作・色調整・CTP／出力など、品質を左右する／準備作業を行う部門。」
  列ごとの改行を固定したい場合は `body` を行配列に変えれば揃えられるが、
  スマホでの折り返しが効かなくなるため要判断。
- **「オフリン印刷」の表記** — 支給されたアイコン一覧の名称に合わせて `オフセット印刷` から
  変更した（オフ輪＝輪転機のことで、枚葉印刷と別物のため）。正式表記を要確認。
- **MAPリンク** — 住所から生成した Google Maps 検索URL。各拠点の正式なMap URLがあれば `mapHref()` を差し替える。
- **Adobe Fonts のドメイン登録** — ヘッダーナビの Adapter Mono PE Variable はキットがドメイン制限つき。本番ドメインを Adobe の Web プロジェクトに追加しないと、警告なくシステム等幅フォントにフォールバックする。
- **モバイルレイアウト** — 未設計のため、ブランドの構成ルール（レール非表示、ハンバーガー等のアイコンを使わない、角丸0、影なし）に沿って実装した。768px以下でレールを隠し、SERVICE の3+2とNETWORKの2カラムを縦積みにし、ナビは横スクロールする1行にしている。要デザイナー確認。
- **ABOUT の縦書きステートメント（モバイル）** — client提供の横長画像（2.687:1）をそのまま縮小しているため、狭い画面では文字が小さい。画像なので再組版はできない。モバイル用アートボードをクライアントから受け取るのが本筋。
