This pet agent is designed to get telemetry from POC database by user request and return forecast of telemetry instead. Implemented using LangChain library, OpenAI api.(build and compiled using NodeJS) 

To make things happen you need: 

1) run npm install;
2) in .env file past your OpenAI api key 
3) in constants.js change datasource credetions to your local/remote database
4) run `node agent-AI.js`
5) enter your request inputs
