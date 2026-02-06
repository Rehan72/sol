#!/bin/bash

# Define variables matching .env
DB_USER=solar_user
DB_PASS=password
DB_NAME=solar_platform

echo "Setting up PostgreSQL database..."

# Create User
sudo -u postgres psql -c "DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
        RAISE NOTICE 'Role $DB_USER created';
    ELSE
        RAISE NOTICE 'Role $DB_USER already exists';
        ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASS';
    END IF;
END
\$\$;"

# Create Database
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "Database $DB_NAME already exists"
else
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    echo "Database $DB_NAME created"
fi

echo "Database setup complete! Authentication should now work."
