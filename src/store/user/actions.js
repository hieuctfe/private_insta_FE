export default {
    async GET_LIST_ACCOUNT({commit}, payload){
        // let { current_page = 1 , limit = 10 , keyword = '' , role } = payload
        // return await axios.get('/account' ,  {params : { current_page , limit , keyword , role} })
        return await axios.get('/account')
    },
    async DELETE_ACCOUNT({commit}, payload){
        let { id = '' } = payload
        return await axios.delete('/account', {data: payload})
    },
    async CREATE_ACCOUNT({commit}, payload){
        return await axios.post('/account', payload)
    },
    async UPDATE_ACCOUNT({commit}, payload){
        return await axios.put('/account', payload)
    },
}