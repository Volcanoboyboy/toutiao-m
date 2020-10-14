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
            propList: ['*'], //  配置所有css属性

            //  配置需要转换的样式资源
            //  因为我们利用github——markdown.css但是从pc搬到移动端,字体就很小,这个时候就需要排除这个文件
            //  当然实际是有设计稿的,没有这个操作
            exclude: /github-markdown/
        }
    }
}