export default {
    async CREATE_EMPLOYEE({ commit } , payload ){
        return await axios.post('/api/users' ,  payload )
    },
    async UPDATE_EMPLOYEE({ commit } , payload ){
        let { id , formdata } = payload 
        return await axios.put(`/api/users/${id}` ,  formdata )
    },
    async GET_EMPLOYEE({commit} , payload){
        return await axios.get(`/api/users/${payload}` )
    },
    async GET_LIST_EMPLOYEE({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , role } = payload
        return await axios.get('/api/users' ,  {params : { current_page , limit , keyword , role} })
    },
    async UPDATE_GUEST({ commit } , payload ){
        let { id , formdata } = payload 
        return await axios.post(`/api/admin/guest/${id}` ,  formdata )
    },
    async GET_GUEST({commit} , payload){
        return await axios.get(`/api/admin/guest/${payload}` )
    },
    async GET_LIST_GUEST({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , sort = 'DESC' } = payload
        return await axios.get('/api/admin/guest/list' ,  {params : { current_page , limit , keyword , sort } })
    },
    async CHANGE_PASSWORD({ commit } , payload ){
        return await axios.put('/api/users/change_password' ,  payload )
    },
    
}