FROM alpine:latest
RUN apk--no-cache add sqlite
COPY venta.db /venta.db
CMD ["mysql5","/venta.db"]
