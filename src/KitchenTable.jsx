import React, {Component} from "react";
import PropTypes from "prop-types";
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
                    return <th key={idx}>{column.title}</th>;
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
                    return this.renderCell(row[column.field], idx);
                })}
            </tr>
        );
    }

    renderCell(value, idx) {
        return <td key={idx}>{value}</td>;
    }
}

const column = PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired
}));

KitchenTable.propTypes = {
    columns: column.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired
};
