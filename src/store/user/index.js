import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
    roles: ['admin', 'leader' ,'employees'],
    user_filter : {
        page : 1,
        keyword : '',
        role : ''
    },
    guest_filter : {
        page : 1,
        keyword : '',
    },
}
export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
}
