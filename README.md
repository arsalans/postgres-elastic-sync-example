# postgres-elastic-sync-example
This microservice features a sync api which provides the support for crud operations in postgres and elastic search while keeping them in sync.

Here are some of the technical highlights in this project:

 - It is written using loopback framework 3.0.
 - The project is written in typescript.
 - The sync between postgres and elastic search is managed through a queue.
 - The updates to postgres are based on optimistic locking scenario where a version is checked in postgres before the update is made into the database and elastic.

Here is what you need to run this project:

 - Active MQ
 - Postgres Database
 - Elastic Search
