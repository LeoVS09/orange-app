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
This project implements best practices of organisation Vue project structure. 
So project structure can be used for you project

---
- api - client API layer, all communication with server must be encapsulated
- authentication - authentication layer of app  
- router - Define routing between pages, based on url
- components - Simple vue components without business logic and vuex. 
This components can be simply copied to another project without problems.
   - mixins - Vue abstract shared logic used on multiple components
   - decorators - Vue decorators, which extend vue-property-decorator library
   - icons - Different icons components
   - filter - Vue filters, can be used inside html templates
- containers - Business logic components, can use vuex and project subject matter types
- layouts - Base template pages which have router views
- pages - Different pages of app
- static - static content of app, images, fonts, other...
- store - modules of Vuex store
   - CrudModule - base CRUD module for simple data communication
- styles - SCSS styles of app
   - config.scss - store for all variables used in app
   - default.scss - base styles for app
   - mixins - scss mixins used in app
- utils - function used in app
- App.vue - base vue template
- index.ts - enter point of application
- translations.ts - file which define translation for text used in interface

## LazyDB

This project use LazyDB for data management

Warn: LazyDB don't allow use `_` and `$` as start symbols for id
