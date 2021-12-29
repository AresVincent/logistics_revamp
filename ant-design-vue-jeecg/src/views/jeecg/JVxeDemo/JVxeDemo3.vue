<template>
  <j-vxe-table
    ref="vTable"
    toolbar
    row-number
    row-selection
    keep-source
    :height="484"
    :dataSource="dataSource"
    :columns="columns"
    :linkage-config="linkageConfig"
  />
</template>

<script>
import { JVXETypes } from '@/components/jeecg/JVxeTable'
import { getAction } from '@api/manage'

export default {
  name: 'JVxeDemo2',
  data() {
    return {
      // 聯動配置
      linkageConfig: [
        {requestData: this.requestData, key: 's1'},
        // 可配置多個聯動
        {requestData: this.loadMenu, key: 'menu1',},
      ],
      columns: [
        {
          title: '性別',
          key: 'sex',
          type: JVXETypes.select,
          dictCode: 'sex',
          width: '180px',
          placeholder: '請選擇${title}',
        },
        {
          title: '省/直轄市/自治區',
          key: 's1',
          type: JVXETypes.select,
          width: '180px',
          placeholder: '請選擇${title}',
          // 聯動字段（即下一級的字段）
          linkageKey: 's2',
        },
        {
          title: '市',
          key: 's2',
          type: JVXETypes.select,
          width: '180px',
          placeholder: '請選擇${title}',
          // 聯動字段（即下一級的字段）
          linkageKey: 's3',
        },
        {
          title: '縣/區',
          key: 's3',
          type: JVXETypes.select,
          width: '180px',
          options: [],
          placeholder: '請選擇${title}',
        },
        {
          title: '一級菜單',
          key: 'menu1',
          type: JVXETypes.select,
          width: '180px',
          placeholder: '請選擇${title}',
          // 聯動字段（即下一級的字段）
          linkageKey: 'menu2',
        },
        {
          title: '二級菜單',
          key: 'menu2',
          type: JVXETypes.select,
          width: '180px',
          placeholder: '請選擇${title}',
          // 聯動字段（即下一級的字段）
          linkageKey: 'menu3',
        },
        {
          title: '三級菜單',
          key: 'menu3',
          type: JVXETypes.select,
          width: '180px',
          placeholder: '請選擇${title}',
        }
      ],
      dataSource: [
        {sex: '1', s1: '110000', s2: '110100', s3: '110101'},
        {sex: '2', s1: '130000', s2: '130300', s3: '130303'},
      ],
      // 模擬數據
      mockData: [
        {text: '北京市', value: '110000', parent: ''},
        {text: '天津市', value: '120000', parent: ''},
        {text: '河北省', value: '130000', parent: ''},
        {text: '上海市', value: '310000', parent: ''},

        {text: '北京市', value: '110100', parent: '110000'},
        {text: '天津市市', value: '120100', parent: '120000'},
        {text: '石家莊市', value: '130100', parent: '130000'},
        {text: '唐山市', value: '130200', parent: '130000'},
        {text: '秦皇島市', value: '130300', parent: '130000'},
        {text: '上海市', value: '310100', parent: '310000'},

        {text: '東城區', value: '110101', parent: '110100'},
        {text: '西城區', value: '110102', parent: '110100'},
        {text: '朝陽區', value: '110105', parent: '110100'},
        {text: '和平區', value: '120101', parent: '120100'},
        {text: '河東區', value: '120102', parent: '120100'},
        {text: '河西區', value: '120103', parent: '120100'},
        {text: '黃浦區', value: '310101', parent: '310100'},
        {text: '徐匯區', value: '310104', parent: '310100'},
        {text: '長寧區', value: '310105', parent: '310100'},
        {text: '長安區', value: '130102', parent: '130100'},
        {text: '橋西區', value: '130104', parent: '130100'},
        {text: '新華區', value: '130105', parent: '130100'},
        {text: '路南區', value: '130202', parent: '130200'},
        {text: '路北區', value: '130203', parent: '130200'},
        {text: '古冶區', value: '130204', parent: '130200'},
        {text: '海港區', value: '130302', parent: '130300'},
        {text: '山海關區', value: '130303', parent: '130300'},
        {text: '北戴河區', value: '130304', parent: '130300'},
      ],
    }
  },
  methods: {
    /**
     * 模擬從後台查詢數據
     */
    requestData(parent) {
      return new Promise((resolve, reject) => {
        let data = this.mockData.filter(i => i.parent === parent)
        setTimeout(() => {
          resolve(data)
        }, 500)
      })
    },

    async loadMenu(parent) {
      let res
      // 如果parent為空，則查詢第一級菜單
      if (parent === '') {
        res = await getAction('/sys/permission/getSystemMenuList')
      } else {
        res = await getAction('/sys/permission/getSystemSubmenu', {parentId: parent})
      }
      if (res.success) {
        // 返回的數據里必須包含 value 和 text 字段
        return res.result.map(item => ({value: item.id, text: item.name}))
      }
      this.$message.warning('loadMenu失敗：' + res.message)
      return []
    },

  }
}
</script>

<style scoped>

</style>