import { mapGetters , mapMutations } from "vuex";

export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapGetters({
            guestFilter : 'Competition/getGuestFilter',
            employeeFilter : 'Competition/getEmployeeFilter'
        })
    },
    methods:{
        ...mapMutations({
            updateGuestFilter : 'Competition/setGuestFilter',
            updateEmployeeFilter : 'Competition/setEmployeeFilter'
        }),
        backGuest(){
            var query = { }
            if( this.guestFilter ){
                for (const key in this.guestFilter) {
                    if (this.guestFilter[key] != '') {
                        query[key] = this.guestFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'ContestGuest',
                query : query
            })
        },
        backEmployee(){
            var query = { }
            if( this.employeeFilter ){
                for (const key in this.employeeFilter) {
                    if (this.employeeFilter[key] != '') {
                        query[key] = this.employeeFilter[key]
                    }
                }
            }
            this.redirect({
                name : 'ContestEmployee',
                query : query
            })
        },
    },
}