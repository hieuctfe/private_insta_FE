<template>
    <label class="material-checkbox">
        <input type="radio" v-model="checkbox" :value="defaultValue"> <span>{{ label }}</span>
    </label>
</template>
<script>
export default {
    name : 'Radio',
    props:{
        label :{
            type : String,
            default : ''
        },
        value :{
            type : [Number , String],
            required: true
        },
        defaultValue :{
            type : [Number , String],
            required: true
        }
    },
    computed :{
        checkbox : {
            get(){
                return this.value == this.defaultValue 
            },
            set(value){
                this.$emit('input', value )
            }
        }
    }
}
</script>
