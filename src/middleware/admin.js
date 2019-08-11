export default ({ next, router , store })=>{
    var role = store.getters['getUserRole']
    var AdminLayout = store.getters['getAdminLayout']
    var EmployeeLayout = store.getters['getEmployeeLayout']
    if( AdminLayout.indexOf(role) >= 0){
        return true
    }
    if( EmployeeLayout.indexOf(role)>= 0){
        next({ name : 'Employee'})
        return false
    }
    next({ name: '404' })
    return false
}