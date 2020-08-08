package service

import (
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"myurl/middleware"
	"myurl/model"
	"myurl/serializer"
	"os"
	"time"
)

// 用户注册
type UserRegister struct {
	UserName        string `form:"user_name" json:"user_name" binding:"required"`
	Password        string `form:"password" json:"password" binding:"required"`
	PasswordConfirm string `form:"password_confirm" json:"password_confirm" binding:"required"`
}

// 用户登录
type UserLogin struct {
	UserName string `form:"user_name" json:"user_name" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

// 用户注册方法
func (s *UserRegister) Register() serializer.Response {
	u := model.Users{
		UserName: s.UserName,
		Password: s.Password,
	}
	// 验证两次密码是否一致
	if s.Password != s.PasswordConfirm {
		return serializer.Response{
			Code: 0,
			Msg:  "两次输入的密码不一致",
		}
	}
	// 查询是否重复注册
	count := 0
	model.Db.Model(&model.Users{}).Where("user_name = ?", s.UserName).Count(&count)
	if count > 0 {
		return serializer.Response{
			Code: 0,
			Msg:  "该用户名已被占用",
		}
	}
	// 密码加密
	bytes, err := bcrypt.GenerateFromPassword([]byte(s.Password), 12)
	if err != nil {
		return serializer.Response{
			Code: 0,
			Msg:  "密码加密失败",
		}
	}
	u.Password = string(bytes)
	// 创建用户
	if err := model.Db.Model(&model.Users{}).Create(&u).Error; err != nil {
		return serializer.Response{
			Code: 0,
			Msg:  "注册失败",
		}
	}
	return serializer.Response{
		Code: 1,
		Msg:  "注册成功",
	}
}

// 用户登录方法
func (s *UserLogin) Login() serializer.Response {
	var u model.Users
	var j middleware.JWT
	// 检查是否存在该用户
	if err := model.Db.Model(&model.Users{}).Where("user_name = ?", s.UserName).First(&u).Error; err != nil {
		return serializer.Response{
			Code: 0,
			Msg:  "不存在该用户",
		}
	}
	// 检查密码是否正确
	if bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(s.Password)) != nil {
		return serializer.Response{
			Code: 0,
			Msg:  "密码错误",
		}
	}

	// 生成token
	token, err := j.CreateToken(middleware.CustomClaims{
		ID:       u.ID,
		UserName: u.UserName,
		StandardClaims: jwt.StandardClaims{
			NotBefore: int64(time.Now().Unix() - 1000), // 签名生效时间
			ExpiresAt: int64(time.Now().Unix() + 3600), // 过期时间 一小时
			Issuer:    os.Getenv("JWT_ISSUER"),         //签名的发行者
		},
	})

	if err != nil {
		return serializer.Response{
			Code: -1,
			Msg:  "登录失败: token生成失败",
		}
	}

	return serializer.Response{
		Code: 1,
		Msg:  "登录成功",
		Data: token,
	}
}
