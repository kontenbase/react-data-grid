import React, { memo } from 'react';

import { getCellStyle, getCellClassname } from './utils';
import type { CalculatedColumn, GroupFormatterProps, GroupRow } from './types';
import type { GroupRowRendererProps } from './GroupRow';
import { useRovingCellRef } from './hooks';

type SharedGroupRowRendererProps<R, SR> = Pick<
  GroupRowRendererProps<R, SR>,
  'id' | 'groupKey' | 'childRows' | 'isExpanded' | 'toggleGroup'
>;

interface GroupCellProps<R, SR> extends SharedGroupRowRendererProps<R, SR> {
  column: CalculatedColumn<R, SR>;
  row: GroupRow<R>;
  isCellSelected: boolean;
  groupColumnIndex: number;
  level: number;
}

interface CustomGroupFormatterProps<R, SR> extends GroupFormatterProps<R, SR> {
  groupColumnIndex: number;
}

function customFormatter<R, SR>({ groupColumnIndex, groupKey }: CustomGroupFormatterProps<R, SR>) {
  return (
    <div style={{ paddingLeft: `${groupColumnIndex}rem` }}>
      <span>{groupKey as string}</span>
    </div>
  );
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
  toggleGroup: toggleGroupWrapper
}: GroupCellProps<R, SR>) {
  const { ref, tabIndex, onFocus } = useRovingCellRef(isCellSelected);

  function toggleGroup() {
    toggleGroupWrapper(id);
  }

  // Only make the cell clickable if the group level matches
  const isLevelMatching = column.idx === 0;

  const groupFormatter = React.useMemo(() => {
    if (column.idx === 0) {
      return customFormatter;
    }
    return column.groupFormatter;
  }, [column.idx, column.groupFormatter]);

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
        backgroundColor: isLevelMatching ? 'yellow' : undefined
      }}
      onClick={isLevelMatching ? toggleGroup : undefined}
      onFocus={onFocus}
    >
      {((!column.rowGroup && column.idx === 0) || (column.rowGroup && column.idx === 0)) &&
        groupFormatter?.({
          groupKey,
          childRows,
          column,
          row,
          isExpanded,
          isCellSelected,
          toggleGroup,
          groupColumnIndex
        })}
    </div>
  );
}

export default memo(GroupCell) as <R, SR>(props: GroupCellProps<R, SR>) => JSX.Element;
