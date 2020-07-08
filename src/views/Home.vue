<template>
  <div>
    <button @click="tianq">tianq</button>
  </div>
</template>

<script>
// import {getHoem} from '../network/Hoem'
import axios from 'axios'
  export default {
    name:'',
    data() {
      return {
      }
    },
    methods: {
      tianq(){
        axios.get('http://v.juhe.cn/weather/uni',{
          key:'0b4ac38ee3d762bf2cbde9be3f578952'
        })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.error(err); 
        })
      }
    },
  }
</script>


<style scoped lang="less">

</style>