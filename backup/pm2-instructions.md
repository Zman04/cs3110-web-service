# PM2 Process List

To restore the backend APIs on the new server, you can use the following commands inside their respective directories:

### 1. **secure-api**
* **Directory:** `/var/www/zaustin3-subdomain.ignorelist.com/html/hw6`
* **Entry Script:** `app.js`
* **Start Command:** 
  ```bash
  pm2 start app.js --name "secure-api"
  ```

### 2. **hw7-api**
* **Directory:** `/var/www/zaustin3-subdomain.ignorelist.com/html/hw7/websocket-demo`
* **Entry Script:** `server.js`
* **Start Command:**
  ```bash
  pm2 start server.js --name "hw7-api"
  ```

### 3. **semester-api**
* **Directory:** `/var/www/zaustin3-subdomain.ignorelist.com/api`
* **Entry Script:** `app.js`
* **Start Command:**
  ```bash
  pm2 start app.js --name "semester-api"
  ```
