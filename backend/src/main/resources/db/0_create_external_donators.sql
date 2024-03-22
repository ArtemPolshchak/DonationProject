create schema if not exists external;

create table if not exists external.donators
(
    id    bigserial primary key,
    email varchar(32) unique
);

insert into external.donators (email)
values ('a@gmail.com', '0.00'),
       ('b@gmail.com', '0.00'),
       ('c@gmail.com', '0.00'),
       ('d@gmail.com', '0.00'),
       ('e@gmail.com', '0.00'),
       ('f@gmail.com', '0.00'),
       ('g@gmail.com', '0.00'),
       ('h@gmail.com', '0.00'),
       ('i@gmail.com', '0.00'),
       ('j0@gmail.com', '0.00'),
       ('k@gmail.com', '0.00'),
       ('l@gmail.com', '0.00'),
       ('m@gmail.com', '0.00'),
       ('n@gmail.com', '0.00'),
       ('o@gmail.com', '0.00'),
       ('p@gmail.com', '0.00'),
       ('q@gmail.com', '0.00'),
       ('r@gmail.com', '0.00'),
       ('s@gmail.com', '0.00'),
       ('t@gmail.com', '0.00');
