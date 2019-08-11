export default {
    getToken(state){
        return state.token
    },
    getUserRole(state){
        return state.user && state.user.role ? state.user.role : null 
    },
    getUser(state){
        return state.user
    },
    getLoading(state){
        return state.is_loading
    },
    getRedirectRouters(state){
        return state.redirect_routers
    },
    getAdminLayout(state){
        return state.admin_layout
    },
    getEmployeeLayout(state){
        return state.employee_layout
    },
    getBreadcrumb(state){
        return state.breadcrumb
    }
}