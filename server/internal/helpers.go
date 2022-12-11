package internal

import (
	"path/filepath"
)

func getBaseDir() string {
	return getEnv(BaseDirKey)
}

func joinPath(path string) string {
	return filepath.Join(getBaseDir(), path)
}

func joinFilePath(file File) string {
	return filepath.Join(getBaseDir(), file.Path, file.Name)
}
