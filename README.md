Employee Management System 


Prerequisites :

Angular Version -  Angular 6 
Angular CLI 6
Bootstrap Version -  Bootstrap 3 

Development Environment :

Install Node 8.x or later and NPM 5.x or later : https://nodejs.org/en/

Install Angular CLI 6 or later - 
npm install -g @angular/cli (if installing first time)
npm install -g @angular/cli@latest (To upgrade)

Install Visual Studio Code : https://code.visualstudio.com/

Install Bootstrap using >npm install bootstrap@3 jquery --save

[ 
  Verify your node version using >node -v command 
  Verify your NPM version using >npm -v command
  Verify the version of Angular CLI using >ng -v 
]


Create fake online REST API:
Steps -
1) Install npm package called json server using >npm install -g json-server
2) Create db.json file
3) Start fake REST API server - Go to the project folder and execute >json-server —watch db.json


Project creation and execution commands :

>ng new [project name] / ng new [project name] --skip - tests (To skip test files)
>Go to the project folder and execute >ng serves --open

Important : REST API Server should be started
