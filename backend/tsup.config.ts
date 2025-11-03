import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  format: ["cjs"],
  platform: "node",
  target: "node22",
  bundle: true,
  external: [
    "@prisma/client",
    "prisma",
    "mongoose",
    "bcrypt",
    "bcryptjs",
    "pdf-parse",
    "socket.io",
    "socket.io-client",
    "ws",
    "@trpc/server",
  ],
  splitting: false,
  dts: true,
  sourcemap: true,
  clean: true,
});
