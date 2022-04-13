package org.jeecg.modules.demo.logistics_user.service;

import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import org.jeecg.modules.demo.logistics_user.entity.LogisticsUser;
import com.baomidou.mybatisplus.extension.service.IService;
import java.io.Serializable;
import java.util.Collection;
import java.util.List;

/**
 * @Description: 物流用戶表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
public interface ILogisticsUserService extends IService<LogisticsUser> {

	/**
	 * 添加一對多
	 *
	 */
	public void saveMain(LogisticsUser logisticsUser,List<LogisticsMoney> logisticsMoneyList) ;

	/**
	 * 修改一對多
	 *
	 */
	public void updateMain(LogisticsUser logisticsUser,List<LogisticsMoney> logisticsMoneyList);

	/**
	 * 刪除一對多
	 */
	public void delMain (String id);

	/**
	 * 批量刪除一對多
	 */
	public void delBatchMain (Collection<? extends Serializable> idList);
	
}
