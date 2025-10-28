import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd'
import { HeartOutlined, ShareAltOutlined, StarFilled } from '@ant-design/icons'
import type { MovieDetail } from '../../types'

const { Title, Text } = Typography

type MovieDetailHeroProps = {
  movie: MovieDetail
}

const MovieDetailHero = ({ movie }: MovieDetailHeroProps) => {
  return (
    <section className="movie-hero">
      <div
        className="movie-hero__backdrop"
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      />
      <div className="movie-hero__overlay" />

      <div className="movie-hero__inner">
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} md={10} lg={8}>
            <Card className="movie-hero__poster-card" bordered={false}>
              <div className="movie-hero__poster">
                <img src={movie.poster} alt={movie.title} />
              </div>
              <Space
                direction="vertical"
                size={12}
                className="movie-hero__poster-meta"
              >
                <Button type="primary" size="large" block>
                  Book tickets
                </Button>
                <Space size="middle" className="movie-hero__poster-actions">
                  <Button icon={<HeartOutlined />} block>
                    Watchlist
                  </Button>
                  <Button icon={<ShareAltOutlined />} block>
                    Share
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={14} lg={16}>
            <Space direction="vertical" size={16} className="movie-hero__content">
              <Space size={12} wrap align="center">
                <Title level={1} className="movie-hero__title">
                  {movie.title}
                </Title>
                <Tag className="movie-hero__certificate">{movie.certificate}</Tag>
              </Space>
              <Text className="movie-hero__tagline">{movie.tagline}</Text>

              <Space size="large" wrap className="movie-hero__meta">
                <span>{movie.genres.join(' • ')}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span>{movie.languages.join(', ')}</span>
              </Space>

              <Card className="movie-hero__rating-card" bordered={false}>
                <Space size="large" wrap align="center">
                  <div className="movie-hero__rating">
                    <StarFilled />
                    <div>
                      <Title level={3}>{movie.rating.toFixed(1)}/5</Title>
                      <Text type="secondary">
                        {movie.votes.toLocaleString('en-IN')} votes
                      </Text>
                    </div>
                  </div>
                  <Divider type="vertical" className="movie-hero__divider" />
                  <Space direction="vertical" size={4}>
                    <Text strong>{movie.releaseDate}</Text>
                    <Text type="secondary">Hindi • English subtitles</Text>
                  </Space>
                  <Divider type="vertical" className="movie-hero__divider" />
                  <Space direction="vertical" size={4}>
                    <Text type="secondary">Screening in</Text>
                    <Space size={[8, 8]} wrap>
                      {movie.formats.map((format) => (
                        <Tag key={format}>{format}</Tag>
                      ))}
                    </Space>
                  </Space>
                </Space>
              </Card>

              <Text className="movie-hero__synopsis">{movie.synopsis}</Text>

              <Space size={[8, 8]} wrap>
                {movie.experiences.map((experience) => (
                  <Tag key={experience} className="movie-hero__experience-tag">
                    {experience}
                  </Tag>
                ))}
              </Space>

              <Row gutter={[16, 16]}>
                {movie.metrics.map((metric) => (
                  <Col xs={12} md={8} key={metric.label}>
                    <Card className="movie-hero__metric" bordered={false}>
                      <Text type="secondary">{metric.label}</Text>
                      <Title level={4}>{metric.value}</Title>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export default MovieDetailHero
