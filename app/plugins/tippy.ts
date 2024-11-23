import { directive } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
// import 'tippy.js/themes/light.css'

// TODO: use useColorMode() to get theme
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('tippy', directive)
})
