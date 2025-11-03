import { Button, Segmented, Select } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import type { SegmentedValue } from 'antd/es/segmented'
import type { SelectOption } from '../../shared/types'

type FilterBarProps = {
  dateFilter: SegmentedValue
  onDateChange: (value: SegmentedValue) => void
  languageFilter: string
  onLanguageChange: (value: string) => void
  formatFilter: string
  onFormatChange: (value: string) => void
  languageOptions: SelectOption[]
  formatOptions: SelectOption[]
}

const dateSegments = [
  { value: 'today', title: 'Hôm nay', meta: '15 Thg 01' },
  { value: 'tomorrow', title: 'Ngày mai', meta: '16 Thg 01' },
  { value: 'weekend', title: 'Cuối tuần', meta: '18-19 Thg 01' },
  { value: 'nextweek', title: 'Tuần sau', meta: '22-26 Thg 01' },
]

const FilterBar = ({
  dateFilter,
  onDateChange,
  languageFilter,
  onLanguageChange,
  formatFilter,
  onFormatChange,
  languageOptions,
  formatOptions,
}: FilterBarProps) => {
  return (
    <section className="w-full bg-white rounded-xl p-6 shadow-md mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          size="large"
          value={dateFilter}
          onChange={onDateChange}
          options={dateSegments.map((segment) => ({
            label: (
              <div className="flex flex-col text-left">
                <span className="font-semibold">{segment.title}</span>
                <span className="text-xs text-gray-500">{segment.meta}</span>
              </div>
            ),
            value: segment.value,
          }))}
        />

        <Select size="large" value={languageFilter} onChange={onLanguageChange} options={languageOptions} />
        <Select size="large" value={formatFilter} onChange={onFormatChange} options={formatOptions} />
        <Button icon={<FilterOutlined />} size="large">
          Bộ lọc nâng cao
        </Button>
      </div>
    </section>
  )
}

export default FilterBar
