import axios from 'axios'
export function $axios(config){
  const instaxios = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3/',
    timeout: 300,
  })

  instaxios.interceptors.request.use(config => {
  return config;
  },error => {
  return Promise.reject(error);
  });

  instaxios.interceptors.response.use(response => {
  return response.data;
  },error => {
  return Promise.reject(error);
  });
  return instaxios(config)
}

export function axios1(config){
  const instaxios = axios.create({
    baseURL: 'http://v.juhe.cn/weather',
    timeout: 5000,
    headers: 'Access-Control-Allow-Origin',
  })
  
  instaxios.interceptors.request.use(config => {
    return config;
    },error => {
    return Promise.reject(error);
    });
  
    instaxios.interceptors.response.use(response => {
    return response.data;
    },error => {
    return Promise.reject(error);
    });
    return instaxios(config)
}