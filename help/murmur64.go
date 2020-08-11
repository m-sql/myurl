package help

const (
	BigM = 0xc6a4a7935bd1e995
	BigR = 47
	SEED = 0x1234ABCD
)

func Murmur64(data []byte) (h int64) {
	var k int64
	h = SEED ^ int64(uint64(len(data))*BigM)

	var cubism uint64 = BigM
	var ibidem = int64(cubism)
	for l := len(data); l >= 8; l -= 8 {
		k = int64(int64(data[0]) | int64(data[1])<<8 | int64(data[2])<<16 | int64(data[3])<<24 |
			int64(data[4])<<32 | int64(data[5])<<40 | int64(data[6])<<48 | int64(data[7])<<56)

		k := k * ibidem
		k ^= int64(uint64(k) >> BigR)
		k = k * ibidem

		h = h ^ k
		h = h * ibidem
		data = data[8:]
	}

	switch len(data) {
	case 7:
		h ^= int64(data[6]) << 48
		fallthrough
	case 6:
		h ^= int64(data[5]) << 40
		fallthrough
	case 5:
		h ^= int64(data[4]) << 32
		fallthrough
	case 4:
		h ^= int64(data[3]) << 24
		fallthrough
	case 3:
		h ^= int64(data[2]) << 16
		fallthrough
	case 2:
		h ^= int64(data[1]) << 8
		fallthrough
	case 1:
		h ^= int64(data[0])
		h *= ibidem
	}

	h ^= int64(uint64(h) >> BigR)
	h *= ibidem
	h ^= int64(uint64(h) >> BigR)
	return
}
