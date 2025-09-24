import {defineComponent, onMounted, reactive, ref} from "vue";
import {Table, Tag, Button, MessagePlugin, RadioGroup, RadioButton} from "tdesign-vue-next";
import {request} from "@/extensions/request";

export default defineComponent({
    setup() {
        const users = reactive({
            page: 1,
            size: 25,
            total: 0,
            items: [{
                id: 1,
                name: "张三",
                email: "zhangsan@qq.com",
                role: 2,
                permission: 2,
                department_id: 1,
                department: {
                    id: 1,
                    name: "部门1"
                }
            }]
        })

        const fetchUsers = async () => {
            const response = await request.get("/permission/user", {
                params: {
                    page: users.page,
                    size: users.size
                }
            })

            if (response.code === 1) {
                Object.assign(users, response.data)
                for (const item of users.items) {
                    item.role = item.permission
                }
            }
        }

        const permissions = {
            1: {label: "用户", theme: "primary"},
            2: {label: "部长", theme: "success"}
        }

        const setUserPermission = async (index, permission) => {
            const user = users.items[index]
            const response = await request.post("/permission", {
                uid: user.id,
                permission: permission
            })

            if (response.code === 1) {
                user.role = user.permission
            } else {
                user.permission = user.role
                await MessagePlugin.error(response.message)
            }
        }

        const columns = [
            {
                title: "姓名",
                colKey: "name",
            },
            {
                title: "邮箱",
                colKey: "email",
            },
            {
                title: "权限",
                colKey: "role",
                cell: (h, {row}) => <Tag theme={permissions[row.permission].theme} variant="light">
                    {permissions[row.permission].label}
                </Tag>
            },
            {
                title: "部门",
                colKey: "department.name",
            },
            {
                title: "操作",
                colKey: "operation",
                cell: (h, {row, rowIndex}) => <RadioGroup
                    v-model:value={row.permission}
                    variant="default-filled"
                    onChange={async (value) => await setUserPermission(rowIndex, value)}>
                    <RadioButton value={1}>用户</RadioButton>
                    <RadioButton value={2}>部长</RadioButton>
                </RadioGroup>
            }
        ]

        onMounted(async () => {
            await fetchUsers()
        })

        return () => <Table
            data={users.items}
            columns={columns}
            rowKey="id"
            maxHeight="calc(100vh - 200px)"
            loading={users.items.length === 0}
            pagination={{
                defaultCurrent: users.page,
                defaultPageSize: users.size,
                total: users.total,
                pageSizeOptions: [10, 20, 25, 50, 100],
                onCurrentChange: async (page) => {
                    users.page = page
                    await fetchUsers()
                },
                onPageSizeChange: async (size) => {
                    users.size = size
                    await fetchUsers()
                }
            }}
        />
    }
})