class Routes {
  
  static register(name, handler) {
    if (this.handlers == null) this.handlers = {}
    this.handlers[name] = handler
  }
  static get(name, params) {
    if (this.handlers[name] == null) throw new Error('unknown route')
    return this.handlers[name](params)
  }
  static ImageEditScreen(source) {
    var imageEditScreen = require('./components/ImageEditScreen');
    return {
      key: imageEditScreen.key,
      component: imageEditScreen,
      title: imageEditScreen.title,
      passProps: {source: source},
    }
  }
}

module.exports = Routes