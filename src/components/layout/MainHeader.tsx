import { useCallback, useEffect, useMemo, useState } from "react"
import type { MouseEvent } from "react"
import type { MenuProps, TabsProps } from "antd"
import {
  Badge,
  Button,
  Drawer,
  Dropdown,
  Grid,
  Input,
  Layout,
  Menu,
  Tabs,
  Typography,
} from "antd"
import {
  BellOutlined,
  DownOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  MenuOutlined,
  PlayCircleFilled,
  SearchOutlined,
} from "@ant-design/icons"
import type { LocationOption, NavigationTab } from "../../types"

const { Header } = Layout
const { Title, Text } = Typography

type MainHeaderProps = {
  locations: LocationOption[] 
  navigationTabs: NavigationTab[] 
  activeTab?: string
  onTabChange?: (key: string) => void
  getTabHref?: (key: string) => string
  selectedLocationKey?: string
  onLocationChange?: (key: string) => void
  isLoggedIn: boolean
  alertsCount?: number
  authControl: React.ReactNode
}

const MainHeader = ({
  locations,
  navigationTabs,
  activeTab,
  onTabChange,
  getTabHref,
  selectedLocationKey,
  onLocationChange,
  isLoggedIn,
  alertsCount = 0,
  authControl,
}: MainHeaderProps) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [internalLocationKey, setInternalLocationKey] = useState<string | null>(
    locations[0]?.key ?? null
  )

  const activeLocationKey = selectedLocationKey ?? internalLocationKey
  const selectedLocation = useMemo<LocationOption | null>(
    () => locations.find((location) => location.key === activeLocationKey) ?? null,
    [locations, activeLocationKey]
  )
  // Lấy breakpoint kiểm tra xem có phải desktop hay không
  const screens = Grid.useBreakpoint()
  const isDesktop = screens.lg ?? false

  const handleLocationSelect = useCallback(
    (key: string) => {
      if (onLocationChange) {
        onLocationChange(key)
      } else {
        setInternalLocationKey(key)
      }
    },
    [onLocationChange]
  )

  const locationMenu = useMemo<MenuProps>(
    () => ({
      items: locations.map((location) => ({
        key: location.key,
        label: location.label,
      })),
      onClick: ({ key }) => {
        handleLocationSelect(String(key))
      },
    }),
    [locations, handleLocationSelect]
  )

  const resolveTabHref = useCallback(
    (tabKey: string) => (getTabHref ? getTabHref(tabKey) : `/${tabKey}`),
    [getTabHref]
  )

  const handleNavigationChange = useCallback(
    (key: string) => {
      onTabChange?.(key)
      if (!isDesktop) {
        setMobileNavOpen(false)
      }
    },
    [onTabChange, isDesktop, setMobileNavOpen]
  )

  const handleTabLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, key: string) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }
      event.preventDefault()
      handleNavigationChange(key)
    },
    [handleNavigationChange]
  )

  const tabItems = useMemo<TabsProps["items"]>(
    () =>
      navigationTabs.map((tab) => ({
        key: tab.key,
        label: (
          <a
            href={resolveTabHref(tab.key)}
            onClick={(event) => handleTabLinkClick(event, tab.key)}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {tab.label}
          </a>
        ),
      })),
    [navigationTabs, resolveTabHref, handleTabLinkClick]
  )

  const mobileMenuItems = useMemo<MenuProps["items"]>(
    () =>
      navigationTabs.map((tab) => ({
        key: tab.key,
        label: (
          <a
            href={resolveTabHref(tab.key)}
            onClick={(event) => handleTabLinkClick(event, tab.key)}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {tab.label}
          </a>
        ),
      })),
    [navigationTabs, resolveTabHref, handleTabLinkClick]
  )

  const fallbackTabKey = tabItems?.[0]?.key
  const currentTabKey = activeTab ?? fallbackTabKey

  useEffect(() => {
    if (isDesktop) {
      setMobileNavOpen(false)
    }
  }, [isDesktop])

  return (
    <Header className="!sticky z-20 top-0 !bg-white border-b border-gray-100">
      <div className="w-full h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* Chia nửa trái */}
          <div className="flex justify-between items-center">
            {/* Logo, Name, Slogan */}
            <div className="flex items-center gap-3">
              <PlayCircleFilled style={{ fontSize: 32, color: '#2563eb' }} />
              {/* antd có 1 css mặc định của header ép tất cả child có lineheihgt = 64 */}
              <div className="leading-0">                                     
                <Title level={4} className="!m-0">
                  OMoTickBS
                </Title>
                <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                  Book showtimes instantly
                </Text>
              </div>
            </div>

            <Dropdown menu={locationMenu} trigger={["click"]}>
              <Button
                type="text"
                icon={<EnvironmentOutlined />}
                className="!mx-4"
              >
                <span className="font-semibold">
                  {selectedLocation?.label ?? "Select city"} <DownOutlined />
                </span>
              </Button>
            </Dropdown>
          </div>

          {/* Phần tabs dính sang trái */}
          <div className="hidden lg:flex flex-1 justify-center max-w-xl">
            {isDesktop ? (
              <div className="w-full">
                <Tabs 
                  items={tabItems} 
                  activeKey={currentTabKey} 
                  onChange={handleNavigationChange}
                  className="rounded-tabs"
                />
              </div>
            ) : null}
            {!isDesktop ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                className="lg:hidden"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '1.25rem'
                }}
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              />
            ) : null}
          </div>
        </div>
        
        {/* Phần được chia để dính hết sang phải  */}
        <div className="flex items-center gap-6">
          <div className="w-80">
            <Input
              size="large"
              placeholder="Search for movies, cinemas, offers..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: '100%' }}
            />
          </div>
          {isLoggedIn ? (
            <>
              <Button type="text" icon={<HeartOutlined />} size="large">
                Watchlist
              </Button>
              <Badge count={alertsCount} size="small">
                <Button type="text" icon={<BellOutlined />} size="large">
                  Alerts
                </Button>
              </Badge>
            </>
          ) : null}
          {authControl}
        </div>
      </div>

      {/* Cho thiết bị mobile */}
      <Drawer
        title="Danh mục"
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      >
        <Menu
          mode="inline"
          items={mobileMenuItems}
          selectedKeys={currentTabKey ? [currentTabKey] : []}
          onClick={({ key }) => handleNavigationChange(key as string)}
        />
      </Drawer>
    </Header>
  )
}

export default MainHeader
