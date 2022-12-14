package internal

import (
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/dchest/uniuri"
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
