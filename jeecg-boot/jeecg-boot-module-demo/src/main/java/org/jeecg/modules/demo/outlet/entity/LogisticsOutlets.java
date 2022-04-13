package org.jeecg.modules.demo.outlet.entity;

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
 * @Description: 物流網點表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Data
@TableName("logistics_outlets")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="logistics_outlets對象", description="物流網點表")
public class LogisticsOutlets implements Serializable {
    private static final long serialVersionUID = 1L;

	/**ID*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "ID")
    private java.lang.Integer id;
	/**自提點/自提櫃*/
	@Excel(name = "自提點/自提櫃", width = 15)
    @ApiModelProperty(value = "自提點/自提櫃")
    private java.lang.String type;
	/**所屬快遞公司*/
	@Excel(name = "所屬快遞公司", width = 15)
    @ApiModelProperty(value = "所屬快遞公司")
    private java.lang.Integer companyId;
	/**地區ID*/
	@Excel(name = "地區ID", width = 15, dicCode = "select id value, area text from common_area")
	@Dict(dicCode = "select id value, area text from common_area")
    @ApiModelProperty(value = "地區ID")
    private java.lang.Integer areaId;
	/**自提點/自提櫃代碼*/
	@Excel(name = "自提點/自提櫃代碼", width = 15)
    @ApiModelProperty(value = "自提點/自提櫃代碼")
    private java.lang.String storeCode;
	/**自提點/自提櫃名稱*/
	@Excel(name = "自提點/自提櫃名稱", width = 15)
    @ApiModelProperty(value = "自提點/自提櫃名稱")
    private java.lang.String storeName;
	/**短地址*/
	@Excel(name = "短地址", width = 15)
    @ApiModelProperty(value = "短地址")
    private java.lang.String shortAddress;
	/**長地址*/
	@Excel(name = "長地址", width = 15)
    @ApiModelProperty(value = "長地址")
    private java.lang.String address;
	/**英文地址*/
	@Excel(name = "英文地址", width = 15)
    @ApiModelProperty(value = "英文地址")
    private java.lang.String addressEn;
	/**電話號碼*/
	@Excel(name = "電話號碼", width = 15)
    @ApiModelProperty(value = "電話號碼")
    private java.lang.String phone;
	/**經度*/
	@Excel(name = "經度", width = 15)
    @ApiModelProperty(value = "經度")
    private java.lang.String longitude;
	/**緯度*/
	@Excel(name = "緯度", width = 15)
    @ApiModelProperty(value = "緯度")
    private java.lang.String latitude;
	/**營業時間*/
	@Excel(name = "營業時間", width = 15)
    @ApiModelProperty(value = "營業時間")
    private java.lang.String storeOperationHr;
	/**創建時間*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "創建時間")
    private java.util.Date createTime;
}
