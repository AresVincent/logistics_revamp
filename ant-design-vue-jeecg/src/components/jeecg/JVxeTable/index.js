import * as jvxeTypes from './jvxeTypes'
import { installCell, mapCell } from './install'
import JVxeTable from './components/JVxeTable'

import JVxeSlotCell from './components/cells/JVxeSlotCell'
import JVxeNormalCell from './components/cells/JVxeNormalCell'
import JVxeInputCell from './components/cells/JVxeInputCell'
import JVxeDateCell from './components/cells/JVxeDateCell'
import JVxeTimeCell from './components/cells/JVxeTimeCell'
import JVxeSelectCell from './components/cells/JVxeSelectCell'
import JVxeCheckboxCell from './components/cells/JVxeCheckboxCell'
import JVxeUploadCell from './components/cells/JVxeUploadCell'
import { TagsInputCell, TagsSpanCell } from './components/cells/JVxeTagsCell'
import JVxeProgressCell from './components/cells/JVxeProgressCell'
import JVxeTextareaCell from './components/cells/JVxeTextareaCell'
import JVxeDragSortCell from './components/cells/JVxeDragSortCell'
import JVxeDepartSelectCell from './components/cells/JVxeDepartSelectCell'
import JVxeUserSelectCell from './components/cells/JVxeUserSelectCell'

//update--begin--autor:lvdandan-----date:20201216------for：JVxeTable--JVXETypes 【online】代碼結構調整，便於online打包
// 組件類型
export const JVXETypes = jvxeTypes.JVXETypes
//update--end--autor:lvdandan-----date:20201216------for：JVxeTable--JVXETypes 【online】代碼結構調整，便於online打包

// 註冊自定義組件
export const AllCells = {
  ...mapCell(JVXETypes.normal, JVxeNormalCell),
  ...mapCell(JVXETypes.input, JVxeInputCell),
  ...mapCell(JVXETypes.inputNumber, JVxeInputCell),
  ...mapCell(JVXETypes.checkbox, JVxeCheckboxCell),
  ...mapCell(JVXETypes.select, JVxeSelectCell),
  ...mapCell(JVXETypes.selectSearch, JVxeSelectCell),  // 下拉搜索
  ...mapCell(JVXETypes.selectMultiple, JVxeSelectCell),  // 下拉多選
  ...mapCell(JVXETypes.date, JVxeDateCell),
  ...mapCell(JVXETypes.datetime, JVxeDateCell),
  ...mapCell(JVXETypes.time, JVxeTimeCell),
  ...mapCell(JVXETypes.upload, JVxeUploadCell),
  ...mapCell(JVXETypes.textarea, JVxeTextareaCell),

  ...mapCell(JVXETypes.tags, TagsInputCell, TagsSpanCell),
  ...mapCell(JVXETypes.progress, JVxeProgressCell),

  ...mapCell(JVXETypes.rowDragSort, JVxeDragSortCell),
  ...mapCell(JVXETypes.slot, JVxeSlotCell),
  ...mapCell(JVXETypes.departSelect, JVxeDepartSelectCell),
  ...mapCell(JVXETypes.userSelect, JVxeUserSelectCell)

  /* hidden 是特殊的組件，不在這裏註冊 */
}

export { installCell, mapCell }

export default JVxeTable