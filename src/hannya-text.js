// 玄奘訳テキスト
// 小林正盛 編「真言宗聖典」、森江書店、大正15年、p 114
// https://ja.wikisource.org/wiki/%E6%91%A9%E8%A8%B6%E8%88%AC%E8%8B%A5%E6%B3%A2%E7%BE%85%E8%9C%9C%E5%A4%9A%E5%BF%83%E7%B5%8C
const text = `
観自在菩薩行深般若波羅蜜多時。照見五蘊皆空。度一切苦厄。
舎利子。色不異空。空不異色。色即是空。空即是色。受想行識亦復如是。
舎利子。是諸法空相。不生不滅。不垢不浄。不増不減。
是故空中。無色無受想行識。無眼耳鼻舌身意。無色声香味触法。無眼界。乃至無意識界。無無明。亦無無明尽。乃至無老死。亦無老死尽。無苦集滅道。
無智亦無得。以無所得故。菩提薩埵。依般若波羅蜜多故。心無罣礙。無罣礙故。無有恐怖。遠離一切顛倒夢想。究竟涅槃。
三世諸仏。依般若波羅蜜多故。得阿耨多羅三藐三菩提。
故知。般若波羅蜜多。是大神呪。是大明呪。是無上呪。是無等等呪。能除一切苦。真実不虚故。説般若波羅蜜多呪。
即説呪曰。羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶。般若心経
`
  .replace(/。/g, '　')
  .replace(/\n/g, '');

export default text;
