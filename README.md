# Fast'n'Fresh API

## There are Two ways To Get Started With:

1.  Using **Docker** :whale:
2.  Using **npm/yarn**

<hr></hr>

### Method 1 - If you have Docker And Docker Compose Installed on your system:

Change permissions for the startup, exit and log files

```console
foo@bar:~$ chmod +x ./entrypoint.sh
foo@bar:~$ chmod +x ./exit.sh
foo@bar:~$ chmod +x ./logs.sh
```

To start the application :

```console
foo@bar:~$ ./entrypoint.sh
```

To get logs :

```console
foo@bar:~$ ./logs.sh
```

To stop the application :

```console
foo@bar:~$ ./exit.sh
```

The docker and docker-compose commands are added to these files

<hr>

### Method 2 : Using NPM/YARN:

**Note** : Make sure you have '**npm**' or '**yarn**' installed on your local machine

To test the project on your local machine run :

```console

foo@bar:~$ npm install

```

alternatively

```console

foo@bar:~$ yarn install

```

**create** a **dev.env** file which should contain the following **environment variables** configured :

- **PORT**=PORT_NUMBER

- **JWT_SECRET**=foobarsecret

- **MONGODB_URL**=mongodb+srv://monogdb-cluster-name:monogdb-example-user@cluster.mongodb.net/example-collection-name

To spin up the server run :

```console

foo@bar:~$ npm run dev

```

This will fire off :rocket: the 'dev' script which will spin a local server on your machine on port PORT_NUMBER

  <hr></hr>

To use the API, use this URL as your base URL :

http://localhost:PORT_NUMBER

on your respective request manager (Preferably Postman)

The [Post Man Collection](https://github.com/Fast-n-fresh/ff-backend-api/blob/main/fast_n_fresh_api.postman_collection.json) is added in the repository

### Happy Coding :wink: !!
