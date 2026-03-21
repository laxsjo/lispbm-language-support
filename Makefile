NPM     := npm
TSC     := ./node_modules/.bin/tsc
VSCE    := ./node_modules/.bin/vsce
VSIX    := $(shell node -p "require('./package.json').name + '-' + require('./package.json').version + '.vsix'" 2>/dev/null)

.PHONY: all install compile watch clean package

all: compile

install:
	$(NPM) install

compile: node_modules
	$(TSC) -p ./

watch: node_modules
	$(TSC) -watch -p ./

clean:
	rm -rf out/

package: compile
	$(VSCE) package --allow-missing-repository

node_modules: package.json
	$(NPM) install
	@touch node_modules
