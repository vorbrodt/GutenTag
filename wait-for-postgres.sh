#!/bin/sh
# https://docs.docker.com/compose/startup-order/

set -e
  
host="db"
shift
cmd="$@"

postgres
  
until PGPASSWORD="admin" psql -h "$host" -U "admin" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
  
>&2 echo "Postgres is up - executing command"
exec $cmd