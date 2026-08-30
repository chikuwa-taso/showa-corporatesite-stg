export const SECTION_IDS = ['top', 'about', 'works', 'service', 'network', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Standalone pages alongside the LP. */
export type PageId = 'recruit' | 'contact';

export type NavItem = {
  label: string;
  /** Root-relative; the base prefix is applied at render time. */
  href: string;
  /** Which LP section lights this item up while scrolling the LP. */
  section: SectionId | null;
  /** Which standalone page this item stands for. */
  page: PageId | null;
};

// CONTACT carries both: on the LP it lights up with the #contact footer, and it
// links onward to the CONTACT page. RECRUIT has no LP section of its own.
export const NAV_ITEMS: NavItem[] = [
  { label: 'TOP', href: '/#top', section: 'top', page: null },
  { label: 'ABOUT', href: '/#about', section: 'about', page: null },
  { label: 'WORKS', href: '/#works', section: 'works', page: null },
  { label: 'SERVICE', href: '/#service', section: 'service', page: null },
  { label: 'NETWORK', href: '/#network', section: 'network', page: null },
  { label: 'RECRUIT', href: '/recruit', section: null, page: 'recruit' },
  { label: 'CONTACT', href: '/contact', section: 'contact', page: 'contact' },
];

export type Office = {
  name: string;
  postal: string;
  address: string;
  tel: string;
  fax?: string;
};

export const OFFICES: Office[] = [
  {
    name: '福井本社・工場',
    postal: '〒910-0822',
    address: '福井県福井市玄正島町8-23-1',
    tel: '0776(53)5353',
    fax: '0776(53)0707',
  },
  {
    name: '上中工場',
    postal: '〒910-0826',
    address: '福井県福井市上中町41-7',
    tel: '0776-57-8400',
    fax: '0776-57-8401',
  },
  {
    name: '東京営業所',
    postal: '〒157-0077',
    address: '東京都世田谷区鎌田3-18-6',
    tel: '03-5206-8727',
  },
  {
    name: '京都営業所',
    postal: '〒615-8003',
    address: '京都市西京区桂上野東町88（双和ビル2F）',
    tel: '075-394-4713',
    fax: '075-394-2434',
  },
  {
    name: '金沢営業所',
    postal: '〒920-8201',
    address: '石川県金沢市鞍月東1丁目35番地',
    tel: '076-238-2323',
    fax: '076-238-9737',
  },
];

/** Placeholder until the client supplies each office's own Maps URL. */
export function mapHref(office: Office): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`;
}

export type Service = {
  slug: string;
  /** Icon alt text and optional caption. Always `titleLines` joined. */
  label: string;
  /**
   * The popup heading, one entry per column. Vertical text runs right to left,
   * so the first line is the rightmost column — the order the comp sets them in.
   */
  titleLines: string[];
  /** Set as live text, not the burnt-in copy from the supplied composites. */
  body: string;
  photoAlt: string;
};

/**
 * Names follow the client's icon key (昭和美術印刷LP素材). Note 「オフリン印刷」:
 * the trade contraction for web-offset, not オフセット印刷 — the two are
 * different presses and the key is explicit about which icon is which.
 */
export const SERVICE_ROWS: Service[][] = [
  [
    {
      slug: 'offset-printing',
      label: 'オフリン印刷',
      titleLines: ['オフリン', '印刷'],
      body: '新聞やカタログなどの大量の印刷物を高速かつ効率的に印刷する部門',
      photoAlt: 'オフリン輪転機で刷り出される印刷物を見守るオペレーター',
    },
    {
      slug: 'sheetfed-printing',
      label: '枚葉印刷',
      titleLines: ['枚葉印刷'],
      body: '紙を一枚ずつ印刷する。小ロット多品種や高品質なカラー印刷に適した部門。',
      photoAlt: '枚葉印刷機から刷り上がった用紙を抜き取って検品する様子',
    },
    {
      slug: 'on-demand',
      label: 'オンデマンド',
      titleLines: ['オンデマンド'],
      body: '小ロット・短納期に対応するデジタル印刷を行う部門。即時印刷が可能。',
      photoAlt: 'オンデマンド印刷で出力した印刷物を手で仕分けする様子',
    },
  ],
  [
    {
      slug: 'prepress',
      label: 'プリプレス',
      titleLines: ['プリプレス'],
      body: 'データ制作・色調整・CTP出力など、品質を左右する準備作業を行う部門。',
      photoAlt: 'CTPセッターに刷版をセットするオペレーターの手元',
    },
    {
      slug: 'bookbinding',
      label: '製本折加工',
      titleLines: ['製本', '折加工'],
      body: '断裁・折り・綴じ・表紙、製品として仕上げる加工工程を担当する部門。',
      photoAlt: '折り機の上を連続して流れていく折り加工中の印刷物',
    },
  ],
];

/**
 * The 設備一覧 button inside each SERVICE popup. The comp's nav carries a
 * FACILITY entry that this site has no section for, so the link parks on
 * CONTACT — the same interim the RECRUIT links use. One constant, so pointing
 * all five popups at the real page later is a one-line change.
 */
export const FACILITY_HREF = '/contact';

export type TileRatio = 'photo' | 'wide' | 'square';

export type WorkTile =
  | { kind: 'photo'; ratio: TileRatio; src: string; alt: string }
  /** `fill` shows through whenever the video is off, loading, or reduced-motion. */
  | { kind: 'video'; ratio: TileRatio; name: string; fill: string }
  | { kind: 'fill'; ratio: TileRatio; fill: string };

/**
 * One half of the marquee. The track renders this list twice so the -50% loop is
 * seamless — edit the list, not the duplication.
 *
 * The client's own work photography, which replaced the design-system gradient
 * and video stand-ins. All four share one 1.421:1 crop, so the strip runs on a
 * single ratio rather than the stand-ins' alternating wide / square rhythm.
 */
export const WORK_TILES: WorkTile[] = [
  {
    kind: 'photo',
    ratio: 'photo',
    src: '/assets/works/oshigoto-book',
    alt: '福井県のおしごと本 パンフレット',
  },
  {
    kind: 'photo',
    ratio: 'photo',
    src: '/assets/works/ski-jam',
    alt: 'スキージャム勝山 チラシ・リフト券・リストバンド',
  },
  {
    kind: 'photo',
    ratio: 'photo',
    src: '/assets/works/europe-ken',
    alt: 'ヨーロッパ軒 特製ソースのパッケージと包装紙',
  },
  {
    kind: 'photo',
    ratio: 'photo',
    src: '/assets/works/tamuraya',
    alt: '越前田村屋 食品パッケージと手提げ袋',
  },
];

/** The handoff's tweak flags, surfaced here so they can be flipped in one place. */
export const CONFIG = {
  /** false swaps every band video for its flat gradient. */
  useVideo: true,
  /** The Japan line drawing in NETWORK. */
  showMap: true,
  /** Captions under the SERVICE pictograms. */
  serviceLabels: false,
  /**
   * Pictogram width in px, as a ceiling — SERVICE shrinks it when the 3-up row
   * would overflow. The handoff quoted 100–220 around a 150 default; the client
   * then asked for double, so this sits at 300.
   */
  iconSize: 300,
};

export const ABOUT_STATEMENT_ALT =
  '印刷と技術のショーワ　かつての印刷は、手の感覚がすべてだった。いまの印刷は、数値とロジックが支えている。けれど、どちらかだけでは届かない美しさがある。昭和美術印刷は、職人の目と、最新の技術で、この一枚に、時代を超える誠実さを込めます。印刷の技術のショーワ。福井から、日本のいい印刷を支えます。';

export const BRAND_ALT = '昭和美術印刷 SHOWA ART PRINTING';

/* ---------------------------------------------------------------- contact */

export const CONTACT_EMAIL = 'showa@showa-art.co.jp';
export const CONTACT_TEL = '0776-53-5353';
/** Digits only — the display string above keeps its hyphens. */
export const CONTACT_TEL_HREF = 'tel:0776535353';
export const BUSINESS_HOURS = '営業時間　　平日 8:30 〜 17:30 （休業日：日・祝）';

export const CONTACT_INTRO = [
  '昭和美術印刷のウェブサイトにアクセスしていただき、誠にありがとうございます。',
  '弊社に関するご質問・お見積り・資料請求などの各種お問い合わせは',
  '以下のボタンよりメール送信、またはお電話をお願いいたします。',
  'お問い合わせの内容に応じて各担当者がご対応いたします。',
];

export const CONTACT_NOTES = [
  BUSINESS_HOURS,
  'ご記入いただいた個人情報は、お問い合わせへの対応および確認のためのみに利用します。',
  'また、この目的のためにお問い合わせの記録を残すことがあります。',
];

/* ---------------------------------------------------------------- recruit */

/** One line inside a spec-table cell. `sameLine` joins it onto the previous. */
export type RecruitCell = { text: string; small?: boolean; sameLine?: boolean };
export type RecruitRow = { label: string; cells: RecruitCell[] };

export const RECRUIT_INTRO =
  '現在、下記の職種で募集を行っています。応募を検討される方は下記をご覧ください。';

export const RECRUIT_GRADUATE_HEADING = '2027年度　新卒者募集';

export const RECRUIT_GRADUATE_ROWS: RecruitRow[] = [
  { label: '募集職種', cells: [{ text: '営業職　事務職　印刷オペレーター' }] },
  { label: '雇用形態', cells: [{ text: '正社員' }] },
  {
    label: '応募資格',
    cells: [{ text: '大卒・大学院・短大・専門学校、高専を卒業見込みの方　第2新卒も可能' }],
  },
  {
    label: '勤務時間',
    cells: [
      { text: '8:30 〜 17:30 シフト制有り　' },
      { text: '※ 印刷オペレーターは2交代制 8:30〜17:30 ／ 20:30〜5:30', small: true, sameLine: true },
    ],
  },
  { label: '時間外労働', cells: [{ text: 'あり　月平均4時間程度' }] },
  {
    label: '給与',
    cells: [
      { text: '【営業職】月給21万円' },
      { text: '【事務職】月給20万5000円' },
      { text: '【印刷オペレーター】月給20万5000円' },
      { text: '上記の給与は大卒以上の基準とする', small: true },
      { text: '【基本給】12万5000円 〜' },
      { text: '※固定残業代：配属部署に準ずる', small: true },
    ],
  },
  { label: '試用期間', cells: [{ text: '3ヶ月（期間中の労働条件は終了後と同じ）' }] },
  {
    label: '諸手当',
    cells: [{ text: '能力給・役職手当・家族手当・通勤交通費・残業手当　等' }],
  },
  { label: '昇給', cells: [{ text: 'あり（年1回）' }] },
  { label: '賞与', cells: [{ text: '年2回（7月、12月）' }] },
  {
    label: '休日休暇',
    cells: [
      { text: '日曜・祝日・土曜月3回程度（年間休日107日）、有給休暇、' },
      { text: '年末年始休暇、夏季休暇、産前・産後休暇、育児・介護休暇、慶弔休暇' },
    ],
  },
  {
    label: '採用実績',
    cells: [{ text: '福井大学　福井工業大学　仁愛大学　富山大学　新潟大学　静岡大学　広島大学' }],
  },
  { label: '保険', cells: [{ text: '社会保険完備' }] },
  {
    label: '福利厚生・待遇',
    cells: [{ text: 'マイカー通勤可、健康診断、永年勤続表彰、会員制リゾートホテル利用可' }],
  },
  { label: '受動喫煙対策', cells: [{ text: '敷地内禁煙' }] },
  {
    label: '連絡先',
    cells: [{ text: '担当：総務部　前川　0776-53-5353　（連絡後、履歴書、成績証明書を提出）' }],
  },
  { label: '選考方法', cells: [{ text: '面接・適正診断' }] },
];

export const RECRUIT_MIDCAREER_HEADING = '中途採用';

export const RECRUIT_MIDCAREER_ROWS: RecruitRow[] = [
  { label: '募集職種', cells: [{ text: '技術職　事務職' }] },
];

export const RECRUIT_MIDCAREER_NOTES = [
  '現在募集中です。詳しくはお問い合わせ下さい',
  BUSINESS_HOURS,
];
