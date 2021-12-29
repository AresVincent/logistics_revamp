import Menu from 'ant-design-vue/es/menu'
import Icon from 'ant-design-vue/es/icon'

const { Item, SubMenu } = Menu

export default {
  name: 'SMenu',
  props: {
    menu: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      openKeys: [],
      selectedKeys: [],
      cachedOpenKeys: []
    }
  },
  computed: {
    rootSubmenuKeys: vm => {
      const keys = []
      vm.menu.forEach(item => keys.push(item.path))
      return keys
    }
  },
  mounted () {
    this.updateMenu()
  },
  watch: {
    collapsed (val) {
      if (val) {
        this.cachedOpenKeys = this.openKeys.concat()
        this.openKeys = []
      } else {
        this.openKeys = this.cachedOpenKeys
      }
    },
    $route: function () {
      this.updateMenu()
    }
  },
  methods: {
    // select menu item
    onOpenChange (openKeys) {

      // 在水平模式下時執行，並且不再執行後續
      if (this.mode === 'horizontal') {
        this.openKeys = openKeys
        return
      }
      // 非水平模式時
      const latestOpenKey = openKeys.find(key => !this.openKeys.includes(key))
      if (!this.rootSubmenuKeys.includes(latestOpenKey)) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    updateMenu () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }
      let openKeys = []
      if (this.mode === 'inline') {
        routes.forEach(item => {
          openKeys.push(item.path)
        })
      }

      // update-begin-author:sunjianlei date:20210409 for: 修復動態功能測試菜單、帶參數菜單標題錯誤、展開錯誤的問題
      // 包含冒號的是動態菜單
      if (this.selectedKeys[0].includes(':')) {
        let selectedKey = this.$route.fullPath
        this.selectedKeys = [selectedKey]
        let newOpenKeys = []
        this.fullOpenKeys(this.menu, selectedKey, newOpenKeys)
        if (newOpenKeys.length > 0) {
          openKeys = newOpenKeys.reverse()
        }
      }
      // update-end-author:sunjianlei date:20210409 for: 修復動態功能測試菜單、帶參數菜單標題錯誤、展開錯誤的問題

      //update-begin-author:taoyan date:20190510 for:online表單菜單點擊展開的一級目錄不對
      if(!this.selectedKeys || this.selectedKeys[0].indexOf(":")<0){
        this.collapsed ? (this.cachedOpenKeys = openKeys) : (this.openKeys = openKeys)
      }
      //update-end-author:taoyan date:20190510 for:online表單菜單點擊展開的一級目錄不對
    },
    // update-begin-author:sunjianlei date:20210409 for: 修復動態功能測試菜單、帶參數菜單標題錯誤、展開錯誤的問題
    // 遞歸查找當前選中的菜單和父級菜單，填充openKeys
    fullOpenKeys(menus, selectedKey, openKeys) {
      for (let item of menus) {
        if (item.path === selectedKey) {
          openKeys.push(item.path)
          this.$emit('updateMenuTitle', item)
          return true
        } else if (Array.isArray(item.children)) {
          if (this.fullOpenKeys(item.children, selectedKey, openKeys)) {
            openKeys.push(item.path)
            return true
          }
        }
      }
    },
    // update-end-author:sunjianlei date:20210409 for: 修復動態功能測試菜單、帶參數菜單標題錯誤、展開錯誤的問題

    // render
    renderItem (menu) {
      if (!menu.hidden) {
        return menu.children && !menu.alwaysShow ? this.renderSubMenu(menu) : this.renderMenuItem(menu)
      }
      return null
    },
    renderMenuItem (menu) {
      const target = menu.meta.target || null
      const tag = target && 'a' || 'router-link'
      let props = { to: { name: menu.name } }
      if(menu.route && menu.route === '0'){
        props = { to: { path: menu.path } }
      }

      const attrs = { href: menu.path, target: menu.meta.target }

      if (menu.children && menu.alwaysShow) {
        // 把有子菜單的 並且 父菜單是要隱藏子菜單的
        // 都給子菜單增加一個 hidden 屬性
        // 用來給刷新頁面時， selectedKeys 做控制用
        menu.children.forEach(item => {
          item.meta = Object.assign(item.meta, { hidden: true })
        })
      }

      return (
        <Item {...{ key: menu.path }}>
          <tag {...{ props, attrs }}>
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </tag>
        </Item>
      )
    },
    renderSubMenu (menu) {
      const itemArr = []
      if (!menu.alwaysShow) {
        menu.children.forEach(item => itemArr.push(this.renderItem(item)))
      }
      return (
        <SubMenu {...{ key: menu.path }}>
          <span slot="title">
            {this.renderIcon(menu.meta.icon)}
            <span>{menu.meta.title}</span>
          </span>
          {itemArr}
        </SubMenu>
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined) {
        return null
      }
      const props = {}
      typeof (icon) === 'object' ? props.component = icon : props.type = icon
      return (
        <Icon {... { props } }/>
      )
    }
  },

  render () {
    const { mode, theme, menu } = this
    const props = {
      mode: mode,
      theme: theme,
      openKeys: this.openKeys
    }
    const on = {
      select: obj => {
        this.selectedKeys = obj.selectedKeys
        this.$emit('select', obj)
      },
      openChange: this.onOpenChange
    }

    const menuTree = menu.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderItem(item)
    })
    // {...{ props, on: on }}
    return (
      <Menu vModel={this.selectedKeys} {...{ props, on: on }}>
        {menuTree}
      </Menu>
    )
  }
}
