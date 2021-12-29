// 組件類型
export default JVXETypes
export const JVXETypes = {
  // 為了防止和 vxe 內置的類型衝突，所以加上一個前綴
  // 前綴是自動加的，代碼中直接用就行（JVXETypes.input）
  _prefix: 'j-',

  // 行號列
  rowNumber: 'row-number',
  // 選擇列
  rowCheckbox: 'row-checkbox',
  // 單選列
  rowRadio: 'row-radio',
  // 展開列
  rowExpand: 'row-expand',
  // 上下排序
  rowDragSort: 'row-drag-sort',

  input: 'input',
  inputNumber: 'inputNumber',
  textarea: 'textarea',
  select: 'select',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  checkbox: 'checkbox',
  upload: 'upload',
  // 下拉搜索
  selectSearch: 'select-search',
  // 下拉多選
  selectMultiple: 'select-multiple',
  // 進度條
  progress: 'progress',
  //部門選擇
  departSelect: 'sel_depart',
  //用戶選擇
  userSelect: 'sel_user',

  // 拖輪Tags（暫無用）
  tags: 'tags',

  slot: 'slot',
  normal: 'normal',
  hidden: 'hidden',
}
