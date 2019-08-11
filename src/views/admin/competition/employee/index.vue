<template>
    <div class="manage-question">
        <div class="card p-b-0">
            <div class="row m-b-20">
                <div class="col col-8">
                    <div class="page-title">Employee's Competitions</div>
                </div>
                <div class="col col-4">
                    <div class="text-right">
                        <div class="btn-group btn-group-action" >
                            <button type="button" class="btn  btn-primary dropdown-toggle" data-toggle="dropdown" data-display="static">
                                Create Competition
                            </button>
                            <div class="dropdown-menu">
                                <router-link  class="dropdown-item" :to="{ name : 'CreateEmployeeCodeCompetition'}">
                                    Code Competition
                                </router-link>
                                <router-link  class="dropdown-item" :to="{ name : 'CreateEmployeeChoiceCompetition'}">
                                    Choice Competition
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row m-b-20">
                <div class="col col-9">
                    <div class="input-group input-group-search">
                        <input type="text" class="form-control" placeholder="Search ..." v-model="pagination.keyword" @keyup="onKeyword">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" >
                                <i class="material-icons">
                                    search
                                </i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col col-3">
                    <select name="" id="" class="form-control" v-model="pagination.type" @change="onChangeSelect">
                        <option value="">All type</option>
                        <option v-for="(item, index) in type_questions"   :key="`type_questions_${index}`" :value="item.id">{{ item.text }}</option>
                    </select>
                </div>
            </div>
            <transition name="fade" mode="out-in">
                <div class="box-loading" v-if="is_loading" key="is-loading">
                    <div class="icon-loading bg-primary  large"></div>
                </div>
            
                <div class="row row-table" v-else key="is-loading-success">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Title</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Type</th>
                                <th scope="col">Question</th>
                                <th scope="col">Users</th>
                                <th scope="col" class="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="pagination.data.length">
                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                <td>{{ pagination.limit * ( pagination.current_page - 1) + index + 1 }}</td>
                                <td>{{ item.title }}</td>
                                <td>{{ item.start_date | date_string }}</td>
                                <td>{{ item.end_date | date_string }}</td>
                                <td>{{ item.duration }}</td>
                                <td>{{ item.type_question | capitalize }}</td>
                                <td>{{ item.question_ids | get_length}}</td>
                                <td>{{ item.user_ids | get_length }}</td>
                                <td class="td-action">
                                     <template v-if="item.count_down == 'ok'">
                                        <router-link :to="{ name : 'DetailEmployeeCompetition' , params : { id : item.id}}" class="btn btn-block btn-sm btn-success">
                                            Open
                                        </router-link>
                                    </template>
                                    <template v-else-if="item.count_down == 'timeout'">
                                        <router-link :to="{ name : 'DetailEmployeeCompetition' , params : { id : item.id}}" class="btn btn-block btn-sm btn-success">
                                            Expired
                                        </router-link>
                                    </template>
                                    <template v-else>
                                        <router-link :to="{ name : 'DetailEmployeeCompetition' , params : { id : item.id}}" class="btn btn-block btn-sm btn-outline-secondary m-r-5">
                                            Edit
                                        </router-link>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="20">
                                    data not found
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class=" col col-12 text-center p-t-20">
                        <pagination :total="pagination.total_page" v-model="pagination.current_page"></pagination>
                    </div>
                    
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import CompetitionBack from '@/mixins/competition-back'
export default {
    name : 'GuestCompletition',
    mixins : [CompetitionBack],
    data(){
        return {
            pagination :{
                total_page : 0,
                current_page : 0,
                total : 0,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : [],
                keyword : '',
                type : ''
            },
            timeout: null,
            is_error : null,
            is_loading : false
        }
    },
    computed:{
        ...mapGetters({
            type_questions : 'Question/getType',
        })
    },
    methods:{
        ...mapActions({
            getListCompetition : 'Competition/GET_LIST_COMPETITION_EMPLOYEE',
        }),
        getList(route){
            this.is_loading = true
            var current_page = route.query.page ? route.query.page : 1 
            var keyword = route.query.keyword ? route.query.keyword :  ''
            var type = route.query.type ? route.query.type :  ''
            var limit = this.pagination.limit 
            this.pagination.keyword = keyword
            this.pagination.type = type
            this.updateEmployeeFilter({ page : current_page , keyword , type})
            this.getListCompetition({ 
                current_page , 
                keyword,
                limit,
                type
            })
            .then((res)=>{
                let { status , data , pagination } = res.data
                if( status ){
                    this.is_error = null
                    this.pagination.data = data 
                    this.pagination.current_page = pagination.current_page
                    this.pagination.total_page = pagination.total_page
                    this.pagination.total = pagination.total 
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
        onChangeSelect(){
            var query = {}
            if( this.pagination.type ){
                query['type']  = this.pagination.type     
            }
            var keyword = this.pagination.keyword.trim()
            if( keyword ){
                query['keyword'] = keyword
            }
            this.pushRouterLinkDefault({
                query : query
            })
        },
        onChangeKeyword(){
            var query = {
                
            }
            delete query['keyword']
            delete query['page']
            var keyword = this.pagination.keyword.trim()
            if( keyword ){
                query['keyword'] = keyword
            }
            this.pushRouterLinkDefault({
                query : query
            })
        },
        onKeyword(event){
            clearTimeout(this.timeout)
            if( event.keyCode == 13){
                if( typeof this.onChangeKeyword == 'function'){
                    this.onChangeKeyword()
                }
            }else{
                this.timeout = setTimeout(() => {
                    if( typeof this.onChangeKeyword == 'function'){
                        this.onChangeKeyword()
                    }
                }, 1000);
            }
        },
    },
    beforeRouteUpdate (to, from, next) {
        this.getList(to)
        next()
    },
    created(){
        this.getList(this.$route)
    }
}
</script>
