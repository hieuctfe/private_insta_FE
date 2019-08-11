import Vue from 'vue'
import Router from 'vue-router'
import { store } from '@/main.js'
import auth from '@/middleware/auth'
import notAuth from '@/middleware/notAuth'
import employee from '@/middleware/employee'
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
		{
			path: '/',
			meta : {
				middleware : [auth , employee],
				layout : 'employee'
			},
			component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/layout.vue'),
			children : [
				{
					path : '',
					meta : {
						middleware : [auth , employee],
						layout : 'employee'
					},
					component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/dashboard.vue'),
					children:[
						{
							path : '',
							name: 'Employee',
							meta : {
								middleware : [auth , employee],
								layout : 'employee'
							},
							component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/index.vue'),
						},
						{
							path : 'result/:id',
							name: 'CompetitionResult',
							meta : {
								middleware : [auth , employee],
								layout : 'employee'
							},
							component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/result.vue'),
						}
					],
				},
				{
					path : 'test/:id',
					name: 'Test',
					meta : {
						middleware : [auth , employee],
						layout : 'employee'
					},
					component: () => import( /* webpackChunkName: "employee" */ '@/views/employee/test.vue'),
				},
			]
		},
		{
			path: '/admin',
			meta : {
				middleware : [auth , admin],
			},
			component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/layout.vue'),
			children : [
				{
					path : '',
					name: 'Admin',
					meta : {
						middleware : [auth , admin],
						breadcrumb : [
							{
								name : 'Dashboard'
							},
						]
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/dashboard/index.vue'),
				},
				{
					path : 'questions',
					meta : {
						middleware : [auth , admin],
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/layout.vue'),
					children : [
						{
							path : '',
							name: 'Question',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										name : 'Manage Question'
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/index.vue'),
						},
						{
							path : 'create',
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/layout.vue'),
							children: [
								{
									path : 'code',
									name: 'CreateCodeQuestion',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												route : 'Question',
												name : 'Manage Question'
											},
											{
												name : 'Create Question'
											}
										]
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/create-code.vue'),
								},
								{
									path : 'multiple-choice',
									name: 'CreateMultipleChoiceQuestion',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												route : 'Question',
												name : 'Manage Question'
											},
											{
												name : 'Create Question'
											}
										]
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/create-mutiple-choice.vue'),
								}
							]
							
						},
						{
							path : ':id',
							name: 'EditQuestion',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'Question',
										name : 'Manage Question'
									},
									{
										name : 'Detail Question'
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/question/edit.vue'),
						},
					]
				},
				{
					path : 'competitions',
					meta : {
						middleware : [auth , admin],
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/layout.vue'),
					children : [
						{
							path : 'guest',
							meta : {
								middleware : [auth , admin],
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/layout.vue'),
							children : [
								{
									path : '',
									name: 'ContestGuest',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												name : "Manage Guest's Competition"
											},
										]
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/guest/index.vue'),
								},
								{
									path : 'create',
									meta : {
										middleware : [auth , admin],
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/guest/layout.vue'),
									children : [
										{
											path : 'code',
											name: 'CreateGuestCodeCompetition',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestGuest',
														name : "Manage Guest's Competition"
													},
													{
														name : "Create Guest's Competition"
													},
												]
											},
											props: { type: 'code' },
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/guest/create.vue'),
										},
										{
											path : 'choice',
											name: 'CreateGuestChoiceCompetition',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestGuest',
														name : "Manage Guest's Competition"
													},
													{
														name : "Create Guest's Competition"
													},
												]
											},
											props: { type: 'choice' },
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/guest/create.vue'),
										}
									]
								},
								{
									path : ':id',
									name: 'DetailGuestCompetition',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												route : 'ContestGuest',
												name : "Manage Guest's Competition"
											},
											{
												name : "Detail Guest's Competition"
											},
										]
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/guest/detail.vue'),
								},
							]
						},
						{
							path : 'employee',
							meta : {
								middleware : [auth , admin],
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/layout.vue'),
							children : [
								{
									path : '',
									name: 'ContestEmployee',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												name : "Manage Employee's Competition"
											},
										]
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/index.vue'),
								},
								{
									path : 'create',
									meta : {
										middleware : [auth , admin],
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/layout.vue'),
									children : [
										{
											path : 'code',
											name: 'CreateEmployeeCodeCompetition',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestEmployee',
														name : "Manage Employee's Competition"
													},
													{
														name : "Create Employee's Competition"
													},
												]
											},
											props: { type: 'code' },
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/create.vue'),
										},
										{
											path : 'choice',
											name: 'CreateEmployeeChoiceCompetition',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestEmployee',
														name : "Manage Employee's Competition"
													},
													{
														name : "Create Employee's Competition"
													},
												]
											},
											props: { type: 'choice' },
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/create.vue'),
										}
									]
								},
								{
									path : ':id',
									meta : {
										middleware : [auth , admin],
									},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/layout.vue'),
									children : [
										{
											path : '',
											name: 'DetailEmployeeCompetition',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestEmployee',
														name : "Manage Employee's Competition"
													},
													{
														name : "Detail Employee's Competition"
													},
												]
											},
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/detail.vue'),
										},
										{
											path : ':user_id',
											name: 'EmployeeCompetitionResult',
											meta : {
												middleware : [auth , admin],
												breadcrumb : [
													{
														route : 'Admin',
														name : 'Dashboard'
													},
													{
														route : 'ContestEmployee',
														name : "Manage Employee's Competition"
													},
													{
														name : "Detail Employee's Competition"
													},
												]
											},
											component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/competition/employee/result.vue'),
										}
									]
								},
							]
						},
					]
				},
				{
					path : 'users',
					meta : {
						middleware : [auth , admin],
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/user/layout.vue'),
					children : [
						{
							path : '',
							name: 'User',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										name : "Manage User"
									},
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/user/index.vue'),
						},
						{
							path : 'create',
							name: 'CreateUser',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'User',
										name : "Manage User"
									},
									{
										name : "Create User"
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/user/create.vue'),
						},
						{
							path : ':id',
							name: 'EditUser',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'User',
										name : "Manage User"
									},
									{
										name : "Update User"
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/user/edit.vue'),
						}
					]
				},
				{
					path : 'guests',
					meta : {
						middleware : [auth , admin],
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/guest/layout.vue'),
					children : [
						{
							path : '',
							name: 'Guest',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										name : "Manage Guest"
									},
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/guest/index.vue'),
						},
						{
							path : 'create',
							name: 'CreateGuest',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'Guest',
										name : "Manage Guest"
									},
									{
										name : "Create Guest"
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/guest/create.vue'),
						},
						{
							path : ':id',
							name: 'EditGuest',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'Guest',
										name : "Manage Guest"
									},
									{
										name : "Update Guest"
									}
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/guest/edit.vue'),
						}
					]
				},
				{
					path : 'templates',
					meta : {
						middleware : [auth , admin],
					},
					component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/layout.vue'),
					children:[
						{
							path : '',
							name: 'Template',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										name : "Manage Template"
									},
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/index.vue'),
						},
						{
							path : 'create',
							meta : {
								middleware : [auth , admin],
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/layout.vue'),
							children :[
								{
									path : 'code',
									name: 'CreateCodeTemplate',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												route : 'Template',
												name : "Manage Template"
											},
											{
												name : "Create Template"
											},
										]
									},
									props :{ type : 'code'},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/create.vue'),
								},
								{
									path : 'choice',
									name: 'CreateChoiceTemplate',
									meta : {
										middleware : [auth , admin],
										breadcrumb : [
											{
												route : 'Admin',
												name : 'Dashboard'
											},
											{
												route : 'Template',
												name : "Manage Template"
											},
											{
												name : "Create Template"
											},
										]
									},
									props :{ type : 'choice'},
									component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/create.vue'),
								}
							]
						},
						{
							path : ':id',
							name: 'EditTemplate',
							meta : {
								middleware : [auth , admin],
								breadcrumb : [
									{
										route : 'Admin',
										name : 'Dashboard'
									},
									{
										route : 'Template',
										name : "Manage Template"
									},
									{
										name : "Edit Template"
									},
								]
							},
							component: () => import( /* webpackChunkName: "admin" */ '@/views/admin/template/edit.vue'),
						},
					]
				},
			]
		},
		{
			path: '/login',
			name: 'Login',
			meta: {
				layout: 'auth',
				middleware : [notAuth],
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


router.beforeEach( async (to, from, next) => {
	/* loading user with token before create app */
	let user_role = store.getters['getUserRole']
	let token = store.state.token
	if( user_role == null && token ){
		store.commit('loading' , true)
		try {
			await store.dispatch('GET_USER_INFO')
		} catch (e) {
			next({ name : 404 })
		} finally {
			store.commit('loading' , false)
		}
	}
	if( to.meta.breadcrumb ){
		store.commit('setBreadcrumb' , to.meta.breadcrumb)
	}
	/* run middleware in current route */
	if (to.meta.middleware) {
		const middleware = to.meta.middleware
        const context = { next , from , to , router, store };
		var preventNext = false
		for (let i = 0; i < middleware.length; i++) {
			const result = await middleware[i](context);
			if( !result ){
				preventNext = true
				break
			}
		}
		if( preventNext ){
			return;
		}
	}
	return next()
});

export default router