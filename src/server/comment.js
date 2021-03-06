import request from '@/utils/request'


//  评论文章
export const addComment = req_body => {
    return request({
        method: 'POST',
        url: "/app/v1_0/comments",
        data: req_body
    })
}

// 获取文章列表
export const getComments = params => {
    return request({
        method: 'GET',
        url: '/app/v1_0/comments',
        params
    })
}

/**
 * 对评论点赞
 */

export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/comment/likings',
        data: target
    })
}

/**
 * 取消评论点赞
 */

export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/comment/likings/${target}`
    })
}