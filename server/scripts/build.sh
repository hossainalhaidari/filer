#!/bin/sh

GOOS=linux GOARCH=386 go build -ldflags "-s -w" -o  ./dist ./cmd/filer