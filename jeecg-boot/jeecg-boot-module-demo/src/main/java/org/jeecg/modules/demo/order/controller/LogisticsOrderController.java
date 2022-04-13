package org.jeecg.modules.demo.order.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.demo.order.entity.LogisticsOrder;
import org.jeecg.modules.demo.order.service.ILogisticsOrderService;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;

import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.jeecg.common.system.base.controller.JeecgController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.aspect.annotation.AutoLog;

 /**
 * @Description: 物流訂單表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Api(tags="物流訂單表")
@RestController
@RequestMapping("/order/logisticsOrder")
@Slf4j
public class LogisticsOrderController extends JeecgController<LogisticsOrder, ILogisticsOrderService> {
	@Autowired
	private ILogisticsOrderService logisticsOrderService;
	
	/**
	 * 分頁列表查詢
	 *
	 * @param logisticsOrder
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "物流訂單表-分頁列表查詢")
	@ApiOperation(value="物流訂單表-分頁列表查詢", notes="物流訂單表-分頁列表查詢")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(LogisticsOrder logisticsOrder,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<LogisticsOrder> queryWrapper = QueryGenerator.initQueryWrapper(logisticsOrder, req.getParameterMap());
		Page<LogisticsOrder> page = new Page<LogisticsOrder>(pageNo, pageSize);
		IPage<LogisticsOrder> pageList = logisticsOrderService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param logisticsOrder
	 * @return
	 */
	@AutoLog(value = "物流訂單表-添加")
	@ApiOperation(value="物流訂單表-添加", notes="物流訂單表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody LogisticsOrder logisticsOrder) {
		logisticsOrderService.save(logisticsOrder);
		return Result.OK("添加成功！");
	}

	/**
	 *  編輯
	 *
	 * @param logisticsOrder
	 * @return
	 */
	@AutoLog(value = "物流訂單表-編輯")
	@ApiOperation(value="物流訂單表-編輯", notes="物流訂單表-編輯")
	@PutMapping(value = "/edit")
	public Result<?> edit(@RequestBody LogisticsOrder logisticsOrder) {
		logisticsOrderService.updateById(logisticsOrder);
		return Result.OK("編輯成功!");
	}

	/**
	 *   通過id刪除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流訂單表-通過id刪除")
	@ApiOperation(value="物流訂單表-通過id刪除", notes="物流訂單表-通過id刪除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		logisticsOrderService.removeById(id);
		return Result.OK("刪除成功!");
	}

	/**
	 *  批量刪除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "物流訂單表-批量刪除")
	@ApiOperation(value="物流訂單表-批量刪除", notes="物流訂單表-批量刪除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.logisticsOrderService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量刪除成功!");
	}

	/**
	 * 通過id查詢
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流訂單表-通過id查詢")
	@ApiOperation(value="物流訂單表-通過id查詢", notes="物流訂單表-通過id查詢")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		LogisticsOrder logisticsOrder = logisticsOrderService.getById(id);
		if(logisticsOrder==null) {
			return Result.error("未找到對應數據");
		}
		return Result.OK(logisticsOrder);
	}

    /**
    * 導出excel
    *
    * @param request
    * @param logisticsOrder
    */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, LogisticsOrder logisticsOrder) {
        return super.exportXls(request, logisticsOrder, LogisticsOrder.class, "物流訂單表");
    }

    /**
      * 通過excel導入數據
    *
    * @param request
    * @param response
    * @return
    */
    @RequestMapping(value = "/importExcel", method = RequestMethod.POST)
    public Result<?> importExcel(HttpServletRequest request, HttpServletResponse response) {
        return super.importExcel(request, response, LogisticsOrder.class);
    }

}
