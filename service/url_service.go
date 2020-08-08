package service

import (
	"crypto/md5"
	_ "crypto/md5"
	"fmt"
	_ "fmt"
	_ "github.com/dgrijalva/jwt-go"
	_ "golang.org/x/crypto/bcrypt"
	"myurl/help"
	_ "myurl/middleware"
	"myurl/model"
	"myurl/serializer"
	_ "os"
	_ "time"
)

//生成短网址
type Long2ShortRequest struct {
	OriginUrl string `json:"origin_url"`
}

//解析短网址
type Short2LongRequest struct {
	ShortUrl string `json:"short_url"`
}

type ShortUrl struct {
	Id        int64  `db:"id"`
	ShortUrl  string `db:"short_url"`
	OriginUrl string `db:"origin_url"`
	HashCode  string `db:"hash_code"`
}

//记录短网址
func generateShortUrl(req *Long2ShortRequest, c model.Urls, hashcode string) (shortUrl string, err error) {
	var short ShortUrl
	//TODO 1
	fmt.Print(req.OriginUrl)
	result := model.Db.Model(&c).Exec("insert INTO urls (origin_url,hash_code)VALUES (?,?)", req.OriginUrl, hashcode)
	if result.Error != nil {
		return shortUrl, err
	}
	// 0-9a-zA-Z 六十二进制
	result.Last(&short)
	//TODO 2
	fmt.Print(short)
	shortUrl = help.TenTo62(short.Id)
	if err := model.Db.Model(&c).Exec("update urls set short_url=? where id=?", shortUrl, short.Id).Error; err != nil {
		return shortUrl, err
	}
	return shortUrl, err
}

//生成短网址
func (req *Long2ShortRequest) Long2Short() serializer.Response {
	urlMd5 := fmt.Sprintf("%x", md5.Sum([]byte(req.OriginUrl)))
	var short ShortUrl
	var c model.Urls
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
	}
	return serializer.Response{
		Code: 1,
		Msg:  "成功",
		Data: short.ShortUrl,
	}
}

//解析短网址
func (s *Short2LongRequest) Short2Long() serializer.Response {
	return serializer.Response{
		Code: 1,
		Msg:  "登录成功",
		Data: '1',
	}
}
