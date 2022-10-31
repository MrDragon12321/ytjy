import { prefixZero } from './util'
import type { TypeDate, CallBack, StrOrNum } from '@/types/global'

/**
 * @description 实时时间
 */
export function dynamicTime(): string {
    const date = new Date()
    const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate(), 
        hour = date.getHours(), min = date.getMinutes(), sec = date.getSeconds(),
        week = ' &nbsp;星期' + '日一二三四五六'.charAt(date.getDay()),
        units = ["年", "月", "日"]
    return [year, month, day].map((n, i) => (n < 10 ? `0${n}` : n) + 
        units[i]).join("") + ' &nbsp;' + 
        [hour, min, sec].map(n => n < 10 ? `0${n}` : n).join(":") + week
}

/**
 * @description 日期格式化
 * @param formatter 格式("YYYY-MM-DD")
 */
export function dateFormatter(formatter: string, date?: TypeDate): string {
	date = date ? new Date(date) : new Date()
	const Y = date.getFullYear() + '',
		M = date.getMonth() + 1,
		D = date.getDate(),
		H = date.getHours(),
		m = date.getMinutes(),
		s = date.getSeconds()

	return formatter.replace(/YYYY|yyyy/g, Y)
		.replace(/YY|yy/g, Y.substr(2, 2))
		.replace(/MM/g, (M < 10 ? '0' : '') + M)
		.replace(/DD/g, (D < 10 ? '0' : '') + D)
		.replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
		.replace(/mm/g, (m < 10 ? '0' : '') + m)
		.replace(/ss/g, (s < 10 ? '0' : '') + s)
}

/**
 * @description 获取前后N个月的自然月的开始、结束日期
 * @param diff_month 间隔单位月
 * @param add - true 为往后取, false 为往前取
 * @param this_month - true 为包含本月
 */
export function getMonthDay(diff_month: number, add = false, this_month = false): string[] {
    const date = new Date()
    let year = date.getFullYear(), month = date.getMonth() + 1, first_day, last_day
    const _diff_month = this_month ? 1 : 0

    if (add) {
        // 开始月（自然月第一天）
        month = month + 1 - _diff_month
        if (month > 12) year++, month = month - 12
        first_day = `${year}-${prefixZero(month)}-01`

        // 结束月（自然月最后一天）
        month = date.getMonth() + 1 + diff_month - _diff_month;
        year = date.getFullYear()
        if (month > 12) year++, month = month - 12
        const date2 = new Date((new Date(year, month, 1)).getTime() - 1000 * 60 * 60 * 24)
        last_day = `${date2.getFullYear()}-${prefixZero(date2.getMonth()+1)}-${date2.getDate()}`
    } else {
        // 开始月（自然月第一天）
        month = month - diff_month + _diff_month
        if (month <= 0)  year--, month = month + 12
        first_day = `${year}-${prefixZero(month)}-01`
        
        // 结束月（自然月最后一天）
        if (this_month) date.setMonth(date.getMonth() + 1)
        date.setDate(1)
        const date2 = new Date(date.getTime() - 1000 * 60 * 60 * 24)
        last_day = `${date2.getFullYear()}-${prefixZero(date2.getMonth()+1)}-${date2.getDate()}`
    }
    return [first_day, last_day]
}

/**
 * @description 获取前后N个自然周的开始、结束日期
 * @param diff_week - 间隔 单位周
 * @param add - true 为往后取, false 为往前取
 * @param this_week - true 为包含本周
 */
export function getWeekDay(diff_week: number, add = false, this_week = false): string[] {
    const prefix = add ? 1 : -1
    let diff_day = diff_week * 7 * prefix, diff_day2 = 0
    const _diff_day = prefix * (this_week ? 7 : 0), date = new Date()

    if (date.getDay() == 0) { // 0 为星期天
        if (add) diff_day2 = 1
        else diff_day2 = -7
    } else {
        if (add) diff_day2 = 8 - date.getDay()
        else diff_day2 = -date.getDay()
    }
    diff_day2 += _diff_day

    // 自然周第一天
    diff_day = diff_day + diff_day2 + (!add ? 1 : -1)
    const date2 = new Date(date)
    date2.setDate(date.getDate() + diff_day)
    const first_day = date2.getFullYear() + "-" + prefixZero(date2.getMonth() + 1) + "-" + prefixZero(date2.getDate())

    // 自然周最后一天
    const date3 = new Date(date)
    date3.setDate(date.getDate() + diff_day2)
    const last_day = date3.getFullYear() + "-" + prefixZero(date3.getMonth() + 1) + "-" + prefixZero(date3.getDate())
    const week_day = [first_day, last_day]
    if (add) return week_day.reverse()
    return [first_day, last_day]
}

/**
 * @description 日期选择器过滤
 * @param type - 类型 (月份 | 天数)
 * @param selectedDate - 已选择日期对象
 * @param current - 支持当 (当月 | 当日)
 * @param diff - 间隔 0 表示不限制
 */
