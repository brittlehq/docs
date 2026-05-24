#!/usr/bin/env bash
# Brittle — one-line installer.
#
# Usage (interactive):
#   curl -fsSL https://brittle.dev/install.sh | sh
#
# What it does:
#   1. Checks Docker + Compose v2 + openssl are installed and Docker is running
#   2. Picks a free port (default 3100, falls back to 3101 .. 3110)
#   3. Creates ~/brittle, generates a JWT + AI master key into .env (once)
#   4. Writes docker-compose.yml with Postgres + Hub
#   5. Pulls images, brings the stack up, waits for /health
#   6. Prints the dashboard URL and how to stop / reset / update
#
# What it doesn't do:
#   - Auto-install Docker (security boundary)
#   - Touch anything outside the install directory
#   - Talk to the network for anything other than image pulls + the local
#     /health probe
#
# Override defaults via env:
#   INSTALL_DIR=/path/to/dir   Default: ~/brittle
#   BRITTLE_PORT=4000          Default: 3100
#   BRITTLE_IMAGE_TAG=0.1.2    Default: latest
#
# Inspect before running:
#   curl -fsSL https://brittle.dev/install.sh > install.sh
#   less install.sh
#   sh install.sh

set -euo pipefail

# ─── Config ────────────────────────────────────────────────────────────────

INSTALL_DIR="${INSTALL_DIR:-$HOME/brittle}"
# Capture whether the user set BRITTLE_PORT explicitly. If they did, it
# wins over the value saved in .env from a previous install — they're
# asking to move ports.
USER_PROVIDED_PORT="${BRITTLE_PORT:-}"
BRITTLE_PORT="${BRITTLE_PORT:-3100}"
IMAGE_TAG="${BRITTLE_IMAGE_TAG:-latest}"
MAX_WAIT_SECONDS=120

# ─── Styling (colors only when stdout is a TTY) ───────────────────────────

if [ -t 1 ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
  GREEN=$'\033[32m'; AMBER=$'\033[33m'; RED=$'\033[31m'; BLUE=$'\033[34m'
else
  BOLD=''; DIM=''; RESET=''
  GREEN=''; AMBER=''; RED=''; BLUE=''
fi

ok()   { printf "  ${GREEN}✓${RESET}  %s\n" "$*"; }
warn() { printf "  ${AMBER}⚠${RESET}  %s\n" "$*"; }
fail() { printf "  ${RED}✗${RESET}  %s\n" "$*" >&2; }
step() { printf "\n${BOLD}%s${RESET}\n" "$*"; }
note() { printf "  ${DIM}%s${RESET}\n" "$*"; }

banner() {
  printf "\n"
  printf "  ${BOLD}┌────────────────────────────────────────────┐${RESET}\n"
  printf "  ${BOLD}│${RESET}                                            ${BOLD}│${RESET}\n"
  printf "  ${BOLD}│${RESET}   ${AMBER}◣${RESET}  ${BOLD}Brittle installer${RESET}                     ${BOLD}│${RESET}\n"
  printf "  ${BOLD}│${RESET}                                            ${BOLD}│${RESET}\n"
  printf "  ${BOLD}└────────────────────────────────────────────┘${RESET}\n"
}

on_error() {
  printf "\n"
  fail "Install failed."
  printf "  ${DIM}To clean up:${RESET}\n"
  printf "    cd %s && docker compose down -v\n" "$INSTALL_DIR"
  printf "    rm -rf %s\n\n" "$INSTALL_DIR"
  exit 1
}
trap on_error ERR

# ─── 1. Prerequisites ─────────────────────────────────────────────────────

banner
step "Checking prerequisites"

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker not found."
  note "Install Docker Desktop: https://www.docker.com/products/docker-desktop"
  exit 1
fi
ok "docker            $(docker --version | awk '{print $3}' | tr -d ',')"

if ! docker info >/dev/null 2>&1; then
  fail "Docker is installed but not running. Start Docker, then re-run."
  exit 1
fi
ok "docker daemon     running"

if ! docker compose version >/dev/null 2>&1; then
  fail "Docker Compose v2 is required (ships with Docker Desktop 4+)."
  exit 1
fi
ok "docker compose    $(docker compose version --short)"

if ! command -v openssl >/dev/null 2>&1; then
  fail "openssl not found (used to generate the JWT + AI master keys)."
  exit 1
fi
ok "openssl           present"

if ! command -v curl >/dev/null 2>&1; then
  fail "curl not found (used for the readiness probe)."
  exit 1
fi
ok "curl              present"

# ─── 2. Install directory + saved-port lookup ────────────────────────────

step "Install directory"

mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"
ok "$INSTALL_DIR"

# If we've installed here before, the previous port was saved into .env.
# Use it unless the user explicitly set BRITTLE_PORT for this run — that
# signals "I want to move ports."
PORT_FROM_ENV=""
if [ -z "$USER_PROVIDED_PORT" ] && [ -f .env ] && grep -q '^BRITTLE_PORT=' .env; then
  BRITTLE_PORT=$(grep '^BRITTLE_PORT=' .env | head -1 | cut -d= -f2)
  PORT_FROM_ENV=1
fi

# ─── 3. Port selection ────────────────────────────────────────────────────

port_in_use() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -i ":$1" -sTCP:LISTEN >/dev/null 2>&1
  else
    (echo > "/dev/tcp/localhost/$1") >/dev/null 2>&1
  fi
}

