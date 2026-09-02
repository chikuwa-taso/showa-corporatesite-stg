/**
 * 設備一覧 — transcribed from the client's 仮＿設備一覧ページ comp.
 *
 * The comp bakes every word into one 7681×18744 JPEG. Only the machine
 * photographs are lifted out of it; all the type is set live here so the model
 * numbers stay selectable, searchable and legible at any size.
 */

/** A spec line: the machine, and the parenthesised detail printed beneath it. */
export type SpecItem = {
  /** Left of the leader rule. */
  name: string;
  /** Right of the leader rule — the sheet size, where the comp prints one. */
  format?: string;
  /** Small lines under the name. */
  notes?: string[];
};

export type Department = {
  id: string;
  /** The heading, one entry per line, inside the comp's corner brackets. */
  titleLines: string[];
  /** The standfirst under the rule — the same wording as the SERVICE popups. */
  body: string[];
};

export const FACILITY_INTRO = 'EQUIPMENT';

export const DEPT_OFFSET: Department = {
  id: 'offset',
  titleLines: ['オフリン', '印刷部門'],
  body: ['新聞やカタログなどの', '大量の印刷物を高速かつ', '効率的に印刷する部門。'],
};

export const SPECS_OFFSET: SpecItem[] = [
  {
    name: '小森／システム 40',
    format: '4色×4色 A ヨコ全判',
    notes: [
      '（NIKKA・ハイスピードシーター／ KYODO・KP バレタイジングロボットシステム A4-16P折 A4-8P折 A1シーター）',
    ],
  },
  {
    name: '小森／システム 35S',
    format: '4色×4色 B タテ半裁',
    notes: [
      '（NIKKA・ハイスピードシーター／ KYODO・KP バレタイジングロボットシステム）',
      '（小森製パーフォレーター・B4×2P 2列出しシーター B3折出 B2折出 B5-16P折 B5-8P折 B2シーター B4ペラ出し）',
    ],
  },
  {
    name: '小森／システム 35-546Ⅱ',
    format: '4色×4色 B タテ半裁',
    notes: [
      '（VITSシーター KYODO・KP バレタイジングロボットシステム）（B3折出 B2折出 B5-16P折 B5-8P折 B2シーター）',
    ],
  },
  { name: '巻取自動立体倉庫（KPシステム W タイプ）' },
];

export const DEPT_PREPRESS: Department = {
  id: 'prepress',
  titleLines: ['プリプレス', '部門'],
  body: ['データ制作・色調整・CTP', '出力など、品質を左右する', '準備作業を行う部門。'],
};

export const DEPT_ONDEMAND: Department = {
  id: 'on-demand',
  titleLines: ['オンデマンド', '部門'],
  body: ['小ロット・短納期に対応する', 'デジタル印刷を行う部門。', '即時印刷が可能。'],
};

export const SPECS_PREPRESS: SpecItem[] = [
  { name: '大日本スクリーン／ PTR-8900・PTR-8600' },
  { name: '大日本スクリーン／ EQUIOS Ver8.01 EQ103', notes: ['（CTP用RIP）'] },
  { name: '大日本スクリーン／ Flat Worker Ver8.04/FP414', notes: ['（版面設計用）'] },
  { name: 'FUJIFILM ／プリモジェット', notes: ['（インクジェット色校正機）'] },
  { name: 'KONICA MINOLTA ／ AccurioPress C4070' },
];

export const DEPT_SHEETFED: Department = {
  id: 'sheetfed',
  titleLines: ['枚葉印刷', '部門'],
  body: ['紙を一枚ずつ印刷する。', '小ロット多品種や高品質な', 'カラー印刷に適した部門。'],
};

export const DEPT_BINDING: Department = {
  id: 'binding',
  titleLines: ['製本・加工', '部門'],
  body: ['断裁・折り・綴じ・表紙加工、', '製品として仕上げる', '加工工程を担当する部門。'],
};

