DEFAULT_ENV_FILE := .env.development
ifneq ("$(wildcard $(DEFAULT_ENV_FILE))","")
include ${DEFAULT_ENV_FILE}
export $(shell sed 's/=.*//' ${DEFAULT_ENV_FILE})
endif

ENV_FILE := .env.development.local
ifneq ("$(wildcard $(ENV_FILE))","")
include ${ENV_FILE}
export $(shell sed 's/=.*//' ${ENV_FILE})
endif

##################################

# Install a dev branch to a cluster (already logged in)

reinstall: build push deploy

##################################

# BUILD - build image locally using s2i

.PHONY: build
build:
	s2i build $(SOURCE_REPOSITORY_URL) --ref $(SOURCE_REPOSITORY_REF) --context-dir / registry.access.redhat.com/ubi8/nodejs-14 $(IMAGE_REPOSITORY)


##################################

# PUSH - push image to repository

.PHONY: push
push:
	${CONTAINER_BUILDER} push ${IMAGE_REPOSITORY}

.PHONY: namespace
namespace:
	oc project $(OC_PROJECT) || true

.PHONY: deploy
deploy: namespace
	oc patch deployment/rhods-dashboard -n $(OC_PROJECT) -p '{"spec":{"template":{"spec":{"containers":[{"name":"''$(DASHBOARD_APP)''","image":"'$(IMAGE_REPOSITORY)'"}]}}}}'
	oc scale --replicas=0 deployment $(DASHBOARD_APP) -n $(OC_PROJECT)
	sleep 10
	oc scale --replicas=1 deployment $(DASHBOARD_APP) -n $(OC_PROJECT)

##################################
