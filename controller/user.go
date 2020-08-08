package controller

import (
	"github.com/gin-gonic/gin"
	"myurl/serializer"
	service2 "myurl/service"
	"net/http"
)

// 用户注册
func Register(c *gin.Context) {
	var service service2.UserRegister
	if err := c.ShouldBind(&service); err != nil {
		c.JSON(http.StatusOK, serializer.Response{
			Code:  0,
			Msg:   "参数缺失",
			Error: err.Error(),
		})
	} else {
		// 注册操作
		res := service.Register()
		c.JSON(http.StatusOK, res)
	}
}

// 用户登录
func Login(c *gin.Context) {
	var service service2.UserLogin
	if err := c.ShouldBind(&service); err != nil {
		c.JSON(http.StatusOK, serializer.Response{
			Code:  0,
			Msg:   "参数错误",
			Error: err.Error(),
		})
	} else {
		// 登录操作
		res := service.Login()
		c.JSON(http.StatusOK, res)
	}
}
