type Unit =
    | 'y'
    | 'w'
    | 'd'
    | 'h'
    | 'm'
    | 's'
    | 'ms';

type Duration = {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    weeks: number;
    months: number;
    years: number;
};

export const DateUtils = {
    now: () => new Date(),

    add: (date: Date | string | number, duration: Partial<Duration>) => {
        const {
            milliseconds = 0,
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
        _date.setMilliseconds(_date.getMilliseconds() + milliseconds);

        return _date;
    },

    sub: (date: Date | string | number, duration: Partial<Duration>) => {
        const inverted: Partial<Duration> = Object.fromEntries(
            Object.entries(duration).map(([k, v]) => [k, -v]));

        return DateUtils.add(date, inverted);
    },

    isBefore: (current: Date | string | number, before: Date | string | number) =>
        new Date(current).getTime() < new Date(before).getTime(),

    parse: (date: string) => {
        const match = date.match(/^(\d+)(ms|[ywdhms])$/);
        if (!match) throw new SyntaxError(`Invalid date format: ${date}`);

        const [_, numStr, unit] = match;
        const num = parseInt(numStr);

        const duration: Partial<Duration> = {};
        switch (unit as Unit) {
            case 'ms': duration.milliseconds = num; break;
            case 's': duration.seconds = num; break;
            case 'm': duration.minutes = num; break;
            case 'h': duration.hours = num; break;
            case 'd': duration.days = num; break;
            case 'w': duration.weeks = num; break;
            case 'y': duration.years = num; break;
        }

        return DateUtils.add(DateUtils.now(), duration);
    },
};
