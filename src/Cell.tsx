import type { CSSProperties } from 'react';
import { memo, useMemo } from 'react';
import { css } from '@linaria/core';

import { getCellStyle, getCellClassname, isCellEditable, createCellEvent, getGroupBgColor, bgColor } from './utils';
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
  skipCellFocusRef,
  onClick,
  onDoubleClick,
  onContextMenu,
  onRowChange,
  selectCell,
  groupPrimaryIndex,
  groupLength,
  ...props
}: CellRendererProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected, skipCellFocusRef);

  const { cellClass } = column;
  const className = getCellClassname(
    column,
    {
      [cellCopiedClassname]: isCopied,
      [cellDraggedOverClassname]: isDraggedOver
    },
    typeof cellClass === 'function' ? cellClass(row) : cellClass
  );

  function selectCellWrapper(openEditor?: boolean) {
    selectCell(row, column, openEditor);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (onClick) {
      const cellEvent = createCellEvent(event);
      onClick({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }

  function handleContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    if (onContextMenu) {
      const cellEvent = createCellEvent(event);
      onContextMenu({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper();
  }

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (onDoubleClick) {
      const cellEvent = createCellEvent(event);
      onDoubleClick({ row, column, selectCell: selectCellWrapper }, cellEvent);
      if (cellEvent.isGridDefaultPrevented()) return;
    }
    selectCellWrapper(true);
  }

  function handleRowChange(newRow: R) {
    onRowChange(column, newRow);
  }

  const isBehindGroupColumn = column.idx < groupPrimaryIndex;
  const isGroupColumn = column.idx === groupPrimaryIndex;
  const isLastGroupColumn = column.isLastGroupColumn ?? false;

  const additionalStyle: CSSProperties = useMemo(() => {
    if (!isGroupColumn && !isLastGroupColumn) return {};
    let obj: CSSProperties = {
      paddingLeft: '0',
      paddingRight: '0',
      display: 'flex',
      overflow: 'visible'
    };

    if (isLastGroupColumn) {
      obj = {
        ...obj,
        width: `${groupLength - 1}rem`,
        borderBottom: 'none'
        // borderRight: '1px solid #cacaca'
      };
    }

    return obj;
  }, [isGroupColumn, isLastGroupColumn, groupLength]);

  const tableBackground = useMemo(
    () => getGroupBgColor(groupLength, 1, false, true),
    [groupLength]
  );

  const isNoStyling = column.isNoStyling ?? false;
  if (isNoStyling) return null;

  if (isLastGroupColumn && groupLength <= 1) return null;

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
        backgroundColor: isBehindGroupColumn && groupLength ? tableBackground : undefined,
        borderBottom: isBehindGroupColumn && groupLength ? tableBackground : undefined,
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
                boxShadow: `-1px 0 0 #cacaca, 0 -1px 0 ${getGroupBgColor(
                  groupLength,
                  1
                )}, 0 1px 0 ${getGroupBgColor(groupLength, 1)}`,
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
                boxShadow: `0 -1px 0 ${getGroupBgColor(
                  groupLength,
                  groupLength - 1
                )}, 0 1px 0 ${getGroupBgColor(groupLength, groupLength - 1)}`,
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
              box-shadow: -1px 0 0 #cacaca;

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
      {isLastGroupColumn && (
        <>
          {groupLength >= 2 && (
            <div
              style={{
                backgroundColor: bgColor[2],
                width: '1rem',
                height: '100%',
                // borderRight: groupLength === 3 ? '1px solid #cacaca' : undefined
                boxShadow: groupLength === 2 ? `1px 0 0 #cacaca` : undefined
              }}
            />
          )}
          {groupLength === 3 && (
            <div
              style={{
                backgroundColor: bgColor[1],
                width: '1rem',
                height: '100%',
                boxShadow: `1px 0 0 #cacaca`,
                borderLeft: '1px solid #cacaca'
              }}
            />
          )}
        </>
      )}
      {!isGroupColumn &&
        !isLastGroupColumn &&
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
