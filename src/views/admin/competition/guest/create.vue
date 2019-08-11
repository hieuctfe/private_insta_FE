<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-20">
                    <button @click="backGuest" class="btn btn-outline-secondary btn-back"> 
                        <i class="material-icons">arrow_back</i>&nbsp; Back to list
                    </button>
                </div>
                <transition name="fade" mode="out-in">
                    <div class="col col-12 text-center" v-if="is_success" key="is-create-sucess">
                        <div class="box-success">
                            <div class="box-success-icon">
                                <i class="material-icons ">
                                    check
                                </i>
                            </div>
                            <div class="box-success-title">
                                Create competition successfully
                            </div>
                            <div class="box-success-content">
                                <p>
                                    <strong>Full name : </strong> <span>{{form.full_name}}</span>
                                </p>
                                <p>
                                    <strong>Email : </strong> <span>{{form.email}}</span>
                                </p>
                                <p>
                                    <strong>Code : </strong> <span>{{form.code}}</span>
                                </p>
                                <p>
                                    <strong>Cv File : </strong><a :href="`https://docs.google.com/gview?url=${form.cv_file_path}&embedded=true`" target="_blank">File</a>
                                </p>
                                <p>
                                    <strong>Total question : </strong><span>{{ form.question_ids.length }}</span>
                                </p>
                                <p>
                                    <strong>Duration : </strong><span>{{ form.duration }}</span>
                                </p>
                            </div>
                            <div class="box-success-button">
                                <div class="text-center">
                                    <router-link :to="{name : 'ContestGuest'}" class="btn btn-secondary">Back to list</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col col-12" v-else key="is-form-create">
                        <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                            <div class="card-body">
                                <div class="row m-b-20">
                                    <div class="col col-6">
                                        <div class="page-title">Create {{ type == 'code' ? 'Code' : 'Choice'}} Competition For Guest</div>
                                    </div>
                                    <div class="col col-6">
                                        <div class="text-right">
                                            <button class="btn btn-primary min-width-100" type="submit">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col col-12 m-b-15">
                                        <transition name="fade" mode="out-in">
                                            <button v-if="form.guest" key="clear-guest" class="btn btn-danger" type="button" @click.stop.prevent="form.guest = null">
                                                Clear guest
                                            </button>
                                            <button v-else key="select-guest" class="btn btn-secondary" type="button" @click.stop.prevent="show_modal_guest = true">
                                                Select Guest For Competition
                                            </button>
                                            
                                        </transition>
                                    </div>
                                    <transition name="fade" mode="out-in">
                                        <div class="col col-12" v-if="form.guest" key="is-form-with-guest">
                                            <div class="row">
                                                <div class="col col-6">
                                                    <div class="row">
                                                        <div class="col col-12">
                                                            <div class="form-group">
                                                                <label>Full name</label>
                                                                <input class="form-control" v-model.trim="form.guest.full_name"  :disabled="true" />
                                                            </div>
                                                        </div>
                                                        <div class="col col-12">
                                                            <div class="form-group">
                                                                <label>Email</label>
                                                                <input class="form-control" v-model.trim="form.guest.email"   :disabled="true"/>
                                                            </div>
                                                        </div>
                                                        <div class="col col-12">
                                                            <div class="form-group">
                                                                <label>Code</label>
                                                                <input class="form-control" v-model.trim="form.guest.code"   :disabled="true"/>
                                                            </div>
                                                        </div>
                                                        <div class="col col-12">
                                                            <div class="form-group">
                                                                <label>Duration <small>( minute )</small></label>
                                                                <input class="form-control" v-model.trim="form.duration" />
                                                                <transition name="fade" mode="out-in">
                                                                    <div class="text-danger" v-if="$v.form.duration.$invalid && formstate">
                                                                        <small v-if="!$v.form.duration.required" class="form-text text-danger">Duration is required </small>
                                                                        <small v-if="!$v.form.duration.integer" class="form-text text-danger">Duration must be an integer  </small>
                                                                        <small v-if="$v.form.duration.integer && !$v.form.duration.minValue" class="form-text text-danger">Duration must be greater than 0</small>
                                                                    </div>
                                                                </transition>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col col-6">
                                                    <label>CV file</label>
                                                    <div class="upload-file" >
                                                        <a class="upload-file-review" target="_blank" :href="`https://docs.google.com/gview?url=${form.guest.cv_file}&embedded=true`">
                                                            <div class="upload-file-review-img" >
                                                                <img src="@/assets/icons/pdf.png" alt="">
                                                            </div>
                                                            <div class="upload-file-review-name">
                                                                {{ form.guest.cv_file | file_name}}
                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col col-12" v-else key="is-form-non-guest">
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
                                                                <label>Duration <small>( minute )</small></label>
                                                                <input class="form-control" v-model.trim="form.duration" />
                                                                <transition name="fade" mode="out-in">
                                                                    <div class="text-danger" v-if="$v.form.duration.$invalid && formstate">
                                                                        <small v-if="!$v.form.duration.required" class="form-text text-danger">Duration is required </small>
                                                                        <small v-if="!$v.form.duration.integer" class="form-text text-danger">Duration must be an integer  </small>
                                                                        <small v-if="$v.form.duration.integer && !$v.form.duration.minValue" class="form-text text-danger">Duration must be greater than 0</small>
                                                                    </div>
                                                                </transition>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col col-6">
                                                    <label>CV file</label>
                                                    <file-picker v-model="form.cv_file" ></file-picker>
                                                    <transition name="fade" mode="out-in">
                                                        <div class="text-danger" v-if="$v.form.cv_file.$invalid && formstate">
                                                            <small v-if="!$v.form.cv_file.required" class="form-text text-danger">CV file is required </small>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>
                                    </transition>
                                    <div class="col col-12">
                                        <hr>
                                        <div class="row m-b-20">
                                            <div class="col col-6">
                                                <label class="text-uppercase">Selected questions</label>
                                            </div>
                                            <div class="col col-6">
                                                <div class="text-right">
                                                    <button @click.stop.prevent="show_modal_template = true" type="button" class="btn btn-secondary" v-if="form.questions.length">
                                                        Choose competition template
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col col-12">
                                                <div class="row">
                                                    <transition name="fade" mode="out-in">
                                                        <div class="col col-12" v-if="form.questions.length" key="not-empty-question">
                                                            <list-question v-model="form.questions" :type="type"></list-question>
                                                        </div>
                                                        <div class="col col-12" v-else key="empty-question">
                                                            <div class="box-empty ">
                                                                <div class="m-b-20">
                                                                    <h3 class="empty-title">No questions selected</h3>
                                                                </div>
                                                                <button @click.stop.prevent="show_modal_template = true" type="button" class="btn btn-secondary">
                                                                    Choose competition template
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </transition>
                                                    <transition name="fade" mode="out-in">
                                                        <div class="col col-12 text-danger" v-if="$v.form.questions.$invalid && formstate">
                                                            <small v-if="!$v.form.questions.required" class="form-text text-danger">Please choose question before create template</small>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col col-12">
                                        <hr>
                                        <label class="text-uppercase">List questions</label>
                                        <div class="row">
                                            <div class="col col-12">
                                                <choice-question v-model="form.questions" :type="type"></choice-question>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
            <confirm-dialog ref="confirm"></confirm-dialog>
            <modal-template :type="type" v-model="show_modal_template" :on-save="onSelectTemplate"></modal-template>
            <modal-guest v-model="show_modal_guest" :on-save="onSelectGuest"></modal-guest>
        </div>
    </transition>
