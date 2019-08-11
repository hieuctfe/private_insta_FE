<template>
    <div class="auth-form">
        <div class="card" >
            <div class="card-header">
                <img class="favicon" src="@/assets/favicon.png" alt="">
            </div>
            <div class="card-body">
                <ul class="nav">
                    <li>
                        <a :class="{ 'is-active' : !form.is_guest }" @click.stop.prevent="change(false)">Account</a>
                    </li>
                    <li>
                        <a :class="{ 'is-active' : form.is_guest }" @click.stop.prevent="change(true)">guest</a>
                    </li>
                </ul>
                <form class="auth-form-body" v-if="form.is_guest" @submit.stop.prevent="onSubmit" novalidate>
                    <div class="form-group">
                        <label for="form-code">Code</label>
                        <input type="text" id="form-code" placeholder="Your code" class="form-control" v-model.trim="form.code">
                        <transition name="fade" mode="out-in">
                            <div class="text-danger" v-if="$v.form.code.$invalid && formstate">
                                <small v-if="!$v.form.code.required" class="form-text text-danger">Code is required </small>
                            </div>
                        </transition>
                    </div>
                    <div class="form-group">
                        <div class="text-danger m-b-10" v-if="message">
                            {{ message }}
                        </div>
                        <button class="btn btn-primary btn-block">
                            <template v-if="is_loading"><span class="icon-loading"></span></template>
                            <template v-else>Submit</template>
                        </button>
                    </div>
                </form>
                <form class="auth-form-body" v-else @submit.stop.prevent="onSubmit" novalidate>
                    <div class="form-group">
                        <label for="form-email">Email</label>
                        <input type="email" id="form-email" placeholder="Email" class="form-control" v-model.trim="form.email">
                        <transition name="fade" mode="out-in">
                            <div class="text-danger" v-if="$v.form.email.$invalid && formstate">
                                <small v-if="!$v.form.email.required" class="form-text text-danger">Email is required </small>
                                <small v-if="!$v.form.email.email" class="form-text text-danger">Email is invalid </small>
                            </div>
                        </transition>
                    </div>
                    <div class="form-group">
                        <label for="form-password">Password</label>
                        <input type="password" id="form-password" placeholder="Your password" class="form-control" v-model.trim="form.password">
                        <transition name="fade" mode="out-in">
                            <div class="text-danger" v-if="$v.form.password.$invalid && formstate">
                                <small v-if="!$v.form.password.required" class="form-text text-danger">Password is required </small>
                            </div>
                        </transition>
                    </div>
                    <div class="form-group">
                        <div class="text-danger m-b-10" v-if="message">
                            {{ message }}
                        </div>
                        <button class="btn btn-primary btn-block">
                            <template v-if="is_loading"><span class="icon-loading"></span></template>
                            <template v-else>Submit</template>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { requiredIf , email  } from 'vuelidate/lib/validators'
export default {
    name : 'Auth',
    data(){
        return {
            is_loading : false,
            formstate : false,
            form : {
                email : '',
                password : '',
                code : '',
                is_guest : false
            },
            message : null 
        }
    },
    computed:{
        ...mapGetters({
            'routers' : 'getRedirectRouters'
        })
    },
    methods:{
        ...mapActions({
            login : 'LOGIN' ,
            getUserInfo : 'GET_USER_INFO',
        }),
        onSubmit(){
            this.formstate  = true
            if( this.is_loading || this.$v.form.$invalid ) return 
            this.is_loading = true 
            this.message = null 
            this.login(this.form).then((res)=>{
                let { status , data  , message } = res.data 
                if( status ){
                    this.getUser()
                }else{
                    this.message = message 
                    this.is_loading = false
                }
            }).catch((error)=>{

            })
            .finally(()=>{
                this.is_loading = false
            })
        },
        change(params){
            if( this.is_loading) return 
            this.message = null 
            this.formstate = false
            this.form.is_guest = params
        },
        getUser(){
            this.getUserInfo().then( res=>{
                let { status  , data } = res.data 
                if( status ){
                    let { role , type } = data 
                    if( type == 'guest' ){
                        this.redirect({
                            name : this.routers['guest']
                        })
                    }else{
                        if( this.routers.hasOwnProperty(role)){
                            this.redirect({
                                name : this.routers[role]
                            })
                        }
                    }
                    
                }
            })
            .finally(()=>{
                this.is_loading = false
            })
        }
    },
    validations(){
        return {
            form : {
                email: {
                    required: requiredIf(function (nested) {
                        return !nested.is_guest
                    }),
                    email
                },
                password: {
                    required: requiredIf(function (nested) {
                        return !nested.is_guest
                    })
                },
                code : {
                    required: requiredIf(function (nested) {
                        return nested.is_guest
                    })
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .auth-form{
        -webkit-box-flex: 0;
        -ms-flex: 0 0 400px;
        flex: 0 0 400px;
        max-width: 400px;
        .card{
            width: 100%;
            border-radius: 6px;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.1), 0 2px 2px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.1);
            color: #4d4f5c;
            border: 1px solid #eee;
            user-select: none;
            &-header{
                padding: 0;
                border: none;
                text-align: center;
                max-height: 100px;
                background: transparent;
                margin-bottom: 15px;
                .favicon{
                    width: 150px;
                    transform: translateY(-50px);
                    display: inline-block;
                }
                .logo{

                }
            }
            .card-body{
                padding: 0;
                .nav{
                    li{
                        width: 50%;
                        padding: 0;
                        a{
                            text-align: center;
                            display: block;
                            cursor: pointer;
                            text-transform: uppercase;
                            color:$text;
                            font-weight: bold;
                            padding: 6px 15px;
                            border-bottom: 2px solid #f2f2f2;
                            transition: all 0.3s ease;
                            &.is-active{
                                color:$purple;
                                border-color: $purple;
                            }
                            &:hover{

                            }
                        }
                    }
                }
            }
        }
        &-body{
            display: block;
            width: 100%;
            padding: 15px;
            label{
                font-weight: 500;
            }
        }
    }

</style>
