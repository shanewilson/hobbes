PROJECT = "Frontend Dev Tools"

FDT_DIR ?= .
PATH  := $(FDT_DIR)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

ifndef VERBOSE
	Q := @
	NIL := > /dev/null 2>&1
endif

NO_COLOR=\033[0m
OK_COLOR=\033[32;01m
OK_STRING=$(OK_COLOR)[OK]$(NO_COLOR)
AWK_CMD = awk '{ printf "%-30s %-10s\n",$$1, $$2; }'
PRINT_OK = printf "$@ $(OK_STRING)\n" | $(AWK_CMD)
NODE_ENV_STRING = $(OK_COLOR)[$(NODE_ENV)]$(NO_COLOR)
PRINT_ENV = printf "$@ $(NODE_ENV_STRING)\n" | $(AWK_CMD)


all: install lint test-once build
.PHONY: all

.PHONY: server-stage
server-stage: export NODE_ENV = stage
server-stage: build server

.PHONY: server-prod
server-prod: export NODE_ENV = production
server-prod: build server

.PHONY: server
server: export NODE_ENV ?= development
server:
	$(Q) node ${FDT_DIR}/dist/server

.PHONY: schema
schema:
	$(Q) node ${FDT_DIR}/dist/bin/updateRelaySchema

.PHONY: install
install:
	$(Q) npm install --loglevel error
	@$(PRINT_OK)

.PHONY: build
build: export NODE_ENV ?= stage
build: clean-dist
	@$(PRINT_ENV)
	$(Q) webpack --config ${FDT_DIR}/dist/webpack.config.js
	@$(PRINT_OK)

.PHONY: browser
browser:
	$(Q) wdio ${FDT_DIR}/dist/wdio.conf.js
	@$(PRINT_OK)

.PHONY: test-watch
test-watch: export BABEL_ENV=watch
test-watch: export TEST_ENV=watch
test-watch: test

.PHONY: test-ci
test-ci: export BABEL_ENV=ci
test-ci: export TEST_ENV=ci
test-ci: test

.PHONY: test-once
test-once: export BABEL_ENV=single
test-once: export TEST_ENV=single
test-once: test

.PHONY: test
test: export NODE_ENV ?= development
test:
	$(Q) karma start ${FDT_DIR}/dist/karma.config.js
	@$(PRINT_OK)

.PHONY: lint
lint:
	$(Q) eslint src --ext .js,.jsx
	@$(PRINT_OK)

.PHONY: clean
clean: clean-dist clean-deps
	@$(PRINT_OK)

.PHONY: clean-dist
clean-dist:
	$(Q) rm -rf dist
	@$(PRINT_OK)

.PHONY: clean-deps
clean-deps:
	$(Q) rm -rf node_modules
	@$(PRINT_OK)

.PHONY: update
update:
	$(Q) david
	@$(PRINT_OK)

.PHONY: upgrade
upgrade:
	$(Q) david update
	@$(PRINT_OK)

.PHONY: travis-before-script
travis-before-script:
	export DISPLAY=:99.0
	sh -e /etc/init.d/xvfb start
	NODE_ENV=production make build
	sleep 3

.PHONY: travis-script
travis-script: lint test-ci

.PHONY: travis-after-success
travis-after-success:
	bash <(curl -s https://codecov.io/bash)

.PHONY: travis-docker-upload
travis-docker-upload:
ifdef DOCKER_IMAGE
	docker login -e=${DOCKER_EMAIL} -u=${DOCKER_USERNAME} -p=${DOCKER_PASSWORD} quay.io
	docker build -t ${DOCKER_IMAGE} .
ifeq ($(TRAVIS_PULL_REQUEST), false)
ifeq ($(TRAVIS_BRANCH), master)
	docker tag ${DOCKER_IMAGE} quay.io/ncigdc/${DOCKER_IMAGE}:stable
	docker push quay.io/ncigdc/${DOCKER_IMAGE}:stable
else ifeq ($(TRAVIS_BRANCH), develop)
	docker tag ${DOCKER_IMAGE} quay.io/ncigdc/${DOCKER_IMAGE}:latest
	docker push quay.io/ncigdc/${DOCKER_IMAGE}:latest
else
	docker tag ${DOCKER_IMAGE} quay.io/ncigdc/${DOCKER_IMAGE}:$(subst /,-,${TRAVIS_BRANCH})
	docker push quay.io/ncigdc/${DOCKER_IMAGE}:$(subst /,-,${TRAVIS_BRANCH})
endif
ifdef TRAVIS_TAG
	docker tag ${DOCKER_IMAGE} quay.io/ncigdc/${DOCKER_IMAGE}:${TRAVIS_TAG}
	docker push quay.io/ncigdc/${DOCKER_IMAGE}:${TRAVIS_TAG}
endif
endif
endif