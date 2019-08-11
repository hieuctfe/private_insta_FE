import Vue from 'vue'
import Router from 'vue-router'
import { store } from '@/main.js'
import auth from '@/middleware/auth'
import notAuth from '@/middleware/notAuth'
import admin from '@/middleware/admin'

Vue.use(Router)
const router = new Router({
	mode: 'history',
	scrollBehavior(to) {
		if (to.hash) {
			return window.scrollTo({ top: document.querySelector(to.hash).offsetTop, behavior: 'smooth' });
		}
		return window.scrollTo({ top: 0, behavior: 'smooth' });
	},
	routes: [
		// {
			// path: '/',
			// meta: {
			// 	middleware: [auth, employee],
			// 	layout: 'employee'
			// },
			// component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/layout.vue'),
			// children: [
			// 	{
			// 		path: '',
			// 		meta: {
			// 			middleware: [auth, employee],
			// 			layout: 'employee'
			// 		},
			// 		component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/dashboard.vue'),
			// 		children: [
			// 			{
			// 				path: '',
			// 				name: 'Employee',
			// 				meta: {
			// 					middleware: [auth, employee],
			// 					layout: 'employee'
			// 				},
			// 				component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/index.vue'),
			// 			},
			// 		],
			// 	},
			// ]
		// },
		{
			path: '/',
			meta: {
				middleware: [],
			},
			component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/layout.vue'),
			children: [
				{
					path: '',
					name: 'Admin',
					meta: {
						// middleware: [auth, admin],
						breadcrumb: [
							{
								name: 'Dashboard'
							},
						]
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/dashboard/index.vue'),
				},
				{
					path: '/cloneaccount',
					name: 'CloneAccount',
					meta: {
						// middleware: [auth, admin],
						breadcrumb: [
							{
								name: 'Clone Account'
							},
						]
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/clone-account/index.vue'),
				},
				// {
				// 	path: 'questions',
				// 	meta: {
				// 		middleware: [auth, admin],
				// 	},
				// 	component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/layout.vue'),
				// 	children: [
				// 		{
				// 			path: '',
				// 			name: 'Question',
				// 			meta: {
				// 				middleware: [auth, admin],
				// 				breadcrumb: [
				// 					{
				// 						route: 'Admin',
				// 						name: 'Dashboard'
				// 					},
				// 					{
				// 						name: 'Manage Question'
				// 					}
				// 				]
				// 			},
				// 			component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/index.vue'),
				// 		},
				// 		{
				// 			path: 'create',
				// 			component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/layout.vue'),
				// 			children: [
				// 				{
				// 					path: 'code',
				// 					name: 'CreateCodeQuestion',
				// 					meta: {
				// 						middleware: [auth, admin],
				// 						breadcrumb: [
				// 							{
				// 								route: 'Admin',
				// 								name: 'Dashboard'
				// 							},
				// 							{
				// 								route: 'Question',
				// 								name: 'Manage Question'
				// 							},
				// 							{
				// 								name: 'Create Question'
				// 							}
				// 						]
				// 					},
				// 					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/create-code.vue'),
				// 				},
				// 				{
				// 					path: 'multiple-choice',
				// 					name: 'CreateMultipleChoiceQuestion',
				// 					meta: {
				// 						middleware: [auth, admin],
				// 						breadcrumb: [
				// 							{
				// 								route: 'Admin',
				// 								name: 'Dashboard'
				// 							},
				// 							{
				// 								route: 'Question',
				// 								name: 'Manage Question'
				// 							},
				// 							{
				// 								name: 'Create Question'
				// 							}
				// 						]
				// 					},
				// 					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/create-mutiple-choice.vue'),
				// 				}
				// 			]

				// 		},
				// 	]
				// },
			]
		},
		{
			path: '/login',
			name: 'Login',
			meta: {
				layout: 'auth',
				middleware: [notAuth],
			},
			component: () => import( /* webpackChunkName: "auth" */ '@/views/auth/index.vue')
		},
		{
			path: '*',
			name: '404',
			meta: {
				layout: 'error'
			},
			component: () => import( /* webpackChunkName: "error" */ '@/views/error/error-404.vue')
		},
	]
})


router.beforeEach(async (to, from, next) => {
	/* loading user with token before create app */
	let user_role = store.getters['getUserRole']
	let token = store.state.token

	// Uncomment when have authorize
	// if (user_role == null && token) {
	// 	store.commit('loading', true)
	// 	try {
	// 		await store.dispatch('GET_USER_INFO')
	// 	} catch (e) {
	// 		next({ name: 404 })
	// 	} finally {
	// 		store.commit('loading', false)
	// 	}
	// }
	// Uncomment when have authorize

	if (to.meta.breadcrumb) {
		store.commit('setBreadcrumb', to.meta.breadcrumb)
	}
	/* run middleware in current route */
	if (to.meta.middleware) {
		const middleware = to.meta.middleware
		const context = { next, from, to, router, store };
		var preventNext = false
		for (let i = 0; i < middleware.length; i++) {
			const result = await middleware[i](context);
			if (!result) {
				preventNext = true
				break
			}
		}
		if (preventNext) {
			return;
		}
	}
	return next()
});

export default router