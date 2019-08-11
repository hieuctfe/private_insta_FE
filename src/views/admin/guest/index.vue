<template>
    <div class="manage-question">
        <div class="card p-b-0">
            <div class="row m-b-20">
                <div class="col col-8">
                    <div class="page-title">List Guests</div>
                </div>
                <div class="col col-4">
                    <div class="text-right">
                        <router-link  class="btn btn-primary" :to="{ name : 'CreateGuest'}">
                            Create Guest
                        </router-link>
                    </div>
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
                                <th scope="col">Code</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">CV</th>
                                <th scope="col" class="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="pagination.data.length">
                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                <td>{{ pagination.limit * ( pagination.current_page - 1) + index + 1 }}</td>
                                <td>{{ item.code  }}</td>
                                <td>{{ item.full_name | capitalize }}</td>
                                <td>{{ item.email }}</td>
                                <td>
                                    <a v-if="isDocument(item.cv_file)" :href="`https://docs.google.com/gview?url=${item.cv_file}&embedded=true`" target="_blank">File</a>
                                    <a v-else :href="item.cv_file" target="_blank">File</a>
                                </td>
                                <td class="td-action">
                                    <router-link :to="{ name : 'EditGuest' ,params : { id : item.id }}" class="btn btn-sm btn-outline-secondary">Edit</router-link>
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
import GuestBack from '@/mixins/guest-back'
export default {
    name : 'ListEmployee',
    mixins : [GuestBack],
    data(){
        return {
            pagination :{
                total_page : 0,
                current_page : 1,
                total : 0,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : [],
                keyword : '',
                role: ''
            },
            timeout: null,
            is_error : null,
            is_loading : false,
            file_document_extensions : ['doc','docx','pdf'],
        }
    },
    computed:{
        ...mapGetters({
            roles : 'User/getRoles'
        }),
    },
    methods:{
        ...mapActions({
            getListGuest : 'User/GET_LIST_GUEST',
        }),
        getList(route){
            this.is_loading = true
            var current_page = route.query.page ? route.query.page : 1 
            var keyword = route.query.keyword ? route.query.keyword :  ''
            var limit = this.pagination.limit 
            this.updateFilter({ page : current_page , keyword })
            this.getListGuest({ 
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
            var keyword = this.pagination.keyword.trim()
            if( keyword ){
                query['keyword'] = keyword
            }
            this.pushRouterLinkDefault({
                query : query
            })
        },
        onChangeRole(){
            var query = {
                
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
        isDocument(url){
            var type = url.replace(/^.*\./, '').toLowerCase()
            return this.file_document_extensions.indexOf(type) >= 0
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.getList(to)
        next()
    },
    created(){
        this.pagination.keyword = this.$route.query.keyword ? this.$route.query.keyword :  ''
        this.getList(this.$route)
    }
}
</script>
