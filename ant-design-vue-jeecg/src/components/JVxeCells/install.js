import { installCell, JVXETypes } from '@/components/jeecg/JVxeTable'
import JVxePopupCell from './JVxePopupCell'
import { DictSearchInputCell, DictSearchSpanCell } from './JVxeSelectDictSearchCell'
import JVxeFileCell from './JVxeFileCell'
import JVxeImageCell from './JVxeImageCell'
import JVxeRadioCell from './JVxeRadioCell'
import JVxeSelectCell from '@comp/jeecg/JVxeTable/components/cells/JVxeSelectCell'
import JVxeTextareaCell from '@comp/jeecg/JVxeTable/components/cells/JVxeTextareaCell'

// 註冊online組件
JVXETypes.input_pop = 'input_pop'
JVXETypes.list_multi = 'list_multi'
JVXETypes.sel_search = 'sel_search'
installCell(JVXETypes.input_pop, JVxeTextareaCell)
installCell(JVXETypes.list_multi, JVxeSelectCell)
installCell(JVXETypes.sel_search, JVxeSelectCell)

// 註冊【popup】組件（普通封裝方式）
JVXETypes.popup = 'popup'
installCell(JVXETypes.popup, JVxePopupCell)

// 註冊【字典搜索下拉】組件（高級封裝方式）
JVXETypes.selectDictSearch = 'select-dict-search'
installCell(JVXETypes.selectDictSearch, DictSearchInputCell, DictSearchSpanCell)

// 註冊【文件上傳】組件
JVXETypes.file = 'file'
installCell(JVXETypes.file, JVxeFileCell)

// 註冊【圖片上傳】組件
JVXETypes.image = 'image'
installCell(JVXETypes.image, JVxeImageCell)

// 註冊【單選框】組件
JVXETypes.radio = 'radio'
installCell(JVXETypes.radio, JVxeRadioCell)
