import "@/assets/styles/styles.scss";
import main from "@/app/main.html";

class ViewController {
  constructor() {
    const el = document.getElementById('root');
    el.outerHTML = main;
  }
}

const ctrl = new ViewController()
