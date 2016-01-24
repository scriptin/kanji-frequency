exports.config =
  # See http://brunch.io/#documentation for docs.
  server:
    noPushState: true
  modules:
    definition: false
    wrapper: false
  paths:
    watched: ['app', 'data']
  conventions:
    assets: /(data|assets)[\\/]/
  files:
    javascripts:
      joinTo:
        'scripts/vendor.js': /^bower_components\//
        'scripts/app.js': /^app\//
    stylesheets:
      joinTo:
        'styles/vendor.css': /^bower_components\//
        'styles/app.css': /^app\//
  overrides:
    production:
      paths:
        public: 'gh-pages'
