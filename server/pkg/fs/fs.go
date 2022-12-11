package fs

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strconv"
)

func ReadDir(path string) []fs.DirEntry {
	entries, err := os.ReadDir(path)
	if err != nil {
		log.Fatal(err)
	}
	return entries
}

func CreateDir(path string) bool {
	err := os.Mkdir(path, 0755)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func DeleteDir(path string) bool {
	err := os.RemoveAll(path)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func CopyDir(fromPath string, toPath string) bool {
	err := filepath.Walk(fromPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		destPath := filepath.Join(toPath, path)
		if info.IsDir() {
			os.MkdirAll(destPath, info.Mode())
			return nil
		}

		src, err := os.Open(path)
		if err != nil {
			return err
		}
		defer src.Close()

		dest, err := os.Create(destPath)
		if err != nil {
			return err
		}
		defer dest.Close()

		if _, err := io.Copy(dest, src); err != nil {
			return err
		}

		if err := os.Chmod(destPath, info.Mode()); err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func MoveDir(fromPath string, toPath string) bool {
	err := os.Rename(fromPath, toPath)
	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func ChangeMode(path string, modeStr string) bool {
	mode, err := strconv.ParseInt(modeStr, 8, 32)
	if err != nil {
		fmt.Println(err)
		return false
	}

	err2 := os.Chmod(path, os.FileMode(mode))
	if err2 != nil {
		log.Fatal(err)
		return false
	}

	return true
}

func ReadFile(path string) string {
	file, err := os.Open(path)
	if err != nil {
		fmt.Println("Unable to open file:", err)
		return ""
	}
	defer file.Close()

	buf := make([]byte, 1024)
	content := ""

	for {
		n, err := file.Read(buf)
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("Unable to read file:", err)
			return ""
		}

		content += string(buf[:n])
	}

	return content
}

func CreateFile(path string) bool {
	file, err := os.Create(path)
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer file.Close()
	return true
}

func UpdateFile(path string, content string) bool {
	file, err := os.Create(path)
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer file.Close()

	_, err2 := file.WriteString(content)

	if err2 != nil {
		fmt.Println(err2)
		return false
	}

	return true
}

func DeleteFile(path string) bool {
	err := os.Remove(path)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return true
}

func CopyFile(fromPath string, toPath string) bool {
	originalFile, err := os.Open(fromPath)
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer originalFile.Close()

	newFile, err := os.Create(toPath)
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, originalFile)

	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func MoveFile(fromPath string, toPath string) bool {
	err := os.Rename(fromPath, toPath)
	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func RenameFile(path string, oldName string, newName string) bool {
	err := os.Rename(filepath.Join(path, oldName), filepath.Join(path, newName))
	if err != nil {
		fmt.Println(err)
		return false
	}

	return true
}

func UploadFile(file multipart.FileHeader, outputPath string) bool {
	src, err := file.Open()
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer src.Close()

	dst, err := os.Create(filepath.Join(outputPath, file.Filename))
	if err != nil {
		fmt.Println(err)
		return false
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		fmt.Println(err)
		return false
	}

	return true
}
