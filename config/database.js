if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://marcusrandrews:12215216Mlab@ds137206.mlab.com:37206/vidjot-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}
