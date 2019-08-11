export default {
    LOGIN({ commit } , { email , password , code , is_guest }){
        return new Promise(function(resolve, reject) {
            var url = '/api/users/login'
            var formdata = {}
            if( is_guest ){
                formdata['type'] = 'guests'
                formdata['code'] = code
                url = '/api/users/guest_login'
            }else{
                formdata['type'] = 'employees'
                formdata['email'] = email
                formdata['password'] = password
            }
            axios.post(url, formdata )
            .then(function (res) {
                let { status , data } = res.data 
                if( status ){
                    let { token }  = data 
                    commit('login',{ token })
                    
                }
                resolve(res)
            })
            .catch(function (err) {
                reject(err)
            });
        });
    },
    GET_USER_INFO({commit} ){
        return new Promise(function(resolve, reject) {
            axios.get('/api/users/info')
            .then(function (res) {
                let { status , data } = res.data 
                if( status ){
                    commit('setUser' , data )
                }
                resolve(res)
            })
            .catch(function (err) {
                reject(err)
            });
        });
    },
    LOGOUT({commit}){
        commit('logout')
    },
}