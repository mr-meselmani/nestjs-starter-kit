# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.0
ARG PNPM_VERSION=9.12.2
ARG NODE_ENV

# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine

# Create app directory, this is in our container/in our image
WORKDIR /nestjs-starter-kit

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json pnpm-lock.yaml ./

COPY prisma ./prisma/

RUN npm i -g pnpm@${PNPM_VERSION}

RUN pnpm install

# RUN pnpm install --production

# If you are building your code for production
# RUN pnpm ci --only=production

# Copy app source from host machine to /nestjs-starter-kit in the container
COPY . .

RUN npx prisma generate

RUN pnpm build

CMD ["pnpm", "start:dev"]

RUN echo ${NODE_ENV}
EXPOSE ${NODE_ENV}