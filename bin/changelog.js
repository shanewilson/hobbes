git-changelog: TAG := $(shell git describe --abbrev=0 --tags)
git-changelog: LINES := "$(shell git log --pretty=format:"%s (%h)EOL" HEAD...${TAG})"
