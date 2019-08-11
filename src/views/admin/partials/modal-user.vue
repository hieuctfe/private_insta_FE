<template>
    <div class="vue-modal-template">
        <transition name="fade" mode="out-in">
            <div class="modal" v-if="modal_show">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Choose  User</h5>
                            <button type="button" class="close" @click.stop.prevent="close" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="input-group input-group-search m-b-30">
                                <input type="text" class="form-control" placeholder="Search ..." v-model="pagination.keyword" @keyup="onKeyword">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" >
                                        <i class="material-icons">
                                            search
                                        </i>
                                    </button>
                                </div>
                            </div>
                            <transition name="fade" mode="out-in">
                                <div class="p-t-30 p-b-30 text-center" v-if="is_loading" key="is-loading">
                                    <div class="icon-loading bg-primary large"></div>
                                </div>
                                <div v-else key="loading-success" class="row-table">
                                    <table class="table">
                                        <thead >
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="pagination.data.length">
                                            <tr v-for="(item , index) in pagination.data" :key="`index_${index}`">
                                                <td>
                                                    <label class="material-checkbox m-0" @click.stop.prevent="onSelect(item)">
                                                        <input type="checkbox" :checked="setChecked(item.id)"><span></span>
                                                    </label>
                                                </td>
                                                <td>{{ item.full_name | capitalize }}</td>
                                                <td>{{item.email}}</td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr>
                                                <td colspan="3">
                                                    data not found
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class=" col col-12 text-center p-t-20">
                                        <pagination :change="onChangePage" :router-link="false" :total="pagination.total_page" v-model="pagination.current_page"></pagination>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" @click.stop.prevent="onChoose" :disabled="!selected.length">
                                Choose <template v-if="selected.length">({{selected.length}})</template>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-backdrop" @click="close()"></div>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import lodash from 'lodash'
export default {
    name : 'ModalUser',
    props:{
        value : {
            type : Boolean,
        },
        onSave : {
            type : Function,
            default : ()=>{}
        },
        users:{
            type : Array,
        }
    },
    computed:{
        modal_show : {
            get(){
                return this.value
            },
            set(value){
                this.$emit('input', value)
            }
        }
    },
    data(){
        return {
            pagination :{
                limit : 10,
                data : [],
                current_page: 1,
                total_page: 0,
                keyword : '',
            },
            timeout : null,
            is_error: null,
            is_loading : false,
            selected : []
        }
    },
    methods:{
        ...mapActions({
            getList : 'User/GET_LIST_EMPLOYEE'
        }),
        setChecked(id){
            return _.findIndex(this.selected , { id : id}) >= 0 
        },
        onChoose(){
            this.onSave(this.selected)
            this.close()
        },
        onSelect(item){
            var index = _.findIndex(this.selected , { id : item.id}) 
            if( index >= 0){
                this.selected.splice(index,1)
            }else{
                this.selected.push(item)
            }
        },
        close(){
            this.reset()
            this.modal_show = false
        },
        load({ current_page , keyword }){
            this.is_loading = true 
            this.getList({ 
                current_page , 
                keyword,
                limit : this.pagination.limit ,
                role : 'employees'
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
        reset(){
            this.options = {
                title : '',
                content : '',
                btnClose : 'Close',
                btnCloseClass : 'btn btn-secondary',
                btnSave : 'Done',
                btnSaveClass : 'btn btn-primary',
                onSave : null,
                onClose : null,
                isLoading: false,
            }
        },
        onChangeKeyword(){
            this.load({ current_page : 1, keyword : this.pagination.keyword })
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
        onChangePage(page){
            this.load({ current_page : page, keyword : this.pagination.keyword })
        }
    },
    watch :{
        'value' :function(value){
            if( value ){
                this.selected = JSON.parse(JSON.stringify(this.users))
                this.load({ current_page : 1, keyword : this.pagination.keyword })
            }else{
                this.selected = []
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .vue-modal-template{
        user-select: none;
        .modal{
            display: block;
            overflow: hidden auto;
            padding: 50px 0;
            &-dialog{
                z-index: 1041;
                width: 800px;
                max-width: 800px;
                margin: 0 auto;
            }
            &-body{
                padding:  15px;
                .row-table{
                    margin-left: -15px;
                    margin-right: -15px;
                }
                .table{
                    .td-action{
                        width: 100px;
                        max-width: 100px;
                        min-width: 100px;
                    }
                }
            }
            &-footer{
                button{
                    min-width: 100px;
                }
            }
            &-backdrop{
                opacity: 0.5;
            }
        }
    }
</style>
