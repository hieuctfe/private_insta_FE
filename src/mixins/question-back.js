import { mapGetters , mapMutations } from "vuex";

export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapGetters({
            questionFilter : 'Question/getQuestionFilter'
        })
    },
    methods:{
        ...mapMutations({
            updateFilter : 'Question/setQuestionFilter'
        }),
        back(){
            var query = { }
            if( this.questionFilter ){
                for (const key in this.questionFilter) {
                    if (this.questionFilter[key] != '') {
                        query[key] = this.questionFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'Question',
                query : query
            })
        },
    },
}