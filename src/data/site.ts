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
  label: string;
};

export const SERVICE_ROWS: Service[][] = [
  [
    { slug: 'offset-printing', label: 'オフセット印刷' },
    { slug: 'sheetfed-printing', label: '枚葉印刷' },
    { slug: 'on-demand', label: 'オンデマンド' },
  ],
  [
    { slug: 'prepress', label: 'プリプレス' },
    { slug: 'bookbinding', label: '製本折加工' },
  ],
];

export type WorkTile =
  | { kind: 'photo'; ratio: 'wide' | 'square'; src: string; alt: string }
  /** `fill` shows through whenever the video is off, loading, or reduced-motion. */
  | { kind: 'video'; ratio: 'wide' | 'square'; name: string; fill: string }
  | { kind: 'fill'; ratio: 'wide' | 'square'; fill: string };

/**
 * One half of the marquee. The track renders this list twice so the -50% loop is
 * seamless — edit the list, not the duplication.
 *
 * Tiles 2–6 are design-system stand-ins pending real work photography. When it
 * arrives, keep the alternating wide / square rhythm.
 */
export const WORK_TILES: WorkTile[] = [
  { kind: 'photo', ratio: 'wide', src: '/assets/works/works-center', alt: 'パッケージ印刷' },
  { kind: 'fill', ratio: 'square', fill: 'var(--gradient-fire-soft)' },
  { kind: 'video', ratio: 'wide', name: 'material-c', fill: 'var(--gradient-fire)' },
  { kind: 'fill', ratio: 'square', fill: 'var(--gradient-water)' },
  { kind: 'video', ratio: 'wide', name: 'material-b', fill: 'var(--gradient-water)' },
  { kind: 'fill', ratio: 'square', fill: 'var(--stock-kraft)' },
];

/** The handoff's tweak flags, surfaced here so they can be flipped in one place. */
export const CONFIG = {
  /** false swaps every band video for its flat gradient. */
  useVideo: true,
  /** The Japan line drawing in NETWORK. */
  showMap: true,
  /** Captions under the SERVICE pictograms. */
  serviceLabels: false,
  /** 100–220. Overrides --icon-size; the client last previewed 220. */
  iconSize: 150,
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
