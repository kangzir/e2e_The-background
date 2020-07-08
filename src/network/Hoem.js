import {$axios,axios1} from './axios'
export function getHoemGoods(type,page){
  return $axios({
    url:'/home/data',
    params:{
      type,
      page,
    }
  })
}
export function getHoem(){
  return axios1({
    url:'/uni',
    params:{
      key:'0b4ac38ee3d762bf2cbde9be3f578952'
    }
  })
}