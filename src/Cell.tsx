import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { css } from '@linaria/core';

import { getCellStyle, getCellClassname, isCellEditable, getGroupBgColor } from './utils';
import type { CellRendererProps } from './types';
import { useRovingCellRef } from './hooks';

const cellCopied = css`
  @layer rdg.Cell {
    background-color: #ccccff;
  }
`;

const cellCopiedClassname = `rdg-cell-copied ${cellCopied}`;

const cellDraggedOver = css`
  @layer rdg.Cell {
    background-color: #ccccff;

    &.${cellCopied} {
      background-color: #9999ff;
    }
  }
`;

const cellDraggedOverClassname = `rdg-cell-dragged-over ${cellDraggedOver}`;

function Cell<R, SR>({
  column,
  colSpan,
  isCellSelected,
  isCopied,
  isDraggedOver,
  row,
  dragHandle,
  onRowClick,
  onRowDoubleClick,
  onRowChange,
  selectCell,
  groupPrimaryIndex,
  groupLength,
  ...props
}: CellRendererProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  const { cellClass } = column;
  const className = getCellClassname(
    column,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver
    },
    typeof cellClass === 'function' ? cellClass(row) : cellClass
  );

  function selectCellWrapper(openEditor?: boolean | null) {
    selectCell(row, column, openEditor);
  }

  function handleClick() {
    selectCellWrapper(column.editorOptions?.editOnClick);
    onRowClick?.(row, column);
  }

  function handleContextMenu() {
    selectCellWrapper();
  }

  function handleDoubleClick() {
    selectCellWrapper(true);
    onRowDoubleClick?.(row, column);
  }

  function handleRowChange(newRow: R) {
    onRowChange(column, newRow);
  }

  const isBehindGroupColumn = column.idx < groupPrimaryIndex;
  const isGroupColumn = column.idx === groupPrimaryIndex;

  const additionalStyle: CSSProperties = useMemo(() => {
    if (!isGroupColumn) return {};
    return {
      paddingLeft: '0',
      paddingRight: '0',
      display: 'flex',
      overflow: 'visible'
    };
  }, [isGroupColumn]);

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      aria-colspan={colSpan}
      aria-selected={!isGroupColumn ? isCellSelected : undefined}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={ref}
      tabIndex={tabIndex}
      className={className}
      style={{
        ...getCellStyle(column, colSpan),
        backgroundColor:
          isBehindGroupColumn && groupLength ? getGroupBgColor(groupLength, 1) : undefined,
        ...additionalStyle
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onFocus={onFocus}
      {...props}
    >
      {isGroupColumn && (
        <>
          {groupLength >= 2 && (
            <div
              style={{
                width: '1rem',
                height: '100%',
                backgroundColor: getGroupBgColor(groupLength, 1),
                boxShadow: `-1px 0 0 #cacaca, 0 -1px 0 #E3E3E3, 0 1px 0 #E3E3E3`,
                borderRight: '1px solid #cacaca',
                flexShrink: 0
              }}
            />
          )}
          {groupLength === 3 && (
            <div
              style={{
                width: '1rem',
                height: '100%',
                backgroundColor: getGroupBgColor(groupLength, groupLength - 1),
                boxShadow: `0 -1px 0 #ededed, 0 1px 0 #ededed`,
                borderRight: '1px solid #cacaca',
                flexShrink: 0
              }}
            />
          )}
          <div
            aria-selected={isCellSelected}
            className={css`
              flex-grow: 1;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              overflow: hidden;
              text-overflow: ellipsis;

              &[aria-selected='true'] {
                outline: 2px solid var(--rdg-selection-color);
                outline-offset: -2px;
              }
            `}
          >
            {column.formatter({
              column,
              row,
              isCellSelected,
              onRowChange: handleRowChange
            })}
            {dragHandle}
          </div>
        </>
      )}
      {!isGroupColumn &&
        column.formatter({
          column,
          row,
          isCellSelected,
          onRowChange: handleRowChange
        })}
      {dragHandle}
    </div>
  );
}

export default memo(Cell) as <R, SR>(props: CellRendererProps<R, SR>) => JSX.Element;
