import { mapGetters , mapMutations } from "vuex";

export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapGetters({
            templateFilter : 'Template/getTemplateFilter'
        })
    },
    methods:{
        ...mapMutations({
            updateFilter : 'Template/setTemplateFilter'
        }),
        back(){
            var query = { }
            if( this.templateFilter ){
                for (const key in this.templateFilter) {
                    if (this.templateFilter[key] != '') {
                        query[key] = this.templateFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'Template',
                query : query
            })
        },
    },
}