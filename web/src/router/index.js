import Vue from 'vue'
import VueRouter from 'vue-router'
import record from '../views/record.vue'
import upload from '../views/upload.vue'
import robot from '../views/robot.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'record',
    component: record
}, {
    path: '/upload',
    name: 'upload',
    component: upload
}, {
    path: '/robot',
    name: 'robot',
    component: robot
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
