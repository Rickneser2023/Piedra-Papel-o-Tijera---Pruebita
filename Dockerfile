# Imagen base
FROM nginx:alpine

# Eliminar configuración por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar tu web al contenedor
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]