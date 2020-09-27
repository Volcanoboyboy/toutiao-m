//  封装本地储存

//  获取
export const getItem = name => {
    const data = window.localStorage.getItem(name)
    try {
        return JSON.parse(data)
    } catch (err) {
        return data
    }
}

//  储存
export const setItem = (name, value) => {
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
}

//  移除
export const removeItem = name => {
    window.localStorage.removeItem(name)
}