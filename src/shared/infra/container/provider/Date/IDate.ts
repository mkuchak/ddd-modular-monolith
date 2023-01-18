export interface IDate {
  addSeconds(date: Date | number, seconds: number): Date;
  addMinutes(date: Date | number, minutes: number): Date;
  addHours(date: Date | number, hours: number): Date;
  addDays(date: Date | number, days: number): Date;
  addMonths(date: Date | number, months: number): Date;
  addYears(date: Date | number, years: number): Date;
  diffInSeconds(from: Date | number, to: Date | number): number;
  diffInMinutes(from: Date | number, to: Date | number): number;
  diffInHours(from: Date | number, to: Date | number): number;
  diffInDays(from: Date | number, to: Date | number): number;
  diffInMonths(from: Date | number, to: Date | number): number;
  diffInYears(from: Date | number, to: Date | number): number;
  isBefore(from: Date | number, to: Date | number): boolean;
  isAfter(from: Date | number, to: Date | number): boolean;
  isEqual(from: Date | number, to: Date | number): boolean;
  isFuture(date: Date | number): boolean;
  isPast(date: Date | number): boolean;
  format(date: Date | number, format: string): string;
}
