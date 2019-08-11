<template>
    <div  class="list-questions">
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
                <tbody>
                    <tr v-for="(item , index) in data" :key="`index_${index}`">
                        <td class="td-index">{{ index + 1 }}</td>
                        <td class="td-level">{{ item.level | capitalize}}</td>
                        <td class="td-function-name">{{ item.func_name}}</td>
                        <td>{{ item.threads | limit(30)}}</td>
                        <td class="td-action">
                            <a href="#" class="text-primary m-r-15" @click.stop.prevent="info(item.id)">
                                <i class="material-icons">info</i>
                            </a>
                            <a href="#" class="text-danger" @click.stop.prevent="remove(index)">
                                <i class="material-icons">delete_forever</i>
                            </a>
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
                        <th scope="col" class="td-multiple">Mutiple Answer</th>
                        <th scope="col">Threads</th>
                        <th scope="col" class="td-action">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item , index) in data" :key="`index_${index}`">
                        <td class="td-index">{{ index + 1 }}</td>
                        <td class="td-level">{{ item.level | capitalize}}</td>
                        <td class="td-multiple">
                            <template v-if="item.multi_answer == VUE_APP_IS_TRUE">
                                Mutiple
                            </template>
                            <template v-else>
                                Single
                            </template>
                        </td>
                        <td>{{ item.threads | limit(30)}}</td>
                        <td class="td-action">
                            <a href="#" class="text-primary m-r-15" @click.stop.prevent="info(item.id)">
                                <i class="material-icons">info</i>
                            </a>
                            <a href="#" class="text-danger" @click.stop.prevent="remove(index)">
                                <i class="material-icons">delete_forever</i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
        <modal-question v-model="show_modal" :id.sync="id" ></modal-question>
    </div>
</template>
<script>
import ModalQuestion from '@/views/admin/partials/modal-question'
export default {
    name : 'ListQuestion',
    components:{
        ModalQuestion
    },
    props :{
        type : {

        },
        value : {
            type : Array,
            required : true
        }
    },
    data(){
        return {
            show_modal : false,
            id : ''
        }
    },
    computed:{
        data : {
            get(){
                return this.value 
            },
            set(value){
                this.$emit('input', value)
            }
        }
    },
    methods:{
        remove(index){
            this.data.splice(index, 1)
        },
        info(id){
            this.id = id 
            this.show_modal = true 
        },
    }
}
</script>
<style lang="scss" scoped>
    .list-questions{
        max-height: 300px;
        overflow: hidden auto;
    }
</style>
