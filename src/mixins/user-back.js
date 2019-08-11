import { mapGetters , mapMutations } from "vuex";

export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapGetters({
            userFilter : 'User/getUserFilter'
        })
    },
    methods:{
        ...mapMutations({
            updateFilter : 'User/setUserFilter'
        }),
        back(){
            var query = { }
            if( this.userFilter ){
                for (const key in this.userFilter) {
                    if (this.userFilter[key] != '') {
                        query[key] = this.userFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'User',
                query : query
            })
        },
    },
}