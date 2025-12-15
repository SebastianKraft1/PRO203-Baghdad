/*
    Felles typer og grensesnitt for kalender,
    hendelser og fridager i appen.
*/
export interface CalendarHoliday {
  date: string;
  localName: string;
}

export interface CalendarEvent {
  date: string;
  title: string;
  description?: string;
}
