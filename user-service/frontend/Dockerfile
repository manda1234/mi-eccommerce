# Gunakan node image
FROM node:20

# Set working directory
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua source code
COPY . .

# Jalankan development server React
CMD ["npm", "start"]

# Expose port React
EXPOSE 3000
