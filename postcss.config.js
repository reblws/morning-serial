const path = require('path');

const fontDir = path.join(__dirname, 'dist', 'assets', 'fonts');
const hkGroteskPath = font => ({
  url: {
    otf: path.join(fontDir, `HKGrotesk-${font}.otf`),
  },
});
const hkGroteskAllPaths = decoration => ({
  '100': hkGroteskPath(`Light${decoration}`),
  '300': hkGroteskPath(decoration !== 'Italic' ? 'Regular' : 'Italic'),
  '400': hkGroteskPath(`Medium${decoration}`),
  '700': hkGroteskPath(`SemiBold${decoration}`),
  '900': hkGroteskPath(`Bold${decoration}`),
});

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-cssnext')(),
    require('postcss-short')(),
    // require('lost')(),
    // require('postcss-font-magician')({
    //   display: 'swap',
    //   hosted: [fontDir, '/assets/fonts'],
    //   formats: 'otf ttf',
    //   foundries: ['google'],
    //   variants: {
    //     'Zilla Slab': {
    //       '700': [],
    //     },
    //   },
    //   custom: {
    //     'HK Grotesk': {
    //       variants: {
    //         normal: hkGroteskAllPaths(''),
    //         italic: hkGroteskAllPaths('Italic'),
    //       },
    //     },
    //   },
    // }),
  ],
};
