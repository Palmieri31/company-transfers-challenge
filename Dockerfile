# Use a Node.js base image
FROM node:20.18
# Set the working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json (if it exists) to the container
COPY package*.json ./
# Install project dependencies
RUN npm install
# Copy all project files to the container
COPY . .
# Run the start:dev script when the container starts
ENTRYPOINT ["./startup.sh"]