# orange-app
Front app for Saint-Petersburg University of Telecommunications programming olympiad system

## Requirements
- node v8.4.1

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# start production server at port 80
npm run server
```

## TODO
* Auto-load graphql schema and rebuild application (auto-exported schema contain all data
in "data" field, need fix!)

## Project structure
This project implements best practices which have been tested on practice. So project structure can be used for you project

---

- components - Simple vue components without business logic and vuex. 
This components can be simply copied to another project without problems.
   - mixins - Vue abstract shared logic used on multiple components
- containers - Business logic components, can use vuex and project subject matter types
   - pages - Base template pages which have router views
   - view - Routed views implement pages or logically separate page part
   - content - Vue simple components which have sense only for project
