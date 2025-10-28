import { Avatar, Card, Col, Row, Space, Typography } from 'antd'
import type { MovieDetail } from '../../types'

const { Title, Text } = Typography

type AboutMovieSectionProps = {
  movie: MovieDetail
}

const AboutMovieSection = ({ movie }: AboutMovieSectionProps) => {
  return (
    <section className="about-section">
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={16} className="about-section__content">
            <div>
              <Title level={3} className="section-title">
                About the movie
              </Title>
              <Text>{movie.synopsis}</Text>
            </div>

            <Space direction="vertical" size={12}>
              <Title level={4}>Highlights</Title>
              <Space direction="vertical" size={6}>
                {movie.highlights.map((item) => (
                  <Text key={item} type="secondary">
                    • {item}
                  </Text>
                ))}
              </Space>
            </Space>

            <Space direction="vertical" size={8}>
              <Title level={4}>Crew</Title>
              <Text type="secondary">Director: {movie.creators.director}</Text>
              <Text type="secondary">
                Writers: {movie.creators.writers.join(', ')}
              </Text>
              {movie.creators.music ? (
                <Text type="secondary">Music: {movie.creators.music}</Text>
              ) : null}
            </Space>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="about-section__cast-card" bordered={false}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={4}>Cast</Title>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                {movie.cast.map((member) => (
                  <Space key={member.id} size="middle" className="cast-item">
                    <Avatar size={56} src={member.avatar} />
                    <div>
                      <Text strong>{member.name}</Text>
                      <Text type="secondary" className="cast-item__role">
                        as {member.role}
                      </Text>
                    </div>
                  </Space>
                ))}
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </section>
  )
}

export default AboutMovieSection
