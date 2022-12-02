import React, { memo } from 'react';

import { getCellStyle, getCellClassname, getGroupBgColor } from './utils';
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
  groupLength: number;
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
  groupLength,
  toggleGroup: toggleGroupWrapper
}: GroupCellProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.idx === groupPrimaryIndex;

  const isBehindPrimaryIndex = React.useMemo(
    () => column.idx < groupPrimaryIndex,
    [column.idx, groupPrimaryIndex]
  );
  const isBeyondPrimaryIndex = column.idx > groupPrimaryIndex;

  const backgroundColor = React.useMemo(() => {
    if (isBehindPrimaryIndex || groupColumnIndex === 1) return getGroupBgColor(groupLength, 1);

    return getGroupBgColor(groupLength, groupColumnIndex, true);
  }, [groupColumnIndex, isBehindPrimaryIndex, groupLength]);

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
        overflow: 'visible',
        borderBottom: `1px solid ${backgroundColor}`
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
          groupField,
          groupLength,
          children: column.groupFormatter?.({
            groupKey,
            childRows,
            column,
            row,
            isExpanded,
            isCellSelected,
            toggleGroup,
            groupColumnIndex,
            groupField,
            groupLength
          })
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
          groupField,
          groupLength
        })}
    </div>
  );
}

export default memo(GroupCell) as <R, SR>(props: GroupCellProps<R, SR>) => JSX.Element;
