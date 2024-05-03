const { execSync } = require("child_process");
const dotenv = require("dotenv");

dotenv.config();

const databaseUrl = process.env.EXPO_PUBLIC_API_URL;

console.log("Generating types from database schema...");

const command = `npx openapi-generator-cli generate -i ${databaseUrl}/api-json -g typescript-axios -o api/generated`;
execSync(command, { stdio: "inherit" });

console.log("API generated successfully!");
