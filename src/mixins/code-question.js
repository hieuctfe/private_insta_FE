import { mapGetters , mapActions } from "vuex";
import { required , requiredIf , email , minLength  } from 'vuelidate/lib/validators'
import ConfirmDialog from '@/components/confirm-dialog'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/theme/eclipse.css'
import InputTag from '@/components/input-tag';
import codemirror from '@/components/vue-codemirror'
import VueNumeric from '@/components/vue-numeric'
export default {
    components:{
        InputTag ,
        codemirror,
        ConfirmDialog,
        VueNumeric
    },
    data(){
        return {
            is_loading : true,
            is_sending : false,
            is_general : false,
            is_general_error : false,
            is_general_message : null,
            formstate: false,
            form :{
                type_question : 'code',
                threads: '',
                status : parseInt(process.env.VUE_APP_IS_TRUE),
                is_hit: parseInt(process.env.VUE_APP_IS_FALSE),
                hit: '',
                level : '',
                start_code: '',
                func_name : '',
                category_id: '',
                test_case : [],
                is_auto_general_test_case : false,
                auto_generate_testcase : '',
                auto_generate_testcase_total : parseInt(process.env.VUE_APP_MIN_GENERAL_TEST_CASE)
            },
            min_general_test_case : parseInt(process.env.VUE_APP_MIN_GENERAL_TEST_CASE),
            max_general_test_case : parseInt(process.env.VUE_APP_MAX_GENERAL_TEST_CASE),
            min_test_case : parseInt(process.env.VUE_APP_MIN_GENERAL_TEST_CASE),
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
            categories: 'Question/getListCategoryCode',
        }),
        isTestCaseValid(){
            var temp = 0 ;
            var check = true
            for (let index = 0; index < this.form.test_case.length; index++) {
                const element = this.form.test_case[index];
                if( index == 0){
                    temp = this.form.test_case[index].param.length
                }else if( temp != this.form.test_case[index].param.length){
                    check = false 
                    break
                }
            }
            return check
        },
    },
    methods:{
        ...mapActions({
            createQuestion : 'Question/CREATE',
            getCategory : 'Question/GET_CATEGORY',
            general : 'Question/GENERAL_TEST_TEST',
            updateQuestion : 'Question/UPDATE',
            getDetail : 'Question/GET'
        }),
        addTestCase(){
            this.form.test_case.push({
                show : false,
                param : [],
                result : ''
            })
        },
        removeTestCase(index){
            if( this.form.test_case.length > 10){
                this.form.test_case.splice(index,1)
            }
        },
        generalTestCase(){
            if( this.is_general ) return 
            this.is_general = true
            this.is_general_error = false 
            this.is_general_message = null 
            this.general({
                total : this.form.auto_generate_testcase_total,
                params : this.form.auto_generate_testcase
            })
            .then((res)=>{
                let { status , data  , message = ''} = res.data 
                if( status ){
                    this.form.test_case = data.map((item , index)=>{

                        return {
                            param : item.params,
                            result: item.result,
                            show : index < 4 ? this.VUE_APP_IS_TRUE : this.VUE_APP_IS_FALSE,
                        }
                    })
                }else{
                    this.is_general_error = true 
                    this.is_general_message = message
                }
            })
            .catch((res)=>{
                this.is_general_error = true 
            })
            .finally(()=>{
                this.is_general = false
            })
        },
        getVariableFromString(text){
            var params = text.match(/\((.*)\)/)
            if(params != null && params.length >= 2){
                return params[1].split(',').map((el)=>el.trim()).filter((el,index,arr) => arr.indexOf(el) == index && el != '$')
            }
            return []
        },
        getFuncName(value){
            var myRegexp = /(?:^|\s)function\ (.*?)\(/g;
            var match = myRegexp.exec(value);
            if( match != null && match.length > 1 ){
                return String(match[1]).trim()
            }
            return ''
        }
    },
    watch : {
        'form.is_auto_general_test_case' : function(value){
            if( value ){
                if( this.form.auto_generate_testcase == ''){
                    var startCode = this.form.start_code
                    var params = this.getVariableFromString(startCode)
                    if( params.length ){
                        var testCaseCode = ''
                        params.forEach((el)=>{
                            testCaseCode += `define  ${el} int [1-100];\n`
                        })
                        testCaseCode += startCode
                       this.form.auto_generate_testcase = testCaseCode
                    }
                }
            }
        },
        'form.start_code' : function(value){
            this.form.func_name = this.getFuncName(value)
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
                start_code : {
                    required
                },
                func_name : {
                    required
                },
                status :{},
                category_id:{
                    required
                },
                test_case : {
                    required: requiredIf(function (nested) {
                        return nested.is_auto_general_test_case == false
                    }),
                    minLength: minLength(10),
                    $each: {
                        param : {
                            required,
                        },
                        result : {
                            required,
                        },
                        show : {}
                    }
                },
            }
        }
    },
}