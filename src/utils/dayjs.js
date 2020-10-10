import Vue from 'vue'
import dayjs from 'dayjs'

import "dayjs/locale/zh-cn"
import relativeTime from 'dayjs/plugin/relativeTime'

//  配置相对时间插件
dayjs.extend(relativeTime)

dayjs.locale('zh-cn')

// 配置全局过滤器,格式过滤时间

Vue.filter('relativeTime', value => {
    return dayjs().to(dayjs(value))
})