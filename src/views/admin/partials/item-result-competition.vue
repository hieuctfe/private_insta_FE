<template>
    <div class="result-box">
        <div class="result-box-head">
            <h3>Competition Detail</h3>
        </div>
        <div class="result-box-body" v-if="data.type_question == 'code'">
            <template v-for="(item,index) in data.questions">
                <div class="item-result m-b-30" :key="`index_result_${index}`">
                    <div class="item-result-title">
                        <h4>Question {{ index + 1}}</h4>
                    </div>
                    <div class="item-result-content">
                        <div class="item-result-thread">
                            <markdown-html v-model="item.threads"></markdown-html>
                        </div>
                        <div class="item-result-test-case" v-if="item.test_cases.length">
                            <div class="item-result-label">Test case</div>
                            <template v-for="(test_case, index_test_case) in item.test_cases">
                                <div class="item-result-test-case-line"  :key="`test_case${index_test_case}`">
                                    {{ item.func_name }}( {{test_case.params_string}} ) => {{ test_case.result}}
                                </div>
                            </template>
                        </div>
                        <div class="item-result-answer" v-if="item.answers && item.answers.answer" >
                            <div class="item-result-label">answer</div>
                            <div >
                                <codemirror class="min-height-50" v-model.trim="item.answers.answer" :options="codeOptions"></codemirror>
                            </div>
                        </div>
                        <div class="item-result-final">
                            <template v-if="item.answers && item.answers.answer">
                                <div class="item-result-label">
                                    Result : 
                                    <strong :class="item.answers.correct ? 'text-success' : 'text-danger'"> {{ item.answers.correct ? 'Correct' : 'Incorrect' }} 
                                    </strong>
                                </div>
                            </template>
                            <template v-else>
                                <div class="item-result-label">
                                    Result : <strong class="text-danger">No Answer</strong>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="result-box-body" v-else-if="data.type_question =='choice'">
            <template v-for="(item,index) in data.questions">
                <div class="item-result m-b-30" :key="`index_result_${index}`">
                    <div class="item-result-title">
                        <h4>Question {{ index + 1}}</h4>
                    </div>
                    <div class="item-result-content">
                        <div class="item-result-thread">
                            <markdown-html v-model="item.threads"></markdown-html>
                        </div>
                        <div class="item-result-question-answer">
                            <ul>
                                <li v-for="(test_case, index_test_case) in item.test_cases" :key="`test_case${index_test_case}`">
                                    <label  class="material-checkbox" v-if="item.multi_answer == VUE_APP_IS_TRUE">
                                        <input type="checkbox" :disabled="true" :checked="isChecked(item , test_case.id)">
                                        <span :class="{ 'is-correct-value' : test_case.result == '1'}">{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                    </label>
                                    <label  class="material-radio" v-else-if="item.multi_answer == VUE_APP_IS_FALSE">
                                        <input type="radio" :disabled="true" :checked="isChecked(item , test_case.id)">
                                        <span :class="{ 'is-correct-value' : test_case.result == '1'}">{{index_test_case | number_code}}. {{test_case.params_string}}</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div class="item-result-final">
                            <template v-if="item.answers">
                                <div class="item-result-label">
                                    Result : 
                                    <strong :class="item.answers.correct ? 'text-success' : 'text-danger'"> 
                                        {{ item.answers.correct ? 'Correct' : 'Incorrect' }} 
                                    </strong>
                                </div>
                            </template>
                            <template v-else>
                                <div class="item-result-label">
                                    Result : 
                                    <strong class="text-danger"> 
                                        No Answer
                                    </strong>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import MarkdownHtml from '@/components/markdown-html'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/theme/eclipse.css'
export default {
    name : 'ItemResultCompetition',
    components:{
        MarkdownHtml,
        codemirror
    },
    props:{
        data : {}
    },
    data(){
        return {
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
                readOnly : true
            },
        }
    },
    methods:{
        isChecked(item , id){
            if( item.answers && item.answers.answer ){
                if( item.answers.answer.indexOf(id) >= 0){
                    return true
                }
            }
            return false
        }
    }
}
</script>
<style lang="scss">
    .item-result-question-answer{
        ul{
            list-style-type: none;
            padding: 0 0 0 15px;
            li{

            }
        }
    }
    .is-correct-value{
        font-weight: 600 !important;
        color:$success !important;
    }
</style>

