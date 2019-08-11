import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
    template_filter : {
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
