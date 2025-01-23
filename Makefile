dev:
	pnpm run start:dev

gen:
	pnpm run db:generate

mig:
	pnpm run db:migrate

seed:
	pnpm run db:seed

std:
	pnpm run db:studio

res:
	pnpm run db:reset

lint:
	pnpm run lint

docs:
	pnpm run app:docs