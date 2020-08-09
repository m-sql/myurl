package router

import (
	"github.com/gin-gonic/gin"
	"myurl/controller"
	"myurl/middleware"
)

func Init() *gin.Engine {
	r := gin.Default()

	// 跨域中间件
	r.Use(middleware.Cors())

	//1、短网址解析服务
	r.GET("/:short_url", controller.Short2Long)

	// 路由组
	api := r.Group("api")
	{
		api.POST("user/login", controller.Login)
		api.POST("user/register", controller.Register)
		jwt := api.Group("")
		jwt.Use(middleware.JWTAuth())
		{
			// 需要jwt token验证的路由组
		}
		//2、短网址生成服务
		api.POST("long/short", controller.Long2Short)
	}

	return r
}
