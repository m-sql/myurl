package controller

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"myurl/serializer"
	service2 "myurl/service"
	"net/http"
)

//生成短网址
func Long2Short(c *gin.Context) {
	var service service2.Long2ShortRequest
	//参数绑定
	if err := c.ShouldBind(&service); err != nil {
		c.JSON(http.StatusOK, serializer.Response{
			Code:  0,
			Msg:   "参数缺失",
			Error: err.Error(),
		})
	} else {
		res := service.Long2Short()
		/** 返回数据 */
		c.JSON(http.StatusOK, res)
	}
}

//解析短网址
func Short2Long(c *gin.Context) {
	var service service2.ShortUrl
	shortUrl := c.Param("short_url")
	//参数绑定
	service.ShortUrl = shortUrl
	res := service.Short2Long()
	if res.Data != "" {
		/** 返回数据 */
		print("start1:" + shortUrl)
		var data string
		data = fmt.Sprintf("%s", res.Data)
		print("start2:" + data)
		c.Redirect(http.StatusMovedPermanently, data)
	} else {
		//解析失败
		c.JSON(http.StatusOK, res)
	}
}
