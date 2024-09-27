## 在线图片处理工具
一些常用的图片处理功能，其中图片压缩基于 rust 的 wasm 模块在本地执行，只需要一个静态服务器防止前端页面文件即可，人像和证件照相关处理基于开源项目 [HivisionIDPhotos](https://github.com/Zeyi-Lin/HivisionIDPhotos)，需要参考 HivisionIDPhotos 项目部署后端接口服务.

Demo 地址： [https://kgsoft.cn](https://kgsoft.cn)。

接口服务器比较拉，建议不要频繁请求。

## TODO
基于 tensorflowjs 的前端人像抠图方案。

## 包含以下功能
- 单张图片压缩（客户端压缩）
- 批量图片压缩（客户端压缩）
- 人像抠图 （基于 https://github.com/Zeyi-Lin/HivisionIDPhotos)
- 证件照生成 （基于 https://github.com/Zeyi-Lin/HivisionIDPhotos)
