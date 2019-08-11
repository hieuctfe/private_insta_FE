import { mapGetters , mapMutations } from "vuex";

export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapGetters({
            guestFilter : 'User/getGuestFilter'
        })
    },
    methods:{
        ...mapMutations({
            updateFilter : 'User/setGuestFilter'
        }),
        back(){
            var query = { }
            if( this.guestFilter ){
                for (const key in this.guestFilter) {
                    if (this.guestFilter[key] != '') {
                        query[key] = this.guestFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'Guest',
                query : query
            })
        },
    },
}