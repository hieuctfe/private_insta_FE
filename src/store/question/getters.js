export default {
    getListLevel(state){
        return state.levels
    },
    getListCategoryChoice(state){
        return state.categories.filter((item)=>item.type_question == 'choice')
    },
    getListCategoryCode(state){
        return state.categories.filter((item)=>item.type_question == 'code')
    },
    getQuestionFilter(state){
        return state.question_filter
    },
    getType(state){
        return state.type
    }
}