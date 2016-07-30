#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

make lint test-ci browser
