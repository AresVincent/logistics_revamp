<template>
    <a-card>
        <a-form layout="inline" :form="form" @submit="handleSubmit">
            <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
            <a-input
                v-decorator="[
                'userName',
                { rules: [{ required: true, message: 'Please input area!' }] },
                ]"
                placeholder="地區"
            >
                <!-- <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" /> -->
            </a-input>
            </a-form-item>
            <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
            <a-input
                v-decorator="[
                'password',
                { rules: [{ required: true, message: 'Please input store type!' }] },
                ]"
                placeholder="門市類型"
            >
                <!-- <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" /> -->
            </a-input>
            </a-form-item>
            <a-form-item>
            <a-button type="primary" html-type="submit" >
                搜尋
            </a-button>
            </a-form-item>
        </a-form>
        <div class="bmap-page-container">
            <el-bmap class="bmap-box bmap-logistics" ref="logisticsMap" :min-zoom="10" :max-zoom="30" :tilt="tilt" :center="center" :zoom="zoom" :vid="'bmap-vue'">
                <el-bmap-marker v-for="(marker, index) in markers" :key="index" :visible="marker.visible" :position="marker.position" :title="marker.title" :label="marker.label" :vid="index"></el-bmap-marker>
            </el-bmap>
        </div>
    </a-card>
</template>
<script>
import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
import { deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'


    export default ({
        name:"LogisticsMap",
        data(){
            return{
                // 地圖的角度
                tilt:0,
                zoom:13,
                center:[114.2,22.3],
                markers:[
                    {
                        position:[114.2,22.301],
                        visible: true,
                        // icon: {
                        //     url: carIcon,
                        //     size: [44, 88],
                        // },
                    },
                    {
                        position:[114.2,22.308],
                        visible: true,
                        // icon: {
                        //     url: carIcon,
                        //     size: [44, 88],
                        // },
                    }
                ],
                points:[],
                form: this.$form.createForm(this, { name: 'horizontal_login' }),
                url: {
                    list: "/outlet/logisticsOutlets/list",
                },
            }
        },
        methods:{
            initDict(){
                initDictOptions('logistics_outlets,id,store_name').then((res)=>{
                    this.points=res.result
                })
            },
            InitMarker(){

            },
            loadData(){
                getAction(this.url.list).then(res=>{
                    console.log(res)
                })
            },
             // Only show error after a field is touched.
            userNameError() {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('userName') && getFieldError('userName');
            },
            // Only show error after a field is touched.
            passwordError() {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('password') && getFieldError('password');
            },
            handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                console.log('Received values of form: ', values);
                }
            });
            },
        },
        beforeMount(){

        },
        created(){
            this.initDict();
            // this.loadData();
        },
        mounted(){
             this.$nextTick(() => {
            // To disabled submit button at the beginning.
            this.form.validateFields();
            });
        }
        
    })
</script>
<style scoped>
.bmap-logistics{
    height: 500px;
}
</style>
