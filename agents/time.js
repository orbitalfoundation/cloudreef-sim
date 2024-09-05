

const time = globalThis.time = {

    seconds: 0,
    hours: 0,
    days: 0,
    months: 0,
    years: 0,

    secondOfDay: 0,
    hourOfDay: 0,
    monthOfYear: 0,
    dayOfYear: 0,

    secondsStepRate: 100,
    secondsPerHour: 3600,
    secondsPerDay: 86400,
    secondsPerYear: 86400 * 12,
    hoursPerDay: 24,
    daysPerYear: 12,
    daysStepRate: 30,
    morningSeconds: 3600 * 8,
    eveningSeconds: 3600 * 16,
}


function observer(blob) {
    if(!blob.tick) return

    // stuff time right into the blob and it will be passed to subsequent listeners
    blob.time = time

    time.seconds += time.secondsStepRate
    time.hours = Math.floor(time.seconds / time.secondsPerHour )
    time.days = Math.floor(time.seconds / time.secondsPerDay )
    time.years = Math.floor(time.seconds / time.secondsPerYear )

    time.secondOfDay = time.seconds % time.secondsPerDay
    time.hourOfDay = time.hours % time.hoursPerDay
    time.dayOfYear = time.days % time.daysPerYear
}

export const time_support = {
    uuid:'/core/time',
    observer
}