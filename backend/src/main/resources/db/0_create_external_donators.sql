create schema if not exists external;

create table if not exists external.donators
(
    id    bigserial primary key,
    email varchar(32) unique
);

insert into external.donators (email)
values ('1@gmail.com'),
       ('2@gmail.com'),
       ('3@gmail.com'),
       ('4@gmail.com'),
       ('5@gmail.com'),
       ('6@gmail.com'),
       ('7@gmail.com'),
       ('8@gmail.com'),
       ('9@gmail.com'),
       ('10@gmail.com'),
       ('11@gmail.com'),
       ('12@gmail.com'),
       ('13@gmail.com'),
       ('14@gmail.com'),
       ('15@gmail.com'),
       ('16@gmail.com'),
       ('17@gmail.com'),
       ('18@gmail.com'),
       ('19@gmail.com'),
       ('20@gmail.com');
