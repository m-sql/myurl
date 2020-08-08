package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// 跨域中间件
func Cors() gin.HandlerFunc {
	//return cors.New(cors.Config{
	//	AllowOrigins:     []string{"https://foo.com"},
	//	AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE"},
	//	AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Cookie"},
	//	AllowCredentials: true,
	//})
	return cors.Default()
}
