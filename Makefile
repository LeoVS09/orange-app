#!/usr/bin/env make

.PHONY: start dev build clean docker-build docker-console build-console

export NODE_ENV=development

# ---------------------------------------------------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------------------------------------------------

DOCKER_IMAGE_VERSION=0.1.0
DOCKER_IMAGE_TAG=leovs09/orange-app:$(DOCKER_IMAGE_VERSION)

# ---------------------------------------------------------------------------------------------------------------------
# UTILS
# ---------------------------------------------------------------------------------------------------------------------

clean:
	rm -rf dist

# ---------------------------------------------------------------------------------------------------------------------
# DEVELOPMENT
# ---------------------------------------------------------------------------------------------------------------------

dev:
	yarn update-schema
	yarn generate-api-types
	yarn dev

# ---------------------------------------------------------------------------------------------------------------------
# PRODUCTION
# ---------------------------------------------------------------------------------------------------------------------

build:
	yarn update-schema
	yarn generate-api-types
	yarn build

start:
	yarn start

# ---------------------------------------------------------------------------------------------------------------------
# DOCKER
# ---------------------------------------------------------------------------------------------------------------------

docker-build:
	@docker build -t $(DOCKER_IMAGE_TAG) .

docker-console:
	docker-compose run -p 8080:8080 orange-app /bin/bash

build-console: docker-build docker-console

docker-build-and-push:
	echo "Build and pull $(DOCKER_IMAGE_TAG)"
	docker build -t orange-app .
	docker tag orange-app $(DOCKER_IMAGE_TAG)
	docker push $(DOCKER_IMAGE_TAG)
