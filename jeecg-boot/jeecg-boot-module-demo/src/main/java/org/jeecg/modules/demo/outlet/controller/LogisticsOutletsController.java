package org.jeecg.modules.demo.outlet.controller;

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
import org.jeecg.modules.demo.outlet.entity.LogisticsOutlets;
import org.jeecg.modules.demo.outlet.service.ILogisticsOutletsService;

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
 * @Description: 物流網點表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Api(tags="物流網點表")
@RestController
@RequestMapping("/outlet/logisticsOutlets")
@Slf4j
public class LogisticsOutletsController extends JeecgController<LogisticsOutlets, ILogisticsOutletsService> {
	@Autowired
	private ILogisticsOutletsService logisticsOutletsService;
	
	/**
	 * 分頁列表查詢
	 *
	 * @param logisticsOutlets
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "物流網點表-分頁列表查詢")
	@ApiOperation(value="物流網點表-分頁列表查詢", notes="物流網點表-分頁列表查詢")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(LogisticsOutlets logisticsOutlets,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<LogisticsOutlets> queryWrapper = QueryGenerator.initQueryWrapper(logisticsOutlets, req.getParameterMap());
		Page<LogisticsOutlets> page = new Page<LogisticsOutlets>(pageNo, pageSize);
		IPage<LogisticsOutlets> pageList = logisticsOutletsService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param logisticsOutlets
	 * @return
	 */
	@AutoLog(value = "物流網點表-添加")
	@ApiOperation(value="物流網點表-添加", notes="物流網點表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody LogisticsOutlets logisticsOutlets) {
		logisticsOutletsService.save(logisticsOutlets);
		return Result.OK("添加成功！");
	}

	/**
	 *  編輯
	 *
	 * @param logisticsOutlets
	 * @return
	 */
	@AutoLog(value = "物流網點表-編輯")
	@ApiOperation(value="物流網點表-編輯", notes="物流網點表-編輯")
	@PutMapping(value = "/edit")
	public Result<?> edit(@RequestBody LogisticsOutlets logisticsOutlets) {
		logisticsOutletsService.updateById(logisticsOutlets);
		return Result.OK("編輯成功!");
	}

	/**
	 *   通過id刪除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流網點表-通過id刪除")
	@ApiOperation(value="物流網點表-通過id刪除", notes="物流網點表-通過id刪除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		logisticsOutletsService.removeById(id);
		return Result.OK("刪除成功!");
	}

	/**
	 *  批量刪除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "物流網點表-批量刪除")
	@ApiOperation(value="物流網點表-批量刪除", notes="物流網點表-批量刪除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.logisticsOutletsService.removeByIds(Arrays.asList(ids.split(",")));
		return Result.OK("批量刪除成功!");
	}

	/**
	 * 通過id查詢
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流網點表-通過id查詢")
	@ApiOperation(value="物流網點表-通過id查詢", notes="物流網點表-通過id查詢")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		LogisticsOutlets logisticsOutlets = logisticsOutletsService.getById(id);
		if(logisticsOutlets==null) {
			return Result.error("未找到對應數據");
		}
		return Result.OK(logisticsOutlets);
	}

    /**
    * 導出excel
    *
    * @param request
    * @param logisticsOutlets
    */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, LogisticsOutlets logisticsOutlets) {
        return super.exportXls(request, logisticsOutlets, LogisticsOutlets.class, "物流網點表");
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
        return super.importExcel(request, response, LogisticsOutlets.class);
    }

}
