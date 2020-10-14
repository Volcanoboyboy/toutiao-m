import request from '@/utils/request.js'

//  登录
export const login = data => {
    return request({
        method: "POST",
        url: 'app/v1_0/authorizations',
        data
    })
}

//  发送验证码
export const getSmsCode = mobile => {
    return request({
        method: "GET",
        url: `app/v1_0/sms/codes/${mobile}`
    })
}

//  获取用户自己信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: 'app/v1_0/user'
    })
}

//  获取用户频道数据
export const getUserChannels = () => {
    return request({
        method: "GET",
        url: '/app/v1_0/user/channels'
    })
}

// 关注用户
export const addFollow = id => {
    return request({
        method: 'POST',
        url: '/app/v1_0/user/followings',
        data: {
            target: id
        }
    })
}
// 取消关注用户
export const unFollow = id => {
    return request({
        method: "DELETE",
        url: `/app/v1_0/user/followings/${id}`,
    })
}
// 获取用户扉页信息,后台接口文档显示必要id,但是实际并没有,可能是包含在token中把
export const getUserProfile = id => {
    return request({
        method: "GET",
        url: '/app/v1_0/user/profile',
    })
}
// 更新图片身份证等资料
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}
