import axios from 'axios'
import router from '../router'
import store from '../store'

//  配置request的基准路径
const request = axios.create({
    baseURL: "http://ttapi.research.itcast.cn/"
})


/**
 * 不知这个配置是干什么的???????
 * 配置处理后端返回数据中超出 js 安全整数范围问题
 */
// request.defaults.transformResponse = [
//     function (data) {
//         try {
//             return jsonBig.parse(data);
//         } catch (err) {
//             return {};
//         }
//     }
// ];


//  这里主要是用来处理token访问以及token过期利用刷新token获取新的token
// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 第一次登录token已经保存了这里只会出现响应拦截器错误,请求是不会出错的
    const user = store.state.user;
    if (user) {
        config.headers.Authorization = user.token;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    console.log(error, 'token报错');
    // token过期响应出错在这里
    if (error.response && error.response.status === 401) {
        //  token过期判断是否有刷新token
        const user = store.state.user;
        if (!user || !user.state.user) {
            router.push('/login')
            return
        }

        // 有刷新token的情况,利用刷新token获取token并返回原请求完成请求
        try {
            const { data: res } = await request({
                method: "PUT",
                url: '/app/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer${user.refresh_token}`
                }
            })
            //  利用刷新token获取token成功
            store.commit('setUser', {
                token: res.data.token,
                refresh_token: user.refresh_token
            })
            //  这里的error.config包含上一次用户的请求method和url等,继续发出去完成上一次token过期的请求
            return request(error.config)
        } catch (err) {
            router.push({ name: 'login' })
        }
    }
    return Promise.reject(error);
});

export default request