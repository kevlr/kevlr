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
@include media-query(from[, until]);
```

**from**: *string*

Should be one of the `$layouts-name`. In this case `'s'`, `'m'` or `'l'`.

**until**: *string* (optional)

Should be one of the `$layouts-name`. In this case `'s'`, `'m'` or `'l'`. If ommited the properties will be applied to all layout above the first mentioned.

#### Description

Being mobile first the **from** value will always output a `min-width` rule and the second one a `max-width` rule.

#### Example

```sass
@include media-query('s', 'm') {
  font-size: 16px;
}
```

output:

```css
@media only screen and (min-width: 500px) and (max-width: 799px) {
  font-size: 16px;
}
```

### responsive

```sass
@include responsive(property, value[, multiplier][, adder][, suffix]);
```

**property**: *string*

Any css property

**value**: *value* or *map*

Could be a simple value or a map with layout name as key and the property value you want for that layout as value.

**multiplier**: *integer* or *map* (optional)

Will multiply each **value** by this integer. Could be an integer or a map with layout name as key and integer as value.

**adder**: *units* (optional)

Will add this value to the result for each layout

**suffix**: *string* (optional)

Will add a string at the end of the result for each layout. That could be usefull if you need to add an `!imporant` for example.

#### Description



#### Example

```sass
$units: (
  'main': 10px,
  's': 15px,
  'm': 20px,
  'l': 25px
);
@include responsive('margin-left', $units, 2);
```

output:

```css
margin-left: 20px;
@media only screen and (min-width: 500px) {
  margin-left: 30px;
}
@media only screen and (min-width: 800px) {
  margin-left: 40px;
}
@media only screen and (min-width: 1000px) {
  margin-left: 50px;
}
```

#### Bonus

To avoid repeating too many `@media` rules you can chain the responsive mixin in a list

```sass
@include responsive(
  (property, value[, multiplier][, adder][, suffix]),
  (property, value[, multiplier][, adder][, suffix]),
  ...
);
```
