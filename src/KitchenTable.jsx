import React, {Component} from "react";
import PropTypes from "prop-types";
import identity from "lodash/identity";
import isFunction from "lodash/isFunction";
import "./KitchenTable.scss";

export default class KitchenTable extends Component {

    render() {
        return (
            <table className="KitchenTable">
                {this.renderHead()}
                {this.renderBody()}
            </table>
        );
    }

    renderHead() {
        return (
            <thead>
            <tr>
                {this.props.columns.map((column, idx) => {
                    let title = isFunction(column.title) ? column.title() : column.title;
                    return <th key={idx}>{title}</th>;
                })}
            </tr>
            </thead>
        );
    }

    renderBody() {
        return <tbody>{this.renderRows()}</tbody>;
    }

    renderRows() {
        return this.props.data.map(this.renderRow.bind(this));
    }

    renderRow(row, idx) {
        return (
            <tr key={idx}>
                {this.props.columns.map((column, idx) => {
                    return this.renderCell(row, column, idx);
                })}
            </tr>
        );
    }

    renderCell(row, column, idx) {
        return (
            <td
                key={idx}
                className={this.className(row, column)}
            >{this.displayedCellValue(row, column)}</td>
        );
    }

    className(row, column) {
        if(isFunction(column.className)) {
            return column.className(this.rawCellValue(row, column), row);
        }
        return column.className;
    }

    displayedCellValue(row, column) {
        let rawValue = this.rawCellValue(row, column);
        if (rawValue === null) {
            return this.defaultCellValue(column);
        }
        let renderer = column.renderer || identity;
        return renderer(rawValue, row);
    }

    defaultCellValue(column) {
        if (isFunction(column.defaultValue)) {
            return column.defaultValue();
        }
        return column.defaultValue;
    }

    rawCellValue(row, column) {
        if(isFunction(column.field)) {
            return column.field(row);
        }
        return row[column.field];
    }
}

KitchenTable.column = PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    renderer: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
});

KitchenTable.propTypes = {
    columns: PropTypes.arrayOf(KitchenTable.column).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
};
