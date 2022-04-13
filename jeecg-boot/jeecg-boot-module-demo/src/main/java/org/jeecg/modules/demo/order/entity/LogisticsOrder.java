package org.jeecg.modules.demo.order.entity;

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
 * @Description: 物流訂單表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Data
@TableName("logistics_order")
@Accessors(chain = true)
@EqualsAndHashCode(callSuper = false)
@ApiModel(value="logistics_order對象", description="物流訂單表")
public class LogisticsOrder implements Serializable {
    private static final long serialVersionUID = 1L;

	/**ID*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "ID")
    private java.lang.Integer id;
	/**序列號*/
	@Excel(name = "序列號", width = 15)
    @ApiModelProperty(value = "序列號")
    private java.math.BigDecimal sn;
	/**訂單號*/
	@Excel(name = "訂單號", width = 15)
    @ApiModelProperty(value = "訂單號")
    private java.lang.String orderNo;
	/**運單號*/
	@Excel(name = "運單號", width = 15)
    @ApiModelProperty(value = "運單號")
    private java.lang.String waybillNo;
	/**訂單狀態*/
	@Excel(name = "訂單狀態", width = 15)
    @ApiModelProperty(value = "訂單狀態")
    private java.lang.String status;
	/**派送類型*/
	@Excel(name = "派送類型", width = 15)
    @ApiModelProperty(value = "派送類型")
    private java.lang.String type;
	/**物流用戶ID*/
	@Excel(name = "物流用戶ID", width = 15, dictTable = "logistics_user", dicText = "name", dicCode = "id")
	@Dict(dictTable = "logistics_user", dicText = "name", dicCode = "id")
    @ApiModelProperty(value = "物流用戶ID")
    private java.lang.Integer userId;
	/**寄件人姓名*/
	@Excel(name = "寄件人姓名", width = 15)
    @ApiModelProperty(value = "寄件人姓名")
    private java.lang.String sendName;
	/**寄件人電話*/
	@Excel(name = "寄件人電話", width = 15)
    @ApiModelProperty(value = "寄件人電話")
    private java.lang.String sendPhone;
	/**攬收街道名稱*/
	@Excel(name = "攬收街道名稱", width = 15)
    @ApiModelProperty(value = "攬收街道名稱")
    private java.lang.String sendStreet;
	/**攬收大廈名稱*/
	@Excel(name = "攬收大廈名稱", width = 15)
    @ApiModelProperty(value = "攬收大廈名稱")
    private java.lang.String sendBuilding;
	/**攬收地區ID*/
	@Excel(name = "攬收地區ID", width = 15)
    @ApiModelProperty(value = "攬收地區ID")
    private java.lang.Integer sendAreaId;
	/**攬收地址*/
	@Excel(name = "攬收地址", width = 15)
    @ApiModelProperty(value = "攬收地址")
    private java.lang.String sendAddress;
	/**收件人姓名*/
	@Excel(name = "收件人姓名", width = 15)
    @ApiModelProperty(value = "收件人姓名")
    private java.lang.String getName;
	/**收件人電話*/
	@Excel(name = "收件人電話", width = 15)
    @ApiModelProperty(value = "收件人電話")
    private java.lang.String getPhone;
	/**收件人區域*/
	@Excel(name = "收件人區域", width = 15)
    @ApiModelProperty(value = "收件人區域")
    private java.lang.String getRegion;
	/**收件人地區*/
	@Excel(name = "收件人地區", width = 15)
    @ApiModelProperty(value = "收件人地區")
    private java.lang.String getDistrict;
	/**收件人街道名稱*/
	@Excel(name = "收件人街道名稱", width = 15)
    @ApiModelProperty(value = "收件人街道名稱")
    private java.lang.String getStreet;
	/**收件人大廈名稱*/
	@Excel(name = "收件人大廈名稱", width = 15)
    @ApiModelProperty(value = "收件人大廈名稱")
    private java.lang.String getBuilding;
	/**收件人地區ID*/
	@Excel(name = "收件人地區ID", width = 15)
    @ApiModelProperty(value = "收件人地區ID")
    private java.lang.Integer getAreaId;
	/**收件人地址*/
	@Excel(name = "收件人地址", width = 15)
    @ApiModelProperty(value = "收件人地址")
    private java.lang.String getAddress;
	/**自提點/自提櫃代碼*/
	@Excel(name = "自提點/自提櫃代碼", width = 15)
    @ApiModelProperty(value = "自提點/自提櫃代碼")
    private java.lang.String getPickuppoint;
	/**郵寄物品*/
	@Excel(name = "郵寄物品", width = 15)
    @ApiModelProperty(value = "郵寄物品")
    private java.lang.String goods;
	/**數量*/
	@Excel(name = "數量", width = 15)
    @ApiModelProperty(value = "數量")
    private java.lang.Integer num;
	/**重量*/
	@Excel(name = "重量", width = 15)
    @ApiModelProperty(value = "重量")
    private java.lang.Double weight;
	/**體積*/
	@Excel(name = "體積", width = 15)
    @ApiModelProperty(value = "體積")
    private java.lang.String volume;
	/**派送方式*/
	@Excel(name = "派送方式", width = 15)
    @ApiModelProperty(value = "派送方式")
    private java.lang.String mode;
	/**自提點*/
	@Excel(name = "自提點", width = 15)
    @ApiModelProperty(value = "自提點")
    private java.lang.String place;
	/**運費*/
	@Excel(name = "運費", width = 15)
    @ApiModelProperty(value = "運費")
    private java.math.BigDecimal price;
	/**下單時間*/
	@Excel(name = "下單時間", width = 15, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "下單時間")
    private java.util.Date sendTime;
	/**快遞公司ID*/
	@Excel(name = "快遞公司ID", width = 15)
    @ApiModelProperty(value = "快遞公司ID")
    private java.lang.Integer companyId;
	/**發貨時間*/
	@Excel(name = "發貨時間", width = 15)
    @ApiModelProperty(value = "發貨時間")
    private java.lang.String orderTime;
	/**寬度*/
	@Excel(name = "寬度", width = 15)
    @ApiModelProperty(value = "寬度")
    private java.lang.Double width;
	/**長度*/
	@Excel(name = "長度", width = 15)
    @ApiModelProperty(value = "長度")
    private java.lang.Double length;
	/**高度*/
	@Excel(name = "高度", width = 15)
    @ApiModelProperty(value = "高度")
    private java.lang.Double height;
	/**是否包含電池?*/
	@Excel(name = "是否包含電池?", width = 15)
    @ApiModelProperty(value = "是否包含電池?")
    private java.lang.String includeBattery;
	/**運單創建時間*/
	@Excel(name = "運單創建時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "運單創建時間")
    private java.util.Date status1Time;
	/**倉庫簽入時間*/
	@Excel(name = "倉庫簽入時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "倉庫簽入時間")
    private java.util.Date status2Time;
	/**倉庫簽出時間*/
	@Excel(name = "倉庫簽出時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "倉庫簽出時間")
    private java.util.Date status3Time;
	/**派送失敗/再次派送時間*/
	@Excel(name = "派送失敗/再次派送時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "派送失敗/再次派送時間")
    private java.util.Date status4Time;
	/**派送時間*/
	@Excel(name = "派送時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "派送時間")
    private java.util.Date status5Time;
	/**簽收時間*/
	@Excel(name = "簽收時間", width = 20, format = "yyyy-MM-dd HH:mm:ss")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @ApiModelProperty(value = "簽收時間")
    private java.util.Date status6Time;
	/**是否上門取件?*/
	@Excel(name = "是否上門取件?", width = 15)
    @ApiModelProperty(value = "是否上門取件?")
    private java.lang.String pickupTag;
	/**攬收日期*/
	@Excel(name = "攬收日期", width = 15, format = "yyyy-MM-dd")
	@JsonFormat(timezone = "GMT+8",pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "攬收日期")
    private java.util.Date pickupDate;
	/**備註*/
	@Excel(name = "備註", width = 15)
    @ApiModelProperty(value = "備註")
    private java.lang.String remarks;
}
