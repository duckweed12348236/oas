import {defineComponent, onMounted, reactive, ref} from "vue";
import {
    Input,
    Table,
    Tag,
    Form,
    FormItem,
    Select,
    Option,
    DatePicker,
    CheckTag, DialogPlugin, Tooltip, MessagePlugin, Loading, Button
} from "tdesign-vue-next";
import {AddIcon} from "tdesign-icons-vue-next";
import {request} from "@/extensions/request";
import {useUserStore} from "@/extensions/userStore.js";

export default defineComponent({
    setup() {
        const userStore = useUserStore()

        const users = reactive({
            page: 1,
            size: 25,
            total: 0,
            items: [
                {
                    id: 1,
                    name: "刘文萍",
                    email: "3247296412@qq.com",
                    password: "123456",
                    telephone: "18165682763",
                    status: 1,
                    date_joined: "2025-08-14",
                    department_id: 1,
                    department: {
                        id: 1,
                        name: "董事会",
                        intro: "",
                    }
                }
            ]
        })

        const fetchUsers = async () => {
            const response = await request.get("/staff/user", {
                params: {
                    page: users.page,
                    size: users.size
                }
            })

            if (response.code === 1) {
                Object.assign(users, response.data)
            } else {
                await MessagePlugin.error(response.message)
            }
        }

        const fetchDepartments = async () => {
            const response = await request.get("/staff/department")

            if (response.code === 1) {
                departments.value = response.data
            } else {
                await MessagePlugin.error(response.message)
            }
        }

        const createUser = async (user) => {
            const response = await request.post("/staff/user", user)

            if (response.code === 1) {
                users.items.push(response.data)
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        const updateUser = async (user, index) => {
            const response = await request.put("/staff/user", {
                name: user.name,
                email: user.email,
                password: user.password,
                telephone: user.telephone,
                status: user.status,
                date_joined: user.date_joined,
                department_id: user.department_id,
            }, `${user.id}`)

            if (response.code === 1) {
                Object.assign(users.items[index], response.data)
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        const editUser = (index) => {
            let user = reactive({
                name: "",
                email: "",
                password: "",
                telephone: "",
                status: 1,
                date_joined: "",
                department_id: null
            })

            if (index !== undefined) {
                Object.assign(user, JSON.parse(JSON.stringify(users.items[index])))
            }

            const form = ref()

            const rules = {
                name: [
                    {required: true, message: '姓名不能为空'},
                    {max: 150, message: '姓名长度不能超过150个字符'}
                ],
                email: [
                    {required: true, message: '邮箱不能为空'},
                    {max: 150, message: '邮箱长度不能超过150个字符'}
                ],
                password: [
                    {max: 20, message: '密码长度不能超过20个字符'}
                ],
                telephone: [
                    {required: true, message: '电话不能为空'},
                    {max: 20, message: '电话长度不能超过20个字符'}
                ],
                date_joined: [
                    {required: true, message: '入职日期不能为空'}
                ],
                department_id: [
                    {required: true, message: '部门不能为空'}
                ]
            }

            const loading = ref(false)

            const dialog = DialogPlugin({
                header: index === undefined ? "添加员工" : "编辑员工资料",
                width: 500,
                footer: true,
                body: () => <Form
                    data={user}
                    ref={form}
                    rules={rules}
                    requiredMark={false}
                    labelWidth="100px">
                    <FormItem label="姓名" name="name">
                        <Input v-model={user.name} clearable/>
                    </FormItem>
                    <FormItem label="邮箱" name="email">
                        <Input v-model={user.email} clearable/>
                    </FormItem>
                    <FormItem label="密码" name="password">
                        <Input type="password" v-model={user.password} placeholder="留空则默认为123456" clearable/>
                    </FormItem>
                    <FormItem label="电话" name="telephone">
                        <Input v-model={user.telephone} clearable/>
                    </FormItem>
                    {userStore.user.permission === 3 && <FormItem label="部门" name="department_id">
                        <Select v-model={user.department_id} clearable>
                            {departments.value.map(department => <Option
                                key={department.id}
                                value={department.id}
                                label={department.name}/>)}
                        </Select>
                    </FormItem>}
                    <FormItem label="入职日期" name="date_joined">
                        <DatePicker v-model={user.date_joined} clearable/>
                    </FormItem>
                    <FormItem label="账号状态" name="status">
                        <Select v-model={user.status}>
                            <Option value={1} label="已激活"></Option>
                            <Option value={2} label="已锁定"></Option>
                        </Select>
                    </FormItem>
                </Form>,
                onConfirm: async () => {
                    const result = await form.value.validate()
                    if (result !== true) {
                        return
                    }

                    loading.value = true
                    let reply = null
                    if (index === undefined) {
                        reply = await createUser(user)
                    } else {
                        reply = await updateUser(user, index)
                    }
                    if (reply) {
                        dialog.destroy()
                    }
                    loading.value = false
                },
                confirmLoading: loading
            })
        }

        const departments = ref([
            {
                id: 1,
                name: "董事会",
                intro: ""
            }
        ])

        const statusTags = [
            {},
            {theme: "success", text: '已激活'},
            {theme: "danger", text: '已锁定'},
        ]

        const columns = [
            {
                title: '姓名',
                colKey: 'name',
                ellipsis: true,
            },
            {
                title: '邮箱',
                colKey: 'email',
                ellipsis: true,
            },
            {
                title: '密码',
                colKey: 'password',
                ellipsis: true,
                cell: (h, {row}) => <Input type="password" readonly borderless v-model:value={row.password}/>
            },
            {
                title: '电话',
                colKey: 'telephone',
                ellipsis: true,
            },
            userStore.user.permission === 3 && {
                title: '部门',
                colKey: 'department.name',
                ellipsis: true
            },
            {
                title: '入职日期',
                colKey: 'date_joined',
                ellipsis: true,
                width: 110
            },
            {
                title: '账号状态',
                colKey: 'status',
                cell: (h, {row}) => <Tag
                    bordered
                    shape="round"
                    variant="light-outline"
                    theme={statusTags[row.status].theme}>
                    {statusTags[row.status].text}
                </Tag>,
                width: 90
            },
            {
                title: () => <div style={{display: "flex", alignItems: "center"}}>
                    <span style={{marginRight: "5px"}}>操作</span>
                    <Tooltip content="添加员工">
                        <CheckTag
                            checked={true}
                            theme="primary"
                            variant="light"
                            shape="round"
                            icon={() => <AddIcon/>}
                            onClick={() => editUser()}/>
                    </Tooltip>
                </div>,
                colKey: 'operation',
                cell: (h, {rowIndex}) => <>
                    <CheckTag
                        checked={true}
                        theme="primary"
                        variant="light"
                        onClick={() => editUser(rowIndex)}
                        style={{marginRight: "8px"}}>
                        编辑
                    </CheckTag>
                </>,
                width: 120
            }
        ]

        onMounted(async () => {
            await fetchUsers()
            await fetchDepartments()
        })

        return () => <Table
            data={users.items}
            columns={columns}
            rowKey="id"
            hover={true}
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
            }}/>
    }
})