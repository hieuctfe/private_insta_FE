<template>
    <transition name="fade" mode="out-in">
        <div class="box-loading" v-if="is_loading" key="is-loading">
            <div class="icon-loading large bg-purple"></div>
        </div>
        <div class="create-competition" v-else key="is-loading-success">
            <div class="row">
                <div class="col col-12 m-b-20 ">
                    <button @click="backGuest" class="btn btn-outline-secondary btn-back"> 
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
                <div class="col col-12 m-b-20" v-else>
                    <transition name="fade" mode="out-in">
                        <div v-if="is_allow_modify"  key="is-allow-modify">
                            <update-guest-competition :data="data" ></update-guest-competition>
                        </div>
                        <div v-else key="is-not-allow-modify">
                            <item-result :data="data"  :is-guest="true"></item-result>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ModalTemplate from '@/views/admin/partials/modal-template'
import ItemResult from '@/views/admin/partials/item-result'
import UpdateGuestCompetition from './update-competition'
import CompetitionBack from '@/mixins/competition-back'
export default {
    name : 'CreateCompetition',
    mixins : [CompetitionBack],
    components:{
        ItemResult , UpdateGuestCompetition
    },
    data(){
        return {
            is_loading: false,
            is_loading_error : false,
            is_allow_modify: false,
            data: null,
            guest: null 
        }
    },
    methods:{
        ...mapActions({
            get : 'Competition/GUEST_COMPETITION',
            getResult : 'Competition/GET_USER_RESULT'
        }),
    },
    async created(){
        this.is_loading = true 
        try {
            var response = await this.get(this.$route.params.id)
            let { status , data } = response.data 
            if( status ){
                this.is_loading_error = false
                if( data.test ){
                    this.is_allow_modify = false
                    this.guest = data.guest
                    try {
                        var result = await this.getResult({
                            id : data.id ,
                            user_id : data.user_ids,
                            type : 'guest'
                        })
                        if( result.data.status ){
                            this.data = result.data.data 
                        }
                    } catch (error) {
                        
                    }
                }else{
                    this.is_allow_modify = true
                    this.data = data
                }
            }else{
                this.is_loading_error = true
            }
        } catch (error) {
            this.is_loading_error = true
        }
        this.is_loading = false
    }
}
</script>