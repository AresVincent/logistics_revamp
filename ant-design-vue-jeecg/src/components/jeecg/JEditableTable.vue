<!-- JEditableTable -->
<!-- @version 1.6.2 -->
<!-- @author sjlei -->
<template>
  <a-spin :spinning="loading">

    <a-row type="flex">
      <a-col>
        <slot name="buttonBefore" :target="getVM()"/>
      </a-col>
      <a-col>
        <!-- 操作按鈕 -->
        <div v-if="actionButton" class="action-button">
          <a-button-group v-if="buttonPermission('add')">
            <a-button type="primary" icon="plus" @click="handleClickAdd" :disabled="disabled">新增</a-button>
            <a-popover v-if="addButtonSettings" placement="right" overlayClassName="j-add-btn-settings">
              <a-row slot="title">
                <a-col :span="12">選項</a-col>
                <a-col :span="12" style="text-align: right;">
                  <a-tooltip title="保存為默認值">
                    <a-button type="link" icon="save" size="small" style="position: relative;left:4px;" @click="onAddButtonSettingsSave"/>
                  </a-tooltip>
                </a-col>
              </a-row>
              <template slot="content">
                <a-form-model layout="horizontal" :labelCol="{span:8}" :wrapperCol="{span:16}">
                  <a-form-model-item label="添加行數">
                    <a-input-number v-model="settings.addRowNum" :min="1"/>
                  </a-form-model-item>
                  <a-form-model-item label="添加位置">
                    <a-input-number v-model="settings.addIndex" :min="0" :max="rows.length"/>
                    <p style="font-size: 12px;color:#aaa;line-height: 14px;text-align: right;margin: 0;">0 = 最底部</p>
                  </a-form-model-item>
                  <a-divider style="margin: 8px 0;"/>
                  <a-checkbox v-model="settings.addScrollToBottom">添加后滾動到底部</a-checkbox>
                </a-form-model>
              </template>
              <a-button icon="setting" type="primary"></a-button>
            </a-popover>
          </a-button-group>
          <span class="gap"></span>
          <template v-if="selectedRowIds.length>0">
            <a-popconfirm
              :title="`確定要刪除這 ${selectedRowIds.length} 項嗎?`"
              @confirm="handleConfirmDelete">
              <a-button v-if="buttonPermission('batch_delete')" type="primary" icon="minus" :disabled="disabled">刪除</a-button>
              <span class="gap"></span>
            </a-popconfirm>
            <template v-if="showClearSelectButton">
              <a-button icon="delete" @click="handleClickClearSelection">清空選擇</a-button>
              <span class="gap"></span>
            </template>
          </template>
        </div>
      </a-col>
      <a-col>
        <slot name="buttonAfter" :target="getVM()"/>
      </a-col>
    </a-row>

    <slot name="actionButtonAfter" :target="getVM()"/>

    <div :id="`${caseId}inputTable`" class="input-table">
      <!-- 渲染表頭 -->
      <div class="thead" ref="thead">
        <div class="tr" :style="{width: this.realTrWidth}">
          <!-- 左側固定td  -->
          <div v-if="dragSort" class="td td-ds" :style="style.tdLeft">
            <span></span>
          </div>
          <div v-if="rowSelection" class="td td-cb" :style="style.tdLeft">
            <!--:indeterminate="true"-->
            <a-checkbox
              :checked="getSelectAll"
              :indeterminate="getSelectIndeterminate"
              @change="handleChangeCheckedAll"
            />
          </div>
          <div v-if="rowNumber" class="td td-num" :style="style.tdLeft">
            <span>#</span>
          </div>
          <!-- 右側動態生成td -->
          <template v-for="col in columns">
            <div
              v-show="col.type !== formTypes.hidden"
              class="td"
              :key="col.key"
              :style="buildTdStyle(col)">

              <span>{{ col.title }}</span>
            </div>
          </template>
        </div>
      </div>

      <div class="scroll-view" ref="scrollView" :style="{'max-height':maxHeight+'px'}">


        <!-- 渲染主體 body -->
        <div :id="`${caseId}tbody`" class="tbody" :style="tbodyStyle">
          <!-- 擴展高度 -->
          <div class="tr-expand" :style="`height:${getExpandHeight}px; z-index:${loading?'11':'9'};`"></div>
          <!-- 無數據時顯示 -->
          <div v-if="rows.length===0" class="tr-nodata">
            <span>暫無數據</span>
          </div>
          <!-- v-model="rows"-->
          <draggable
            :value="rows"
            handle=".td-ds-icons"
            @start="handleDragMoveStart"
            @end="handleDragMoveEnd"
          >

            <!-- 動態生成tr -->
            <template v-for="(row,rowIndex) in rows">
              <!-- tr 只加載可見的和預加載的總共十條數據 -->
              <div
                v-if="
                rowIndex >= parseInt(`${(scrollTop-rowHeight) / rowHeight}`) &&
                  (parseInt(`${scrollTop / rowHeight}`) + 9) > rowIndex
              "
                :id="`${caseId}tbody-tr-${rowIndex}`"
                :data-idx="rowIndex"
                class="tr"
                :class="selectedRowIds.indexOf(row.id) !== -1 ? 'tr-checked' : ''"
                :style="buildTrStyle(rowIndex)"
                :key="row.id"
                @click="handleClickTableRow"
              >
                <!-- 左側固定td  -->

                <div v-if="dragSort" class="td td-ds" :style="style.tdLeft" @dblclick="_handleRowInsertDown(rowIndex)" >
                  <a-dropdown :trigger="['click']" :getPopupContainer="getParentContainer">
                    <div class="td-ds-icons">
                      <a-icon type="align-left"/>
                      <a-icon type="align-right"/>
                    </div>

                    <a-menu slot="overlay">
                      <a-menu-item key="0" :disabled="rowIndex===0" @click="_handleRowMoveUp(rowIndex)">向上移</a-menu-item>
                      <a-menu-item key="1" :disabled="rowIndex===(rows.length-1)" @click="_handleRowMoveDown(rowIndex)">向下移</a-menu-item>
                      <a-menu-divider/>
                      <a-menu-item key="3" @click="_handleRowInsertDown(rowIndex)">插入一行</a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>

                <div v-if="rowSelection" class="td td-cb" :style="style.tdLeft">
                  <!-- 此 v-for 只是為了拼接 id 字符串 -->
                  <template v-for="(id,i) in [`${row.id}`]">
                    <a-checkbox
                      :id="id"
                      :key="i"
                      :checked="selectedRowIds.indexOf(id) !== -1"
                      @change="handleChangeLeftCheckbox"/>
                  </template>
                </div>
                <div v-if="rowNumber" class="td td-num" :style="style.tdLeft">
                  <span>{{ rowIndex+1 }}</span>
                </div>
                <!-- 右側動態生成td -->
                <div
                  class="td"
                  v-for="col in columns"
                  v-show="col.type !== formTypes.hidden"
                  :key="col.key"
                  :style="buildTdStyle(col)">

                  <!-- 此 v-for 只是為了拼接 id 字符串 -->
                  <template v-for="(id,i) in [`${col.key}${row.id}`]">

                    <!-- native input -->
                    <label :key="i" v-if="col.type === formTypes.input || col.type === formTypes.inputNumber">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <input
                          v-if="isEditRow(row, col)"
                          :id="id"
                          v-bind="buildProps(row,col)"
                          :data-input-number="col.type === formTypes.inputNumber"
                          :placeholder="replaceProps(col, col.placeholder)"
                          @blur="(e)=>{handleBlurCommono(e.target,rowIndex,row,col)}"
                          @input="(e)=>{handleInputCommono(e.target,rowIndex,row,col)}"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ inputValues[rowIndex][col.key] }}</span>
                      </a-tooltip>
                    </label>
                    <!-- checkbox -->
                    <template v-else-if="col.type === formTypes.checkbox">
                      <a-checkbox
                        :key="i"
                        :id="id"
                        v-bind="buildProps(row,col)"
                        :checked="checkboxValues[id]"
                        @change="(e)=>handleChangeCheckboxCommon(e,row,col)"
                      />
                    </template>
                    <!-- select -->
                    <template v-else-if="col.type === formTypes.select">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <a-select
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="selectValues[id]"
                          :options="col.options"
                          :getPopupContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :filterOption="(i,o)=>handleSelectFilterOption(i,o,col)"
                          :maxTagCount="1"
                          @change="(v)=>handleChangeSelectCommon(v,id,row,col)"
                          @search="(v)=>handleSearchSelect(v,id,row,col)"
                          @blur="(v)=>handleBlurSearch(v,id,row,col)"
                          allowClear
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click.stop="handleEditRow(row, col)"
                        >{{ getSelectTranslateText(selectValues[id], row, col) }}</span>
                      </a-tooltip>
                    </template>

                    <!-- 部門選擇 -->
                    <template v-else-if="col.type === formTypes.sel_depart">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-select-depart
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="departCompValues[id]"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :trigger-change="true"
                          :multi="isMultipleSelect(col)"
                          @change="(v)=>handleChangeDepartCommon(v,id,row,col)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ departCompValues[id] }}</span>
                      </a-tooltip>
                    </template>

                    <!-- 用戶選擇 -->
                    <template v-else-if="col.type === formTypes.sel_user">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-select-user-by-dep
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="userCompValues[id]"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :trigger-change="true"
                          :multi="isMultipleSelect(col)"
                          @change="(v)=>handleChangeUserCommon(v,id,row,col)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ userCompValues[id] }}</span>
                      </a-tooltip>
                    </template>

                    <!-- date -->
                    <template v-else-if="col.type === formTypes.date || col.type === formTypes.datetime">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-date
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="jdateValues[id]"
                          :getCalendarContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :trigger-change="true"
                          :showTime="col.type === formTypes.datetime"
                          :dateFormat="col.type === formTypes.date? 'YYYY-MM-DD':'YYYY-MM-DD HH:mm:ss'"
                          allowClear
                          @change="(v)=>handleChangeJDateCommon(v,id,row,col,col.type === formTypes.datetime)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ jdateValues[id] }}</span>
                      </a-tooltip>
                    </template>

                    <!-- time -->
                    <template v-else-if="col.type === formTypes.time">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-time
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="jdateValues[id]"
                          :getCalendarContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          allowClear
                          @change="(v)=>handleChangeJDateCommon(v,id,row,col)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ jdateValues[id] }}</span>
                      </a-tooltip>
                    </template>

                    <!-- input_pop -->
                    <template v-else-if="col.type === formTypes.input_pop||col.type === 'textarea'">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-input-pop
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          :width="300"
                          :height="210"
                          :pop-container="`${caseId}tbody`"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="jInputPopValues[id]"
                          :getCalendarContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          @change="(v)=>handleChangeJInputPopCommon(v,id,row,col)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ jInputPopValues[id] }}</span>
                      </a-tooltip>
                    </template>
                    <!-- upload -->
                    <div v-else-if="col.type === formTypes.upload" :key="i">
                      <template v-if="uploadValues[id] != null" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <a-input
                          :key="fileKey"
                          :readOnly="true"
                          :value="file.name"
                        >

                          <template slot="addonBefore" style="width: 30px">
                            <a-tooltip v-if="file.status==='uploading'" :title="`上傳中(${Math.floor(file.percent)}%)`">
                              <a-icon type="loading"/>
                            </a-tooltip>
                            <a-tooltip v-else-if="file.status==='done'" title="上傳完成">
                              <a-icon type="check-circle" style="color:#00DB00;"/>
                            </a-tooltip>
                            <a-tooltip v-else :title="file.message||'上傳失敗'">
                              <a-icon type="exclamation-circle" style="color:red;"/>
                            </a-tooltip>
                          </template>

                          <template v-if="col.allowDownload!==false || col.allowRemove!==false" slot="addonAfter" style="width: 30px">
                            <a-dropdown :trigger="['click']" placement="bottomRight" :getPopupContainer="getParentContainer">
                              <a-tooltip title="操作" :getPopupContainer="getParentContainer">
                                <a-icon
                                  v-if="file.status!=='uploading'"
                                  type="setting"
                                  style="cursor: pointer;"/>
                              </a-tooltip>

                              <a-menu slot="overlay">
                                <a-menu-item v-if="col.allowDownload!==false" @click="handleClickDownloadFile(id)">
                                  <span><a-icon type="download"/>&nbsp;下載</span>
                                </a-menu-item>
                                <a-menu-item v-if="col.allowRemove!==false" @click="handleClickDelFile(id)">
                                  <span><a-icon type="delete"/>&nbsp;刪除</span>
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </template>

                        </a-input>
                      </template>

                      <div :hidden="uploadValues[id] != null">
                        <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                          <a-upload
                            name="file"
                            :data="{'isup':1, ...(col.data||{})}"
                            :multiple="false"
                            :action="col.action"
                            :headers="uploadGetHeaders(row,col)"
                            :showUploadList="false"
                            v-bind="buildProps(row,col)"
                            @change="(v)=>handleChangeUpload(v,id,row,col)"
                          >
                            <a-button icon="upload">{{ col.placeholder }}</a-button>
                          </a-upload>
                        </a-tooltip>
                      </div>

                    </div>

                    <!-- update-begin-author:taoyan date:0827 for：popup -->
                    <template v-else-if="col.type === formTypes.popup">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-popup
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          :placeholder="replaceProps(col, col.placeholder)"
                          style="width: 100%;"
                          :value="getPopupValue(id)"
                          :field="col.field || col.key"
                          :org-fields="col.orgFields"
                          :dest-fields="col.destFields"
                          :code="col.popupCode"
                          :groupId="caseId"
                          :param="col.param"
                          :sorter="col.sorter"
                          @input="(value,others)=>popupCallback(value,others,id,row,col,rowIndex)"
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ getPopupValue(id) }}</span>
                      </a-tooltip>
                    </template>
                    <!-- update-end-author:taoyan date:0827 for：popup -->

                    <!-- update-beign-author:taoyan date:0827 for：文件/圖片邏輯新增 -->
                    <div v-else-if="col.type === formTypes.file" :key="i">
                      <template v-if="hasUploadValue(id)" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <div :key="fileKey" style="position: relative;">
                          <a-tooltip v-if="file.status==='uploading'" :title="`上傳中(${Math.floor(file.percent)}%)`">
                            <a-icon type="loading" style="color:red;"/>
                            <span style="color:red;margin-left:5px">{{  file.status }}</span>
                          </a-tooltip>

                          <a-tooltip v-else-if="file.status==='done'" :title="file.name">
                            <a-icon type="paper-clip" />
                            <span style="margin-left:5px">{{ getEllipsisWord(file.name,5) }}</span>
                          </a-tooltip>

                          <a-tooltip v-else :title="file.message||'上傳失敗'">
                            <a-icon type="exclamation-circle" style="color:red;"/>
                            <span style="margin-left:5px">{{ getEllipsisWord(file.name,5) }}</span>
                          </a-tooltip>

                          <template style="width: 30px">
                            <a-dropdown :trigger="['click']" placement="bottomRight" :getPopupContainer="getParentContainer" style="margin-left: 10px;">
                              <a-tooltip title="操作" :getPopupContainer="getParentContainer">
                                <a-icon v-if="file.status!=='uploading'" type="setting" style="cursor: pointer;"/>
                              </a-tooltip>

                              <a-menu slot="overlay">
                                <a-menu-item v-if="col.allowDownload!==false" @click="handleClickDownFileByUrl(id)">
                                  <span><a-icon type="download"/>&nbsp;下載</span>
                                </a-menu-item>
                                <a-menu-item @click="handleClickDelFile(id)">
                                  <span><a-icon type="delete"/>&nbsp;刪除</span>
                                </a-menu-item>
                                <a-menu-item @click="handleMoreOperation(id,col,col)">
                                  <span><a-icon type="bars" /> 更多</span>
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </template>
                        </div>
                      </template>

                      <div :hidden="hasUploadValue(id)">
                        <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                          <a-upload
                            name="file"
                            :data="{'isup':1}"
                            :multiple="false"
                            :action="getUploadAction(col.action)"
                            :headers="uploadGetHeaders(row,col)"
                            :showUploadList="false"
                            v-bind="buildProps(row,col)"
                            @change="(v)=>handleChangeUpload(v,id,row,col)"
                          >
                            <a-button icon="upload">上傳文件</a-button>
                          </a-upload>
                        </a-tooltip>
                      </div>

                    </div>

                    <div v-else-if="col.type === formTypes.image" :key="i">
                      <template v-if="hasUploadValue(id)" v-for="(file,fileKey) of [(uploadValues[id]||{})]">
                        <div :key="fileKey" style="position: relative;">
                          <template v-if="!uploadValues[id] || !(uploadValues[id]['url'] || uploadValues[id]['path'] || uploadValues[id]['message'])">
                            <a-icon type="loading"/>
                          </template>
                          <template v-else-if="uploadValues[id]['path']">
                            <img class="j-editable-image" :src="getCellImageView(id)" alt="無圖片" @click="handleMoreOperation(id,'img',col)"/>
                          </template>
                          <a-tooltip v-else :title="file.message||'上傳失敗'" @click="handleClickShowImageError(id)">
                            <a-icon type="exclamation-circle" style="color:red;"/>
                          </a-tooltip>

                          <template style="width: 30px">
                            <a-dropdown :trigger="['click']" placement="bottomRight" :getPopupContainer="getParentContainer" style="margin-left: 10px;">
                              <a-tooltip title="操作" :getPopupContainer="getParentContainer">
                                <a-icon
                                  v-if="file.status!=='uploading'"
                                  type="setting"
                                  style="cursor: pointer;"/>
                              </a-tooltip>

                              <a-menu slot="overlay">
                                <a-menu-item v-if="col.allowDownload!==false" @click="handleClickDownFileByUrl(id)">
                                  <span><a-icon type="download"/>&nbsp;下載</span>
                                </a-menu-item>
                                <a-menu-item @click="handleClickDelFile(id)">
                                  <span><a-icon type="delete"/>&nbsp;刪除</span>
                                </a-menu-item>
                                <a-menu-item @click="handleMoreOperation(id,'img',col)">
                                  <span><a-icon type="bars" /> 更多</span>
                                </a-menu-item>
                              </a-menu>
                            </a-dropdown>
                          </template>

                        </div>
                      </template>

                      <div :hidden="hasUploadValue(id)">
                        <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                          <a-upload
                            name="file"
                            :data="{'isup':1}"
                            :multiple="false"
                            :action="getUploadAction(col.action)"
                            :headers="uploadGetHeaders(row,col)"
                            :showUploadList="false"
                            v-bind="buildProps(row,col)"
                            @change="(v)=>handleChangeUpload(v,id,row,col)"
                          >
                            <a-button icon="upload">上傳圖片</a-button>
                          </a-upload>
                        </a-tooltip>
                      </div>

                    </div>
                    <!-- update-end-author:taoyan date:0827 for：圖片邏輯新增 -->

                    <!-- radio-begin -->
                    <template v-else-if="col.type === formTypes.radio">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <a-radio-group
                          :id="id"
                          :key="i"
                          v-bind="buildProps(row,col)"
                          :value="radioValues[id]"
                          @change="(e)=>handleRadioChange(e.target.value,id,row,col)">
                          <a-radio v-for="(item, key) in col.options" :key="key" :value="item.value">{{ item.text }}</a-radio>
                        </a-radio-group>
                      </a-tooltip>
                    </template>
                    <!-- radio-end -->

                    <!-- select多選 -begin -->
                    <template v-else-if="col.type === formTypes.list_multi">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <a-select
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          mode="multiple"
                          :maxTagCount="1"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="multiSelectValues[id]"
                          :options="col.options"
                          :getPopupContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          @change="(v)=>handleMultiSelectChange(v,id,row,col)"
                          allowClear
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ getSelectTranslateText(multiSelectValues[id], row, col) }} </span>
                      </a-tooltip>
                    </template>
                    <!-- select多選 -end -->

                    <!-- select搜索 -begin -->
                    <template v-else-if="col.type === formTypes.sel_search">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <a-select
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          showSearch
                          optionFilterProp="children"
                          :filterOption="filterOption"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          :value="searchSelectValues[id]"
                          :options="col.options"
                          :getPopupContainer="getParentContainer"
                          :placeholder="replaceProps(col, col.placeholder)"
                          @change="(v)=>handleSearchSelectChange(v,id,row,col)"
                          allowClear
                        />
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ getSelectTranslateText(searchSelectValues[id], row, col) }}</span>
                      </a-tooltip>
                    </template>
                    <!-- select搜索 -end -->

                    <!-- select異步搜索 -begin -->
                    <template v-else-if="col.type === formTypes.sel_search_async">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <j-search-select-tag
                          v-if="isEditRow(row, col)"
                          :id="id"
                          :key="i"
                          :value="searchSelectAsyncValues[id]"
                          :placeholder="replaceProps(col, col.placeholder)"
                          :dict="col.dict"
                          :async="true"
                          :getPopupContainer="getParentContainer"
                          v-bind="buildProps(row,col)"
                          style="width: 100%;"
                          @change="(v)=>handleSearchSelectAsyncChange(v,id,row,col)"
                        >
                        </j-search-select-tag>
                        <span
                          v-else
                          class="j-td-span no-edit"
                          :class="{disabled: buildProps(row,col).disabled}"
                          @click="handleEditRow(row, col)"
                        >{{ searchSelectAsyncValues[id] }}</span>
                      </a-tooltip>
                    </template>
                    <!-- select異步搜索 -end -->

                    <div v-else-if="col.type === formTypes.slot" :key="i">
                      <a-tooltip v-bind="buildTooltipProps(row, col, id)">
                        <slot
                          :name="(col.slot || col.slotName) || col.key"
                          :index="rowIndex"
                          :text="slotValues[id]"
                          :value="slotValues[id]"
                          :column="col"
                          :rowId="getCleanId(row.id)"
                          :getValue="()=>_getValueForSlot(row.id)"
                          :caseId="caseId"
                          :allValues="_getAllValuesForSlot()"
                          :target="getVM()"
                          :handleChange="(v)=>handleChangeSlotCommon(v,id,row,col)"
                          :isNotPass="notPassedIds.includes(col.key+row.id)"
                        />
                      </a-tooltip>
                    </div>

                    <!-- else (normal) -->
                    <span class="comp-normal" v-else :key="i" :title="inputValues[rowIndex][col.key]" v-bind="buildProps(row,col)">{{ inputValues[rowIndex][col.key] }}</span>
                  </template>
                </div>
              </div>
              <!-- -- tr end -- -->

            </template>
          </draggable>


          <!-- 統計行 -->
          <div
            v-if="showStatisticsRow"
            class="tr"
            :style="{
              ...buildTrStyle(rows.length),
              height: '32px'
            }"
          >
            <div v-if="dragSort" class="td td-ds" :style="style.tdLeft">
            </div>
            <div v-if="rowSelection" class="td td-cb" :style="style.tdLeft">
              統計
            </div>
            <div v-if="rowNumber" class="td td-num" :style="style.tdLeft">
              <span v-if="!rowSelection">統計</span>
            </div>

            <!-- 右側動態生成td -->
            <template v-for="col in columns">
              <div
                :key="col.key"
                class="td"
                v-show="col.type !== formTypes.hidden"
                :style="buildTdStyle(col)"
              >
                <span
                  v-show="col.type === formTypes.inputNumber"
                  style="padding: 0 5px;"
                >{{statisticsColumns[col.key]}}</span>
              </div>
            </template>

          </div>

        </div>
      </div>
      <j-file-pop ref="filePop" @ok="handleFileSuccess" :number="number"></j-file-pop>
    </div>
  </a-spin>
