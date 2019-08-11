export default {
    async CREATE_TEMPLATE({ commit } , payload ){
        return await axios.post('/api/competitions_template' ,  payload )
    },
    async GET_LIST_TEMPLATE({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , type = ''} = payload
        return await axios.get('/api/competitions_template' ,  {params : { current_page , limit , title : keyword , type_question : type  } })
    },
    async GET_TEMPLATE({commit} , payload){
        return await axios.get(`/api/competitions_template/${payload}`)
    },
    async UPDATE_TEMPLATE({commit} , payload){
        let { id , formdata } = payload
        return await axios.put(`/api/competitions_template/${id}` , formdata)
    },
    async REMOVE_TEMPLATE({commit} , payload){
        return await axios.delete(`/api/competitions_template/${payload}`)
    }
}