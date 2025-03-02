import { useQuery } from '@tanstack/react-query'

import api from '#/services/api'

const StatusList = () => {
  // Use React Query to fetch and cache statuses
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['statuses'],
    queryFn: async () => {
      const data = await api.getStatuses()
      return data
    },
    placeholderData: (previousData) => previousData, // Use previous data while refetching
  })

  // Destructure data
  const statuses = data?.statuses || []

  if (isLoading && !data) {
    return (
      <div className="py-4 text-center text-gray-500">Loading statuses...</div>
    )
  }

  if (isError) {
    return (
      <div className="py-4 text-red-500">
        {(error as Error)?.message || 'Failed to load statuses'}
      </div>
    )
  }

  if (statuses.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">No statuses yet.</div>
    )
  }

  // Helper to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    if (isToday) {
      return 'today'
    } else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  return (
    <div className="px-4">
      <div className="relative">
        <div className="absolute left-[20.5px] top-[22.5px] bottom-[22.5px] w-0.5 bg-gray-200"></div>
        {statuses.map((status) => {
          const handle =
            status.profile.handle || status.profile.did.substring(0, 15) + '...'
          const formattedDate = formatDate(status.createdAt)
          const isToday = formattedDate === 'today'

          return (
            <div
              key={status.uri}
              className="relative flex items-center gap-5 py-4"
            >
              <div className="relative z-10 rounded-full bg-white border border-gray-200 h-[45px] w-[45px] flex items-center justify-center shadow-sm">
                <div className="text-2xl">{status.status}</div>
              </div>
              <div className="flex-1">
                <div className="text-gray-600 text-base">
                  <span className="font-medium text-gray-700 hover:underline">
                    @{handle}
                  </span>{' '}
                  {isToday ? (
                    <span>
                      is feeling{' '}
                      <span className="font-semibold">{status.status}</span>{' '}
                      today
                    </span>
                  ) : (
                    <span>
                      was feeling{' '}
                      <span className="font-semibold">{status.status}</span> on{' '}
                      {formattedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StatusList
