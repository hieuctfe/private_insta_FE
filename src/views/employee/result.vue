<template>
<div>
    <div class="row">
        <div class="col col-12">
            <router-link :to="{ name : 'Employee'}" class="btn btn-outline-secondary btn-back">
                <i class="material-icons">arrow_back</i>&nbsp;Back to list
            </router-link>
        </div>
    </div>

    <transition name="fade" mode="out-in">
        <div class="box-loading p-b-50 p-t-50" v-if="is_loading" key="is-loading">
            <div class="icon-loading bg-primary large"></div>
        </div>
        <div class="employee-result" v-else key="is-loading-success">
            <template v-if="is_loading_error">
                <div class="box-empty p-t-50 p-b-50 text-center">
                    <div class="box-empty-icon">
                        <i class="material-icons text-danger">error</i>
                    </div>
                    <div class="box-empty-title">
                        Data not found !
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="row m-t-30">
                    <div class="col col-12">
                        <div class="result-box">
                            <div class="result-box-head">
                                <h3>Competition Info</h3>
                            </div>
                            <div class="result-box-body">
                                <ul class="competition-info">
                                    <li>
                                        <strong>Title : </strong>
                                        <span>{{ data.title}}</span>
                                    </li>
                                    <li>
                                        <strong>Type : </strong>
                                        <span>Choice</span>
                                    </li>
                                    <li>
                                        <strong>Duration : </strong>
                                        <span>{{ data.duration}} <small>minutes</small></span>
                                    </li>
                                    <li>
                                        <strong>Total Questions : </strong>
                                        <span>{{ data.question_ids | get_length}}</span>
                                    </li>
                                    <li>
                                        <strong>Total Correct : </strong>
                                        <span>{{ summary.correct }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col col-12">
                        <item-result-competition :data="data"></item-result-competition>
                    </div>
                </div>
            </template>
        </div>
    </transition>
</div>
</template>
<script>
import { mapActions } from 'vuex';
import ItemResultCompetition from '@/views/admin/partials/item-result-competition'
export default {
    name : 'CompetitionResult',
    components:{
        ItemResultCompetition
    },
    data(){
        return {
            data : null ,
            is_loading : true,
            is_loading_error : false,
        }
    },
    computed:{
        summary(){
            var correct = 0
            if( this.data ){
                this.data.questions.forEach((item)=>{
                    if( item.answers && item.answers.correct ){
                        correct += 1
                    }
                })
            }
            return {
                correct
            }
        }
    },
    methods:{
        ...mapActions({
            getResult : 'Competition/GET_RESULT'
        })
    },
    created(){
        this.is_loading = true
        this.getResult(this.$route.params.id).then((res)=>{
            let { status , data } = res.data 
            if( status ){
                this.is_loading_error = false
                this.data = data 
            }else{
                this.is_loading_error = true
            }
        })
        .catch(()=>{
            this.is_loading_error = true
        })
        .finally(()=>{
            this.is_loading = false
        })
    }
}
</script>
