package internal

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/golang-jwt/jwt"
	"github.com/hossainalhaidari/filer/pkg/fs"
	"github.com/labstack/echo/v4"
)

func Login(c echo.Context) error {
	req := new(LoginRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	if !isAuthorized(req.Username, req.Password) {
		return echo.ErrUnauthorized
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &Claims{
		Username: req.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 72).Unix(),
		},
	})

	t, err := token.SignedString([]byte(JwtKey))
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, echo.Map{
		"token": t,
	})
}

func Validate(c echo.Context) error {
	return c.JSON(http.StatusOK, true)
}

func Read(c echo.Context) error {
	req := new(ReadRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	path := joinFilePath(req.File)

	if req.File.IsDir {
		entries := fs.ReadDir(path)
		dirs := []File{}
		files := []File{}

		for _, entry := range entries {
			fullPath := filepath.Join(path, entry.Name())
			info, _ := os.Stat(fullPath)

			mimeType, _ := mimetype.DetectFile(fullPath)

			f := File{
				Name:  entry.Name(),
				IsDir: entry.IsDir(),
				Mime:  mimeType.String(),
				Size:  info.Size(),
				Date:  info.ModTime().Format("Jan 02, 2006 15:04:05"),
				Mode:  info.Mode().String(),
				Path:  req.File.Path,
			}

			if entry.IsDir() {
				dirs = append(dirs, f)
			} else {
				files = append(files, f)
			}
		}

		return c.JSON(http.StatusOK, append(dirs, files...))
	} else {
		content := fs.ReadFile(path)
		return c.JSON(http.StatusOK, content)
	}
}

func Create(c echo.Context) error {
	req := new(CreateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	result := false

	if req.File.IsDir {
		result = fs.CreateDir(joinFilePath(req.File))
	} else {
		result = fs.CreateFile(joinFilePath(req.File))
	}

	return c.JSON(http.StatusOK, result)
}

func Update(c echo.Context) error {
	req := new(UpdateRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	result := fs.UpdateFile(joinFilePath(req.File), req.Content)

	return c.JSON(http.StatusOK, result)
}

func Delete(c echo.Context) error {
	req := new(DeleteRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	for _, file := range req.Files {
		if file.IsDir {
			fs.DeleteDir(joinFilePath(file))
		} else {
			fs.DeleteFile(joinFilePath(file))
		}
	}

	return c.JSON(http.StatusOK, true)
}

func Rename(c echo.Context) error {
	req := new(RenameRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	result := fs.RenameFile(joinPath(req.File.Path), req.File.Name, req.NewName)

	return c.JSON(http.StatusOK, result)
}

func Copy(c echo.Context) error {
	req := new(CopyRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	for _, file := range req.Files {
		if file.IsDir {
			fs.CopyDir(joinFilePath(file), filepath.Join(joinPath(req.ToPath), file.Name))
		} else {
			fs.CopyFile(joinFilePath(file), filepath.Join(joinPath(req.ToPath), file.Name))
		}
	}

	return c.JSON(http.StatusOK, true)
}

func Move(c echo.Context) error {
	req := new(MoveRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	for _, file := range req.Files {
		if file.IsDir {
			fs.MoveDir(joinFilePath(file), filepath.Join(joinPath(req.ToPath), file.Name))
		} else {
			fs.MoveFile(joinFilePath(file), filepath.Join(joinPath(req.ToPath), file.Name))
		}
	}

	return c.JSON(http.StatusOK, true)
}

func Chmod(c echo.Context) error {
	req := new(ChangeModeRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	for _, file := range req.Files {
		fs.ChangeMode(joinFilePath(file), req.Mode)
	}

	return c.JSON(http.StatusOK, true)
}

func Download(c echo.Context) error {
	req := new(DownloadRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	return c.Attachment(joinFilePath(req.File), req.File.Name)
}

func Upload(c echo.Context) error {
	form, err := c.MultipartForm()
	if err != nil {
		return err
	}
	files := form.File["files"]
	outputPath := form.Value["outputPath"][0]

	for _, file := range files {
		fs.UploadFile(*file, joinPath(outputPath))
	}

	return c.JSON(http.StatusOK, true)
}

func Compress(c echo.Context) error {
	req := new(CompressRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	files := []string{}
	for _, file := range req.Files {
		files = append(files, joinFilePath(file))
	}

	result := fs.Archive(files, joinPath(req.OutputPath))

	return c.JSON(http.StatusOK, result)
}

func Extract(c echo.Context) error {
	req := new(ExtractRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	result := fs.Unarchive(joinFilePath(req.File), joinPath(req.OutputPath))
	return c.JSON(http.StatusOK, result)
}

func Search(c echo.Context) error {
	req := new(SearchRequest)
	if err := c.Bind(req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest)
	}

	var files []File
	var dirs []File
	parentPath := joinPath(req.Path)

	_ = filepath.Walk(parentPath, func(path string, entry os.FileInfo, err error) error {
		if err != nil {
			fmt.Println(err)
			return nil
		}

		if path == parentPath {
			return nil
		}

		if strings.Contains(entry.Name(), req.Query) {
			fullPath := filepath.Join(path, entry.Name())
			mimeType, _ := mimetype.DetectFile(fullPath)

			f := File{
				Name:  entry.Name(),
				IsDir: entry.IsDir(),
				Mime:  mimeType.String(),
				Size:  entry.Size(),
				Date:  entry.ModTime().Format("Jan 02, 2006 15:04:05"),
				Mode:  entry.Mode().String(),
				Path:  substring(path, len(BaseDir), len(path)-len(entry.Name())),
			}

			if entry.IsDir() {
				dirs = append(dirs, f)
			} else {
				files = append(files, f)
			}
		}

		return nil
	})

	return c.JSON(http.StatusOK, append(dirs, files...))
}
