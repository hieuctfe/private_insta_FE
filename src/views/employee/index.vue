<template>
    <div class="app-employee-dashboard-index">
        <div v-if="is_loading_competition" key="is-loading">
            <div class="p-t-50 p-b-50 text-center">
                <div class="icon-loading bg-primary large"></div>
            </div>
        </div>
        <div class="row" v-else>
            <div class="col col-12 m-b-30" v-if="competition.data.length">
                <div class="user-box">
                    <div class="user-box-head">
                        <h3>Your List Test</h3>
                    </div>
                    <div class="user-box-body">
                        <transition name="fade" mode="out-in">
                            <div v-if="competition.is_loading" key="is-loading">
                                <div class="p-t-50 p-b-50 text-center">
                                    <div class="icon-loading bg-primary large"></div>
                                </div>
                            </div>
                            <div v-else key="is-loading-success">
                                <table class="table">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th scope="col" class="td-index">#</th>
                                            <th scope="col" class="td-title">Title</th>
                                            <th scope="col" class="td-type">Type</th>
                                            <th scope="col" class="td-question">Questions</th>
                                            <th scope="col" class="td-duration">Duration</th>
                                            <th scope="col" class="td-action">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="competition.data.length">
                                        <tr v-for="(item , index) in competition.data" :key="`index_${index}`">
                                            <td class="td-index">{{ competition.limit * ( competition.current_page - 1) + index + 1 }}</td>
                                            <td class="td-title">{{ item.title }}</td>
                                            <td class="td-duration">{{ item.type_question }}</td>
                                            <td class="td-question">{{ item.question_ids | get_length }}</td>
                                            <td class="td-duration">{{ item.duration }} minutes</td>
                                            <td class="td-action">
                                                <template v-if="item.test">
                                                    <template v-if="item.test.is_finished">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-success">
                                                            Result
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="item.test.time_out">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-danger">
                                                            Timeout
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="!item.test.is_finished && !item.test.time_out">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-warning">
                                                            Continue test
                                                        </router-link>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="item.count_down == 'ok'">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-primary">
                                                            Start Test
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="item.count_down == 'timeout'">
                                                        <span class="btn btn-block btn-sm btn-danger">Expired</span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="btn btn-block btn-sm btn-danger">
                                                            <count-down v-model="item.count_down"></count-down>
                                                        </span>
                                                    </template>
                                                </template>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td colspan="5">
                                                data not found
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class=" col col-12 text-center p-t-20">
                                    <pagination :router-link="false" :change="onChangeCompetition" :total="competition.total_page" v-model="competition.current_page"></pagination>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class="col col-12" v-if="complete.data.length">
                <div class="user-box">
                    <div class="user-box-head">
                        <h3>Your Completed Test</h3>
                    </div>
                    <div class="user-box-body">
                        <transition name="fade" mode="out-in">
                            <div v-if="complete.is_loading" key="is-loading">
                                <div class="p-t-50 p-b-50 text-center">
                                    <div class="icon-loading bg-primary large"></div>
                                </div>
                            </div>
                            <div v-else key="is-loading-success">
                                <table class="table">
                                    <thead class="thead-dark">
                                        <tr>
                                            <th scope="col" class="td-index">#</th>
                                            <th scope="col" class="td-title">Title</th>
                                            <th scope="col" class="td-type">Type</th>
                                            <th scope="col" class="td-question">Questions</th>
                                            <th scope="col" class="td-duration">Duration</th>
                                            <th scope="col" class="td-action">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="complete.data.length">
                                        <tr v-for="(item , index) in complete.data" :key="`index_${index}`">
                                            <td class="td-index">{{ complete.limit * ( complete.current_page - 1) + index + 1 }}</td>
                                            <td class="td-title">{{ item.title }}</td>
                                            <td class="td-type">{{ item.type_question }}</td>
                                            <td class="td-question">{{ item.question_ids | get_length }}</td>
                                            <td class="td-duration">{{ item.duration }} minutes</td>
                                            <td class="td-action">
                                                 <template v-if="item.test">
                                                    <template v-if="item.test.is_finished">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-success">
                                                            Result
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="item.test.time_out">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-danger">
                                                            Timeout
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="!item.test.is_finished && !item.test.time_out">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-primary">
                                                            Continue test
                                                        </router-link>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="item.count_down == 'ok'">
                                                        <router-link :to="{ name : 'Test' ,params : { id : item.id }}" class="btn btn-block btn-sm btn-primary">
                                                            Start Test
                                                        </router-link>
                                                    </template>
                                                    <template v-else-if="item.count_down == 'timeout'">
                                                        <span class="btn btn-block btn-sm btn-danger">Expired</span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="btn btn-block btn-sm btn-danger">
                                                            <count-down v-model="item.count_down"></count-down>
                                                        </span>
                                                    </template>
                                                </template>
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr>
                                            <td colspan="5">
                                                data not found
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class=" col col-12 text-center p-t-20">
                                    <pagination :router-link="false" :change="onChangeComplete" :total="complete.total_page" v-model="competition.current_page"></pagination>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
        <confirm-dialog ref="confirm"></confirm-dialog>
    </div>
