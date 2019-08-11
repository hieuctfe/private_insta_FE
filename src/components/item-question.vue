<template>
    <div class="item-question" @click="onSelect()">
        <div class="item-question-title">
            {{ data.func_name}}
        </div>
        <div class="item-question-body">
            <div v-line-clamp:20="4">{{ data.threads}}</div>
        </div>
        <div class="item-question-level">
            <strong>level : {{ data.level }}</strong>
            <template v-if="allowModify">
                <a v-if="isReview" @click.stop.prevent="selected = false" class="item-question-remove">
                    <i class="material-icons">delete_forever</i>
                </a>
                <label v-else class="material-checkbox">
                    <input type="checkbox" :checked="selected"><span></span>
                </label>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    name : 'ItemQuestion',
    props:{
        value :{
            type : Array,
            required : true
        },
        data :{
            type : Object,
            required : true 
        },
        onAdd :{
            type : Function ,
            default : ()=>{}
        },
        onRemove :{
            type : Function,
            default : ()=>{}
        },
        isReview : {
            type : Boolean,
            default : false,
        },
        allowModify :{
            type : Boolean,
            default : true
        }
    },
    data(){
        return {

        }
    },
    methods:{
        onSelect(){
            if( this.isReview || !this.allowModify) return 
            this.selected = !this.selected
        }
    },
    computed:{
        ids :{
            get(){
                return this.value
            },
            set(value){
                return this.$emit('input', value)
            }
        },
        selected :{
            get(){
                return this.value.indexOf( this.data.id ) >= 0
            },
            set(value){
                if(value){
                    if( this.ids.indexOf(this.data.id) == -1 ){
                        this.ids.push(this.data.id)
                        this.onAdd(this.data)
                    }
                }else{
                    this.ids = this.ids.filter((item)=>item != this.data.id)
                    this.onRemove(this.data)
                }
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.item-question{
    width: 100%;
    border: 1px solid #eee;
    box-shadow: 0 2px 2px -2px rgba(0,0,0,.2), 0 2px 34px 0 rgba(0,0,0,.14), 0 1px 4px 0 rgba(0,0,0,.12);
    margin-bottom: 30px;
    user-select: none;
    cursor: pointer;
    &-title{
        font-size: 16px;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background: #545b62;
        color:#fff;
        padding: 5px 10px;
        text-transform: capitalize;
    }
    &-body{
        padding:5px 10px;
        height: 100px;
        overflow: hidden;
    }
    &-level{
        padding:5px 10px;
        text-transform: capitalize;
        position: relative;
        user-select: none;
        
        label{
            font-size: bold;
        }
        .material-checkbox{
            position: absolute;
            right: 0px;
            top: 2px;
            margin: 0;
            pointer-events: none;
        }
    }
    &-remove{
        position: absolute;
        right: 10px;
        top: 0px;
        margin: 0;
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        overflow: hidden;
        color:$danger !important;
        cursor: pointer;
        transition: all 0.2s ease;
        &:hover{
            background-color: rgba(255, 0, 0, 0.2);
            color:$danger;
            text-decoration: none;
        }
    }
}
</style>
