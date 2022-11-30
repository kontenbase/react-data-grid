import { css } from '@linaria/core';
import type { GroupFormatterProps } from '../types';

const groupCellContent = css`
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
`;

const groupCellTitle = css`
  font-size: 11px;
  position: absolute;
  top: -18px;
`;

const groupCellValue = css`
  font-size: 14px;
  position: absolute;
  top: 0px;
`;

export function regularFormatter<R, SR>({
  groupColumnIndex,
  groupKey,
  groupField,
  isExpanded,
  toggleGroup
}: GroupFormatterProps<R, SR>) {
  const d =
    'M0.71 1.71L3.3 4.3C3.69 4.69 4.32 4.69 4.71 4.3L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C0.52 0 0.08 1.08 0.71 1.71Z';

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
        // borderLeft: '1px solid #cacaca',
        borderBottom: !isExpanded ? '1px solid #cacaca' : undefined
      }}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {/* <svg
        onClick={toggleGroup}
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        aria-hidden
        style={{
          marginRight: 12,
          cursor: 'pointer',
          rotate: !isExpanded ? '270deg' : '0deg'
        }}
      >
        <path d={d} fill="currentColor" />
      </svg>
      <span className={groupCellTitle} style={{ left: `${groupColumnIndex + 1}rem` }}>
        {String(groupField)}
      </span>
      <span
        className={groupCellValue}
        style={{
          left: `${groupColumnIndex + 1}rem`
        }}
      >
        {['undefined', 'null'].includes(String(groupKey)) ? '(Empty)' : String(groupKey)}
      </span> */}
    </div>
  );
}
