import {expect} from "chai";
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
