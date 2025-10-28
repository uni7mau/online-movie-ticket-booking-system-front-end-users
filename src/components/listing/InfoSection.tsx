import { Typography } from 'antd'

const { Title, Text } = Typography

const InfoSection = () => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Title level={4}>Trải nghiệm đặt vé</Title>
          <Text type="secondary">Đặt vé chỉ trong 3 bước: chọn phim, chọn ghế, thanh toán. Giao diện tối ưu cho mọi thiết bị.</Text>
        </div>
        <div>
          <Title level={4}>Ưu đãi thành viên</Title>
          <Text type="secondary">Tích điểm, đổi quà, nhận ưu đãi riêng cho thành viên OMoTick. Combo sinh nhật cực hấp dẫn.</Text>
        </div>
        <div>
          <Title level={4}>Hỗ trợ 24/7</Title>
          <Text type="secondary">Đội ngũ hỗ trợ túc trực qua chat, hotline và email, sẵn sàng giải đáp mọi thắc mắc.</Text>
        </div>
      </div>
    </section>
  )
}

export default InfoSection
