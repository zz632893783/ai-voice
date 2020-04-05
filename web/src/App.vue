<template>
    <el-container id="app">
        <el-aside width="200px">
            <el-menu class="el-menu-demo" v-on:select="handleSelect">
                <el-menu-item v-for="(item, index) in menuList" v-bind:key="index" v-on:click="jumpTo(item)">{{item.label}}</el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view/>
        </el-main>
    </el-container>
</template>
<script>
export default {
    data: function () {
        return {
            menuList: [{
                path: '/',
                label: '录音'
            }, {
                path: '/upload',
                label: '上传'
            }, {
                path: '/robot',
                label: '聊天机器人'
            }]
        }
    },
    methods: {
        handleSelect: function () {},
        jumpTo: function (routerObj) {
            this.$route.path !== routerObj.path && this.$router.push({
                path: routerObj.path
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
.el-menu {
    height: 100%;
}
</style>
