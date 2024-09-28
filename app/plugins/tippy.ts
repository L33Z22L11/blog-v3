import { directive } from 'vue-tippy'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('tippy', directive)
})
