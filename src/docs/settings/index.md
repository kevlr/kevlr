---
layout: default
---

# Settings

## Variables

Variables are all in the `settings` folder.

### Layout

```sass
$layouts-name:                ( 'main',     's',        'm',        'l'        );
$layouts-break-point:         ( 0,          500px,      800px,      1000px     );
$layouts-columns-number:      ( 12,         12,         12,         12         );
$layouts-column-gutter:       ( 24px,       36px,       48px,       60px       );
$layouts-container-max-width: ( none,       none,       none,       1200px     );
```

## Mixins

Kevlr comes with a few mixins that will help you to develop faster and make your website more responsive.

### media-query

```sass
@include media-query(from, [until]);
```

**from**

string: should be one of the `$layouts-name`. In this case `'s'`, `'m'` or `'l'`.

**till** (optional)
