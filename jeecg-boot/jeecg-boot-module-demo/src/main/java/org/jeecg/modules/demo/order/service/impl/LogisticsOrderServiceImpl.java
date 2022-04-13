package org.jeecg.modules.demo.order.service.impl;

import org.jeecg.modules.demo.order.entity.LogisticsOrder;
import org.jeecg.modules.demo.order.mapper.LogisticsOrderMapper;
import org.jeecg.modules.demo.order.service.ILogisticsOrderService;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

/**
 * @Description: 物流訂單表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Service
public class LogisticsOrderServiceImpl extends ServiceImpl<LogisticsOrderMapper, LogisticsOrder> implements ILogisticsOrderService {

}
