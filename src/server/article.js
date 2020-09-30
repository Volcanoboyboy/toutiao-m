import request from '@/utils/request'

//  文章列表请求

//  根据频道id获取文章列表

export const getArticles = params => {
    return request({
        method: 'GET',
        url: 'app/v1_1/articles',
        params
    })
}