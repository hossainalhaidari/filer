package internal

import "github.com/golang-jwt/jwt"

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type File struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDir"`
	Mime  string `json:"mime"`
	Size  int64  `json:"size"`
	Date  string `json:"date"`
	Mode  string `json:"mode"`
	Path  string `json:"path"`
}

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ReadRequest struct {
	File File `json:"file"`
}

type CreateRequest struct {
	File File `json:"file"`
}

type UpdateRequest struct {
	File    File   `json:"file"`
	Content string `json:"content"`
}

type DeleteRequest struct {
	Files []File `json:"files"`
}

type RenameRequest struct {
	File    File   `json:"file"`
	NewName string `json:"newName"`
}

type CopyRequest struct {
	Files  []File `json:"files"`
	ToPath string `json:"toPath"`
}

type MoveRequest struct {
	Files  []File `json:"files"`
	ToPath string `json:"toPath"`
}

type ChangeModeRequest struct {
	Files []File `json:"files"`
	Mode  string `json:"mode"`
}

type DownloadRequest struct {
	File File `json:"file"`
}

type CompressRequest struct {
	Files      []File `json:"files"`
	OutputPath string `json:"outputPath"`
}

type ExtractRequest struct {
	File       File   `json:"file"`
	OutputPath string `json:"outputPath"`
}
