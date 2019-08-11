<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-question" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12" >
                    <form class="card" @submit.stop.prevent="onSubmit()" novalidate>
                        <div class="card-body">
                            <div class="row m-b-20">
                                <div class="col col-6">
                                    <div class="page-title">
                                        Detail Question
                                    </div>
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
                                    <div class="form-group">
                                        <label>Start code</label>
                                        <codemirror class="min-height-150" v-model.trim="form.start_code" :options="codeOptions"></codemirror>
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.start_code.$invalid && formstate">
                                                <small v-if="!$v.form.start_code.required" class="form-text text-danger">Start code is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="form-group">
                                        <label>Function name</label>
                                        <input class="form-control" v-model.trim="form.func_name" :disabled="true"  />
                                        <transition name="fade" mode="out-in">
                                            <div class="text-danger" v-if="$v.form.func_name.$invalid && formstate">
                                                <small v-if="!$v.form.func_name.required" class="form-text text-danger">Function name is required </small>
                                            </div>
                                        </transition>
                                    </div>
                                </div>
                                <div class="col col-6">
                                    <div class="form-group">
                                        <label>Test case</label>
                                    </div>
                                    <template v-if="!isTestCaseValid && formstate">
                                        <p class="text-danger">
                                            All test case must be same as number of param
                                        </p>
                                    </template>
                                    <label class="material-checkbox" >
                                        <input type="checkbox" v-model="form.is_auto_general_test_case"> <span>Auto general test case</span>
                                    </label>
                                    <transition name="fade" mode="out-in">
                                        <div v-if="form.is_auto_general_test_case" key="is_auto_general_test_case_true" class="m-b-30">
                                            <codemirror class="min-height-150" v-model.trim="form.auto_generate_testcase" :options="codeOptions"></codemirror>
                                            <div class="input-group  m-t-20 m-b-10">
                                                <vue-numeric :min="min_general_test_case"  v-model="form.auto_generate_testcase_total" inputClass="form-control"></vue-numeric>
                                                <div class="input-group-append">
                                                    <button class="btn btn-primary min-width-100" type="button"  @click.stop.prevent="generalTestCase">
                                                        <div class="icon-loading" v-if="is_general"></div>
                                                        <template v-else>General</template>
                                                    </button>
                                                </div>
                                            </div>
                                            <transition name="fade" mode="out-in">
                                                <div class="text-danger" v-if="is_general_error">
                                                    {{ is_general_message }}
                                                </div>
                                            </transition>
                                        </div>
                                    </transition>
                                    <div class="row">
                                        <div class="col col-7">
                                            <label >Params</label>
                                        </div>
                                        <div class="col col-4">
                                            <label >Result</label>
                                        </div>
                                    </div>
                                    <div class="row m-b-10 row-test-case" v-for="(item, index) in form.test_case" :key="`test_case_index${index}`">
                                        <div class="col col-7">
                                            <input-tag v-model="item.param" :add-on-key="[13,188]" placeholder="Add param"></input-tag>
                                        </div>
                                        <div class="col col-5 col-result p-l-0">
                                            <div class="inline-result">
                                                <input type="text" class="form-control" v-model.trim="item.result">
                                            </div>
                                            <div class="inline-action">
                                                <checkbox v-model="item.show" label=""></checkbox>
                                                <a  @click.stop.prevent="removeTestCase(index)" :disabled="form.test_case.length <= 10">
                                                    <i class="material-icons text-danger">delete_forever</i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary btn-block" type="button" @click="addTestCase">+ add more test case</button>
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
import CodeQuestion from '@/mixins/code-question'
export default {
    name : 'UpdateCodeQuestion',
    mixins : [QuestionBack , CodeQuestion],
    props :{
        data : {
            type : Object,
            required : true,
        }
    },
    methods:{
        onSubmit(){
            this.formstate = true 
            if( !this.is_sending && !this.$v.form.$invalid && this.isTestCaseValid){
                this.$refs.confirm.show({
                    title : 'Confirm',
                    content : 'Do you want to update this question ?',
                    btnSave : 'Update',
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
                var formdata =  {
                    category_id : this.form.category_id,
                    func_name : this.form.func_name,
                    is_hit : this.form.is_hit,
                    level : this.form.level,
                    start_code : this.form.start_code,
                    test_case : this.form.test_case,
                    threads : this.form.threads,
                    hit : this.form.hit,
                    status : this.form.status,
                }
                if( this.form.is_auto_general_test_case ){
                    formdata['auto_general_test_case'] = this.form.auto_general_test_case
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
            return {
                param : item.params,
                result : item.result,
                show : item.show
            }
        })
            
        this.form = Object.assign( this.form, this.data , { test_case });
        try {
            await this.getCategory()
        } catch (e) { }
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
