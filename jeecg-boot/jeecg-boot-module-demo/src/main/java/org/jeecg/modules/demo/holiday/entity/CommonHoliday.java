package org.jeecg.modules.demo.holiday.entity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.math.BigDecimal;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import org.jeecg.common.aspect.annotation.Dict;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * @Description: 假期表格
 * @Author: jeecg-boot
 * @Date:   2022-01-10
 * @Version: V1.0
 */
@Data
@TableName("common_holiday")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="common_holiday对象", description="假期表格")
public class CommonHoliday implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "主键")
    private java.lang.String id;
	/**假期代碼*/
	@Excel(name = "假期代碼", width = 15)
    @ApiModelProperty(value = "假期代碼")
    private java.lang.String holidayCode;
	/**年份*/
	@Excel(name = "年份", width = 15, dicCode = "year")
	@Dict(dicCode = "year")
    @ApiModelProperty(value = "年份")
    private java.lang.Integer occurYear;
	/**日期*/
	@Excel(name = "日期", width = 15, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "日期")
    private java.util.Date occurDate;
	/**假期名稱*/
	@Excel(name = "假期名稱", width = 15)
    @ApiModelProperty(value = "假期名稱")
    private java.lang.String holidayName;
	/**假期描述*/
	@Excel(name = "假期描述", width = 15)
    @ApiModelProperty(value = "假期描述")
    private java.lang.String holidayDescription;
	/**勞工假*/
	@Excel(name = "勞工假", width = 15)
    @ApiModelProperty(value = "勞工假")
    private java.lang.Integer statutoryHoliday;
	/**公眾假期*/
	@Excel(name = "公眾假期", width = 15)
    @ApiModelProperty(value = "公眾假期")
    private java.lang.Integer publicHoliday;
	/**創建人*/
    @ApiModelProperty(value = "創建人")
    private java.lang.String createBy;
	/**創建日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "創建日期")
    private java.util.Date createTime;
	/**更新人*/
    @ApiModelProperty(value = "更新人")
    private java.lang.String updateBy;
	/**更新日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "更新日期")
    private java.util.Date updateTime;
	/**所屬部門*/
    @ApiModelProperty(value = "所屬部門")
    private java.lang.String sysOrgCode;
}
