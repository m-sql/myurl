package model

import "github.com/jinzhu/gorm"

type Urls struct {
	gorm.Model
	ShortUrl  string `json:"short_url"`
	OriginUrl string `json:"origin_url"`
	HashCode  string `json:"hash_code"`
	Status    int8   `json:"status"`
}
