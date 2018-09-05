# Fender Digital Platform Engineering Challenge

## Solution - how to run, and current state

This is a node-js application. Node was chosen for its ease of use, and demonstration of full stack ability. However, it is not an object oriented language, and techniques such as interface that catch issues at compile time are not possible. Nonetheless, the program components were written to be modular.

To run, you can either go into the binaries directory and run the program, or do
```
npm install
npm start
```
Assuming you have node-js installed. This will run the javascript using the node interpreter.



Additional configuration:

It accepts environment arguments:
```
PORT
PLATFORM_TEST_DB_USER
PLATFORM_TEST_DB_HOST
PLATFORM_TEST_DB
PLATFORM_TEST_DB_PASS
PLATFORM_TEST_DB_PORT
```
DB environment parameters are for a Postgres db. The script postgres_v1.sql should be run before running this program, and then the environment variables should be configured according to where that new table lives.

For testing endpoints, see server.js or use the included Postman collection with https://www.getpostman.com/.

The requests are not JSON in its current state. Since the client never actually receives a full user object, I thought that this was sufficient.
The responses are mainly 204 if successful, 500 exception if failure, or Token if successfully logged in. Ideally the error handling would be 4xx for user input error.

Verifying the successful flow should be obvious based on the output, either 204, or the token. Anything else gives a 500. The specific error can be seen in the server stdout.

## Description

Design and implement a RESTful web service to facilitate a user authentication system. The authentication mechanism should be *token based*. Requests and responses should be in **JSON**.

## Requirements

**Models**

The **User** model should have the following properties (at minimum):

1. name
2. email
3. password

You should determine what, *if any*, additional models you will need.

**Endpoints**

All of these endpoints should be written from a user's perspective.

1. **User** Registration
2. Login (*token based*) - should return a token, given *valid* credentials
3. Logout - logs a user out
4. Update a **User**'s Information
5. Delete a **User**

**README**

Please include:
- a readme file that explains your thinking
- how to setup and run the project
- if you chose to use a database, include instructions on how to set that up
- if you have tests, include instructions on how to run them
- a description of what enhancements you might make if you had more time.

**Additional Info**

- We expect this project to take a few hours to complete
- You can use Rails/Sinatra, Python, Go, node.js or shiny-new-framework X, as long as you tell us why you chose it and how it was a good fit for the challenge. 
- Feel free to use whichever database you'd like; we suggest Postgres. 
- Bonus points for security, specs, etc. 
- Do as little or as much as you like.

Please fork this repo and commit your code into that fork.  Show your work and process through those commits.

