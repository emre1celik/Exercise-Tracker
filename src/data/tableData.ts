export type TableDataMap = Record<
  string,
  {exerciseName: string; data: (string | boolean)[][]}[]
>;

export const tableDataMap: TableDataMap = {
  'Monday (Push)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Tuesday (Pull)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Wednesday (Legs)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Thursday (Rest)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Friday (Push)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Saturday (Pull)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],
  'Sunday (Legs)': [
    {
      exerciseName: 'Exercise 1',
      data: [
        // Headers row
        ['Exercise name', 'Weight', 'Reps', 'Completed'],
        // Data rows
        ['Set 1', '10 KG total', '10 reps', false],
        // Add more rows as needed
      ],
    },
  ],};

