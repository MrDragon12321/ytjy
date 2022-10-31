import {h} from 'vue'

const lists=(props:{},context:any)=>{
    return h(`div`,{class:'lists-box'},context.slots)
}

export default lists