export type Locale = 'en' | 'zh'

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'flow.locale.v1'

export interface Messages {
  meta: {
    title: string
    settingsTitle: string
    habitsTitle: string
    moneyTitle: string
    description: string
  }
  nav: {
    label: string
    tasks: string
    habits: string
    money: string
    settings: string
  }
  app: {
    title: string
    subtitleEmpty: string
    allDone: string
    allDoneHint: string
    noMatches: string
    activeCount: (count: number) => string
    overdueCount: (count: number) => string
    groups: {
      overdue: string
      today: string
      tomorrow: string
      later: string
      none: string
    }
    completed: string
    completedCount: (count: number) => string
    clearCompleted: string
    clearTitle: string
    clearDescription: (count: number) => string
    clearConfirm: string
    cancel: string
    addTask: string
  }
  filter: {
    label: string
    tags: string
    all: string
  }
  row: {
    aria: (text: string) => string
    markComplete: string
    markIncomplete: string
    deleteAria: (text: string) => string
    delete: string
  }
  sheet: {
    newTask: string
    editTask: string
    placeholder: string
    contentLabel: string
    tagHint: string
    tags: string
    due: string
    optional: string
    none: string
    date: string
    datetime: string
    modeAria: string
    dueBy: string
    exactTime: string
    add: string
    save: string
    close: string
    closeBackdrop: string
    errors: {
      content: string
      date: string
      badDate: string
      badTime: string
    }
  }
  empty: {
    title: string
    filteredTitle: string
    body: string
    filteredBody: string
    addFirst: string
    addNew: string
  }
  picker: {
    titleDate: string
    titleDateTime: string
    hours: string
    minutes: string
    time: string
    quickTimes: string
    today: string
    done: string
    previousMonth: string
    nextMonth: string
  }
  settings: {
    title: string
    subtitle: string
    appearance: string
    appearanceHint: string
    system: string
    light: string
    dark: string
    language: string
    languageHint: string
    data: string
    dataLocal: string
    dataSummary: (
      tasks: number,
      habits: number,
      expenses: number,
    ) => string
    backup: string
    backupHint: string
    backupReady: string
    backupReadyHint: string
    downloadFile: string
    copyJson: string
    backupCopied: string
    backupCopyFailed: string
    backupDownloadStarted: string
    backupDownloadError: string
    showBackupText: string
    exportBackup: string
    importBackup: string
    clearData: string
    clearTitle: string
    clearDescription: (
      tasks: number,
      habits: number,
      expenses: number,
    ) => string
    clearConfirm: string
    importTitle: string
    importDescription: (
      tasks: number,
      habits: number,
      expenses: number,
      categories: number,
    ) => string
    importConfirm: string
    importInvalid: string
    importUnsupported: string
    exportError: string
    importError: string
    about: string
    aboutText: string
    version: string
  }
  habits: {
    title: string
    subtitleEmpty: string
    restDay: string
    todaySummary: (done: number, total: number) => string
    addHabit: string
    emptyTitle: string
    emptyBody: string
    addFirst: string
    everyDay: string
    streak: (count: number) => string
    week: string
    month: string
    weekSummary: (done: number, total: number) => string
    monthSummary: (done: number, total: number) => string
    noPlanned: string
    today: string
    previous: string
    next: string
    streakLabel: string
    weekLabel: string
    totalLabel: string
    newHabit: string
    editHabit: string
    nameLabel: string
    namePlaceholder: string
    frequency: string
    daily: string
    weekly: string
    weekdays: string
    checkInIcon: string
    checkInIconHint: string
    icons: Record<string, string>
    errorName: string
    errorWeekdays: string
    scheduleEditHint: string
    create: string
    save: string
    deleteHabit: string
    deleteTitle: string
    deleteDescription: (name: string) => string
    deleteConfirm: string
    back: string
    edit: string
    markDone: (name: string) => string
    markUndone: (name: string) => string
    openHabit: (name: string) => string
    toastChecked: string
    toastMadeUp: (date: string) => string
    toastCanceled: string
    toastDeleted: string
    outOfWindow: string
    startsOn: (date: string) => string
    stateChecked: string
    statePlanned: string
    stateRest: string
    stateFuture: string
    stateUnavailable: string
    close: string
    closeBackdrop: string
  }
  money: {
    title: string
    subtitle: string
    viewLabel: string
    records: string
    addExpense: string
    addIncome: string
    addEntry: string
    emptyTitle: string
    emptyBody: string
    addFirst: string
    noExpensesPeriod: string
    todayLabel: string
    yesterdayLabel: string
    expenseCount: (count: number) => string
    entryCount: (count: number) => string
    total: string
    income: string
    expenses: string
    expenseType: string
    net: string
    netHint: string
    balance: string
    balanceHint: string
    balanceOff: string
    balanceOffHint: string
    balanceOffTitle: string
    balanceOffDescription: string
    balanceOffConfirm: string
    balanceNotSet: string
    balanceNotSetHint: string
    balanceSince: (date: string) => string
    setBalance: string
    calibrate: string
    trackBalance: string
    balanceActualHint: string
    entries: string
    dailyAverage: string
    trend: string
    trendHint: string
    weekBucket: (index: number) => string
    byCategory: string
    otherCategories: string
    week: string
    month: string
    thisWeek: string
    thisMonth: string
    previous: string
    next: string
    newExpense: string
    editExpense: string
    newIncome: string
    editIncome: string
    incomeNotePlaceholder: string
    expenseNotePlaceholder: string
    amount: string
    category: string
    chooseCategory: string
    contentLabel: string
    contentPlaceholder: string
    date: string
    save: string
    add: string
    addIncomeAction: string
    uncategorized: string
    balanceAdjustment: string
    balanceAdjustmentCategory: string
    toastDeleted: string
    toastCategoryDeleted: string
    toastBalanceSet: string
    toastBalanceAdjusted: string
    toastBalanceCleared: string
    close: string
    closeBackdrop: string
    errors: {
      amount: string
      category: string
      content: string
      date: string
    }
    balanceSetupTitle: string
    balanceSetupHint: string
    balanceSetupNote: string
    balanceCalibrateTitle: string
    balanceCalibrateHint: string
    balanceCalibrateNote: string
    balanceCurrent: string
    balanceActual: string
    balanceInputPlaceholder: string
    balanceInvalid: string
    balanceSave: string
    balanceAdjust: string
    balanceAlreadyMatches: string
    categoriesTitle: string
    searchPlaceholder: string
    noResults: string
    recent: string
    newCategory: string
    categoryNamePlaceholder: string
    categoryNameEmpty: string
    categoryNameTaken: string
    deleteCategory: string
    deleteCategoryTitle: string
    deleteCategoryUnused: (name: string) => string
    deleteCategoryUsed: (name: string, count: number) => string
    groups: Record<
      | 'food'
      | 'transport'
      | 'housing'
      | 'clothing'
      | 'communication'
      | 'development'
      | 'learning'
      | 'entertainment'
      | 'health'
      | 'social'
      | 'income'
      | 'other'
      | 'custom',
      string
    >
  }
  toast: {
    saved: string
    deleted: string
    undo: string
    cleared: (count: number) => string
    close: string
  }
  confirm: {
    close: string
  }
  date: {
    today: string
    tomorrow: string
    yesterday: string
    dayAfterTomorrow: string
    inDays: (count: number) => string
    dueToday: string
    dueTomorrow: string
    inDuration: (value: string) => string
    overdueDuration: (value: string) => string
    overdueDays: (count: number) => string
    deadlineTimed: (dateText: string, time: string) => string
  }
  units: {
    lessThanMinute: string
    minutes: (count: number) => string
    hours: (count: number) => string
    days: (count: number) => string
    months: (count: number) => string
    years: (count: number) => string
  }
}

