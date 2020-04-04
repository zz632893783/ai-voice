import Vue from 'vue'
import VueRouter from 'vue-router'
import record from '../views/record.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'record',
    component: record
}]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
