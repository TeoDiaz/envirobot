#!/bin/bash
# vim: ai:ts=8:sw=8:noet
# Build the image
# Intended to be run from CI or local
set -eufo pipefail
export SHELLOPTS	# propagate set to children by default
IFS=$'\t\n'

# Check required commands are in place
command -v docker >/dev/null 2>&1 || { echo 'Please install docker or use image that has it'; exit 1; }

# shellcheck disable=SC1090
source <(set +f; cat /usr/local/lib/functionarium/*.sh || { >&2 echo "Please install https://gitlab.otters.xyz/product/systems/functionarium#install"; echo "exit 42"; })
[[ "true" == "${GITLAB_CI:-false}" ]] && trap ci_shred_secrets EXIT

tag="$(cabify_rfc_docker_tag)"

paths=$(find "dockerfiles" -maxdepth 1 -mindepth 1 -name "*")
if [[ $(echo "$paths" | wc -l) -eq 0 ]]; then
    echo "No dockerfiles found"
    exit 1
fi

for path in $paths; do
    name=$(basename "$path")

    if [[ -n "${GITLAB_CI:-}" ]]; then
      echo "${CI_JOB_TOKEN}" | docker login -u gitlab-ci-token --password-stdin "${CI_REGISTRY}"
      image="$CI_REGISTRY_IMAGE/$name:$tag"
    else
      image="cabify/$name:local"
    fi
    echo "Building $name as '$image'"

    docker build "dockerfiles/$name" -t "$image" \
      --build-arg BUILD_TAG="$tag"

    if [[ -n "${GITLAB_CI:-}" ]]; then
      echo "${CI_JOB_TOKEN}" | docker login -u gitlab-ci-token --password-stdin "${CI_REGISTRY}"
      docker push "$image"
    fi

    echo "Done"
done
