const path =require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const webpack=require('webpack');


module.exports={

    entry:'./path/to/my/entry/file.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'my-first-webpack.bundle.js'
    },
    module:{
        //对一个单独的 module 对象定义了 rules 属性，里面包含两个必须属性：test 和 use。,意思為在require()或import語句中被解析成.txt的路徑時，先使用loader轉換一下
        rules:[{test:'/\.txt$',use:'raw-loader'}]
    },
    //html-webpack-plugin 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。
    plugins:[new HtmlWebpackPlugin({template:'/src/index.html'})],
    mode:'production'
}