import { css } from '@linaria/core';
import type { PropsWithChildren } from 'react';
import type { GroupFormatterProps } from '../types';
import { getGroupBgColor } from '../utils';

const groupCellContent = css`
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
`;

export function regularFormatter<R, SR>({
  groupColumnIndex,
  isExpanded,
  toggleGroup,
  groupLength,
  children,
  column
}: GroupFormatterProps<R, SR> & PropsWithChildren) {
  function handleKeyDown({ key }: React.KeyboardEvent<HTMLSpanElement>) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const backgroundColor = getGroupBgColor(groupLength, groupColumnIndex);
  const isLastColumn = column.isLastColumn ?? false;

  return (
    <div
      className={groupCellContent}
      style={{
        backgroundColor,
        boxShadow: `0 -1px 0 #cacaca`,
        borderBottom: !isExpanded ? '1px solid #cacaca' : undefined,
        borderTopRightRadius: isLastColumn ? 8 : undefined,
        borderRight: isLastColumn ? '1px solid #cacaca' : undefined
      }}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {children && (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
