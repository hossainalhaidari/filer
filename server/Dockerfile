FROM golang:alpine AS build
WORKDIR /src
COPY * /src/
RUN go build -o /bin/filer ./cmd/filer

FROM scratch
WORKDIR /app
COPY --from=build /bin/filer ./filer
EXPOSE 3000
ENTRYPOINT ["/app/filer", "data"]