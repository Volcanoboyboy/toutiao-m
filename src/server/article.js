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

// 根据文章id获取文章详情
export const getArticleById = id => {
    return request({
        method: 'GET',
        url: `/app/v1_0/articles/${id}`
    })
}

/**
 * 获取所有频道
 */

export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: "/app/v1_0/channels",
    })
}

/**
 * 批量修改用户频道列表,新增保存
 * 这里patch请求body配置就是data,固定的
 */

export const addUserChannel = channel => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}

/**
 * 删除用户频道
 */

export const deleteUserChannel = channelId => {
    return request({
        method: "DELETE",
        url: `/app/v1_0/user/channels/${channelId}`
    })
}

/**
 * 收藏文章
 */

export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/collections',
        data: {
            target
        }
    })
}

/**
 * 取消收藏
 */

export const deleteCollect = target => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/article/collections/${target}`
    })
}

/**
 * 点赞
 */

export const addLike = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/article/likings',
        data: {
            target
        }
    })
}

/**
 * 删除点赞
 */

export const deleteLike = target => {
    return request({
        method: "DELETE",
        url: `/app/v1_0/article/likings/${target}`
    })
}
