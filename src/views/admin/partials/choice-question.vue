<template>
    <div class="row m-0">
        <div class="col col-12">
            <div class="row m-b-20">
                <div class="col col-8">
                    <input type="text" @keydown.enter.prevent='onChangeKeyword' @change.stop.prevent="onChangeKeyword"
                        class="form-control" v-model="pagination.keyword" placeholder="search ...">
                </div>
                <div class="col col-4">
                    <select class="form-control" v-model="pagination.level" @change="onChangeLevel">
                        <option value="">All levels</option>
                        <option v-for="(item, index) in levels" :key="`level_${index}`" :value="item">
                            {{ item  | capitalize}}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="col col-12">
            <transition name="fade" mode="out-in">
                <div class="row" v-if="is_loading" key="is-loading-question">
                    <div class="col col-12 p-t-50 p-b-50 text-center">
                        <div class="icon-loading bg-primary large"></div>
                    </div>
                </div>
                <div class="row" v-else key="is-loading-question-success">
                    <template v-if="is_loading_error">
                        <div class="col col-12">
                            <h3>Oops.. Something Went Wrong.. !</h3>
                        </div>
                    </template>
                    <template v-else>
                        <template v-if="type == 'code'">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col" class="td-index">#</th>
                                        <th scope="col" class="td-level">Level</th>
                                        <th scope="col" class="td-function-name">Function Name</th>
                                        <th scope="col">Threads</th>
                                        <th scope="col" class="td-action">Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="pagination.data.length">
                                    <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                        <td class="td-index">
                                            <label class="material-checkbox m-b-0" @click.stop.prevent="select(item)">
                                                <input type="checkbox" :checked="isChecked(item.id)"><span></span>
                                            </label>
                                        </td>
                                        <td class="td-level">{{ item.level | capitalize }}</td>
                                        <td class="td-function-name">{{ item.func_name | capitalize }}</td>
                                        <td>{{ item.threads | limit(30) }}</td>
                                        <td class="td-action">
                                            <a href="#" class="text-primary" @click.stop.prevent="info(item.id)">
                                                <i class="material-icons">info</i>
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
                        </template>
                        <template v-else-if="type == 'choice'">
                            <table class="table">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col" class="td-index">#</th>
                                        <th scope="col" class="td-level">Level</th>
                                        <th scope="col" class="td-multiple">Mulitiple Answer</th>
                                        <th scope="col">Threads</th>
                                        <th scope="col" class="td-action">Action</th>
                                    </tr>
                                </thead>
                                <tbody v-if="pagination.data.length">
                                    <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                        <td class="td-index">
                                            <label class="material-checkbox m-b-0" @click.stop.prevent="select(item)">
                                                <input type="checkbox" :checked="isChecked(item.id)"><span></span>
                                            </label>
                                        </td>
                                        <td class="td-level">{{ item.level | capitalize }}</td>
                                        <td class="td-multiple">
                                            <template v-if="item.multi_answer == VUE_APP_IS_TRUE">
                                                Mutiple
                                            </template>
                                            <template v-else>
                                                Single
                                            </template>
                                        </td>
                                        <td>{{ item.threads | limit(30) }}</td>
                                        
                                        <td class="td-action">
                                            <a href="#" class="text-primary" @click.stop.prevent="info(item.id)">
                                                <i class="material-icons">info</i>
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
                        </template>
                        <div class="col col-12 m-t-20">
                            <pagination :change="onChangePage" :router-link="false" :total="pagination.total_page"
                                v-model="pagination.current_page"></pagination>
                        </div>
                    </template>
                </div>
            </transition>
        </div>
        <modal-question v-model="show_modal" :id.sync="id" ></modal-question>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import lodash from 'lodash'
import ModalQuestion from '@/views/admin/partials/modal-question'
export default {
    name : 'ChoiceQuestion',
    components:{
        ModalQuestion
    },
    props:{
        value : {
            type : Array,
            required : true
        },
        type : {
            type : String,
            required : true
        }
    },
    data(){
        return {
            is_loading : false,
            is_loading_error: false,
            pagination:{
                error : null,
                current_page:  1,
                limit : parseInt(process.env.VUE_APP_PAGINATION_LIMIT), 
                total_page: 0,
                data : [],
                level : ''
            },
            show_modal : false,
            id : ''
        }
    },
    computed:{
        ...mapGetters({
            levels : 'Question/getListLevel'
        }),
        arr : {
            get(){
                return this.value
            }, 
            set(value){
                this.$emit('input', value)
            }
        }
    },
    methods:{
        ...mapActions({
            getListQuestion : 'Question/GET_LIST_QUESTION',
        }),
        isChecked(id){
            return _.find(this.value , { id : id}) != undefined
        },
        select(item){
            var index = _.findIndex(this.arr , { id : item.id})
            if( index >= 0){
                this.arr.splice(index , 1)
            }else{
                this.arr.push(item)
            }
        },
        loadQuestion( { current_page , level , keyword  }){
            return  new Promise((resolve, reject) => {
                this.is_loading = true
                this.is_loading_error = false
                this.getListQuestion({current_page , level , keyword , limit : this.pagination.limit , type : this.type  }).then((res)=>{
                    let { status , data , pagination } = res.data 
                    if( status ){
                        this.pagination.data = data
                        this.pagination.current_page = pagination.current_page
                        this.pagination.total_page = pagination.total_page
                    }else{
                        this.pagination.data = []
                        this.is_loading_error = true
                    }
                }).catch(err=>{
                    this.is_loading_error = true
                })
                .finally(()=>{
                    this.is_loading = false
                    resolve()
                })
            });
        },
        onChangePage(page){
            this.loadQuestion({
                current_page : page,
                level : this.pagination.level
            })
        },
        onChangeKeyword(){
            this.loadQuestion({
                current_page : 1,
                level : this.pagination.level,
                keyword : this.pagination.keyword
            })
        },
        onChangeLevel(){
            this.loadQuestion({
                current_page : 1,
                level : this.pagination.level,
                keyword : this.pagination.keyword
            })
        },
        info(id){
            this.id = id 
            this.show_modal = true 
        },
    },
    async created(){
        this.is_loading = true
        try {
            await this.loadQuestion({
                current_page : this.pagination.current_page,
                level : this.pagination.level
            })
        } catch (error) {
            
        }
        this.is_loading = false
    }
}
</script>
