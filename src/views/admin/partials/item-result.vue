<template>
    <div >
        <div class="row">
            <div class="col col-12 m-b-30">
                <div class="page-title">Competition Result</div>
            </div>
            <div class="col col-12  m-b-30">
                <div class="result-box card">
                    <div class="result-box-head">
                        <template v-if="data.type == 'guest'">
                            <h3>Guest Info</h3>
                        </template>
                        <template v-else>
                            <h3>User Info</h3>
                        </template>
                    </div>
                    <div class="result-box-body">
                        <ul class="competition-info" v-if="data.type == 'guest'">
                            <li>
                                <strong>Full name : </strong>
                                <span>{{ data.user.full_name}}</span>
                            </li>
                            <li>
                                <strong>Email : </strong>
                                <span>{{ data.user.email}}</span>
                            </li>
                            <li>
                                <strong>Code : </strong>
                                <span>{{ data.user.code }}</span>
                            </li>
                            <li>
                                <strong>CV file : </strong>
                                <span>
                                    <a :href="`https://docs.google.com/gview?url=${data.user.cv_file}&embedded=true`" target="_blank">File</a>
                                </span>
                            </li>
                        </ul>
                        <ul class="competition-info" v-else>
                            <li>
                                <strong>Full name : </strong>
                                <span>{{ data.user.full_name}}</span>
                            </li>
                            <li>
                                <strong>Email : </strong>
                                <span>{{ data.user.email}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col col-12   m-b-30">
                <div class="result-box card">
                    <div class="result-box-head">
                        <h3>Competition Info</h3>
                    </div>
                    <div class="result-box-body">
                        <ul class="competition-info">
                            <li>
                                <strong>Title : </strong>
                                <span>{{ data.title}}</span>
                            </li>
                            <li>
                                <strong>Type : </strong>
                                <span>{{ data.type_question |capitalize}}</span>
                            </li>
                            <li>
                                <strong>Total Questions : </strong>
                                <span>{{ data.question_ids | get_length}}</span>
                            </li>
                            <li>
                                <strong>Duration : </strong>
                                <span>{{ data.duration}} <small>minutes</small></span>
                            </li>
                            <li>
                                <strong>IP : </strong>
                                <span>{{ data.test.ips}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col col-12  m-b-30">
                <div class="card">
                    <item-result-competition :data="data"></item-result-competition>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ItemResultCompetition from '@/views/admin/partials/item-result-competition'
export default {
    name : 'Result',
    components:{
        ItemResultCompetition
    },
    props:{
        data :{},
    },
}
</script>