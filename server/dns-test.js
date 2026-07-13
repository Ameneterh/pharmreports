import dns from "node:dns/promises";

try {
  console.log("Resolving SRV...");
  const records = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.neyjvtk.mongodb.net",
  );
  console.log(records);
} catch (err) {
  console.error(err);
}
