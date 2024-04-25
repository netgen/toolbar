## Installation

To add the Netgen Toolbar to your Symfony project, use Composer for easy installation. Run the following command:

```bash
composer require netgen/toolbar
```

## Building the Project Assets

The Netgen Toolbar comes with its own set of assets. To build these assets for development or production environments, use the following commands:

- For development:

```bash
    pnpm run dev
```

- For production:

```bash
    pnpm run prod
```

## Usage

### Integration into Templates

To use the Netgen Toolbar in your project, include it in your base template or page layout directly after opening `<body>` tag. Here is a basic example:

```twig
    {% include "@NetgenToolbar/ngtoolbar.html.twig" %}
```

### Adjusting for Additional Elements

If your layout includes elements like a sticky header that should be offset by the toolbar's height, you can specify additional CSS selectors. By default, only `#page` is adjusted. Here's how to include a sticky header in the offset calculation:

```twig
    {% include "@NetgenToolbar/ngtoolbar.html.twig" with {
        offset_selectors: [".site-header-sticky", "#page"]
    } %}
```

To specify that no elements should be offset, pass an empty array:

```twig
    {% include "@NetgenToolbar/ngtoolbar.html.twig" with {
        offset_selectors: []
    } %}
```

## Custom Adjustments Using CSS

For additional custom adjustments, a CSS variable `--ngtoolbar-height` is provided and can be used throughout your projects CSS as needed.

## How to mark elements that should be editable?

Each component or item that is supposed to be editable has to have 2 data paramteras with content id location it and one unique data paramtera that indicates if its a component or item.

```html
<article data-item="true" data-content-id="43" data-location-id="23">
  <!-- Your content here -->
</article>
```

or

```html
<article data-componenet="true" data-content-id="43" data-location-id="23">
  <!-- Your content here -->
</article>
```

### Helper Macro for Data Parameters

The bundle includes a helper macros for adding necessary data parameters to components and items. First, import the macro into your template:

```twig
    {% import "@NetgenToolbar/macros/admin_url_params.html.twig" as toolbar_macros %}
```

Then, use it as follows:

- block item view types:

```twig
    <article {{ toolbar_macros.item_params(content, location) }}>
        <!-- Your content here -->
    </article>
```

Rendered html:

```html
<article data-item="true" data-content-id="43" data-location-id="23">
  <!-- Your content here -->
</article>
```

- components:

```twig
    <div {{ toolbar_macros.component_params(block) }}>
        <!-- Your content here -->
    </div>
```

Rendered html:

```html
<article data-component="true" data-content-id="43" data-location-id="23">
  <!-- Your content here -->
</article>
```

## Visibility Conditions

The toolbar is displayed only to authenticated users who have the `IS_AUTHENTICATED_REMEMBERED` role, ensuring that only authorized users can access toolbar functionalities.
