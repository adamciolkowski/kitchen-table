import React, {Component} from "react";
import PropTypes from "prop-types";
import flatMap from "lodash/flatMap";
import identity from "lodash/identity";
import isFunction from "lodash/isFunction";
import noop from "lodash/noop";
import times from "lodash/times";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import "./KitchenTable.scss";

export default class KitchenTable extends Component {

    constructor(props) {
        super(props);
        this.adjustHeaderPosition = this.adjustHeaderPosition.bind(this);
        this.state = {
            sortColumn : null,
            sortOrder: null
        };
    }

    componentDidMount() {
        if(this.props.fixedHeader) {
            let parent = this.table.parentElement;
            parent.addEventListener('scroll', this.adjustHeaderPosition);
        }
    }

    componentWillUnmount() {
        if(this.props.fixedHeader) {
            let parent = this.table.parentElement;
            parent.removeEventListener('scroll', this.adjustHeaderPosition);
        }
    }

    adjustHeaderPosition() {
        let parent = this.table.parentElement;
        this.thead.style.transform = `translateY(${parent.scrollTop}px)`;
    }

    render() {
        return (
            <table
                ref={table => {this.table = table;}}
                className="KitchenTable"
            >
                {this.renderHead()}
                {this.renderBody()}
            </table>
        );
    }

    renderHead() {
        return (
            <thead ref={thead => {this.thead = thead;}}>
            {this.renderHeaderRows()}
            </thead>
        );
    }

    renderHeaderRows() {
        let rowSpan = getHeaderRowSpan(this.props.columns, 1);
        return times(rowSpan).map(l => this.renderHeaderRow(l, rowSpan));

        function getHeaderRowSpan(columns, level) {
            let l = level;
            for(let i = 0; i < columns.length; i++) {
                let c = columns[i];
                if(c.subColumns) {
                    l = Math.max(l, getHeaderRowSpan(c.subColumns, level + 1));
                }
            }
            return l;
        }
    }

    renderHeaderRow(level, levels) {
        let columns = columnsFor.call(this, level);
        return (
            <tr key={level}>
                {this.renderHeaderCells(columns, levels - level)}
            </tr>
        );

        function columnsFor(level) {
            let columns = this.props.columns;
            times(level, () => {
                columns = flatMap(columns, c => c.subColumns).filter(sc => sc);
            });
            return columns;
        }
    }

    renderHeaderCells(columns, rowSpan) {
        return columns.map((column, idx) => this.renderHeaderCell(column, rowSpan, idx));
    }

    renderHeaderCell(column, rowSpan, idx) {
        let isSortable = this.props.sortable && !column.subColumns;
        return (
            <th {...this.headerCellProps(column, rowSpan, idx, isSortable)}>
                <div className="KitchenTable-header-wrapper">
                    <div className="KitchenTable-header-content">
                        {isFunction(column.title) ? column.title() : column.title}
                    </div>
                    {isSortable ? this.renderSortingArrows(column) : null}
                </div>
            </th>
        );
    }

    headerCellProps(column, rowSpan, idx, isSortable) {
        return {
            key: idx,
            className: isSortable ? 'KitchenTable-sortable' : null,
            rowSpan: column.subColumns ? 1 : rowSpan,
            colSpan: getColSpan(column),
            onClick: isSortable ? () => this.onHeaderCellClick(column) : null
        };

        function getColSpan(column) {
            let subColumns = column.subColumns;
            if(!subColumns)
                return 1;
            return sum(subColumns.map(getColSpan));
        }
    }

    renderSortingArrows(column) {
        let className = column === this.state.sortColumn ? 'KitchenTable-sort' : null;
        return (
            <div>
                {this.renderSortingArrow('up', this.state.sortOrder === 'asc' ? className : null)}
                {this.renderSortingArrow('down', this.state.sortOrder === 'desc' ? className : null)}
            </div>
        );
    }

    renderSortingArrow(suffix, className) {
        let classes = ['KitchenTable-arrow', `KitchenTable-${suffix}`, className];
        return <div className={classes.join(' ')}/>;
    }

    onHeaderCellClick(column) {
        let order = this.sortOrder(column);
        this.setState({sortColumn: column, sortOrder: order}, () => {
            this.props.onSortEnd(column);
        });
    }

    sortOrder(column) {
        if(column !== this.state.sortColumn) {
            return 'asc';
        }
        return this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    }

    renderBody() {
        return <tbody>{this.renderRows()}</tbody>;
    }

    renderRows() {
        let data = this.getRows();
        return data.map(this.renderRow.bind(this));
    }

    getRows() {
        if (this.props.sortable && this.state.sortColumn) {
            return orderBy(this.props.data, this.state.sortColumn.field, this.state.sortOrder);
        }
        return this.props.data;
    }

    renderRow(row, idx) {
        let rowProps = {
            key: idx,
            className: this.props.rowClass ? this.props.rowClass(row) : null,
            onClick: delegate(this.props.onRowClick, row, idx),
            onMouseEnter: delegate(this.props.onRowMouseEnter, row, idx),
            onMouseLeave: delegate(this.props.onRowMouseLeave, row, idx)
        };
        return (
            <tr {...rowProps}>
                {this.props.columns.map((column, idx) => {
                    return this.renderColumnCells(row, column, idx);
                })}
            </tr>
        );

        function delegate(callback, row, idx) {
            return callback ? e => callback(row, idx, e) : null;
        }
    }

    renderColumnCells(row, column, idx) {
        if(column.subColumns) {
            return column.subColumns.map((sc, i) => this.renderCell(row, sc, i));
        }
        return this.renderCell(row, column, idx);
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
    field: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    renderer: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    subColumns: PropTypes.array
});

KitchenTable.propTypes = {
    columns: PropTypes.arrayOf(KitchenTable.column).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortable: PropTypes.bool,
    onSortEnd: PropTypes.func,
    fixedHeader: PropTypes.bool,
    rowClass: PropTypes.func,
    onRowClick: PropTypes.func,
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func
};

KitchenTable.defaultProps = {
    fixedHeader: false,
    sortable: false,
    onSortEnd: noop
};
