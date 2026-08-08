#!/usr/bin/env bash
url=$(curl -I -s https://en.wikipedia.org/wiki/Special:Random | grep -i '^location:' | sed 's/location: /https:/')
echo "Adding $url"
$(psql postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB} -c "INSERT INTO todos VALUES('Read $url');")
