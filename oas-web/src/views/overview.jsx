import {defineComponent, ref} from "vue";
import {RouterView} from "vue-router";
import {Aside, Avatar, Content, Dropdown, Header, Layout, Menu, MenuItem, Typography} from "tdesign-vue-next";
import {
    LogoChromeIcon,
    UserIcon,
    HomeIcon,
    CalendarIcon,
    NotificationIcon,
    UsergroupIcon,
    UserLockedIcon
} from "tdesign-icons-vue-next";
import {router} from "@/extensions/router.js";
import {useUserStore} from "@/extensions/userStore.js";

export default defineComponent({
    setup() {
        const userStore = useUserStore()

        const user = userStore.user

        const logout = async () => {
            userStore.clear()
            await router.push({name: "login"})
        }

        const userActionDropdownOptions = [
            {
                content: "修改密码",
                value: 0,
                action: () => {
                    console.log("修改密码")
                },
                divider: true
            },
            {
                content: "退出登录",
                action: logout,
                value: 1
            }
        ]

        const routeMenuItems = [
            {
                label: '首页',
                icon: <HomeIcon/>,
                visible: user.permission >= 2
            },
            {
                label: '考勤',
                icon: <CalendarIcon/>,
                visible: user.permission >= 2
            },
            {
                label: '通知',
                icon: <NotificationIcon/>,
                visible: user.permission >= 2
            },
            {
                label: '员工',
                icon: <UserIcon/>,
                visible: user.permission >= 2
            },
            {
                label: '部门',
                icon: <UsergroupIcon/>,
                visible: user.permission === 3
            },
            {
                label: '权限',
                icon: <UserLockedIcon/>,
                visible: user.permission === 3
            }
        ].map((item, index) => ({
            label: item.label,
            icon: item.icon,
            name: router.getRoutes()[index].name,
            visible: item.visible
        }))

        const currentRoute = ref(router.currentRoute.value.name)

        const navigate = async (value) => {
            currentRoute.value = value
            await router.push({name: value})
        }

        return () => <Layout>
            <Aside style={{
                minHeight: "100vh",
                maxHeight: "100vh",
                marginRight: "3px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div onClick={() => navigate("home")} style={{marginTop: "10px", cursor: "pointer"}}>
                    <LogoChromeIcon size="40px" style={{marginRight: "5px", color: "#0052D9"}}/>
                    <Typography italic strong style={{color: "#0052D9"}}>OA系统</Typography>
                </div>
                <Menu v-model:value={currentRoute.value} onChange={navigate}>
                    {routeMenuItems.filter(item => item.visible).map(item => <MenuItem
                        icon={() => item.icon}
                        value={item.name}
                        key={item.name}>
                        {item.label}
                    </MenuItem>)}
                </Menu>
            </Aside>
            <Layout>
                <Header height={"75px"}>
                    <div
                        style={{
                            height: "100%",
                            padding: "0 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                        }}>
                        <Dropdown
                            options={userActionDropdownOptions}
                            onClick={(option) => option.action()}>
                            <Avatar>
                                <UserIcon size="20px"/>
                            </Avatar>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{padding: "24px"}}>
                    <RouterView style={{backgroundColor: "white"}}/>
                </Content>
            </Layout>
        </Layout>
    }
})