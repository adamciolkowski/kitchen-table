# KitchenTable

Extensible table table component for React.

### Installation

Using npm:

`$ npm install kitchen-table --save`

### Usage

Component takes the following parameters:
- `data` an array of objects - each corresponding to one row in the table,
- `columns` an array of objects - containing configuration for columns.
- `fixedHeader` boolean specifying if table header should be fixed. Defaults to `false`.

#### Column properties

- `title`

Defines header value for the column.
Can be a string or a function. The function can return anything React can render (numbers, strings, elements 
or an array containing these types).

```javascript
let columns = [
    {
        title: 'City',
        // ...
    },
    {
        title: () => ['Total area (km', <sup>2</sup>, ')'],
        // ...
    },
    // ...
];
```

- `field`

Defines which property of the corresponding object will be used as value in cells.
Can be a string or a function that extracts a property from row object.

```javascript
let columns = [
    {
        field: 'rank',
        // ...
    },
    {
        field: city => city.name
    },
    // ...
];
```


- `renderer`

Allows to supply custom cell renderer. This can be used for formatting or displaying non-text content (i.e. images).
The return value can be anything React can render.

This parameter is optional. Defaults to identity function.

```javascript
let columns = [
    // ...
    {
        title: 'Population',
        field: 'population',
        renderer: value => value.toLocaleString('en-US')
    },
    // ...
];
```

- `defaultValue`

Specifies text to display if value for the cell is `null`. 
Can be a string or a function. The function can return anything React can render.
This parameter is optional.

```javascript
let columns = [
    // ...
    {
        title: 'Metropolitan area',
        field: 'metropolitanArea',
        defaultValue: 'N/A'
    },
    // ...
];
```

- `className`

Defines CSS class that will be added on all cells in defined column.
Can be a string or a function for conditional formatting.

```javascript
let columns = [
    // ...
    {
        title: 'Population',
        field: 'population',
        className: population => population > 20000000 ? 'large-city' : ''
    },
    // ...
];
```

### Complete example

```javascript
import React from "react";
import ReactDOM from "react-dom";
import KitchenTable from "kitchen-table";

let cities = [
    {rank: 1, name: 'Shanghai', population: 24256800, area: 6340.5, country: 'China'},
    {rank: 2, name: 'Beijing', population: 21516000, area: 16410.54, country: 'China'},
    {rank: 3, name: 'Delhi', population: 16787941, area: 1484, country: 'India'},
    {rank: 4, name: 'Karachi', population: 16126000, area: 3527, country: 'Pakistan'},
    // ...
];

let columns = [
    {
        title: 'Rank',
        field: 'rank'
    },
    {
        title: 'City',
        field: 'name'
    },
    {
        title: 'Population',
        field: 'population',
        className: 'cell-number',
        renderer: value => value.toLocaleString('en-US')
    },
    {
        title: () => ['Total area (km', <sup>2</sup>, ')'],
        field: 'area',
        className: 'cell-number',
        defaultValue: 'N/A',
        renderer: value => value.toLocaleString('en-US')
    },
    {
        title: 'Population density',
        field: city => city.population / city.area,
        className: 'cell-number',
        renderer: (area) => Math.round(area).toLocaleString('en-US')
    }
];

ReactDOM.render(
    <KitchenTable columns={columns} data={cities}/>,
    document.getElementById('table')
);
```

### Fixed header and borders

Fixed header is implemented by applying transformation on table header.
When the table has `border-collapse` property set to `collapse` then the table and it's header share borders.
When table is scrolled only header cells are fixed, their borders staying with the table.
To remedy that borders need to be kept separate and styles have to be applied to cells individually.

### License

MIT
