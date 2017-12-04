# Road ID Notes -  Testing Changes

#Path to
```
"devDependencies": {
    "@shopify/slate-tools": "git+https://git@github.com/roadid/slate-tools.git#bef040fae8dd7588670fd49c9b77025000b5f93f",
```
Change from Path of your Shopify Theme
    "@shopify/slate-tools": "file:C:\\Code\\GitHub\\slate-tools",

From your shop Theme remove the previous version, NOTE: you will need to do this after every code change you want to test.
Remove-Item ".\node_modules\@shopify\slate-tools\" -Recurse -Force -ErrorAction:SilentlyContinue

npm install

after making a change to slate-tools run
npm prepublish



# @shopify/slate-tools
[![CircleCI](https://circleci.com/gh/Shopify/slate-tools.svg?style=svg&circle-token=0b8147527ef88134b4238064a563ceaaae98f06a)](https://circleci.com/gh/Shopify/slate-tools)

Tooling for Shopify themes using [Slate](https://github.com/Shopify/slate).

Best used in conjunction with the [Slate CLI](https://www.npmjs.com/package/@shopify/slate) package.

## Installation
```bash
$ npm install @shopify/slate-tools
```

## Documentation

For full API documentation checkout the [API docs](https://shopify.github.io/slate/).

## Contributing
For help on setting up the repo locally, building, testing, and contributing
please see [CONTRIBUTING.md](https://github.com/Shopify/slate-tools/blob/master/CONTRIBUTING.md).

## Code of Conduct
All developers who wish to contribute through code or issues, take a look at the
[CODE_OF_CONDUCT.md](https://github.com/Shopify/slate-tools/blob/master/CODE_OF_CONDUCT.md).

## License

MIT, see [LICENSE.md](http://github.com/Shopify/slate-tools/blob/master/LICENSE.md) for details.

<img src="https://cdn.shopify.com/shopify-marketing_assets/builds/19.0.0/shopify-full-color-black.svg" width="200" />
