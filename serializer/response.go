package serializer

// 通用返回结构体
type Response struct {
	Code  int8        `json:"code"`
	Msg   string      `json:"msg"`
	Data  interface{} `json:"data"`
	Error string      `json:"error"`
}
