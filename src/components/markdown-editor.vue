<template>
  <div class="markdown-editor" :class="{'markdown-editor-auto' : heightAuto}">
    <textarea :name="name"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';
import marked from 'marked';

export default {
    name: 'markdown-editor',
    props: {
        value: String,
        name: String,
        previewClass: String,
        autoinit: {
            type: Boolean,
            default () {
                return true;
            },
        },
        heightAuto : {
            type : Boolean,
            default : false
        },
        highlight: {
            type: Boolean,
            default () {
                return false;
            },
        },
        sanitize: {
            type: Boolean,
            default () {
                return false;
            },
        },
        configs: {
            type: Object,
            default () {
                return {};
            },
        },
    },
    activated() {
        const editor = this.simplemde;
        if (!editor) return;
        const isActive = editor.isSideBySideActive() || editor.isPreviewActive();
        if (isActive) editor.toggleFullScreen();
    },
    methods: {
        initialize() {
            const configs = Object.assign({
                element: this.$el.firstElementChild,
                initialValue: this.value,
                renderingConfig: {},
            }, this.configs);

            if (configs.initialValue) {
                this.$emit('input', configs.initialValue);
            }

            if (this.highlight) {
                configs.renderingConfig.codeSyntaxHighlighting = true;
            }

            marked.setOptions({
                sanitize: this.sanitize
            });

            this.simplemde = new SimpleMDE(configs);

            const className = this.previewClass || '';
            this.addPreviewClass(className);

            this.bindingEvents();
        },
        bindingEvents() {
            this.simplemde.codemirror.on('blur', () => {
                this.$emit('input', this.simplemde.value());
            });
        },
        addPreviewClass(className) {
            const wrapper = this.simplemde.codemirror.getWrapperElement();
            const preview = document.createElement('div');
            wrapper.nextSibling.className += ` ${className}`;
            preview.className = `editor-preview ${className}`;
            wrapper.appendChild(preview);
        },
    },
    mounted() {
        if (this.autoinit) this.initialize();
    },
    destroyed() {
        this.simplemde = null;
    },
    watch: {
        value(val) {
            if (val === this.simplemde.value()) return;
            this.simplemde.value(val);
        },
    },
};
</script>

<style>
    .markdown-editor .markdown-body {
        padding: 0.5em
    }

    .markdown-editor .editor-preview-active, .markdown-editor .editor-preview-active-side {
        display: block;
    }
    
</style>
