## 在线图片处理工具
一些常用的图片处理功能，其中图片压缩基于 rust 的 wasm 模块在本地执行，只需要一个静态服务器防止前端页面文件即可，人像和证件照相关处理基于开源项目 [HivisionIDPhotos](https://github.com/Zeyi-Lin/HivisionIDPhotos)，需要参考 HivisionIDPhotos 项目部署后端接口服务.

Demo 地址：
- 图片压缩 [https://kgsoft.cn](https://kgsoft.cn)。
- 人像抠图（[https://kgsoft.cn/matting](https://kgsoft.cn/matting)）
- 证件照生成（[https://kgsoft.cn/idcard](https://kgsoft.cn/idcard)）

接口服务器比较拉，建议不要频繁请求。

## TODO
基于 tensorflowjs 的前端人像抠图方案。

## 包含以下功能
- 单张图片压缩（客户端压缩）
- 批量图片压缩（客户端压缩）
- 人像抠图 （基于 https://github.com/Zeyi-Lin/HivisionIDPhotos)
- 证件照生成 （基于 https://github.com/Zeyi-Lin/HivisionIDPhotos)

## 本地测试
使用下面的命令启动服务后访问控制台提示的本地地址即可：
```
npm install
npm run dev
```

## 部署发布
使用下面的命令打包后将 dist 目录中的文件部署到静态服务器即可：
```
npm run build
```
