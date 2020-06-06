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

---

## Under the hood

This project use **LazyDB** for data management

LazyDB credo:
> Will do it when time come...

LazyDB transforms this

```jsx

render() {
   const model = CityRepository.findOne(this.props.id)

   return (
      <div>
         <h1>{model.name}</h1>
         <p>{model.description}</p>
         <div>created {model.createdAt}</div>
      </div>
   )
}
```

into this

```gql

query Country($id: UUID) {
   country(id: $id) {
      name
      description
      createdAt
   }
}

```

LazyDB allow track model state

```jsx

render() {
   const model = CityRepository.findOne(this.props.id)

   if(isReading(model))
      return <Loader />

   return (
      ...
   )
}

```

Model states calulates reactivly based on the events which was emitted from model

Supported states out of the box:

* `isReading` - The model is currently loading (read request sended to the server)
* `isHaveReadingError` - The model is have read error
* `isChanged` - The model is was changed
* `isHaveValidationError` - The model is have validation error
* `isUpdating` - The model is currently updating (update requiest sended to the server)
* `isHaveUpdatingError` - The model is have update error
* `isNew` - The model is newly created, but was not sended to the server
* `isCreating` - The model is currently creating (create request was send to server)
* `isHaveCreatingError` - The model is have create error
* `isDeleting` - The model is currently deleting (delete request was sent to server)
* `isHaveDeletingError` - The model is have delete error
* `isDeleted` - The model is was deleted
* `isPending` - Model is in process of reading, or creating, or updating, or deleting
* `isHaveError` - The model is have any type of error (read, create, update, delete), except validation
* `isSynced` - The model is not changed and not in process

Warn: LazyDB don't allow use `_` and `$` as start symbols for id


