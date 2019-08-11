<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-15">
                    <button @click="back" class="btn btn-outline-secondary btn-back"> 
                        <i class="material-icons">arrow_back</i>&nbsp; Back to list
                    </button>
                </div>
                <div class="col col-12">
                    <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                        comming soon
                    </form>
                </div>
            </div>
            <confirm-dialog ref="confirm"></confirm-dialog>
        </div>
    </transition>
    
</template>
<script>
import { required , requiredIf , email , minLength , integer  , minValue , sameAs} from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import ConfirmDialog from '@/components/confirm-dialog'
import lodash from 'lodash'
import GuestBack from '@/mixins/guest-back'
export default {
    name : 'AddEmployee',
    mixins : [GuestBack],
    components:{
        ConfirmDialog 
    },
    data(){
        return {
            is_loading : true,
            is_sending : false,
            is_success : false,
            is_loading_question: false,
            formstate: false,
            emails : [],
            form :{
                full_name : '',
                email: '',
                role : '',
                password : '',
                repassword : '',
            },
        }
    },
    computed:{
        ...mapGetters({
            roles : 'User/getRoles'
        }),
    },
    methods:{
        ...mapActions({
            createEmployee : 'User/CREATE_EMPLOYEE',
        }),
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid ){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to create this user ?',
                    btnSave : 'Create',
                    onSave : () => {
                        return new Promise((resolve , reject) =>{
                            this.postCreate().finally((res)=>{
                                resolve()
                            })
                        })
                    }
                })
                                
            }
        },
        postCreate(){
            return new Promise((resolve, reject)=>{
                this.is_sending = true
                let {  full_name , email , password , role }  = this.form
                this.createEmployee({full_name , email , password , role}).then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Create user successfully !')
                        this.back()
                    }else{
                        let { code  , message } = data 
                        if( code == 422){
                            this.showError(message)
                        }else{
                            this.$toasted.error('Oops.. Something Went Wrong.. !')
                        }
                    }
                })
                .catch(err=>{
                    this.$toasted.error('Oops.. Something Went Wrong.. !')
                })
                .finally(()=>{
                    this.is_sending = false
                    resolve()
                })
            });
        },
    },
    validations(){
        var vm = this
        return {
            form : {
                full_name : {
                    required
                },
                email: {
                    required, email ,
                },
                role : {
                    required
                },
                password: {
                    required, minLength : minLength(6)
                },
                repassword : {
                    sameAs: sameAs('password')
                }
            }
        }
    },
    created(){
        this.is_loading = false
    }
}
</script>
<style lang="scss" scoped>
    .create-competition{
        label{
            font-weight: 500;
        }
        .upload-file{
            min-height: 240px;
            border: 2px dashed #0087F7;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            &-empty{
                cursor: pointer;
            }
            .placeholder{
                color:#646C7F;
                font-size: 18px;
                font-weight: 500;
            }
            &-review{
                text-align: center;
                position: relative;
                &-img{

                }
                &-name{
                    margin-bottom: 10px;
                }
                &-remove{
                    
                    width: 34px;
                    height: 34px;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    overflow: hidden;
                    color:$danger !important;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    &:hover{
                        background-color: rgba(255, 0, 0, 0.2);
                        color:$danger;
                        text-decoration: none;
                    }
                }
            }
        }
        .box-empty{
            padding: 30px 0;
            text-align: center;
            .empty-title{
                font-size: 18px;
            }
        }
    }
    .box-success{
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: opacity .4s cubic-bezier(.4,0,.2,1);
        will-change: opacity;
        width: 400px;
        &-icon{
            width: 160px;
            min-width: 160px;
            height: 160px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0;
            i{
                font-size: 160px!important;
                color:$success;
            }
        }
        &-title{
            font-size: 26px;
            font-weight: 500;
            line-height: 40px;
            width: 100%;
        }
        &-content{
            text-align: left;
            padding: 0 15px;
            width: 100%;
            p{
                margin: 1em 0;
                font-size: 16px;
                line-height: 24px;
            }
        }
        &-button{
            .btn{
                min-width: 200px;
            }
        }
    }
</style>
