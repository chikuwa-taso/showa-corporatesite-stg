export const SECTION_IDS = ['top', 'about', 'works', 'service', 'network', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type NavItem = {
  label: string;
  href: string;
  /** Which section id lights this item up. RECRUIT has no section of its own. */
  section: SectionId | null;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'TOP', href: '#top', section: 'top' },
  { label: 'ABOUT', href: '#about', section: 'about' },
  { label: 'WORKS', href: '#works', section: 'works' },
  { label: 'SERVICE', href: '#service', section: 'service' },
  { label: 'NETWORK', href: '#network', section: 'network' },
  { label: 'RECRUIT', href: '#contact', section: null },
  { label: 'CONTACT', href: '#contact', section: 'contact' },
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
