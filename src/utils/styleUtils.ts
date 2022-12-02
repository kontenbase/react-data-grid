import type { CSSProperties } from 'react';
import clsx from 'clsx';

import type { CalculatedColumn } from '../types';
import { cellClassname, cellFrozenClassname, cellFrozenLastClassname } from '../style';

export function getRowStyle(rowIdx: number, height?: number): CSSProperties {
  if (height !== undefined) {
    return {
      '--rdg-grid-row-start': rowIdx,
      '--rdg-row-height': `${height}px`
    } as unknown as CSSProperties;
  }
  return { '--rdg-grid-row-start': rowIdx } as unknown as CSSProperties;
}

export function getCellStyle<R, SR>(
  column: CalculatedColumn<R, SR>,
  colSpan?: number
): React.CSSProperties {
  return {
    gridColumnStart: column.idx + 1,
    gridColumnEnd: colSpan !== undefined ? `span ${colSpan}` : undefined,
    insetInlineStart: column.frozen ? `var(--rdg-frozen-left-${column.idx})` : undefined
  };
}

export function getCellClassname<R, SR>(
  column: CalculatedColumn<R, SR>,
  ...extraClasses: Parameters<typeof clsx>
): string {
  return clsx(
    cellClassname,
    {
      [cellFrozenClassname]: column.frozen,
      [cellFrozenLastClassname]: column.isLastFrozenColumn
    },
    ...extraClasses
  );
}

export const bgColor: Record<number, string> = {
  1: '#E3E3E3',
  2: '#EDEDED',
  3: '#F7F7F7'
};

export const tableBgColor: Record<number, string> = {
  1: '#DEDEDE',
  2: '#E8E8E8',
  3: '#F2F2F2'
};

export const getGroupBgColor = (
  groupLength: number,
  groupColumnIndex: number,
  isSpanElement?: boolean,
  isBgTable?: boolean
): string => {
  const bgConstant = isBgTable ? tableBgColor : bgColor;
  switch (groupLength) {
    case 2:
      return !isSpanElement ? bgConstant[groupColumnIndex + 1] : bgConstant[groupColumnIndex];
    case 3:
      return !isSpanElement ? bgConstant[groupColumnIndex] : bgConstant[groupColumnIndex - 1];
    default:
      return bgConstant[3];
  }
};
