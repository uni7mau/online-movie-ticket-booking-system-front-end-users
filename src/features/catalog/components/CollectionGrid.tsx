import { Button, Typography } from "antd"
import type { Collection } from "../../shared/types"

const { Title, Text } = Typography

type CollectionGridProps = {
  collections: Collection[]
}

const CollectionGrid = ({ collections }: CollectionGridProps) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Title level={3} className="m-0">Bộ sưu tập dành riêng cho bạn</Title>
          <Text type="secondary">Các cụm phim và trải nghiệm được cá nhân hóa theo sở thích.</Text>
        </div>
        <Button type="text" size="large">Tạo playlist phim</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-xl overflow-hidden shadow-md">
            <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${collection.image})` }} />
            <div className="p-4">
              <Title level={4} className="m-0">{collection.title}</Title>
              <Text type="secondary">{collection.description}</Text>
              <div className="mt-2">
                <Button type="link">{collection.cta}</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CollectionGrid
