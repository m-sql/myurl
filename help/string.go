package help

//十进制转换为62进制：0-9a-zA-Z
func TenTo62(id uint) string {
	//todo random it (@since fomo3d.wiki)
	charset := "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var shortUrl []byte
	for {
		var result byte
		number := id % 62
		result = charset[number]
		/*var tmp []byte
		  tmp = append(tmp, result)
		  shortUrl = append(tmp, shortUrl...)*/
		shortUrl = append(shortUrl, result)
		id = id / 62
		if id == 0 {
			break
		}
	}
	return string(shortUrl)
}
