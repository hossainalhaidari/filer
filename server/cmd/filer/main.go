package main

import (
	"github.com/hossainalhaidari/filer/internal"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	internal.LoadEnv()

	e := echo.New()
	e.Use(middleware.CORS())

	r := e.Group("/")
	config := middleware.JWTConfig{
		Claims:     &internal.Claims{},
		SigningKey: []byte("secret"),
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

	e.Logger.Fatal(e.Start(":1323"))
}