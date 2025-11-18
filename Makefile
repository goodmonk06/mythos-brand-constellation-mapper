.PHONY: help setup dev db-up db-down db-migrate db-seed db-studio clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial setup: install deps and setup database
	npm install
	cp .env.example .env
	@echo "\n✓ Setup complete! Edit .env if needed, then run 'make dev'"

dev: ## Start development server (runs DB and Next.js)
	@echo "Starting PostgreSQL..."
	@docker-compose up -d postgres
	@echo "Waiting for database to be ready..."
	@sleep 3
	@echo "Running migrations..."
	@npm run db:push
	@echo "Starting Next.js dev server..."
	@npm run dev

db-up: ## Start PostgreSQL database
	docker-compose up -d postgres

db-down: ## Stop PostgreSQL database
	docker-compose down

db-migrate: ## Run database migrations
	npm run db:migrate

db-push: ## Push schema to database (for development)
	npm run db:push

db-seed: ## Seed database with example data
	npm run db:seed

db-studio: ## Open Prisma Studio
	npm run db:studio

clean: ## Clean all generated files and containers
	docker-compose down -v
	rm -rf node_modules .next dist coverage
	rm -f .env

install: ## Install dependencies
	npm install
