package internal

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func openDb() sql.DB {
	db, err := sql.Open("sqlite3", getEnv(DbPathKey))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	return *db
}

func userExists(username string, password string) bool {
	db := openDb()
	row := db.QueryRow("SELECT * FROM users WHERE username=? AND password=?", username, password)

	var user User
	err := row.Scan(&user.Username, &user.Password)
	if err != nil {
		println(err)
		return false
	}

	return true
}
