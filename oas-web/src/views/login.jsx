import {defineComponent, reactive, ref} from "vue";
import {request} from "@/extensions/request.js";
import {router} from "@/extensions/router.js";
import {useUserStore} from "@/extensions/userStore.js";
import {Button, Form, FormItem, Icon, Input, MessagePlugin} from "tdesign-vue-next";
import "@/assets/css/login.css";

export default defineComponent({
    setup() {
        const userStore = useUserStore()

        const account = reactive({
            email: "",
            password: ""
        })

        const accountForm = ref()
        const accountFormLoading = ref(false)

        const accountFormRules = {
            email: [
                {required: true, message: "邮箱必填"},
                {email: true, message: "请输入正确的邮箱地址"}
            ],
            password: [
                {required: true, message: "密码必填"},
                {min: 6, message: "密码至少6位"}
            ]
        }

        const login = () => {
            accountForm.value.validate().then(async (result) => {
                accountFormLoading.value = true

                const response = await request.post("/staff/login", {
                    email: account.email,
                    password: account.password
                })

                if (response.code === 1) {
                    await MessagePlugin.success("登录成功")
                    userStore.setUser(response.data.user)
                    userStore.setToken(response.data.token)
                    accountFormLoading.value = false
                    await router.push({name: "overview"})
                } else {
                    await MessagePlugin.error(response.message)
                    accountFormLoading.value = false
                }
            })
        }

        return () => <div class="login-page">
            <div class="login-container">
                <div class="login-header">
                    <h2>用户登录</h2>
                </div>

                <Form
                    ref={accountForm}
                    data={account}
                    rules={accountFormRules}
                    labelWidth={0}>
                    <FormItem name="email">
                        <Input
                            v-model:value={account.email}
                            placeholder="请输入邮箱"
                            size="large"
                            clearable
                            prefixIcon={() => <Icon name="mail"/>}/>
                    </FormItem>

                    <FormItem name="password">
                        <Input
                            v-model:value={account.password}
                            type="password"
                            placeholder="请输入密码"
                            size="large"
                            clearable
                            prefixIcon={() => <Icon name="lock-on"/>}/>
                    </FormItem>

                    <FormItem>
                        <Button
                            theme="primary"
                            size="large"
                            block
                            loading={accountFormLoading.value}
                            disabled={accountFormLoading.value}
                            onClick={login}>
                            登录
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>

    }
})