<template>
<div class="goodsitem" v-if="goods">
  <div v-for="(item,key) in goods" :key="key" @click="detailsClick(item)">
    <img v-if="item.image||item.show.img" :src="item.image||item.show.img" alt="" @load="loadimg">
    <p>{{item.title}}</p>
    <p>
      <span>¥{{item.price}}</span>
      <span>{{item.cfav}}</span>
      <span>{{item.iid}}</span>
    </p>
  </div>
</div>
</template>


<script>
  export default {
    name:'',
    props:{
      goods:Array
    },
    methods: {
      loadimg(){
        this.$bus.$emit('loadimg')
      },
      detailsClick(item){
        this.$router.push('/details/'+item.iid)
      }
    },
  }
</script>

<style lang="less">
.goodsitem{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  div{
    width:150px;
    p{
      font-size: 15px;
      // word-spacing: normal;
      white-space: nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
      width: 100%;
      span{
        color: red;
        margin-left: 10px;
      }
    }
  }
  img{
    width: 100%;
  }
}
</style>