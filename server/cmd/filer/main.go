package main

import (
	"log"
	"os"

	"github.com/hossainalhaidari/filer/internal"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	args := os.Args[1:]
	if len(args) < 1 {
		log.Fatal("Root directory was not specified!")
	}

	if !internal.AuthExists() {
		log.Fatal(".htpasswd was not found!")
	}

	internal.SetBaseDir(args[0])
	internal.GenerateJwtKey()

	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	r := e.Group("/")
	config := middleware.JWTConfig{
		Claims:     &internal.Claims{},
		SigningKey: []byte(internal.JwtKey),
	}
	r.Use(middleware.JWTWithConfig(config))

	e.POST("/login", internal.Login)
	r.GET("validate", internal.Validate)
	r.POST("read", internal.Read)
	r.POST("create", internal.Create)
	r.POST("update", internal.Update)
	r.POST("delete", internal.Delete)
	r.POST("rename", internal.Rename)
	r.POST("copy", internal.Copy)
	r.POST("move", internal.Move)
	r.POST("chmod", internal.Chmod)
	r.POST("download", internal.Download)
	r.POST("upload", internal.Upload)
	r.POST("compress", internal.Compress)
	r.POST("extract", internal.Extract)

	e.Logger.Fatal(e.Start(":3000"))
}
