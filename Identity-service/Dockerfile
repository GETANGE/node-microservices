FROM node:23-alpine 

WORKDIR /app

COPY package.json . 

# Install pnpm
RUN npm install -g pnpm 

RUN pnpm install 

COPY . .

EXPOSE 5001

CMD ["pnpm", "start"]