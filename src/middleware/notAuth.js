export default function ({ next, router, store }) {
	if (store.state.token) {
		// redirect when someone come to login page
		var type = store.getters['getUserRole']
		if (type == 'admin' || type == 'leader') {
			next({ name: 'Admin' })
			return false
		}

		// if( type == 'employees' || type == 'guest') {
		// 	next({ name : 'Employee'})
		// 	return false
		// }
	}
	return true
}
