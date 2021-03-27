# Front-end part of Too Good To Go Polska application

Web application created with Spring + Angular + MySQL

### Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Credentials](#credentials)
 
## General info

Too Good To Go Polska is the web application enabling more efficient using Too Good To Go - the mobile application whose aim is to prevent the waste of food.

It provides an easy and intuitive review system with which users can share their experiences and helpful information with tools that are not included in official Too Good To Go application.

The application is secured with Spring Security and JWT. It uses Google Maps API to provide clear and practical data representation added by users.

## Technologies

Spring Boot, Spring Security, JWT, Hibernate, Maven, Angular, Bootstrap, MySQL

## Setup

To get access to the application you can:

a) Clone **tgtg-angular** and [**tgtg-spring**](https://github.com/PatrykLeczycki/tgtg-spring-boot) repositories and open them in your IDE. Required: 
* MySQL database - configuration must match the one provided in [application.properties file](https://github.com/PatrykLeczycki/tgtg-spring-boot/blob/main/src/main/resources/application.properties) 
* Tomcat 9
* Lombok library [edge version](https://projectlombok.org/download-edge)

b) Visit http://pleczycki.pl/tgtg-polska

## Features

* User management (Spring Security, JWT - if user wants to confirm registration or change the password he needs to provide a token sent to his e-mail address)
* Entities - review, location
* User can add locations and write reviews of packages received in these locations (photos multiupload included)
* User can browse through the list of his reviews
* User can add location to the blacklist
* User can check all existing locations on Google Maps map

## Credentials

To add new location or write a review, user must be registered and logged in. To skip this process you can anter provided credentials:

* **E-mail address:** admin@admin
* **Password:** admin123
