import {expect} from "chai";
import * as React from "react";
import {Component} from "react";
import * as TestUtils from "react-dom/test-utils";
import KitchenTable from "./KitchenTable";
import map = require("lodash/map");

it('can render data in table', () => {
    let data = [
        {city: 'Shanghai', population: 24256800}
    ];
    const columns = [
        {title: 'City', field: 'city'},
        {title: 'Population', field: 'population'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let th = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');

    expect(th.length).to.equal(2);
    expect(th[0].textContent).to.equal('City');
    expect(th[1].textContent).to.equal('Population');

    let td = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');

    expect(td.length).to.equal(2);
    expect(td[0].textContent).to.equal('Shanghai');
    expect(td[1].textContent).to.equal('24256800');
});

it('can use custom renderer for cell', () => {
    const data = [{salary: 1500}];
    const columns = [{
        title: 'Salary',
        field: 'salary',
        renderer: amount => `$${amount}`
    }];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.textContent).to.equal('$1500');
});

it('can use values from the same row in custom renderer', () => {
    const data = [{salary: 1500, bonus: 100}];
    const columns = [
        {
            title: 'Salary',
            field: 'salary',
            renderer: (amount, row) => `$${amount} (+${row.bonus})`
        }
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.textContent).to.equal('$1500 (+100)');
});

it('can take function to determine which property will be used as cell value', () => {
    let data = [
        {city: 'Shanghai', population: 24256800}
    ];
    const columns = [
        {title: 'Population', field: row => row.population}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.textContent).to.equal('24256800');
});

it('can use default value for nulls', () => {
    const data = [{salary: null}];
    const columns = [{
        title: 'Salary',
        field: 'salary',
        defaultValue: 'N/A'
    }];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.textContent).to.equal('N/A');
});

it('can use function to determine default value for nulls', () => {
    const data = [{salary: null}];
    const columns = [{
        title: 'Salary',
        field: 'salary',
        defaultValue: () => <span className="unknown">N/A</span>
    }];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.innerHTML).to.equal('<span class="unknown">N/A</span>');
});

it('can set custom css class on cell', () => {
    const data = [{salary: 1500}];
    const columns = [{
        title: 'Salary',
        field: 'salary',
        className: 'highlighted'
    }];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.findRenderedDOMComponentWithTag(component, 'td');

    expect(td.className).to.equal('highlighted');
});

it('can take function to determine css class for cell', () => {
    const data = [{amount: 1001}, {amount: 123}];
    const columns = [{
        title: 'Amount',
        field: 'amount',
        className: amount => amount > 1000 ? 'red' : 'green'
    }];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');

    expect(td.length).to.equal(2);
    expect(td[0].className).to.equal('red');
    expect(td[1].className).to.equal('green');
});

