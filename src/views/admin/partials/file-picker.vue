<template>
    <label class="upload-file" @dragover.prevent @drop="dragDrop($event)">
        <transition name="fade" mode="out-in">
            <div v-if="current_file" key="is-current-file">
                <a  v-if="config.file_document_extensions.indexOf(current_file.type) >= 0" class="upload-file-review" target="_blank" :href="`https://docs.google.com/gview?url=${current_file.src}&embedded=true`">
                    <div class="upload-file-review-img" >
                        <img v-if="current_file.type == 'pdf'" src="@/assets/icons/pdf.png" alt="">
                        <img v-else src="@/assets/icons/doc.png" alt="">
                    </div>
                    <div class="upload-file-review-name">
                        {{ current_file.src | file_name}}
                    </div>
                    <div class="text-center">
                        <a @click.stop.prevent="current_file = null" class="upload-file-review-remove">
                            <i class="material-icons">delete_forever</i>
                        </a>
                    </div>
                </a>
                <div  v-else-if="config.file_image_extensions.indexOf(current_file.type) >= 0" class="upload-file-review">
                    <div class="upload-file-review-img" >
                        <img :src="current_file.src" alt="">
                    </div>
                    <div class="upload-file-review-name">
                        {{ current_file.src | file_name}}
                    </div>
                    <div class="text-center">
                        <a @click.stop.prevent="current_file = null" class="upload-file-review-remove">
                            <i class="material-icons">delete_forever</i>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="upload-file-review" v-else-if="new_file" key="is-has-file">
                <div class="upload-file-review-img" >
                    <template v-if="config.file_document_extensions.indexOf(new_file.type) >= 0">
                        <img v-if="new_file.type == 'pdf'" src="@/assets/icons/pdf.png" alt="">
                        <img v-else src="@/assets/icons/doc.png" alt="">
                    </template>
                    <template v-else-if="config.file_image_extensions.indexOf(new_file.type) >= 0">
                        <img :src="new_file.src" alt="">
                    </template>
                </div>
                <div class="upload-file-review-name">
                    {{ new_file.name }}
                </div>
                <div class="text-center">
                    <a @click.stop.prevent="new_file = null" class="upload-file-review-remove">
                        <i class="material-icons">delete_forever</i>
                    </a>
                </div>
            </div>
            <div class="placeholder" v-else key="is-empty">
                <div>Drop files here or click to upload.</div>
                <div><small>accept {{ extensions.join(' , ') }} files up to {{config.max_size}}MB</small></div>
            </div>
        </transition>
        <input type="file" @change="onChangeFile($event)"  class="hide" hidden >
    </label>
</template>
<script>
export default {
    name : 'FilePicker',
    props :{
        value : {},
        current : {},
        extensions : {
            default : ()=>{
                return ['doc','docx','pdf', 'jpg', 'png', 'jpe', 'jpeg']
            }
        }
    },
    data(){
        return {
            config:{
                max_size: parseInt(process.env.VUE_APP_MAX_SIZE_UPLOAD),
                file_document_extensions : ['doc','docx','pdf'],
                file_image_extensions : ['jpg', 'png', 'jpe', 'jpeg'],
            }
        }
    },
    computed :{
        new_file : {
            get(){
                return this.value 
            },
            set(value){
                this.$emit('input', value)
            }
        },
        current_file : {
            get(){
                return this.current 
            },
            set(value){
                this.$emit('update:current', value)
            }
        }
    },
    methods:{
        onChangeFile($event){
            var vm = this
            if(this.current_file ){
                this.current_file = null 
            }
            var files = $event.target.files || $event.dataTransfer.files;
            if( files.length == 0) return 
            var file = files[0]
            this.readFile(file)
            $($event.target).val('');
        },
        dragDrop ($event) {
            event.stopPropagation();
            event.preventDefault();
            var files = $event.dataTransfer.files;
            var file = files[0]
            if(this.current_file ){
                this.current_file = null 
            }
            this.readFile(file)
        },
        readFile(file){
            var vm = this
            var type = file.name.replace(/^.*\./, '').toLowerCase()
            if(  this.extensions.indexOf(type) == -1 ){
                this.$toasted.error(file.name+ " is not valid file.")
                return
            }
            if(  this.config.file_document_extensions.indexOf(type) >= 0 ){
                this.readFileDocument(file)
            }else if(  this.config.file_image_extensions.indexOf(type) >= 0 ){
                this.readFileImage(file)
            }
        },
        readFileDocument(file){
            var vm = this
            var fileReader = new FileReader();  

            fileReader.onload = function() {
                if( file.size <= (vm.config.max_size * 1024 * 1024) ){
                    vm.new_file  = {
                        name: file.name,
                        size: file.size,
                        type: file.name.replace(/^.*\./, '').toLowerCase() ,
                        file : file
                    }
                }else{
                    vm.new_file = null
                }
            };
            fileReader.onerror = ()=>{
                vm.new_file = null
            };
            fileReader.readAsArrayBuffer(file);
        },
        readFileImage(file){
            var vm = this
        
            var fileReader = new FileReader();  

            fileReader.onload = function(e) {
                if( file.size <= (vm.config.max_size * 1024 * 1024) ){
                    vm.new_file =  {
                        src : e.target.result,
                        name: file.name,
                        size: file.size,
                        type: file.name.replace(/^.*\./, '').toLowerCase() ,
                        file : file
                    }
                }else{
                    vm.new_file = null
                }
            };
            fileReader.onerror = ()=>{
                vm.new_file = null
            };
            fileReader.readAsDataURL(file);
        },
    }
}
</script>
<style lang="scss" scoped>
.upload-file{
    min-height: 240px;
    border: 2px dashed #0087F7;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    &-empty{
        cursor: pointer;
    }
    .placeholder{
        color:#646C7F;
        font-size: 18px;
        font-weight: 500;
    }
    &-review{
        text-align: center;
        position: relative;
        padding: 0 30px;
        &-img{
            img{
                max-width: 100px;
                max-height: 100px;
            }
        }
        &-name{
            margin-bottom: 10px;
            word-break: break-all;
        }
        &-remove{
            
            width: 34px;
            height: 34px;
            display: inline-flex;
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
}
</style>
