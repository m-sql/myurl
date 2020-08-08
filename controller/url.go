package controller

import (
	"github.com/gin-gonic/gin"
	service2 "myurl/service"
	"net/http"
)

//生成短网址
func Long2Short(c *gin.Context) {
	var service service2.Long2ShortRequest
	res := service.Long2Short()
	c.JSON(http.StatusOK, res)
}

//解析短网址
func Short2Long(c *gin.Context) {
	var service service2.Short2LongRequest
	res := service.Short2Long()
	c.JSON(http.StatusOK, res)
}
