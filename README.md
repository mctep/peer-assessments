# Peer Assessment Web Application

## Development

```bash
$ git clone https://github.com/mctep/peer-assessments.git
$ cd peer-assessments
$ meteor npm install
$ typings install
$ npm start
```

## Problems and TODOS

* Dig in to Semantic UI form serialization
* I could not to use `meteor-simple-schema` with typings.
* May be it better to use JSON-schema validation.
* It is better to use some form builder for React. But I have not found any that statisfied me.
* Try to `recompose` in the future
* Think about fetching single element (`userForAssessment` publication)
* I have not put work `meteor-css-modules` and `typed-css-modules` together.
* Link font files like webpack. I had to use Semantic UI CDN instead of `semantic-ui-css`.
* Research more about subscribtion error handling
* Drag'n'Drop subject cards
* Strange bug in chrome. On `/users` page enter to main input some text, click on `Add User` button, press `Escape` after modal shown, the button dissapeares.
* Handle async opertations with cancellable promises has edge-cases when remount waiting components.
