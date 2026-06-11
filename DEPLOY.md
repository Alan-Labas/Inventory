# Deploying to a DigitalOcean droplet

The whole stack (MySQL + Spring Boot + React/nginx + Caddy for HTTPS) runs on
one small droplet with `docker-compose.prod.yml`.

## 0. One-time prerequisites

- Claim the DigitalOcean offer ($200 / 12 months) via the
  [GitHub Student Pack](https://education.github.com/pack).
- You need a domain for HTTPS. The Student Pack includes a free `.me`
  (Namecheap) or `.tech` domain. HTTPS is required for PWA features
  (camera, install prompt) on iPhone.

## 1. Create the droplet

DigitalOcean dashboard → Create → Droplet:

- Image: **Ubuntu 24.04 LTS**
- Size: Basic / Regular — **$6/mo (1 GB RAM)** is enough to start
- Region: Frankfurt (closest to Slovenia)
- Authentication: **SSH key** (paste the contents of `~/.ssh/id_ed25519.pub`;
  create one with `ssh-keygen -t ed25519` if you don't have it)

Note the droplet's IP address.

## 2. Point your domain at the droplet

At your DNS provider (Namecheap), create an **A record**:

```
inventory.yourdomain.me  →  <droplet IP>
```

## 3. Prepare the server

```bash
ssh root@<droplet-ip>

# install Docker (official convenience script)
curl -fsSL https://get.docker.com | sh

# firewall: allow only SSH + web
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable
```

## 4. Get the code and configure secrets

```bash
git clone https://github.com/Alan-Labas/Inventory.git
cd Inventory

# secrets live only on the server, never in git
cp Backend/.env.example Backend/.env
nano Backend/.env        # set NEW MYSQL_PASSWORD / MYSQL_ROOT_PASSWORD / JWT_SECRET
                         # (generate with: openssl rand -base64 48)

# tell Caddy which domain to get a certificate for
echo "DOMAIN=inventory.yourdomain.me" > .env
```

## 5. Start everything

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

First start takes a few minutes (Maven + npm builds). Then open
`https://inventory.yourdomain.me` — Caddy obtains the Let's Encrypt
certificate automatically on the first request.

## 6. Deploying updates (after merging to main)

```bash
ssh root@<droplet-ip>
cd Inventory
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Useful commands

```bash
docker compose -f docker-compose.prod.yml ps          # status
docker compose -f docker-compose.prod.yml logs -f backend
docker exec -it inventory-db-1 mysql -u root -p       # database shell
```

## Architecture

```
Internet ──443──> Caddy (TLS) ──> nginx (frontend, serves React build)
                                    └── /api/* ──> Spring Boot backend ──> MySQL
```

Only Caddy is exposed to the internet; MySQL and the backend are reachable
solely on the internal Docker network.
