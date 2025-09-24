import {createRouter, createWebHistory} from 'vue-router';
import {useUserStore} from "@/extensions/userStore.js";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "overview",
            component: () => import('../views/overview.jsx'),
            redirect: {name: 'home'},
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('../views/home.jsx'),
                },
                {
                    path: 'attendance',
                    name: 'attendance',
                    component: () => import('../views/attendance.jsx'),
                },
                {
                    path: 'notice',
                    name: 'notice',
                    component: () => import('../views/notice.jsx'),
                },
                {
                    path: 'employee',
                    name: 'employee',
                    component: () => import('../views/user.jsx'),
                },
                {
                    path: 'department',
                    name: 'department',
                    component: () => import('../views/department.jsx')
                },
                {
                    path: 'permission',
                    name: 'permission',
                    component: () => import('../views/permission.jsx')
                }
            ]
        },
        {
            path: "/login",
            name: "login",
            component: () => import('../views/login.jsx')
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.name === 'login') {
        return next()
    }

    const userStore = useUserStore()
    const user = userStore.user
    const token = userStore.token

    if (token && user.permission >= 2) {
        if (to.name === "department" || to.name === "permission") {
            if (user.permission === 3) {
                return next()
            } else {
                return next({name: 'login'})
            }
        } else {
            return next()
        }
    } else {
        return next({name: 'login'})
    }
})

export {router}