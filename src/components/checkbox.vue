<template>
    <label class="material-checkbox">
        <input type="checkbox" v-model="checkbox"> <span>{{ label }}</span>
    </label>
</template>
<script>
export default {
    name : 'Checkbox',
    props:{
        label :{
            type : String,
            default : ''
        },
        value :{
            type : [Number , String],
            required: true
        }
    },
    computed :{
        checkbox : {
            get(){
                return this.value == this.VUE_APP_IS_TRUE  ? true : false 
            },
            set(value){
                this.$emit('input', value == true  ? this.VUE_APP_IS_TRUE : this.VUE_APP_IS_FALSE )
            }
        }
    }
}
</script>
