package org.jeecg.modules.demo.logistics_user.service.impl;

import org.jeecg.modules.demo.logistics_user.entity.LogisticsUser;
import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import org.jeecg.modules.demo.logistics_user.mapper.LogisticsMoneyMapper;
import org.jeecg.modules.demo.logistics_user.mapper.LogisticsUserMapper;
import org.jeecg.modules.demo.logistics_user.service.ILogisticsUserService;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import java.io.Serializable;
import java.util.List;
import java.util.Collection;

/**
 * @Description: 物流用戶表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Service
public class LogisticsUserServiceImpl extends ServiceImpl<LogisticsUserMapper, LogisticsUser> implements ILogisticsUserService {

	@Autowired
	private LogisticsUserMapper logisticsUserMapper;
	@Autowired
	private LogisticsMoneyMapper logisticsMoneyMapper;
	
	@Override
	@Transactional
	public void saveMain(LogisticsUser logisticsUser, List<LogisticsMoney> logisticsMoneyList) {
		logisticsUserMapper.insert(logisticsUser);
		if(logisticsMoneyList!=null && logisticsMoneyList.size()>0) {
			for(LogisticsMoney entity:logisticsMoneyList) {
				//外鍵設置
				entity.setUserId(logisticsUser.getId());
				logisticsMoneyMapper.insert(entity);
			}
		}
	}

	@Override
	@Transactional
	public void updateMain(LogisticsUser logisticsUser,List<LogisticsMoney> logisticsMoneyList) {
		logisticsUserMapper.updateById(logisticsUser);

		//1.先刪除子表數據
		logisticsMoneyMapper.deleteByMainId(String.valueOf(logisticsUser.getId()));

		//2.子表數據重新插入
		if(logisticsMoneyList!=null && logisticsMoneyList.size()>0) {
			for(LogisticsMoney entity:logisticsMoneyList) {
				//外鍵設置
				entity.setUserId(logisticsUser.getId());
				logisticsMoneyMapper.insert(entity);
			}
		}
	}

	@Override
	@Transactional
	public void delMain(String id) {
		logisticsMoneyMapper.deleteByMainId(id);
		logisticsUserMapper.deleteById(id);
	}

	@Override
	@Transactional
	public void delBatchMain(Collection<? extends Serializable> idList) {
		for(Serializable id:idList) {
			logisticsMoneyMapper.deleteByMainId(id.toString());
			logisticsUserMapper.deleteById(id);
		}
	}
	
}
