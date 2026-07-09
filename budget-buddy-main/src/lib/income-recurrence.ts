import type { Income, IncomeRecurrence } from './mock-data';

/**
 * Calculate the next occurrence date based on recurrence type.
 */
export function getNextDate(fromDate: string, recurrence: IncomeRecurrence): string | undefined {
  if (recurrence === 'One-time') return undefined;

  const d = new Date(fromDate);

  switch (recurrence) {
    case 'Daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'Weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'Monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'Yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
  }

  return d.toISOString().slice(0, 10);
}

/**
 * Given a list of recurring income entries, return new income entries
 * that are due today or earlier and haven't been posted yet.
 */
export function getDueRecurringIncomes(incomeList: Income[]): Income[] {
  const today = new Date().toISOString().slice(0, 10);

  return incomeList
    .filter(
      (i) =>
        i.recurrence !== 'One-time' &&
        i.nextDate &&
        i.nextDate <= today,
    )
    .map((i) => ({
      ...i,
      id: '',                          // new entry, let DB assign ID
      date: i.nextDate!,               // post on the due date
      nextDate: getNextDate(i.nextDate!, i.recurrence), // advance schedule
    }));
}

/**
 * Human-readable label for a recurrence.
 */
export function recurrenceLabel(r: IncomeRecurrence): string {
  switch (r) {
    case 'Daily':   return 'Every day';
    case 'Weekly':  return 'Every week';
    case 'Monthly': return 'Every month';
    case 'Yearly':  return 'Every year';
    default:        return 'One-time';
  }
}