const en: Messages = {
  meta: {
    title: 'flow · Tasks',
    settingsTitle: 'flow · Settings',
    habitsTitle: 'flow · Habits',
    moneyTitle: 'flow · Money',
    description:
      'A quiet, local-first home for tasks, habits, and money. Organize with #tags, build routines, and track income, spending, and actual balance — stored only on your device.',
  },
  nav: {
    label: 'Main',
    tasks: 'Tasks',
    habits: 'Habits',
    money: 'Money',
    settings: 'Settings',
  },
  app: {
    title: 'Tasks',
    subtitleEmpty: "Capture what's on your mind",
    allDone: 'All done',
    allDoneHint: 'Take a breather.',
    noMatches: 'No matching tasks',
    activeCount: (count) => `${count} active`,
    overdueCount: (count) => `${count} overdue`,
    groups: {
      overdue: 'Overdue',
      today: 'Today',
      tomorrow: 'Tomorrow',
      later: 'Later',
      none: 'No date',
    },
    completed: 'Completed',
    completedCount: (count) => `${count} completed`,
    clearCompleted: 'Clear completed',
    clearTitle: 'Clear completed?',
    clearDescription: (count) =>
      `This will remove ${count} completed ${
        count === 1 ? 'task' : 'tasks'
      }. This cannot be undone.`,
    clearConfirm: 'Clear',
    cancel: 'Cancel',
    addTask: 'Add task',
  },
  filter: {
    label: 'Filter tasks by tag',
    tags: 'Tags',
    all: 'All',
  },
  row: {
    aria: (text) => `Task: ${text}. Tap to edit, swipe left to delete.`,
    markComplete: 'Mark as completed',
    markIncomplete: 'Mark as not completed',
    deleteAria: (text) => `Delete task: ${text}`,
    delete: 'Delete',
  },
  sheet: {
    newTask: 'New task',
    editTask: 'Edit task',
    placeholder: 'What needs doing?',
    contentLabel: 'Task',
    tagHint: 'Type #tags to organize',
    tags: 'Tags',
    due: 'Due date',
    optional: 'Optional',
    none: 'None',
    date: 'Date',
    datetime: 'Date & time',
    modeAria: 'Due date type',
    dueBy: 'Date only',
    exactTime: 'Exact time',
    add: 'Add task',
    save: 'Save changes',
    close: 'Close',
    closeBackdrop: 'Close new task sheet',
    errors: {
      content: 'Add a bit more detail — tags alone cannot be a task.',
      date: 'Pick a date, or switch back to None.',
      badDate: 'That date does not look right. Try again.',
      badTime: 'That time does not look right. Try again.',
    },
  },
  empty: {
    title: 'No tasks yet',
    filteredTitle: 'No matching tasks',
    body: 'Add your first task. One thing at a time.',
    filteredBody: 'Try another tag, or add a task.',
    addFirst: 'Add your first task',
    addNew: 'New task',
  },
  picker: {
    titleDate: 'Pick a date',
    titleDateTime: 'Pick a date & time',
    hours: 'Hour',
    minutes: 'Minute',
    time: 'Time',
    quickTimes: 'Quick times',
    today: 'Today',
    done: 'Done',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
  },
  settings: {
    title: 'Settings',
    subtitle: 'Appearance, language, and data',
    appearance: 'Appearance',
    appearanceHint: 'Follow your device, or choose a look.',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',
    languageHint: 'Changes apply immediately.',
    data: 'Data',
    dataLocal: 'Stored on this device',
    dataSummary: (tasks, habits, expenses) =>
      `${tasks} ${tasks === 1 ? 'task' : 'tasks'} · ${habits} ${
        habits === 1 ? 'habit' : 'habits'
      } · ${expenses} ${
        expenses === 1 ? 'entry' : 'entries'
      }`,
    backup: 'Backup',
    backupHint: 'Download a copy, or restore one on another device.',
    backupReady: 'Backup ready',
    backupReadyHint: 'Download the JSON file, or copy it somewhere safe.',
    downloadFile: 'Download file',
    copyJson: 'Copy JSON',
    backupCopied: 'Copied to clipboard.',
    backupCopyFailed: 'Could not copy. Open the text below and copy manually.',
    backupDownloadStarted: 'Download started. If nothing happened, use Copy JSON.',
    backupDownloadError: 'Could not start the download.',
    showBackupText: 'Show backup text',
    exportBackup: 'Export',
    importBackup: 'Import',
    clearData: 'Erase all data',
    clearTitle: 'Erase all data?',
    clearDescription: (tasks, habits, expenses) =>
      `This removes ${tasks} ${tasks === 1 ? 'task' : 'tasks'}, ${habits} ${habits === 1 ? 'habit' : 'habits'}, and ${expenses} ${expenses === 1 ? 'entry' : 'entries'}. This cannot be undone.`,
    clearConfirm: 'Erase',
    importTitle: 'Restore this backup?',
    importDescription: (tasks, habits, expenses, categories) =>
      `This replaces current data with ${tasks} ${tasks === 1 ? 'task' : 'tasks'}, ${habits} ${habits === 1 ? 'habit' : 'habits'}, ${expenses} ${expenses === 1 ? 'entry' : 'entries'}, and ${categories} custom ${categories === 1 ? 'category' : 'categories'}.`,
    importConfirm: 'Restore',
    importInvalid: 'This is not a valid flow backup.',
    importUnsupported: 'This backup was created by a newer version of flow.',
    exportError: 'Could not create the backup file.',
    importError: 'Could not read this file.',
    about: 'About',
    aboutText:
      'Less noise, more clarity. Tasks, habits, and money stay on this device.',
    version: 'Version 2.0.0',
  },
  habits: {
    title: 'Habits',
    subtitleEmpty: 'Build a rhythm, one day at a time',
    restDay: 'Rest day',
    todaySummary: (done, total) => `${done} of ${total} done today`,
    addHabit: 'Add habit',
    emptyTitle: 'No habits yet',
    emptyBody: 'Start with one small thing you can repeat.',
    addFirst: 'Create your first habit',
    everyDay: 'Every day',
    streak: (count) => `${count}-day streak`,
    week: 'Week',
    month: 'Month',
    weekSummary: (done, total) => `This week ${done} / ${total}`,
    monthSummary: (done, total) => `This month ${done} / ${total}`,
    noPlanned: 'No planned days',
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    streakLabel: 'Streak',
    weekLabel: 'This week',
    totalLabel: 'Total',
    newHabit: 'New habit',
    editHabit: 'Edit habit',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. Read for 20 minutes',
    frequency: 'Frequency',
    daily: 'Every day',
    weekly: 'Specific days',
    weekdays: 'Days',
    checkInIcon: 'Check-in icon',
    checkInIconHint: 'Choose an icon that fits this habit.',
    icons: {
      spark: 'Spark',
      fire: 'Fire',
      star: 'Star',
      heart: 'Heart',
      bolt: 'Bolt',
      plant: 'Grow',
      sun: 'Sun',
      moon: 'Moon',
      drop: 'Water',
      target: 'Focus',
      run: 'Run',
      bike: 'Cycle',
      yoga: 'Yoga',
      strength: 'Strength',
      workout: 'Workout',
      walk: 'Walk',
      sleep: 'Sleep',
      tooth: 'Teeth',
      noSmoke: 'No smoking',
      book: 'Read',
      write: 'Write',
      brain: 'Think',
      code: 'Code',
      art: 'Art',
      music: 'Music',
      language: 'Language',
      journal: 'Journal',
      cook: 'Cook',
      clean: 'Tidy',
      pet: 'Pet',
      money: 'Save',
      home: 'Home',
      social: 'Social',
      party: 'Celebrate',
      coffee: 'Coffee',
      food: 'Food',
      heartPulse: 'Cardio',
      graduationCap: 'Study',
      lightbulb: 'Idea',
      puzzle: 'Puzzle',
      calculator: 'Calculate',
      camera: 'Photo',
      film: 'Film',
      brush: 'Paint',
      scissors: 'Craft',
      mic: 'Podcast',
      headphones: 'Audio',
      palette: 'Design',
      penTool: 'Create',
      utensils: 'Meal',
      basket: 'Shopping',
      piggyBank: 'Savings',
      users: 'Community',
      message: 'Chat',
      phone: 'Call',
      gift: 'Gift',
      cake: 'Birthday',
      smile: 'Joy',
      heartHandshake: 'Kindness',
      leaf: 'Leaf',
      flower: 'Flower',
      tree: 'Tree',
      mountain: 'Mountain',
      cloudSun: 'Weather',
      waves: 'Waves',
      flag: 'Flag',
      trophy: 'Trophy',
      medal: 'Medal',
      rocket: 'Launch',
      compass: 'Direction',
      clock: 'Time',
      alarm: 'Alarm',
      calendar: 'Calendar',
      smartphone: 'Device',
      laptop: 'Laptop',
      terminal: 'Terminal',
      gamepad: 'Play',
      wifi: 'Wi-Fi',
      battery: 'Energy',
      monitor: 'Screen',
    },
    errorName: 'Give the habit a name.',
    errorWeekdays: 'Pick at least one day.',
    scheduleEditHint:
      'Changing the schedule recalculates past planned days.',
    create: 'Create habit',
    save: 'Save changes',
    deleteHabit: 'Delete habit',
    deleteTitle: 'Delete this habit?',
    deleteDescription: (name) =>
      `“${name}” and all of its check-ins will be removed. This cannot be undone.`,
    deleteConfirm: 'Delete',
    back: 'Back',
    edit: 'Edit',
    markDone: (name) => `Check in: ${name}`,
    markUndone: (name) => `Undo check-in: ${name}`,
    openHabit: (name) => `Open habit: ${name}`,
    toastChecked: 'Checked in',
    toastMadeUp: (date) => `Made up for ${date}`,
    toastCanceled: 'Check-in removed',
    toastDeleted: 'Habit deleted',
    outOfWindow: 'You can only make up the last 30 days',
    startsOn: (date) => `Habit starts ${date}`,
    stateChecked: 'Done',
    statePlanned: 'Planned',
    stateRest: 'Rest day',
    stateFuture: 'Not yet',
    stateUnavailable: 'Unavailable',
    close: 'Close',
    closeBackdrop: 'Close habit sheet',
  },
  money: {
    title: 'Money',
    subtitle: 'Income, spending, and what you actually have.',
    viewLabel: 'Money view',
    records: 'Records',
    addExpense: 'Add expense',
    addIncome: 'Add income',
    addEntry: 'Add entry',
    emptyTitle: 'No entries yet',
    emptyBody: 'Log income and spending. The month takes care of itself.',
    addFirst: 'Add your first entry',
    noExpensesPeriod: 'Nothing recorded in this period',
    todayLabel: 'Today',
    yesterdayLabel: 'Yesterday',
    expenseCount: (count) =>
      `${count} ${count === 1 ? 'expense' : 'expenses'}`,
    entryCount: (count) =>
      `${count} ${count === 1 ? 'entry' : 'entries'}`,
    total: 'Total',
    income: 'Income',
    expenses: 'Expenses',
    expenseType: 'Expense',
    net: 'Net',
    netHint: 'Income minus expenses',
    balance: 'Balance',
    balanceHint: 'What you actually have',
    balanceOff: 'Off',
    balanceOffHint:
      'Income, spending, and net stay available. No balance is shown.',
    balanceOffTitle: 'Turn off balance tracking?',
    balanceOffDescription:
      'This clears the starting balance and all balance adjustment records. Income and expenses stay in your history.',
    balanceOffConfirm: 'Turn off',
    balanceNotSet: 'Not set',
    balanceNotSetHint:
      'Set how much you actually have to start tracking.',
    balanceSince: (date) => `Tracking since ${date}`,
    setBalance: 'Set balance',
    calibrate: 'Calibrate',
    trackBalance: 'Track actual balance',
    balanceActualHint: 'Actual money, not income minus spending.',
    entries: 'Entries',
    dailyAverage: 'Daily average',
    trend: 'Spending trend',
    trendHint: 'Tap a bar to see the amount',
    weekBucket: (index) => `W${index}`,
    byCategory: 'Spending by category',
    otherCategories: 'Other categories',
    week: 'Weekly',
    month: 'Monthly',
    thisWeek: 'This week',
    thisMonth: 'This month',
    previous: 'Previous',
    next: 'Next',
    newExpense: 'New expense',
    editExpense: 'Edit expense',
    newIncome: 'New income',
    editIncome: 'Edit income',
    incomeNotePlaceholder: 'Where did it come from?',
    expenseNotePlaceholder: 'What was this for?',
    amount: 'Amount',
    category: 'Category',
    chooseCategory: 'Choose a category',
    contentLabel: 'Note',
    contentPlaceholder: 'What was this for?',
    date: 'Date',
    save: 'Save changes',
    add: 'Add expense',
    addIncomeAction: 'Add income',
    uncategorized: 'Uncategorized',
    balanceAdjustment: 'Balance adjustment',
    balanceAdjustmentCategory: 'Manual adjustment',
    toastDeleted: 'Entry deleted',
    toastCategoryDeleted: 'Category deleted',
    toastBalanceSet: 'Balance tracking started',
    toastBalanceAdjusted: 'Balance adjusted',
    toastBalanceCleared: 'Balance data cleared',
    close: 'Close',
    closeBackdrop: 'Close money sheet',
    errors: {
      amount: 'Enter a valid amount.',
      category: 'Choose a category.',
      content: 'Add a note.',
      date: 'Pick a valid date.',
    },
    balanceSetupTitle: 'Set current balance',
    balanceSetupHint: 'How much do you actually have right now?',
    balanceSetupNote:
      'Tracking starts from this moment. Earlier entries stay in your history and are not recalculated.',
    balanceCalibrateTitle: 'Calibrate balance',
    balanceCalibrateHint: 'Enter what you actually have now.',
    balanceCalibrateNote:
      "We'll add a balance adjustment. Existing entries are not changed.",
    balanceCurrent: 'Current balance',
    balanceActual: 'Actual balance',
    balanceInputPlaceholder: '0.00',
    balanceInvalid: 'Enter a valid amount.',
    balanceSave: 'Set balance',
    balanceAdjust: 'Save adjustment',
    balanceAlreadyMatches: 'Balance already matches',
    categoriesTitle: 'Categories',
    searchPlaceholder: 'Search categories',
    noResults: 'No categories found',
    recent: 'Recent',
    newCategory: 'New category',
    categoryNamePlaceholder: 'Category name',
    categoryNameEmpty: 'Give the category a name.',
    categoryNameTaken: 'That name is already in use.',
    deleteCategory: 'Delete category',
    deleteCategoryTitle: 'Delete this category?',
    deleteCategoryUnused: (name) => `“${name}” will be removed.`,
    deleteCategoryUsed: (name, count) =>
      `“${name}” will be removed, and ${count} ${
        count === 1 ? 'entry' : 'entries'
      } will move to Misc.`,
    groups: {
      food: 'Food',
      transport: 'Transport',
      housing: 'Housing',
      clothing: 'Clothing',
      communication: 'Communication',
      development: 'Dev & API',
      learning: 'Learning',
      entertainment: 'Entertainment',
      health: 'Health',
      social: 'Social',
      income: 'Income',
      other: 'Other',
      custom: 'Custom',
    },
  },
  toast: {
    saved: 'Changes saved',
    deleted: 'Task deleted',
    undo: 'Undo',
    cleared: (count) =>
      `Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`,
    close: 'Dismiss notification',
  },
  confirm: {
    close: 'Close confirmation dialog',
  },
  date: {
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    dayAfterTomorrow: 'In 2 days',
    inDays: (count) => `In ${count} days`,
    dueToday: 'Due today',
    dueTomorrow: 'Due tomorrow',
    inDuration: (value) => `in ${value}`,
    overdueDuration: (value) => `overdue by ${value}`,
    overdueDays: (count) =>
      `overdue by ${count} ${count === 1 ? 'day' : 'days'}`,
    deadlineTimed: (dateText, time) => `${dateText} at ${time}`,
  },
  units: {
    lessThanMinute: 'less than a minute',
    minutes: (count) => `${count} ${count === 1 ? 'minute' : 'minutes'}`,
    hours: (count) => `${count} ${count === 1 ? 'hour' : 'hours'}`,
    days: (count) => `${count} ${count === 1 ? 'day' : 'days'}`,
    months: (count) => `${count} ${count === 1 ? 'month' : 'months'}`,
    years: (count) => `${count} ${count === 1 ? 'year' : 'years'}`,
  },
}

