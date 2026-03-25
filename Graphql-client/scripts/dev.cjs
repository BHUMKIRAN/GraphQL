const { spawn } = require("node:child_process");

process.env.NEXT_DISABLE_TURBOPACK = process.env.NEXT_DISABLE_TURBOPACK ?? "1";

const args = ["dev", ...process.argv.slice(2)];

const child = spawn("next", args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
