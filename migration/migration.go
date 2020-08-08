package migration

import "myurl/model"

// 自动迁移
func Migration() {
	model.Db.AutoMigrate(&model.Users{})
}
