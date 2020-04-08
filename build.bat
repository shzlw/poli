rmdir /S /Q src\main\resources\static\static
del /F /Q src\main\resources\static\favicon.ico
del /F /Q src\main\resources\static\index.html
cd web-app
call npm install
call npm run build
cd ..
xcopy web-app\build\static src\main\resources\static\static /s /i
xcopy web-app\build\favicon.ico src\main\resources\static
xcopy web-app\build\index.html src\main\resources\static
call mvn clean package -DskipTests
