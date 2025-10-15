export type Duration = {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
};

export const today = () => new Date();

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

    const ms =
        seconds * 1_000 +
        minutes * 60_000 +
        hours * 3_600_000 +
        (days + weeks * 7) * 86_400_000;

    _date.setTime(_date.getTime() + ms);

    return _date;
};

export const sub = (date: Date | string | number, duration: Duration) => {
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

    _date.setFullYear(_date.getFullYear() - years);
    _date.setMonth(_date.getMonth() - months);

    const ms =
        seconds * 1_000 +
        minutes * 60_000 +
        hours * 3_600_000 +
        (days + weeks * 7) * 86_400_000;

    _date.setTime(_date.getTime() - ms);

    return _date;
};

export default { today, add, sub };