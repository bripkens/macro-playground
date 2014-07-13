.PHONY: macros dummy complex

install:
	npm install -g typescript browserify sweet.js
	npm install

compile:
	browserify lib/cursors.js -o build/cursors.browser.js

dummy: compile
	cp build/cursors.browser.js dummy
	open dummy/index.html

typescript: compile
	sjs --output typescript/app.ts typescript/app.tsx

macros:
	sjs -o macros/actual.js macros/test.js

FILES = App Editor
complex:
	for file in {App,Editor,Viewer,index}; do \
		echo "Compiling $$file" ; \
		sjs -m es6-macros \
				-m ./complex/macros \
				-l jsx-reader \
				-o complex/$$file.js \
	 			complex/$$file.jsx ; \
	done

	browserify complex/index.js -o complex/build.js
