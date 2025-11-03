import { Button, Card, Carousel, Divider, Tag, Typography } from "antd"
import { CalendarOutlined, FireOutlined, PlayCircleOutlined } from "@ant-design/icons"
import type { HeroSlide } from "../../shared/types"

const { Title, Text } = Typography

type HeroSectionProps = {
  slides: HeroSlide[]
  onExplore?: () => void
}

const HeroSection = ({ slides, onExplore }: HeroSectionProps) => {
  return (
    <section className="max-w-[1280px] mx-auto my-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <Card className="h-full">
            <div className="flex flex-col gap-4">
              <Tag icon={<FireOutlined />} color="magenta">
                Trending Week
              </Tag>
              <Title level={2} className="m-0">
                Đặt vé siêu tốc, trải nghiệm điện ảnh đỉnh cao
              </Title>
              <Text type="secondary">
                Cập nhật lịch chiếu realtime, chọn ghế yêu thích, thanh toán nhanh chóng
                chỉ trong vài chạm. Tận hưởng tinh hoa điện ảnh ngay hôm nay.
              </Text>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={onExplore}
                >
                  Khám phá phim hot
                </Button>
                <Button size="large" icon={<CalendarOutlined />}>
                  Xem lịch chiếu theo rạp
                </Button>
              </div>
              <Divider plain>Được yêu thích nhất tuần qua</Divider>
              <div className="flex gap-6">
                <div>
                  <Title level={3} className="m-0">+250</Title>
                  <Text type="secondary">Suất chiếu mới mỗi ngày</Text>
                </div>
                <div>
                  <Title level={3} className="m-0">98%</Title>
                  <Text type="secondary">Khách hàng hài lòng</Text>
                </div>
                <div>
                  <Title level={3} className="m-0">24/7</Title>
                  <Text type="secondary">Hỗ trợ đặt vé</Text>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-7">
          <Carousel autoplay dots>
            {slides.map((slide) => (
              <div key={slide.id} className="relative h-[420px] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center filter brightness-75" style={{ backgroundImage: `url(${slide.image})` }} />
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <Title level={3} className="text-white">{slide.title}</Title>
                  <Text className="text-white/80 mb-4">{slide.description}</Text>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {slide.stats.map((item) => (
                      <Tag key={item} color="geekblue">
                        {item}
                      </Tag>
                    ))}
                  </div>
                  <Button type="primary" size="large">
                    Đặt vé ngay
                  </Button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
