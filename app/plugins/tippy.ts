import VueTippy, { roundArrow } from 'vue-tippy'
import 'tippy.js/dist/svg-arrow.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueTippy, {
        component: 'Tooltip',
        directive: 'tip',
        defaultProps: {
            arrow: roundArrow,
        },
    })
})
