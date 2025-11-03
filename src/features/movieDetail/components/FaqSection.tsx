import { Collapse, Typography } from 'antd'
import type { FaqItem } from '../../shared/types'

const { Title } = Typography

type FaqSectionProps = {
  items: FaqItem[]
}

const FaqSection = ({ items }: FaqSectionProps) => {
  if (!items.length) {
    return null
  }

  return (
    <section className="faq-section">
      <Title level={3} className="section-title">
        FAQs
      </Title>
      <Collapse
        accordion
        items={items.map((faq) => ({
          key: faq.id,
          label: faq.question,
          children: <p>{faq.answer}</p>,
        }))}
      />
    </section>
  )
}

export default FaqSection
