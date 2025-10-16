export type Duration = {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
};

export const now = () => new Date();

export const add = (date: Date | string | number, duration: Duration) => {
    const {
        seconds = 0,
        minutes = 0,
        hours = 0,
        days = 0,
        weeks = 0,
        months = 0,
        years = 0
    } = duration;

    const _date = new Date(date);

    _date.setFullYear(_date.getFullYear() + years);
    _date.setMonth(_date.getMonth() + months);
    _date.setDate(_date.getDate() + days + weeks * 7);
    _date.setHours(_date.getHours() + hours);
    _date.setMinutes(_date.getMinutes() + minutes);
    _date.setSeconds(_date.getSeconds() + seconds);

    return _date;
};

export const sub = (date: Date | string | number, duration: Duration) => {
    const invertedDuration: Duration = {
        seconds: -(duration.seconds || 0),
        minutes: -(duration.minutes || 0),
        hours: -(duration.hours || 0),
        days: -(duration.days || 0),
        weeks: -(duration.weeks || 0),
        months: -(duration.months || 0),
        years: -(duration.years || 0),
    };

    return add(date, invertedDuration);
};

export const isBefore = (current: Date | string | number, before: Date | string | number): boolean => {
    return new Date(current).getTime() < new Date(before).getTime();
};

export default { now, add, sub, isBefore };
