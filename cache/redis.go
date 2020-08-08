package cache

import (
	"github.com/go-redis/redis/v7"
	"github.com/sirupsen/logrus"
	"os"
	"strconv"
)

var redisClient *redis.Client

func RedisInit() {
	// 连接redis
	db, _ := strconv.ParseUint(os.Getenv("REDIS_DB"), 10, 64)
	client := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PWD"),
		DB:       int(db),
	})

	// 抛出异常
	_, err := client.Ping().Result()
	if err != nil {
		logrus.Fatal("Redis连接失败", err.Error())
	}

	redisClient = client
}
