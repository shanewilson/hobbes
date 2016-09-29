PROJECT = "Hobbes"

PATH  := node_modules/.bin:$(PATH)
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


all: install lint
.PHONY: all

.PHONY: install
install:
	$(Q) npm install --loglevel error
	$(Q) lerna bootstrap
	$(Q) ln -s $(shell pwd)/packages/eslint-config-hobbes-node node_mudules/eslint-config-hobbes-node
	@$(PRINT_OK)

.PHONY: lint
lint:
	$(Q) eslint packages --ext .js,.jsx
	@$(PRINT_OK)

.PHONY: clean
clean: clean-npm clean-lerna
	@$(PRINT_OK)

.PHONY: clean-lerna
clean-dist:
	$(Q) lerna clean
	@$(PRINT_OK)

.PHONY: clean-npm
clean-deps:
	$(Q) rm -rf node_modules
	@$(PRINT_OK)

.PHONY: update
update:
	$(Q) npm-check --skip-unused
	@$(PRINT_OK)

.PHONY: upgrade
upgrade:
	$(Q) npm-check -u
	@$(PRINT_OK)
