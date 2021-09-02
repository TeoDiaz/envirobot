#!/bin/bash
# vim: ai:ts=8:sw=8:noet
set -eufo pipefail
export SHELLOPTS	# propagate set to children by default
IFS=$'\t\n'
# shellcheck disable=SC1090
source /usr/local/lib/functionarium/cabify_rfc_docker_tag.sh
version="$(cabify_rfc_docker_tag)"
/usr/bin/kapsule-deploy "${REPOSITORY}" "${DEPLOYMENT}" "${version}"
