import InputTag from '@/components/input-tag';
import { codemirror } from 'vue-codemirror'
import { required , requiredIf , email , minLength  } from 'vuelidate/lib/validators'
import { mapGetters, mapActions } from 'vuex'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/theme/eclipse.css'
import ConfirmDialog from '@/components/confirm-dialog'
import helper from '@/plugins/helper'
export default {
    components:{
        InputTag ,
        codemirror,
        ConfirmDialog
    },
    data(){
        return {
            is_loading : true,
            is_sending : false,
            min_test_case : 10,
            form :{
                type_question : 'choice',
                threads: '',
                is_hit: parseInt(process.env.VUE_APP_IS_FALSE),
                status : parseInt(process.env.VUE_APP_IS_TRUE),
                multi_answer : parseInt(process.env.VUE_APP_IS_FALSE),
                single_answer: '',
                hit: '',
                level : '',
                category_id: '',
                test_case : [],
                
            },
            formstate: false,
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
        }
    },
    computed:{
        ...mapGetters({
            levels : 'Question/getListLevel',
            categories: 'Question/getListCategoryChoice',
        }),
    },
    methods:{
        ...mapActions({
            createQuestion : 'Question/CREATE',
            updateQuestion : 'Question/UPDATE',
            getCategory : 'Question/GET_CATEGORY'
        }),
        isErrorAnswer(index){
            return this.$v.form.test_case.$each.$iter[index].$invalid && this.formstate
        },
        addTestCase(){
            this.form.test_case.push({
                id: helper.createId(),
                param : '',
                result : false
            })
        },
        removeTestCase(index){
            if( this.form.test_case.length  <= parseInt(process.env.VUE_APP_MIN_ANSWER_CHOICE_QUESTION)) return;
            if( this.form.test_case[index].id == this.form.single_answer  && this.form.multi_answer == this.VUE_APP_IS_FALSE ){
                this.form.single_answer = ''
            }
            this.form.test_case.splice(index,1)
        },
        setDisabledRemove(){
            return this.form.test_case.length  <= parseInt(process.env.VUE_APP_MIN_ANSWER_CHOICE_QUESTION) ? true : false
        }
    },
    watch :{
        'form.multi_answer' : function(value){
            if( value == parseInt(process.env.VUE_APP_IS_TRUE) ){
                this.form.test_case.map((item)=>{
                    item.result = false
                    return item
                })
            }else{
                this.form.single_answer = ''
            }
        }
    },
    validations(){
        var vm = this
        return {
            form : {
                threads: {
                    required
                },
                hit: {
                    required: requiredIf(function (nested) {
                        return nested.is_hit == vm.VUE_APP_IS_TRUE
                    })
                },
                level : {
                    required
                },
                status :{},
                category_id:{
                    required
                },
                test_case : {
                    required,
                    minLength: minLength(parseInt(process.env.VUE_APP_MIN_ANSWER_CHOICE_QUESTION)),
                    isAnswer : ()=>{
                        if( this.form.multi_answer ==  vm.VUE_APP_IS_TRUE){
                            return this.form.test_case.filter((item)=> item.result ).length ? true : false
                        }else{
                            return this.form.test_case.filter((item)=> item.id == this.form.single_answer).length ? true : false
                        }
                    },
                    $each: {
                        param : {
                            required,
                        },
                    }
                }
            }
        }
    },
}