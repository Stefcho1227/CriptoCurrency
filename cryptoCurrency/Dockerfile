FROM openjdk:17-jdk-slim
LABEL authors="Asus"
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
