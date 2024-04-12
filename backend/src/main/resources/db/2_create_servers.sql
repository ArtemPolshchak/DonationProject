create schema if not exists public;

insert into public.servers (server_password, server_user_name, server_name, server_url, deleted)
values ('password', 'userName', 'server1', 'jdbc:postgresql://localhost:5432/LineageIIDonation1', 'false'),
       ('password', 'userName', 'server2', 'jdbc:postgresql://localhost:5432/LineageIIDonation2', 'false'),
       ('password', 'userName', 'server3', 'jdbc:postgresql://localhost:5432/LineageIIDonation3', 'false'),
       ('password', 'userName', 'server4', 'jdbc:postgresql://localhost:5432/LineageIIDonation4', 'false')