</template>

<script>
  import Vue from 'vue'
  import Draggable from 'vuedraggable'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { FormTypes, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { cloneObject, getEventPath, randomNumber, randomString } from '@/utils/util'
  import JDate from '@/components/jeecg/JDate'
  import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { getFileAccessHttpUrl } from '@/api/manage'
  import JInputPop from '@/components/jeecg/minipop/JInputPop'
  import JFilePop from '@/components/jeecg/minipop/JFilePop'
  import { getNoAuthCols } from '@/utils/authFilter'

  // 行高，需要在實例加載完成前用到
  let rowHeight = 61

  export default {
    name: 'JEditableTable',
    components: { JDate, Draggable, JInputPop, JFilePop },
    provide() {
      return {
        parentIsJEditableTable: true,
        getDestroyCleanGroupRequest: () => this.destroyCleanGroupRequest,
      }
    },
    props: {
      // 列信息
      columns: {
        type: Array,
        required: true
      },
      // 數據源
      dataSource: {
        type: Array,
        required: true,
        default: () => []
      },
      // 是否顯示操作按鈕
      actionButton: {
        type: Boolean,
        default: false
      },
      // 是否顯示添加按鈕選項
      addButtonSettings: {
        type: Boolean,
        default: false
      },
      // 是否顯示行號
      rowNumber: {
        type: Boolean,
        default: false
      },
      // 是否可選擇行
      rowSelection: {
        type: Boolean,
        default: false
      },
      // 頁面是否在加載中
      loading: {
        type: Boolean,
        default: false
      },
      // 表格內容區域最大高度
      maxHeight: {
        type: Number,
        default: 400
      },
      // 要禁用的行
      disabledRows: {
        type: Object,
        default() {
          return {}
        }
      },
      // 是否禁用全部組件
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否可拖拽排序
      dragSort: {
        type: Boolean,
        default: false
      },
      dragSortKey: {
        type: String,
        default: 'orderNum'
      },
      // 是否一直顯示編輯框，如果為false則只有點擊的時候才出現輸入框
      alwaysEdit: {
        type: Boolean,
        default: true
      },
      authPre: {
        type: String,
        required: false,
        default: ''
      },
    },
    data() {
      return {
        // 是否首次運行
        isFirst: true,
        // 當前實例是否是行編輯
        isJEditableTable: true,
        // caseId，用於防止有多個實例的時候會衝突
        caseId: `_jet-${randomString(6)}-`,
        // 臨時ID標識，凡是以該標識結尾的ID都是臨時ID，不添加到數據庫中
        tempId: `_tid-${randomString(6)}`,
        // 存儲document element 對象
        el: {
          inputTable: null,
          tbody: null
        },
        // 存儲各個div的style
        style: {
          // 'max-height': '400px'
          tbody: { left: '0px' },
          // 左側固定td的style
          tdLeft: {},
        },
        // 表單的類型
        formTypes: FormTypes,
        // 行數據
        rows: [],
        // 行高，height + padding + border
        rowHeight,
        // 滾動條頂部距離
        scrollTop: 0,
        // 綁定 select 的值
        selectValues: {},
        // 綁定 checkbox 的值
        checkboxValues: {},
        // 綁定 jdate 的值
        jdateValues: {},
        // 綁定jinputpop
        jInputPopValues:{},
        // 綁定插槽數據
        slotValues: {},
        // file 信息
        uploadValues: {},
        //popup信息
        popupValues: {},
        //部門組件信息
        departCompValues:{},
        //用戶組件信息
        userCompValues: {},

        radioValues: {},
        metaCheckboxValues: {},
        multiSelectValues: {},
        searchSelectValues: {},
        searchSelectAsyncValues: {},
        // 綁定左側選擇框已選擇的id
        selectedRowIds: [],
        // 存儲被刪除行的id
        deleteIds: [],
        // 存儲顯示tooltip的信息
        tooltips: {},
        // 存儲沒有通過驗證的inputId
        notPassedIds: [],

        // 當前是否正在拖拽排序
        dragging: false,
        // 是否有統計列
        hasStatisticsColumn: false,
        statisticsColumns: {},
        // 只有在行編輯被銷毀時才主動清空GroupRequest的內存
        destroyCleanGroupRequest: false,
        // 當前正在編輯的行的id
        currentEditRows: {},
        // 上次push數據的事件，用於判斷是否點擊過快
        lastPushTimeMap: new Map(),
        number:0,
        //不顯示的按鈕編碼
        excludeCode:[],
        // 選項配置
        settings: {
          // 添加行數
          addRowNum: 1,
          // 添加位置（下標），0 = 最底部
          addIndex: 0,
          // 添加後滾動到底部
          addScrollToBottom: false,
        },
      }
    },
    created() {
      this.inputValues = []
      // 當前顯示的tr
      this.visibleTrEls = []
      this.disabledRowIds = (this.disabledRowIds || [])
      // 解決火狐瀏覽器下拖拽會打開新的Tab的問題
      document.body.ondrop = (event) => {
        if (this.dragging) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
      this.getSavedAddButtonSettings()
    },
    // 計算屬性
    computed: {
      // expandHeight = rows.length * rowHeight
      getExpandHeight() {
        let length = this.rows.length * this.rowHeight
        if (this.showStatisticsRow) {
          length += 34
        }
        return length
      },
      // 是否顯示統計行
      showStatisticsRow() {
        return this.hasStatisticsColumn && this.rows.length > 0
      },
      // 獲取是否選擇了部分
      getSelectIndeterminate() {
        return (this.selectedRowIds.length > 0 &&
          this.selectedRowIds.length < this.rows.length)
      },
      // 獲取是否選擇了全部
      getSelectAll() {
        return (this.selectedRowIds.length === this.rows.length) && this.rows.length > 0
      },
      tbodyStyle() {
        let style = Object.assign({}, this.style.tbody)
        // style['max-height'] = `${this.maxHeight}px`
        style['width'] = this.realTrWidth
        return style
      },
      showClearSelectButton() {
        let count = 0
        for (let key in this.disabledRows) {
          if (this.disabledRows.hasOwnProperty(key)) count++
        }
        return count > 0
      },
      accessToken() {
        return Vue.ls.get(ACCESS_TOKEN)
      },
      realTrWidth() {
        let splice = ' + '
        let calcWidth = 'calc('
        this.columns.forEach((column, i) => {
          let { type, width } = column
          // 隱藏字段不參與計算
          if (type !== FormTypes.hidden) {
            if (typeof width === 'number') {
              calcWidth += width + 'px'
            } else if (typeof width === 'string') {
              calcWidth += width
            } else {
              calcWidth += '120px'
            }
            calcWidth += splice
          }
        })
        if (calcWidth.endsWith(splice)) {
          calcWidth = calcWidth.substring(0, calcWidth.length - splice.length)
        }
        calcWidth += ')'
        // console.log('calcWidth: ', calcWidth)
        return calcWidth
      }
    },
    // 偵聽器
    watch: {
      rows: {
        immediate: true,
        handler(val, old) {
          // val.forEach(item => {
          //   for (let inputValue of  this.inputValues) {
          //     if (inputValue.id === item.id) {
          //       item['dbFieldName'] = inputValue['dbFieldName']
          //       break
          //     }
          //   }
          // })
          // console.log('watch.rows:', cloneObject({ val, old }))
        }
      },
      dataSource: {
        immediate: true,
        handler: function (newValue) {
          // 兼容IE
          this.getElementPromise('tbody').then(() => {
            this.initialize()
            this._pushByDataSource(newValue)
          })
        }
      },
      columns: {
        immediate: true,
        handler(columns) {
          //列改變的時候重新設置按鈕權限信息
          this.loadExcludeCode()
          // 兼容IE
          this.getElementPromise('tbody').then(() => {
            columns.forEach(column => {
              if (column.type === FormTypes.select || column.type === FormTypes.list_multi || column.type === FormTypes.sel_search) {
                // 兼容 舊版本 options
                if (column.options instanceof Array) {
                  column.options = column.options.map(item => {
                    if (item) {
                      return {
                        ...item,
                        text: item.text || item.title,
                        title: item.text || item.title
                      }
                    }
                    return {}
                  })
                }
                if (column.dictCode) {
                  this._loadDictConcatToOptions(column)
                }
              }
            })
          })
        }
      },
      // 當selectRowIds改變時觸發事件
      selectedRowIds(newValue) {
        this.$emit('selectRowChange', cloneObject(newValue).map(i => this.getCleanId(i)))
      }
    },
    mounted() {
      let vm = this
      /** 監聽滾動條事件 */
      this.getElement('inputTable').onscroll = function (event) {
        vm.syncScrollBar(event.target.scrollLeft)
      }
      this.getElement('tbody').onscroll = function (event) {
        // vm.recalcTrHiddenItem(event.target.scrollTop)
      }

      let { thead, scrollView } = this.$refs
      scrollView.onscroll = function (event) {

        // console.log(event.target.scrollTop, ' - ', event.target.scrollLeft)

        thead.scrollLeft = event.target.scrollLeft

        vm.recalcTrHiddenItem(event.target.scrollTop)

      }

      // 添加事件監聽
      this.addEventListener()

    },
    methods: {
      // 判斷文件/圖片是否存在
      hasUploadValue(id){
        let flag = this.uploadValues[id] != null && this.uploadValues[id].toString().length>0
        return flag;
      },
      getElement(id, noCaseId = false) {
        if (!this.el[id]) {
          this.el[id] = document.getElementById((noCaseId ? '' : this.caseId) + id)
        }
        return this.el[id]
      },

      getElementPromise(id, noCaseId = false) {
        return new Promise((resolve) => {
          let timer = setInterval(() => {
            let element = this.getElement(id, noCaseId)
            if (element) {
              clearInterval(timer)
              resolve(element)
            }
          }, 10)
        })
      },

      /** 初始化列表 */
      initialize() {
        this.visibleTrEls = []
        // 判斷是否是首次進入該方法，如果是就不清空行，防止刪除了預添加的數據
        if (!this.isFirst) {
         this.clearRow();
        } else {
          this.isFirst = false
        }
      },
      /**清空行*/
      clearRow(){
        // inputValues：用來存儲input表單的值
        // 數組裡的每項都是一個對象，對象裡每個key都是input的rowKey，值就是input的值，其中有個id的字段來區分
        // 示例：
        // [{
        //    id: "_jet-4sp0iu-15541771111770"
        //    dbDefaultVal: "aaa",
        //    dbFieldName: "bbb",
        //    dbFieldTxt: "ccc",
        //    dbLength: 32
        // }]
        this.inputValues = []
        this.rows = []
        this.deleteIds = []
        this.selectedRowIds = []
        this.tooltips = {}
        this.notPassedIds = []
        // 重置values
        this.selectValues = {}
        this.checkboxValues = {}
        this.jdateValues = {}
        this.jInputPopValues = {}
        this.departCompValues = {}
        this.userCompValues = {}
        this.slotValues = {}
        //update-begin-author:shunjlei date:20210415 for:類型賦值錯誤
        this.uploadValues = {}
        this.popupValues = {}
        this.radioValues = {}
        this.multiSelectValues = {}
        this.searchSelectValues = {}
        this.searchSelectAsyncValues = {}
        //update-end-author:shunjlei date:20210415 for:類型賦值錯誤

        // 重置滾動條
        this.scrollTop = 0
        this.$nextTick(() => {
          this.getElement('tbody').scrollTop = 0
        })
      },
      /** 同步滾動條狀態 */
      syncScrollBar(scrollLeft) {
        // this.style.tbody.left = `${scrollLeft}px`
        // this.getElement('tbody').scrollLeft = scrollLeft
      },
      /** 重置滾動條位置，參數留空則滾動到上次記錄的位置 */
      resetScrollTop(top) {
        let { scrollView } = this.$refs
        if (top != null && typeof top === 'number') {
          scrollView.scrollTop = top
        } else {
          scrollView.scrollTop = this.scrollTop
        }
      },
      /** 重新計算需要隱藏或顯示的tr */
      recalcTrHiddenItem(top) {
        let diff = top - this.scrollTop
        if (diff < 0) {
          diff = this.scrollTop - top
        }
        // 只有在滾動了百分之三十的行高的距離時才進行更新
        if (diff >= this.rowHeight * 0.3) {
          this.scrollTop = top
          // 更新form表單的值
          this.$nextTick(() => {
            this.updateFormValues()
          })
        }
      },
      /** 生成id */
      generateId(rows) {
        if (!(rows instanceof Array)) {
          rows = this.rows || []
        }
        let timestamp = new Date().getTime()
        return `${this.caseId}${timestamp}${rows.length}${randomNumber(6)}${this.tempId}`
      },
      /** push 一條數據 */
      push(record, update = true, rows, insertIndex = null, setDefaultValue = true) {
        return this._pushByDataSource([record], [insertIndex], update, rows, setDefaultValue)
      },

      /**
       * push 數據
       *
       * @param dataSource 數據源
       * @param insertIndexes 行插入位置，和dataSource的下標一一對應
       * @param update 是否更新
       * @param rows 若不傳就使用 this.rows
       * @param setDefaultValue 是否填充默認值
       *
       */
      _pushByDataSource(dataSource, insertIndexes = null, update = true, rows = null, setDefaultValue = false) {
        if (!(rows instanceof Array)) {
          rows = [...this.rows] || []
        }
        let checkboxValues = { ...this.checkboxValues }
        let selectValues = { ...this.selectValues }
        let jdateValues = { ...this.jdateValues }
        let departCompValues = { ...this.departCompValues }
        let userCompValues = { ...this.userCompValues }
        let jInputPopValues = { ...this.jInputPopValues }
        let slotValues = { ...this.slotValues }
        let uploadValues = { ...this.uploadValues }
        let popupValues = { ...this.popupValues }
        let radioValues = { ...this.radioValues }
        let multiSelectValues = { ...this.multiSelectValues }
        let searchSelectValues = { ...this.searchSelectValues }
        let searchSelectAsyncValues = { ...this.searchSelectAsyncValues }
        // 禁用行的id
        let disabledRowIds = (this.disabledRowIds || [])
        dataSource.forEach((data, newValueIndex) => {
          // 不能直接更改數據源的id
          let dataId = data.id
          // 判斷源數據是否帶有id
          if (dataId == null || dataId === '') {
            dataId = this.generateId(rows)
          } else if(!this.hasCaseId(dataId)) {
            dataId = this.caseId + dataId
          }
          let row = { id: dataId }
          let value = { id: dataId }
          let disabled = false
          this.columns.forEach(column => {
            let inputId = column.key + value.id
            let sourceValue = (data[column.key] == null ? '' : data[column.key]).toString()

            let defaultValue = null;
            if (setDefaultValue) {
              defaultValue = column.defaultValue || (column.defaultValue === 0 ? 0 : '')
              if (defaultValue instanceof Array) {
                defaultValue = defaultValue.join(',')
              }

              sourceValue = (typeof sourceValue === 'number' || sourceValue) ? sourceValue : defaultValue
            }
            let sourceValueIsEmpty = (sourceValue == null || sourceValue === '')

            if (column.type === FormTypes.inputNumber) {
              // 判斷是否是排序字段，如果是就賦最大值
              if (column.isOrder === true) {
                value[column.key] = this.getInputNumberMaxValue(column) + 1
              } else {
                value[column.key] = sourceValue
              }
              // 判斷是否是統計列
              if (column.statistics) {
                this.hasStatisticsColumn = true
                if (!this.statisticsColumns[column.key]) {
                  this.$set(this.statisticsColumns, column.key, 0)
                }
              }

            } else if (column.type === FormTypes.checkbox) {
              //判斷是否設定了customValue（自定義值）
              if (column.customValue instanceof Array) {
                let customValue = (column.customValue[0] || '').toString()
                if (sourceValueIsEmpty && setDefaultValue) {
                  sourceValue = column.defaultChecked ? customValue : sourceValue
                }
                checkboxValues[inputId] = (sourceValue === customValue)
              } else {
                if (sourceValueIsEmpty && setDefaultValue) {
                  checkboxValues[inputId] = !!column.defaultChecked
                } else {
                  checkboxValues[inputId] = sourceValue
                }
              }

            } else if (column.type === FormTypes.select) {
              if (!sourceValueIsEmpty) {
                // 判斷是否是多選
                if (typeof sourceValue === 'string' && (column.props || {})['mode'] === 'multiple') {
                  sourceValue = sourceValue === '' ? [] : sourceValue.split(',')
                }
                selectValues[inputId] = sourceValue
              } else {
                selectValues[inputId] = undefined
              }

            } else if (column.type === FormTypes.date || column.type === FormTypes.datetime || column.type === FormTypes.time) {
              jdateValues[inputId] = sourceValue

            } else if (column.type === FormTypes.slot) {
              slotValues[inputId] = sourceValue

            } else if (column.type === FormTypes.popup) {
              popupValues[inputId] = sourceValue
            } else if (column.type === FormTypes.sel_depart) {
              departCompValues[inputId] = sourceValue
            } else if (column.type === FormTypes.sel_user) {
              userCompValues[inputId] = sourceValue
            } else if (column.type === FormTypes.input_pop || column.type === 'textarea') {
              jInputPopValues[inputId] = sourceValue
            } else if (column.type === FormTypes.radio) {
              radioValues[inputId] = sourceValue
            } else if (column.type === FormTypes.sel_search) {
              searchSelectValues[inputId] = sourceValue
            } else if (column.type === FormTypes.sel_search_async) {
              searchSelectAsyncValues[inputId] = sourceValue
            } else if (column.type === FormTypes.list_multi) {
              if (typeof sourceValue === 'string' && sourceValue.length > 0) {
                multiSelectValues[inputId] = sourceValue.split(',')
              } else {
                multiSelectValues[inputId] = []
              }
            } else if (column.type === FormTypes.upload || column.type === FormTypes.file || column.type === FormTypes.image) {
              if (sourceValue) {
                let fileName = ''
                if (sourceValue.indexOf(',') > 0) {
                  let sourceValue2 = sourceValue.split(',')[0]
                  fileName = sourceValue2.substring(sourceValue2.lastIndexOf('/') + 1)
                } else {
                  fileName = sourceValue.substring(sourceValue.lastIndexOf('/') + 1)
                }
                uploadValues[inputId] = {
                  name: fileName,
                  status: 'done',
                  path: sourceValue
                }
              } else {
                uploadValues[inputId] = null
              }
            } else {
              value[column.key] = sourceValue
            }

            // 解析disabledRows
            for (let columnKey in this.disabledRows) {
              // 判斷是否有該屬性
              if (this.disabledRows.hasOwnProperty(columnKey) && data.hasOwnProperty(columnKey)) {
                if (disabled !== true) {
                  let temp = this.disabledRows[columnKey]
                  // 禁用規則可以是一個數組
                  if (temp instanceof Array) {
                    disabled = temp.includes(data[columnKey])
                  } else {
                    disabled = (temp === data[columnKey])
                  }
                  if (disabled) {
                    disabledRowIds.push(row.id)
                  }
                }
              }
            }
          })
          // 插入行而不是添加到最後
          let added = false
          if (insertIndexes instanceof Array) {
            let insertIndex = insertIndexes[newValueIndex]
            if (typeof insertIndex === 'number') {
              added = true
              rows.splice(insertIndex, 0, row)
              this.inputValues.splice(insertIndex, 0, value)
            }
          }
          //update-begin-author:lvdandan date:20201105 for:LOWCOD-987 【online】js增強的問題--數據對象帶有id，且和現有數據一致時，替換患有數據
          if(-1 !== rows.findIndex(item => item.id === row.id)){
            added = true
            this.inputValues = this.inputValues.map(item => item.id === row.id ? value : item)
          }
          //update-begin-author:lvdandan date:20201105 for:LOWCOD-987 【online】js增強的問題--數據對象帶有id，且和現有數據一致時，替換患有數據
          if (!added) {
            rows.push(row)
            this.inputValues.push(value)
          }
        })
        // 啟用了拖動排序，就重新計算排序編號
        if (this.dragSort) {
          this.inputValues.forEach((item, index) => {
            item[this.dragSortKey] = (index + 1)
          })
        }
        this.disabledRowIds = disabledRowIds
        this.checkboxValues = checkboxValues
        this.selectValues = selectValues
        this.jdateValues = jdateValues
        this.departCompValues = departCompValues
        this.userCompValues = userCompValues
        this.jInputPopValues = jInputPopValues
        this.slotValues = slotValues
        this.uploadValues = uploadValues
        this.popupValues = popupValues
        this.radioValues = radioValues
        this.multiSelectValues = multiSelectValues
        this.searchSelectValues = searchSelectValues
        this.searchSelectAsyncValues = searchSelectAsyncValues
        // 重新計算所有統計列
        this.recalcAllStatisticsColumns()
        // 更新到 dom
        if (update) {
          this.rows = rows

          // 更新form表單的值
          this.$nextTick(() => {
            this.forceUpdateFormValues()
          })
        }
        return rows
      },

      /** 獲取某一數字輸入框列中的最大的值 */
      getInputNumberMaxValue(column) {
        let maxNum = 0
        this.inputValues.forEach((item, index) => {
          let val = item[column.key], num
          try {
            num = parseInt(val)
          } catch {
            num = 0
          }
          // 把首次循環的結果當成最大值
          if (index === 0) {
            maxNum = num
          } else {
            maxNum = (num > maxNum) ? num : maxNum
          }
        })
        return maxNum
      },
      /** 添加一行 */
      add(num = 1, forceScrollToBottom = false) {
        if (num < 1) return
        // let timestamp = new Date().getTime()
        let rows = this.rows
        let row
        for (let i = 0; i < num; i++) {
          rows = this.push({}, false, rows)
          row = rows[rows.length - 1]
        }
        this.rows = rows

        this.$nextTick(() => {
          this.updateFormValues()
        })
        // 觸發add事件
        this.$emit('added', {
          row: (() => {
            let r = Object.assign({}, row)
            r.id = this.getCleanId(r.id)
            return r
          })(),
          target: this
        })
        // 設置滾動條位置
        let tbody = this.getElement('tbody')
        let offsetHeight = tbody.offsetHeight
        let realScrollTop = tbody.scrollTop + offsetHeight
        if (forceScrollToBottom) {
          this.$nextTick(() => {
            this.resetScrollTop(this.$refs.scrollView.scrollHeight)
          })
        }
      },
      /**
       * 在指定位置添加一行
       * @param insertIndex 添加位置下標
       * @param num 添加的行數，默認1
       */
      insert(insertIndex, num = 1, forceScrollToBottom = false) {
        if (this.checkTooFastClick('insert', 1500)) {
          return
        }
        if (!insertIndex && num < 1) return
        let rows = this.rows
        let newRows = []
        for (let i = 0; i < num; i++) {
          let row = { id: this.generateId(rows) }
          rows = this.push(row, false, rows, insertIndex)
          newRows.push(row)
        }
        // 同步更改
        this.rows = rows
        this.$nextTick(() => {
          this.recalcSortNumber()
          this.forceUpdateFormValues()
        })
        // 觸發 insert 事件
        this.$emit('inserted', {
          rows: newRows.map(row => {
            let r = cloneObject(row)
            r.id = this.getCleanId(r.id)
            return r
          }),
          num, insertIndex,
          target: this
        })
        // 設置滾動條位置
        if (forceScrollToBottom) {
          this.$nextTick(() => {
            this.resetScrollTop(this.$refs.scrollView.scrollHeight)
          })
        }
      },
      /** 刪除被選中的行 */
      removeSelectedRows() {
        this.removeRows(this.selectedRowIds)
        this.selectedRowIds = []
      },
      /** 刪除一行或多行 */
      removeRows(id) {
        let ids = id
        if (!(id instanceof Array)) {
          if (typeof id === 'string') {
            ids = [id]
          } else {
            throw  `JEditableTable.removeRows() 函數需要的參數可以是string或Array類型，但提供的卻是${typeof id}`
          }
        }

        let rows = cloneObject(this.rows)
        ids.forEach(removeId => {
          removeId = this.getCleanId(removeId)
          // 找到每個id對應的真實index並刪除
          const findAndDelete = (arr) => {
            for (let i = 0; i < arr.length; i++) {
              let currentId = this.getCleanId(arr[i].id)
              if (currentId === removeId) {
                arr.splice(i, 1)
                return true
              }
            }
          }
          // 找到rows對應的index，並刪除
          if (findAndDelete(rows)) {
            // 找到values對應的index，並刪除
            findAndDelete(this.inputValues)
            // 將caseId去除
            let id = this.getCleanId(removeId)
            this.deleteIds.push(id)
          }
        })
        this.rows = rows
        this.$emit('deleted', this.getDeleteIds(), this)
        this.$nextTick(() => {
          // 更新formValues
          this.updateFormValues()
          // 重新計算統計
          this.recalcAllStatisticsColumns()
        })
        return true
      },

      /** 獲取表格表單裡的值（異步版） */
      getValuesAsync(options = {}, callback) {
        let { validate, rowIds, deleteTempId } = options
        if (typeof validate !== 'boolean') validate = true
        if (!(rowIds instanceof Array)) rowIds = null
        // 是否刪除臨時ID，默認為 false
        if (typeof deleteTempId !== 'boolean') deleteTempId = false
        // console.log('options:', { validate, rowIds })

        let asyncCount = 0
        let error = 0
        let inputValues = cloneObject(this.inputValues)
        let tooltips = Object.assign({}, this.tooltips)
        let notPassedIds = cloneObject(this.notPassedIds)
        // 用於存儲合併後的值
        let values = []
        // 遍歷inputValues來獲取每行的值
        for (let value of inputValues) {
          let rowIdsFlag = false
          // 如果帶有rowIds，那麼就只存這幾行的數據
          if (rowIds == null) {
            rowIdsFlag = true
          } else {
            for (let rowId of rowIds) {
              if (this.getCleanId(rowId) === this.getCleanId(value.id)) {
                rowIdsFlag = true
                break
              }
            }
          }

          if (!rowIdsFlag) continue

          this.columns.forEach(column => {
            let inputId = column.key + value.id
            if (column.type === FormTypes.checkbox) {
              let checked = this.checkboxValues[inputId]
              if (column.customValue instanceof Array) {
                value[column.key] = checked ? column.customValue[0] : column.customValue[1]
              } else {
                value[column.key] = checked
              }

            } else if (column.type === FormTypes.select) {
              let selected = this.selectValues[inputId]
              if (selected instanceof Array) {
                value[column.key] = cloneObject(selected)
              } else {
                value[column.key] = selected
              }

            } else if (column.type === FormTypes.date || column.type === FormTypes.datetime || column.type === FormTypes.time) {
              value[column.key] = this.jdateValues[inputId]

            } else if (column.type === FormTypes.sel_depart) {
              value[column.key] = this.departCompValues[inputId]

            } else if (column.type === FormTypes.sel_user) {
              value[column.key] = this.userCompValues[inputId]

            } else if (column.type === FormTypes.input_pop || column.type === 'textarea') {
              value[column.key] = this.jInputPopValues[inputId]

            } else if (column.type === FormTypes.upload) {
              value[column.key] = cloneObject(this.uploadValues[inputId] || null)

            } else if (column.type === FormTypes.image || column.type === FormTypes.file) {
              let currUploadObj = cloneObject(this.uploadValues[inputId] || null)
              if (currUploadObj) {
                value[column.key] = currUploadObj['path'] || null
              }

            } else if (column.type === FormTypes.popup) {
              if (!value[column.key]) {
                value[column.key] = this.popupValues[inputId] || null
              }
            } else if (column.type === FormTypes.radio) {
              value[column.key] = this.radioValues[inputId]
            } else if (column.type === FormTypes.sel_search) {
              value[column.key] = this.searchSelectValues[inputId]
            } else if (column.type === FormTypes.sel_search_async) {
              value[column.key] = this.searchSelectAsyncValues[inputId]
            } else if (column.type === FormTypes.list_multi) {
              if (!this.multiSelectValues[inputId] || this.multiSelectValues[inputId].length === 0) {
                value[column.key] = ''
              } else {
                value[column.key] = this.multiSelectValues[inputId].join(',')
              }
            } else if (column.type === FormTypes.slot) {
              value[column.key] = this.slotValues[inputId]
            }


            // 檢查表單驗證
            if (validate === true) {
              const handleValidateOneInput = (results) => {
                tooltips[inputId] = results[0]
                if (tooltips[inputId].passed === false) {
                  error++
                  // if (error++ === 0) {
                  // let element = document.getElementById(inputId)
                  // while (element.className !== 'tr') {
                  //   element = element.parentElement
                  // }
                  // this.jumpToId(inputId, element)
                  // }
                }
                tooltips[inputId].visible = false
                notPassedIds = results[1]
              }
              asyncCount++
              let results = this.validateOneInputAsync(value[column.key], value, column, notPassedIds, false, 'getValues', (results) => {
                handleValidateOneInput(results)
                asyncCount--
              })
              handleValidateOneInput(results)
            }
          })
          // 刪除 tempId
          if (deleteTempId && this.isTempId(value.id)) {
            delete value.id
          } else {
            value.id = this.getCleanId(value.id)
          }

          values.push(value)
        }

        if (validate === true) {
          this.tooltips = tooltips
          this.notPassedIds = notPassedIds
        }

        const timer = setInterval(() => {
          if (asyncCount === 0) {
            clearInterval(timer)
            if (typeof callback === 'function') {
              callback({ error, values })
            }
          }
        }, 10)

        return { error, values }
      },

      /** 獲取表格表單裡的值（同步版） */
      getValuesSync(options = {}) {
        return this.getValuesAsync(options)
      },

      /** 獲取表格表單裡的值 */
      getValues(callback, validate = true, rowIds) {
        this.getValuesAsync({ validate, rowIds }, ({ error, values }) => {
          if (typeof callback === 'function') {
            callback(error, values)
          }
        })
      },
      /** getValues的Promise版 */
      getValuesPromise(validate = true, rowIds, deleteTempId) {
        return new Promise((resolve, reject) => {
          this.getValuesAsync({ validate, rowIds, deleteTempId }, ({ error, values }) => {
            if (error === 0) {
              resolve(values)
            } else {
              reject(VALIDATE_NO_PASSED)
            }
          })
        })
      },
      /** 獲取被刪除項的id */
      getDeleteIds() {
        return cloneObject(this.deleteIds)
      },
      /** 獲取所有的數據，包括values、deleteIds */
      getAll(validate, deleteTempId) {
        return new Promise((resolve, reject) => {
          let deleteIds = this.getDeleteIds()
          this.getValuesPromise(validate, null, deleteTempId).then((values) => {
            resolve({ values, deleteIds })
          }).catch(error => {
            reject(error)
          })
        })
      },
      /** Sync 獲取所有的數據，包括values、deleteIds */
      getAllSync(validate, rowIds, deleteTempId) {
        let result = this.getValuesSync({ validate, rowIds, deleteTempId })
        result.deleteIds = this.getDeleteIds()
        return result
      },
      // slot 獲取值
      _getValueForSlot(rowId) {
        return this.getValuesSync({ rowIds: [rowId] }).values[0]
      },
      _getAllValuesForSlot() {
        return cloneObject({
          inputValues: this.inputValues,
          selectValues: this.selectValues,
          checkboxValues: this.checkboxValues,
          jdateValues: this.jdateValues,
          departCompValues: this.departCompValues,
          userCompValues: this.userCompValues,
          jInputPopValues: this.jInputPopValues,
          slotValues: this.slotValues,
          uploadValues: this.uploadValues,
          popupValues: this.popupValues,
          radioValues: this.radioValues,
          multiSelectValues: this.multiSelectValues,
          searchSelectValues: this.searchSelectValues,
          searchSelectAsyncValues: this.searchSelectAsyncValues,
        })
      },
      /** 設置某行某列的值 */
      setValues(values) {

        values.forEach(item => {
          let { rowKey, values: newValues } = item
          rowKey = this.getCleanId(rowKey)
          for (let newValueKey in newValues) {
            if (newValues.hasOwnProperty(newValueKey)) {
              let edited = false // 已被修改
              for (let column of this.columns) {
                if (column.key === newValueKey) {
                  let newValue = newValues[newValueKey]
                  this.inputValues.forEach(value => {
                    // 在inputValues中找到了該字段
                    if (rowKey === this.getCleanId(value.id)) {
                      if (value.hasOwnProperty(newValueKey)) {
                        edited = true
                        value[newValueKey] = newValue
                      }
                    }
                  })
                  if (!edited) {
                    let modelKey = `${newValueKey}${this.caseId}${rowKey}`
                    if (column.type === FormTypes.select) {
                      if (newValue !== 0 && !newValue) {
                        edited = this.setOneValue(this.selectValues, modelKey, undefined)
                      } else {
                        edited = this.setOneValue(this.selectValues, modelKey, newValue)
                      }
                    } else if (column.type === FormTypes.checkbox) {
                      // checkbox 特殊處理 CustomValue
                      let key = this.valuesHasOwnProperty(this.checkboxValues, modelKey)
                      // 找到對應的column
                      let sourceValue
                      // 判斷是否設定了customValue（自定義值）
                      if (column.customValue instanceof Array) {
                        let customValue = (column.customValue[0] || '').toString()
                        sourceValue = (newValue === customValue)
                      } else {
                        sourceValue = !!newValue
                      }
                      this.$set(this.checkboxValues, key, sourceValue)
                      edited = true
                    } else if (column.type === FormTypes.date || column.type === FormTypes.datetime || column.type === FormTypes.time) {
                      edited = this.setOneValue(this.jdateValues, modelKey, newValue)
                    } else if (column.type === FormTypes.sel_depart) {
                      edited = this.setOneValue(this.departCompValues, modelKey, newValue)
                    } else if (column.type === FormTypes.sel_user) {
                      edited = this.setOneValue(this.userCompValues, modelKey, newValue)
                    } else if (column.type === FormTypes.input_pop || column.type === 'textarea') {
                      edited = this.setOneValue(this.jInputPopValues, modelKey, newValue)
                    } else if (column.type === FormTypes.slot) {
                      edited = this.setOneValue(this.slotValues, modelKey, newValue)
                    } else if (column.type === FormTypes.upload || column.type === FormTypes.image || column.type === FormTypes.file) {
                      edited = this.setOneValue(this.uploadValues, modelKey, newValue)
                    } else if (column.type === FormTypes.popup) {
                      edited = this.setOneValue(this.popupValues, modelKey, newValue)
                    } else if (column.type === FormTypes.radio) {
                      edited = this.setOneValue(this.radioValues, modelKey, newValue)
                    } else if (column.type === FormTypes.list_multi) {
                      edited = this.setOneValue(this.multiSelectValues, modelKey, newValue, true)
                    } else if (column.type === FormTypes.sel_search) {
                      edited = this.setOneValue(this.searchSelectValues, modelKey, newValue)
                    } else if (column.type === FormTypes.sel_search_async) {
                      edited = this.setOneValue(this.searchSelectAsyncValues, modelKey, newValue)
                    } else {
                      edited = false
                    }
                  }
                  if (edited) {
                    this.elemValueChange(column.type, {[newValueKey]: newValue}, column, newValue)
                  }
                }
              }
              if (!edited) {
                console.warn(`JEditableTable.setValues：沒有找到"${newValueKey}"列`)
              }
            }
          }
        })
        // 強制更新formValues
        this.forceUpdateFormValues()
      },
      /**
       * 設置單個組件的值
       * @param valuesObject 組件存儲值的對象
       * @param modelKey 組件存儲值的對象裡的key
       * @param value 新值
       * @param isMultiple 是否多選，如果是就會對 value 進行一個 split(',') 的操作
       */
      setOneValue(valuesObject, modelKey, value, isMultiple = false) {
        let key = this.valuesHasOwnProperty(valuesObject, modelKey)
        if (key) {
          // 處理多選數組
          if (isMultiple && !Array.isArray(value)) {
            value = (value || '').toString().trim()
            value = value === '' ? [] : value.split(',')
          }
          this.$set(valuesObject, key, value)
          return true
        }
        return false
      },
      valuesHasOwnProperty(values, ownProperty) {
        let key = ownProperty
        if (values.hasOwnProperty(key)) {
          return key
        }
        if (values.hasOwnProperty(key + this.tempId)) {
          return key + this.tempId
        }
        return null
      },

      /** 跳轉到指定位置 */
      // jumpToId(id, element) {
      //   if (element == null) {
      //     element = document.getElementById(id)
      //   }
      //   if (element != null) {
      //     console.log(this.getElement('tbody').scrollTop, element.offsetTop)
      //     this.getElement('tbody').scrollTop = element.offsetTop
      //     console.log(this.getElement('tbody').scrollTop, element.offsetTop)
      //   }
      // },

      /**
       * 驗證單個表單，異步版
       *
       * @param value 校驗的值
       * @param row 校驗的行
       * @param column 校驗的列
       * @param notPassedIds 沒有通過校驗的 id
       * @param update 是否更新到vue中
       * @param validType 校驗觸發的方式（input、blur等）
       * @param callback
       */
      validateOneInputAsync(value, row, column, notPassedIds, update = false, validType = 'input', callback) {
        let tooltips = Object.assign({}, this.tooltips)
        // let notPassedIds = cloneObject(this.notPassedIds)
        let inputId = column.key + row.id
        tooltips[inputId] = tooltips[inputId] ? tooltips[inputId] : {}

        let [passed, message] = this.validateValue(column, value)

        const nextThen = res => {
          let [passed, message] = res
          // !(passed == null && tooltips[inputId].visible != null)
          if (passed != null) {
            tooltips[inputId].visible = !passed
            tooltips[inputId].passed = passed
            let index = notPassedIds.indexOf(inputId)
            if (!passed) {
              tooltips[inputId].title = this.replaceProps(column, message)
              if (index === -1) notPassedIds.push(inputId)
            } else {
              if (index !== -1) notPassedIds.splice(index, 1)
            }
          }
          // 是否更新到data
          if (update) {
            this.tooltips = tooltips
            this.notPassedIds = notPassedIds
          }

          if (typeof callback === 'function') {
            callback([tooltips[inputId], notPassedIds])
          }

        }

        if (typeof passed === 'function') {
          let executed = false
          passed(validType, value, { id: this.getCleanId(row.id) }, { ...column }, (flag, msg) => {
            if (executed) return
            executed = true
            if (typeof msg === 'string') {
              message = msg
            }
            if (flag == null) {
              nextThen([true, message])
            } else {
              nextThen([!!flag, message])
            }
          }, this)
        } else {
          nextThen([passed, message])
        }

        return [tooltips[inputId], notPassedIds]
      },

      /** 驗證單個表單 */
      validateOneInput(value, row, column, notPassedIds, update = false, validType = 'input') {
        return this.validateOneInputAsync(value, row, column, notPassedIds, update, validType)
      },
      /** 通過規則驗證值是否正確 */
      validateValue(column, value) {
        let rules = column.validateRules
        let passed = true, message = ''
        // 判斷有沒有驗證規則或驗證規則格式正不正確，若條件不符合則默認通過
        if (rules instanceof Array) {
          for (let rule of rules) {
            // 當前值是否為空
            let isNull = (value == null || value === '')
            // 驗證規則：非空
            if (rule.required === true && isNull) {
              passed = false
            } else // 使用 else-if 是為了防止一個 rule 中出現兩個規則
            // 驗證規則：唯一校驗
            if (rule.unique === true || rule.pattern === 'only') {
              let { values } = this.getValuesSync({ validate: false })
              let findCount = 0
              for (let val of values) {
                if (val[column.key] === value) {
                  if (++findCount >= 2) {
                    passed = false
                    break
                  }
                }
              }
            } else
            // 驗證規則：正則表達式
            if (!!rule.pattern && !isNull) {

              // 兼容 online 的規則
              let foo = [
                { title: '6到16位數字', value: 'n6-16', pattern: /^\d{6,16}$/ },
                { title: '6到16位任意字符', value: '*6-16', pattern: /^.{6,16}$/ },
                { title: '6到18位字母', value: 's6-18', pattern: /^[a-z|A-Z]{6,18}$/ },
                { title: '網址', value: 'url', pattern: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/ },
                { title: '電子郵件', value: 'e', pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/ },
                { title: '手機號碼', value: 'm', pattern: /^1[3456789]\d{9}$/ },
                { title: '郵政編碼', value: 'p', pattern: /^[1-9]\d{5}$/ },
                { title: '字母', value: 's', pattern: /^[A-Z|a-z]+$/ },
                { title: '數字', value: 'n', pattern: /^-?\d+(\.?\d+|\d?)$/ },
                { title: '整數', value: 'z', pattern: /^-?\d+$/ },
                { title: '非空', value: '*', pattern: /^.+$/ },
                { title: '金額', value: 'money', pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/ },
              ]
              let flag = false
              for (let item of foo) {
                if (rule.pattern === item.value && item.pattern) {
                  passed = new RegExp(item.pattern).test(value)
                  flag = true
                  break
                }
              }
              if (!flag) passed = new RegExp(rule.pattern).test(value)
            } else
            // 校驗規則：自定義函數校驗
            if (typeof rule.handler === 'function') {
              return [rule.handler, rule.message]
            }
            // 如果沒有通過驗證，則跳出循環。如果通過了驗證，則繼續驗證下一條規則
            if (!passed) {
              message = rule.message
              break
            }
          }
        }
        return [passed, message]
      },

      /** 動態更新表單的值 */
      updateFormValues() {
        let trs = this.getElement('tbody').getElementsByClassName('tr')
        let trEls = []
        for (let tr of trs) {
          trEls.push(tr)
        }
        // 獲取新增的 tr
        let newTrEls = trEls
        if (this.visibleTrEls.length > 0) {
          newTrEls = []
          for (let tr of trEls) {
            let isNewest = true
            for (let vtr of this.visibleTrEls) {
              if (vtr.id === tr.id) {
                isNewest = false
                break
              }
            }
            if (isNewest) {
              newTrEls.push(tr)
            }
          }
        }
        this.visibleTrEls = trEls
        // 向新增的tr中賦值
        newTrEls.forEach(tr => {
          let { idx } = tr.dataset
          let value = this.inputValues[idx]
          for (let key in value) {
            if (value.hasOwnProperty(key)) {
              let elid = `${key}${value.id}`
              let el = document.getElementById(elid)
              if (el) {
                el.value = value[key]
              }
            }
          }
        })
      },
      /** 強制更新FormValues */
      forceUpdateFormValues() {
        this.visibleTrEls = []
        this.$forceUpdate()
        this.$nextTick(() => this.updateFormValues())
      },

      // 重新計算所有統計列
      recalcAllStatisticsColumns() {
        if (this.hasStatisticsColumn) {
          Object.keys(this.statisticsColumns).forEach(key => this.recalcOneStatisticsColumn(key))
        }
      },
      // 重新計算單個統計列
      recalcOneStatisticsColumn(key) {
        if (this.hasStatisticsColumn) {
          if (this.statisticsColumns.hasOwnProperty(key)) {
            // 計算合計值
            let count = 0
            this.inputValues.forEach(item => {
              let value = item[key]
              if (value && count !== '-') {
                try {
                  count += Number.parseInt(value)
                } catch (e) {
                  count = '-'
                }
              }
            })
            this.statisticsColumns[key] = count
          }
        }
      },

      /** 獲取某個統計字段的值 */
      getStatisticsValue(key) {
        if (this.hasStatisticsColumn) {
          if (this.statisticsColumns.hasOwnProperty(key)) {
            return this.statisticsColumns[key]
          }
        }
        return null
      },

      /** 全選或取消全選 */
      handleChangeCheckedAll() {
        let selectedRowIds = []
        if (!this.getSelectAll) {
          this.rows.forEach(row => {
            if ((this.disabledRowIds || []).indexOf(row.id) === -1) {
              selectedRowIds.push(row.id)
            }
          })
        }
        this.selectedRowIds = selectedRowIds
      },
      /** 左側行選擇框change事件 */
      handleChangeLeftCheckbox(event) {
        let { id } = event.target

        if ((this.disabledRowIds || []).indexOf(id) !== -1) {
          return
        }

        let index = this.selectedRowIds.indexOf(id)
        if (index !== -1) {
          this.selectedRowIds.splice(index, 1)
        } else {
          this.selectedRowIds.push(id)
        }

      },
      handleClickAdd() {
        let {addRowNum, addIndex, addScrollToBottom} = this.settings
        if (addIndex <= 0) {
          this.add(addRowNum, addScrollToBottom)
        } else {
          this.insert(addIndex, addRowNum, addScrollToBottom)
        }
      },
      handleConfirmDelete() {
        this.removeSelectedRows()
      },
      handleClickClearSelection() {
        this.clearSelection()
      },
      clearSelection() {
        this.selectedRowIds = []
      },
      // 獲取當前選中的行
      getSelection() {
        return this.selectedRowIds.map(id => this.getCleanId(id))
      },
      // 設置當前選中的行
      async setSelection(selectedRowIds) {
        if (Array.isArray(selectedRowIds) && selectedRowIds.length > 0) {
          // 兼容IE
          await this.getElementPromise('tbody')
          await this.$nextTick()
          this.selectedRowIds = selectedRowIds.map(id => {
            let temp = id
            if (!this.hasCaseId(id)) {
              temp = this.caseId + id
            }
            return temp
          })
        }
      },
      // 切換全選狀態
      toggleSelectionAll() {
        this.handleChangeCheckedAll()
      },
      /** 用於搜索下拉框中的內容 */
      handleSelectFilterOption(input, option, column) {
        if (column.allowSearch === true || column.allowInput === true) {
          return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        return true
      },
      /** select 搜索時的事件，用於動態添加options */
      handleSearchSelect(value, id, row, col) {
        if (col.allowSearch !== true && col.allowInput === true) {
          // 是否找到了對應的項，找不到則添加這一項
          let flag = false
          for (let option of col.options) {
            if (option.value.toLocaleString() === value.toLocaleString()) {
              flag = true
              break
            }
          }
          // !!value ：不添加空值
          if (!flag && !!value) {
            // searchAdd 是否是通過搜索添加的
            col.options.push({ title: value, value: value, searchAdd: true })
          }

        }
      },
      // blur 失去焦點
      handleBlurSearch(value, id, row, col) {
        if (col.allowInput === true) {
          // 刪除無用的因搜索（用戶輸入）而創建的項
          if (typeof value === 'string') {
            let indexs = []
            col.options.forEach((option, index) => {
              if (option.value.toLocaleString() === value.toLocaleString()) {
                delete option.searchAdd
              } else if (option.searchAdd === true) {
                indexs.push(index)
              }
            })
            // 翻轉刪除數組中的項
            for (let index of indexs.reverse()) {
              col.options.splice(index, 1)
            }
          }

        }
        // 做單個表單驗證
        this.validateOneInput(value, row, col, this.notPassedIds, true, 'blur')
      },

      /** 觸發已拖動事件 */
      emitDragged(oldIndex, newIndex) {
        this.$emit('dragged', { oldIndex, newIndex, target: this })
      },

      handleDragMoveStart(event) {
        this.dragging = true
        this.$refs.scrollView.style.overflow = 'hidden'
      },

      /** 拖動結束，交換inputValue中的值 */
      handleDragMoveEnd(event) {
        this.dragging = false
        this.$refs.scrollView.style.overflow = 'auto'

        let { oldIndex, newIndex, item: { dataset: { idx: dataIdx } } } = event

        // 由於動態顯示隱藏行導致index有誤差，需要算出真實的index
        let diff = Number.parseInt(dataIdx) - oldIndex
        oldIndex += diff
        newIndex += diff

        this.rowResort(oldIndex, newIndex)
        this.emitDragged(oldIndex, newIndex)
      },

      /** 行重新排序 */
      rowResort(oldIndex, newIndex) {
        const sort = (array) => {
          // 存儲舊數據，並刪除舊項目
          let temp = array[oldIndex]
          array.splice(oldIndex, 1)
          // 向新項目裡添加舊數據
          array.splice(newIndex, 0, temp)
        }

        sort(this.rows)
        sort(this.inputValues)

        this.recalcSortNumber()

        this.forceUpdateFormValues()
      },

      /** 重新計算排序字段的數值 */
      recalcSortNumber() {
        if (this.dragSort) {
          // 重置排序字段
          this.inputValues.forEach((val, idx) => val[this.dragSortKey] = (idx + 1))
        }
      },

      /** 當前行向上移一位 */
      _handleRowMoveUp(rowIndex) {
        if (rowIndex > 0) {
          let newIndex = rowIndex - 1
          this.rowResort(rowIndex, newIndex)
          this.emitDragged(rowIndex, newIndex)
        }
      },

      /** 當前行向下移一位 */
      _handleRowMoveDown(rowIndex) {
        if (rowIndex < (this.rows.length - 1)) {
          let newIndex = rowIndex + 1
          this.rowResort(rowIndex, newIndex)
          this.emitDragged(rowIndex, newIndex)
        }
      },

      /** 在當前行下面插入一行 */
      _handleRowInsertDown(rowIndex) {
        let insertIndex = (rowIndex + 1)
        this.insert(insertIndex)
      },

      /* --- common function begin --- */

      /** input事件 */
      handleInputCommono(target, index, row, column) {
        let oldValue = this.inputValues[index][column.key] || ''
        let { value, dataset, selectionStart } = target
        let type = FormTypes.input
        let change = true
        if (`${dataset.inputNumber}` === 'true') {
          type = FormTypes.inputNumber
          // 判斷輸入的值是否匹配數字正則表達式，不匹配就還原
          if (!/^-?\d+\.?\d*$/.test(value) && (value !== '' && value !== '-')) {
            change = false
            value = oldValue
            target.value = value
            if (typeof selectionStart === 'number') {
              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
          }
        }
        // 存儲輸入的值
        this.inputValues[index][column.key] = value
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'input')

        if (type === FormTypes.inputNumber) {
          this.recalcOneStatisticsColumn(column.key)
        }

        // 觸發valueChange 事件
        if (change) {
          this.elemValueChange(type, row, column, value)
        }
      },
      /** slot Change */
      handleChangeSlotCommon(value, id, row, column) {
        this.slotValues = this.bindValuesChange(value, id, 'slotValues')
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.slot, row, column, value)
      },
      handleBlurCommono(target, index, row, column) {
        let { value, dataset } = target
        if (dataset && `${dataset.inputNumber}` === 'true') {
          // 判斷輸入的值是否匹配數字正則表達式，不匹配就置空
          if (!/^-?\d+\.?\d*$/.test(value)) {
            value = ''
          } else {
            value = Number.parseFloat(value)
          }
          target.value = value
        }
        //update--begin--autor:lvdandan-----date:20201126------for：LOWCOD-1088 JEditableTable輸入校驗提示框位置偏移 #2005
        setTimeout(()=>{
          // 做單個表單驗證
          this.validateOneInput(value, row, column, this.notPassedIds, true, 'blur')
        }, 100)
        //update--end--autor:lvdandan-----date:20201126------for：LOWCOD-1088 JEditableTable輸入校驗提示框位置偏移 #2005
      },
      handleChangeCheckboxCommon(event, row, column) {
        let { id, checked } = event.target
        this.checkboxValues = this.bindValuesChange(checked, id, 'checkboxValues')

        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.checkbox, row, column, checked)
      },
      handleChangeSelectCommon(value, id, row, column) {
        this.selectValues = this.bindValuesChange(value, id, 'selectValues')
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')

        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.select, row, column, value)
      },
      handleChangeJDateCommon(value, id, row, column, showTime) {
        this.jdateValues = this.bindValuesChange(value, id, 'jdateValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')

        // 觸發valueChange 事件
        this.elemValueChange(column.type, row, column, value)
      },
      //部門組件值改變
      handleChangeDepartCommon(value, id, row, column){
        this.departCompValues = this.bindValuesChange(value, id, 'departCompValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.sel_depart, row, column, value)
      },
      //用戶組件值改變
      handleChangeUserCommon(value, id, row, column){
        this.userCompValues = this.bindValuesChange(value, id, 'userCompValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.sel_user, row, column, value)
      },
      handleChangeJInputPopCommon(value, id, row, column){
        this.jInputPopValues = this.bindValuesChange(value, id, 'jInputPopValues')
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.input_pop, row, column, value)
      },
      handleChangeUpload(info, id, row, column) {
        let { file } = info
        let value = {
          name: file.name,
          type: file.type,
          size: file.size,
          status: file.status,
          percent: file.percent
        }
        if (column.responseName && file.response) {
          value['responseName'] = file.response[column.responseName]
        }
        if (file.status === 'done') {
          if (typeof file.response.success === 'boolean') {
            // 如果文件上傳，被攔截器攔下，還會返回最外層的status = done
            // 但是內部的success會返回false並攜帶異常信息
            // 整個上傳操作還是失敗的
            // https://github.com/zhangdaiscott/jeecg-boot/issues/2691
            if (file.response.success) {
              value['path'] = file.response[column.responseName]
            } else {
              value['status'] = 'error'
              value['message'] = file.response.message || '未知錯誤'
            }
          } else {
            // 考慮到如果設置action上傳路徑為非jeecg-boot後台，可能不會返回 success 屬性的情況，就默認為成功
            value['path'] = file.response[column.responseName]
          }
        } else if (file.status === 'error') {
          value['message'] = file.response.message || '未知錯誤'
        }
        this.uploadValues = this.bindValuesChange(value, id, 'uploadValues')

        // 觸發valueChange 事件
        this.elemValueChange(column.type, row, column, value)
      },
      handleMoreOperation(id,flag,column){
        //update-begin-author:wangshuai date:20201021 for:LOWCOD-969 判斷傳過來的字段是否存在number，用於控制上傳文件
        if(column.number){
          this.number = column.number;
        }else{
          this.number = 0;
        }
        //update-end-author:wangshuai date:20201021 for:LOWCOD-969 判斷傳過來的字段是否存在number，用於控制上傳文件
        if(column && column.fieldExtendJson){
          let json = JSON.parse(column.fieldExtendJson);
          this.number = json.uploadnum?json.uploadnum:0;
        }
        //console.log("this.uploadValues[id]",this.uploadValues[id])
        let path = ''
        if(this.uploadValues && this.uploadValues[id]){
          path = this.uploadValues[id].path
        }
        this.$refs.filePop.show(id,path,flag)
      },
      handleFileSuccess(obj){
        if(obj.id){
          this.uploadValues = this.bindValuesChange(obj, obj.id, 'uploadValues')
        }
      },
      handleClickTableRow(event) {
        let {target} = event
        if (target.className === 'td' || target.className === 'tr') {
          // 清空編輯狀態
          this.currentEditRows = {}
        }
      },
      // 點擊後編輯當前行
      handleEditRow(row, col) {
        if (this.alwaysEdit) {
          return
        }
        // 將點擊的組件置為可編輯並還原其他組件的編輯狀態
        this.currentEditRows = {
          [row.id]: {
            [col.key]: true
          }
        }
        if (col.type === FormTypes.input || col.type === FormTypes.inputNumber) {
          this.$nextTick(() => {
            this.forceUpdateFormValues()
            // 自動獲取焦點
            let el = document.getElementById(`${col.key}${row.id}`)
            if (el) {
              el.focus()
            }
          })
        }
      },

      /** 添加按鈕設置保存為默認值 */
      onAddButtonSettingsSave() {
        let obj = {
          addRowNum: this.settings.addRowNum,
          addIndex: this.settings.addIndex,
          addScrollToBottom: this.settings.addScrollToBottom,
        }
        this.$ls.set('jet-add-btn-settings', obj)
        this.$message.success('保存成功')
      },
      /** 獲取保存的添加按鈕默認值 */
      getSavedAddButtonSettings() {
        let obj= this.$ls.get('jet-add-btn-settings')
        if (obj) {
          Object.assign(this.settings, obj)
        }
      },

      /** 記錄用到數據綁定的組件的值 */
      bindValuesChange(value, id, key) {
        this.$set(this[key], id, value)
        return this[key]
      },

      /** value 觸發valueChange事件 */
      elemValueChange(type, rowSource, columnSource, value) {
        let column = Object.assign({}, columnSource)
        // 將caseId去除
        let row = Object.assign({}, rowSource)
        row.id = this.getCleanId(row.id)
        // 獲取整行的數據
        let { values } = this.getValuesSync({ validate: false, rowIds: [row.id] })
        if (values.length > 0) {
          Object.assign(row, values[0])
        }
        this.$emit('valueChange', { type, row, column, value, target: this })
      },

      /** 獲取乾淨的ID（不包含任何雜質的ID） */
      getCleanId(id) {
        id = this.removeCaseId(id)
        id = this.removeTempId(id)
        return id
      },

      /** 判斷某個ID是否包含了caseId */
      hasCaseId(id) {
        return id && id.startsWith(this.caseId)
      },

      /** 將caseId去除 */
      removeCaseId(id) {
        if (this.hasCaseId(id)) {
          return id.substring(this.caseId.length, id.length)
        }
        return id
      },

      // 判斷 id 是否是臨時Id
      isTempId(id) {
        return (id || '').endsWith(this.tempId)
      },

      /** 將tempId去除 */
      removeTempId(id) {
        if (this.isTempId(id)) {
          return id.substring(0, id.length - this.tempId.length)
        }
        return id;
      },

      handleClickDelFile(id) {
        this.uploadValues[id] = null
      },
      handleClickDownloadFile(id) {
        let { path } = this.uploadValues[id] || {}
        if (path) {
          let url = getFileAccessHttpUrl(path)
          window.open(url)
        }
      },
      handleClickDownFileByUrl(id){
        let { url,path } = this.uploadValues[id] || {}
        if (!url || url.length===0) {
          if(path && path.length>0){
            url = getFileAccessHttpUrl(path.split(',')[0])
          }
        }
        if(url){
          window.open(url)
        }
      },
      handleClickShowImageError(id) {
        let currUploadObj = this.uploadValues[id] || null
        if (currUploadObj && currUploadObj['message']) {
          this.$error({ title: '上傳出錯', content: '錯誤信息：' + currUploadObj['message'], maskClosable: true })
        }
      },

      /** 加載數據字典並合併到 options */
      _loadDictConcatToOptions(column) {
        initDictOptions(column.dictCode).then((res) => {
          if (res.success) {
            let newOptions = (column.options || [])// .concat(res.result)
            res.result.forEach(item => {
              // 過濾重複數據
              for (let option of newOptions) if (option.value === item.value) return
              newOptions.push(item)
            })
            this.$set(column, 'options', newOptions)
          } else {
            console.group(`JEditableTable 查詢字典(${column.dictCode})發生異常`)
            console.log(res.message)
            console.groupEnd()
          }
        })
      },

      /* --- common function end --- */

      /* --- 以下是輔助方法，多用於動態構造頁面中的數據 --- */

      /** 輔助方法：打印日誌 */
      log() {
        if (this.$attrs.logger) {
          console.log.apply(null, arguments)
        }
      },

      getVM() {
        return this
      },

      /** 輔助方法：動態構造Tooltip的Props，防止出現不消失的情況 */
      buildTooltipProps(row, col, id) {
        let {notPassedIds, tooltips} = this
        let props = {
          title: (tooltips[id] || {}).title,
          placement: 'top',
          autoAdjustOverflow: true,
          getPopupContainer: this.getParentContainer,
          class: {
            'j-check-failed': false
          },
        }
        let isCheckFailed = notPassedIds.includes(id)
        if (isCheckFailed) {
          props.class['j-check-failed'] = true
        } else {
          props['visible'] = false
        }
        return props
      },

      /** 輔助方法：指定a-select 和 j-data 的父容器 */
      getParentContainer(node) {
        let element = (() => {
          // nodeType 8	: Comment	: 註釋
          if (this.$el && this.$el.nodeType !== 8) {
            return this.$el
          }
          let doc = document.getElementById(this.caseId + 'inputTable')
          if (doc != null) {
            return doc
          }
          return node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
        })()

        // 遞歸判斷是否帶有 overflow: hidden；的父元素
        const ifParent = (child) => {
          let currentOverflow = null
          if (child['currentStyle']) {
            currentOverflow = child['currentStyle']['overflow']
          } else if (window.getComputedStyle) {
            currentOverflow = window.getComputedStyle(child)['overflow']
          }
          if (currentOverflow != null) {
            if (currentOverflow === 'hidden') {
              // 找到了帶有 hidden 的標籤，判斷它的父級是否還有 hidden，直到遇到完全沒有 hidden 或 body 的時候才停止遞歸
              let temp = ifParent(child.parentNode)
              return temp != null ? temp : child.parentNode
            } else
            // 當前標籤沒有 hidden ，如果有父級並且父級不是 body 的話就繼續遞歸判斷父級
            if (child.parentNode && child.parentNode.tagName.toLocaleLowerCase() !== 'body') {
              return ifParent(child.parentNode)
            } else {
              // 直到 body 都沒有遇到有 hidden 的標籤
              return null
            }
          } else {
            return child
          }
        }

        let temp = ifParent(element)
        return (temp != null) ? temp : element
      },

      /** 輔助方法：替換${...}變量 */
      replaceProps(col, value) {
        if (value && typeof value === 'string') {
          value = value.replace(/\${title}/g, col.title)
          value = value.replace(/\${key}/g, col.key)
          value = value.replace(/\${defaultValue}/g, col.defaultValue)
        }
        return value
      },

      /** view輔助方法：構建 tr style */
      buildTrStyle(index) {
        return {
          'top': `${rowHeight * index}px`
        }
      },
      /** view輔助方法：構建 td style */
      buildTdStyle(col) {
        const isEmptyWidth = (column) => (column.type === FormTypes.hidden || column.width === '0px' || column.width === '0' || column.width === 0)

        let style = {}
        // 計算寬度
        if (col.width) {
          style['width'] = col.width
        } else if (this.columns) {
          style['width'] = `${(100 - 4 * 2) / (this.columns.filter(column => !isEmptyWidth(column))).length}%`
        } else {
          style['width'] = '120px'
        }
        //update-begin-author:lvdandan date:20201116 for:LOWCOD-984 默認風格功能測試附表樣式問題 日期時間控件長度太大
        //如果是時間控件設為200px
        if(col.type === FormTypes.datetime){
          style['width'] = '200px'
        }
        if(col.type === FormTypes.sel_user && !col.width){
          style['width'] = '220px'
        }
        if(col.type === FormTypes.sel_depart && !col.width){
          style['width'] = '160px'
        }
        //update-end-author:lvdandan date:20201116 for:LOWCOD-984 默認風格功能測試附表樣式問題 日期時間控件長度太大

        // checkbox 居中顯示
        let isCheckbox = col.type === FormTypes.checkbox
        if (isCheckbox) {
          style['align-items'] = 'center'
          style['text-align'] = 'center'
          style['padding-left'] = '0'
          style['padding-right'] = '0'
        }
        if (isEmptyWidth(col)) {
          style['padding-left'] = '0'
          style['padding-right'] = '0'
        }
        return style
      },
      /** view輔助方法：構造props */
      buildProps(row, col) {
        let props = {}
        // 解析props
        if (typeof col.props === 'object') {
          for (let prop in col.props) {
            if (col.props.hasOwnProperty(prop)) {
              props[prop] = this.replaceProps(col, col.props[prop])
            }
          }
        }
        // 判斷select是否允許輸入
        if (col.type === FormTypes.select && (col.allowInput === true || col.allowSearch === true)) {
          props['showSearch'] = true
        }
        if (col.type === FormTypes.sel_depart || col.type === FormTypes.sel_user) {
          let { storeField, textField } = this.getStoreAndTextField(col)
          props['store'] = storeField
          props['text'] = textField
        }

        // 判斷是否是禁用的列
        props['disabled'] = (typeof col['disabled'] === 'boolean' ? col['disabled'] : props['disabled'])

        // 判斷是否為禁用的行
        if (props['disabled'] !== true) {
          props['disabled'] = ((this.disabledRowIds || []).indexOf(row.id) !== -1)
        }

        // 判斷是否禁用全部組件
        if (this.disabled === true) {
          props['disabled'] = true
        }

        return props
      },

      /**獲取部門選擇 、用戶選擇的存儲字段、展示字段*/
      getStoreAndTextField(col){
        let storeField = '', textField = ''
        if(col.type === FormTypes.sel_depart){
          storeField = 'id'
          textField = 'departName'
        }else if(col.type === FormTypes.sel_user){
          storeField = 'username'
          textField = 'realname'
        }
        if(col.fieldExtendJson){
          // online邏輯
          let tempJson = JSON.parse(col.fieldExtendJson)
          if(tempJson){
            if(tempJson.store){
              storeField = tempJson.store
            }
            if(tempJson.text){
              textField = tempJson.text
            }
          }
        }else{
          // 實際開發邏輯
          if(col.store){
            storeField = col.store
          }
          if(col.text){
            textField = col.text
          }
        }
        return {
          storeField,
          textField
        }
      },

      /** 輔助方法：防止過快點擊，如果點擊過快的話就返回 true */
      checkTooFastClick(key = 'default', ms = 300) {
        let nowTime = Date.now()
        let lastTime = this.lastPushTimeMap.get(key)
        if (!lastTime) {
          lastTime = nowTime
          this.lastPushTimeMap.set(key, nowTime)
          return false
        }
        let diffTime = nowTime - lastTime
        if (diffTime <= ms) {
          this.$message.warn('你點擊的太快了，請慢點點擊!')
          return true
        }
        this.lastPushTimeMap.set(key, nowTime)
        return false
      },

      /** upload 輔助方法：獲取 headers */
      uploadGetHeaders(row, column) {
        let headers = {}
        if (column.token === true) {
          headers['X-Access-Token'] = this.accessToken
        }
        return headers
      },
      /** 上傳請求地址 */
      getUploadAction(value) {
        if (!value) {
          return window._CONFIG['domianURL'] + '/sys/common/upload'
        } else {
          return value
        }
      },
      /** 預覽圖片地址 */
      getCellImageView(id) {
        let currUploadObj = this.uploadValues[id] || null
        if (currUploadObj) {
          if(currUploadObj['url']){
            return currUploadObj['url'];
          }else if(currUploadObj['path']){
            let readpath = currUploadObj['path'].split(',')[0]
            return getFileAccessHttpUrl(readpath)
          }
        }
        return ''
      },
      /** popup回調 */
      popupCallback(value, others, id, row, column, index) {
        // 存儲輸入的值
        let popupValue = value
        if (others) {
          let rowKey = this.getCleanId(row.id)
          let setValueItem = {rowKey, values: {}}
          Object.keys(others).forEach(key => {
            // 當前列直接賦值，其他列通過setValues賦值
            if (key === column.key) {
              popupValue = others[key]
            } else {
              setValueItem.values[key] = others[key]
            }
          })
          if (Object.keys(setValueItem).length > 0) {
            this.setValues([setValueItem])
          }
        }
        this.setOneValue(this.popupValues, id, popupValue)
        // 做單個表單驗證
        this.validateOneInput(popupValue, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange('input', row, column, value)
      },
      /** popup輸入框回顯 */
      getPopupValue(id) {
        return this.popupValues[id]
      },
      handleRadioChange(value, id, row, column) {
        this.radioValues = this.bindValuesChange(value, id, 'radioValues')
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.radio, row, column, value)
      },
      handleMultiSelectChange(value, id, row, column) {
        this.multiSelectValues = this.bindValuesChange(value, id, 'multiSelectValues')
        // 做單個表單驗證
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        // 觸發valueChange 事件
        this.elemValueChange(FormTypes.list_multi, row, column, value)
      },
      handleSearchSelectChange(value, id, row, column) {
        this.searchSelectValues = this.bindValuesChange(value, id, 'searchSelectValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        this.elemValueChange(FormTypes.sel_search, row, column, value)
      },
      handleSearchSelectAsyncChange(value, id, row, column) {
        this.searchSelectAsyncValues = this.bindValuesChange(value, id, 'searchSelectAsyncValues')
        this.validateOneInput(value, row, column, this.notPassedIds, true, 'change')
        this.elemValueChange(FormTypes.sel_search_async, row, column, value)
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      getEllipsisWord(content, len){
        if(!content || content.length === 0){
          return ''
        }
        if(content.length>len){
          return content.substr(0,len)
        }
        return content;
      },

      /* --------------------------- 2020年5月18日 默認span模式 ------------------------------ */

      /** 獲取Select等組件翻譯後的文本 */
      getSelectTranslateText(value, row, col) {
        // 翻譯支持單選和多選（數組、逗號分割）
        return filterDictText(col.options, value)
      },

      // 判定當前行是否是正在編輯的
      isEditRow(row, col) {
        if (this.alwaysEdit) {
          return true
        }
        let current = this.currentEditRows[row.id]
        return !!(current && current[col.key] === true)
      },

      /* ---- 事件監聽 ---- */

      // 鼠標彈起事件，用於清空輸入狀態
      handleMouseup(event) {
        if (this.alwaysEdit || Object.keys(this.currentEditRows).length === 0) {
          return
        }
        // console.log(this.caseId + 'handleMouseup: ', event)
        let {target} = event
        if (!target){
          return
        }
        let className = target.className || ''
        if (typeof className === 'string') {
          // 點擊的標籤是span
          if (className.includes('j-td-span') && className.includes('no-edit')) {
            return
          }
          // 點擊的標籤是下拉
          if (className.includes('ant-select-dropdown-menu-item')) {
            return
          }
        }

        // 事件冒泡路徑
        let path = getEventPath(event)
        for (let p of path) {
          // 如果點擊的是 tr 就不處理（tr單獨處理）
          if ((p.id || '').startsWith(`${this.caseId}tbody-tr`)) {
            return
          }
          let pClassName = p.className || ''
          pClassName = typeof pClassName === 'string' ? pClassName : pClassName.toString()

          /* --- 特殊處理以下組件，點擊以下標籤時不清空編輯狀態 --- */

          // 點擊的標籤是JInputPop
          if (pClassName.includes('j-input-pop')) {
            return
          }
          // 點擊的標籤是JPopup的彈出層
          if (pClassName.includes('j-popup-modal')) {
            return
          }
          // 點擊的標籤是日期選擇器的彈出層
          if (pClassName.includes('j-date-picker') || pClassName.includes('ant-calendar-picker-container')) {
            return
          }

        }
        // 清空編輯狀態
        this.currentEditRows = {}
      },

      // 添加事件監聽
      addEventListener() {
        window.addEventListener('mouseup', this.handleMouseup)
      },
      // 移除事件監聽
      removeEventListener() {
        window.removeEventListener('mouseup', this.handleMouseup)
      },
      /* --------------------------- 2020年5月18日 默認span模式 ------------------------------ */

      //獲取沒有授權的按鈕編碼
      loadExcludeCode(){
        if(!this.authPre || this.authPre.length==0){
          this.excludeCode = []
        }else{
          let pre = this.authPre
          if(!pre.endsWith(':')){
            pre += ':'
          }
          this.excludeCode = getNoAuthCols(pre)
        }
      },
      //判斷button是否顯示
      buttonPermission(code){
        if(!this.excludeCode || this.excludeCode.length==0){
          return true
        }else{
          return this.excludeCode.indexOf(code)<0
        }
      },
      // 判斷用戶、部門組件是否多選
      isMultipleSelect(column){
        let jsonStr = column.fieldExtendJson
        if(jsonStr){
          // online
          let config = JSON.parse(jsonStr)
          if(config && config['multiSelect']==false){
            return false
          }
        }else if(column.multi==false){
          // 實際開發
          return false
        }
        return true;
      }

    },
    beforeDestroy() {
      this.removeEventListener()
      this.destroyCleanGroupRequest = true
    }

  }
</script>

<style lang="less" scoped>

  .action-button {
    margin-bottom: 8px;

    .gap {
      padding-left: 8px;
    }

  }

  /* 設定邊框參數 */
  @borderColor: #e8e8e8;
  @border: 1px solid @borderColor;
  /* tr & td 之間的間距 */
  @spacing: 8px;

  .input-table {
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    border: @border;

    .thead, .tbody {

      .tr, .td {
        display: flex;
      }

      .td {

        /*border-right: 1px solid red;*/
        /*color: white;*/
        /*background-color: black;*/
        /*margin-right: @spacing !important;*/

        padding-left: @spacing;
        flex-direction: column;

        &.td-cb, &.td-num {
          width: 45px;
          min-width: 45px;
          max-width: 50px;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;
        }

        &.td-ds {
          width: 30px;
          min-width: 30px;
          max-width: 35px;
          margin-right: 0;
          padding-left: 0;
          padding-right: 0;
          justify-content: center;
          align-items: center;

          .td-ds-icons {
            position: relative;
            cursor: move;
            width: 100%;
            /*padding: 25% 0;*/
            height: 100%;

            .anticon-align-left,
            .anticon-align-right {
              position: absolute;
              top: 30%;
            }

            .anticon-align-left {
              left: 25%;
            }

            .anticon-align-right {
              right: 25%;
            }
          }


        }

      }

    }

    .thead {
      overflow-y: scroll;
      overflow-x: hidden;
      border-bottom: @border;

      /** 隱藏thead的滑塊   */

      &::-webkit-scrollbar-thumb {
        box-shadow: none !important;
        background-color: transparent !important;
      }

      .tr {
        min-width: 100%;
        overflow-y: scroll;
      }

      .td {
        /*flex: 1;*/
        padding: 8px @spacing;
        justify-content: center;
      }

    }

    .tbody {
      position: relative;
      top: 0;
      left: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      min-height: 61px;
      /*max-height: 400px;*/
      min-width: 100%;

      .tr-nodata {
        color: #999;
        line-height: 61px;
        text-align: center;
      }

      .tr {
        /*line-height: 50px;*/

        border-bottom: @border;
        transition: background-color 300ms;
        width: 100%;
        height: 61px;
        overflow: hidden;
        position: absolute;
        left: 0;
        z-index: 10;

        &.tr-checked {
          background-color: #fafafa;
        }

        &:hover {
          background-color: #E6F7FF;
        }

      }

      .tr-expand {
        position: relative;
        z-index: 9;
        background-color: white;
      }

      .td {
        /*flex: 1;*/
        padding: 14px @spacing 14px 0;
        justify-content: center;

        &:last-child {
          padding-right: @spacing;
        }

        input {
          font-variant: tabular-nums;
          box-sizing: border-box;
          margin: 0;
          list-style: none;
          position: relative;
          display: inline-block;
          padding: 4px 11px;
          width: 100%;
          height: 32px;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.65);
          background-color: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          transition: all 0.3s;
          outline: none;

          &:hover {
            border-color: #4D90FE
          }

          &:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
            border-right-width: 1px !important;
          }

          &:disabled {
            color: rgba(0, 0, 0, 0.25);
            background: #f5f5f5;
            cursor: not-allowed;
          }

          /* 設置placeholder的顏色 */

          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #ccc;
          }

          &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #ccc;
          }

          &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #ccc;
          }

          &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #ccc;
          }

        }

        .j-editable-image {
          height: 32px;
          max-width: 100px !important;
          cursor: pointer;

          &:hover {
            opacity: 0.8;
          }

          &:active {
            opacity: 0.6;
          }

        }

        /* --------------------------- 2020年5月18日 begin 默認span模式 ------------------------------ */

        label {
          height: 32px;

          &.ant-checkbox-wrapper {
            height: auto;
          }
        }

        .comp-normal {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .j-td-span {
          position: relative;
          padding: 4px 11px;
          border: 1px solid transparent;
          display: inline-block;
          width: 100%;
          max-width: 100%;
          height: 32px;
          cursor: text;
          transition: all 0.3s;
          box-sizing: border-box;
          font-size: 14px;
          line-height: 1.5;
          color: rgba(0, 0, 0, 0.65);
          border-radius: 4px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          &:hover {
            background-color: white;
          }

          &.disabled {
            cursor: not-allowed;

            &:hover {
              color: rgba(0, 0, 0, 0.25);
              background-color: #F5F5F5;
            }
          }

        }

        /* --------------------------- 2020年5月18日 end 默認span模式 ------------------------------ */

        /* --------------------------- 2020年5月28日 begin 新增校驗未通過的樣式 ------------------------------ */

        .j-check-failed.j-td-span {
          background-color: rgba(255, 0, 0, 0.05);

          &:hover {
            background-color: rgba(255, 0, 0, 0.1);
          }
        }

        .j-check-failed.j-td-span,
        input.j-check-failed,
        .j-check-failed /deep/ input,
        .ant-select.j-check-failed /deep/ .ant-select-selection,
        .ant-upload.j-check-failed /deep/ .ant-btn {
          border-color: red;
          box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
        }

        /* --------------------------- 2020年5月28日 end 新增校驗未通過的樣式 ------------------------------ */

      }

    }

    .scroll-view {
      overflow: auto;
      overflow-y: scroll;
    }

    .thead, .thead .tr, .scroll-view {
      @scrollBarSize: 6px;
      /* 定義滾動條高寬及背景 高寬分別對應橫豎滾動條的尺寸*/

      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
      }

      /* 定義滾動條軌道 */

      &::-webkit-scrollbar-track {
        background-color: #f0f0f0;
      }

      /* 定義滑塊 */

      &::-webkit-scrollbar-thumb {
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

        &:hover {
          background-color: #bbb;
        }

        &:active {
          background-color: #888;
        }
      }

    }

    .thead .tr {

      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* IE模式下隱藏 */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      -ms-scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    }

  }

</style>
<style lang="less">
// 新增按鈕配置氣泡的樣式
.j-add-btn-settings {
  width: 240px;

  .ant-form {
    .ant-form-item {
      margin-bottom: 0;

      .ant-input-number {
        width: 100%;
      }
    }
  }
}
</style>
