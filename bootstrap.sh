#!/bin/bash
# Script to create development environment in Ubuntu

# Upgrade system and install required packages
sudo apt update
sudo apt upgrade -y
sudo apt install -y postgresql postgresql-contrib

# bcrypt requirements
sudo apt install -y python build-essential

# Set timezone to Helsinki
echo "Europe/Helsinki" | sudo tee /etc/timezone
sudo unlink /etc/localtime
sudo ln -s /usr/share/zoneinfo/Europe/Helsinki /etc/localtime

# Install nvm
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

# Install Node 12 and default packages
nvm install --no-progress 12

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install --no-install-recommends yarn

# Install Heroku cli
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
heroku --version
heroku login

# Create Postgres database
sudo -u postgres createuser -s vaccine
sudo -u postgres psql -c "CREATE DATABASE vaccinedb WITH ENCODING 'UTF8';"
sudo -u postgres psql -c "ALTER USER vaccine WITH ENCRYPTED PASSWORD 'sQj61YQdEut38nge';"

# Enable passwordless access
echo 'localhost:5432:vaccinedb:vaccine:sQj61YQdEut38nge' > ~/.pgpass && chmod 0600 ~/.pgpass

# Configure postgres to allow connections from Vagrant host
sudo sed -i "s/#listen_address.*/listen_addresses = '*'/" $(find /etc/postgresql -name postgresql.conf)
sudo tee -a  $(find /etc/postgresql -name pg_hba.conf) <<EOF
# Accept all IPv4 connections from Vagrant host (10.0.2.2)
host    all             all             10.0.2.2/32             md5
EOF
sudo systemctl restart postgresql

# Clone repository
git clone git@version.aalto.fi:kinnunl7/vaccination-erecord-ui.git
cd vaccination-erecord-ui/backend

# Install dependencies
npm install

# Add database information to .env
echo 'DATABASE_URL=postgres://vaccine:sQj61YQdEut38nge@localhost:5432/vaccinedb' >> .env

echo "Run '. .bashrc' to source .bashrc and enable nvm, node and npm. Alternatively start new shell session"