export const SPECS_SHEETFED: SpecItem[] = [
  {
    name: '小森／リスロン GX40RP',
    notes: ['（4色×4色 菊判全判UVオフセット印刷機）＋ HiNiX ／ RF-40SⅡ'],
  },
  { name: '小森／リスロン G40', notes: ['（コーター付 6色 菊判全判UVオフセット印刷機）'] },
  { name: '小森／ SPICA-426P', notes: ['（4色菊判半裁反転機構付オフセット印刷機）'] },
  {
    name: 'OSAKO ／ 368型全自動高速中綴機…3台',
    notes: ['（12鞍）（10鞍＋カバーフィーダー）（6鞍＋カバーフィーダー）'],
  },
  {
    name: 'Horizon ／紙折機',
    notes: ['（菊判全判クロス…2台）（菊判半裁クロス…1台）（菊判半裁平行折機…2台）'],
  },
  { name: 'Horizon ／ RD-4055', notes: ['（ロータリーダイカットシステム…1台）'] },
  // The comp prints 打技機 here and 打抜機 on the photo caption below; 打抜機 is
  // the term for a die-cutter, so both read that way here. Worth confirming.
  { name: '飯島製作所／ KF-1020', notes: ['（自動平盤打抜機）'] },
  { name: 'アコ・ブランズ・ジャパン／ Sagitta 76', notes: ['（菊判全判 全自動ラミネーター）'] },
];

export const SPECS_SHEETFED_TAIL = 'ほか';

/** A machine photograph with the chip label and caption the comp gives it. */
export type Machine = {
  src: string;
  /** The white chip. */
  chip: string;
  /** Lines beside or under the chip. */
  caption: string[];
  /** Smaller line under the caption. */
  note?: string;
  alt: string;
};

export const MACHINES_OFFSET: Machine[] = [
  {
    src: 'press-a1',
    chip: 'A1',
    caption: ['小森／システム 40 - 4色×4色 A1Y'],
    note: 'NIKKA・ハイスピードシーター／印刷品質監視装置',
    alt: '小森 システム40 A1輪転印刷機',
  },
  {
    src: 'press-b2',
    chip: 'B2',
    caption: ['小森／システム35S - 4色×4色 B2T'],
    note: '小森製パーフォレーター搭載 NIKKA・ハイスピードシーター／B4×2P 2列出しシーター／印刷品質監視装置',
    alt: '小森 システム35S B2輪転印刷機',
  },
];

export const MACHINE_CTP: Machine = {
  src: 'ctp',
  chip: 'CTP',
  caption: ['SCREEN ／', 'サーマルプレートレコーダー'],
  alt: 'SCREEN サーマルプレートレコーダー',
};

export const MACHINES_SHEETFED: Machine[] = [
  {
    src: 'press-gx40rp',
    chip: '菊判全判UV',
    caption: ['小森／リスロン GX40RP'],
    note: '（4色×4色 菊判全判UVオフセット印刷機）',
    alt: '小森 リスロン GX40RP 菊判全判UVオフセット印刷機',
  },
  {
    src: 'press-g40',
    chip: '菊判全判UV',
    caption: ['小森／リスロン G40'],
    note: '（コーター付 6色 菊判全判UVオフセット印刷機）',
    alt: '小森 リスロン G40 菊判全判UVオフセット印刷機',
  },
  {
    src: 'press-spica',
    chip: '菊判半裁',
    caption: ['小森／ SPICA-426P'],
    note: '（4色菊判半裁反転機構付オフセット印刷機）',
    alt: '小森 SPICA-426P 菊判半裁オフセット印刷機',
  },
  {
    src: 'stitcher',
    chip: '中綴機×3台',
    caption: ['OSAKO/368型全自動高速中綴機'],
    alt: 'OSAKO 368型 全自動高速中綴機',
  },
];

/** The three finishing machines that share the last row. */
export const MACHINES_FINISHING: Machine[] = [
  {
    src: 'folder-horizon',
    chip: '',
    caption: ['Horizon ／ AF-762KL'],
    note: '菊判全判・クロス紙折機',
    alt: 'Horizon AF-762KL 紙折機',
  },
  {
    src: 'laminator',
    chip: '',
    caption: ['アコ・ブランズ・ジャパン', 'Sagitta 76（ホットナイフ方式）'],
    note: '菊判全判・全自動ラミネーター',
    alt: 'アコ・ブランズ・ジャパン Sagitta 76 全自動ラミネーター',
  },
  {
    src: 'diecutter',
    chip: '',
    caption: ['飯島製作所／ KF-1020'],
    note: '自動平盤打抜機',
    alt: '飯島製作所 KF-1020 自動平盤打抜機',
  },
];

/** The chip that labels the whole finishing row. */
export const FINISHING_CHIP = '紙折機×5台';

/** The 「＋」 between the GX40RP and the coater it pairs with. */
export const GX40RP_PARTNER = 'HiNiX ／ RF-40SⅡ';
