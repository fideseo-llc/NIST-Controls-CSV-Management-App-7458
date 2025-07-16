 1. Build the Application

First, create a production-ready build of your application:

bash
# Install dependencies if you haven't already
npm install

# Create an optimized production build
npm run build


This will generate a /dist directory containing static files ready for deployment.
2. On-Premises Deployment Options

Option A: Static File Server

The simplest approach is to serve the static files from the /dist directory:
1. **Using a Node.js server**:

bash
   # Install a simple static file server
   npm install -g serve
   
   # Serve the dist folder (specify port if needed)
   serve -s dist -p 3000
   


2. **Using Apache HTTP Server**:
• Install Apache on your server
• Copy the contents of the /dist folder to your Apache document root (e.g., /var/www/html/)
• Configure Apache to serve the application

3. **Using Nginx**:
• Install Nginx on your server
• Copy the contents of the /dist folder to your Nginx document root
• Configure Nginx with this basic setup:

nginx
     server {
         listen 80;
         server_name your-domain.com;  # Or your server's IP
         
         root /path/to/dist;
         index index.html;
         
         # Handle SPA routing
         location / {
             try_files $uri $uri/ /index.html;
         }
     }
     


Option B: Docker Deployment

For a containerized approach:
1. Create a Dockerfile in your project root:

dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   


2. Create an nginx.conf file:

   server {
       listen 80;
       server_name localhost;
       
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   


3. Build and run the Docker container:

bash
   docker build -t nist-controls-app .
   docker run -p 80:80 nist-controls-app
   
3. Data Persistence Considerations

The app currently uses browser's localStorage for data persistence. For an on-premises deployment, you might want to enhance this:
Option A: Use a Local Database

1. **SQLite or IndexedDB**: For a lightweight solution with no external dependencies
2. **PostgreSQL or MariaDB**: For a more robust solution on your server

Option B: File-Based Storage

Configure the app to store data in JSON files on the server, which would require building a simple backend API.
4. Authentication Improvements

For a production deployment, improve the authentication:
1. Hash passwords and use environment variables for credentials
2. Implement a more robust authentication system using JWT
3. Consider integrating with your organization's existing authentication systems (LDAP, Active Directory, etc.)

5. Configuration for Internal Network

1. If deploying on an internal network, ensure your server is accessible to all required users
2. Configure firewalls to allow traffic on the web server port
3. Consider setting up HTTPS even for internal applications for security


To set up and run the application with MariaDB:
1. **Install MariaDB** on your system if not already installed

2. **Create the Database and User**:

sql
CREATE DATABASE nist_controls;
CREATE USER 'nist_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nist_controls.* TO 'nist_user'@'localhost';
FLUSH PRIVILEGES;


3. **Initialize the Database**:

bash
# Log into MariaDB and run the schema
mysql -u root -p nist_controls < server/schema.sql


4. **Configure Environment**:
• Copy the .env file and update with your database credentials
• Update the JWT_SECRET to a secure random string

5. **Start the Application**:

bash
# Start both frontend and backend
npm run dev
