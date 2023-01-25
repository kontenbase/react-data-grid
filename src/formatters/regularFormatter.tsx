import { css } from '@linaria/core';
import type { PropsWithChildren } from 'react';
import type { GroupFormatterProps } from '../types';
import { bgColor, getGroupBgColor } from '../utils';

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

  const isLastGroupColumn = column.isLastGroupColumn ?? false;
  const isLastColumn = column.isLastColumn ?? false;

  const generalStyle: React.CSSProperties = {
    width: '1rem',
    boxShadow: `0 -1px 0 #cacaca`,
    position: 'absolute',
    top: -10,
    height: 68
  };

  const firstSpanStyle: React.CSSProperties = { ...generalStyle, backgroundColor: 'red' };
  const secondSpanStyle: React.CSSProperties = { ...generalStyle, backgroundColor: 'blue' };

  if (groupLength === 3) {
    switch (groupColumnIndex) {
      case 1:
        firstSpanStyle.backgroundColor = bgColor[1];
        secondSpanStyle.borderTopRightRadius = 8;
        secondSpanStyle.backgroundColor = bgColor[1];
        secondSpanStyle.borderRight = '1px solid #cacaca';
        secondSpanStyle.left = '1rem';
        firstSpanStyle.top = 0;
        secondSpanStyle.top = 0;
        break;

      case 2:
        firstSpanStyle.backgroundColor = bgColor[2];
        firstSpanStyle.borderTopRightRadius = 8;
        firstSpanStyle.borderRight = '1px solid #cacaca';
        secondSpanStyle.backgroundColor = bgColor[1];
        secondSpanStyle.boxShadow = 'none';
        secondSpanStyle.borderRight = '1px solid #cacaca';
        secondSpanStyle.left = '1rem';
        firstSpanStyle.top = 0;
        secondSpanStyle.top = -10;
        break;

      case 3:
        firstSpanStyle.backgroundColor = bgColor[2];
        firstSpanStyle.borderRight = '1px solid #cacaca';
        firstSpanStyle.boxShadow = 'none';
        secondSpanStyle.backgroundColor = bgColor[1];
        secondSpanStyle.borderRight = '1px solid #cacaca';
        secondSpanStyle.boxShadow = 'none';
        secondSpanStyle.left = '1rem';
        break;

      default:
        break;
    }
  }

  if (groupLength === 2) {
    switch (groupColumnIndex) {
      case 1:
        firstSpanStyle.backgroundColor = bgColor[2];
        firstSpanStyle.borderRight = '1px solid #cacaca';
        firstSpanStyle.top = 0;
        firstSpanStyle.borderTopRightRadius = 8;

        break;

      case 2:
        firstSpanStyle.backgroundColor = bgColor[2];
        firstSpanStyle.borderRight = '1px solid #cacaca';
        firstSpanStyle.boxShadow = 'none';

        break;

      default:
        break;
    }
  }

  if (isLastGroupColumn && groupLength >= 2)
    return (
      <div className={groupCellContent}>
        {groupLength >= 2 && <div style={firstSpanStyle} />}
        {groupLength === 3 && <div style={secondSpanStyle} />}
      </div>
    );

  const isShowRadius = isLastColumn && (groupColumnIndex === 3 || groupLength === groupColumnIndex);
  const isShowBorderRight = isLastColumn && groupLength >= 2 && groupLength === groupColumnIndex;

  return (
    <div
      className={groupCellContent}
      style={{
        backgroundColor,
        boxShadow: `0 -1px 0 #cacaca`,
        borderBottom: !isExpanded ? '1px solid #cacaca' : undefined,
        borderTopRightRadius: isShowRadius ? 8 : 0,
        borderRight: isShowBorderRight ? '1px solid #cacaca' : undefined
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