step "Port"

if [ -n "$PORT_FROM_ENV" ]; then
  # Previously-chosen port. Trust it — port-in-use here is almost always
  # our own Brittle stack from the last install. Skip the fallback dance.
  ok "port $BRITTLE_PORT (saved from previous install)"
elif port_in_use "$BRITTLE_PORT"; then
  ORIGINAL_PORT="$BRITTLE_PORT"
  PICKED=""
  for p in $(seq $((BRITTLE_PORT + 1)) $((BRITTLE_PORT + 10))); do
    if ! port_in_use "$p"; then
      PICKED="$p"
      break
    fi
  done
  if [ -z "$PICKED" ]; then
    fail "Port $ORIGINAL_PORT and the next 10 are all busy. Set BRITTLE_PORT to pick another."
    exit 1
  fi
  warn "port $ORIGINAL_PORT in use, falling back to $PICKED"
  BRITTLE_PORT="$PICKED"
else
  ok "port $BRITTLE_PORT free"
fi

# ─── 4. Secrets ───────────────────────────────────────────────────────────

if [ -f .env ] && grep -q '^JWT_SECRET=' .env; then
  note "reusing existing secrets from .env"
  JWT_SECRET=$(grep '^JWT_SECRET=' .env | head -1 | cut -d= -f2)
  AI_SECRET_KEY=$(grep '^BRITTLE_AI_SECRET_KEY=' .env | head -1 | cut -d= -f2)
else
  JWT_SECRET=$(openssl rand -hex 32)
  AI_SECRET_KEY=$(openssl rand -hex 32)
  ok "generated jwt + ai master key"
fi

# Always rewrite .env so the saved port reflects the current choice.
cat > .env <<ENV
# Brittle local secrets + chosen port. Generated $(date '+%Y-%m-%d %H:%M:%S').
# Don't rotate JWT_SECRET / BRITTLE_AI_SECRET_KEY by hand — re-installing
# will reuse these values unless this file is deleted.
JWT_SECRET=$JWT_SECRET
BRITTLE_AI_SECRET_KEY=$AI_SECRET_KEY
BRITTLE_PORT=$BRITTLE_PORT
ENV
chmod 600 .env

# Export so the compose file's \${VAR} references resolve.
export JWT_SECRET BRITTLE_AI_SECRET_KEY

# ─── 5. docker-compose.yml ────────────────────────────────────────────────

# Heredoc is unquoted on purpose so $BRITTLE_PORT and $IMAGE_TAG expand at
# write time. \$ escapes preserve compose-time variables for .env lookup;
# \$\$ preserves the double-dollar compose-escape used inside the inline
# hub-config (so the Hub itself sees ${VAR} and does its own interpolation
# from the container's process env).

