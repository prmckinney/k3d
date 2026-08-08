FROM alpine

RUN apk add --update --no-cache postgresql-client

WORKDIR /usr/src/app

COPY addurl.sh ./

CMD ["addurl.sh"]