- To run Database:

1. Get postgres running: 
    > sudo service postgresql start
2. Enter psql command line: 
    > sudo -i -u postgres
3. Login to postgres:
    > psql
4. Create user with permission to create db:
    > CREATE ROLE api_user WITH LOGIN PASSWORD 'password';
    > ALTER ROLE api_user CREATEDB;
5. Create database:
    > create database winerd;
6. Exit postgres:
    > \q
7. Run .sql file:
    > psql -h localhost -d winerd -U api_user -f /home/{rest of path to the project}/FEUP-SINF/api/public/database/init.sql
8. Enter database command line:
    > psql winerd 
9. Confirm tables were created successfully:
    > \dt

PS: To exit psql command line just type 'exit'