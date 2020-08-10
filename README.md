#  mURL (my url)

## 是一个对URL进行压缩的自动化工具（文件上传+文件短网址）🚀

# 功能特点
* 跨平台支持（支持Linux, Mac环境，Windows环境理论上也支持，不过未全面测试）
* 目前只支持 PNG、JPG、JPEG 等 文件上传
* 支持批量文件上传
* 支持自定义Route 和 API快速定制

#  安装使用
## 依赖软件
##### 一般依赖
* go 1.14+
* git

### 0、下载源码
```linux
 [root@lidi home]# git clone https://github.com/m-sql/myurl
  Cloning into 'myurl'...
  remote: Enumerating objects: 26, done.
  remote: Counting objects: 100% (26/26), done.
  remote: Compressing objects: 100% (21/21), done.
```
### 1、linux下执行Go
``` linux
cd myurl

[root@test1 myurl]# go run go.main
 [GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.
 
 [GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
  - using env:   export GIN_MODE=release
  - using code:  gin.SetMode(gin.ReleaseMode)
 
 [GIN-debug] GET    /v2/:short_url            --> myurl/controller.Short2Long (4 handlers)
 [GIN-debug] POST   /api/user/login           --> myurl/controller.Login (4 handlers)
 [GIN-debug] POST   /api/user/register        --> myurl/controller.Register (4 handlers)
 [GIN-debug] POST   /api/long/short           --> myurl/controller.Long2Short (4 handlers)
 [GIN-debug] GET    /templates/*filepath      --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (4 handlers)
 [GIN-debug] HEAD   /templates/*filepath      --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (4 handlers)
 [GIN-debug] GET    /upload/*filepath         --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (4 handlers)
 [GIN-debug] HEAD   /upload/*filepath         --> github.com/gin-gonic/gin.(*RouterGroup).createStaticHandler.func1 (4 handlers)
 [GIN-debug] GET    /upload                   --> myurl/controller.UploadHtml (4 handlers)
 [GIN-debug] POST   /upload/UploadAction      --> myurl/controller.UploadFile (4 handlers)
 [GIN-debug] Listening and serving HTTP on :9090

```
### 2、立刻即用

```linux
访问 http://localhost:9090/upload
```
### 3、样例图片
![MyUrl](https://github.com/m-sql/myurl/blob/master/doc/1.png)

### License
```go
_= "Completely MIT Licensed. Including ALL dependencies. If you love or like it ！Please join us!"
```
## 协议
[MIT : license](https://github.com/m-sql/myurl/blob/master/LICENSE)