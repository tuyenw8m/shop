# Sử dụng JDK 21 (vì pom.xml chỉ định Java 21)
FROM eclipse-temurin:21-jdk-alpine

VOLUME /tmp
WORKDIR /app

# Copy file jar đã build sẵn (bạn cần chạy mvn package trước)
COPY target/shop-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]