package service

import (
	"fmt"
	"myurl/help"
	"myurl/model"
	"myurl/serializer"
	"os"
)

//生成短网址
type Long2ShortRequest struct {
	OriginUrl string `form:"origin_url" json:"origin_url" binding:"required"`
}

//短网址结构体
type ShortUrl struct {
	Id        uint   `json:"id"`
	ShortUrl  string `json:"short_url"`
	OriginUrl string `json:"origin_url"`
	HashCode  string `json:"hash_code"`
}

//短网址
func generateShortUrl(req *Long2ShortRequest, c model.Urls, hashcode string) (shortUrl string, err error) {
	result := model.Db.Model(&c).Exec("insert INTO urls (origin_url,hash_code)VALUES (?,?)", req.OriginUrl, hashcode)
	if result.Error != nil {
		return shortUrl, err
	}
	//注意不要用主从延迟（TODO lucklidi@126.com）
	model.Db.Model(&model.Urls{}).Where("hash_code = ?", hashcode).First(&c)
	shortUrl = help.TenTo62(c.ID)
	if err := model.Db.Model(&c).Exec("update urls set short_url=? where id=?", shortUrl, c.ID).Error; err != nil {
		return shortUrl, err
	}
	return shortUrl, err
}

//1、生成短网址
func (req *Long2ShortRequest) Long2Short() serializer.Response {
	var short ShortUrl
	var c model.Urls
	//urlMd5 := fmt.Sprintf("%x", md5.Sum([]byte(req.OriginUrl)))
	urlMd5 := fmt.Sprintf("%x", help.Murmur64([]byte(req.OriginUrl)))
	// 检查是否存在
	if err := model.Db.Model(&model.Urls{}).Where("hash_code = ?", urlMd5).First(&c).Error; err != nil {
		// 数据库中没有记录，生成一个新的短url
		shortUrl, errRet := generateShortUrl(req, c, urlMd5)
		if errRet != nil {
			return serializer.Response{
				Code: 0,
				Msg:  "创建失败",
			}
		}
		short.ShortUrl = shortUrl
	} else {
		short.ShortUrl = c.ShortUrl
	}
	return serializer.Response{
		Code: 1,
		Msg:  "成功",
		Data: os.Getenv("PROXY_URL") + "v2/" + short.ShortUrl,
	}
}

//2、解析短网址
func (shortUrl *ShortUrl) Short2Long() serializer.Response {
	var c model.Urls
	if shortUrl.ShortUrl == "" {
		return serializer.Response{
			Code: 0,
			Msg:  "解析失败",
			Data: "",
		}
	}
	// 检查是否存在
	if err := model.Db.Model(&model.Urls{}).Where("short_url = ?", shortUrl.ShortUrl).First(&c).Error; err != nil {
		return serializer.Response{
			Code: 0,
			Msg:  "解析失败",
			Data: "",
		}
	}

	return serializer.Response{
		Code: 1,
		Msg:  "成功",
		Data: c.OriginUrl,
	}
}
