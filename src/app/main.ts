class ViewController {
  constructor() {
    const el = document.getElementById('root');
    el.outerHTML = "<h1>Hello World</h1>";
    console.log('hello world');
  }
}

const ctrl = new ViewController()
