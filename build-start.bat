del /F /Q src\main\resources\static\css\*
del /F /Q src\main\resources\static\js\*
del /F /Q src\main\resources\static\index.html
cd web
call npm run build
cd ..
xcopy web\dist\css\* src\main\resources\static\css
xcopy web\dist\js\* src\main\resources\static\js
xcopy web\dist\index.html src\main\resources\static
call mvn clean install -DskipTests
call java -jar target\poli-1.0.0.jar
