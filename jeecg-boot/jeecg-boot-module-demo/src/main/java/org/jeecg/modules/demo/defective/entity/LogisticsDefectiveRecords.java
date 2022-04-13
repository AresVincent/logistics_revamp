package org.jeecg.modules.demo.defective.entity;

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
 * @Description: 物流破損件記錄表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Data
@TableName("logistics_defective_records")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="logistics_defective_records對象", description="物流破損件記錄表")
public class LogisticsDefectiveRecords implements Serializable {
    private static final long serialVersionUID = 1L;

	/**主键*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "主键")
    private java.lang.String id;
	/**公司名*/
	@Excel(name = "公司名", width = 15, dictTable = "logistics_user", dicText = "name", dicCode = "id")
	@Dict(dictTable = "logistics_user", dicText = "name", dicCode = "id")
    @ApiModelProperty(value = "公司名")
    private java.lang.String userId;
	/**訂單號*/
	@Excel(name = "訂單號", width = 15, dictTable = "logistics_order", dicText = "order_no", dicCode = "order_no")
	@Dict(dictTable = "logistics_order", dicText = "order_no", dicCode = "order_no")
    @ApiModelProperty(value = "訂單號")
    private java.lang.String orderNo;
	/**運單號*/
	@Excel(name = "運單號", width = 15, dictTable = "logistics_order", dicText = "waybill_no", dicCode = "waybill_no")
	@Dict(dictTable = "logistics_order", dicText = "waybill_no", dicCode = "waybill_no")
    @ApiModelProperty(value = "運單號")
    private java.lang.String waybillNo;
	/**發現時間*/
	@Excel(name = "發現時間", width = 15, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "發現時間")
    private java.util.Date discoverTime;
	/**發現地點*/
	@Excel(name = "發現地點", width = 15, dicCode = "defective_location")
	@Dict(dicCode = "defective_location")
    @ApiModelProperty(value = "發現地點")
    private java.lang.String discoverLocation;
	/**發生地點*/
	@Excel(name = "發生地點", width = 15, dicCode = "defective_location")
	@Dict(dicCode = "defective_location")
    @ApiModelProperty(value = "發生地點")
    private java.lang.String occurLocation;
	/**理賠申請*/
	@Excel(name = "理賠申請", width = 15)
    @ApiModelProperty(value = "理賠申請")
    private java.lang.String claimApplication;
	/**理賠申請結果*/
	@Excel(name = "理賠申請結果", width = 15, dicCode = "sf")
	@Dict(dicCode = "sf")
    @ApiModelProperty(value = "理賠申請結果")
    private java.lang.String claimApplicationResult;
	/**圖片*/
	@Excel(name = "圖片", width = 15)
    @ApiModelProperty(value = "圖片")
    private java.lang.String imagePath;
	/**額外的圖片*/
	@Excel(name = "額外的圖片", width = 15)
    @ApiModelProperty(value = "額外的圖片")
    private java.lang.String extraImage;
	/**理賠申請表*/
	@Excel(name = "理賠申請表", width = 15)
    @ApiModelProperty(value = "理賠申請表")
    private java.lang.String claimApplicationForm;
	/**創建人*/
    @ApiModelProperty(value = "創建人")
    private java.lang.String createBy;
	/**創建日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "創建日期")
    private java.util.Date createTime;
	/**更新人*/
    @ApiModelProperty(value = "更新人")
    private java.lang.String updateBy;
	/**更新日期*/
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "更新日期")
    private java.util.Date updateTime;
	/**所屬部門*/
    @ApiModelProperty(value = "所屬部門")
    private java.lang.String sysOrgCode;
}
