import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export class Time {
  public static timeNow(): string {
    return dayjs().tz().toISOString()
  }
}
