FROM node:20-alpine
WORKDIR /app
COPY backend/package.json ./backend/package.json
COPY database ./database
RUN cd backend && npm install
COPY backend ./backend
WORKDIR /app/backend
CMD ["npx", "ts-node", "notification-service/src/server.ts"]
