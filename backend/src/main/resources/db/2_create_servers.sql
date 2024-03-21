create schema if not exists public;

insert into public.servers (server_password, server_user_name, server_name, server_url)
values ('password', 'userName', 'server1', 'jdbc:postgresql://localhost:5432/LineageIIDonation1'),
       ('password', 'userName', 'server2', 'jdbc:postgresql://localhost:5432/LineageIIDonation2'),
       ('password', 'userName', 'server3', 'jdbc:postgresql://localhost:5432/LineageIIDonation3'),
       ('password', 'userName', 'server4', 'jdbc:postgresql://localhost:5432/LineageIIDonation4')
