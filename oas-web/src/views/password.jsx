import {DialogPlugin, Form, FormItem, Input, MessagePlugin} from "tdesign-vue-next";
import {reactive, ref} from "vue";
import {request} from "@/extensions/request.js";

const resetPassword = () => {
    const passwordGroup = reactive({
        old_password: "",
        new_password: "",
        confirm_password: ""
    })

    const loading = ref(false)

    const rules = {
        old_password: [
            {
                required: true,
                message: "请输入旧密码",
                type: "error"
            },
            {
                min: 6,
                message: "密码至少6位",
                type: "error"
            },
            {
                max: 20,
                message: "密码最多20位",
                type: "error"
            }
        ],
        new_password: [
            {
                required: true,
                message: "请输入新密码",
                type: "error"
            },
            {
                min: 6,
                message: "密码至少6位",
                type: "error"
            },
            {
                max: 20,
                message: "密码最多20位",
                type: "error"
            }
        ],
        confirm_password: [
            {
                required: true,
                message: "请输入确认密码",
                type: "error"
            },
            {
                min: 6,
                message: "密码至少6位",
                type: "error"
            },
            {
                max: 20,
                message: "密码最多20位",
                type: "error"
            }
        ]
    }

    const submit = async () => {
        const response = await request.post("employee/password/", passwordGroup)
        const reply = response.code === 1

        if (!reply) {
            await MessagePlugin.error(response.message)
        }
        return reply
    }

    const form = ref()

    const dialog = DialogPlugin({
        header: "重置密码",
        body: () => <Form data={passwordGroup} rules={rules} ref={form}>
            <FormItem label="旧密码" name="old_password">
                <Input clearable/>
            </FormItem>
            <FormItem label="新密码" name="new_password">
                <Input clearable/>
            </FormItem>
            <FormItem label="确认密码" name="confirm_password">
                <Input clearable/>
            </FormItem>
        </Form>,
        onConfirm: async () => {
            const result = await form.value.validate()
            if (result !== true) {
                return
            }

            loading.value = true
            const reply = await submit()
            if (reply) {
                dialog.destroy()
            }
        },
        confirmLoading: loading
    })
}

export {resetPassword}