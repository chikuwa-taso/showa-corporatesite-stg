/**
 * 設備一覧 — every line of copy on the page, transcribed from the client's comp
 * 全体像.jpg. Body copy breaks are the comp's own and are kept as given.
 */

export interface MachinePhoto {
  /** Basename in /assets/facility (lossless WebP crop of the comp). */
  src: string;
  /** Outer width of the white frame on the 7681px board — every frame is 1004 tall. */
  boardW: number;
  alt: string;
}

export interface Machine {
  name: string;
  /** Small spec set on the same line as the name. */
  spec?: string;
  /** Smaller lines under the name. */
  notes?: string[];
  photo?: MachinePhoto;
}

export interface Department {
  id: string;
  /** Pictogram slug, shared with SERVICE. */
  icon: string;
  tagline: string;
  title: string;
  /** Body copy, one entry per line of the comp. Omitted where the comp has none. */
  body?: string[];
  machines: Machine[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'offset',
    icon: 'offset-printing',
    tagline: '大量の印刷物を高速かつ効率的に印刷する部門',
    title: 'オフセット輪転印刷',
    body: [
      '常に生産ラインの効率化を追求し、最新の高速オフセット輪転機を導入しております。',
      '24時間稼働により、短納期かつ大量の印刷ニーズにも柔軟に対応が可能です。',
      '一枚一枚の印刷物に、プロの厳しい目とコンピューターによる',
      '高度な品質管理システムを組み合わせることで、高い品質をご提供いたします。',
    ],
    machines: [
      {
        name: '小森／システム35S',
        spec: '4色×4色 Bタテ半裁',
        notes: [
          'NIKKA・ハイスピードシーター／ KYODO・KPパレタイジングロボットシステム',
          '小森製パーフォレーター・B4×2P 2列出しシーター B3折出 B2折出 B5-16P折 B5-8P折 B2シーター B4ペラ出し',
        ],
        photo: { src: 'system-35s', boardW: 1802, alt: '小森 システム35S' },
      },
      {
        name: '小森／システム40',
        spec: '4色×4色 Aヨコ全判',
        notes: [
          'NIKKA・ハイスピードシーター／ KYODO・KPパレタイジングロボットシステム A4-16P折 A4-8P折 A1シーター',
        ],
        photo: { src: 'system-40', boardW: 1802, alt: '小森 システム40' },
      },
      {
        name: '小森／システム35-546Ⅱ',
        spec: '4色×4色 Bタテ半裁',
        // The comp reads 「VITSシーター— KYODO・KPパレタイジングロボットシステム)(B3折出 …
        // B2シーター—」: stray dashes and a back-to-front bracket pair. Set in the
        // form the two machines above use; the client has been asked to confirm.
        notes: [
          'VITSシーター／ KYODO・KPパレタイジングロボットシステム（B3折出 B2折出 B5-16P折 B5-8P折 B2シーター）',
        ],
      },
      { name: '巻取自動立体倉庫（KPシステムWタイプ）' },
    ],
  },
  {
    id: 'sheetfed',
    icon: 'sheetfed-printing',
    tagline: '一枚ずつ印刷する小ロットや高品質なカラー印刷に適した部門',
    title: '枚葉印刷',
    body: [
      '多様なプロモーション戦略に寄り添い、パンフレット、カタログ、',
      'ポスター、情報誌など、あらゆるPRツールを少部数から高品質でご提供いたします。',
      'また、繊細な表現が求められる美術印刷から、正確な色管理が不可欠な企業カタログまで、',
      '高度な技術でお客様の期待を超える仕上がりをお約束いたします。',
    ],
    machines: [
      {
        name: '小森／リスロンGX40RP',
        notes: ['4色×4色 菊判全判UVオフセット印刷機 ＋ HiNiX／RF-40SⅡ'],
        photo: { src: 'lithrone-gx40rp', boardW: 3448, alt: '小森 リスロンGX40RP と HiNiX RF-40SⅡ' },
      },
      {
        name: '小森／リスロンG40',
        notes: ['コーター付 6色 菊判全判UVオフセット印刷機'],
        photo: { src: 'lithrone-g40', boardW: 1802, alt: '小森 リスロンG40' },
      },
      { name: '小森／SPICA-426P', notes: ['4色菊判半裁反転機構付オフセット印刷機'] },
    ],
  },
  {
    id: 'ondemand',
    icon: 'on-demand',
    tagline: '小ロット・短納期に対応する即時印刷が可能なデジタル印刷を行う部門',
    title: 'オンデマンド印刷',
    body: [
      '製版工程を省略できるオンデマンド印刷は、データ入稿から印刷までの時間を大幅に短縮。',
      '急なご要望にも迅速に対応します。1部からの小ロット印刷にも最適です。',
      '当社のオンデマンド印刷は、印刷色基準に基づいた厳格なトータル色管理システムを導入。',
      'オフセット印刷に匹敵する、安定した高品質な色再現性を実現します。',
    ],
    machines: [{ name: 'KONICA MINOLTA／AccurioPress C407' }],
  },
  {
    id: 'prepress',
    icon: 'prepress',
    tagline: 'データ制作・色調整・CTP出力など品質を左右する準備作業を行う部門',
    title: 'プリプレス',
    body: [
      '高度な最先端技術を武器に、低コスト・スピーディな作業を実現させることで、',
      'お客様のニーズにお応えできるよう印刷品質の向上に努めています。',
    ],
    machines: [
      {
        name: '大日本スクリーン／PTR-8900・PTR-8600',
        photo: { src: 'ptr-8900', boardW: 1382, alt: '大日本スクリーン PTR-8900' },
      },
      { name: '大日本スクリーン／EQUIOS Ver8.01 EQ103', notes: ['CTP用RIP'] },
      { name: '大日本スクリーン／Flat Worker Ver8.04/FP414', notes: ['版面設計用'] },
      { name: 'FUJIFILM／プリモジェット', notes: ['インクジェット色校正機'] },
    ],
  },
  {
    id: 'binding',
    icon: 'bookbinding',
    tagline: '製品として仕上げる加工工程を担当する部門',
    title: '製本・折加工・PP加工・型抜き加工',
    machines: [
      {
        name: 'OSAKO／368型全自動高速中綴機…3台',
        notes: ['12鞍 ／ 10鞍＋カバーフィーダー ／ 6鞍＋カバーフィーダー'],
      },
      {
        name: 'Horizon／紙折機',
        notes: ['菊判全判クロス…2台 ／ 菊判半裁クロス…1台 ／ 菊判半裁平行折機…2台'],
      },
      { name: 'Horizon／RD-4055', notes: ['ロータリーダイカットシステム…1台'] },
      // The comp has 「自動平盤打技機」; the machine is a die-cutter, 打抜機.
      { name: '飯島製作所／KF-1020', notes: ['自動平盤打抜機'] },
      { name: 'アコ・ブランズ・ジャパン／Sagitta 76', notes: ['菊判全判 全自動ラミネーター'] },
    ],
  },
];
