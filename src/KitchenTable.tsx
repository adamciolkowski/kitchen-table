import * as React from "react";
import SortableColumnDecorator from "./SortableColumnDecorator";
import {Column} from "./Column";
import {Row} from "./Row";
import {SortOrder} from "./SortOrder";
import flatMap = require("lodash/flatMap");
import identity = require("lodash/identity");
import isFunction = require("lodash/isFunction");
import noop = require("lodash/noop");
import orderBy = require("lodash/orderBy");
import times = require("lodash/times");
import sum = require("lodash/sum");

type RowCallback = (row: Row, rowIndex: number, event: Event) => void;

interface Props {
    columns: Column[],
    data: Row[],
    sortable?: boolean,
    onSortEnd?: (column: Column, order: SortOrder) => void,
    fixedHeader?: boolean,
    rowProps?: RowProps
}

interface RowProps {
    className?: (row: Row) => string,
    onClick?: RowCallback,
    onMouseEnter?: RowCallback,
    onMouseLeave?: RowCallback
}

interface State {
    sortColumn: Column,
    sortOrder: SortOrder
}

export default class KitchenTable extends React.Component<Props, State> {

    private static defaultProps: Partial<Props> = {
        fixedHeader: false,
        sortable: false,
        onSortEnd: noop,
        rowProps: {}
    };

    private table: HTMLTableElement;
    private thead: HTMLTableSectionElement;

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

        function getHeaderRowSpan(columns: Column[], level: number) {
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

        function columnsFor(level: number) {
            let columns = this.props.columns;
            times(level, () => {
                columns = flatMap(columns, c => c.subColumns).filter(sc => sc);
            });
            return columns;
        }
    }

    renderHeaderCells(columns: Column[], rowSpan: number) {
        return columns.map((column, idx) => this.renderHeaderCell(column, rowSpan, idx));
    }

    renderHeaderCell(column: Column, rowSpan, idx) {
        let isSortable = this.props.sortable && !column.subColumns;
        return (
            <th {...this.headerCellProps(column, rowSpan, idx, isSortable)}>
                {this.renderHeaderCellContent(column, isSortable)}
            </th>
        );
    }

    renderHeaderCellContent(column, isSortable) {
        let title = isFunction(column.title) ? column.title() : column.title;
        if (isSortable) {
            return (
                <SortableColumnDecorator
                    isSorted={column === this.state.sortColumn}
                    sortOrder={this.state.sortOrder}
                >
                    {title}
                </SortableColumnDecorator>
            );
        }
        return title;
    }

    headerCellProps(column: Column, rowSpan, idx, isSortable: boolean) {
        return {
            key: idx,
            className: isSortable ? 'KitchenTable-sortable' : null,
            rowSpan: column.subColumns ? 1 : rowSpan,
            colSpan: getColSpan(column),
            onClick: isSortable ? () => this.onHeaderCellClick(column) : null
        };

        function getColSpan(column: Column) {
            let subColumns = column.subColumns;
            if(!subColumns)
                return 1;
            return sum(subColumns.map(getColSpan));
        }
    }

    onHeaderCellClick(column: Column) {
        let order = this.sortOrder(column);
        this.setState({sortColumn: column, sortOrder: order}, () => {
            this.props.onSortEnd(column, order);
        });
    }

    sortOrder(column: Column): SortOrder {
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

    getRows(): Row[] {
        if (this.props.sortable && this.state.sortColumn) {
            return orderBy(this.props.data, this.state.sortColumn.field, this.state.sortOrder);
        }
        return this.props.data;
    }

    renderRow(row: Row, idx) {
        let props = this.props.rowProps;
        let rowProps = {
            key: idx,
            className: props.className ? props.className(row) : null,
            onClick: delegate(props.onClick, row, idx),
            onMouseEnter: delegate(props.onMouseEnter, row, idx),
            onMouseLeave: delegate(props.onMouseLeave, row, idx)
        };
        return (
            <tr {...rowProps}>
                {this.props.columns.map((column, idx) => {
                    return this.renderColumnCells(row, column, idx);
                })}
            </tr>
        );

        function delegate(callback: RowCallback, row, idx) {
            return callback ? e => callback(row, idx, e) : null;
        }
    }

    renderColumnCells(row: Row, column: Column, idx) {
        if(column.subColumns) {
            return column.subColumns.map((sc, i) => this.renderCell(row, sc, i));
        }
        return this.renderCell(row, column, idx);
    }

    renderCell(row, column: Column, idx) {
        let style = column.style && column.style(this.rawCellValue(row, column), row);
        return (
            <td
                key={idx}
                style={style}
                className={this.className(row, column)}
            >{this.displayedCellValue(row, column)}</td>
        );
    }

    className(row, column: Column) {
        if(isFunction(column.className)) {
            return column.className(this.rawCellValue(row, column), row);
        }
        return column.className;
    }

    displayedCellValue(row, column: Column) {
        let rawValue = this.rawCellValue(row, column);
        if (rawValue === null) {
            return this.defaultCellValue(column);
        }
        let renderer = column.renderer || identity;
        return renderer(rawValue, row);
    }

    defaultCellValue(column: Column) {
        if (isFunction(column.defaultValue)) {
            return column.defaultValue();
        }
        return column.defaultValue;
    }

    rawCellValue(row: Row, column: Column) {
        if(isFunction(column.field)) {
            return column.field(row);
        }
        return row[column.field];
    }
}
