package internal

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/dchest/uniuri"
	"github.com/gabriel-vasile/mimetype"
	"github.com/tg123/go-htpasswd"
)

var BaseDir = ""
var JwtKey = ""

func SetBaseDir(baseDir string) {
	BaseDir = baseDir
}

func GenerateJwtKey() {
	JwtKey = uniuri.NewLen(uniuri.UUIDLen)
}

func joinPath(path string) string {
	return filepath.Join(BaseDir, strings.ReplaceAll(path, "..", ""))
}

func joinFilePath(file File) string {
	return filepath.Join(BaseDir, strings.ReplaceAll(file.Path, "..", ""), file.Name)
}

func substring(str string, start int, end int) string {
	start_str_idx := 0
	i := 0
	for j := range str {
		if i == start {
			start_str_idx = j
		}
		if i == end {
			return str[start_str_idx:j]
		}
		i++
	}
	return str[start_str_idx:]
}

func newFile(path string, info os.FileInfo) File {
	fullPath := filepath.Join(path, info.Name())
	mimeType, _ := mimetype.DetectFile(fullPath)

	return File{
		Name:  info.Name(),
		IsDir: info.IsDir(),
		Mime:  mimeType.String(),
		Size:  info.Size(),
		Date:  info.ModTime().Format("Jan 02, 2006 15:04:05"),
		Mode:  info.Mode().String(),
		Path:  path,
	}
}

func AuthExists() bool {
	if _, err := os.Stat(".htpasswd"); err == nil {
		return true
	}

	return false
}

func isAuthorized(username string, password string) bool {
	auth, err := htpasswd.New(".htpasswd", htpasswd.DefaultSystems, nil)
	if err != nil {
		log.Fatalf(err.Error())
	}

	return auth.Match(username, password)
}
