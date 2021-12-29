<template>
  <a-card :bordered="false">

    <a-tabs>
      <a-tab-pane tab="基礎示例" key="1" forceRender>
        <j-vxe-demo1/>
      </a-tab-pane>

      <a-tab-pane tab="高級示例" key="2" forceRender>
        <j-vxe-demo2/>
      </a-tab-pane>

      <a-tab-pane tab="聯動示例" key="3" forceRender>
        <j-vxe-demo3/>
      </a-tab-pane>

    </a-tabs>
  </a-card>
</template>

<script>
  import JVxeDemo1 from '@views/jeecg/JVxeDemo/JVxeDemo1'
  import JVxeDemo2 from '@views/jeecg/JVxeDemo/JVxeDemo2'
  import JVxeDemo3 from '@views/jeecg/JVxeDemo/JVxeDemo3'

  export default {
    name: 'JVXETableDemo',
    components: {JVxeDemo2, JVxeDemo1,JVxeDemo3},
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped>

</style>