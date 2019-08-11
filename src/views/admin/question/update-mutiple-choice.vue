<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-question" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12">
                    <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                        <div class="card-body">
                            <div class="row m-b-20">
                                <div class="col col-6">
                                    <div class="page-title">Detail Question</div>
                                </div>
                                <div class="col col-6">
                                    <div class="text-right">
                                        <button class="btn btn-primary min-width-100" type="submit">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col col-6">
                                    <div class="form-group">
                                        <checkbox v-model="form.status" label="Allow show question"></checkbox>
                                    </div>
                                    <div class="form-group">
                                        <label>Threads</label>
                                        <markdown-editor v-model.trim="form.threads" ></markdown-editor>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.threads.$invalid && formstate">
                                                <small v-if="!$v.form.threads.required" class="form-text text-danger">Threads is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="form-group">
                                        <checkbox v-model="form.is_hit" label="Show hit"></checkbox>
                                    </div>
                                    <div class="form-group" v-if="form.is_hit == VUE_APP_IS_TRUE">
                                        <label>Hit</label>
                                        <markdown-editor class="min-height-200" v-model="form.hit"></markdown-editor>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.hit.$invalid && formstate">
                                                <small v-if="!$v.form.hit.required" class="form-text text-danger">Hit is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="form-group">
                                        <label>Level</label>
                                        <select class="form-control" v-model="form.level">
                                            <option value="">Select level questions</option>
                                            <option v-for="(item, index) in levels"   :key="`level_${index}`" :value="item">{{ item }}</option>
                                        </select>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.level.$invalid && formstate">
                                                <small v-if="!$v.form.level.required" class="form-text text-danger">Level is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="form-group">
                                        <label>Category</label>
                                        <select class="form-control" v-model="form.category_id">
                                            <option value="">Select category</option>
                                            <option v-for="(item, index) in categories"   :key="`level_${index}`" :value="item.id">{{ item.title }}</option>
                                        </select>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.category_id.$invalid && formstate">
                                                <small v-if="!$v.form.category_id.required" class="form-text text-danger">Category is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                </div>
                                <div class="col col-6">
                                    <div class="form-group">
                                        <label>Question</label>
                                    </div>
                                    <label class="material-checkbox">
                                        <checkbox v-model="form.multi_answer" label="Multiple Answer"></checkbox>
                                    </label>
                                    <transition name="fade" mode="out-in">
                                        <div class="text-danger m-b-20" v-if="$v.form.test_case.$invalid && formstate">
                                            <div v-if="!$v.form.test_case.required ">
                                                <small>Answers is required</small>
                                            </div>
                                            <div v-if="!$v.form.test_case.minLength ">
                                                <small>Question must have at least 4 answers</small>
                                            </div>
                                            <div v-if="!$v.form.test_case.isAnswer ">
                                                <small>Please choose right answer before submit</small>
                                            </div>
                                        </div>
                                    </transition>
                                    <div class="row m-b-10 row-test-case" v-for="(item, index) in form.test_case" :key="`test_case_index${index}`">
                                        <div class="col col-10">
                                            <input type="text" class="form-control" v-model.trim="item.param">
                                            <transition name="fade" mode="out-in">
                                                <div class="text-danger" v-if="isErrorAnswer(index)">
                                                    <small>Answers is required</small>
                                                </div>
                                            </transition>
                                        </div>
                                        <div class="col col-1 p-t-5">
                                            <transition name="fade" mode="out-in">
                                                <label v-if="form.multi_answer == VUE_APP_IS_TRUE" class="material-checkbox" :key="`index_${index}_multi_answer`">
                                                    <input type="checkbox" v-model="item.result" :value="item.id"><span></span>
                                                </label>
                                                <label v-else class="material-radio" :key="`index_${index}_non_multi_answer`">
                                                    <input type="radio" v-model="form.single_answer" :value="item.id"><span></span>
                                                </label>
                                            </transition>
                                            
                                        </div>
                                        <div class="col col-1 p-t-5">
                                            <a  @click.stop.prevent="removeTestCase(index)" :disabled="index <= 2">
                                                <i class="material-icons text-danger">delete_forever</i>
                                            </a>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-block" type="button" @click="addTestCase">+ add more answer</button>
                                </div>
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
import QuestionBack from '@/mixins/question-back'
import MulitipleQuestion from '@/mixins/multiple-question'
import helper from '@/plugins/helper'
export default {
    name : 'UpdateMulitiChoiceQuestion',
    mixins : [QuestionBack , MulitipleQuestion],
    props:{
        data : {
            type : Object,
            required : true,
        }
    },
    methods:{
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid ){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to update this question ?',
                    btnSave : 'Update Question',
                    onSave : () => {
                        return new Promise((resolve , reject) =>{
                            this.postUpdateQuestion().finally((res)=>{
                                resolve()
                            })
                        })
                    }
                })
                                
            }
        },
        postUpdateQuestion(){
            return new Promise((resolve, reject)=>{
                this.is_sending = true
                var formdata = {
                    type_question: this.form.type_question,
                    threads: this.form.threads,
                    status : this.form.status,
                    is_hit: this.form.is_hit,
                    hit: this.form.hit,
                    level : this.form.level,
                    multi_answer: this.form.multi_answer,
                    category_id: this.form.category_id,
                    test_case : []
                }
                if( this.form.multi_answer == this.VUE_APP_IS_TRUE){
                    formdata.test_case = this.form.test_case.map((item)=>{
                        return { 
                            param : item.param,
                            result : item.result,
                            show : this.VUE_APP_IS_TRUE
                        }
                    })
                }else{
                    formdata.test_case = this.form.test_case.map((item)=>{
                        return { 
                            param : item.param,
                            result : item.id == this.form.single_answer ? true : false,
                            show : this.VUE_APP_IS_TRUE
                        }
                    })
                }
                this.updateQuestion({
                    id : this.form.id,
                    formdata
                }).then(res=>{
                    let { status , data }  = res.data 
                    if( status ){
                        this.$toasted.success('Create question successfully !')
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
    async created(){
        let test_case = this.data.test_case.map((item)=>{
            var id = helper.createId()
            if( this.data.multi_answer == this.VUE_APP_IS_TRUE ){
                var result = item.result == "1" ? true : false 
                return {
                    id : id,
                    param : item.params,
                    result : item.result == 1 ? true : false 
                }
            }else{
                if( item.result == 1){
                    this.form.single_answer = id
                }
                return {
                    id : id,
                    param : item.params,
                    result : '',
                }
            }
        })
        this.form = Object.assign( this.form, this.data );
        this.$nextTick(()=>{
            this.$set(this.form , 'test_case' , test_case)
        })
        try {
            await this.getCategory()
        } catch (e) {
            console.log(e)
        } finally {
            
        }
        this.is_loading = false
    }
}
</script>
<style lang="scss" scoped>
    .create-question{
        label{
            font-weight: 500;
        }
        
        .row-test-case{
            user-select: none;
            .col-result{
                display: flex;
                flex-wrap: nowrap;
                
                .inline{
                    &-result{

                    }
                    &-action{
                        display: flex;
                        flex-wrap: nowrap;
                        padding-top: 7px;
                        padding-left: 10px;
                        user-select: none;
                        .d-inline-block{
                            width: 32px;
                        }
                        .material-checkbox{
                            margin-bottom: 0;
                        }
                        a{
                            cursor: pointer;
                        }
                        a:disabled,a[disabled]{
                            opacity: 0.5;
                            cursor: not-allowed;
                        }
                    }
                }
            }
            
        }
    }

</style>
