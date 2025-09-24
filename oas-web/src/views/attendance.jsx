import {defineComponent, onMounted, reactive, ref} from "vue";
import {request} from "@/extensions/request";
import {Link, MessagePlugin, Popconfirm, Textarea} from "tdesign-vue-next";
import {Table, Tag, Space} from 'tdesign-vue-next';


export default defineComponent({
    setup() {
        const leaveRecordTypes = ref([
            {
                id: 1,
                name: "事假"
            },
            {
                id: 2,
                name: "病假"
            },
            {
                id: 3,
                name: "年假"
            },
            {
                id: 4,
                name: "婚假"
            },
            {
                id: 5,
                name: "产假"
            },
            {
                id: 6,
                name: "丧假"
            }
        ])

        const leaveRecords = reactive({
            page: 1,
            size: 25,
            total: 0,
            items: [
                {
                    id: 2,
                    reason: "发高烧，前往医院打点滴。",
                    type_id: 1,
                    type: {
                        id: 1,
                        name: "病假"
                    },
                    status: 0,
                    initiator_id: 7,
                    initiator: {
                        id: 7,
                        name: "刘文萍",
                        email: "liuwenping@qq.com",
                        password: "123456",
                        telephone: "18165682763",
                        status: 1,
                        date_joined: "2025-08-07",
                        department_id: 1,
                        department: {
                            id: 1,
                            name: "董事会",
                            intro: "",
                            manager_id: null,
                            manager: null
                        },
                        permission: 2
                    },
                    approver_id: null,
                    approver: null,
                    begin: "2025-08-05",
                    end: "2025-08-09",
                    initiation_time: "2025-08-27T15:21:57.894278Z",
                    reply: null
                }
            ]
        })

        const fetchLeaveRecords = async () => {
            const response = await request.get('/attendance/leave-record', {
                params: {
                    page: leaveRecords.page,
                    size: leaveRecords.size
                }
            })
            if (response.code === 1) {
                Object.assign(leaveRecords, response.data)
            }
        }

        const approveLeaveRecord = async (index, status, reply) => {
            const leaveRecord = leaveRecords.items[index]

            const response = await request.post('/attendance/leave-record', {
                id: leaveRecord.id,
                status: status,
                reply: reply
            })

            if (response.code === 1) {
                Object.assign(leaveRecord, response.data)
            } else {
                await MessagePlugin.error(response.message)
            }
        }

        const leaveRecordStatusTag = [
            {
                text: "审批中",
                theme: "warning"
            },
            {
                text: "已批准",
                theme: "success"
            },
            {
                text: "已拒绝",
                theme: "danger"
            }
        ]

        const leaveRecordTableColumns = [
            {
                title: "申请人",
                colKey: "initiator.name",
            },
            {
                title: "请假类型",
                colKey: "type.name",
                width: 90
            },
            {
                title: "原因",
                colKey: "reason",
                ellipsis: true,
            },
            {
                title: "开始时间",
                colKey: "begin",
                width: 110
            },
            {
                title: "结束时间",
                colKey: "end",
                width: 110
            },
            {
                title: "审批状态",
                colKey: "status",
                cell: (h, {row}) => <Tag
                    bordered
                    shape="round"
                    variant="light-outline"
                    theme={leaveRecordStatusTag[row.status].theme}>
                    {leaveRecordStatusTag[row.status].text}
                </Tag>,
                width: 90
            },
            {
                title: "审批人",
                colKey: "approver.name",
                cell: (h, {row}) => row.approver ? row.approver.name : '-'
            },
            {
                title: "申请时间",
                colKey: "initiation_time",
                cell: (h, {row}) => row.initiation_time.split('T')[0],
                width: 110
            },
            {
                title: "操作",
                cell: (h, {row, rowIndex}) => {
                    const approval = reactive({
                        status: 0,
                        reply: ""
                    })

                    if (row.status !== 0) {
                        return "-"
                    } else {
                        return <Popconfirm
                            onConfirm={() => approveLeaveRecord(rowIndex, approval.status, approval.reply)}
                            content={() => <div>
                                <div style={{fontWeight: 500, fontSize: "14px", marginBottom: "8px"}}>回复</div>
                                <Textarea
                                    v-model:value={approval.reply}
                                    placeholder="请输入回复（可不填）"
                                    autosize={{minRows: 7}}/>
                            </div>}>
                            <Link
                                theme="primary"
                                hover="color"
                                onClick={() => approval.status = 1}
                                style={{marginRight: "10px"}}>通过</Link>
                            <Link
                                theme="danger"
                                hover="color"
                                onClick={() => approval.status = 2}>拒绝</Link>
                        </Popconfirm>
                    }
                },
                width: 120
            }
        ]

        onMounted(async () => {
            await fetchLeaveRecords()
        })

        return () => <div>
            <Space direction="vertical" style={{width: '100%'}}>
                <Table
                    rowKey="id"
                    data={leaveRecords.items}
                    columns={leaveRecordTableColumns}
                    pagination={{
                        current: leaveRecords.page,
                        pageSize: leaveRecords.size,
                        total: leaveRecords.total,
                        showJumper: true,
                        onCurrentChange: async (page) => {
                            leaveRecords.page = page
                            await fetchLeaveRecords()
                        },
                        onPageSizeChange: async (size) => {
                            leaveRecords.size = size
                            await fetchLeaveRecords()
                        }
                    }}
                    maxHeight={"calc(100vh - 200px)"}
                />
            </Space>
        </div>
    }
})