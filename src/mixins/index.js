export default {
    data(){
        return {
            VUE_APP_IS_FALSE : parseInt(process.env.VUE_APP_IS_FALSE),
            VUE_APP_IS_TRUE : parseInt(process.env.VUE_APP_IS_TRUE)
        }
    },
    methods:{
        redirect(route){
            this.$router.push(route)
        },
        setRouterLinkDefault( { name  , params , query } ){
            let current = {
                name : this.$route.name,
                params : this.$route.params,
                query : this.$route.query
            }
            if( name ){
                current.name = name
            }
            if( params ){
                current.params = params
            }
            if( query ){
                current.query = query
            }
            return current
        },
        pushRouterLinkDefault( { name  , params , query } ){
            let current = {
                name : this.$route.name,
                params : this.$route.params,
                query : this.$route.query
            }
            if( name ){
                current.name = name
            }
            if( params ){
                current.params = params
            }
            if( query ){
                current.query = query
            }
            this.$router.push(current)
        },
        showError(messages){
            var message = 'Oops.. Something Went Wrong.. !'
            if( typeof messages == 'object'){
                for (const key in messages) {
                    if (messages.hasOwnProperty(key)) {
                        message = messages[key]
                        break;
                    }
                }
            }
            this.$toasted.error(message)
        }
    },
    created() {
        
    }
}