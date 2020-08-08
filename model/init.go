package model

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

var Db *gorm.DB

// 连接数据库
func Init() {
	// 读取配置
	_ = godotenv.Load()

	db, err := gorm.Open(os.Getenv("DB_TYPE"), os.Getenv("DB_DSN"))
	// 数据库日志开启
	db.LogMode(true)

	// Error处理
	if err != nil {
		logrus.Fatal("数据库连接失败", err.Error())
	}

	// 设置空闲
	db.DB().SetMaxIdleConns(50)
	// 设置最大连接数
	db.DB().SetMaxOpenConns(100)
	// 设置连接超时时间 30s
	db.DB().SetConnMaxLifetime(time.Second * 30)

	Db = db
}
