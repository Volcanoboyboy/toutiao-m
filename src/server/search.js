
import request from '@/utils/request'
//  搜索接口

export const getSearchResult = params => {
    return request({
        method: "GET",
        url: "/app/v1_0/search",
        params
    })
}

export const getSearchSuggestions = q => {
    return request({
        method: 'GET',
        url: '/app/v1_0/suggestion',
        params: {
            q
        }
    })
}