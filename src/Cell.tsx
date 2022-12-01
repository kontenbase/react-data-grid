import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { css } from '@linaria/core';

import { getCellStyle, getCellClassname, isCellEditable } from './utils';
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

  const additionalStyle: CSSProperties = useMemo(() => {
    if (column.idx !== groupPrimaryIndex) return {};
    return {
      width: `calc(100% - ${!groupLength ? 0 : groupLength - 1}rem)`,
      marginLeft: 'auto',
      overflow: 'visible',
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem'
    };
  }, [column.idx, groupPrimaryIndex, groupLength]);

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1} // aria-colindex is 1-based
      aria-selected={isCellSelected}
      aria-colspan={colSpan}
      aria-readonly={!isCellEditable(column, row) || undefined}
      ref={ref}
      tabIndex={tabIndex}
      className={className}
      style={{
        ...getCellStyle(column, colSpan),
        backgroundColor: column.idx < groupPrimaryIndex && groupLength ? '#E3E3E3' : undefined,
        paddingLeft: column.idx === groupPrimaryIndex ? 0 : undefined,
        paddingRight: column.idx === groupPrimaryIndex ? 0 : undefined,
        boxShadow: `-1px 0 0 #cacaca`,
        display: 'flex',
        ...additionalStyle
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onFocus={onFocus}
      {...props}
    >
      {column.idx === groupPrimaryIndex && (
        <>
          {groupLength >= 2 && (
            <div
              style={{
                width: '1rem',
                height: '100%',
                backgroundColor: '#E3E3E3',
                position: 'absolute',
                top: 0,
                left: `-${groupLength - 1}rem`,
                boxShadow: `-1px 0 0 #cacaca, 0 -1px 0 #E3E3E3, 0 1px 0 #E3E3E3`,
                borderRight: '1px solid #cacaca'
              }}
            />
          )}
          {groupLength === 3 && (
            <div
              style={{
                width: '1rem',
                height: '100%',
                backgroundColor: '#ededed',
                position: 'absolute',
                top: 0,
                left: '-1rem',
                boxShadow: `0 -1px 0 #ededed, 0 1px 0 #ededed`,
                borderRight: '1px solid #cacaca'
              }}
            />
          )}
        </>
      )}
      {column.formatter({
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
