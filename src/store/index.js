import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storeage.js'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        //  将token储存在这里方便全局共享,而不需要在储存中存取多次
        //  这里的token右两个字符串,一对象形式储存,token、refresh_token
        //  token易过期,这也是为了防止token被盗,但是refresh_token过期周期长,所以是利用刷新token去请求新的token,
        //  这个操作放在拦截器里面处理是最好不过了,无形的处理token过期的问题
        user: JSON.parse(getItem('TOUTIAO_TOKEN'))
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            setItem("TOUTIAO_TOKEN", JSON.stringify(user))
        }
    }
})

export default store