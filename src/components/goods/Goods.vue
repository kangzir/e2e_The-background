<template>
  <div class="goods">
    <goods-item :goods="goods">
    </goods-item>
  </div>
</template>


<script>
import GoodsItem from './GoodsItem'
  export default {
    name:'',
    props:{
      goods:Array
    },
    components:{
      GoodsItem,
    },
    data() {
      return {
      }
    },
  }
</script>


<style lang="less">
 .goods{
   display: flex;
 }
</style>