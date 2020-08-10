package controller

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

//加载上传页面
func UploadHtml(c *gin.Context) {
	c.HTML(http.StatusOK, "upload.html", gin.H{})
}
