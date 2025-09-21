// This is a config file for prisma, https://www.prisma.io/docs/orm/reference/prisma-config-reference#overview
// A new way to config prisma in versions > 6.16.1

import * as dotenv from "dotenv";
import dotenvExpand from 'dotenv-expand'
import path from "path";
import { defineConfig } from "prisma/config";

// Load and expand environment variables with variable substitution
dotenvExpand.expand(dotenv.config());


export default defineConfig({
    schema: path.join(__dirname, "prisma", "schema.prisma"),
    migrations: {
        path: path.join(__dirname, "prisma", "migrations"),
        seed: `tsx ./prisma/seed/index.ts`,
    },
});