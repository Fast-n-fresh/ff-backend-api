# Nature's Delicacies API

## getting started

Note : Make sure you have 'npm' or 'yarn' installed on your local machine

To test the project on your local machine run :

```console
foo@bar:~$ npm install
```

alternatively

```console
foo@bar:~$ yarn install
```

create a dev.env file which should contain the following environment variables configured :

- PORT=PORT_NUMBER
- JWT_SECRET=foobarsecret
- MONGODB_URL=mongodb+srv://monogdb-cluster-name:monogdb-example-user@cluster.mongodb.net/example-collection-name

To spin up the server run :

```console
foo@bar:~$ npm run dev
```

This will fire off the 'start' script which will spin a local server on your machine on port 3000

To use the api use this url as your base url :

http://localhost:3000

on your respective request manager (Preferably Postman)

### Happy Coding!!
