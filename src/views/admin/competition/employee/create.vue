<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-20">
                    <button @click="backEmployee" class="btn btn-outline-secondary btn-back"> 
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
                                    <strong>Title : </strong> <span>{{form.title}}</span>
                                </p>
                                <p>
                                    <strong>Total user: </strong> <span>{{form.users.length}}</span>
                                </p>
                                <p>
                                    <strong>Total question : </strong><span>{{ form.questions.length }}</span>
                                </p>
                                <p>
                                    <strong>Duration : </strong><span>{{ form.duration }}</span>
                                </p>
                            </div>
                            <div class="box-success-button">
                                <div class="text-center">
                                    <router-link :to="{name : 'ContestEmployee'}" class="btn btn-secondary">Back to list</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col col-12" v-else key="is-form-create">
                        <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                            <div class="card-body">
                                <div class="row m-b-20">
                                    <div class="col col-6">
                                        <div class="page-title">Create {{ type == 'code' ? 'Code' : 'Choice'}} Competition For Employee</div>
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
                                    <div class="col col-6">
                                        <div class="row">
                                            <div class="col col-12">
                                                <div class="form-group">
                                                    <label>Title</label>
                                                    <input class="form-control" v-model.trim="form.title" />
                                                    <transition name="fade" mode="out-in">
                                                        <div class="text-danger" v-if="$v.form.title.$invalid && formstate">
                                                            <small v-if="!$v.form.title.required" class="form-text text-danger">Title is required </small>
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
                                            <div class="col col-12">
                                                <div class="form-group">
                                                    <label>Date </label>
                                                    <datepicker class="vue-datepicker" v-model="form.date" ></datepicker>
                                                    <transition name="fade" mode="out-in">
                                                        <div class="text-danger" v-if="$v.form.date.$invalid && formstate">
                                                            <small v-if="!$v.form.date.required" class="form-text text-danger">Start date and End date is required </small>
                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                            <div class="col col-12">
                                                <div class="form-group">
                                                    <label>Description</label>
                                                    <textarea v-model.trim="form.description" class="form-control"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col col-6">
                                        <label>Future image</label>
                                        <file-picker v-model="form.image"  :extensions="['jpg', 'png', 'jpe', 'jpeg']"></file-picker>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.image.$invalid && formstate">
                                                <small v-if="!$v.form.image.required" class="form-text text-danger">Future image is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="col col-12">
                                        <hr>
                                        <div class="row m-b-20">
                                            <div class="col col-6">
                                                <label class="text-uppercase">Users</label>
                                            </div>
                                            <div class="col col-6">
                                                <div class="text-right">
                                                    <button @click.stop.prevent="show_modal_user = true" type="button" class="btn btn-secondary" v-if="form.users.length">
                                                        Choose Users
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col col-12" v-if="form.users.length">
                                                <table class="table">
                                                    <thead class="thead-dark">
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Name</th>
                                                            <th scope="col">Email</th>
                                                            <th scope="col" class="td-action"></th>
                                                        </tr> 
                                                    </thead>
                                                    <tbody >
                                                        <tr v-for="(item, index) in form.users" :key="`index_full_name_${index}`">
                                                            <td>
                                                                {{ index + 1}}
                                                            </td>
                                                            <td>{{ item.full_name | capitalize }}</td>
                                                            <td>{{item.email}}</td>
                                                            <td class="td-action text-center">
                                                                <a href="#" class="text-danger" @click.stop.prevent="form.users.splice(index,1)">
                                                                    <i class="material-icons">delete_forever</i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div v-else class="col col-12">
                                                <div class="box-empty ">
                                                    <div class="m-b-20">
                                                        <h3 class="empty-title">No users selected</h3>
                                                    </div>
                                                    <div>
                                                        <button @click.stop.prevent="show_modal_user = true" type="button" class="btn btn-secondary">
                                                            Choose user
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <transition name="fade" mode="out-in">
                                                <div class="col col-12 text-danger" v-if="$v.form.users.$invalid && formstate">
                                                    <small v-if="!$v.form.users.required" class="form-text text-danger">users is required</small>
                                                </div>
                                            </transition>
                                        </div>
                                        <div class="row">
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
                                </div>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
            <confirm-dialog ref="confirm"></confirm-dialog>
            <modal-template v-model="show_modal_template" :on-save="onSelectTemplate" :type="type"></modal-template>
            <modal-user :users="form.users" v-model="show_modal_user" :on-save="onSelectUser"></modal-user>
        </div>
    </transition>
    
</template>
<script>
import { required , requiredIf , email , minLength , integer  , minValue} from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import ConfirmDialog from '@/components/confirm-dialog'
import ModalTemplate from '@/views/admin/partials/modal-template'
import ModalUser from '@/views/admin/partials/modal-user'

import ChoiceQuestion from '@/views/admin/partials/choice-question'
import ListQuestion from '@/views/admin/partials/list-question'
import ItemQuestion from '@/components/item-question'
import lodash from 'lodash'
import Datepicker from '@/components/datepicker'
import FilePicker from '@/views/admin/partials/file-picker'
import CompetitionBack from '@/mixins/competition-back'
import moment from 'moment'
export default {
    name : 'CreateCompetition',
    mixins : [CompetitionBack],
    components:{
        ConfirmDialog , ModalTemplate , ModalUser , ItemQuestion, Datepicker , ChoiceQuestion , ListQuestion , FilePicker
    },
    props:{
        type : {

        }
    },
    data(){
        return {
            is_loading : true,
            is_sending : false,
            is_success : false,
            show_modal_template : false,
            show_modal_user: false,
            min_test_case : 10,
            formstate: false,
            form :{
                title : '',
                duration : '',
                description: '',
                date: {
                    start_date : '',
                    end_date : ''
                },
                image: '',
                users: [],
                questions : [],
            },
            datepicker : {
                'night': 'Day',
                'nights': 'Days',
                'check-in': 'Start date',
                'check-out': 'End date',
                'day-names': [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                'month-names': [ "January","February","March","April","May","June","July","August","September","October","November","December" ],
            }
        }
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
                formdata.append('type' , 'user')
                formdata.append('type_question' , this.type)
                formdata.append('title' , this.form.title)
                formdata.append('start_date' ,moment(this.form.date.start_date).format('YYYY-MM-DD') )
                formdata.append('end_date' , moment(this.form.date.end_date).format('YYYY-MM-DD'))
                formdata.append('duration' , this.form.duration)
                formdata.append('description' , this.form.description)
                formdata.append('image' , this.form.image.file)
                
                this.form.questions.forEach(item=>{
                    formdata.append('question_ids[]' , item.id)
                })
                this.form.users.forEach(item=>{
                    formdata.append('user_ids[]' , item.id)
                })
                this.createCompetition(formdata).then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Create competition successfully !')
                        this.is_success = true
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
        onSelectUser(data){
            this.form.users = data
        },
        onSelectTemplate(data){
            this.form.questions = data 
        },
    },
    validations(){
        var vm = this
        return {
            form : {
                title : {
                    required
                },
                duration: {
                    required , integer , minValue : minValue(1)
                },
                date :{
                    start_date : {
                        required
                    },
                    end_date : {
                        required
                    },
                },
                image:{
                    required
                },
                users: {
                    required
                },
                questions: {
                    required
                },
                
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
