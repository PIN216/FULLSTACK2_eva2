@echo off
title Pasteleria Mil Sabores - Backend Spring Boot
echo ========================================================
echo   Iniciando Backend Spring Boot (Pasteleria Mil Sabores)
echo ========================================================
cd /d "%~dp0backend"
set "JAVA_HOME=C:\Users\maxof\.vscode\extensions\redhat.java-1.58.0-win32-x64\jre\25.0.4.1-win32-x86_64"
call mvnw.cmd spring-boot:run
pause
