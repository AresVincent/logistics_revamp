package org.jeecg.modules.demo.logistics_user.service;

import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * @Description: 物流計費規則表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
public interface ILogisticsMoneyService extends IService<LogisticsMoney> {

	public List<LogisticsMoney> selectByMainId(String mainId);
}
