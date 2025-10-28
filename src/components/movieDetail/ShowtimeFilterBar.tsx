import { Select, Space } from 'antd'
import type { DateFilterOption, SelectOption } from '../../types'

type ShowtimeFilterBarProps = {
  dates: DateFilterOption[]
  selectedDate: string
  onDateChange: (value: string) => void
  languageOptions: SelectOption[]
  selectedLanguage: string
  onLanguageChange: (value: string) => void
  formatOptions: SelectOption[]
  selectedFormat: string
  onFormatChange: (value: string) => void
  experienceOptions: SelectOption[]
  selectedExperience: string
  onExperienceChange: (value: string) => void
}

const parseDateMeta = (meta: string) => {
  const [dayNumber = '', month = ''] = meta.split(' ')
  return {
    dayNumber,
    month: month.toUpperCase(),
  }
}

const ShowtimeFilterBar = ({
  dates,
  selectedDate,
  onDateChange,
  languageOptions,
  selectedLanguage,
  onLanguageChange,
  formatOptions,
  selectedFormat,
  onFormatChange,
  experienceOptions,
  selectedExperience,
  onExperienceChange,
}: ShowtimeFilterBarProps) => {
  const selectedDateOption = dates.find((item) => item.value === selectedDate)
  const referenceOption = selectedDateOption ?? dates[0]
  const monthLabel = referenceOption ? parseDateMeta(referenceOption.meta).month : ''

  return (
    <div className='max-w-screen-xl px-4 mx-auto'>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Space size="middle" direction="vertical" align="start" wrap>
          <div className="flex justify-items-start w-full items-center gap-3 overflow-x-auto px-3 py-3">
            {monthLabel ? (
              <div
                className="flex h-16 w-9 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500"
                style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}
              >
                {monthLabel}
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              {dates.map((item) => {
                const isSelected = item.value === selectedDate
                const { dayNumber } = parseDateMeta(item.meta)

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => onDateChange(item.value)}
                    className={`flex min-w-[50px] flex-col items-center rounded-[12px] py-2 text-sm transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`text-lg font-semibold sm:text-xl ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    <span
                      className={`text-[11px] font-medium uppercase tracking-wide ${
                        isSelected ? 'text-white/80' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <Space size="middle" wrap>
            <Select
              className=""
              size="large"
              value={selectedLanguage}
              onChange={onLanguageChange}
              options={languageOptions}
            />
            <Select
              className=""
              size="large"
              value={selectedFormat}
              onChange={onFormatChange}
              options={formatOptions}
            />
            <Select
              className=""
              size="large"
              value={selectedExperience}
              onChange={onExperienceChange}
              options={experienceOptions}
            />
          </Space>
        </Space>
      </Space>
    </div>
  )
}

export default ShowtimeFilterBar
