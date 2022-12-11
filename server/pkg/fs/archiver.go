package fs

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

func Unarchive(src string, dest string) bool {
	reader, err := zip.OpenReader(src)
	if err != nil {
		println(err)
		return false
	}
	defer reader.Close()

	dest, err = filepath.Abs(dest)
	if err != nil {
		println(err)
		return false
	}

	for _, f := range reader.File {
		err := unzipFile(f, dest)
		if err != nil {
			println(err)
			return false
		}
	}

	return true
}

func unzipFile(f *zip.File, dest string) error {
	filePath := filepath.Join(dest, f.Name)
	if !strings.HasPrefix(filePath, filepath.Clean(dest)+string(os.PathSeparator)) {
		return fmt.Errorf("invalid file path: %s", filePath)
	}

	if f.FileInfo().IsDir() {
		if err := os.MkdirAll(filePath, os.ModePerm); err != nil {
			return err
		}
		return nil
	}

	if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
		return err
	}

	destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	zippedFile, err := f.Open()
	if err != nil {
		return err
	}
	defer zippedFile.Close()

	if _, err := io.Copy(destinationFile, zippedFile); err != nil {
		return err
	}

	return nil
}

func Archive(files []string, target string) bool {
	f, err := os.Create(target)
	if err != nil {
		println(err)
		return false
	}
	defer f.Close()

	writer := zip.NewWriter(f)
	defer writer.Close()

	for _, file := range files {
		src, err := os.Open(file)
		if err != nil {
			println(err)
			return false
		}
		defer src.Close()

		info, err := src.Stat()
		if err != nil {
			println(err)
			return false
		}

		if info.IsDir() {
			err := zipFolder(file, *writer)
			if err != nil {
				println(err)
				return false
			}
			continue
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			println(err)
			return false
		}

		header.Name = filepath.Base(file)
		header.Method = zip.Deflate

		dst, err := writer.CreateHeader(header)
		if err != nil {
			println(err)
			return false
		}

		_, err = io.Copy(dst, src)
		if err != nil {
			println(err)
			return false
		}
	}

	return true
}

func zipFolder(src string, writer zip.Writer) error {
	result := filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}

		header.Name, err = filepath.Rel(filepath.Dir(src), path)
		if err != nil {
			return err
		}
		if info.IsDir() {
			header.Name += "/"
		}

		header.Method = zip.Deflate

		headerWriter, err := writer.CreateHeader(header)
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		f, err := os.Open(path)
		if err != nil {
			return err
		}
		defer f.Close()

		_, err = io.Copy(headerWriter, f)

		return err
	})

	return result
}
