import React from "react";
import PropTypes from "prop-types";
import "./SortableColumnDecorator.scss";

export default class SortableColumnDecorator extends React.Component {

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
        return (
            <div>
                {this.renderSortingArrow('up', this.props.sortOrder === 'asc' ? className : null)}
                {this.renderSortingArrow('down', this.props.sortOrder === 'desc' ? className : null)}
            </div>
        );
    }

    renderSortingArrow(suffix, className) {
        let classes = ['KitchenTable-arrow', `KitchenTable-${suffix}`, className];
        return <div className={classes.join(' ')}/>;
    }
}

SortableColumnDecorator.propTypes = {
    children: PropTypes.node.isRequired,
    isSorted: PropTypes.bool.isRequired,
    sortOrder: PropTypes.string
};
