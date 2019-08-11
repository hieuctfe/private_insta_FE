<template>
    <div >
        <div class="app-test-layout-toolbar">
            <div class="row">
                <div class="col  col-6 align-items-center p-t-10">
                    Hello {{ user.full_name }} !
                </div>
                <div class="col col-6 text-right align-items-center">
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
            <div class="container">
                <div class="row-test">
                    <div class="col-left">
                        <template v-for="(item ,index) in questions" >
                            <div class="row" :key="`list_index_${index}`"  :id="`question__${index}`">
                                <div class="col col-12 m-b-10">
                                    <div class="question-title m-b-10">
                                        Question {{ index + 1}}
                                    </div>
                                    <div class="question-description">
                                        <markdown-html v-model="item.threads"></markdown-html>
                                    </div>
                                    <div class="question-description" v-if="item.is_hit == VUE_APP_IS_TRUE">
                                        <markdown-html v-model="item.hit"></markdown-html>
                                    </div>
                                </div>
                                <div class="col col-12 m-b-10">
                                    <div class="question-answer">
                                        <ul>
                                            <li v-for="(test_case, index_test_case) in item.test_cases_choice" :key="`test_case${index_test_case}`">
                                                <label @change="saveLocal" class="material-checkbox" v-if="item.multi_answer == VUE_APP_IS_TRUE">
                                                    <input type="checkbox" v-model="item.answers.answer" :value="test_case.id">
                                                    <span>{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                                </label>
                                                <label @change="saveLocal" class="material-radio" v-else-if="item.multi_answer == VUE_APP_IS_FALSE">
                                                    <input type="radio" v-model="item.answers.answer" :value="test_case.id">
                                                    <span>{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="col-right">
                        <div class="app-test-layout-sidebar">
                            <ul >
                                <li  v-for="(item ,index) in questions" :key="`list_index_index_${index}`">
                                    <div @click.stop.prevent="scrollTo(index)" class="item-sidebar">
                                        <a href="#">Question {{ index + 1}} </a>
                                    </div>
                                    <div>
                                        <div class="item-sidebar-answers">
                                            <ul>
                                                <li v-for="(test_case, index_test_case) in item.test_cases_choice" :key="`test_case${index_test_case}`">
                                                    <label @click.stop.prevent="" class="material-checkbox" v-if="item.multi_answer == VUE_APP_IS_TRUE">
                                                        <input type="checkbox" v-model="item.answers.answer" :value="test_case.id">
                                                        <span>{{index_test_case | number_code}}</span>
                                                    </label>
                                                    <label @click.stop.prevent="" class="material-radio" v-else-if="item.multi_answer == VUE_APP_IS_FALSE">
                                                        <input type="radio" v-model="item.answers.answer" :value="test_case.id">
                                                        <span>{{index_test_case | number_code}}</span>
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <confirm-dialog ref="confirm"></confirm-dialog>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import CountDown from '@/components/count-down'
import { codemirror } from 'vue-codemirror'
import { required , requiredIf , email , minLength  } from 'vuelidate/lib/validators'
import ConfirmDialog from '@/components/confirm-dialog'
import MarkdownHtml from '@/components/markdown-html'
import cookie from 'js-cookie'
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
        handleTimeout(){
            var answers = []
            this.questions.forEach((item)=>{
                var result = []
                if( item.multi_answer == this.VUE_APP_IS_TRUE ){
                    result = item.answers.answer
                }else{
                    result = item.answers.answer != null && item.answers.answer != '' ?  [item.answers.answer] : []
                }
                answers.push({
                    question_id: item.id,
                    test_case_ids : result
                })
            })
            this.finish({ id : this.id , answers})
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
            var answers = []
            this.questions.forEach((item)=>{
                var result = []
                if( item.multi_answer == this.VUE_APP_IS_TRUE ){
                    result = item.answers.answer
                }else{
                    result = item.answers.answer != null && item.answers.answer != '' ?  [item.answers.answer] : []
                }
                answers.push({
                    question_id: item.id,
                    test_case_ids : result
                })
            })
            return new Promise((resolve, reject)=>{
                this.finish({
                    id : this.id,
                    answers
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
        },
        saveLocal(){
            var  result = {}
            this.questions.forEach( item =>{
                result[item.id] = item.answers.answer
            })
            var time = this.count_down / ( 60 * 60 * 24)
            cookie.set(`test__${this.id}` , JSON.stringify(result) , {
                expires : time
            })
        },
        setLocal(){

        },
        scrollTo(index){
            $([document.documentElement, document.body]).animate({
                scrollTop: $(`#question__${index}`).offset().top - 80
            }, 500);
        },
        isChecked(item){
            if( item.multi_answer == this.VUE_APP_IS_TRUE ){
                return item.answers.answer.length ? true : false
            }else{
                return item.answers.answer != null && item.answers.answer != '' ? true : false
            }
        }
    },
    created(){
        var result = cookie.get(`test__${this.id}`)
        if( result ){
            result = JSON.parse(result)
        }
        this.questions = this.data.map((item)=>{
            if( item.multi_answer == this.VUE_APP_IS_TRUE ){
                item.answers.answer = [] 
            }else{
                item.answers.answer = ''
            }
            if( result && result.hasOwnProperty(item.id)){
                item.answers.answer = result[item.id]
            }
            return item;
        })
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
        width: 100%;
        position: relative;
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
        &-sidebar{
            position: sticky;
            top: 75px;
            right: 0;
            height: calc(100vh - 120px);
            overflow: hidden auto;
            > ul{
                padding: 0;
                margin: 0;
                list-style-type: none;
                padding: 15px;
                border: 1px solid #eee;
                li{
                    display: block;
                    margin-bottom: 10px;
                    .item-sidebar{
                        color:$text;
                        font-size: 16px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        a{
                            color:$text;
                        }
                        i{
                            margin-right: 15px;
                            width: 24px;
                            text-decoration: none;
                        }
                        &-answers{
                            ul{
                                margin: 0;
                                padding: 0;
                                list-style-type: none;
                                li{
                                    display: inline-block;
                                    margin-bottom: 0;
                                    margin-right: 15px;
                                    .material-radio > span::before{
                                        margin-right: 5px;
                                    }
                                    .material-checkbox > span::before{
                                        margin-right: 5px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        &-wrapper{
            padding: 30px 0;
            .row-test{
                display: flex;
                flex-wrap: nowrap;
                flex-direction: row;
                .col{
                    &-left{
                        width: calc(100% - 330px);
                        padding-right: 30px;
                    }
                    &-right{
                        width: 330px;
                    }
                }
            }
            
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
                &-answer{
                    ul{
                        list-style-type: none;
                        padding: 0 0 0 15px;
                        li{

                        }
                    }
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
