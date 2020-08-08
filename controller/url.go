package controller

import (
	"github.com/gin-gonic/gin"
	"myurl/serializer"
	service2 "myurl/service"
	"net/http"
)

//生成短网址
func Long2Short(c *gin.Context) {
	var service service2.Long2ShortRequest
	if err := c.ShouldBind(&service); err != nil {
		c.JSON(http.StatusOK, serializer.Response{
			Code:  0,
			Msg:   "参数缺失",
			Error: err.Error(),
		})
	} else {
		res := service.Long2Short()
		c.JSON(http.StatusOK, res)
	}
}

//解析短网址
func Short2Long(c *gin.Context) {
	var service service2.Short2LongRequest
	if err := c.ShouldBind(&service); err != nil {
		c.JSON(http.StatusOK, serializer.Response{
			Code:  0,
			Msg:   "参数缺失",
			Error: err.Error(),
		})
	} else {
		res := service.Short2Long()
		c.JSON(http.StatusOK, res)
	}
}
