import {
  add,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  format as fnsFormat,
  isAfter,
  isBefore,
  isEqual,
  isFuture,
  isPast,
} from "date-fns";
import { IDate } from "~/shared/infra/container/provider/Date/IDate";

export class DateFns implements IDate {
  addSeconds(date: Date, seconds: number): Date {
    return add(date, { seconds });
  }

  addMinutes(date: Date, minutes: number): Date {
    return add(date, { minutes });
  }

  addHours(date: Date, hours: number): Date {
    return add(date, { hours });
  }

  addDays(date: Date, days: number): Date {
    return add(date, { days });
  }

  addMonths(date: Date, months: number): Date {
    return add(date, { months });
  }

  addYears(date: Date, years: number): Date {
    return add(date, { years });
  }

  diffInSeconds(from: Date, to: Date): number {
    return differenceInSeconds(from, to);
  }

  diffInMinutes(from: Date, to: Date): number {
    return differenceInMinutes(from, to);
  }

  diffInHours(from: Date, to: Date): number {
    return differenceInHours(from, to);
  }

  diffInDays(from: Date, to: Date): number {
    return differenceInDays(from, to);
  }

  diffInMonths(from: Date, to: Date): number {
    return differenceInMonths(from, to);
  }

  diffInYears(from: Date, to: Date): number {
    return differenceInYears(from, to);
  }

  isBefore(from: number | Date, to: number | Date): boolean {
    return isBefore(from, to);
  }

  isAfter(from: number | Date, to: number | Date): boolean {
    return isAfter(from, to);
  }

  isEqual(from: number | Date, to: number | Date): boolean {
    return isEqual(from, to);
  }

  isFuture(date: number | Date): boolean {
    return isFuture(date);
  }

  isPast(date: number | Date): boolean {
    return isPast(date);
  }

  format(date: Date | number, format: string): string {
    return fnsFormat(date, format);
  }
}
