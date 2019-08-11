<template>
    <div class="detail-competition">
        <div class="card">
            <div class="card-body m-b-20">
                <div class="page-title">
                    Competition Info
                </div>
                <hr>
                <ul class="list-info">
                    <li>
                        <strong>Title : </strong>
                        <span>{{ data.title}}</span>
                    </li>
                    <li>
                        <strong>Start Date : </strong>
                        <span>{{ data.start_date | date_string }}</span>
                    </li>
                    <li>
                        <strong>End Date : </strong>
                        <span>{{ data.end_date | date_string }}</span>
                    </li>
                    <li>
                        <strong>Type : </strong>
                        <span>{{ data.type_question }} </span>
                    </li>
                    <li>
                        <strong>Duration : </strong>
                        <span>{{ data.duration}} minutes</span>
                    </li>
                    <li>
                        <strong>Total Questions : </strong>
                        <span>{{ data.question_ids | get_length }}</span>
                    </li>
                    <li>
                        <strong>Total Users : </strong>
                        <span>{{ data.user_ids | get_length }}</span>
                    </li>
                </ul>
            </div>
            <div class="card-body">
                <div class="page-title">
                    List users 
                </div>
                <hr>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col" class="td-action"></th>
                        </tr>
                    </thead>
                    <tbody v-if="data.users">
                        <tr v-for="(item , index) in data.users" :key="`index_${index}`">
                            <td>{{ index + 1}}</td>
                            <td>{{ item.full_name | capitalize }}</td>
                            <td>{{item.email}}</td>
                            <td class="td-action text-right">
                                <template v-if="item.test">
                                    <template v-if="item.test.is_finished || item.test.time_out">
                                        <router-link :to="{ name : 'EmployeeCompetitionResult' , params :{ id : item.id }}" class="btn btn-block btn-sm btn-success">
                                            Result
                                        </router-link>
                                    </template>
                                    <template v-else-if="!item.test.is_finished && !item.test.time_out">
                                        <div class="btn btn-block btn-sm btn-warning">
                                            Testing
                                        </div>
                                    </template>
                                </template>
                                <template v-else>
                                    <div class="btn btn-block btn-sm btn-outline-secondary">
                                        Waiting
                                    </div>
                                </template>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="10">
                                data not found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name : 'DetailEmployeeCompetition',
    props :{
        data : {

        },
    },
    
}
</script>
<style lang="scss">
    .detail-competition{
        .list-info{
            padding: 0;
            list-style-type: none;
            li{
                display: block;
                margin-bottom: 10px;
            }
        }
    }
</style>
