<template>
    <div class="manage-question">
        <div class="card p-b-0">
            <div class="row m-b-20">
                <div class="col col-8">
                    <div class="page-title">Guest's Competitions</div>
                </div>
            </div>
            <div class="row m-b-20">
                <div class="col col-12">
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
                                <th scope="col">Author</th>
                                <th scope="col">Question</th>
                                <th scope="col" class="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="pagination.data.length">
                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                <td>{{ pagination.limit * ( pagination.current_page - 1) + index + 1 }}</td>
                                <td>{{ item.level | capitalize }}</td>
                                <td>{{ item.full_name }}</td>
                                <td>{{ item.threads | limit(40)}}</td>
                                <td class="td-action">
                                    <button class="btn btn-sm btn-outline-secondary m-r-5">Edit</button>
                                    <button class="btn btn-sm btn-outline-secondary">View</button>
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
                        <pagination :total="pagination.total_page" v-model="pagination.current_page"></pagination>
                    </div>
                    
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name : 'ListQuestion',
    data(){
        return {
            pagination :{
                total_page : 0,
                current_page : 0,
                total : 0,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : [],
                keyword : ''
            },
            timeout: null,
            is_error : null,
            is_loading : false
        }
    },
    methods:{
        ...mapActions({
            getListCompetition : 'Competition/GET_LIST_COMPETITION_GUEST',
        }),
        getList(route){
            this.is_loading = true
            var current_page = route.query.page ? route.query.page : 1 
            var keyword = route.query.keyword ? route.query.keyword :  ''
            var limit = this.pagination.limit 
            this.pagination.keyword = keyword
            this.getListCompetition({ 
                current_page , 
                keyword,
                limit,
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
    watch :{
        'isGuest' : function(value){
            this.getList(this.$route)
        }
    },
    beforeRouteUpdate (to, from, next) {
        console.log('123')
        this.getList(to)
        next()
    },
    created(){
        this.getList(this.$route)
    }
}
</script>
