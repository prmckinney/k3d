FROM alpine

RUN apk add --update --no-cache postgresql-client curl bash

WORKDIR /usr/src/app

COPY addurl.sh ./

RUN chmod +x addurl.sh

CMD ["/usr/src/app/addurl.sh"]