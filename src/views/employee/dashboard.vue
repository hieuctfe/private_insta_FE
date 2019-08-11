<template>
    <div class="app-employee-dashboard container">
        <div class="row">
            <div class="col col-12 m-b-50">
                <div class="user-info">
                    <div class="user-info-image">
                        {{ userName }}
                    </div>
                    <div class="user-info-content">
                        <div class="user-info-content-wrapper">
                            <div class="user-info-text">
                                Hello <strong>{{ user.full_name }}</strong> !
                            </div>
                            <div class="user-info-welcome">
                                {{ welcome }}
                            </div>
                        </div>
                    </div>
                    <div class="user-info-actions">
                        <button class="btn btn-outline-secondary" @click="logout">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <div class="col col-12">
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters , mapActions } from 'vuex';
export default {
    name : 'EmployeeDashboardLayout',
    data(){
        return {
            welcome : 'Welcome to FireApps, Sandbox coding ',
        }
    },
    computed:{
        ...mapGetters({
            'user' : 'getUser',
            'role' : 'getUserRole'
        }),
        userName() {
            var nameSplit = String(this.user.full_name ).toUpperCase().split(' ')
            var initials = null
            if (nameSplit.length == 1) {
                initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
            } else {
                initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
            }
            return initials
        }
    },
    methods:{
        ...mapActions({
            logout : 'LOGOUT',
        }),
    },
    created(){

    }
}
</script>

<style lang="scss" scoped>
    .container{
        max-width: 1170px;
    }
    .app-employee-dashboard{
        padding: 50px 0;
        .user-info{
            display: flex;
            flex-direction: row;
            &-image{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
                border: 1px solid #eeeeee;
                background: #f2f2f2;
                font-size: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            &-actions{
                width: 100px;
            }
            &-content{
                width: calc(100% - 200px);
                padding-left: 30px;
                display: flex;
                align-items: center;
                &-wrapper{

                }
            }
            &-text{
                font-size: 28px;
                strong{
                    text-transform: capitalize;
                }
            }
            &-welcome{
                font-size: 18px;
            }
        }
    }
    .user-box{
        &-head{
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
            h3{
                display: block;
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
</style>
