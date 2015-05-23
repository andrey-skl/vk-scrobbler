# VK Scrobbler

A Chrome extension to send playing tracks to last.fm library.

# Contributing

1. Install dependencies by `npm install --production`
2. Load extension as unpacked.
3. Make some changes, reload extension and test it.
4. Commit to your fork and send pull request

### To run tests

1. Install development dependencies by typing `npm install`. 
**Until this point**, you have to prepare build by runing `npm run copy` and then 
load unpacked extension from `dist` folder. Otherwise, Chrome makes a lot of warnings because of .pem certificates
in node_modules/*
2. Run `npm test` to test extension.
