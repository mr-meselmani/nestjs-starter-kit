<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# NestJS Starter Kit 🚀

<div align="center">
  <img src="https://github.com/mr-meselmani/nestjs-starter-kit/blob/master/public/words-github-banner.jpg?raw=true" alt="Project Banner" style="width:100%;"/>
</div>

</br>

# Architecture

<div align="center">
  <img src="https://github.com/mr-meselmani/nestjs-starter-kit/blob/master/public/nestjs-starter-kit-architecture.jpg?raw=true" alt="Project Banner" style="width:100%;"/>
</div>

</br>

> **_NOTE:_** Any folder which is not a NestJS module we prefix it with `_` this makes the view better in code editor & separate of concerns.

---

## Welcome

Welcome to the NestJS Starter Kit 🚀 This starter is opensource and provides a robust backend framework using NestJS with Prisma for database management, PostgreSQL as the database, Zod for schema validation, Resend email service, and TypeScript for type safety. Complete Authentication and Authorization are also included out of the box using PassportJS strategies JWT access & refresh tokens.

> **_NOTE:_** Join the Innovators Lounge [Discord Server](https://discord.gg/Z8Yf4xj529) for free to get support and be an innovator member 😎

---

## Table of Contents

- [Features and Benefits](#features-and-benefits)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Setup](#docker-setup)
- [Contributing](#contributing)
- [Sponsorship](#sponsorship) 🤍
- [Current ERD](#current-erd)
- [License](#license)

---

## Features and Benefits

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Authentication and Authorization**: Complete user authentication solution and Role-based Access Control (RBAC) 🎉.
- **Prisma**: An open-source database toolkit that simplifies database access and management.
- **PostgreSQL**: A powerful, open-source relational database system.
- **TypeScript Support**: Strongly typed code for better maintainability and scalability.
- **Zod Validation**: Validation across all requests and responses lifecycle using zod schemas.
- **Docker**: Containerization abstract the setup tools on any local machine and help in deployment.
- **Resend Email Service**: A fast & cheap email service to use in your project.
- **Modular Architecture**: Organized code structure for better separation of concerns.
- **Auto Generated Local Docs**: Using [Compodoc](https://github.com/compodoc/compodoc/), after installation run this command: `pnpm dlx @compodoc/compodoc -p tsconfig.json -s`

---

## Getting Started

This guide will walk you through how to set up, configure, and run the NestJS starter kit on your local machine OR skip this and go to Docker Setup to avoid installing tools.

### Prerequisites

Make sure you have the following installed:

- Node.js (version 20.11.0 or higher)
- npm & pnpm
- PostgreSQL (installed and running)

---

## Installation

To get started with this starter kit, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/mr-meselmani/nestjs-starter-kit.git
   ```
2. Navigate to the project directory:

   ```bash
   cd nestjs-starter-kit
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

4. Set up Environment Variables:

   - Create a `.env` file in the root directory.
   - Copy the contents of `.env.example` into `.env` and configure any necessary environment variables and make sure to read notes written inside the `.env` file. For Local, make sure `DATABASE_URL` is set to use the `HOST` as `localhost`.

5. Make a database migration using the script defined in the `package.json` file by running:
   ```bash
   pnpm db:migrate
   ```
6. Run the seed command to seed the database by some data defined in `prisma/seed/data`:

   ```bash
   pnpm db:seed
   ```

7. Run the application:
   ```bash
   pnpm start:dev
   ```

---

## Usage

After running the application, you can access the Swagger API documentation at `http://localhost:3000/doc`. You can modify the code to fit your project requirements.

---

### Docker Setup

To run the project using Docker, make sure Docker is installed and running on your machine. Follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/mr-meselmani/nestjs-starter-kit.git
   ```

2. **Navigate to the Project Directory**:

   ```bash
   cd nestjs-starter-kit
   ```

3. **Set up Environment Variables**:

   - Create a `.env` file in the root directory.
   - Copy the contents of `.env.example` into `.env` and configure any necessary environment variables. For Docker, make sure `DATABASE_URL` is set to use the `HOST` as `postgres` (the name of the database service in the `docker-compose.yml` file).

4. **Run the Project with Docker Compose**:

   ```bash
   docker-compose up -d
   ```

   This command will build and run the application and a PostgreSQL container, as defined in the `docker-compose.yml` file.

5. **Apply Database Migrations**:
   Once the containers are running, apply database migrations using the following command:

   ```bash
   docker-compose exec app pnpm prisma migrate deploy
   ```

   Replace `app` with the name of the service in your `docker-compose.yml` file if it’s different.

6. **Access the Application**:
   The application should be available at `http://localhost:3000/doc` on your local machine.

---

## Contributing

We welcome contributions from the community. If you'd like to contribute, please follow these steps:

1. Open an issue in the GitHub repository.
2. Fork the repository.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them.
5. Push your branch and create a pull request **`only to development branch`**.
6. Wait for review & acceptance.

Please ensure your code follows the project's coding standards and very well tested.

---

## Sponsorship

If you find this project helpful and would like to support its development, please consider sponsoring this project. You can send contributions using the following cryptocurrency:

- **Solana**: **`HevTaAxB36eqHFhLEYcDnZJtySBebQUbaxBBaau5qyin`**

Your contributions will help ensure the continued development and maintenance of this starter kit. Thank you for your support 🤍

---

## Current ERD

<div align="center">
  <img src="https://github.com/mr-meselmani/nestjs-starter-kit/blob/master/public/current-erd.png?raw=true" alt="Project Banner" style="width:100%;"/>
</div>

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Thank you for checking out the NestJS Starter Kit 🚀 Happy coding 🎉
