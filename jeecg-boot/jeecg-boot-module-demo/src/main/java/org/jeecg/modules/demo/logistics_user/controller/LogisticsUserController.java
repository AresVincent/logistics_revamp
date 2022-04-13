package org.jeecg.modules.demo.logistics_user.controller;

import java.io.UnsupportedEncodingException;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.jeecgframework.poi.excel.ExcelImportUtil;
import org.jeecgframework.poi.excel.def.NormalExcelConstants;
import org.jeecgframework.poi.excel.entity.ExportParams;
import org.jeecgframework.poi.excel.entity.ImportParams;
import org.jeecgframework.poi.excel.view.JeecgEntityExcelView;
import org.jeecg.common.system.vo.LoginUser;
import org.apache.shiro.SecurityUtils;
import org.jeecg.common.api.vo.Result;
import org.jeecg.common.system.query.QueryGenerator;
import org.jeecg.common.util.oConvertUtils;
import org.jeecg.modules.demo.logistics_user.entity.LogisticsMoney;
import org.jeecg.modules.demo.logistics_user.entity.LogisticsUser;
import org.jeecg.modules.demo.logistics_user.vo.LogisticsUserPage;
import org.jeecg.modules.demo.logistics_user.service.ILogisticsUserService;
import org.jeecg.modules.demo.logistics_user.service.ILogisticsMoneyService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.jeecg.common.aspect.annotation.AutoLog;

 /**
 * @Description: 物流用戶表
 * @Author: jeecg-boot
 * @Date:   2022-02-23
 * @Version: V1.0
 */
@Api(tags="物流用戶表")
@RestController
@RequestMapping("/logistics_user/logisticsUser")
@Slf4j
public class LogisticsUserController {
	@Autowired
	private ILogisticsUserService logisticsUserService;
	@Autowired
	private ILogisticsMoneyService logisticsMoneyService;
	
	/**
	 * 分頁列表查詢
	 *
	 * @param logisticsUser
	 * @param pageNo
	 * @param pageSize
	 * @param req
	 * @return
	 */
	@AutoLog(value = "物流用戶表-分頁列表查詢")
	@ApiOperation(value="物流用戶表-分頁列表查詢", notes="物流用戶表-分頁列表查詢")
	@GetMapping(value = "/list")
	public Result<?> queryPageList(LogisticsUser logisticsUser,
								   @RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
								   @RequestParam(name="pageSize", defaultValue="10") Integer pageSize,
								   HttpServletRequest req) {
		QueryWrapper<LogisticsUser> queryWrapper = QueryGenerator.initQueryWrapper(logisticsUser, req.getParameterMap());
		Page<LogisticsUser> page = new Page<LogisticsUser>(pageNo, pageSize);
		IPage<LogisticsUser> pageList = logisticsUserService.page(page, queryWrapper);
		return Result.OK(pageList);
	}

	/**
	 *   添加
	 *
	 * @param logisticsUserPage
	 * @return
	 */
	@AutoLog(value = "物流用戶表-添加")
	@ApiOperation(value="物流用戶表-添加", notes="物流用戶表-添加")
	@PostMapping(value = "/add")
	public Result<?> add(@RequestBody LogisticsUserPage logisticsUserPage) {
		LogisticsUser logisticsUser = new LogisticsUser();
		BeanUtils.copyProperties(logisticsUserPage, logisticsUser);
		logisticsUserService.saveMain(logisticsUser, logisticsUserPage.getLogisticsMoneyList());
		return Result.OK("添加成功！");
	}

	/**
	 *  編輯
	 *
	 * @param logisticsUserPage
	 * @return
	 */
	@AutoLog(value = "物流用戶表-編輯")
	@ApiOperation(value="物流用戶表-編輯", notes="物流用戶表-編輯")
	@PutMapping(value = "/edit")
	public Result<?> edit(@RequestBody LogisticsUserPage logisticsUserPage) {
		LogisticsUser logisticsUser = new LogisticsUser();
		BeanUtils.copyProperties(logisticsUserPage, logisticsUser);
		LogisticsUser logisticsUserEntity = logisticsUserService.getById(logisticsUser.getId());
		if(logisticsUserEntity==null) {
			return Result.error("未找到對應數據");
		}
		logisticsUserService.updateMain(logisticsUser, logisticsUserPage.getLogisticsMoneyList());
		return Result.OK("編輯成功!");
	}

