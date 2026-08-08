#!/usr/bin/env bash
url=$(curl -I -s https://en.wikipedia.org/wiki/Special:Random | grep -i '^location:' | sed 's/location: /https:/')
echo "Adding $url"
$(psql postgresql://postgres:password@localhost:5432/postgres -c "INSERT INTO todos VALUES('Read $url');")
