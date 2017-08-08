const path = require('path');

const fontDir = path.join(__dirname, 'dist', 'assets', 'fonts');
const hkGroteskPath = font => ({
  url: {
    otf: path.join(fontDir, `HKGrotesk-${font}.otf`),
  }
});
const hkGroteskAllPaths = decoration => ({
  100: hkGroteskPath(`Light${decoration}`),
  300: hkGroteskPath(decoration !== 'Italic' ? 'Regular' : 'Italic'),
  500: hkGroteskPath(`Medium${decoration}`),
  700: hkGroteskPath(`SemiBold${decoration}`),
  900: hkGroteskPath(`Bold${decoration}`),
});

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('postcss-cssnext')(),
    require('postcss-short')(),
    require('postcss-font-magician')({
      hosted: [fontDir, '/assets/fonts'],
      formats: 'otf',
      custom: {
        'HK Grotesk': {
          variants: {
            normal: hkGroteskAllPaths(''),
            italic: hkGroteskAllPaths('Italic'),
          }
        }
      },
    }),
  ],
};
