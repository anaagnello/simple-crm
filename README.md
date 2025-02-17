# SimpleCRM

## Prerequisites

Node v18+

## Local setup

in the root of the repository, run the following

```sh
npm install
```

Then launch the frontend and backend in separate terminals.

Terminal 1:
```sh
cd code/server
npm run start
```

Terminal 2:
```sh
cd code/client
npm run start
```

To run tests, run the following commands (note, the server does not need to be running for this but the DB will be interacted with)
```sh
cd code/server
npm test
```
