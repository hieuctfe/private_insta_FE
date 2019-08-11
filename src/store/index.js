import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'js-cookie'
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import Question from './question'
import Template from './template'
import Competition from './competition'
import User from './user'
Vue.use(Vuex)
let token_name = process.env.VUE_APP_TOKEN_NAME ? process.env.VUE_APP_TOKEN_NAME : 'token'
let token = cookie.get(token_name)  
const state = {
    token_name: token_name ,
    token : token ,
    user_type : null,
    user : null,
    is_loading : false,
    redirect_routers : {
        'admin' : 'Admin',
        'leader' : 'Admin',
        'employees' : 'Employee',
        'guest' : 'Employee',
    },
    admin_layout : ['admin','leader'],
    employee_layout : ['employees' ,'guest'],
    breadcrumb : []
}
export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
    modules: {
        Question,
        Template,
        Competition,
        User
    }
});
