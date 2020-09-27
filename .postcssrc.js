module.exports = {
    plugins: {
        //  脚手架已经默认配置过此配置,重复配置会警告
        // 'autoprefixer': {
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },

        //  这里要考虑的是iphone6/7/8是750像素,但是vant是基于375写的,如果设置为75则vant会缩小一半,所以要兼容
        'postcss-pxtorem': {
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            propList: ['*'] //  配置所有css属性
        }
    }
}