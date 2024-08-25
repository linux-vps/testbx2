#!/bin/bash


red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
plain='\033[0m'

cur_dir=$(pwd)

# check root
[[ $EUID -ne 0 ]] && echo -e "${red}Fatal error: ${plain} Please run this script with root privilege \n " && exit 1

# Check OS and set release variable
if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    release=$ID
elif [[ -f /usr/lib/os-release ]]; then
    source /usr/lib/os-release
    release=$ID
else
    echo "Failed to check the system OS, please contact the author!" >&2
    exit 1
fi
echo "The OS release is: $release"

arch() {
    case "$(uname -m)" in
    x86_64 | x64 | amd64) echo 'amd64' ;;
    i*86 | x86) echo '386' ;;
    armv8* | armv8 | arm64 | aarch64) echo 'arm64' ;;
    armv7* | armv7 | arm) echo 'armv7' ;;
    armv6* | armv6) echo 'armv6' ;;
    armv5* | armv5) echo 'armv5' ;;
    s390x) echo 's390x' ;;
    *) echo -e "${green}Unsupported CPU architecture! ${plain}" && rm -f install.sh && exit 1 ;;
    esac
}

echo "arch: $(arch)"

install_base() {
    case "${release}" in
    ubuntu | debian | armbian)
        apt-get update && apt-get install -y -q wget curl tar 
        ;;
    centos | almalinux | rocky | oracle)
        yum -y update && yum install -y -q wget curl tar 
        ;;
    fedora)
        dnf -y update && dnf install -y -q wget curl tar 
        ;;
    arch | manjaro | parch)
        pacman -Syu && pacman -Syu --noconfirm wget curl tar 
        ;;
    opensuse-tumbleweed)
        zypper refresh && zypper -q install -y wget curl tar timezone
        ;;
    *)
        apt-get update && apt install -y -q wget curl tar 
        ;;
    esac
}

install_web_app(){
    echo "Install NodeJS and NPM using nvm..."
    echo "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

    # activate nvm
    . ~/.nvm/nvm.sh

    # install node
    nvm install node

    # Kiểm tra
    echo "Node version:"
    node -v
    echo "NPM version:"
    npm -v

    # Install Git and clone repository from GitHub
    echo "Install Git and clone repository from GitHub"
    echo "Install Git..."

    # install on Ubuntu/Debian
    sudo apt-get update -y
    sudo apt-get install git -y

    # check
    echo "Git version:"
    git --version

    # Clone repository from GitHub
    echo "Cloning repository from GitHub..."
    git clone https://github.com/linux-vps/vong2.git

    echo "Installing nano..."
    sudo apt install nano -y

    echo "Installing pm2..."
    pm2 stop all
    npm install pm2 -g && pm2 update
    pm2 stop all

    # Navigate to the vong2 folder
    cd vong2
    echo "##########################################################"

    echo "##########################################################"
    # Function to prompt user for input and set the value
    prompt_for_variable() {
        local var_name=$1
        local prompt_message=$2
        read -p "$prompt_message" var_value
        echo "$var_name=$var_value"
    }


    # Ask if the user wants to input environment variables now
    read -p "Do you want to configure environment variables now? (Y/n): " config_now

    if [[ "$config_now" == "Y" || "$config_now" == "y" || "$config_now" == "yes" || "$config_now" == "Yes" ]]; then
        # Ask the user to input environment variables for public
        echo "Setting up environment variables for the frontend..."
        cd public

        backend_server_url=$(prompt_for_variable "BACKEND_SERVER_URL" "Enter the backend server URL (e.g., http://yourdomain.com:5000/api): ")
        port=$(prompt_for_variable "PORT" "Enter the frontend port (e.g., 5001): ")

        # Write variables to .env file
        echo -e "$backend_server_url\n$port" > .env

        cd ..

        # Ask the user to input environment variables for server
        echo "Setting up environment variables for the backend..."
        cd server

        refresh_token_url=$(prompt_for_variable "REFRESH_TOKEN_URL" "Enter the refresh token URL: ")
        app_id=$(prompt_for_variable "APP_ID" "Enter the application ID: ")
        field_user_get_url=$(prompt_for_variable "FIELD_USER_GET_URL" "Enter the user get URL: ")
        server_port=$(prompt_for_variable "PORT" "Enter the backend port (e.g., 5000): ")

        # Write variables to .env file
        echo -e "$refresh_token_url\n$app_id\n$field_user_get_url\n$server_port" > .env

        cd ..

        echo "Environment variables have been set."

    else
        echo "Skipping environment variable configuration. You can configure them later."
        echo "Edit variables in each .env.example file of backend and frontend"
        echo "Then rename rename them from .env.example to .env"
    fi

    echo "Install dependencies and build the web app..."
    cd server
    echo "Installing dependencies for backend"
    npm install
    cd ..

    cd public
    echo "Installing dependencies for frontend"
    # Set timeout to 1 minute (60 seconds)
    timeout 60s npm install

    # Check if npm install was successful or timed out
    if [ $? -eq 124 ]; then
        echo "npm install was cancelled due to timeout. don't worrie, you can continue install later"
    else
        echo "Building webpack"
        npm run build
    fi
    npm install
    echo "Building webpack"
    npm run build
    cd .. 
    chmod +x deploy.sh

    echo -e "Run ${green} ./deploy.sh ${plain} to deploy!"

}

install_web_app