</template>
<script>
import { required , requiredIf , email , minLength , integer  , minValue} from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import ConfirmDialog from '@/components/confirm-dialog'
import ModalTemplate from '@/views/admin/partials/modal-template'
import ModalGuest from '@/views/admin/partials/modal-guest'
import ChoiceQuestion from '@/views/admin/partials/choice-question'
import ListQuestion from '@/views/admin/partials/list-question'
import ItemQuestion from '@/components/item-question'
import FilePicker from '@/views/admin/partials/file-picker'
import lodash from 'lodash'
import CompetitionBack from '@/mixins/competition-back'
export default {
    name : 'CreateCompetition',
    mixins : [CompetitionBack],
    components:{
        ConfirmDialog , ModalTemplate , ItemQuestion , ModalGuest , ChoiceQuestion , ListQuestion , FilePicker
    },
    props:{
        type : {
            
        }
    },
    data(){
        return {
            is_loading : false,
            is_sending : false,
            is_success : false,
            show_modal_template : false,
            show_modal_guest: false,
            formstate: false,
            form :{
                full_name : '',
                email: '',
                cv_file : '',
                question_ids: [],
                questions : [],
                duration: '',
                code : '',
                cv_file_path : '',
                type_question : '',
                guest: null
            },
        }
    },
    computed:{
        ...mapGetters({
            levels : 'Question/getListLevel',
            type_questions : 'Question/getType'
        }),
    },
    methods:{
        ...mapActions({
            createCompetition : 'Competition/CREATE_COMPETITION',
        }),
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid ){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to create this competition ?',
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
                var formdata = new FormData
                formdata.append('type' , 'guest')
                formdata.append('type_question' , this.type)
                if( this.form.guest ){
                    formdata.append('guest_id' , this.form.guest.id)
                }else{
                    formdata.append('full_name' , this.form.full_name)
                    formdata.append('email' , this.form.email)
                    formdata.append('cv_file' , this.form.cv_file.file)
                }
                formdata.append('duration' , this.form.duration)
                this.form.questions.forEach(item=>{
                    formdata.append('question_ids[]' , item.id)
                })
                this.createCompetition(formdata)
                .then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Create competition successfully !')
                        if( this.form.guest ){
                            this.backGuest()
                        }else{
                            this.form.code = data.code 
                            this.form.cv_file_path = data.cv_file
                            this.is_success = true
                        }
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
        onSelectTemplate(data){
            this.form.questions = data 
            this.form.question_ids = data.map(item=>item.id) 
        },
        onSelectGuest(data){
            this.form.guest = data 
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
                    required: requiredIf(function (nested) {
                        return nested.guest == null 
                    })
                },
                questions: {
                    required
                },
                duration: {
                    required , integer , minValue : minValue(1)
                }
            }
        }
    },
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
