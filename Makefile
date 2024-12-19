# Variables
APP_NAME = hotumatur-app
VERSION ?= latest

# Cargar variables de entorno
ifneq (,$(wildcard .env.local))
    include .env.local
    export
endif

# Comandos básicos
.PHONY: install dev build-local start clean check-env

install:
	npm install

dev:
	npm run dev

build-local:
	npm run build

start:
	npm start

clean:
	rm -rf .next node_modules

# Comandos Docker
.PHONY: docker-build docker-run docker-push

docker-build:
	docker buildx build \
		--platform linux/amd64 \
		--build-arg NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
		--build-arg NEXT_PUBLIC_WC_API_URL=${NEXT_PUBLIC_WC_API_URL} \
		--load \
		-t ${DOCKER_USERNAME}/${APP_NAME}:${VERSION} .

docker-run:
	docker run -p 3000:3000 \
		-e NODE_ENV=production \
		-e NEXT_TELEMETRY_DISABLED=1 \
		-e NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
		-e NEXT_PUBLIC_WC_API_URL=${NEXT_PUBLIC_WC_API_URL} \
		-e WC_CONSUMER_KEY=${WC_CONSUMER_KEY} \
		-e WC_CONSUMER_SECRET=${WC_CONSUMER_SECRET} \
		-e FLOW_API_KEY=${FLOW_API_KEY} \
		-e FLOW_SECRET_KEY=${FLOW_SECRET_KEY} \
		-e FLOW_API_URL=${FLOW_API_URL} \
		${DOCKER_USERNAME}/${APP_NAME}:${VERSION}

docker-push:
	@if [ -z "$(DOCKER_USERNAME)" ]; then \
		echo "Error: DOCKER_USERNAME no está definido"; \
		exit 1; \
	fi
	docker push ${DOCKER_USERNAME}/${APP_NAME}:${VERSION}

# Comandos compuestos
.PHONY: build-and-run build-and-push
build-and-run: docker-build docker-run
build-and-push: docker-build docker-push
