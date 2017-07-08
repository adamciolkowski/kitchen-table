# KitchenTable

Simple and extensible React table component.

### Installation

Using npm:

`$ npm install kitchen-table --save`

### Example

```
import React from "react";
import ReactDOM from "react-dom";
import KitchenTable from "kitchen-table";

let cities = [
    {rank: 1, city: 'Shanghai', population: 24256800},
    {rank: 2, city: 'Beijing', population: 21516000},
    {rank: 3, city: 'Delhi', population: 16787941},
    // more omitted
];

let columns = [
    {title: 'Rank', field: 'rank'},
    {title: 'City', field: 'city'},
    {title: 'Population', field: 'population'}
];

ReactDOM.render(
    <KitchenTable columns={columns} data={cities}/>,
    document.getElementById('table')
);
```

### License

MIT
