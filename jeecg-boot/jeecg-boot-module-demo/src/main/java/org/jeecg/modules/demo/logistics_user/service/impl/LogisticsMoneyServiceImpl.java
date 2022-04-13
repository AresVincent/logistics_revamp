package org.jeecg.modules.demo.logistics_user.service.impl;

import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import org.jeecg.modules.demo.logistics_user.mapper.LogisticsMoneyMapper;
import org.jeecg.modules.demo.logistics_user.service.ILogisticsMoneyService;
import org.springframework.stereotype.Service;
import java.util.List;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @Description: 物流計費規則表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Service
public class LogisticsMoneyServiceImpl extends ServiceImpl<LogisticsMoneyMapper, LogisticsMoney> implements ILogisticsMoneyService {
	
	@Autowired
	private LogisticsMoneyMapper logisticsMoneyMapper;
	
	@Override
	public List<LogisticsMoney> selectByMainId(String mainId) {
		return logisticsMoneyMapper.selectByMainId(mainId);
	}
}
