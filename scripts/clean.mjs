import fs from "node:fs";
import path from "node:path";

const targets = [
  "apps/web/.next",
  "apps/admin/.next",
  "node_modules/.cache",
];

for (const target of targets) {
  const targetPath = path.resolve(process.cwd(), target);
  try {
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      console.log(`Cleaned ${target}`);
    }
  } catch (err) {
    console.error(`Could not clean ${target}: ${err.message}`);
  }
}
