import fs from "fs";
import {
  Address,
  BaseAddress,
  NetworkId,
  NetworkInfo,
} from "@emurgo/cardano-serialization-lib-nodejs";

function testnetAddrToMainnet(addrBech32: string): string {
  const addr = Address.from_bech32(addrBech32);
  const baseAddr = BaseAddress.from_address(addr);
  if (!baseAddr) {
    throw new Error(`not base address: ${addrBech32}`);
  }
  const mainnetAddr = BaseAddress.new(
    NetworkInfo.mainnet().network_id(),
    baseAddr.payment_cred(),
    baseAddr.stake_cred()
  );
  return mainnetAddr.to_address().to_bech32();
}

const MIN_ACTION = 5n;
const MAX_ACTION = 100n;
const TOTAL_MINT = 5_000_000_000_000n; // 5 million

const data = fs.readFileSync("input.csv", "utf-8");

const addrToActionCount: Record<string, bigint> = {};

for (const line of data.split("\n")) {
  const [addr, countRaw] = line.split(",");
  let count = BigInt(countRaw);
  if (count < MIN_ACTION) {
    continue;
  }
  if (count > MAX_ACTION) {
    count = MAX_ACTION;
  }
  addrToActionCount[addr] = count;
}

const totalActions = Object.values(addrToActionCount).reduce<bigint>(
  (sum, x) => sum + x,
  0n
);

fs.writeFileSync("output.csv", "");

for (const [addr, actionCount] of Object.entries(addrToActionCount)) {
  const mainnetAddr = testnetAddrToMainnet(addr);
  const mintRewards = (TOTAL_MINT * actionCount) / totalActions;
  fs.appendFileSync(
    "output.csv",
    `${mainnetAddr},${Number(mintRewards) / 1e6}\n`
  );
}
