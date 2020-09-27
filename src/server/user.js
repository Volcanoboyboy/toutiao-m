import request from '@/utils/request.js'

//  登录
export const login = data => {
    return request({
        method: "POST",
        url: '/app/v1_0/authorizations',
        data
    })
}

//  发送验证码
export const getSmsCode = mobile => {
    return request({
        method: "GET",
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}

