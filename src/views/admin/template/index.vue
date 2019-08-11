<template>
    <div class="manage-question">
        <div class="card p-b-0">
            <div class="row m-b-20">
                <div class="col col-8">
                    <div class="page-title">List Template</div>
                </div>
                <div class="col col-4">
                    <div class="text-right">
                        <div class="btn-group btn-group-action" >
                            <button type="button" class="btn  btn-primary dropdown-toggle" data-toggle="dropdown" data-display="static">
                                Create Template
                            </button>
                            <div class="dropdown-menu">
                                <router-link  class="dropdown-item" :to="{ name : 'CreateCodeTemplate'}">
                                    Code Template
                                </router-link>
                                <router-link  class="dropdown-item" :to="{ name : 'CreateChoiceTemplate'}">
                                    Choice Template
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
                                <th scope="col">Type</th>
                                <th scope="col">Title</th>
                                <th scope="col">Question</th>
                                <th scope="col" class="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody v-if="pagination.data.length">
                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                <td>{{ pagination.limit * ( pagination.current_page - 1) + index + 1 }}</td>
                                <td>{{ item.type_question | capitalize}}</td>
                                <td>{{ item.title | capitalize }}</td>
                                <td>{{item.question_ids | get_length}}</td>
                                <td class="td-action">
                                    <router-link class="text-primary m-r-15" :to="{ name : 'EditTemplate' , params : { id : item.id }}" >
                                        <i class="material-icons">info</i>
                                    </router-link>
                                    <a class="text-danger" href="#" @click.stop.prevent="remove(item.id)">
                                        <i class="material-icons">delete_forever</i>
                                    </a>
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
        <confirm-dialog ref="confirm"></confirm-dialog>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import TemplateBack from '@/mixins/template-back'
import ConfirmDialog from '@/components/confirm-dialog'
export default {
    name : 'ListQuestion',
    mixins : [TemplateBack],
    components:{
        ConfirmDialog
    },
    data(){
        return {
            pagination :{
                total_page : 0,
                current_page : 0,
                total : 0,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : [],
                keyword : '',
                type  : ''
            },
            timeout: null,
            is_error : null,
            is_loading : false,
            is_loading_error : false,
        }
    },
    computed:{
        ...mapGetters({
            type_questions : 'Question/getType',
        })
    },
    methods:{
        ...mapActions({
            getListTemplate: 'Template/GET_LIST_TEMPLATE',
            removeTemplate : 'Template/REMOVE_TEMPLATE'
        }),
        getList(route){
            this.is_loading = true
            var current_page = route.query.page ? route.query.page : 1 
            var keyword = route.query.keyword ? route.query.keyword :  ''
            var type = route.query.type ? route.query.type :  ''
            var limit = this.pagination.limit 
            this.updateFilter({ page : current_page , keyword , type })
            this.getListTemplate({ 
                current_page , 
                keyword,
                type,
                limit
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
        remove(id){
            this.$refs.confirm.show({
                title : 'Confirm',
                content : 'Do you want to remove this template ?',
                btnSave : 'Delete',
                onSave : () => {
                    return new Promise((resolve , reject) =>{
                        this.removeTemplate(id)
                        .then((res)=>{
                            let {status} = res.data 
                            if( status ){
                                this.$toasted.success('Delete Template successfully !')
                                this.reloadAfterRemove()
                            }else{
                                this.$toasted.error('Oops.. Something Went Wrong.. !')
                            }
                        })
                        .catch(()=>{
                            this.$toasted.error('Oops.. Something Went Wrong.. !')
                        })
                        .finally((res)=>{
                            resolve()
                        })
                    })
                }
            })
        },
        reloadAfterRemove(){
            this.getList(this.$route)
        }
    },
    beforeRouteUpdate (to, from, next) {
        this.getList(to)
        next()
    },
    created(){
        if( this.$route.query['type']){
            this.pagination.type_question = this.$route.query['type']
        }
        if( this.$route.query['keyword']){
            this.pagination.keyword = this.$route.query['keyword']
        }
        this.getList(this.$route)
    }
}
</script>
