export default {
    async CREATE_COMPETITION({ commit } , payload ){
        return await axios.post('/api/competitions/create' ,  payload , {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    async GET_LIST_COMPETITION_GUEST({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , type = '' } = payload
        return await axios.get('/api/admin/guest/competition' ,  { params : { current_page , limit , keyword , type_question : type  } })
    },
    async GET_LIST_COMPETITION_EMPLOYEE({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , is_finished  , type = ''} = payload
        return await axios.get('/api/admin/user/competition' ,  { params : { current_page , limit , keyword  , is_finished , type_question : type } })
    },
    async GET_YOUR_LIST_COMPETITION({commit}, payload){
        let { current_page = 1 , limit = 10 , keyword = '' , is_finished } = payload
        return await axios.get('/api/competitions' ,  { params : { current_page , limit , keyword  , is_finished } })
    },
    async START({commit} , payload){
        return await axios.post(`/api/competitions/${payload}/start_test`)
    },
    async FINISH({commit} , payload){
        let { id , answers = null } = payload 
        if( answers ){
            return await axios.put(`/api/competitions/${id}/finished` , { answers })
        }else{
            return await axios.put(`/api/competitions/${id}/finished`)
        }
        
    },
    async ANSWER({commit} , payload){
        let { id , question_id , answer }  = payload
        return await axios.post(`/api/competitions/${id}/answer` , { question_id , answer})
    },
    async GET_RESULT({commit} , payload){
        return await axios.get(`/api/competitions/${payload}/result`)
    },
    async GUEST_COMPETITION({commit} , payload){
        return await axios.get(`/api/admin/guest/competition/${payload}`)
    },
    async UPDATE_COMPETITION({commit} , payload){
        let { id   , formdata } = payload 
        return await axios.post(`/api/admin/guest/competition/${id}/edit` ,  formdata , {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    async GET_USER_RESULT({} , payload){
        let { id , user_id , type } = payload 
        return await axios.get(`/api/admin/competitions/${id}` , {
            params : {
                user_id , type 
            }
        })
    },
    async EMPLOYEE_COMPETITION({commit} , payload){
        return await axios.get(`/api/admin/user/competition/${payload}`)
    },
}