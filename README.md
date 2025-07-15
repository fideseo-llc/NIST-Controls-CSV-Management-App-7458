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
