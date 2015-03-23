build: 
	@make -B -C txtbudget_web/static/ build

test:
	DEBUG=true py.test txtbudget_web/tests.py

demo: build
	DEBUG=true python app.py
