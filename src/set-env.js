const fs = require("fs");
const dotenv = require("dotenv");

const envConfig = dotenv.config().parsed;
const envFileContent = Object.keys(envConfig)
  .map((key) => `export const ${key} = '${envConfig[key]}';`)
  .join("\n");

fs.writeFileSync("src/environments/environment.ts", envFileContent);
