.PHONY: build

build: node_modules js/bundle.js css/bundle.css

js/bundle.js:
	node_modules/.bin/browserify js/app.js -o js/bundle.js

css/bundle.css:
	./node_modules/.bin/lessc css/style.less css/bundle.css

demo:
	node_modules/.bin/beefy js/app.js:js/bundle.js
