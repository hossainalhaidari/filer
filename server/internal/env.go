package internal

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

const (
	FilerEnvKey = "FILER_ENV"
	DbPathKey   = "DB_PATH"
	BaseDirKey  = "BASE_DIR"
)

func LoadEnv() {
	env := os.Getenv(FilerEnvKey)
	if env == "" {
		env = "local"
	}

	err := godotenv.Load("env/.env." + env)

	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}

func getEnv(key string) string {
	return os.Getenv(key)
}
