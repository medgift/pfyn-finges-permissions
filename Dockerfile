FROM node:14
MAINTAINER Roger Schaer <roger.schaer@hevs.ch>

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

# Expose port
EXPOSE 4000

# Start the app
CMD [ "npm", "start" ]
