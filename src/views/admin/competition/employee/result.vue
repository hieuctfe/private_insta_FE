<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading p-t-50 p-b-50 text-center" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-20 ">
                    <router-link :to="back" class="btn btn-outline-secondary btn-back"> 
                        <i class="material-icons">arrow_back</i>&nbsp; Back to list
                    </router-link>
                </div>
                <div class="col col-12 m-b-20" v-if="is_loading_error">
                    <div class="box-empty p-t-50 p-b-50 text-center" v-if="is_loading_error == 404">
                        <h3>Data not found !</h3>
                    </div>
                    <div class="box-empty p-t-50 p-b-50 text-center" v-else>
                        <h3>Oops.. Something Went Wrong.. !</h3>
                    </div>
                </div>
                <template v-else>
                    <div class="col col-12">
                        <item-result :data="data" :is-guest="false"></item-result>
                    </div>
                </template>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapActions } from 'vuex';
import ItemResult from '@/views/admin/partials/item-result'
export default {
    name : 'EmployeeResult',
    components : {
        ItemResult
    },
    data(){
        return {
            is_loading : false,
            is_loading_error : false,
            back : {
                name : 'DetailEmployeeCompetition',
                params : {
                    id : this.$route.params.id
                }
            },
            data : null 
        }
    },
    methods:{
        ...mapActions({
            getResult : 'Competition/GET_USER_RESULT'
        })
    },
    created(){
        this.is_loading = true 
        var id = this.$route.params.id
        var user_id =this.$route.params.user_id 
        var type = 'user'
        this.getResult({ id , user_id , type }).then((res)=>{
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
