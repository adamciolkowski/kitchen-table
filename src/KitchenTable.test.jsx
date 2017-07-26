import chai, {expect} from "chai";
import React from "react";
import TestUtils from "react-dom/test-utils";
import KitchenTable from "./KitchenTable.jsx";

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
    );

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
    );

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
    );

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
    );

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
    );

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
    );

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
    );

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
    );

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
    );

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
    );

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
            onRowClick={handleRowClick}
        />
    );

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
    );

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
            onRowMouseEnter={handleMouseEnter}
        />
    );

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
            onRowMouseLeave={handleMouseLeave}
        />
    );

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
            rowClass={city => city.country === 'China' ? 'highlighted' : null}
        />
    );

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
    );
    let headerCells = TestUtils.scryRenderedDOMComponentsWithTag(component, 'th');
    expect(headerCells[0].rowSpan).to.equal('2');
    expect(headerCells[0].colSpan).to.equal('1');
    expect(headerCells[1].rowSpan).to.equal('1');
    expect(headerCells[1].colSpan).to.equal('2');

    expect(headerCells[2].rowSpan).to.equal('1');
    expect(headerCells[2].colSpan).to.equal('1');
    expect(headerCells[3].rowSpan).to.equal('1');
    expect(headerCells[3].colSpan).to.equal('1');
});
