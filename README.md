- To run Database:

1.  Install postgres:
    > sudo apt update
    > sudo apt install postgresql postgresql-contrib
2.  Get postgres running: 
    > sudo service postgresql start
3.  Enter psql command line: 
    > sudo -i -u postgres
4.  Login to postgres:
    > psql
5.  Create user with permission to create db:
    > CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
    > ALTER ROLE api_user CREATEDB;
6.  Create database:
    > create database winerd;
7.  Exit postgres:
    > \q
8.  Run .sql file:
    > psql -h localhost -d winerd -U api_user -f /home/{rest of path to the project}/FEUP-SINF/api/public/database/init.sql
9.  Enter database command line:
    > psql winerd 
10. Confirm tables were created successfully:
    > \dt

PS: To exit psql command line just type 'exit'