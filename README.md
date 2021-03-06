# KitchenTable

Extensible table table component for React.

### Installation

##### Using npm:

`$ npm install kitchen-table --save`

##### Using plain JavaScript:

1. Clone the repository and build the project to get the latest version: 

```
$ git clone https://github.com/adamciolkowski/kitchen-table
$ npm install
$ npm run build
```

2. Include `dist/KitchenTable.js` file in your project.

### Usage

Component takes the following parameters:
- `data` an array of objects - each corresponding to one row in the table,
- `columns` an array of objects - containing configuration for columns.
- `fixedHeader` boolean specifying if table header should be fixed. Defaults to `false`.
- `sortable` boolean specifying if table can be sorted. Defaults to `false`. Only columns that contain no sub-columns 
can be sorted.
- `onSortEnd` function called every time table is sorted. It has 2 arguments: column that was sorted, and 
sort order ('asc', 'desc').
- `rowProps` properties to be applied on every row in a table. See [Row properties](#row-properties)

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

- `style`

A function that returns `CSSProperties` object representing inline styles that will be applied to cell. 
The function takes 2 parameters: cell value and row.

```javascript
let columns = [
    // ...
    {
        title: 'City',
        field: 'city',
        style: (value, row) => {
            return {backgroundColor: row.color};
        }
    },
    // ...
];
```

- `subColumns`

An array of column definitions. The columns will be rendered as sub-columns.

```javascript
let columns = [
    // ...
    {
        title: 'Population',
        subColumns: [
            {
                title: 'City proper',
                field: 'cityProper'
            },
            {
                title: 'Metropolitan area',
                field: 'metropolitanArea'
            }
        ]
    },
    // ...
];
```

- `freeze`

Boolean value that determines if column should be frozen. It makes column visible when vertical scroll is used. 
Default is false.

```javascript
let columns = [
    {
        title: 'City',
        field: 'city',
        freeze: true
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
    <KitchenTable 
        sortable={true}
        columns={columns} 
        data={cities}
    />,
    document.getElementById('table')
);
```

#### Row properties
- `className` function that returns a css class to be applied on table rows. It takes one argument: table row.
- `onClick` function called whenever table row is clicked. It has 3 arguments: row, zero-based row index 
and event object.
- `onMouseEnter` function called whenever a `mouseenter` event is triggered on row. It has 3 arguments: row, zero-based row index 
and event object.
- `onMouseLeave` function called whenever a `mouseleave` event is triggered on row. It has 3 arguments: row, zero-based row index 
and event object.


### Styles

In all the tables I've worked with I had to fiddle with and override default styles to match styling 
of other components on a page. This is the reason why KitchenTable comes with no built-in styles. 
You can easily use your own or use one from examples. 

### Fixed header and borders

Fixed header is implemented by applying transformation on table header.
When the table has `border-collapse` property set to `collapse` then the table and it's header share borders.
When table is scrolled only header cells are fixed, their borders staying with the table.
To remedy that borders need to be kept separate and styles have to be applied to cells individually.

### License

MIT
