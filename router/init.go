package router

import (
	"github.com/gin-gonic/gin"
	"myurl/controller"
	"myurl/middleware"
	"net/http"
)

func Init() *gin.Engine {
	r := gin.Default()
	// 跨域中间件服务
	r.Use(middleware.Cors())
	// 短网址解析服务
	r.GET("v2/:short_url", controller.Short2Long)
	// 路由组服务
	api := r.Group("api")
	{
		api.POST("user/login", controller.Login)
		api.POST("user/register", controller.Register)
		jwt := api.Group("")
		jwt.Use(middleware.JWTAuth())
		{
			//需要jwt token验证的路由组
		}
		// 短网址生成服务
		api.POST("long/short", controller.Long2Short)
	}
	//加载HTML
	r.LoadHTMLFiles("./templates/upload.html")
	//加载静态资源，例如网页的css、js
	r.Static("/templates", "./templates")
	//加载静态资源，一般是上传的资源，例如用户上传的图片
	r.StaticFS("/upload", http.Dir("upload"))
	//加载单个静态文件 r.StaticFile("/favicon.ico", "./static/favicon.ico")
	// 加载上传页面
	r.GET("upload", controller.UploadHtml)
	// 上传服务
	r.POST("upload/UploadAction", controller.UploadFile)
	return r
}
