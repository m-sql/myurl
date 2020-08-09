package router

import (
	"fmt"
	_ "github.com/ChengjinWu/gojson"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"myurl/controller"
	"myurl/middleware"
	_ "myurl/serializer"
	_ "myurl/service"
	"net/http"
	"os"
	"strings"
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
	//加载单个静态文件 r.StaticFile("/favicon.ico", "./static/favicon.ico")
	r.GET("upload", func(c *gin.Context) {
		c.HTML(http.StatusOK, "upload.html", gin.H{})
	})
	r.POST("upload/UploadAction", func(c *gin.Context) {
		file, _ := c.FormFile("fileList")
		// 上传文件至指定目录
		if err := c.SaveUploadedFile(file, "./upload/"+file.Filename); err != nil {
			fmt.Println(err)
		}
		url := os.Getenv("PROXY_URL")
		var long2short = url + "api/long/short"
		var uri = url + "upload/" + file.Filename
		payload := strings.NewReader("origin_url=" + uri)
		req, _ := http.NewRequest("POST", long2short, payload)
		req.Header.Add("content-type", "application/x-www-form-urlencoded")
		req.Header.Add("cache-control", "no-cache")
		res, _ := http.DefaultClient.Do(req)
		defer res.Body.Close()
		var body, _ = ioutil.ReadAll(res.Body)
		//fmt.Println(string(body))
		stringSlice := strings.Split(string(body), `"`)
		fmt.Println("result:", stringSlice)
		var shortUri = ""
		for k, v := range stringSlice {
			if k == 9 {
				shortUri = v
			}
		}
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.String(200, `<br>🤖️ 原网地址 🌹: <a>`+uri+`</a>`+`<br>🚜 短链地址 🥥: <a>`+shortUri+`</a>`)
	})

	return r
}
