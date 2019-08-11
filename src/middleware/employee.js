export default ({ next, router , store })=>{
    var role = store.getters['getUserRole']
    var AdminLayout = store.getters['getAdminLayout']
    var EmployeeLayout = store.getters['getEmployeeLayout']
    if( EmployeeLayout.indexOf(role) >= 0){
        return true
    }
    if( AdminLayout.indexOf(role)>= 0){
        next({ name : 'Admin'})
        return false
    }
    next({ name: '404' })
    return false
}