it('can use values present in other columns to determine css class for cell', () => {
    const data = [{amount: 1001, type: 'bonus'}, {amount: 123, type: 'normal'}];
    const columns = [
        {
            title: 'Amount',
            field: 'amount',
            className: (amount, row) => row.type === 'bonus' ? 'bonus' : null
        }
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let td = TestUtils.scryRenderedDOMComponentsWithTag(component, 'td');

    expect(td.length).to.equal(2);
    expect(td[0].className).to.equal('bonus');
    expect(td[1].className).to.equal('');
});

it('can take function to determine header value', () => {
    let data = [
        {area: 6340.5}
    ];
    const columns = [
        {title: () => <span>Area</span>, field: 'area'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns}/>
    ) as Component;

    let th = TestUtils.findRenderedDOMComponentWithTag(component, 'th');

    expect(th.innerHTML).to.equal('<span>Area</span>');
});

it('can call a function when a row is clicked', done => {
    let data = [
        {city: 'Shanghai', area: 6340.5}
    ];
    const columns = [
        {title: 'Area', field: 'area'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable
            data={data}
            columns={columns}
            rowProps={{
                onClick: handleRowClick
            }}
        />
    ) as Component;

    let rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
    let firstDataRow = rows[1];
    TestUtils.Simulate.click(firstDataRow, {button: 0});

    function handleRowClick(row, rowIndex, event) {
        expect(row).to.deep.equal({city: 'Shanghai', area: 6340.5});
        expect(rowIndex).to.equal(0);
        expect(event.type).to.equal('click');
        done();
    }
});

it('does nothing on row click if row click callback is not defined', () => {
    let data = [
        {city: 'Shanghai', area: 6340.5}
    ];
    const columns = [
        {title: 'Area', field: 'area'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable
            data={data}
            columns={columns}
        />
    ) as Component;

    let rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
    let firstDataRow = rows[1];
    TestUtils.Simulate.click(firstDataRow);
});

it('can call a function when mouse enters row', done => {
    let data = [
        {city: 'Shanghai', area: 6340.5}
    ];
    const columns = [
        {title: 'Area', field: 'area'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable
            data={data}
            columns={columns}
            rowProps={{
                onMouseEnter: handleMouseEnter
            }}
        />
    ) as Component;

    let rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
    let firstDataRow = rows[1];
    TestUtils.Simulate.mouseEnter(firstDataRow, {button: 0});

    function handleMouseEnter(row, rowIndex, event) {
        expect(row).to.deep.equal({city: 'Shanghai', area: 6340.5});
        expect(rowIndex).to.equal(0);
        expect(event.type).to.equal('mouseenter');
        done();
    }
});

it('can call a function when mouse leaves row', done => {
    let data = [
        {city: 'Shanghai', area: 6340.5}
    ];
    const columns = [
        {title: 'Area', field: 'area'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable
            data={data}
            columns={columns}
            rowProps={{
                onMouseLeave: handleMouseLeave
            }}
        />
    ) as Component;

    let rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
    let firstDataRow = rows[1];
    TestUtils.Simulate.mouseLeave(firstDataRow, {button: 0});

    function handleMouseLeave(row, rowIndex, event) {
        expect(row).to.deep.equal({city: 'Shanghai', area: 6340.5});
        expect(rowIndex).to.equal(0);
        expect(event.type).to.equal('mouseleave');
        done();
    }
});

it('can apply css class on specific rows', () => {
    let data = [
        {city: 'Shanghai', country: 'China'},
        {city: 'Delhi', country: 'India'},
    ];
    const columns = [
        {title: 'City', field: 'city'}
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable
            data={data}
            columns={columns}
            rowProps={{
                className: city => city.country === 'China' ? 'highlighted' : null
            }}
        />
    ) as Component;

    let rows = TestUtils.scryRenderedDOMComponentsWithTag(component, 'tr');
    expect(rows[1].className).to.equal('highlighted');
    expect(rows[2].className).to.equal('');
});

it('can render sub-columns', () => {
    let data = [
        {city: 'Shanghai', cityProper: 24256800, urbanArea: 23416000},
        {city: 'Karachi', cityProper: 23500000, urbanArea: 25400000},
    ];
    const columns = [
        {title: 'City', field: 'city'},
        {
            title: 'Population',
            subColumns: [
                {title: 'City proper', field: 'cityProper'},
                {title: 'Urban area', field: 'urbanArea'}
            ]
        }
    ];
    const component = TestUtils.renderIntoDocument(
        <KitchenTable data={data} columns={columns} />
    ) as Component;
    let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th') as HTMLTableHeaderCellElement[];
    expect(headerCells[0].rowSpan).to.equal('2');
    expect(headerCells[0].colSpan).to.equal('1');
    expect(headerCells[1].rowSpan).to.equal('1');
    expect(headerCells[1].colSpan).to.equal('2');

    expect(headerCells[2].rowSpan).to.equal('1');
    expect(headerCells[2].colSpan).to.equal('1');
    expect(headerCells[3].rowSpan).to.equal('1');
    expect(headerCells[3].colSpan).to.equal('1');
});

describe('sorting', () => {
    it('does nothing on header cell click when sorting is disabled', () => {
        let data = [
            {letter: 'b'},
            {letter: 'a'},
            {letter: 'c'}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable data={data} columns={columns}/>
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        let firstHeaderCell = headerCells[0];
        TestUtils.Simulate.click(firstHeaderCell);

        expect(columnCellValues(component, 0)).to.deep.equal(['b', 'a', 'c']);
    });

    it('sorts table ascending when column header is clicked', () => {
        let data = [
            {letter: 'b'},
            {letter: 'a'},
            {letter: 'c'}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        let firstHeaderCell = headerCells[0];
        TestUtils.Simulate.click(firstHeaderCell);

        expect(columnCellValues(component, 0)).to.deep.equal(['a', 'b', 'c']);
    });

    it('sorts table descending when column header is clicked twice', () => {
        let data = [
            {letter: 'b'},
            {letter: 'a'},
            {letter: 'c'}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        let firstHeaderCell = headerCells[0];
        TestUtils.Simulate.click(firstHeaderCell);
        TestUtils.Simulate.click(firstHeaderCell);

        expect(columnCellValues(component, 0)).to.deep.equal(['c', 'b', 'a']);
    });

    it('sorts column ascending on header cell click when different column was previously sorted', () => {
        let data = [
            {letter: 'b', number: 1},
            {letter: 'a', number: 3},
            {letter: 'c', number: 2}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'},
            {title: 'Number', field: 'number'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        TestUtils.Simulate.click(headerCells[0]);
        TestUtils.Simulate.click(headerCells[1]);

        expect(columnCellValues(component, 1)).to.deep.equal(['1', '2', '3']);
    });

    it('adds `KitchenTable-sortable` class to sortable headers', () => {
        let data = [
            {letter: 'b'},
            {letter: 'a'},
            {letter: 'c'}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');

        expect(headerCells[0].className).to.equal('KitchenTable-sortable');
    });

    it("doesn't sort columns that contain sub-columns", () => {
        let data = [
            {letter: 'b', number: 1},
            {letter: 'a', number: 3},
            {letter: 'c', number: 2}
        ];
        const columns = [
            {
                title: 'Items',
                subColumns: [
                    {title: 'Letter', field: 'letter'},
                    {title: 'Number', field: 'number'}
                ]
            }
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        expect(headerCells[0].className).to.equal('');
    });

    it('triggers a callback on every sort', done => {
        let data = [
            {letter: 'b'},
            {letter: 'a'},
            {letter: 'c'}
        ];
        const columns = [
            {title: 'Letter', field: 'letter'}
        ];
        const component = TestUtils.renderIntoDocument(
            <KitchenTable
                data={data}
                columns={columns}
                sortable={true}
                onSortEnd={onSortEnd}
            />
        ) as Component;
        let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
        TestUtils.Simulate.click(headerCells[0]);

        function onSortEnd(column, order) {
            expect(column).to.deep.equal({title: 'Letter', field: 'letter'});
            expect(order).to.equal('asc');
            done();
        }
    });

    function columnCellValues(component, column) {
        let rows = TestUtils.findRenderedDOMComponentWithTag(component, 'table')
            .querySelectorAll('tbody tr');
        return map(rows, row => row.querySelectorAll('td')[column].textContent);
    }
});
