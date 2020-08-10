# use checkmake linter https://github.com/mrtazz/checkmake
# $ checkmake Makefile
BINARY=myurl
GOPATH ?= $(shell go env GOPATH)
# Ensure GOPATH is set before running build process.
ifeq "$(GOPATH)" ""
  $(error Please set the environment variable GOPATH before running `make`)
endif
PATH := ${GOPATH}/bin:$(PATH)
GCFLAGS=-gcflags "all=-trimpath=${GOPATH}"
LDFLAGS=-ldflags="-s -w"

# These are the values we want to pass for VERSION  and BUILD
BUILD_TIME=`date +%Y%m%d%H%M`
COMMIT_VERSION=`git rev-parse HEAD`

# colors compatible setting
CRED:=$(shell tput setaf 1 2>/dev/null)
CGREEN:=$(shell tput setaf 2 2>/dev/null)
CYELLOW:=$(shell tput setaf 3 2>/dev/null)
CEND:=$(shell tput sgr0 2>/dev/null)

# use mysql:latest as default
MYSQL_RELEASE := $(or ${MYSQL_RELEASE}, ${MYSQL_RELEASE}, mysql)
MYSQL_VERSION := $(or ${MYSQL_VERSION}, ${MYSQL_VERSION}, latest)

.PHONY: release
release: build
	@echo "$(CGREEN)Cross platform building for release ...$(CEND)"
	@mkdir -p release
	@for GOOS in darwin linux windows; do \
		for GOARCH in amd64; do \
			for d in $$(go list -f '{{if (eq .Name "main")}}{{.ImportPath}}{{end}}' ./...); do \
				b=$$(basename $${d}) ; \
				echo "Building $${b}.$${GOOS}-$${GOARCH} ..."; \
				GOOS=$${GOOS} GOARCH=$${GOARCH} go build ${GCFLAGS} ${LDFLAGS} -v -o release/$${b}.$${GOOS}-$${GOARCH} $$d 2>/dev/null ; \
			done ; \
		done ;\
	done