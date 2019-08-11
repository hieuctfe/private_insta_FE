<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-question" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-15">
                    <button @click="back" class="btn btn-outline-secondary btn-back"> 
                        <i class="material-icons">arrow_back</i>&nbsp; Back to list
                    </button>
                </div>
                <div class="col col-12" v-if="is_loading_error">
                    <div class="box-empty p-t-50 p-b-50 text-center" v-if="is_loading_error == 404">
                        <h3>Data not found !</h3>
                    </div>
                    <div class="box-empty p-t-50 p-b-50 text-center" v-else>
                        <h3>Oops.. Something Went Wrong.. !</h3>
                    </div>
                </div>
                <div class="col col-12" v-else>
                    <template v-if="data.type_question == 'choice'">
                        <update-multiple-choice-question :data="data"></update-multiple-choice-question>
                    </template>
                    <template v-else-if="data.type_question == 'code'">
                        <update-code-question :data="data"></update-code-question>
                    </template>
                </div>
            </div>
            
        </div>
    </transition>
    
</template>
<script>
import { mapActions  } from 'vuex'
import QuestionBack from '@/mixins/question-back'
import UpdateCodeQuestion from './update-code'
import UpdateMultipleChoiceQuestion from './update-mutiple-choice'
export default {
    name : 'UpdateQuestionLayout',
    mixins : [QuestionBack],
    components:{
        UpdateCodeQuestion , UpdateMultipleChoiceQuestion
    },
    data(){
        return {
            is_loading : true,
            is_loading_error : false,
            data : null,
        }
    },
    methods:{
        ...mapActions({
            getDetail : 'Question/GET'
        }),
    },
    async created(){
        this.is_loading = true
        try {
            var detail = await this.getDetail(this.$route.params.id)
            let { status , data } = detail.data
            if( status ){
                let { question , testCase } = data 
                this.data = question
                this.data['test_case'] = testCase
            }else{
                this.is_loading_error = 404
            }
        } catch (e) {
            this.is_loading_error = 500
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
