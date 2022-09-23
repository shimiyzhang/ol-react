/**
 * 字符串判断
 * @author zsm
 * @date 2022/09/23 11:04
 */
export const isNullString = (value: any) => {
  if (
    value === null ||
    value === '' ||
    value === undefined ||
    value === 'undefined' ||
    value === '-' ||
    value === 'null'
  ) {
    return true;
  }
  return false;
};
