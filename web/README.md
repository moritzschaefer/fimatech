# The fimatec client application.

## Installation
Installation of development environment:
```
npm install
bower install
```

Installation of html2canvas:
Navigate to `bower_components/html2canvas` and then execute
```
npm install
grunt
```

Starting the development environment:
```
gulp
```

Starting a development build - with combined CSS and JS:
```
gulp development
```

Starting a production build - with combined and minified CSS and JS:
```
gulp production
```

Starting a release build - with combined and minified CSS and JS. New directory will be created with only necessary files:
```
gulp release
```
