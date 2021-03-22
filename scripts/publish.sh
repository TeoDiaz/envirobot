#!/bin/bash
# vim: ai:ts=8:sw=8:noet
# Publish this image
# Intended to be run from local machine or CI
set -eufo pipefail
export SHELLOPTS	# propagate set to children by default
IFS=$'\t\n'

# check required commands are in place
command -v docker >/dev/null 2>&1 || { echo 'please install docker or use image that has it'; exit 1; }
command -v gcloud >/dev/null 2>&1 || { echo 'please install gcloud or use image that has it'; exit 1; }
command -v jq >/dev/null 2>&1 || { echo 'please install jq or use image that has it'; exit 1; }

# shellcheck disable=SC1090
source <(set +f; cat /usr/local/lib/functionarium/*.sh || { >&2 echo "Please install https://gitlab.otters.xyz/product/systems/functionarium#install"; echo "exit 42"; })
trap ci_shred_secrets EXIT

# check variables are set
GCR_ROOT="us.gcr.io/cabify-controlpanel"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"; pwd)"
IMAGE_NAME="$(basename "$(cd "${SCRIPT_DIR}/../"; pwd)")"
TAG="$(cabify_rfc_docker_tag)"

if [[ "true" == "${CI:-false}" ]]; then
	CONTAINER_TEST_IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH}/${IMAGE_NAME}:${TAG}"
	CONTAINER_RELEASE_IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH}/${IMAGE_NAME}:latest"

	echo "${CI_JOB_TOKEN}" | docker login -u gitlab-ci-token --password-stdin "${CI_REGISTRY}"
else
	echo "Not on CI, won't trigger depending pipelines, but trying to determine variables"

	CI_REGISTRY="gitlab.otters.xyz:5005"
	CI_PROJECT_PATH="product/support/slackbot/${IMAGE_NAME}"
	CONTAINER_TEST_IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH}/${IMAGE_NAME}:${TAG}"
	CONTAINER_RELEASE_IMAGE="${CI_REGISTRY}/${CI_PROJECT_PATH}/${IMAGE_NAME}:latest"

	echo "	Got container test image: '${CONTAINER_TEST_IMAGE}'"
	echo "	I'm going to test it or die horribly, ffs, hold on to your butts:"
fi

