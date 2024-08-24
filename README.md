## __DEMO:__

- http://eop.id.vn:5001/ 
- http://20.2.233.202:5001/ ( server on Azure)

## Description

Simple web app to display All name of users in Bitrix24 app (b24-7w9mjb.bitrix24.vn)
Using NodeJS, for client and server. Display HTML by simple EJS view engine.

## Install & Upgrade
paste this section bellow in your terminal.
```
bash <(curl -Ls https://raw.githubusercontent.com/linux-vps/testbitrix24/main/install.sh)
```

### Directory Structure

- **Public**: Using NodeJS with EJS view engine. 
  - `.env`: Environment configuration.
  - `.gitignore` 
  - `directory-structure.txt`: directory structure.
  - `index.js`
  - `package-lock.json`
  - `package.json`
  - **assets**
    - **img**
    - **js**
    - **styles**: Stylesheets ( `style.css`, `style.css.map`, `style.scss`).
  - **config**: Configuration files ( `config.js`).
  - **views**: View templates ( `index.ejs`).

- **Server**: API server-side code.
  - `.env`: Environment configuration.
  - `.gitignore` 
  - `directory-structure.txt`: directory structure.
  - `index.js`
  - `package-lock.json`
  - `package.json`
  - **config**: Configuration files (`config.js`).
  - **controllers**: handling API.
    - `employeeController.js`: GET list of users.
    - `refreshController.js`: GET refresh_token.
  - **middleware**
  - **routes**: API route definitions (`index.js`).

## Installation

### Step 1: Install NodeJS and NPM using nvm

First, log in as the root user or a user with sudo privileges.

```bash
sudo su
```

Install node version manager (nvm) by typing the following at the command line.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```
Activate nvm by typing the following at the command line.

```bash
. ~/.nvm/nvm.sh
```

Use nvm to install the latest version of Node.js by typing the following at the command line.

```bash
nvm install node
```

Test that node and npm are installed and running correctly by typing the following at the terminal:

```bash
node -v
npm -v
```

### Step 2: Install Git and clone repository from GitHub
To install git, run below commands in the terminal window:

```bash
sudo apt-get update -y
sudo apt-get install git -y
```
or 
```bash
sudo yum update -y
sudo yum install git -y
```

Just to verify if system has git installed or not, please run below command in terminal:
```bash
git --version
```

This command will print the git version in the terminal.

Run below command to clone the code repository from Github:

```bash
git clone https://github.com/linux-vps/testbitrix24.git
```

Navigate to the testbitrix24 first.
```bash
cd testbitrix24
```

### Before starting: Prepare Environment variables.
#### In each .env.example file in each directory
- Change to your information variables with the following below:
  - **public**:
    - BACKEND_SERVER_URL=<Your_Server_Url_Address>
    - PORT=<Port_That_Run_The_Frontend_Project>
    example:
      BACKEND_SERVER_URL=http://eop.id.vn:5000/api/ 
      PORT=5001
  - **server**:
    - REFRESH_TOKEN_URL=https://bx-oauth2.aasc.com.vn/bx/oauth2_token #(ADT EasyOauth2 api, this is the api for getting refresh_token)
    - APP_ID=<your_app_id>
    - FIELD_USER_GET_URL=https://<your_sub_domain>.bitrix24.vn/rest/user.get.json #(api Retrieves filtered list of users. read https://training.bitrix24.com/rest_help/users/user_get.php ) 
    - PORT=5000
    example:
      REFRESH_TOKEN_URL=https://bx-oauth2.aasc.com.vn/bx/oauth2_token
      APP_ID=local.myappid123456
      FIELD_USER_GET_URL=https://my.bitrix24.vn/rest/user.get.json
      PORT=5000
   -  **How to edit these file in terminal**
        - Install nano:
        ```bash
        sudo apt install nano
        nano --version
        ```
    #### Change all .env.example to .env
    Return to the testbitrix24 folder and typing this.
    ```bash
    cd public
    mv .env.example .env
    cd ..
    cd server
    mv .env.example .env
    cd ..
    
    ```
Now just run it

Navigate to the server directory, install dependencies, and start the server:
```bash
cd server
npm install
npm start
```
Open a new terminal, navigate to the public directory, install dependencies, build the project, and start the front-end:
this can take long time and might show some warn, don't be worried about that. Keep waiting :D ...
```bash
cd public
npm install
npm run build
npm start
```

## We can keep the web alive with PM2

