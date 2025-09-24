import {defineComponent, onMounted, reactive, ref} from "vue";
import {
    Table,
    DialogPlugin,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    MessagePlugin, Tooltip, CheckTag, Textarea
} from "tdesign-vue-next";
import {request} from "@/extensions/request";
import {AddIcon} from "tdesign-icons-vue-next";

export default defineComponent({
    setup() {
        const departments = ref([])

        const columns = [
            {
                title: "部门名称",
                colKey: "name",
                width: 200,
            },
            {
                title: "部门简介",
                colKey: "intro",
            },
            {
                title: "部门领导",
                colKey: "manager.name",
                width: 150,
            },
            {
                title: () => <div style={{display: "flex", alignItems: "center"}}>
                    <span style={{marginRight: "5px"}}>操作</span>
                    <Tooltip content="添加部门">
                        <CheckTag
                            checked={true}
                            theme="primary"
                            variant="light"
                            shape="round"
                            icon={() => <AddIcon/>}
                            onClick={() => editDepartment()}/>
                    </Tooltip>
                </div>,
                colKey: 'operation',
                cell: (h, {rowIndex}) => <CheckTag
                    checked={true}
                    theme="primary"
                    variant="light"
                    onClick={() => editDepartment(rowIndex)}
                    style={{marginRight: "8px"}}>
                    编辑
                </CheckTag>,
                width: 120
            }
        ]

        const fetchDepartments = async () => {
            const response = await request.get("/department")

            if (response.code === 1) {
                departments.value = response.data
            }
        }

        const editDepartment = async (index) => {
            let department = reactive({
                name: "",
                intro: "",
                manager_id: null
            })
            const users = ref([])
            const form = ref()

            if (index !== undefined) {
                Object.assign(department, departments.value[index])
                const response = await request.get("/department/user", {
                    params: {
                        department_id: department.id
                    }
                })
                if (response.code === 1) {
                    users.value = response.data
                } else {
                    await MessagePlugin.error(response.message)
                }
            }

            const rules = {
                name: [
                    {required: true, message: "请输入部门名称"},
                    {max: 50, message: "部门名称长度不能超过50个字符"}
                ],
                manager_id: [
                    {required: true, message: "请选择部门领导"}
                ]
            }

            const loading = ref(false)

            const dialog = DialogPlugin({
                header: index === undefined ? "添加部门" : "编辑部门",
                width: "500px",
                body: () => <Form
                    labelWidth="100"
                    ref={form}
                    rules={rules} data={department}
                    requiredMark={false}>
                    <FormItem label="部门名称" name="name">
                        <Input v-model={department.name} placeholder="请输入部门名称"/>
                    </FormItem>
                    <FormItem label="部门简介" name="intro">
                        <Textarea
                            v-model={department.intro}
                            placeholder="请输入部门简介"
                            clearable
                            autosize={{minRows: 5}}/>
                    </FormItem>
                    {index !== undefined && <FormItem label="部门领导" name="manager_id">
                        <Select v-model={department.manager_id} clearable>
                            {users.value.map(user => <Option
                                key={user.id}
                                value={user.id}
                                label={user.name}/>)}
                        </Select>
                    </FormItem>}
                </Form>,
                onConfirm: async () => {
                    const result = await form.value.validate()
                    if (result !== true) {
                        return
                    }

                    loading.value = true
                    let reply = null
                    if (index !== undefined) {
                        reply = await updateDepartment(department, index)
                    } else {
                        reply = await createDepartment(department)
                    }

                    if (reply) {
                        dialog.destroy()
                    }
                    loading.value = false
                },
                confirmLoading: loading
            })
        }

        const createDepartment = async (department) => {
            const response = await request.post("/department", {
                name: department.name,
                intro: department.intro,
            })

            if (response.code === 1) {
                departments.value.push(response.data)
                await MessagePlugin.success("部门创建成功")
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        const updateDepartment = async (department, index) => {
            const response = await request.put("/department", {
                name: department.name,
                intro: department.intro,
                manager_id: department.manager_id
            }, `${department.id}`)

            if (response.code === 1) {
                departments.value[index] = response.data
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        onMounted(async () => {
            await fetchDepartments()
        })

        return () => <Table
            data={departments.value}
            columns={columns}
            rowKey="id"
            hover={true}
            loading={departments.value.length === 0}
            maxHeight="calc(100vh - 150px)"/>
    }
})