const { fork } = require("child_process");
const path = require("path");

// Configuration of the microservices
const services = [
  { name: "auth-service", path: "auth-service/src/server.js", port: 8001 },
  { name: "user-service", path: "user-service/src/server.js", port: 8002 },
  { name: "product-service", path: "product-service/src/server.js", port: 8003 },
  { name: "inventory-service", path: "inventory-service/src/server.js", port: 8004 },
  { name: "order-service", path: "order-service/src/server.js", port: 8005 },
  { name: "payment-service", path: "payment-service/src/server.js", port: 8006 },
  { name: "notification-service", path: "notification-service/src/server.js", port: 8007 },
  { name: "api-gateway", path: "api-gateway/src/server.js", port: process.env.PORT || 8000 },
];

const children = [];

console.log("=== STARTING YUGEN MICROSERVICES SUPERVISOR ===");

// Inject local loopback URLs for routing in the Gateway
const baseEnv = {
  ...process.env,
  AUTH_SERVICE_URL: "http://localhost:8001",
  USER_SERVICE_URL: "http://localhost:8002",
  PRODUCT_SERVICE_URL: "http://localhost:8003",
  INVENTORY_SERVICE_URL: "http://localhost:8004",
  ORDER_SERVICE_URL: "http://localhost:8005",
  PAYMENT_SERVICE_URL: "http://localhost:8006",
  NOTIFICATION_SERVICE_URL: "http://localhost:8007",
};

services.forEach((service) => {
  const servicePath = path.resolve(__dirname, "dist", service.path);
  const serviceEnv = {
    ...baseEnv,
    PORT: service.port.toString(),
  };

  console.log(`Spawning ${service.name} from: ${servicePath} on Port ${service.port}...`);

  const child = fork(servicePath, [], {
    env: serviceEnv,
    stdio: "inherit", // Pipe all logs directly to stdout/stderr
  });

  child.on("exit", (code, signal) => {
    console.error(`Service ${service.name} exited with code ${code} and signal ${signal}`);
    // If any service fails, shut down everything to trigger Render restart
    shutdown();
  });

  children.push({ child, name: service.name });
});

function shutdown() {
  console.log("Shutting down all microservices...");
  children.forEach(({ child, name }) => {
    if (child.connected) {
      console.log(`Killing ${name}...`);
      child.kill("SIGTERM");
    }
  });
  process.exit(1);
}

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException", (err) => {
  console.error("Uncaught supervisor exception:", err);
  shutdown();
});
