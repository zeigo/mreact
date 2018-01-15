module.exports = { 
  entry: "./index.js",// 项目打包入口文件 
  output: { 
    path: __dirname, 
    filename: "./build/bundle.js"// 项目打包出口文件 
  }, 
  module: { 
    loaders: [
      { 
        test: /\.js[x]?$/, 
        exclude: /node_modules/, 
        loader: "babel-loader?presets[]=es2015", 
      }
    ] 
  } 
}
