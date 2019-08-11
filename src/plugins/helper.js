import moment from 'moment'
const helper = {
    /* create unique id */
    createId(){
        var text = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (text()+text()+""+text()+""+text()+""+text()+""+text()+text()+text());
    },
    /* return true if value is type int */
    isNumeric(value) {
        return /^-{0,1}\d+$/.test(value)
    },
    /* return true if value is type int or float */
    isNumber(value){
        return !isNaN(parseFloat(value)) && isFinite(value)
    },
    /* return false word has indexof array */
    excluded(arr = []  , value = '' ){
        let str = String(value)
        let words = str.split(' ').filter( item => (item != '' && arr.indexOf(item) >= 0))
        return words.length  == 0
    },
    isDate(value){
        if( value && helper.isNumeric(value)){
            return moment(parseInt(value)).isValid()
        }
        return false
    },
    hash(params){
        var h=0, i=0;
        if(typeof (params) === "string") {
            for(i=0; i<params.length; i++) {
                h = (h * 31 + params.charCodeAt(i)) & 0xffffffff;
            }
        }
        else if( params instanceof Array) {
            for(i in params) {
                h ^= helper.hash(params[i]);
            }
        }
        return h;
    },
}
export default helper