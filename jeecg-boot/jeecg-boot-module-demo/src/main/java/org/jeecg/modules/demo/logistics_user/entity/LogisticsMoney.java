package org.jeecg.modules.demo.logistics_user.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;
import org.jeecgframework.poi.excel.annotation.Excel;
import java.util.Date;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import java.io.UnsupportedEncodingException;

/**
 * @Description: 物流計費規則表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@ApiModel(value="logistics_money對象", description="物流計費規則表")
@Data
@TableName("logistics_money")
public class LogisticsMoney implements Serializable {
    private static final long serialVersionUID = 1L;

	/**ID*/
	@TableId(type = IdType.ASSIGN_ID)
    @ApiModelProperty(value = "ID")
    private java.lang.Integer id;
	/**計費類型*/
	@Excel(name = "計費類型", width = 15, dicCode = "price_rule")
    @ApiModelProperty(value = "計費類型")
    private java.lang.String type;
	/**首重*/
	@Excel(name = "首重", width = 15)
    @ApiModelProperty(value = "首重")
    private java.lang.Double firstWeight;
	/**首重金额*/
	@Excel(name = "首重金额", width = 15)
    @ApiModelProperty(value = "首重金额")
    private java.lang.Double firstMoney;
	/**續重金額*/
	@Excel(name = "續重金額", width = 15)
    @ApiModelProperty(value = "續重金額")
    private java.lang.Double money;
	/**用戶ID*/
    @ApiModelProperty(value = "用戶ID")
    private java.lang.Integer userId;
	/**地區id*/
	@Excel(name = "地區id", width = 15, dictTable = "common_area", dicText = "area", dicCode = "id")
    @ApiModelProperty(value = "地區id")
    private java.lang.String areaIds;
	/**所屬快遞公司*/
	@Excel(name = "所屬快遞公司", width = 15, dictTable = "logistics_company", dicText = "name", dicCode = "id")
    @ApiModelProperty(value = "所屬快遞公司")
    private java.lang.Integer companyId;
}
