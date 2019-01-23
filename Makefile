#!/usr/bin/env make

.PHONY: start dev build clean

export NODE_ENV=development

clean:
	rm -rf dist

dev:
	npm run dev

build:
	npm run build

start:
	npm run start
