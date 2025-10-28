import { Badge, Button, Card, Tag, Typography, Divider, Empty } from 'antd'
import {
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons'
import type { CinemaShowtime } from '../../types'

const { Title, Text } = Typography

type CinemaShowtimesProps = {
  cinemas: CinemaShowtime[]
}

const ShowtimeSlotButton = (props: {
  id: string
  movieId?: string
  time: string
  price: string
  isFillingFast?: boolean
  isSoldOut?: boolean
  isPrime?: boolean
}) => {
  const { id, time, price, isFillingFast, isSoldOut, isPrime } = props

  const button = (
    <Button 
      key={id} 
      disabled={isSoldOut} 
      size="large"
      className="!h-auto !px-4 !py-2 flex flex-col items-center gap-1 min-w-[100px]"
    >
      <span className="text-base font-medium">{time}</span>
      <span className="text-xs text-gray-500">{price}</span>
    </Button>
  )

  if (isFillingFast || isPrime) {
    return (
      <Badge.Ribbon
        text={isFillingFast ? 'Filling fast' : 'Prime'}
        color={isFillingFast ? '#fa541c' : '#722ed1'}
        className="[&_.ant-ribbon]:!text-xs"
      >
        {button}
      </Badge.Ribbon>
    )
  }

  return button
}

const CinemaShowtimes = ({ cinemas }: CinemaShowtimesProps) => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div className="space-y-2">
          <Title level={3} className="!mb-0">
            Select a cinema
          </Title>
          <Text type="secondary" className="block">
            Filtered cinemas offering more than {cinemas.length} experiences around you.
          </Text>
        </div>
        <div className="flex gap-4">
          <Button icon={<SafetyCertificateOutlined />}>Refundable shows</Button>
          <Button icon={<FieldTimeOutlined />}>Early morning</Button>
        </div>
      </div>

      {!cinemas.length ? (
        <Empty
          className="!my-16"
          description="No shows match the selected filters. Try changing the date or format."
        />
      ) : (
        <div className="space-y-6">
          {cinemas.map((cinema) => (
            <Card 
              key={cinema.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200" 
              bordered={false}
            >
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Title level={4} className="!mb-0">
                      {cinema.name}
                    </Title>
                    <Tag>{cinema.provider}</Tag>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text type="secondary">{cinema.address}</Text>
                    <Tag className="!m-0">{cinema.distance}</Tag>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cinema.experiences.map((experience) => (
                      <Tag key={experience} color="geekblue">
                        {experience}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Text type="secondary">From</Text>
                  <Title level={4} className="!m-0">
                    {cinema.priceFrom}
                  </Title>
                  <div className="flex items-center gap-2 justify-end">
                    <ThunderboltOutlined />
                    <Text type="secondary">Quick checkout</Text>
                  </div>
                </div>
              </div>

              <Divider className="!my-6" />

              <div className="flex flex-wrap gap-4">
                {cinema.slots.map((slot) => (
                  <ShowtimeSlotButton key={slot.id} {...slot} />
                ))}
              </div>

              <Divider className="!my-6" />

              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {cinema.services.map((service) => (
                    <Tag key={service} color="success">
                      {service}
                    </Tag>
                  ))}
                </div>

                {cinema.amenities.length ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text type="secondary">Amenities:</Text>
                    {cinema.amenities.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                ) : null}

                {cinema.cancellationPolicy ? (
                  <Text type="secondary" className="block">
                    {cinema.cancellationPolicy}
                  </Text>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export default CinemaShowtimes
