import {defineComponent, onMounted, reactive, ref} from "vue";
import {
    Card,
    Col,
    Row,
    Button,
    Space,
    MessagePlugin,
    Avatar,
    Notification, Title, Text
} from "tdesign-vue-next";
import {
    NotificationIcon,
    CalendarIcon,
    UsergroupIcon,
    UserIcon,
    Edit1Icon,
    PoweroffIcon,
    MailIcon
} from "tdesign-icons-vue-next";
import {request} from "@/extensions/request";
import {useUserStore} from "@/extensions/userStore.js";
import {router} from "@/extensions/router.js";
import {format} from "date-fns";

export default defineComponent({
    setup() {
        const userStore = useUserStore()
        const user = userStore.user

        const count = reactive({
            user: 0,
            department: 0,
            notice: 0,
            leave_record: 0
        })

        const fetchCount = async () => {
            const response = await request.get("/home")

            if (response.code === 1) {
                Object.assign(count, response.data)
            }
        }

        const cards = [
            {
                title: "用户总数",
                icon: <UserIcon size="36px" style={{color: "#1890ff"}}/>,
                backgroundColor: "#e0f3ff",
                count: count.user,
                visible: user.permission >= 2
            },
            {
                title: "部门总数",
                icon: <UsergroupIcon size="36px" style={{color: "#fa8c16"}}/>,
                backgroundColor: "#fff1e0",
                count: count.department,
                visible: user.permission >= 2
            },
            {
                title: "最新通知",
                icon: <NotificationIcon size="36px" style={{color: "#722ed1"}}/>,
                backgroundColor: "#f9f0ff",
                count: count.notice,
                visible: user.permission >= 2
            },
            {
                title: "请假记录",
                icon: <CalendarIcon size="36px" style={{color: "#389e0d"}}/>,
                backgroundColor: "#e8fff5",
                count: count.leave_record,
                visible: user.permission >= 3
            }
        ]

        onMounted(async () => {
            await fetchCount()
        })

        return () => <div style={{padding: "12px"}}>
            <Text strong>欢迎回来，{user.name}</Text>
            <Row gutter={[12, 12]}>
                {cards.filter(card => card.visible).map(card => (<Col flex="1">
                    <Card style={{height: "120px"}}>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <div style={{
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                backgroundColor: card.backgroundColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "16px"
                            }}>
                                {card.icon}
                            </div>
                            <div>
                                <div style={{fontSize: "16px", color: "#666", marginBottom: "8px"}}>
                                    {card.title}
                                </div>
                                <div style={{fontSize: "28px", fontWeight: "bold"}}>
                                    {card.count}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>))}
            </Row>
        </div>
    }
})