package migration

import "myurl/model"

// 自动迁移
func Migration() {
	model.Db.AutoMigrate(&model.Users{})
	model.Db.AutoMigrate(&model.Urls{})

	model.Db.Model(&model.Urls{}).AddIndex("idx_s_url", "short_url")
	model.Db.Model(&model.Urls{}).AddUniqueIndex("uiq_h_code", "hash_code")
}