const zh: Messages = {
  meta: {
    title: 'flow · 待办',
    settingsTitle: 'flow · 设置',
    habitsTitle: 'flow · 习惯',
    moneyTitle: 'flow · 记账',
    description:
      '一个安静、本地优先的待办、习惯与记账工具：用 #标签 整理待办，按天养成习惯，记录收入、支出和实际余额，数据只留在本机。',
  },
  nav: {
    label: '主导航',
    tasks: '待办',
    habits: '习惯',
    money: '记账',
    settings: '设置',
  },
  app: {
    title: '待办',
    subtitleEmpty: '记录想做的事',
    allDone: '全部完成',
    allDoneHint: '可以歇一会儿了',
    noMatches: '没有匹配的待办',
    activeCount: (count) => `${count} 件进行中`,
    overdueCount: (count) => `${count} 件已逾期`,
    groups: {
      overdue: '已逾期',
      today: '今天',
      tomorrow: '明天',
      later: '以后',
      none: '无日期',
    },
    completed: '已完成',
    completedCount: (count) => `${count} 条已完成`,
    clearCompleted: '清空已完成',
    clearTitle: '清空已完成？',
    clearDescription: (count) =>
      `这 ${count} 条已完成的待办会被移除，且无法恢复。`,
    clearConfirm: '清空',
    cancel: '取消',
    addTask: '添加待办',
  },
  filter: {
    label: '按标签筛选待办',
    tags: '标签',
    all: '全部',
  },
  row: {
    aria: (text) => `待办：${text}，点击编辑，向左滑动可以删除。`,
    markComplete: '完成这条待办',
    markIncomplete: '把待办标为未完成',
    deleteAria: (text) => `删除待办：${text}`,
    delete: '删除',
  },
  sheet: {
    newTask: '新建待办',
    editTask: '编辑待办',
    placeholder: '准备做什么？',
    contentLabel: '待办内容',
    tagHint: '输入 #标签 可以自动归类',
    tags: '标签',
    due: '截止时间',
    optional: '可选',
    none: '不设',
    date: '日期',
    datetime: '日期与时间',
    modeAria: '截止时间类型',
    dueBy: '仅日期',
    exactTime: '按具体时间',
    add: '添加待办',
    save: '保存修改',
    close: '关闭',
    closeBackdrop: '关闭新建待办面板',
    errors: {
      content: '写点具体内容吧，标签不能单独成为一条待办。',
      date: '选一个日期，或者切回“不设”。',
      badDate: '这个日期似乎不太对，再选一次吧。',
      badTime: '这个时间似乎不太对，再选一次吧。',
    },
  },
  empty: {
    title: '还没有待办',
    filteredTitle: '没有匹配的待办',
    body: '把想做的事记下来，一件一件来。',
    filteredBody: '换个标签看看，或者新建一条。',
    addFirst: '添加第一条',
    addNew: '新建待办',
  },
  picker: {
    titleDate: '选择日期',
    titleDateTime: '选择日期与时间',
    hours: '小时',
    minutes: '分钟',
    time: '时间',
    quickTimes: '常用时间',
    today: '今天',
    done: '完成',
    previousMonth: '上个月',
    nextMonth: '下个月',
  },
  settings: {
    title: '设置',
    subtitle: '外观、语言与数据',
    appearance: '外观',
    appearanceHint: '跟随系统，或手动选择。',
    system: '跟随系统',
    light: '浅色',
    dark: '深色',
    language: '语言',
    languageHint: '切换后立即生效。',
    data: '数据',
    dataLocal: '数据只保存在本机',
    dataSummary: (tasks, habits, expenses) =>
      `${tasks} 条待办 · ${habits} 个习惯 · ${expenses} 笔流水`,
    backup: '备份',
    backupHint: '导出 JSON 备份，或从另一台设备恢复。',
    backupReady: '备份已生成',
    backupReadyHint: '下载 JSON 文件，或复制到安全的地方。',
    downloadFile: '下载文件',
    copyJson: '复制 JSON',
    backupCopied: '已复制到剪贴板。',
    backupCopyFailed: '复制失败，请展开下方文本手动复制。',
    backupDownloadStarted: '已开始下载；如果没有反应，请使用“复制 JSON”。',
    backupDownloadError: '无法开始下载。',
    showBackupText: '查看备份文本',
    exportBackup: '导出',
    importBackup: '导入',
    clearData: '清空所有数据',
    clearTitle: '清空所有数据？',
    clearDescription: (tasks, habits, expenses) =>
      `这会移除 ${tasks} 条待办、${habits} 个习惯和 ${expenses} 笔流水，且无法恢复。`,
    clearConfirm: '清空',
    importTitle: '恢复这个备份？',
    importDescription: (tasks, habits, expenses, categories) =>
      `这会用 ${tasks} 条待办、${habits} 个习惯、${expenses} 笔流水和 ${categories} 个自定义分类替换当前数据。`,
    importConfirm: '恢复',
    importInvalid: '这不是有效的 flow 备份文件。',
    importUnsupported: '这个备份来自更新版本的 flow。',
    exportError: '无法创建备份文件。',
    importError: '无法读取这个文件。',
    about: '关于',
    aboutText: '少一点打扰，多一分清楚。待办、习惯与收支，只保存在这台设备上。',
    version: '版本 2.0.0',
  },
  habits: {
    title: '习惯',
    subtitleEmpty: '从一个小习惯开始',
    restDay: '休息日',
    todaySummary: (done, total) => `今天 ${done}/${total} 已完成`,
    addHabit: '新建习惯',
    emptyTitle: '还没有习惯',
    emptyBody: '从一件可以重复的小事开始。',
    addFirst: '创建第一个习惯',
    everyDay: '每天',
    streak: (count) => `连续 ${count} 天`,
    week: '周',
    month: '月',
    weekSummary: (done, total) => `本周 ${done} / ${total}`,
    monthSummary: (done, total) => `本月 ${done} / ${total}`,
    noPlanned: '没有计划日',
    today: '今天',
    previous: '上一个',
    next: '下一个',
    streakLabel: '连续',
    weekLabel: '本周',
    totalLabel: '累计',
    newHabit: '新建习惯',
    editHabit: '编辑习惯',
    nameLabel: '名称',
    namePlaceholder: '比如：阅读 20 分钟',
    frequency: '频率',
    daily: '每天',
    weekly: '每周',
    weekdays: '星期',
    checkInIcon: '打卡图标',
    checkInIconHint: '选一个适合这个习惯的图标。',
    icons: {
      spark: '星光',
      fire: '火焰',
      star: '星星',
      heart: '心意',
      bolt: '闪电',
      plant: '生长',
      sun: '太阳',
      moon: '月亮',
      drop: '水滴',
      target: '目标',
      run: '跑步',
      bike: '骑行',
      yoga: '瑜伽',
      strength: '力量',
      workout: '健身',
      walk: '散步',
      sleep: '睡眠',
      tooth: '牙齿',
      noSmoke: '戒烟',
      book: '阅读',
      write: '写作',
      brain: '思考',
      code: '编程',
      art: '绘画',
      music: '音乐',
      language: '语言',
      journal: '日记',
      cook: '做饭',
      clean: '整理',
      pet: '宠物',
      money: '储蓄',
      home: '居家',
      social: '社交',
      party: '庆祝',
      coffee: '咖啡',
      food: '饮食',
      heartPulse: '心肺',
      graduationCap: '学习',
      lightbulb: '灵感',
      puzzle: '解谜',
      calculator: '计算',
      camera: '摄影',
      film: '电影',
      brush: '画笔',
      scissors: '手工',
      mic: '播客',
      headphones: '音频',
      palette: '设计',
      penTool: '创作',
      utensils: '餐具',
      basket: '购物',
      piggyBank: '存钱',
      users: '社群',
      message: '聊天',
      phone: '通话',
      gift: '礼物',
      cake: '生日',
      smile: '快乐',
      heartHandshake: '善意',
      leaf: '树叶',
      flower: '花朵',
      tree: '树木',
      mountain: '山',
      cloudSun: '天气',
      waves: '海浪',
      flag: '旗帜',
      trophy: '奖杯',
      medal: '奖牌',
      rocket: '启程',
      compass: '方向',
      clock: '时间',
      alarm: '闹钟',
      calendar: '日历',
      smartphone: '设备',
      laptop: '电脑',
      terminal: '终端',
      gamepad: '游戏',
      wifi: '网络',
      battery: '电量',
      monitor: '屏幕',
    },
    errorName: '给习惯起个名字。',
    errorWeekdays: '至少选一天。',
    scheduleEditHint: '修改周期会重新计算历史计划日。',
    create: '创建习惯',
    save: '保存修改',
    deleteHabit: '删除习惯',
    deleteTitle: '删除这个习惯？',
    deleteDescription: (name) =>
      `“${name}”和它的全部打卡记录会被删除，且无法恢复。`,
    deleteConfirm: '删除',
    back: '返回',
    edit: '编辑',
    markDone: (name) => `打卡：${name}`,
    markUndone: (name) => `取消打卡：${name}`,
    openHabit: (name) => `打开习惯：${name}`,
    toastChecked: '已打卡',
    toastMadeUp: (date) => `已补卡 · ${date}`,
    toastCanceled: '已取消打卡',
    toastDeleted: '已删除习惯',
    outOfWindow: '只能补最近 30 天',
    startsOn: (date) => `习惯从 ${date} 开始`,
    stateChecked: '已打卡',
    statePlanned: '计划日',
    stateRest: '休息日',
    stateFuture: '未来',
    stateUnavailable: '不可操作',
    close: '关闭',
    closeBackdrop: '关闭习惯面板',
  },
  money: {
    title: '记账',
    subtitle: '收入、支出，还有手里实际有多少钱。',
    viewLabel: '记账视图',
    records: '流水',
    addExpense: '记一笔支出',
    addIncome: '记一笔收入',
    addEntry: '记一笔',
    emptyTitle: '还没有流水',
    emptyBody: '记下收入和支出，这个月会自动清楚。',
    addFirst: '记第一笔',
    noExpensesPeriod: '这个周期还没有记录',
    todayLabel: '今天',
    yesterdayLabel: '昨天',
    expenseCount: (count) => `${count} 笔支出`,
    entryCount: (count) => `${count} 笔`,
    total: '总计',
    income: '收入',
    expenses: '支出',
    expenseType: '支出',
    net: '结余',
    netHint: '收入减支出',
    balance: '余额',
    balanceHint: '手里实际有多少钱',
    balanceOff: '未开启',
    balanceOffHint: '只统计收入、支出和结余，不显示余额。',
    balanceOffTitle: '关闭余额？',
    balanceOffDescription:
      '这会清除初始余额和所有余额调整记录；收入和支出流水会保留。',
    balanceOffConfirm: '关闭并清除',
    balanceNotSet: '未设置',
    balanceNotSetHint: '输入现在实际有多少钱，才开始计算余额。',
    balanceSince: (date) => `从 ${date} 开始计算`,
    setBalance: '设置余额',
    calibrate: '校准余额',
    trackBalance: '记录实际余额',
    balanceActualHint: '手里的实际金额，不是收入减支出。',
    entries: '笔数',
    dailyAverage: '日均',
    trend: '支出趋势',
    trendHint: '点击柱状图查看金额',
    weekBucket: (index) => `第${index}周`,
    byCategory: '支出分类占比',
    otherCategories: '其他分类',
    week: '周报',
    month: '月报',
    thisWeek: '本周',
    thisMonth: '本月',
    previous: '上一个',
    next: '下一个',
    newExpense: '记一笔支出',
    editExpense: '编辑支出',
    newIncome: '记一笔收入',
    editIncome: '编辑收入',
    incomeNotePlaceholder: '这笔钱从哪里来？',
    expenseNotePlaceholder: '花在什么地方？',
    amount: '金额',
    category: '分类',
    chooseCategory: '选择分类',
    contentLabel: '内容',
    contentPlaceholder: '花在什么地方？',
    date: '日期',
    save: '保存修改',
    add: '记一笔支出',
    addIncomeAction: '记一笔收入',
    uncategorized: '未分类',
    balanceAdjustment: '余额调整',
    balanceAdjustmentCategory: '手动校准',
    toastDeleted: '已删除这笔流水',
    toastCategoryDeleted: '已删除分类',
    toastBalanceSet: '已开始记录余额',
    toastBalanceAdjusted: '已校准余额',
    toastBalanceCleared: '已清除余额数据',
    close: '关闭',
    closeBackdrop: '关闭记账面板',
    errors: {
      amount: '请输入有效金额。',
      category: '选择一个分类。',
      content: '写点内容。',
      date: '选一个有效日期。',
    },
    balanceSetupTitle: '设置当前余额',
    balanceSetupHint: '现在实际有多少钱？',
    balanceSetupNote:
      '从这一刻开始计算。之前的流水只保留在记录里，不参与余额计算，也不会被重算。',
    balanceCalibrateTitle: '校准余额',
    balanceCalibrateHint: '输入现在实际有多少钱。',
    balanceCalibrateNote: '系统会补一笔余额调整，不会修改已有流水。',
    balanceCurrent: '当前余额',
    balanceActual: '实际余额',
    balanceInputPlaceholder: '0.00',
    balanceInvalid: '请输入有效金额。',
    balanceSave: '设置余额',
    balanceAdjust: '保存调整',
    balanceAlreadyMatches: '余额已经一致',
    categoriesTitle: '分类',
    searchPlaceholder: '搜索分类',
    noResults: '没有找到分类',
    recent: '最近使用',
    newCategory: '新建分类',
    categoryNamePlaceholder: '分类名称',
    categoryNameEmpty: '给分类起个名字。',
    categoryNameTaken: '这个名称已经存在。',
    deleteCategory: '删除分类',
    deleteCategoryTitle: '删除这个分类？',
    deleteCategoryUnused: (name) => `“${name}”会被删除。`,
    deleteCategoryUsed: (name, count) =>
      `“${name}”会被删除，${count} 笔流水会移到“杂项”。`,
    groups: {
      food: '餐饮',
      transport: '出行',
      housing: '居住',
      clothing: '衣着',
      communication: '通讯',
      development: '开发 / API',
      learning: '学习',
      entertainment: '娱乐',
      health: '健康',
      social: '人情',
      income: '收入',
      other: '其他',
      custom: '自定义',
    },
  },
  toast: {
    saved: '已保存修改',
    deleted: '已删除这条待办',
    undo: '撤销',
    cleared: (count) => `已清空 ${count} 条已完成待办`,
    close: '关闭提示',
  },
  confirm: {
    close: '关闭确认窗口',
  },
  date: {
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    dayAfterTomorrow: '后天',
    inDays: (count) => `还有 ${count} 天`,
    dueToday: '今天截止',
    dueTomorrow: '明天截止',
    inDuration: (value) => `还有 ${value}`,
    overdueDuration: (value) => `已超时 ${value}`,
    overdueDays: (count) => `已超时 ${count} 天`,
    deadlineTimed: (dateText, time) => `${dateText} ${time}`,
  },
  units: {
    lessThanMinute: '不到 1 分钟',
    minutes: (count) => `${count} 分钟`,
    hours: (count) => `${count} 小时`,
    days: (count) => `${count} 天`,
    months: (count) => `${count} 个月`,
    years: (count) => `${count} 年`,
  },
}

export const MESSAGES: Record<Locale, Messages> = { en, zh }

export function getMessages(locale: Locale) {
  return MESSAGES[locale]
}
