<template>
    <div v-html="html"></div>
</template>
<script>
import SimpleMDE from 'simplemde';
export default {
    name : 'MarkdownComplier',
    props:{
        value :{
            required: true
        }
    },
    computed:{
        html(){
            return SimpleMDE.prototype.markdown(this.value)
        }
    },
}
</script>

