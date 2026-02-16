#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Fallback defaults
DB_USER=${DB_USER:-solar_user}
DB_PASS=${DB_PASS:-password}
DB_NAME=${DB_NAME:-solar_platform}
DB_PORT=${DB_PORT:-5434}
DB_HOST=${DB_HOST:-localhost}

export PGPASSWORD=$DB_PASS

echo "Resetting PostgreSQL database schema: $DB_NAME on port $DB_PORT..."

# Terminate existing connections first (if owned by same user)
# We use psql to execute the command. This requires PGPASSWORD to be set.
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
DO \$\$ 
BEGIN
    PERFORM pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE usename = '$DB_USER' 
    AND pid <> pg_backend_pid() 
    AND datname = '$DB_NAME';
END 
\$\$;"

echo "Dropping public schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $DB_USER; GRANT ALL ON SCHEMA public TO public;"

if [ $? -eq 0 ]; then
    echo "Database reset complete! The application should now re-seed data on restart."
else
    echo "Failed to reset database. Check credentials and permissions."
    exit 1
fi
