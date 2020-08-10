package controller

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"myurl/serializer"
	service2 "myurl/service"
	"net/http"
	"os"
	"strings"
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

//上传文件
func UploadFile(c *gin.Context) {
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
	var resData map[string]interface{}
	var body, _ = ioutil.ReadAll(res.Body)
	//解析Json 数据到 map
	_ = json.Unmarshal(body, &resData)
	fmt.Println("result:", resData["data"])
	var shortUri = fmt.Sprintf("%s", resData["data"])
	c.Header("Content-Type", "text/html; charset=utf-8")
	c.String(200, `<br><br>🤖️ 原网地址 🌹: <a>`+uri+`</a>`+`<br><br>🚜 短链地址 🥥: <a>`+shortUri+`</a>`)
}
