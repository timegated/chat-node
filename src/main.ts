import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import hljs from 'highlightjs'
import './assets/main.css'

const renderer = new marked.Renderer()
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  },
  gfm: true,
  smartLists: true,
})

const app = createApp(App)

app.directive('markdown', {
  beforeMount(el, binding) {
    el.innerHTML = DOMPurify.sanitize(marked(binding.value, { renderer }));
  },
  updated(el, binding) {
    el.innerHTML = DOMPurify.sanitize(marked(binding.value, { renderer }));
  },
});

app.use(router)

app.mount('#app')
