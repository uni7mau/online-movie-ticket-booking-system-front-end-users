import { Button, Divider, Modal } from "antd"
import type { CinemaLocation } from "../../types"
import {
  CarOutlined,
  CheckCircleOutlined,
  CoffeeOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  MobileOutlined,
  RestOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  SmileOutlined,
  StarOutlined,
  TeamOutlined,
  WifiOutlined,
} from "@ant-design/icons"
import type { ReactNode } from "react"

type CinemaInfoDialogProps = {
  open: boolean
  cinema: CinemaLocation | null
  onClose: () => void
  onViewShowtimes: (cinema: CinemaLocation) => void
}

const iconRules: Array<{ test: RegExp; icon: ReactNode }> = [
  { test: /parking/i, icon: <CarOutlined /> },
  { test: /recliner/i, icon: <RestOutlined /> },
  { test: /snack|food|beverage/i, icon: <CoffeeOutlined /> },
  { test: /m-?ticket|mobile ticket/i, icon: <MobileOutlined /> },
  { test: /cancellation|cancel/i, icon: <SafetyCertificateOutlined /> },
  { test: /digital|payment/i, icon: <CreditCardOutlined /> },
  { test: /loyalty|membership|perks/i, icon: <GiftOutlined /> },
  { test: /vip|premium|prime|director|imax|4dx|dolby/i, icon: <StarOutlined /> },
  { test: /family|kids|group/i, icon: <TeamOutlined /> },
  { test: /lounge|mall|shopping/i, icon: <ShopOutlined /> },
  { test: /wifi|wi-fi/i, icon: <WifiOutlined /> },
  { test: /wheelchair|accessible/i, icon: <SmileOutlined /> },
]

const getIconForLabel = (label: string): ReactNode => {
  const match = iconRules.find((rule) => rule.test.test(label))
  return match?.icon ?? <CheckCircleOutlined />
}

const formatCollection = (items?: string[]) =>
  Array.from(new Set(items?.filter(Boolean).map((item) => item.trim()) ?? []))

const CinemaInfoDialog = ({ open, cinema, onClose, onViewShowtimes }: CinemaInfoDialogProps) => {
  if (!cinema) {
    return null
  }

  const addressLine = cinema.address
  const servicesAndAmenities = [
    ...formatCollection(cinema.amenities),
    ...formatCollection(cinema.services),
    ...formatCollection(cinema.experiences),
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={640}
      className="cinema-info-dialog"
    >
      <div className="space-y-6 p-2 sm:p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
            <img src={cinema.imageUrl} alt={cinema.name} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">{cinema.name}</h3>
            <p className="text-sm text-gray-500">{cinema.venueDetails}</p>
            <div className="mx-auto flex max-w-md items-start justify-center gap-2 text-sm text-gray-500">
              <EnvironmentOutlined className="mt-0.5 text-blue-500" />
              <span>{addressLine}</span>
            </div>
          </div>
        </div>

        {servicesAndAmenities.length > 0 ? (
          <div className="space-y-4">
            <div>
              <Divider className="!mt-0">Services &amp; Amenities</Divider>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {servicesAndAmenities.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {getIconForLabel(item)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <Button
          type="primary"
          block
          size="large"
          onClick={() => onViewShowtimes(cinema)}
          className="mt-4"
        >
          View all movies playing here
        </Button>
      </div>
    </Modal>
  )
}

export default CinemaInfoDialog
