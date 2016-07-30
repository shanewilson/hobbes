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

.PHONY: all
all: install dist

.PHONY: server-stage
server-stage: export NODE_ENV = stage
server-stage: build server

.PHONY: server-prod
server-prod: export NODE_ENV = production
server-prod: build server

.PHONY: server
server: export NODE_ENV ?= development
server:
	$(Q) babel-node ${FDT_DIR}/server

.PHONY: schema
schema:
	$(Q) babel-node ${FDT_DIR}/bin/updateRelaySchema

.PHONY: install
install:
	$(Q) npm install --loglevel error
	@$(PRINT_OK)

.PHONY: build
build: export NODE_ENV ?= stage
build: clean-dist
	@$(PRINT_ENV)
	$(Q) webpack --config ${FDT_DIR}/webpack.config.js
	@$(PRINT_OK)

.PHONY: browser
browser:
	$(Q) wdio ${FDT_DIR}/wdio.conf.js
	@$(PRINT_OK)

.PHONY: test
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
	$(Q) karma start ${FDT_DIR}/karma.config.js
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