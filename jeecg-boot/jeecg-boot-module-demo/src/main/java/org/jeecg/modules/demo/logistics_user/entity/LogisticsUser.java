package org.jeecg.modules.demo.logistics_user.entity;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.util.Date;
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

/**
 * @Description: 物流用戶表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@ApiModel(value="logistics_user對象", description="物流用戶表")
@Data
@TableName("logistics_user")
public class LogisticsUser implements Serializable {
    private static final long serialVersionUID = 1L;

	/**ID*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "ID")
    private java.lang.Integer id;
	/**登錄令牌*/
	@Excel(name = "登錄令牌", width = 15)
    @ApiModelProperty(value = "登錄令牌")
    private java.lang.String token;
	/**公司名稱*/
	@Excel(name = "公司名稱", width = 15)
    @ApiModelProperty(value = "公司名稱")
    private java.lang.String name;
	/**登錄名*/
	@Excel(name = "登錄名", width = 15)
    @ApiModelProperty(value = "登錄名")
    private java.lang.String username;
	/**電郵地址*/
	@Excel(name = "電郵地址", width = 15)
    @ApiModelProperty(value = "電郵地址")
    private java.lang.String email;
	/**密碼*/
	@Excel(name = "密碼", width = 15)
    @ApiModelProperty(value = "密碼")
    private java.lang.String password;
	/**鹽*/
	@Excel(name = "鹽", width = 15)
    @ApiModelProperty(value = "鹽")
    private java.lang.String salt;
	/**聯絡人*/
	@Excel(name = "聯絡人", width = 15)
    @ApiModelProperty(value = "聯絡人")
    private java.lang.String contactPerson;
	/**電話號碼*/
	@Excel(name = "電話號碼", width = 15)
    @ApiModelProperty(value = "電話號碼")
    private java.lang.String phone;
	/**公司區域ID*/
	@Excel(name = "公司區域ID", width = 15, dicCode = "district")
    @Dict(dicCode = "district")
    @ApiModelProperty(value = "公司區域ID")
    private java.lang.Integer companyRegionId;
	/**公司地區ID*/
	@Excel(name = "公司地區ID", width = 15, dicCode = "area")
    @Dict(dicCode = "area")
    @ApiModelProperty(value = "公司地區ID")
    private java.lang.Integer companyAreaId;
	/**街道名稱*/
	@Excel(name = "街道名稱", width = 15)
    @ApiModelProperty(value = "街道名稱")
    private java.lang.String companyStreet;
	/**大廈名稱*/
	@Excel(name = "大廈名稱", width = 15)
    @ApiModelProperty(value = "大廈名稱")
    private java.lang.String companyBuilding;
	/**公司地址*/
	@Excel(name = "公司地址", width = 15)
    @ApiModelProperty(value = "公司地址")
    private java.lang.String companyAddress;
	/**應用密鑰*/
	@Excel(name = "應用密鑰", width = 15)
    @ApiModelProperty(value = "應用密鑰")
    private java.lang.String appKey;
}
