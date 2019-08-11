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
                <div class="col col-12" v-if="is_loading_error">
                    <div class="box-empty p-t-50 p-b-50 text-center" v-if="is_loading_error == 404">
                        <h3>Data not found !</h3>
                    </div>
                    <div class="box-empty p-t-50 p-b-50 text-center" v-else>
                        <h3>Oops.. Something Went Wrong.. !</h3>
                    </div>
                </div>
                <div class="col col-12"  >
                    <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                        <div class="row m-b-20">
                            <div class="col col-6">
                                <div class="page-title">Update Guest</div>
                            </div>
                            <div class="col col-6">
                                <div class="text-right">
                                    <button class="btn btn-primary min-width-100" type="submit">
                                        Update Guest
                                    </button>
                                </div>
                            </div>
                            </div>
                        <div class="row">
                            <div class="col col-6">
                                <div class="row">
                                    <div class="col col-12">
                                        <div class="form-group">
                                            <label>Full name</label>
                                            <input class="form-control" v-model.trim="form.full_name" />
                                            <transition name="fade" mode="out-in">
                                                <div class="text-danger" v-if="$v.form.full_name.$invalid && formstate">
                                                    <small v-if="!$v.form.full_name.required" class="form-text text-danger">Full name is required </small>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                    <div class="col col-12">
                                        <div class="form-group">
                                            <label>Email</label>
                                            <input class="form-control" v-model.trim="form.email" />
                                            <transition name="fade" mode="out-in">
                                                <div class="text-danger" v-if="$v.form.email.$invalid && formstate">
                                                    <small v-if="!$v.form.email.required" class="form-text text-danger">Email is required </small>
                                                    <small v-if="$v.form.email.required && $v.form.email.email" class="form-text text-danger">Email is notvalid </small>
                                                </div>
                                            </transition>
                                        </div>
                                    </div>
                                    <div class="col col-12">
                                        <div class="form-group">
                                            <label>Code</label>
                                            <input class="form-control" v-model.trim="form.code" :disabled="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col col-6">
                                <label>CV file</label>
                                <file-picker v-model="form.cv_file" :current.sync="form.current_cv_file"></file-picker>
                                <transition name="fade" mode="out-in">
                                    <div class="text-danger" v-if="$v.form.cv_file.$invalid && formstate">
                                        <small v-if="!$v.form.cv_file.required" class="form-text text-danger">CV file is required </small>
                                    </div>
                                </transition>
                            </div>
                        </div>
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
import FilePicker from '@/views/admin/partials/file-picker'
export default {
    name : 'EditEmployee',
    mixins : [GuestBack],
    components:{
        ConfirmDialog  , FilePicker
    },
    data(){
        return {
            is_loading : true,
            is_loading_error: false,
            is_sending : false,
            is_success : false,
            is_loading_question: false,
            is_error : false,
            formstate: false,
            form :{
                id : '',
                full_name : '',
                email: '',
                cv_file : '',
                current_cv_file : '',
                code : ''
            },
            
        }
    },
    methods:{
        ...mapActions({
            getGuest :  'User/GET_GUEST',
            updateGuest: 'User/UPDATE_GUEST',
        }),
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid ){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to create this guest ?',
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
                var formdata = new FormData;
                formdata.append('full_name' ,this.form.full_name  )
                formdata.append('email' ,this.form.email  )
                if( this.form.current_cv_file == null && this.form.cv_file ){
                    formdata.append('cv_file' , this.form.cv_file.file )
                }
                this.updateGuest({ id : this.form.id , formdata }).then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Update guest successfully !')
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
                    required: requiredIf(function (nested) {
                        return nested.guest == null 
                    })
                },
                email: {
                    required: requiredIf(function (nested) {
                        return nested.guest == null 
                    }), 
                    email 
                },
                cv_file : {
                    required: requiredIf( (nested)=>{
                        return this.form.current_cv_file == null 
                    })
                },
            }
        }
    },
    created(){
        this.is_loading = true
        this.getGuest(this.$route.params.id).then((res)=>{
            let { status , data } = res.data 
            if( status ){
                this.form = {
                    id : data.id,
                    full_name : data.full_name,
                    email: data.email,
                    cv_file : '',
                    current_cv_file : {
                        src : data.cv_file,
                        type : data.cv_file.replace(/^.*\./, '').toLowerCase()
                    },
                    code : data.code
                }
            }else{
                this.is_loading_error = true
            }
        })
        .catch(()=>{
            this.is_loading_error = true
        })
        .finally(()=>{
            this.is_loading = false
        })
    }
}
</script>
<style lang="scss" scoped>
    .create-competition{
        label{
            font-weight: 500;
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
