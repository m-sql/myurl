package model

import "github.com/jinzhu/gorm"

type Users struct {
	gorm.Model
	UserName string `json:"user_name"`
	Password string `json:"password"`
	NickName string `json:"nick_name"`
	Avatar   string `json:"avatar"`
	Status   int8   `json:"status"`
}
