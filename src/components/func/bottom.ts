import {h} from 'vue'

const bottom=(props:{},context:any)=>{
    return h(`div`,{class:'bottom-box'},context.slots)
}
export default bottom