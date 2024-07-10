import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { InstallCodemirro } from "codemirror-editor-vue3";

const app = createApp(App);
app.use(InstallCodemirro);

app.mount('#app')
