import { css } from '@linaria/core';
import type { GroupFormatterProps } from '../types';

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
  toggleGroup
}: GroupFormatterProps<R, SR>) {
  function handleKeyDown({ key }: React.KeyboardEvent<HTMLSpanElement>) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  const bgColor: Record<number, string> = {
    0: '#E3E3E3',
    1: '#EDEDED',
    2: '#F7F7F7'
  };

  return (
    <div
      className={groupCellContent}
      style={{
        backgroundColor: bgColor[groupColumnIndex - 1] || '#f9f9f9',
        boxShadow: `0 -1px 0 #cacaca`,
        borderBottom: !isExpanded ? '1px solid #cacaca' : undefined
      }}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    />
  );
}
