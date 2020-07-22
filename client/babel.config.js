module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@config/*': ['./src/config/*'],
        '@components/*': ['./src/components/*'],
        '@context/*': ['./src/context/*'],
        '@styles/*': ['./src/styles/*'],
        '@pages/*': ['./src/pages/*'],
        '@src/*': ['./src/*'],
        '@root/*': ['./*']
      }
    }]
  ]
}
