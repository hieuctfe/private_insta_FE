<template>
    <div class="manage-question">
        <div class="card p-b-0">
            <div class="row m-b-20">
                <div class="col col-8">
                    <div class="page-title">List Question</div>
                </div>
                <div class="col col-4">
                    <div class="text-right">
                        <div class="btn-group btn-group-action" >
                            <button type="button" class="btn  btn-primary dropdown-toggle" data-toggle="dropdown" data-display="static">
                                Create Question
                            </button>
                            <div class="dropdown-menu">
                                <router-link  class="dropdown-item" :to="{ name : 'CreateCodeQuestion'}">
                                    Code question
                                </router-link>
                                <router-link  class="dropdown-item" :to="{ name : 'CreateMultipleChoiceQuestion'}">
                                    Choice question
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row m-b-20">
                <div class="col col-6">
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
                    <select name="" id="" class="form-control" v-model="pagination.level" @change="onChangeSelect">
                        <option value="">All level</option>
                        <option v-for="(item, index) in levels"   :key="`level_${index}`" :value="item">{{ item }}</option>
                    </select>
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
                                <th scope="col">Level</th>
                                <th scope="col">Type</th>
                                <th scope="col">Author</th>
                                <th scope="col">Question</th>
                                <th scope="col" class="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="pagination.data.length">
                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                <td>{{ pagination.limit * ( pagination.current_page - 1) + index + 1 }}</td>
                                <td>{{ item.level | capitalize }}</td>
                                <td>{{ item.type_question  }}</td>
                                <td>{{ item.full_name }}</td>
                                <td>{{ item.threads | limit(40)}}</td>
                                <td class="td-action">
                                    <router-link :to="{ name : 'EditQuestion' , params :{ id : item.id }}" class="btn btn-sm btn-outline-secondary">Edit</router-link>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="6">
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
import QuestionBack from '@/mixins/question-back'
export default {
    name : 'ListQuestion',
    mixins : [QuestionBack],
    data(){
        return {
            pagination :{
                total_page : 0,
                current_page : 0,
                total : 0,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : [],
                keyword : '',
                level : '',
                type : ''
            },
            timeout: null,
            is_error : null,
            is_loading : false,
        }
    },
    computed:{
        ...mapGetters({
            levels : 'Question/getListLevel',
            type_questions : 'Question/getType',
        })
    },
    methods:{
        ...mapActions({
            getListQuestion : 'Question/GET_LIST_QUESTION',
        }),
        getList(route){
            this.is_loading = true
            var current_page = route.query.page ? route.query.page : 1 
            var keyword = route.query.keyword ? route.query.keyword :  ''
            var level = route.query.level ? route.query.level :  ''
            var type = route.query.type ? route.query.type :  ''
            var limit = this.pagination.limit 
            this.updateFilter({ page : current_page , keyword , level , type})
            this.getListQuestion({ 
                current_page , 
                keyword,
                limit,
                level,
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
            if( this.pagination.level ){
                query['level']  = this.pagination.level     
            }
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
            var query = {}
            if( this.pagination.level ){
                query['level']  = this.pagination.level     
            }
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
        if( this.$route.query['type']){
            this.pagination.type_question = this.$route.query['type']
        }
        if( this.$route.query['level']){
            this.pagination.level = this.$route.query['level']
        }
        if( this.$route.query['keyword']){
            this.pagination.keyword = this.$route.query['keyword']
        }
        this.getList(this.$route)
    }
}
</script>
