<template>
    <div class="vue-modal-question">
        <transition name="fade" mode="out-in">
            <div class="modal" v-if="modal_show">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Question detail</h5>
                            <button type="button" class="close" @click.stop.prevent="close" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <transition name="fade" mode="out-in">
                                <div class="p-t-30 p-b-30 text-center" v-if="is_loading" key="is-loading">
                                    <div class="icon-loading bg-primary large"></div>
                                </div>
                                <div v-else key="loading-success" >
                                    <template v-if="data">
                                        <template v-if="data.question">
                                            <template v-if="data.question.type_question == 'code'">
                                                <markdown-html v-model="data.question.threads"></markdown-html>
                                                <template v-if="data.question.is_hit == VUE_APP_IS_TRUE">
                                                    <markdown-html v-model="data.question.hit"></markdown-html>
                                                </template>
                                                <label><strong>Start code</strong></label>
                                                <codemirror class="min-height-100" v-model.trim="data.question.start_code" :options="codeOptions"></codemirror>
                                                <div class="question-answer m-t-15" v-if="data.testCase">
                                                    <label><strong>Test case</strong></label>
                                                    <div class="question-description">
                                                        <template v-for="(test_case, index_test_case) in data.testCase">
                                                            <div v-if="test_case.show  == VUE_APP_IS_TRUE" :key="`test_case${index_test_case}`">
                                                                {{ data.question.func_name }}( {{test_case.params_string}} ) => {{ test_case.result}}
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else-if="data.question.type_question == 'choice'">
                                                <markdown-html v-model="data.question.threads"></markdown-html>
                                                <template v-if="data.question.is_hit == VUE_APP_IS_TRUE">
                                                    <markdown-html v-model="data.question.hit"></markdown-html>
                                                </template>
                                                <div class="question-answer m-t-15" v-if="data.testCase">
                                                    <ul>
                                                        <li v-for="(test_case, index_test_case) in data.testCase" :key="`test_case${index_test_case}`">
                                                            <label  class="material-checkbox" v-if="data.question.multi_answer == VUE_APP_IS_TRUE">
                                                                <input type="checkbox" :checked="test_case.result == '1'">
                                                                <span>{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                                            </label>
                                                            <label  class="material-radio" v-else-if="data.question.multi_answer == VUE_APP_IS_FALSE">
                                                                <input type="radio" :checked="test_case.result == '1'">
                                                                <span>{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </template>
                                        </template>
                                    </template>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop" @click="close()"></div>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import MarkdownHtml from '@/components/markdown-html'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/theme/eclipse.css'
export default {
    name : 'ModalQuestion',
    components:{
        MarkdownHtml , codemirror
    },
    props:{
        value : {
            type : Boolean,
        },
        id : {
            type : [String , Number],
            required : true
        },
    },
    computed:{
        modal_show : {
            get(){
                return this.value
            },
            set(value){
                this.$emit('input', value)
            }
        }
    },
    data(){
        return {
            data : null,
            timeout : null,
            is_error: null,
            is_loading : false,
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
    methods:{
        ...mapActions({
            getQuestion : 'Question/GET'
        }),
        onShow(){

        },
        onSelect(item){
            this.onSave(item)
            this.close()
        },
        close(){
            this.reset()
            this.modal_show = false
        },
        load(){
            this.is_loading = true 
            this.getQuestion(this.id)
            .then((res)=>{
                let { status , data  } = res.data
                if( status ){
                    this.is_error = null
                    this.data = data 
                }else{
                    this.is_error = true
                }
            }).catch(err=>{
                this.is_error = true
            })
            .finally(()=>{
                this.is_loading = false
            })
        },
        reset(){
            this.options = {
                title : '',
                content : '',
                btnClose : 'Close',
                btnCloseClass : 'btn btn-secondary',
                btnSave : 'Done',
                btnSaveClass : 'btn btn-primary',
                onSave : null,
                onClose : null,
                isLoading: false,
            }
        },
    },
    watch :{
        'value' :function(value){
            if( value ){
                this.load()
            }else{
                this.$emit('update:id' , '')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .vue-modal-question{
        user-select: none;
        .modal{
            display: block;
            overflow: hidden auto;
            padding: 50px 0;
            &-dialog{
                z-index: 1041;
                width: 800px;
                max-width: 800px;
                margin: 0 auto;
            }
            &-body{
                padding:  15px;
                .question-answer{
                    ul{
                        list-style-type: none;
                        padding: 0 0 0 15px;
                    }
                }
            }
            &-footer{
                button{
                    min-width: 100px;
                }
            }
            &-backdrop{
                opacity: 0.5;
            }
        }
    }

</style>
