import { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { Button, Form, Input, Typography } from "antd"
import { LockOutlined, MobileOutlined } from "@ant-design/icons"
import { createPortal } from "react-dom"

const { Title, Text } = Typography

type AuthFormValues = {
  identifier: string
  password: string
}

type RegisterFormValues = {
  phone: string
  email: string
  password: string
  confirmPassword: string
}

type AuthModalProps = {
  trigger: ReactNode
  onLogin: (values: AuthFormValues) => void
  onRegister: (values: RegisterFormValues) => void
}

const PANEL_WIDTH = 360

const AuthModal = ({ trigger, onLogin, onRegister }: AuthModalProps) => {
  const [open, setOpen] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [panelHeight, setPanelHeight] = useState<number>()

  const loginPanelRef = useRef<HTMLDivElement>(null)
  const registerPanelRef = useRef<HTMLDivElement>(null)

  const [loginForm] = Form.useForm<AuthFormValues>()
  const [registerForm] = Form.useForm<RegisterFormValues>()

  const handleLoginSubmit = (values: AuthFormValues) => {
    onLogin(values)
    loginForm.resetFields()
    setOpen(false)
  }

  const handleRegisterSubmit = (values: RegisterFormValues) => {
    onRegister(values)
    registerForm.resetFields()
    setOpen(false)
  }

  const measurePanelHeight = useCallback(() => {
    const activePanel = isRegistering ? registerPanelRef.current : loginPanelRef.current
    if (activePanel) {
      setPanelHeight(activePanel.clientHeight)
    }
  }, [isRegistering])

  useLayoutEffect(() => {
    if (!open) {
      return
    }

    measurePanelHeight()
  }, [measurePanelHeight, open])

  useLayoutEffect(() => {
    if (!open || typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(() => measurePanelHeight())

    const loginPanelEl = loginPanelRef.current
    const registerPanelEl = registerPanelRef.current

    if (loginPanelEl) {
      observer.observe(loginPanelEl)
    }
    if (registerPanelEl) {
      observer.observe(registerPanelEl)
    }

    return () => observer.disconnect()
  }, [measurePanelHeight, open])

  const content = (
    <div className="w-[360px] transition-height duration-300" style={{ height: panelHeight ?? undefined }}>
      <div
        className="flex"
        style={{
          width: PANEL_WIDTH * 2,
          transform: isRegistering ? `translateX(-${PANEL_WIDTH}px)` : "translateX(0)",
          transition: "transform 0.28s ease",
        }}
      >
        <div className="w-[360px] p-5 bg-white h-fit" ref={loginPanelRef}>
          <div className="flex flex-col">
            <div className="text-center">
              <Title level={4} className="m-0">
                Đăng nhập
              </Title>
              <Text type="secondary" className="block my-3">
                Nhập số điện thoại / email và mật khẩu để tiếp tục:
              </Text>
            </div>
            <Form layout="vertical" form={loginForm} onFinish={handleLoginSubmit}>
              <Form.Item
                label="Số điện thoại hoặc Email"
                name="identifier"
                rules={[{ required: true, message: "Vui lòng nhập thông tin đăng nhập" }]}
              >
                <Input size="large" placeholder="Ví dụ: 0901234567 / user@example.com" />
              </Form.Item>
              <Form.Item  
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
              >
                <Input.Password size="large" placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
            <div className="text-center text-sm text-gray-500">
              Chưa có tài khoản?
              <Button type="link" onClick={() => setIsRegistering(true)}>
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[360px] p-5 bg-white h-fit" ref={registerPanelRef}>
          <div className="flex flex-col">
            <div className="text-center">
              <Title level={4} className="m-0">
                Đăng ký
              </Title>
              <Text type="secondary" className="block my-3">
                Nhập số điện thoại, email và mật khẩu của bạn:
              </Text>
            </div>
            <Form layout="vertical" form={registerForm} onFinish={handleRegisterSubmit}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  { pattern: /^[0-9]{9,11}$/, message: "Số điện thoại không hợp lệ" },
                ]}
              >
                <Input size="large" prefix={<MobileOutlined />} placeholder="Ví dụ: 0901234567" inputMode="numeric" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input size="large" placeholder="email@example.com" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu" },
                  { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                ]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error("Mật khẩu xác nhận không khớp"))
                    },
                  }),
                ]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Tạo tài khoản
                </Button>
              </Form.Item>
            </Form>
            <div className="text-center text-sm text-gray-500">
              Đã có tài khoản?
              <Button type="link" onClick={() => setIsRegistering(false)}>
                Quay lại đăng nhập
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const [topOffset, setTopOffset] = useState<number>(() => {
    if (typeof document === 'undefined') return 64
    const header = document.querySelector('.app-header') as HTMLElement | null
    return header ? header.offsetHeight : 64
  })

  useEffect(() => {
    const update = () => {
      if (typeof document === 'undefined') return
      const header = document.querySelector('.app-header') as HTMLElement | null
      setTopOffset(header ? header.offsetHeight : 64)
    }

    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  // Close on outside click or Escape key
  useEffect(() => {
    if (!open) return

    const onDocClick = () => setOpen(false)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') setOpen(false)
    }

    // Use capture so clicks from elements that don't stopPropagation are caught
    document.addEventListener('click', onDocClick)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('click', onDocClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        style={{ display: 'inline-block' }}
      >
        {trigger}
      </span>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="auth-dropdown__fixed"
              style={{
                position: 'fixed',
                top: topOffset,
                right: 32,
                width: PANEL_WIDTH,
                zIndex: 1200,
                boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                background: '#fff',
                borderRadius: 8,
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default AuthModal
