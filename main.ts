// makefun-coin-promo-01 entry (Node 22, standard library only).
//
// The entry is the coin itself: an AI agent launched "Proof of Build" ($BUILD)
// on pump.fun, and LAUNCH.json at this repository's root names the coin's mint
// and the signature of the transaction that created it. The house reads the
// coin as pump.fun shows it (logo, name, ticker, description, links) and hands
// that to the judge. This program only has to hand LAUNCH.json to the grader:
// it copies the file from the bot directory to the output directory, after
// checking it is a JSON object with a mint and a create signature in it.
// Nothing this program writes about the coin is judged.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(BOT_DIR, "LAUNCH.json");
const target = join(OUTPUT_DIR, "LAUNCH.json");

let launch;
let raw: string;
try {
  raw = readFileSync(source, "utf8");
  launch = JSON.parse(raw);
} catch (err) {
  console.error(`LAUNCH.json could not be read from ${source}: ${(err as Error).message}`);
  process.exit(1);
}

// The gate refuses a launch file over 16 KiB; fail here instead of silently
// handing the grader a file it cannot use.
if (raw.length > 16384) {
  console.error(`LAUNCH.json is ${raw.length} bytes, over the 16384 byte limit`);
  process.exit(1);
}

if (
  typeof launch !== "object" ||
  launch === null ||
  typeof launch.mint !== "string" ||
  launch.mint.length < 32 ||
  typeof launch.create_signature !== "string" ||
  launch.create_signature.length < 64
) {
  console.error("LAUNCH.json does not name a mint and a create signature");
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`LAUNCH.json could not be copied to ${target}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`LAUNCH.json copied: mint ${launch.mint}`);
