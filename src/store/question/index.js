import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const state = {
    levels : ['easy', 'normal' ,'hard'],
    categories : [],
    question_filter : {
        page : 1,
        keyword : '',
        level : '',
        type : ''
    },
    type : [
        {
            id : 'code',
            text: 'Code question'
        },
        {
            id : 'choice',
            text: 'Choice question'
        }
    ]
}
export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations,
}
