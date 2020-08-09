package router

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"myurl/controller"
	"myurl/middleware"
	"net/http"
)

func Init() *gin.Engine {
	r := gin.Default()
	// 跨域中间件
	r.Use(middleware.Cors())

	//1、短网址解析服务
	r.GET("v2/:short_url", controller.Short2Long)
	//路由组
	api := r.Group("api")
	{
		api.POST("user/login", controller.Login)
		api.POST("user/register", controller.Register)
		jwt := api.Group("")
		jwt.Use(middleware.JWTAuth())
		{ //需要jwt token验证的路由组
		}
		//2、短网址生成服务
		api.POST("long/short", controller.Long2Short)
	}

	//3、上传服务
	r.LoadHTMLFiles("./templates/upload.html")
	//加载静态资源，例如网页的css、js
	r.Static("/templates", "./templates")
	//加载静态资源，一般是上传的资源，例如用户上传的图片
	r.StaticFS("/upload", http.Dir("upload"))
	//加载单个静态文件
	//r.StaticFile("/favicon.ico", "./static/favicon.ico")
	r.POST("upload/UploadAction", func(c *gin.Context) {
		file, _ := c.FormFile("fileList")
		// 上传文件至指定目录
		if err := c.SaveUploadedFile(file, "./upload/"+file.Filename); err != nil {
			fmt.Println(err)
		}
		//c.HTML(http.StatusOK, "upload.html", gin.H{"name": "/upload/" + file.Filename})
		c.Header("Content-Type", "text/html; charset=utf-8")
		var url = "http://localhost:9090" + "/upload/" + file.Filename
		c.String(200, `<br>🤖️ 短链地址 🌹: <a>`+url+`</a>`)
		/*c.JSON(http.StatusOK, serializer.Response{
			Code: 1,
			Msg:  "成功",
			Data: "",
		})*/
	})
	r.GET("upload", func(c *gin.Context) {
		c.HTML(http.StatusOK, "upload.html", gin.H{})
	})

	return r
}
