import React, { memo } from 'react';

import { getCellStyle, getCellClassname } from './utils';
import type { CalculatedColumn, GroupRow } from './types';
import type { GroupRowRendererProps } from './GroupRow';
import { useRovingCellRef } from './hooks';
import { airtableFormatter } from './formatters';
import { regularFormatter } from './formatters/regularFormatter';

type SharedGroupRowRendererProps<R, SR> = Pick<
  GroupRowRendererProps<R, SR>,
  'id' | 'groupKey' | 'childRows' | 'isExpanded' | 'toggleGroup'
>;

interface GroupCellProps<R, SR> extends SharedGroupRowRendererProps<R, SR> {
  column: CalculatedColumn<R, SR>;
  row: GroupRow<R>;
  isCellSelected: boolean;
  groupColumnIndex: number;
  groupField: string;
  groupPrimaryIndex: number;
}

function GroupCell<R, SR>({
  id,
  groupKey,
  childRows,
  isExpanded,
  isCellSelected,
  column,
  row,
  groupColumnIndex,
  groupField,
  groupPrimaryIndex,
  toggleGroup: toggleGroupWrapper
}: GroupCellProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.idx === groupPrimaryIndex;

  // const groupFormatter = React.useMemo(() => {
  //   if (column.idx === groupPrimaryIndex && !column.groupFormatter) {
  //     return airtableFormatter;
  //   }
  //   return column.groupFormatter;
  // }, [column.idx, column.groupFormatter, groupPrimaryIndex]);

  const isBehindPrimaryIndex = React.useMemo(
    () => column.idx < groupPrimaryIndex,
    [column.idx, groupPrimaryIndex]
  );
  const isBeyondPrimaryIndex = column.idx > groupPrimaryIndex;

  const bgColor: Record<number, string> = React.useMemo(
    () => ({
      0: '#E3E3E3',
      1: '#EDEDED',
      2: '#F7F7F7'
    }),
    []
  );

  const backgroundColor = React.useMemo(() => {
    if (isBehindPrimaryIndex || groupColumnIndex === 1) return bgColor[0];

    return bgColor[groupColumnIndex - 2] || '#f9f9f9';
  }, [bgColor, groupColumnIndex, isBehindPrimaryIndex]);

  return (
    <div
      role="gridcell"
      aria-colindex={column.idx + 1}
      aria-selected={isCellSelected}
      ref={ref}
      tabIndex={tabIndex}
      key={column.key}
      className={getCellClassname(column)}
      style={{
        ...getCellStyle(column),
        cursor: isLevelMatching ? 'pointer' : 'default',
        paddingTop: 10,
        paddingBottom: !isExpanded ? 10 : undefined,
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor,
        boxShadow: groupColumnIndex > 1 && isLevelMatching ? '-1px 0 0 #cacaca' : undefined,
        borderTop: 0,
        overflow: 'visible'
      }}
      onClick={isLevelMatching ? toggleGroup : undefined}
      onFocus={onFocus}
    >
      {isLevelMatching &&
        airtableFormatter({
          groupKey,
          childRows,
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleGroup,
          groupColumnIndex,
          groupField
        })}

      {isBeyondPrimaryIndex &&
        regularFormatter({
          groupKey,
          childRows,
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleGroup,
          groupColumnIndex,
          groupField
        })}
      {/* {column.idx >= groupPrimaryIndex &&
        groupFormatter?.({
          groupKey,
          childRows,
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleGroup,
          groupColumnIndex,
          groupField
        })} */}
    </div>
  );
}

export default memo(GroupCell) as <R, SR>(props: GroupCellProps<R, SR>) => JSX.Element;