	/**
	 *   通過id刪除
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流用戶表-通過id刪除")
	@ApiOperation(value="物流用戶表-通過id刪除", notes="物流用戶表-通過id刪除")
	@DeleteMapping(value = "/delete")
	public Result<?> delete(@RequestParam(name="id",required=true) String id) {
		logisticsUserService.delMain(id);
		return Result.OK("刪除成功!");
	}

	/**
	 *  批量刪除
	 *
	 * @param ids
	 * @return
	 */
	@AutoLog(value = "物流用戶表-批量刪除")
	@ApiOperation(value="物流用戶表-批量刪除", notes="物流用戶表-批量刪除")
	@DeleteMapping(value = "/deleteBatch")
	public Result<?> deleteBatch(@RequestParam(name="ids",required=true) String ids) {
		this.logisticsUserService.delBatchMain(Arrays.asList(ids.split(",")));
		return Result.OK("批量刪除成功！");
	}

	/**
	 * 通過id查詢
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流用戶表-通過id查詢")
	@ApiOperation(value="物流用戶表-通過id查詢", notes="物流用戶表-通過id查詢")
	@GetMapping(value = "/queryById")
	public Result<?> queryById(@RequestParam(name="id",required=true) String id) {
		LogisticsUser logisticsUser = logisticsUserService.getById(id);
		if(logisticsUser==null) {
			return Result.error("未找到對應數據");
		}
		return Result.OK(logisticsUser);

	}

	/**
	 * 通過id查詢
	 *
	 * @param id
	 * @return
	 */
	@AutoLog(value = "物流計費規則表通過主表ID查詢")
	@ApiOperation(value="物流計費規則表主表ID查詢", notes="物流計費規則表-通主表ID查詢")
	@GetMapping(value = "/queryLogisticsMoneyByMainId")
	public Result<?> queryLogisticsMoneyListByMainId(@RequestParam(name="id",required=true) String id) {
		List<LogisticsMoney> logisticsMoneyList = logisticsMoneyService.selectByMainId(id);
		return Result.OK(logisticsMoneyList);
	}

    /**
    * 導出excel
    *
    * @param request
    * @param logisticsUser
    */
    @RequestMapping(value = "/exportXls")
    public ModelAndView exportXls(HttpServletRequest request, LogisticsUser logisticsUser) {
      // Step.1 組裝查詢條件查詢數據
      QueryWrapper<LogisticsUser> queryWrapper = QueryGenerator.initQueryWrapper(logisticsUser, request.getParameterMap());
      LoginUser sysUser = (LoginUser) SecurityUtils.getSubject().getPrincipal();

      //Step.2 獲取導出數據
      List<LogisticsUser> queryList = logisticsUserService.list(queryWrapper);
      // 過濾選中數據
      String selections = request.getParameter("selections");
      List<LogisticsUser> logisticsUserList = new ArrayList<LogisticsUser>();
      if(oConvertUtils.isEmpty(selections)) {
          logisticsUserList = queryList;
      }else {
          List<String> selectionList = Arrays.asList(selections.split(","));
          logisticsUserList = queryList.stream().filter(item -> selectionList.contains(item.getId())).collect(Collectors.toList());
      }

      // Step.3 組裝pageList
      List<LogisticsUserPage> pageList = new ArrayList<LogisticsUserPage>();
      for (LogisticsUser main : logisticsUserList) {
          LogisticsUserPage vo = new LogisticsUserPage();
          BeanUtils.copyProperties(main, vo);
          List<LogisticsMoney> logisticsMoneyList = logisticsMoneyService.selectByMainId(String.valueOf(main.getId()));
          vo.setLogisticsMoneyList(logisticsMoneyList);
          pageList.add(vo);
      }

      // Step.4 AutoPoi 導出Excel
      ModelAndView mv = new ModelAndView(new JeecgEntityExcelView());
      mv.addObject(NormalExcelConstants.FILE_NAME, "物流用戶表列表");
      mv.addObject(NormalExcelConstants.CLASS, LogisticsUserPage.class);
      mv.addObject(NormalExcelConstants.PARAMS, new ExportParams("物流用戶表數據", "導出人:"+sysUser.getRealname(), "物流用戶表"));
      mv.addObject(NormalExcelConstants.DATA_LIST, pageList);
      return mv;
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
      MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
      Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
      for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
          MultipartFile file = entity.getValue();// 獲取上傳文件對象
          ImportParams params = new ImportParams();
          params.setTitleRows(2);
          params.setHeadRows(1);
          params.setNeedSave(true);
          try {
              List<LogisticsUserPage> list = ExcelImportUtil.importExcel(file.getInputStream(), LogisticsUserPage.class, params);
              for (LogisticsUserPage page : list) {
                  LogisticsUser po = new LogisticsUser();
                  BeanUtils.copyProperties(page, po);
                  logisticsUserService.saveMain(po, page.getLogisticsMoneyList());
              }
              return Result.OK("文件導入成功！數據行數:" + list.size());
          } catch (Exception e) {
              log.error(e.getMessage(),e);
              return Result.error("文件導入失敗:"+e.getMessage());
          } finally {
              try {
                  file.getInputStream().close();
              } catch (IOException e) {
                  e.printStackTrace();
              }
          }
      }
      return Result.OK("文件導入失敗！");
    }

}
