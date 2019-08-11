<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading p-t-50 p-b-50 text-center" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-20 ">
                    <button @click="backEmployee" class="btn btn-outline-secondary btn-back"> 
                        <i class="material-icons">arrow_back</i>&nbsp; Back to list
                    </button>
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
                    <transition name="fade" mode="out-in">
                        <div v-if="is_allow_modify"  key="is-allow-modify" class="col col-12">
                            <update-employee-competition :data="data" ></update-employee-competition>
                        </div>
                        <div v-else key="is-not-allow-modify" class="col col-12"> 
                            <detail-employee-competition :data="data" ></detail-employee-competition>
                        </div>
                    </transition>
                </template>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ModalTemplate from '@/views/admin/partials/modal-template'
import ItemResult from './result'
import UpdateEmployeeCompetition from './update-competition'
import DetailEmployeeCompetition from './competition-detail'
import CompetitionBack from '@/mixins/competition-back'
export default {
    name : 'DetailCompetition',
    mixins : [CompetitionBack],
    components:{
        DetailEmployeeCompetition , UpdateEmployeeCompetition
    },
    data(){
        return {
            is_loading: false,
            is_loading_error : false,
            is_allow_modify: false,
            data: null,
            pagination : {
                current_page : 1,
                limit : process.env.VUE_APP_PAGINATION_LIMIT,
                data : []
            }
        }
    },
    methods:{
        ...mapActions({
            get : 'Competition/EMPLOYEE_COMPETITION',
            getResult : 'Competition/GET_USER_RESULT'
        }),
    },
    created(){
        this.is_loading = true 
        this.get(this.$route.params.id).then((res)=>{

            let { status , data , pagination } = res.data 
            if( status ){
                let { competition , users } = data 
                this.is_loading_error = false
                this.data = Object.assign(competition,  { users })
                this.is_allow_modify = this.data.status == 0 ? true : false 
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