</template>
<script>
import { mapGetters , mapActions } from 'vuex';
import ConfirmDialog from '@/components/confirm-dialog'
import CountDown from '@/components/count-down'
export default {
    name : 'EmployeeDashboard',
    components:{
        ConfirmDialog , CountDown
    },
    data(){
        return {
            is_loading_competition: false,
            is_error_competition : false,
            competition :{
                current_page : 1,
                total_page : 1,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data: [],
                is_loading : false,
                is_error : false
            },
            complete : {
                current_page : 1,
                total_page : 1,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data: [],
                is_loading : false,
                is_error : false
            }
        }
    },
    methods:{
        ...mapActions({
            getYourCompetition : 'Competition/GET_YOUR_LIST_COMPETITION',
            start : 'Competition/START'
        }),
        getListCompetition(){
            this.competition.is_loading = true
            this.getYourCompetition({
                limit : this.competition.limit,
                current_page : this.competition.current_page,
                is_finished : 0
            })
            .then((res)=>{
                let { status , data , pagination } = res.data
                if( status ){
                    this.competition.data = data 
                    this.competition.current_page = pagination.current_page
                    this.competition.total_page = pagination.total_page
                    this.competition.total = pagination.total 
                }else{
                    this.competition.is_error = true
                }
            })
            .catch(err=>{
                this.competition.is_error = true
            })
            .finally(()=>{
                this.competition.is_loading = false
            })
        },
        getListComplete(){
            this.complete.is_loading = true
            this.getYourCompetition({
                limit : this.complete.limit,
                current_page : this.complete.current_page,
                is_finished : 1
            })
            .then((res)=>{
                let { status , data , pagination } = res.data
                if( status ){
                    this.is_error = null
                    this.complete.data = data 
                    this.complete.current_page = pagination.current_page
                    this.complete.total_page = pagination.total_page
                    this.complete.total = pagination.total 
                }else{
                    this.complete.is_error = true
                }
            })
            .catch(err=>{
                this.complete.is_error = true
            })
            .finally(()=>{
                this.complete.is_loading = false
            })
        },
        hanlderStartTest(id){
            this.$refs.confirm.show({
                title : 'Confirm',
                content : 'Do you want to start this test ?',
                btnSave : 'Start Now',
                onSave : () => {
                    return new Promise((resolve , reject) =>{
                        this.start(id).then((res)=>{
                            let { status , data  , count_down} = res.data 
                            resolve()
                            if( status ){
                                this.redirect({ name : 'Test' , params: {id : id } })
                            }
                        })
                    })
                }
            })
        },
        onChangeCompetition(page){
            this.getListCompetition()
        },
        onChangeComplete(page){
            this.getListComplete()
        }
    },
    async created(){
        this.is_loading_competition = true 
        try {
            this.getListCompetition()
        } catch (e) {
            
        }
        try {
            this.getListComplete()
        } catch (e) {
            
        }
        this.is_loading_competition = false 
    }
}
</script>

<style lang="scss" scoped>
    .container{
        max-width: 1170px;
    }
    .app-employee-dashboard{
        padding: 50px 0;
        .user-info{
            display: flex;
            flex-direction: row;
            &-image{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
                border: 1px solid #eeeeee;
                background: #f2f2f2;
                font-size: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            &-actions{
                width: 100px;
            }
            &-content{
                width: calc(100% - 200px);
                padding-left: 30px;
                display: flex;
                align-items: center;
                &-wrapper{

                }
            }
            &-text{
                font-size: 28px;
                strong{
                    text-transform: capitalize;
                }
            }
            &-welcome{
                font-size: 18px;
            }
        }
    }
    .user-box{
        &-head{
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
            h3{
                display: block;
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }
        }
    }
    .table{
        .td{
            &-index{
                width: 50px;
                max-width: 50px;
                min-width: 50px;
            }
            &-type ,&-question , &-duration , &-status{
                width: 12%;
                max-width: 12%;
                min-width: 12%;
                text-align: left;
            }
           
        }
    }
</style>
