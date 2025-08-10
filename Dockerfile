FROM node:22

RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json prisma ./

RUN yarn install

COPY . .

# Generate Prisma client and build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]