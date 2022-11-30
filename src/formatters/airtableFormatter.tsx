import { css } from '@linaria/core';
import type { PropsWithChildren } from 'react';
import type { GroupFormatterProps } from '../types';

const groupCellContent = css`
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  height: 100%;
  overflow: visible;

  @layer rdg.GroupCellContent {
    outline: none;
  }
`;

const groupCellContentClassname = `rdg-group-cell-content ${groupCellContent}`;

export function airtableFormatter<R, SR>({
  groupColumnIndex,
  groupKey,
  groupField,
  isExpanded,
  toggleGroup,
  children
}: GroupFormatterProps<R, SR> & PropsWithChildren) {
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
      className={groupCellContentClassname}
      style={{
        marginLeft: `${groupColumnIndex - 1}rem`,
        backgroundColor: bgColor[groupColumnIndex - 1] || '#f9f9f9',
        borderTopLeftRadius: 8,
        paddingLeft: '1rem',
        boxShadow: `-1px 0 0 #cacaca, 0 -1px 0 #cacaca`,
        borderBottomLeftRadius: !isExpanded ? 8 : undefined,
        borderBottom: !isExpanded ? '1px solid #cacaca' : undefined,
        paddingBottom: isExpanded ? 10 : undefined
      }}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {groupColumnIndex === 3 && (
        <div
          style={{
            width: '1rem',
            height: 68,
            backgroundColor: bgColor[0],
            position: 'absolute',
            top: -10,
            left: '-2rem',
            borderRight: '1px solid #cacaca'
          }}
        />
      )}

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
      {!children && (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
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
              rotate: !isExpanded ? '270deg' : '0deg'
            }}
          >
            <path d={d} fill="currentColor" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ lineHeight: '11px', fontSize: '11px', marginBottom: '4px' }}>
              {String(groupField)}
            </span>
            <span style={{ lineHeight: '14px', fontSize: '14px' }}>
              {['undefined', 'null'].includes(String(groupKey)) ? '(Empty)' : String(groupKey)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
