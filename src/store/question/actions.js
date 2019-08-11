export default {
    async CREATE({ commit } , payload ){
        return await axios.post('/api/question/create' ,  payload )
    },
    async GET({ commit } , payload ){
        return await axios.get(`/api/question/${payload}`)
    },
    async UPDATE({ commit } , payload ){
        let { id , formdata } = payload
        return await axios.put(`/api/question/${id}` , formdata)
    },
    async GET_LIST_QUESTION({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , level = '' , type  = ''} = payload
        return await axios.get('/api/question' ,  {params : { current_page , limit , keyword , level , type_question : type } })
    },
    async GENERAL_TEST_TEST({} , payload){
        return await axios.post('/api/admin/competitions/testcase/generate' , payload)
    },
    GET_CATEGORY({commit}){
        return new Promise(function(resolve, reject) {
            axios.get('/api/category').then(res=>{
                let { status , data } = res.data 
                if( status ){
                    commit('setCategory' , data ? data : [])
                }else{
                    commit('setCategory' , [])
                }
                resolve()
            })
            .catch(err=>{
                commit('setCategory' , [])
                reject(err)
            })
        });
    }
}