cat > docker-compose.yml <<COMPOSE
# Brittle stack. Generated by install.sh — safe to edit, but the
# installer overwrites this file on re-run. Move custom changes to a
# docker-compose.override.yml in the same directory if you want them
# preserved.

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: brittle
      POSTGRES_PASSWORD: brittle
      POSTGRES_DB: brittle
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U brittle']
      interval: 5s
      retries: 5

  init-artifacts:
    image: alpine:3
    volumes:
      - artifacts:/data
    command: ['sh', '-c', 'chown -R 1000:1000 /data']

  brittle:
    image: ghcr.io/brittlehq/brittle:${IMAGE_TAG}
    container_name: brittle
    depends_on:
      postgres:
        condition: service_healthy
      init-artifacts:
        condition: service_completed_successfully
    ports:
      - '${BRITTLE_PORT}:3100'
    configs:
      - source: hub-config
        target: /etc/brittle/hub.config.yaml
    volumes:
      - artifacts:/var/lib/brittle/artifacts
    environment:
      BRITTLE_CONFIG_PATH: /etc/brittle/hub.config.yaml
      DATABASE_URL: postgresql://brittle:brittle@postgres:5432/brittle?schema=public
      JWT_SECRET: \${JWT_SECRET}
      BRITTLE_AI_SECRET_KEY: \${BRITTLE_AI_SECRET_KEY}

volumes:
  postgres-data:
  artifacts:

configs:
  hub-config:
    content: |
      server:
        host: 0.0.0.0
        port: 3100
      database:
        url: \$\${DATABASE_URL}
      auth:
        jwtSecret: \$\${JWT_SECRET}
      artifacts:
        store: local:/var/lib/brittle/artifacts
      redis: {}
      session: {}
      nodes:
        heartbeat: {}
      internal: {}
      tunnel: {}
      ai:
        enabled: false
COMPOSE

ok "wrote docker-compose.yml"

# ─── 6. Pull + bring up + wait ────────────────────────────────────────────

step "Starting Brittle"

note "pulling images (a minute or two on first run)..."
docker compose pull --quiet >/dev/null 2>&1
ok "images pulled"

docker compose up -d >/dev/null 2>&1
ok "containers started"

printf "  ${DIM}waiting for Brittle to be ready${RESET}"
READY=""
for i in $(seq 1 $((MAX_WAIT_SECONDS / 2))); do
  if curl -fsS "http://localhost:$BRITTLE_PORT/health" >/dev/null 2>&1; then
    printf "\n"
    ok "Brittle responded in ${i}s"
    READY=1
    break
  fi
  printf "."
  sleep 2
done

if [ -z "$READY" ]; then
  printf "\n"
  fail "Brittle didn't respond within ${MAX_WAIT_SECONDS}s."
  note "Check logs with: cd $INSTALL_DIR && docker compose logs brittle"
  exit 1
fi

# ─── 7. Success ────────────────────────────────────────────────────────────

URL="http://localhost:$BRITTLE_PORT"

# Success block is left-aligned with no right border so it doesn't break
# when paths or URLs are longer than expected. The opening banner card
# carries the visual weight; the action list reads as a clean reference
# next to it.

printf "\n"
printf "  ${GREEN}╭────────────────────────────────────────────╮${RESET}\n"
printf "  ${GREEN}│${RESET}                                            ${GREEN}│${RESET}\n"
printf "  ${GREEN}│${RESET}   ${BOLD}✓  Brittle is up.${RESET}                        ${GREEN}│${RESET}\n"
printf "  ${GREEN}│${RESET}                                            ${GREEN}│${RESET}\n"
printf "  ${GREEN}╰────────────────────────────────────────────╯${RESET}\n"
printf "\n"
printf "  ${BOLD}Open${RESET}    ${BLUE}%s${RESET}\n" "$URL"
printf "\n"
printf "  ${DIM}Stop    cd %s && docker compose down${RESET}\n" "$INSTALL_DIR"
printf "  ${DIM}Reset   cd %s && docker compose down -v${RESET}\n" "$INSTALL_DIR"
printf "  ${DIM}Update  cd %s && docker compose pull && docker compose up -d${RESET}\n" "$INSTALL_DIR"
printf "\n"
printf "  ${DIM}Docs     https://brittle.dev/docs${RESET}\n"
printf "  ${DIM}GitHub   https://github.com/brittlehq/brittle${RESET}\n"
printf "\n"
