const esbuild = require("esbuild");
const fs = require("node:fs").promises;
const path = require("node:path");

const aliasPlugin = {
  name: "alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, async (args) => {
      const resolved = await build.resolve(
        path.resolve(__dirname, "src", args.path.slice(2)),
        { resolveDir: __dirname, kind: args.kind }
      );
      return resolved;
    });
  },
};

const isWatch = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  platform: "node",
  target: "node18",
  format: "cjs",
  sourcemap: false,
  plugins: [aliasPlugin],
};

async function copyEnvExample() {
  const envExamplePath = path.join(__dirname, ".env.example");
  const distEnvExamplePath = path.join(__dirname, "dist", ".env.example");

  try {
    await fs.stat(envExamplePath);
    console.log("Copying .env.example...");
    await fs.copyFile(envExamplePath, distEnvExamplePath);
    console.log(".env.example copied to dist!");
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
    console.log(".env.example not found, skipping...");
  }
}

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log("Watching for changes...");
  } else {
    await esbuild.build(buildOptions);
    await copyEnvExample();
    console.log("Build complete!");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