export function disabledDate(type: string = "month", selectedDate: { value: Date[] | null }, current: boolean = true, diff: number = 0): (time: Date) => boolean | void {
    return time => {
        if (type == "month") {
            const date = new Date()
            const monthDate = new Date(date.getFullYear() + '-' + (date.getMonth() + 1))
            if (!current) {
                monthDate.setMonth(monthDate.getMonth() - 1)
            }
            if (diff && selectedDate.value) { // 月份限制
                const currMonth = selectedDate.value[0]
                currMonth.setMonth(currMonth.getMonth() - diff)
                const minMonthTime = currMonth.getTime()
                currMonth.setMonth(currMonth.getMonth() + 2 * diff)
                const maxMonthTime = currMonth.getTime()
                return time.getTime() > monthDate.getTime() || time.getTime() < minMonthTime || time.getTime() > maxMonthTime
            }
            return time.getTime() > monthDate.getTime()
        } else if (type == "day") {
            let nowTime = Date.now()
            if (!current) nowTime -= 8.64e7
            if (diff > 0 && selectedDate.value) { // 时间限制
                const intervalTtime = (diff - 1) * 24 * 3600 * 1000
                const currDate = selectedDate.value[0]
                const minTime = currDate.getTime() - intervalTtime
                const maxTime = currDate.getTime() + intervalTtime
                return time.getTime() > nowTime || time.getTime() < minTime || time.getTime() > maxTime
            }
            return time.getTime() > nowTime
        }
    }
}

/**
 * @description 取指定间隔月份|天数的开始、结束日期
 * @param type 类型 (月份 | 天数)
 * @param current 支持当 (当月 | 当日)
 * @param diff 间隔 0 表示不限制
 * @param formatter 格式类型, timestamp - 返回时间戳
 */
export function getDiffDate<T extends string|number = number>(type: string = 'day', current: boolean = true, diff: number = 15, formatter: string = "YYYY-MM-DD"): T[]|void {
    if (type == 'month') {
        const date = new Date()
        let _diff = 0
        if (!current) _diff = 1
        const monthDate: Date = new Date(date.getFullYear() + '-' + (date.getMonth() + 1))
        monthDate.setMonth(monthDate.getMonth() - _diff)
        const end = formatter === 'timestamp' 
            ? (new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1, 0, 0, 0)).getTime() - 1001
            : dateFormatter(formatter, monthDate.getTime())
        monthDate.setMonth(monthDate.getMonth() - diff)     // 这里要 - _diff setMonth 含被设置的月份的
        const begin = formatter === 'timestamp' 
            ? (new Date(dateFormatter('YYYY-MM-01 00:00:00', monthDate.getTime()))).getTime() 
            : dateFormatter(formatter, monthDate.getTime())
        return [begin, end] as T[]
    } else if (type == 'day') {
        const date = new Date()
        let _diff = 0
        if (!current) _diff = 1
        date.setDate(date.getDate() - _diff)
        const end = formatter === 'timestamp' 
            ? date.setHours(23, 59, 59, 0) && date.getTime()
            : dateFormatter(formatter, date.getTime())
        date.setDate(date.getDate() - diff)
        const begin = formatter === 'timestamp'
            ? date.setHours(0, 0, 0, 0) && date.getTime()
            : dateFormatter(formatter, date.getTime())
        return [begin, end] as T[]
    }
}

/**
 * @description 秒数倒计
 */
export function secondsCountDown(time: number, callback: CallBack, step: number = 1): NodeJS.Timer {
    const go = () => {
        time -= step
        typeof callback == "function" && callback(time)
    }
    go()
    return setInterval(() => {
        if (time > 0) {
            go()
        }
    }, 1000)
}

/**
 * @description 日期20201106 转 2020-11-06格式
 */
export function dateReplace(str: string): string {
    if (typeof str !== 'string') return str
    return str.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
}

/**
 * @description 判断上午、下午、晚上
 */
export function getHoursTip(): string {
    const h = (new Date()).getHours()
    let hoursTip
    if (h >= 0 && h < 12) {
        hoursTip = "上午"
    } else if (h >= 12 && h < 18) {
        hoursTip = "下午"
    } else {
        hoursTip = "晚上"
    }
    return hoursTip
}

/**
 * @description 计算2个时间间隔并返回天、时、分
 * @param startTime - 开始时间 "2022-01-20 23:59:59" | 时间戳
 * @param endTime - 结束时间  "2022-01-20 23:59:59" | 时间戳
 * @param dangerHours - 预警时间(单位：小时)
 */
export function getTimesDiff(startTime: StrOrNum, endTime?: StrOrNum, dangerHours: number = 24): [boolean, string] {
    if (typeof startTime == 'string') 
        startTime = +new Date(startTime)

    if (!endTime) 
        endTime = Date.now()
    else if (typeof endTime == 'string') 
        endTime = +new Date(endTime)
    
    // 间隔
    let timeDiff = Math.floor((endTime - startTime) / 1000)
    const data: [boolean, string] = [false, '']
    if (Math.floor(timeDiff / 3600) > dangerHours) data[0] = true

    // 年
    // const year = Math.floor(timeDiff / 86400 / 365)
    // timeDiff = timeDiff % (86400 * 365)

    // 月
    // const month = Math.floor(timeDiff / 86400 / 30)
    // timeDiff = timeDiff % (86400 * 30)

    // 天
    const day = Math.floor(timeDiff / 86400)
    timeDiff = timeDiff % 86400

    // 时
    const hour = Math.floor(timeDiff / 3600)
    timeDiff = timeDiff % 3600

    // 分
    const minute = Math.floor(timeDiff / 60)
    timeDiff = timeDiff % 60

    // 秒
    // const second = timeDiff
    data[1] = (day > 0 ? day + '天': '') + `${hour}小时${minute}分钟`
    return data
}