import { Card, Col, Row, Space, Tag, Typography } from 'antd'
import type { Offer } from '../../types'

const { Title, Text } = Typography

type OffersSectionProps = {
  offers: Offer[]
}

const OffersSection = ({ offers }: OffersSectionProps) => {
  if (!offers.length) {
    return null
  }

  return (
    <section className="offers-section">
      <div className="section-header">
        <div>
          <Title level={3} className="section-title">
            Offers and benefits
          </Title>
          <Text type="secondary">Bank discounts, cashback, and snack combos for this movie.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {offers.map((offer) => (
          <Col xs={24} md={12} lg={8} key={offer.id}>
            <Card className="offer-card" bordered={false}>
              <Space direction="vertical" size={12}>
                <Space align="center" size="middle">
                  {offer.badge ? <Tag color="orange">{offer.badge}</Tag> : null}
                  <Title level={4} className="offer-card__title">
                    {offer.title}
                  </Title>
                </Space>
                <Text>{offer.description}</Text>
                <Space direction="vertical" size={4} className="offer-card__terms">
                  {offer.terms.map((item) => (
                    <Text key={item} type="secondary">
                      • {item}
                    </Text>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}

export default OffersSection
