# Clothing E-Commerce Platform

Welcome to the Clothing E-Commerce Platform repository. This repository is organized as a monorepo consisting of:
- `/frontend`: Next.js Web Storefront and Admin Panel
- `/backend`: Express-based microservices architecture communicating via RabbitMQ and Redis caching
- `/database`: Prisma ORM schema and seed scripts
- `/docker`: Local container configurations for Redis, RabbitMQ, and PostgreSQL

## Setup & Run
To run the entire suite locally in development mode:
```bash
docker-compose up --build
```
