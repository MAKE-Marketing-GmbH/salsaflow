#!/bin/bash
set -euo pipefail
export CODEX_HOME=/root/clients/salsaflow-w1/worklog/.codex-home-s7
export CLIPROXY_API_KEY=$(cat /etc/raphael-gateway/cli-proxy-key)
SHOT=/root/clients/salsaflow-w1/worklog/shots/S7-rest/nachher
exec /usr/bin/codex exec --sandbox read-only --skip-git-repo-check -c model_reasoning_effort=high -o "$1" -c model=gpt-5.6-sol --image "$SHOT/kursplan-desktop-fold.png" --image "$SHOT/kursplan-desktop-scroll.png" --image "$SHOT/kursplan-mobile-fold.png" --image "$SHOT/kursplan-mobile-scroll.png" --image "$SHOT/kontakt-mobile-scroll.png" --image "$SHOT/home-desktop-fold.png" --image "$SHOT/home-mobile-fold.png" - < "$2"
