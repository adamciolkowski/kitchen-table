import * as React from "react";
import {SortOrder} from "./SortOrder";
import "./SortableColumnDecorator.scss";

interface Props {
    isSorted: boolean,
    sortOrder: SortOrder
}

export default class SortableColumnDecorator extends React.Component<Props, {}> {

    render() {
        return (
            <div className="KitchenTable-header-wrapper">
                <div className="KitchenTable-header-content">
                    {this.props.children}
                </div>
                {this.renderSortingArrows()}
            </div>
        );
    }

    renderSortingArrows() {
        let className = this.props.isSorted ? 'KitchenTable-sort' : null;
        let isAscending = this.props.sortOrder === 'asc';
        return (
            <div className="KitchenTable-arrows">
                {this.renderSortingArrow('up', isAscending ? className : null)}
                {this.renderSortingArrow('down', !isAscending ? className : null)}
            </div>
        );
    }

    renderSortingArrow(suffix, className) {
        let classes = ['KitchenTable-arrow', `KitchenTable-${suffix}`, className];
        return <div className={classes.join(' ')}/>;
    }
}
