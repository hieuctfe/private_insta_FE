<template>
    <div >
        <div class="app-test-layout-toolbar">
            <div class="row">
                <div class="col col-3 align-items-center p-t-10">
                    Hello {{ user.full_name }} !
                </div>
                <div class="col col-6">
                    <ul>
                        <li>
                            <button @click="navQuestion(false)" type="button" class="btn btn-outline-secondary">Prev</button>
                        </li>
                        <li v-for="(question , index) in questions " :key="`question_index${index}`">
                            <button @click="changeQuestion(index)" type="button" class="btn" :class="setClass(index)">
                                {{ index + 1}}
                            </button>
                        </li>
                        <li>
                            <button @click="navQuestion(true)" type="button" class="btn btn-outline-secondary">Next</button>
                        </li>
                    </ul>
                </div>
                <div class="col col-3 text-right align-items-center">
                    <button class="btn m-r-15">
                        <span>Time remaining &nbsp; </span>
                        <count-down v-model="count_down"></count-down>
                    </button>
                    <button @click.stop.prevent="handleSubmit" class="btn btn-primary m-r-15">Finish Test</button>
                    <button @click.stop.prevent="handleLogout" class="btn btn-outline-secondary m-r-15">Logout</button>
                </div>
            </div>
        </div>
        <div class="app-test-layout-wrapper">
            <transition name="fade-in" mode="out-in" tag="div">
                <template v-for="(item ,index) in questions" >
                    <div class="container" :key="`list_index_${index}`"  v-if="is_actived == index ">
                        <div class="row">
                            <div class="col col-7 m-b-10">
                                <div class="question-title">
                                    Question
                                </div>
                                <div class="question-description">
                                    <markdown-html v-model="item.threads"></markdown-html>
                                </div>
                            </div>
                            <div class="col col-7 m-b-10">
                                <div class="question-title">
                                    Test case
                                </div>
                                <div class="question-description">
                                    <div v-for="(test_case, index_test_case) in item.test_cases" :key="`test_case${index_test_case}`">
                                        {{ item.func_name }}( {{test_case.params_string}} ) => {{ test_case.result}}
                                    </div>
                                </div>
                            </div>
                            <div class="col col-6 ">
                                <div class="question-editor">
                                    <codemirror class="min-height-400" v-model.trim="item.answers.answer" :options="codeOptions"></codemirror>
                                </div>
                                <div class="text-right m-t-20 ">
                                    <button :disabled="is_loading_submit" class="btn btn-primary btn-lg question-submit" @click.stop.prevent="onSubmit()">
                                        <span class="icon-loading" v-if="is_loading_submit"></span>
                                        <template v-else>Submit</template>
                                    </button>
                                </div>
                            </div>
                            <div class="col col-6">
                                <transition name="fade" mode="out-in">
                                    <div  v-if="item.answers.status && !is_loading_submit">
                                        <template  v-if="item.answers.message">
                                            <div class="text-danger">
                                                {{ item.answers.message }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <table class="table table-bordered m-b-10" v-if="item.answers.test_case.length">
                                                <thead>
                                                    <tr>
                                                        <th>Test case</th>
                                                        <th>Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <template v-for="(test_case , test_case_index)  in item.answers.test_case" >
                                                        <tr  :key="`index_test${test_case_index}`">
                                                            <td>{{ item.func_name }}( {{test_case.params_string}} ) => {{ test_case.result}} </td>
                                                            <td :class="test_case.correct ? 'text-success' : 'text-danger'">
                                                                <strong>{{ test_case.correct ? 'true' : 'false'   }}</strong>
                                                            </td>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                            <div class="m-b-10">
                                                <strong>Time execute </strong> : {{ item.answers.execute_time }} ms
                                            </div>
                                            <div class="m-b-10">
                                                <strong>Memory used </strong> : {{ item.answers.memory_used }} byte
                                            </div>
                                            <div class="m-b-10">
                                                <h3>
                                                    <strong>Result  </strong> : 
                                                    <span class="d-inline-block" :class="item.answers.total == item.answers.total_correct ? 'text-success' : 'text-danger'">
                                                        {{ item.answers.total == item.answers.total_correct ? 'Correct' : 'Incorrect' }} 
                                                    </span>
                                                </h3>
                                            </div>
                                        </template>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                </template>
            </transition>
        </div>
        <confirm-dialog ref="confirm"></confirm-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import CountDown from '@/components/count-down'
import { codemirror } from 'vue-codemirror'
import { required , requiredIf , email , minLength  } from 'vuelidate/lib/validators'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/theme/eclipse.css'
import ConfirmDialog from '@/components/confirm-dialog'
import MarkdownHtml from '@/components/markdown-html'
export default {
    name : 'TestCodeQuestion',
    components:{
        CountDown , ConfirmDialog , codemirror , MarkdownHtml
    },
    props:{
        data :{
            type : Array,
            required : true
        },
        countDown : {},
        id :{}
    },
    data(){
        return {
            is_loading : false,
            is_loading_submit: false,
            is_error : false,
            is_error_code: null,
            count_down: 0,
            is_actived: 0,
            codeOptions:{
                tabSize: 4,
                lineNumbers: true,
                matchBrackets: true,
                mode: {
                    name: 'php',
                    startOpen: true
                },
                theme: 'eclipse',
                indentUnit: 4,
                indentWithTabs: true,
                enterMode: "keep",
                tabMode: "shift",
                styleActiveLine: true,
                showCursorWhenSelecting: true,
            },
            questions : [],
            start_code: ''
        }
    },
    computed:{
        ...mapGetters({
            user : 'getUser'
        })
    },
    methods:{
        ...mapActions({
            answer : 'Competition/ANSWER',
            finish : 'Competition/FINISH',
            logout : 'LOGOUT'
        }),
        setClass(index){
            if( this.is_actived == index) return 'btn-primary'
            if( this.questions[index].answers && this.questions[index].answers.correct == 1  ) return 'btn-success'
            return 'btn btn-outline-secondary'
        },
        navQuestion(params){
            if( this.is_loading_submit ) return;
            if( params ){
                if( this.is_actived <= this.questions.length - 2 ){
                    this.is_actived++
                }
            }else{
                if( this.is_actived > 0 ){
                    this.is_actived--
                }
            }
        },
        changeQuestion(params){
            if( this.is_loading_submit ) return;
            if( this.is_actived != params ){
                this.is_actived = params 
            }
        },
        onSubmit(){
            if( this.is_loading_submit ) return;
            this.is_loading_submit = true 
            var index = this.is_actived
            this.answer({
                id : this.id ,
                question_id: this.questions[index].id,
                answer : this.questions[index].answers.answer,
            }).then((res)=>{
                let { status , data , message = null } = res.data 
                if( status ){
                    var answer = Object.assign( this.questions[index].answers,data , { correct : data.total == data.total_correct ? 1 : 0 } , { message });
                    this.$set(this.questions[index] , 'answers' , answer)
                }else{
                    this.$set(this.questions[index].answers , 'correct' , 0)
                    this.$set(this.questions[index].answers , 'message' , message)
                }
            })
            .catch((error)=>{
                let { message = '' } = error.response.data
                this.$set(this.questions[index].answers , 'correct' , 0)
                this.$set(this.questions[index].answers , 'message' , message)
            })
            .finally(()=>{
                this.$set(this.questions[index].answers , 'status' , true)
                this.is_loading_submit = false
            })
        },
        handleSubmit(){
            this.$refs.confirm.show({
                title : 'Confirm',
                content : 'Do you want to finish this test ?',
                btnSave : 'Finish',
                onSave :()=>{
                    return new Promise((resolve , reject) =>{
                        this.handleFinish().then((res)=>{
                            resolve()
                        })
                    })
                },
            })
        },
        handleLogout(){
            this.$refs.confirm.show({
                title : 'Confirm',
                content : 'Do you want to logout  ?',
                btnSave : 'Cancel',
                btnSave : 'Logout',
                onSave : () => {
                    return new Promise((resolve , reject) =>{
                        this.logout()
                        resolve()
                    })
                }
            })
        },
        handleTimeout(){
            this.finish({ id : this.id})
            this.$refs.confirm.show({
                title : 'Alert',
                content : 'Timeout',
                btnClose : 'Oke',
                btnCloseClass : 'btn btn-primary',
                btnSaveShow : false,
                onClose :()=>{
                    return new Promise((resolve , reject) =>{
                        this.redirect({name : 'CompetitionResult' , params : { id : this.id}})
                        resolve()
                    })
                },
            })
        },
        handleFinish(){
            return new Promise((resolve, reject)=>{
                this.finish({
                    id : this.id
                }).then((res)=>{
                    let { status } = res.data 
                    if( status ){
                        this.$toasted.success('Finish successfully !')
                        this.redirect({name : 'CompetitionResult' , params : { id : this.id}})
                    }
                }).finally(()=>{
                    resolve()
                })
            });
        }
    },
    watch:{
        is_actived : function(value){
            this.$set(this.questions[value].answers , 'status' , false)
        }
    },
    created(){
        this.questions = JSON.parse(JSON.stringify(this.data))
        this.count_down = this.countDown
        this.$nextTick(()=>{
            this.$watch('count_down', function(value){
                if( value == 0 ){
                    this.handleTimeout()
                }
            })
        })
    },
}
</script>
<style lang="scss" scoped>
    .app-test-layout{
        height: 100vh;
        width: 100%;
        position: relative;
        overflow: hidden auto;
        &-toolbar{
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            padding: 15px 15px;
            background: #fff;
            z-index: 11;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
            .btn{
                display: inline-flex;

            }
            ul{
                display: block;
                width: 100%;
                padding: 0;
                margin: 0;
                text-align: center;
                li{
                    display: inline-block;
                    margin: 0 10px;
                    .btn{
                        height: 38px;
                        min-width: 38px;
                    }
                }
            }
        }
        &-wrapper{
            padding: 30px 0;
            .question{
                &-title{
                    font-size: 16px;
                    font-weight: bold;
                }
                &-editor{
                    min-height: 400px;
                }
                &-submit{
                    min-width: 150px;
                }
            }
        }
        &-error{
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .box-error{
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                transition: opacity .4s cubic-bezier(.4,0,.2,1);
                will-change: opacity;
                width: 100%;
                padding: 20px;
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
                &-btn{
                    .btn{
                        min-width: 200px;
                    }
                }
            }

        }
    }
</style>
