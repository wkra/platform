[titleEn]: <>(Write your own storefront JavaScript plugin)
[metaDescriptionEn]: <>(This HowTo will give an example of writing an own JavaScript plugin for the storefront.)

## Overview

If you want to add interactivity to your storefront you probably have to write your own JavaScript plugin.
This HowTo will guide you through the process of writing and registering your own JavaScript plugins.
You will write a plugin that simply checks if the user has scrolled to the bottom of the page and then creates an alert.
For basic information on how to load own JavaScript or styles from plugins, take a look at this [HowTo](./330-storefront-assets.md).

## Writing a JavaScript plugin

Storefront JavaScript plugins are vanilla JavaScript ES6 classes that extend from our Plugin base class.
For more background information on JavaScript classes, take a look [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
To get started create a `Resources/storefront/example-plugin` folder and put an `example-plugin.plugin.js` file in there.
Inside that file create and export a ExamplePlugin class that extends the base Plugin class:

```js
import Plugin from 'src/script/plugin-system/plugin.class';

export default class ExamplePlugin extends Plugin {
}
```

Each Plugin has to implement the `init()` method. This method will be called when your plugin gets initialized and is the entrypoint to your custom logic.
In your case you add an callback to the onScroll event from the window and check if the user has scrolled to the bottom of the page. If so we display an alert.
Your full plugin now looks like this:

```js
import Plugin from 'src/script/plugin-system/plugin.class';

export default class ExamplePlugin extends Plugin {
    init() {
        window.onscroll = function() {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                alert('seems like there\'s nothing more to see here.');
            }
        };
    }
}
```

## Registering your plugin

Next you have to tell Shopware that your plugin should be loaded and executed. Therefore you have to register your plugin in the PluginManager.
Create a `main.js` file inside your `Resources/storefront` folder and get the PluginManager from the global window object. 
Then register your own plugin:

```js
// Import all necessary Storefront plugins and scss files
import ExamplePlugin from './example-plugin/example-plugin.plugin';

// Register them via the existing PluginManager
const PluginManager = window.PluginManager;
PluginManager.register('ExamplePlugin', ExamplePlugin);
```

You also can bind your plugin to an DOM element by providing an css selector:

 ```js
 // Import all necessary Storefront plugins and scss files
 import ExamplePlugin from './example-plugin/example-plugin.plugin';
 
 // Register them via the existing PluginManager
 const PluginManager = window.PluginManager;
 PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');
 ```

In this case the plugin just gets executed if the HTML document contains at least one element with the `data-scroll-detector` attribute.
You could use `this.el` inside your plugin to access the DOM element your plugin is bound to.

Lastly you have to add a small code snippet for the HotModuleReload server to work with your custom plugins, so your full `main.js` file now looks like this:

```js
// Import all necessary Storefront plugins and scss files
import ExamplePlugin from './example-plugin/example-plugin.plugin';

// Register them via the existing PluginManager
const PluginManager = window.PluginManager;
PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]');

// Necessary for the webpack hot module reloading server
if (module.hot) {
    module.hot.accept();
}
```

## Loading your plugin

You bound your plugin to the css selector "[data-example-plugin]" so you have to add DOM elements with this attribute on the pages you want your plugin to be active.
Therefore create an `views/page/content/folder` and create an `index.html.twig` template.
Inside this template extend from the `@Storefront/page/content/index.html.twig` and overwrite the `base_main_inner` block.
After the parent content of the blog add an template tag that has the `data-example-plugin` attribute.
For more information on how template extension works, take a look [here](./250-extending-storefront-block.md).

```twig
{% sw_extends '@Storefront/page/content/index.html.twig' %}

{% block base_main_inner %}
    {{ parent() }}

    <template data-example-plugin></template>
{% endblock %}
```

With this template extension your plugin is active on every content page, like the homepage or category listing pages.

## Configuring your plugins

You can configure your plugins from inside the templates via data-options.
Define a static `options` object inside your plugin and assign your options with default values to it.
In your case define a text option and as a default value use the text you previously directly prompted to the user.
And instead of the hard coded string inside the `alert()` use your new option value.

```js
import Plugin from 'src/script/plugin-system/plugin.class';

export default class ExamplePlugin extends Plugin {
    static options = {
        /**
         * Specifies the text that is prompted to the user
         * @type string
         */
        text: 'seems like there\'s nothing more to see here.',
    };

    init() {
        const that = this;
        window.onscroll = function() {
            if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
                alert(that.options.text);
            }
        };
    }
}
```

Now you are able to override the text that is prompted to the user from inside your templates.
Therefore create an `product-detail` folder inside your `views/page` folder and add an `index.html.twig` file inside that folder.
In your template extend from `@Storefront/page/product-detail/index.html.twig` and override the `page_product_detail_content`.
After the parent content add an template tag with the `data-example-plugin` tag also to activate your plugin on product detail pages.
Next add an `data-{your-plugin-name-in-kebab-case}-options` (`data-example-plugin-options`) attribute to the DOM element you registered your plugin on (the template tag).
As the value of this attribute use the options you want to override as a json object.

```twig
{% sw_extends '@Storefront/page/product-detail/index.html.twig' %}

{% block page_product_detail_content %}
    {{ parent() }}

    <template data-example-plugin data-example-plugin-options='{ "text": "Are you not interested in this product?" }'></template>
{% endblock %}
```

## Configuring your plugins script path

This can be ignored if you are on version 6.0.0 EA2 or newer. 

You have to tell Shopware where your bundled .js files live, therefore you can implement the `getStorefrontScriptPath()` in your plugin base class.
By default Shopware will bundle your JavaScript files and put them under `Resources/dist/storefront/js` during the build of the storefront.

```php
<?php declare(strict_types=1);

namespace Swag\JsPlugin;

use Shopware\Core\Framework\Plugin;

class JsPlugin extends Plugin
{
    public function getStorefrontScriptPath(): string
    {
        return 'Resources/dist/storefront/js';
    }
}
```

With version 6.0.0 EA2 the `Resources/dist/storefront/js` is the default path where shopware looks for your js files.

## Testing your changes

To see your changes you have to build the storefront. Use the `/psh.phar storefront:build` command and reload your storefront.
If you now scroll to the bottom of your page an alert should appear.

## Source

There's a GitHub repository available, containing this example source.
Check it out [here](https://github.com/shopware/swag-docs-js-plugin).


