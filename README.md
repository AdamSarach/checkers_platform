# Checkers Platform

#### Description
An application allows users to play checkers with others. You need to be registered and logged in to play a game.


#### Stack
  
    
:heavy_multiplication_x: Environment: Python 3.8  
:heavy_multiplication_x: Backend: Django 3 (+ Django Rest Framework + Django Channels)  
:heavy_multiplication_x: Frontend: React  
:heavy_multiplication_x: Styling: SASS (scss)  
:heavy_multiplication_x: DataBase: PostreSQL  
:heavy_multiplication_x: Deployment: AWS (EC2 + RDS) 
:heavy_multiplication_x: channel layer for Websockets: Redis  

#### Development

Instal dependencies with pipenv:
```
pipenv install
```

You need Redis to enable Websockets (invitations, chat, button click which affect other players view)
Docker command:

```
$ docker run -p 6379:6379 -d redis:5
```

Create react build (run command inside 'frontend' directory):
```
$ npm run build
```

Run Django project(in django main level directory):
```
$ python manage.py runserver
```

To run project you need secret key and db access data which are injected by django-decouple

#### Project integration
- [X] Set up Django Project
- [X] Set up React App
- [X] Set up Websockets Protocol
- [X] Database Connection
- [X] Deploy

#### Features
- [X] *README file
    - [X] *Tech stack
    - [X] *Project integration list
    - [X] *Feature list  
- [X] Login Page
   - [X] Graphics
   - [X] Form Handling
   - [X] Lobby Redirection after successful login
- [X] Register Page
   - [X] Graphics
   - [X] Form Handling
   - [X] Lobby Redirection after successful register
- [X] Lobby
   - [X] Graphics
   - [X] *Lobby chat
   - [X] Logged in players list
   - [X] Logout handling
   - [X] Launch game mechanism
- [X] Game
    - [X] Game Rules Implementation
    - [X] Checkers board graphics
    - [X] Integration between rules and graphics
    - [X] Give up/Quit Button
    - [X] Lobby Redirection after button click

