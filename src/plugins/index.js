import Vue from 'vue'
import Vuelidate from 'vuelidate'
import MarkdownEditor from '@/components/markdown-editor'
import Toasted from 'vue-toasted'
import lineClamp from 'vue-line-clamp'
import pagination from '@/components/pagination'
import checkbox from '@/components/checkbox'
import './helper'
import './axios'
import './filter'
import 'bootstrap'
import 'simplemde/dist/simplemde.min.css'
import '@/styles/style.scss'


/* Vue use register */
Vue.use(Vuelidate)
Vue.use(Toasted, {
    position : 'top-right',
    duration: 5000 ,
    keepOnHover: true,
    iconPack: 'material',
    type: 'success',
    containerClass : 'vue-toast',
    action : {
        icon : 'close',
        onClick : (e, toastObject) => {
            toastObject.goAway(0);
        }
    },
})
Vue.use(lineClamp, {})
/* Vue component register */
Vue.component('pagination' , pagination)
Vue.component('checkbox' , checkbox)
Vue.component('markdown-editor' , MarkdownEditor)
