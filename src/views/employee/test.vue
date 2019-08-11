<template>
    <transition name="fade" mode="out-in">
        <div class="app-test-layout" v-if="is_loading" key="is-loading">
            <div class="box-loading p-t-100 p-b-100">
                <div class="icon-loading bg-primary large"></div>
            </div>
        </div>
        <div class="app-test-layout" v-else key="loading-success">
            <template v-if="is_error">
                <div class="app-test-layout-error">
                    <div class="app-test-layout-error-timeout" v-if="is_error_code == 'time_out'">
                        <div class="box-empty p-t-50 p-b-50 text-center">
                            <div class="box-empty-icon">
                                <i class="material-icons text-danger">alarm_off</i>
                            </div>
                            <div class="box-empty-title">
                                This competition is timeout !
                            </div>
                            <div class="box-empty-btn m-t-20">
                                <router-link :to="{ name : 'CompetitionResult' , params : { id : id }}" class="btn btn-secondary">
                                    See this competition result
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="app-test-layout-error-finished" v-else-if="is_error_code == 'is_finished'">
                        <div class="box-empty p-t-50 p-b-50 text-center">
                            <div class="box-empty-icon">
                                <i class="material-icons text-success">check</i>
                            </div>
                            <div class="box-empty-title">
                                This competition is finished !
                            </div>
                            <div class="box-empty-btn m-t-20">
                                <router-link :to="{ name : 'CompetitionResult' , params : { id : id }}" class="btn btn-secondary">
                                    See this competition result
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="app-test-layout-error-404" v-else>
                        <div class="box-empty p-t-50 p-b-50 text-center">
                            <div class="box-empty-icon">
                                <i class="material-icons text-danger">error</i>
                            </div>
                            <div class="box-empty-title">
                                Data not found !
                            </div>
                            <div class="box-empty-btn m-t-20">
                                <router-link :to="{ name : 'Employee' }" class="btn btn-secondary">
                                    Back to list
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else >
                <template v-if="type_question == 'choice'">
                    <test-choice-question :data="questions" :count-down="count_down" :id="id"></test-choice-question>
                </template>
                <template v-else-if="type_question == 'code'">
                    <test-code-question :data="questions" :count-down="count_down" :id="id"></test-code-question>
                </template>
            </template>
        </div>
    </transition>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import TestCodeQuestion from './test-code-question'
import TestChoiceQuestion from './test-choice-question'
export default {
    name : 'TestPage',
    components:{
        TestCodeQuestion,
        TestChoiceQuestion
    },
    data(){
        return {
            id : '',
            is_loading : false,
            is_error : false,
            is_error_code: null,
            count_down: 0,
            questions : [],
            type_question : null,
            data : null
        }
    },
    computed:{
        ...mapGetters({
            user : 'getUser'
        })
    },
    methods:{
        ...mapActions({
            start : 'Competition/START',
        }),
    },
    created(){
        let id = this.$route.params.id
        this.id = id 
        this.is_loading = true 
        this.start(id).then((res)=>{
            let { status , data  , count_down , error_code , type} = res.data 
            if( status ){
                this.questions = data.map((item)=>{
                    if( item['answers'] == null ){
                        item['answers'] = {
                            answer: item.start_code,
                            correct: 0,
                            execute_time: 0,
                            memory_used: 0,
                            question_id: item.id,
                            testing_count: 0,
                        }
                    }
                    return item 
                }) 
                this.type_question = type
                this.count_down = count_down
            }else{
                this.is_error = true
                this.is_error_code = error_code
            }
        })
        .catch(()=>{
            this.is_error = true
        })
        .finally(()=>{
            this.is_loading = false
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
