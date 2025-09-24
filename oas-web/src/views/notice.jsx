import {defineComponent, onMounted, reactive, ref, shallowRef} from "vue";
import {
    Button,
    DrawerPlugin,
    Form,
    FormItem,
    Input,
    MessagePlugin,
    Popconfirm,
    Select, Space, Table,
    Tag,
    Typography
} from "tdesign-vue-next";
import {
    AlarmIcon,
    BrowseIcon,
    DeleteIcon,
    Edit1Icon,
    PlusIcon,
    User1Icon,
} from "tdesign-icons-vue-next";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css';
import {format, parse} from 'date-fns';
import {request} from "@/extensions/request";
import {SERVER_CONFIG} from "@/config";
import {useUserStore} from "@/extensions/userStore.js";


export default defineComponent({
    setup() {
        const notices = ref([
            {
                id: 0,
                title: "string",
                content: "string",
                release_time: "2025-09-13T17:25:27.953Z",
                author: {
                    id: 0,
                    name: "string"
                },
                departments: [
                    {
                        id: 0,
                        name: "string"
                    }
                ]
            }
        ])

        const departments = ref([
            {
                id: null,
                name: "",
                intro: ""
            }
        ])

        const user = useUserStore().user

        const columns = [
            {
                colKey: "id",
                cell: (h, {row, rowIndex}) => <div
                    style={{
                        padding: "10px",
                        border: "1px solid rgb(97, 175, 254)",
                        background: "rgba(97, 175, 254, .1)",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                    <div style={{display: "flex", flexDirection: "column", flex: 6}}>
                        <span style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            display: "inline-block",
                            maxWidth: "900px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}>
                                {row.title}
                            </span>
                        <span style={{marginTop: "5px", display: "flex", alignItems: "center"}}>
                            <span style={{display: "flex", alignItems: "center", marginRight: "10px"}}>
                                <AlarmIcon/>
                                <span style={{
                                    marginLeft: "3px",
                                    fontSize: "13px",
                                    fontWeight: 400
                                }}>
                                    {format(new Date(row.release_time), 'yyyy-MM-dd HH:mm:ss')}
                                </span>
                            </span>
                            <span style={{display: "flex", alignItems: "center"}}>
                                <User1Icon/>
                                <span style={{
                                    marginLeft: "3px",
                                    fontSize: "13px",
                                    fontWeight: 400
                                }}>
                                    {row.author.name}
                                </span>
                            </span>
                        </span>
                        {user.permission === 3 && <Space size="small" style={{marginTop: "5px"}}>
                            {row.departments.map(department =>
                                <Tag size="small" theme="success" variant="light-outline">
                                    {department.name}
                                </Tag>)}
                        </Space>}
                    </div>
                    <Space style={{flex: 1}}>
                        <Button shape="circle" variant="text" onClick={() => viewNotice(rowIndex)}>
                            <BrowseIcon/>
                        </Button>
                        <Button shape="circle" variant="text" onClick={() => releaseNotice(rowIndex)}>
                            <Edit1Icon/>
                        </Button>
                        <Popconfirm content="确定要删除吗" onConfirm={() => deleteNotice(rowIndex)}>
                            <Button shape="circle" variant="text">
                                <DeleteIcon/>
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            }
        ]

        const renderTableFooter = () => <Button
            theme="primary"
            variant="outline"
            onClick={() => releaseNotice()}
            style={{width: "100%"}}>
            <PlusIcon/>
        </Button>

        const fetchNotices = async () => {
            const response = await request.get("/notification/notice")

            if (response.code === 1) {
                notices.value = response.data
                for (let notice of notices.value) {
                    notice.department_ids = notice.departments.map(department => department.id)
                }
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

        const createNotice = async (notice) => {
            const response = await request.post("/notification/notice", notice)

            if (response.code === 1) {
                response.data.department_ids = response.data.departments.map(department => department.id)
                notices.value.push(response.data)
                await MessagePlugin.success("发布成功！")
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        const updateNotice = async (notice, index) => {
            const response = await request.put("/notification/notice", {
                title: notice.title,
                content: notice.content,
                department_ids: notice.department_ids
            }, notice.id)

            if (response.code === 1) {
                response.data.department_ids = response.data.departments.map(department => department.id)
                notices.value[index] = response.data
                await MessagePlugin.success("修改成功！")
                return true
            } else {
                await MessagePlugin.error(response.message)
                return false
            }
        }

        const deleteNotice = async (index) => {
            const response = await request.delete("/notification/notice", {path: notices.value[index].id})

            if (response.code === 1) {
                notices.value.splice(index, 1)
                await MessagePlugin.success("删除成功！")
            } else {
                await MessagePlugin.error(response.message)
            }
        }

        const viewNotice = (index) => {
            const notice = notices.value[index]

            const drawer = DrawerPlugin({
                header: () => <div style={{width: "100%"}}>
                    <span style={{
                        margin: "10px 0",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "20px",
                        fontWeight: "bold"
                    }}>{notice.title}</span>
                    <div>
                        <Typography content={notice.author.name} style={{marginRight: "15px"}}/>
                        <Typography
                            theme="secondary"
                            content={format(new Date(notice.release_time), 'yyyy-MM-dd HH:mm:ss')}/>
                    </div>
                </div>,
                body: () => <div v-html={notice.content}/>,
                footer: null,
                closeBtn: true,
                onClose: () => drawer.destroy(),
                size: "95%"
            })
        }

        const releaseNotice = (index) => {
            let notice = reactive({
                title: "",
                content: "",
                department_ids: []
            })

            if (index !== undefined) {
                Object.assign(notice, JSON.parse(JSON.stringify(notices.value[index])))
            }

            let editor = shallowRef()

            const editorConfig = {
                placeholder: '请输入内容...',
                MENU_CONF: {
                    uploadImage: {
                        server: `${SERVER_CONFIG.url}/notification/image`,
                        fieldName: 'image',
                        maxFileSize: 5 * 1024 * 1024
                    }
                }
            }

            const editorToolbarConfig = {}

            const options = [
                {
                    label: "全选",
                    checkAll: true
                },
                ...departments.value.map(department => ({
                    label: department.name,
                    value: department.id
                }))
            ]

            const form = ref()

            const rules = {
                title: [
                    {
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    },
                    {
                        max: 100,
                        message: '标题长度不能超过100个字符',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '内容不能为空',
                        trigger: 'blur'
                    }
                ],
                department_ids: [
                    {
                        required: true,
                        message: '请选择至少一个部门',
                        trigger: 'change',
                        type: 'array'
                    }
                ]
            }

            const drawer = DrawerPlugin({
                header: () => <span
                    style={{width: "100%", display: "flex", justifyContent: "center"}}>
                    发布通知
                </span>,
                body: () => <Form
                    requiredMark={false}
                    ref={form}
                    data={notice}
                    rules={rules}>
                    <FormItem
                        label="标题"
                        name="title">
                        <Input v-model={notice.title}/>
                    </FormItem>
                    {user.permission === 3 && <FormItem label="部门" name="department_ids">
                        <Select
                            v-model:value={notice.department_ids}
                            multiple
                            filterable
                            clearable
                            options={options}
                            placeholder="请选择部门"/>
                    </FormItem>}
                    <FormItem label="内容" name="content">
                        <div style={{border: '1px solid #ccc', borderRadius: '4px'}}>
                            <Toolbar
                                style={{height: "80px", borderBottom: '1px solid #ccc'}}
                                editor={editor.value}
                                defaultConfig={editorToolbarConfig}
                                mode="default"/>
                            <Editor
                                style={{height: '450px', overflowY: 'auto'}}
                                v-model={notice.content}
                                defaultConfig={editorConfig}
                                onOnCreated={editorInstance => editor.value = editorInstance}
                                mode="default"/>
                        </div>
                    </FormItem>
                </Form>,
                closeBtn: true,
                onClose: () => {
                    editor.value.destroy()
                    drawer.destroy()
                },
                onConfirm: async () => {
                    const result = await form.value.validate()
                    if (result !== true) {
                        return
                    }

                    let reply = null
                    if (index === undefined) {
                        reply = await createNotice(notice)
                    } else {
                        reply = await updateNotice(notice, index)
                    }
                    if (reply) {
                        editor.value.destroy()
                        drawer.destroy()
                    }
                },
                size: "80%"
            })
        }

        onMounted(async () => {
            await fetchDepartments()
            await fetchNotices()
        })

        return () => <Table
            data={notices.value}
            columns={columns}
            maxHeight="calc(100vh - 125px)"
            footerSummary={renderTableFooter}/>
    }
})