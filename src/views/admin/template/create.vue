<template>
    <div class="create-question" >
        <div class="row">
            <div class="col col-12 m-b-15">
                <button @click="back" class="btn btn-outline-secondary btn-back"> 
                    <i class="material-icons">arrow_back</i>&nbsp; Back to list
                </button>
            </div>
            <div class="col col-12">
                <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                    <div class="card-body">
                        <div class="row m-b-20">
                            <div class="col col-6">
                                <div class="page-title">Create Template</div>
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
                            <div class="col col-12">
                                <div class="form-group">
                                    <label>Template title</label>
                                    <input class="form-control" v-model.trim="form.title" />
                                    <transition name="fade" mode="out-in">
                                        <div class="text-danger" v-if="$v.form.title.$invalid && formstate">
                                            <small v-if="!$v.form.title.required" class="form-text text-danger">Template title is required </small>
                                        </div>
                                    </transition>
                                </div>
                            </div>
                            <div class="col col-12">
                                <hr>
                                <label class="text-uppercase">Selected questions</label>
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
        </div>
        <confirm-dialog ref="confirm"></confirm-dialog>
    </div>
</template>
<script>
import { required , requiredIf , email , minLength  } from 'vuelidate/lib/validators'
import ConfirmDialog from '@/components/confirm-dialog'
import { mapGetters, mapActions } from 'vuex';
import ItemQuestion from '@/components/item-question'
import ChoiceQuestion from '@/views/admin/partials/choice-question'
import ListQuestion from '@/views/admin/partials/list-question'
import lodash from "lodash"
import TemplateBack from '@/mixins/template-back'
export default {
    name : 'CreateTemplate',
    mixins : [TemplateBack],
    components:{
        ConfirmDialog , ItemQuestion , ChoiceQuestion , ListQuestion
    },
    props :{
        type : {

        }
    },
    data(){
        return {
            is_sending : false,
            formstate: false,
            form :{
                title : '',
                questions: []
            },
        }
    },
    computed:{
        ...mapGetters({
            levels : 'Question/getListLevel',
        })
    },
    methods:{
        ...mapActions({
            getListQuestion : 'Question/GET_LIST_QUESTION',
            createTemplate : 'Template/CREATE_TEMPLATE'
        }),
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid ){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to create this template ?',
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
                this.createTemplate({
                    title : this.form.title ,
                    question_ids : this.form.questions.map((item)=>item.id),
                    type_question : this.type
                }).then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Create template successfully !')
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
                title :{
                    required,
                },
                questions :{
                    required
                }
            }
        }
    },
}
</script>
<style lang="scss" scoped>
    label{
        font-weight: bold;
    }
    
</style>
