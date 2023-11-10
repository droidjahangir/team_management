FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY ./package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the application code
COPY . .

EXPOSE 4001

# Start the Node.js application
CMD ["npm", "start"]