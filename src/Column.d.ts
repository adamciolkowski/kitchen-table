import {CSSProperties, ReactNode} from "react";
import {Row} from "./Row";

export interface Column {
    title: string | (() => ReactNode),
    field?: string | ((row: Row) => any),
    renderer?: (value: any, row: Row) => ReactNode,
    defaultValue?: string | (() => ReactNode),
    className?: string | ((value: any, row: Row) => string),
    style?: (value: any, row: Row) => CSSProperties,
    subColumns?: Column[],
    freeze?: boolean
}
