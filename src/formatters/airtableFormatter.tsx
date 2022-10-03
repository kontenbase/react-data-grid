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
  top: -12px;
`;

const groupCellValue = css`
  font-size: 14px;
  position: absolute;
  top: 6px;
`;

interface CustomGroupFormatterProps<R, SR> extends GroupFormatterProps<R, SR> {
  groupColumnIndex: number;
  groupField: string;
}

export function airtableFormatter<R, SR>({
  groupColumnIndex,
  groupKey,
  groupField,
  isExpanded,
  toggleGroup
}: CustomGroupFormatterProps<R, SR>) {
  const d =
    'M0.71 1.71L3.3 4.3C3.69 4.69 4.32 4.69 4.71 4.3L7.3 1.71C7.93 1.08 7.48 0 6.59 0H1.41C0.52 0 0.08 1.08 0.71 1.71Z';

  function handleKeyDown({ key }: React.KeyboardEvent<HTMLSpanElement>) {
    if (key === 'Enter') {
      toggleGroup();
    }
  }

  return (
    <div
      className={groupCellContent}
      style={{
        paddingLeft: `${groupColumnIndex}rem`
      }}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      <svg
        onClick={toggleGroup}
        width="8"
        height="5"
        viewBox="0 0 8 5"
        fill="none"
        aria-hidden
        style={{
          marginRight: 12,
          cursor: 'pointer',
          rotate: isExpanded ? '270deg' : '0deg'
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
        {String(
          [undefined, null].includes(groupKey as null | undefined) ? '(Empty)' : String(groupKey)
        )}
      </span>
    </div>
  );
}
