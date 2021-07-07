IMAGE=oleg-agapov-com

.PHONY: docker
docker:
	docker build -t $(IMAGE) .


.PHONY: dev
dev:
	docker run --rm -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules -p 3000:3000 $(IMAGE) npm run dev


.PHONY: build
build:
	docker run --rm -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules $(IMAGE)
