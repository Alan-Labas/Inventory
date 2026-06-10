# Inventory Backend

## Run locally with MySQL

1. Start a MySQL server on `localhost:3306`.
2. Copy `.env.example` to `.env` and fill in your values.
3. Load the variables and start Spring Boot:

```zsh
cd /Users/alanlabas/FAKS_2.Letnik/Inventory/Backend
set -a
source .env
set +a
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Run with Docker + MySQL

Use the existing Compose file in the parent `Inventory` folder, not the one in `Backend`.

```zsh
cd /Users/alanlabas/FAKS_2.Letnik/Inventory
docker compose up --build
```

The backend will be available on `http://localhost:8080` and MySQL on `localhost:3306`.

## Notes

- `application.properties` keeps a lightweight embedded H2 fallback for simple startup without profiles.
- The `docker` profile uses the MySQL container service name `mysql` as the database host.
- Spring Boot does **not** automatically read `.env` files when running from Maven; Docker Compose does.
- The `Backend/docker-compose.yml` file is redundant if you already use the parent-level Compose file.


