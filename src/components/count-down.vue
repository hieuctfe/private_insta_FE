<template>
    <div class="count-down">
        {{ clock }}
    </div>
</template>
<script>
export default {
    name : 'CountDown',
    props:{
        value :{
            type : Number
        },
        onTimeout :{
            type : Function,
            default : ()=>{}
        }
    },
    data(){
        return {
            timeout : null
        }
    },
    computed:{
        clock(){
            var time = this.value
            var days = ~~(time / 86400);
            var hrs = ~~((time % 86400) / 3600);
            var mins = ~~((time % 3600) / 60);
            var secs = ~~time % 60;
            var ret = "";
            if( days > 0 ){
                ret += "" + days + ":" + (hrs < 10 ? "0" : "");
            }
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return ret;
        }
    },
    created(){
        this.timeout = setInterval(() => {
            if( this.value > 0 ){
                this.$emit('input' , this.value - 1)
            }else{
                this.onTimeout()
                clearInterval(this.timeout)
            }
            
        }, 1000);
    },
    beforeDestroy(){
        clearInterval(this.timeout)
    }
}
</script>

