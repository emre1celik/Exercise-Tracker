export type TableDataMap = Record<
  string,
  {exerciseName: string; data: (string | boolean)[][]}[]
>;

export const tableDataMap: TableDataMap = {
  'Maandag (Push)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Dinsdag (Pull)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Woensdag (Legs)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Donderdag (Rest)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Vrijdag (Push)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Zaterdag (Pull)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Zondag (Legs)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Set #', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],};

