import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
    guest_filter : {
        page : 1,
        keyword : '',
        type : ''
    },
    employee_filter : {
        page : 1,
        keyword : '',
        type: ''
    }
}
export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
}
