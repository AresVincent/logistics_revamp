package org.jeecg.modules.demo.logistics_user.mapper;

import java.util.List;
import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * @Description: 物流計費規則表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
public interface LogisticsMoneyMapper extends BaseMapper<LogisticsMoney> {

	public boolean deleteByMainId(@Param("mainId") String mainId);
    
	public List<LogisticsMoney> selectByMainId(@Param("mainId") String mainId);
}
