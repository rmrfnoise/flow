import type { HabitIcon, HabitIconGroupId } from '../lib/habitIcons'

export type Locale = 'en' | 'zh'

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'flow.locale.v1'

/**
 * Endonyms for the language picker: a language is always listed in its own
 * language, never translated with the surrounding UI.
 */
export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  zh: '简体中文',
}

export interface Messages {
  meta: {
    title: string
    settingsTitle: string
    habitsTitle: string
    moneyTitle: string
    goalsTitle: string
    description: string
  }
  nav: {
    label: string
    tasks: string
    habits: string
    money: string
    goals: string
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
    unsavedTitle: string
    unsavedDescription: string
    discard: string
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
    expand: string
    collapse: string
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
    startup: string
    startupHint: string
    data: string
    dataLocal: string
    dataSummary: (
      tasks: number,
      habits: number,
      expenses: number,
      goals: number,
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
      goals: number,
    ) => string
    clearConfirm: string
    importTitle: string
    importDescription: (
      tasks: number,
      habits: number,
      expenses: number,
      categories: number,
      goals: number,
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
    workdays: string
    weekends: string
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
    iconOptional: string
    clearIcon: string
    habitIconGroups: Record<HabitIconGroupId, string>
    icons: Record<HabitIcon, string>
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
  goals: {
    title: string
    activeCount: (count: number) => string
    behindCount: (count: number) => string
    achievedThisYear: (count: number) => string
    addGoal: string
    emptyTitle: string
    emptyBody: string
    addFirst: string
    endedSection: string
    newGoal: string
    editGoal: string
    titleLabel: string
    titlePlaceholder: string
    startDate: string
    endDate: string
    nodes: string
    nodesHint: string
    nodesEditHint: string
    addNode: string
    nodePlaceholder: string
    editNode: (title: string) => string
    nodeActions: (title: string) => string
    insertNode: string
    insertShort: string
    saveNode: string
    markLit: (title: string) => string
    markUnlit: (title: string) => string
    deleteNode: (title: string) => string
    noNodes: string
    noNodesHint: string
    openGoal: (title: string) => string
    deadline: (date: string) => string
    daysLeft: (days: number) => string
    dueToday: string
    overdueDays: (days: number) => string
    nodesLeft: (count: number) => string
    pacePerDay: (count: number) => string
    paceEveryDays: (days: number) => string
    paceEveryWeeks: (weeks: number) => string
    paceEveryMonths: (months: number) => string
    timeProgress: string
    nodeProgress: string
    achieved: string
    abandoned: string
    archived: string
    achievedOn: (date: string) => string
    abandonedOn: (date: string) => string
    archivedOn: (date: string) => string
    early: (days: number) => string
    late: (days: number) => string
    onTime: string
    markAchieved: string
    markAchievedTitle: string
    markAchievedDescription: (lit: number, total: number) => string
    abandon: string
    abandonTitle: string
    abandonDescription: (title: string) => string
    archive: string
    archiveTitle: string
    archiveDescription: (title: string) => string
    reopen: string
    reopenTitle: string
    reopenDescription: (title: string) => string
    deleteGoal: string
    deleteTitle: string
    deleteDescription: (title: string) => string
    deleteConfirm: string
    verdict: {
      ahead: string
      onTrack: string
      behind: string
      overdue: string
      notStarted: string
      noNodes: string
    }
    verdictDetail: (diff: number) => string
    toastAchieved: string
    toastArchived: string
    toastAbandoned: string
    toastNodeRemoved: string
    toastGoalDeleted: string
    back: string
    edit: string
    close: string
    closeBackdrop: string
    create: string
    save: string
    errors: {
      title: string
      titleTooLong: string
      nodeTooMany: string
      endBeforeStart: string
    }
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
    goalsTitle: 'flow · Goals',
    description:
      'A quiet, local-first home for tasks, habits, goals, and money. Organize with #tags, build routines, and track income, spending, and actual balance — stored only on your device.',
  },
  nav: {
    label: 'Main',
    tasks: 'Tasks',
    habits: 'Habits',
    money: 'Money',
    goals: 'Goals',
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
    unsavedTitle: 'Discard changes?',
    unsavedDescription: 'Your edits will not be saved.',
    discard: 'Discard',
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
    expand: 'Show more',
    collapse: 'Show less',
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
    startup: 'Startup',
    startupHint:
      'Which page opens when you launch flow. Applies next time.',
    data: 'Data',
    dataLocal: 'Stored on this device',
    dataSummary: (tasks, habits, expenses, goals) =>
      `${tasks} ${tasks === 1 ? 'task' : 'tasks'} · ${habits} ${
        habits === 1 ? 'habit' : 'habits'
      } · ${goals} ${goals === 1 ? 'goal' : 'goals'} · ${expenses} ${
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
    clearDescription: (tasks, habits, expenses, goals) =>
      `This removes ${tasks} ${tasks === 1 ? 'task' : 'tasks'}, ${habits} ${habits === 1 ? 'habit' : 'habits'}, ${goals} ${goals === 1 ? 'goal' : 'goals'}, and ${expenses} ${expenses === 1 ? 'entry' : 'entries'}. This cannot be undone.`,
    clearConfirm: 'Erase',
    importTitle: 'Restore this backup?',
    importDescription: (tasks, habits, expenses, categories, goals) =>
      `This replaces current data with ${tasks} ${tasks === 1 ? 'task' : 'tasks'}, ${habits} ${habits === 1 ? 'habit' : 'habits'}, ${goals} ${goals === 1 ? 'goal' : 'goals'}, ${expenses} ${expenses === 1 ? 'entry' : 'entries'}, and ${categories} custom ${categories === 1 ? 'category' : 'categories'}.`,
    importConfirm: 'Restore',
    importInvalid: 'This is not a valid flow backup.',
    importUnsupported: 'This backup was created by a newer version of flow.',
    exportError: 'Could not create the backup file.',
    importError: 'Could not read this file.',
    about: 'About',
    aboutText:
      'A simple personal tool that brings tasks, habit check-ins, goals, and spending together. No account, no network — every record stays on your device.',
    version: 'Version 3.3.0',
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
    workdays: 'Weekdays',
    weekends: 'Weekends',
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
    checkInIconHint: 'Optional. Pick one only if it helps you spot the habit.',
    iconOptional: 'No icon',
    clearIcon: 'Clear icon',
    icons: {
      ban: 'Quit',
      fasting: 'Fasting',
      run: 'Run',
      bike: 'Cycle',
      workout: 'Workout',
      strength: 'Strength',
      yoga: 'Yoga',
      walk: 'Walk',
      sleep: 'Sleep',
      tooth: 'Teeth',
      noSmoke: 'No smoking',
      heartPulse: 'Cardio',
      stretch: 'Stretch',
      hike: 'Hike',
      ball: 'Ball games',
      weight: 'Weight',
      shower: 'Shower',
      heartbeat: 'Heart rate',
      pill: 'Medication',
      doctor: 'Doctor',
      eye: 'Eye care',
      water: 'Hydration',
      book: 'Read',
      write: 'Write',
      brain: 'Think',
      language: 'Language',
      journal: 'Journal',
      code: 'Code',
      graduationCap: 'Study',
      lightbulb: 'Idea',
      puzzle: 'Puzzle',
      calculator: 'Calculate',
      school: 'School',
      library: 'Library',
      note: 'Notes',
      exam: 'Exam',
      memory: 'Memory',
      spell: 'Spelling',
      presentation: 'Speaking',
      award: 'Award',
      microscope: 'Lab work',
      sigma: 'Math',
      art: 'Art',
      music: 'Music',
      camera: 'Photo',
      film: 'Film',
      brush: 'Paint',
      scissors: 'Craft',
      mic: 'Podcast',
      headphones: 'Audio',
      palette: 'Design',
      penTool: 'Create',
      guitar: 'Guitar',
      piano: 'Piano',
      drama: 'Theater',
      video: 'Video',
      sing: 'Singing',
      woodwork: 'Woodwork',
      image: 'Images',
      aperture: 'Lens',
      poetry: 'Poetry',
      doodle: 'Doodle',
      cook: 'Cook',
      clean: 'Clean',
      pet: 'Pet',
      money: 'Save',
      home: 'Home',
      coffee: 'Coffee',
      food: 'Food',
      utensils: 'Meal',
      basket: 'Shopping',
      piggyBank: 'Savings',
      tea: 'Tea',
      soup: 'Soup',
      bread: 'Baking',
      milk: 'Milk',
      fridge: 'Fridge',
      sofa: 'Sofa',
      lamp: 'Lighting',
      laundry: 'Laundry',
      dishes: 'Dishes',
      trash: 'Trash',
      heart: 'Heart',
      social: 'Social',
      party: 'Celebrate',
      users: 'Community',
      message: 'Chat',
      phone: 'Call',
      gift: 'Gift',
      cake: 'Birthday',
      smile: 'Joy',
      heartHandshake: 'Kindness',
      baby: 'Parenting',
      team: 'Team',
      volunteer: 'Volunteering',
      praise: 'Praise',
      mail: 'Mail',
      videoCall: 'Video call',
      anniversary: 'Anniversary',
      wine: 'Drinks',
      newFriend: 'New friends',
      share: 'Sharing',
      plant: 'Grow',
      sun: 'Sun',
      moon: 'Moon',
      drop: 'Water',
      leaf: 'Leaf',
      flower: 'Flower',
      tree: 'Tree',
      mountain: 'Mountain',
      cloudSun: 'Weather',
      waves: 'Waves',
      rain: 'Rain',
      snow: 'Snow',
      wind: 'Wind',
      rainbow: 'Rainbow',
      bird: 'Birds',
      fish: 'Fish',
      earth: 'Earth',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      night: 'Night',
      points: 'Points',
      spark: 'Spark',
      fire: 'Fire',
      star: 'Star',
      bolt: 'Bolt',
      target: 'Focus',
      flag: 'Flag',
      trophy: 'Trophy',
      medal: 'Medal',
      rocket: 'Launch',
      compass: 'Direction',
      crown: 'Champion',
      gem: 'Treasure',
      trend: 'Growth',
      shield: 'Protect',
      key: 'Unlock',
      milestone: 'Milestone',
      badge: 'Certified',
      percent: 'Rate',
      chart: 'Chart',
      improve: 'Improve',
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
      search: 'Search',
      folder: 'Files',
      download: 'Download',
      cloud: 'Cloud',
      printer: 'Print',
      database: 'Data',
      bug: 'Debug',
      keyboard: 'Typing',
      watch: 'Watch',
      mouse: 'Mouse',
    },
    habitIconGroups: {
      body: 'Body',
      mind: 'Mind',
      create: 'Create',
      life: 'Life',
      social: 'Social',
      nature: 'Nature',
      goals: 'Goals',
      tech: 'Tech',
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
  goals: {
    title: 'Goals',
    activeCount: (count) => `${count} active`,
    behindCount: (count) => `${count} behind`,
    achievedThisYear: (count) => `${count} achieved this year`,
    addGoal: 'Add goal',
    emptyTitle: 'No goals yet',
    emptyBody: 'Set a goal, then break it into nodes.',
    addFirst: 'Set your first goal',
    endedSection: 'Finished',
    newGoal: 'New goal',
    editGoal: 'Edit goal',
    titleLabel: 'Goal',
    titlePlaceholder: 'What are you working towards?',
    startDate: 'Starts',
    endDate: 'Ends',
    nodes: 'Nodes',
    nodesHint: 'Each lit node moves progress forward.',
    nodesEditHint: 'Tap ⋯ to edit, insert, or delete.',
    addNode: 'Add node',
    nodePlaceholder: 'Next step',
    editNode: (title) => `Edit node: ${title}`,
    nodeActions: (title) => `Node actions: ${title}`,
    insertNode: 'Insert node below',
    insertShort: 'Insert',
    saveNode: 'Save node',
    markLit: (title) => `Light up node: ${title}`,
    markUnlit: (title) => `Dim node: ${title}`,
    deleteNode: (title) => `Delete node: ${title}`,
    noNodes: 'No nodes yet',
    noNodesHint: 'Break the goal into steps you can light up.',
    openGoal: (title) => `Open goal: ${title}`,
    deadline: (date) => `Ends ${date}`,
    daysLeft: (days) => `${days} ${days === 1 ? 'day' : 'days'} left`,
    dueToday: 'Ends today',
    overdueDays: (days) =>
      `Overdue by ${days} ${days === 1 ? 'day' : 'days'}`,
    nodesLeft: (count) =>
      `${count} ${count === 1 ? 'node' : 'nodes'} to go`,
    pacePerDay: (count) =>
      `${count} ${count === 1 ? 'node' : 'nodes'} a day`,
    paceEveryDays: (days) =>
      `about one node every ${days} ${days === 1 ? 'day' : 'days'}`,
    paceEveryWeeks: (weeks) =>
      `about one node every ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`,
    paceEveryMonths: (months) =>
      `about one node every ${months} ${months === 1 ? 'month' : 'months'}`,
    timeProgress: 'Time',
    nodeProgress: 'Nodes',
    achieved: 'Achieved',
    abandoned: 'Abandoned',
    archived: 'Archived',
    achievedOn: (date) => `Achieved ${date}`,
    abandonedOn: (date) => `Abandoned ${date}`,
    archivedOn: (date) => `Archived ${date}`,
    early: (days) =>
      `${days} ${days === 1 ? 'day' : 'days'} early`,
    late: (days) => `${days} ${days === 1 ? 'day' : 'days'} late`,
    onTime: 'On the deadline',
    markAchieved: 'Mark achieved',
    markAchievedTitle: 'Mark this goal achieved?',
    markAchievedDescription: (lit, total) =>
      `${lit} of ${total} nodes are lit. The goal ends today and the rest stay unlit.`,
    abandon: 'Abandon',
    abandonTitle: 'Abandon this goal?',
    abandonDescription: (title) =>
      `“${title}” ends today. Its nodes stay as they are.`,
    archive: 'Archive',
    archiveTitle: 'Archive this goal?',
    archiveDescription: (title) =>
      `“${title}” ends today and moves to the finished list.`,
    reopen: 'Reopen',
    reopenTitle: 'Reopen this goal?',
    reopenDescription: (title) =>
      `“${title}” becomes active again. Its end date stays the same.`,
    deleteGoal: 'Delete goal',
    deleteTitle: 'Delete this goal?',
    deleteDescription: (title) =>
      `“${title}” and its nodes will be removed. This cannot be undone.`,
    deleteConfirm: 'Delete',
    verdict: {
      ahead: 'Ahead',
      onTrack: 'On track',
      behind: 'Behind',
      overdue: 'Overdue',
      notStarted: 'Not started',
      noNodes: 'No nodes',
    },
    verdictDetail: (diff) =>
      `${diff > 0 ? '+' : ''}${diff} points`,
    toastAchieved: 'Goal achieved',
    toastArchived: 'Goal archived',
    toastAbandoned: 'Goal abandoned',
    toastNodeRemoved: 'Node removed',
    toastGoalDeleted: 'Goal deleted',
    back: 'Back',
    edit: 'Edit',
    close: 'Close',
    closeBackdrop: 'Close goal sheet',
    create: 'Create goal',
    save: 'Save changes',
    errors: {
      title: 'Give the goal a name.',
      titleTooLong: 'Keep the goal under 40 characters.',
      nodeTooMany: 'A goal can have up to 999 nodes.',
      endBeforeStart: 'The end date must be after the start date.',
    },
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
    goalsTitle: 'flow · 目标',
    description:
      '一个安静、本地优先的待办、习惯、目标与记账工具：用 #标签 整理待办，按天养成习惯，沿着节点推进目标，记录收入、支出和实际余额，数据只留在本机。',
  },
  nav: {
    label: '主导航',
    tasks: '待办',
    habits: '习惯',
    money: '记账',
    goals: '目标',
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
    unsavedTitle: '放弃未保存的修改？',
    unsavedDescription: '离开后，这次填写的内容不会保存。',
    discard: '放弃',
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
    expand: '展开',
    collapse: '收起',
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
    startup: '启动页',
    startupHint: '打开 flow 时先显示哪一页，下次启动生效。',
    data: '数据',
    dataLocal: '数据只保存在本机',
    dataSummary: (tasks, habits, expenses, goals) =>
      `${tasks} 条待办 · ${habits} 个习惯 · ${goals} 个目标 · ${expenses} 笔流水`,
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
    clearDescription: (tasks, habits, expenses, goals) =>
      `这会移除 ${tasks} 条待办、${habits} 个习惯、${goals} 个目标和 ${expenses} 笔流水，且无法恢复。`,
    clearConfirm: '清空',
    importTitle: '恢复这个备份？',
    importDescription: (tasks, habits, expenses, categories, goals) =>
      `这会用 ${tasks} 条待办、${habits} 个习惯、${goals} 个目标、${expenses} 笔流水和 ${categories} 个自定义分类替换当前数据。`,
    importConfirm: '恢复',
    importInvalid: '这不是有效的 flow 备份文件。',
    importUnsupported: '这个备份来自更新版本的 flow。',
    exportError: '无法创建备份文件。',
    importError: '无法读取这个文件。',
    about: '关于',
    aboutText:
      '一款简洁的个人管理工具，集待办事项、习惯打卡、目标推进和收支记账于一体。无需注册账号，无需联网，所有数据均保存在自己的设备上。',
    version: '版本 3.3.0',
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
    workdays: '工作日',
    weekends: '周末',
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
    checkInIconHint: '可选，需要时再选一个图标。',
    iconOptional: '未选择',
    clearIcon: '清除图标',
    icons: {
      ban: '戒断',
      fasting: '忌口',
      run: '跑步',
      bike: '骑行',
      workout: '健身',
      strength: '力量',
      yoga: '瑜伽',
      walk: '散步',
      sleep: '睡眠',
      tooth: '牙齿',
      noSmoke: '戒烟',
      heartPulse: '心肺',
      stretch: '拉伸',
      hike: '徒步',
      ball: '球类',
      weight: '体重',
      shower: '洗澡',
      heartbeat: '心率',
      pill: '吃药',
      doctor: '就医',
      eye: '护眼',
      water: '喝水',
      book: '阅读',
      write: '写作',
      brain: '思考',
      language: '语言',
      journal: '日记',
      code: '编程',
      graduationCap: '学习',
      lightbulb: '灵感',
      puzzle: '解谜',
      calculator: '计算',
      school: '上学',
      library: '图书馆',
      note: '笔记',
      exam: '考试',
      memory: '记忆',
      spell: '拼写',
      presentation: '演讲',
      award: '荣誉',
      microscope: '实验',
      sigma: '数学',
      art: '绘画',
      music: '音乐',
      camera: '摄影',
      film: '电影',
      brush: '画笔',
      scissors: '手工',
      mic: '播客',
      headphones: '音频',
      palette: '设计',
      penTool: '创作',
      guitar: '吉他',
      piano: '钢琴',
      drama: '戏剧',
      video: '视频',
      sing: '唱歌',
      woodwork: '木工',
      image: '图片',
      aperture: '镜头',
      poetry: '诗歌',
      doodle: '涂鸦',
      cook: '做饭',
      clean: '清洁',
      pet: '宠物',
      money: '储蓄',
      home: '居家',
      coffee: '咖啡',
      food: '饮食',
      utensils: '餐具',
      basket: '购物',
      piggyBank: '存钱',
      tea: '茶饮',
      soup: '汤羹',
      bread: '烘焙',
      milk: '牛奶',
      fridge: '冰箱',
      sofa: '沙发',
      lamp: '灯光',
      laundry: '洗衣',
      dishes: '洗碗',
      trash: '垃圾',
      heart: '心意',
      social: '社交',
      party: '庆祝',
      users: '社群',
      message: '聊天',
      phone: '通话',
      gift: '礼物',
      cake: '生日',
      smile: '快乐',
      heartHandshake: '善意',
      baby: '育儿',
      team: '团队',
      volunteer: '志愿',
      praise: '赞美',
      mail: '邮件',
      videoCall: '视频通话',
      anniversary: '纪念日',
      wine: '小酌',
      newFriend: '交友',
      share: '分享',
      plant: '生长',
      sun: '太阳',
      moon: '月亮',
      drop: '水滴',
      leaf: '树叶',
      flower: '花朵',
      tree: '树木',
      mountain: '山',
      cloudSun: '天气',
      waves: '海浪',
      rain: '雨天',
      snow: '雪天',
      wind: '风',
      rainbow: '彩虹',
      bird: '观鸟',
      fish: '养鱼',
      earth: '地球',
      sunrise: '日出',
      sunset: '日落',
      night: '夜空',
      points: '签到积分',
      spark: '星光',
      fire: '火焰',
      star: '星星',
      bolt: '闪电',
      target: '目标',
      flag: '旗帜',
      trophy: '奖杯',
      medal: '奖牌',
      rocket: '启程',
      compass: '方向',
      crown: '冠军',
      gem: '宝藏',
      trend: '增长',
      shield: '守护',
      key: '解锁',
      milestone: '里程碑',
      badge: '认证',
      percent: '完成率',
      chart: '图表',
      improve: '提升',
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
      search: '搜索',
      folder: '文件',
      download: '下载',
      cloud: '云盘',
      printer: '打印',
      database: '数据',
      bug: '调试',
      keyboard: '打字',
      watch: '手表',
      mouse: '鼠标',
    },
    habitIconGroups: {
      body: '身体',
      mind: '学习',
      create: '创作',
      life: '生活',
      social: '社交',
      nature: '自然',
      goals: '目标',
      tech: '效率',
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
  goals: {
    title: '目标',
    activeCount: (count) => `${count} 个进行中`,
    behindCount: (count) => `${count} 个滞后`,
    achievedThisYear: (count) => `今年达成 ${count} 个`,
    addGoal: '新建目标',
    emptyTitle: '还没有目标',
    emptyBody: '先定一个目标，再把它拆成几个节点。',
    addFirst: '设定第一个目标',
    endedSection: '已结束',
    newGoal: '新建目标',
    editGoal: '编辑目标',
    titleLabel: '目标',
    titlePlaceholder: '想做成什么？',
    startDate: '开始',
    endDate: '截止',
    nodes: '节点',
    nodesHint: '点亮一个节点，进度就往前一步。',
    nodesEditHint: '点行尾 ⋯ 可以编辑、插入或删除。',
    addNode: '添加节点',
    nodePlaceholder: '下一步',
    editNode: (title) => `编辑节点：${title}`,
    nodeActions: (title) => `节点操作：${title}`,
    insertNode: '在下方插入节点',
    insertShort: '插入',
    saveNode: '保存节点',
    markLit: (title) => `点亮节点：${title}`,
    markUnlit: (title) => `取消点亮：${title}`,
    deleteNode: (title) => `删除节点：${title}`,
    noNodes: '还没有节点',
    noNodesHint: '把目标拆成几件能点亮的事。',
    openGoal: (title) => `打开目标：${title}`,
    deadline: (date) => `截止 ${date}`,
    daysLeft: (days) => `还剩 ${days} 天`,
    dueToday: '今天截止',
    overdueDays: (days) => `已超期 ${days} 天`,
    nodesLeft: (count) => `还差 ${count} 个节点`,
    pacePerDay: (count) => `每天点亮 ${count} 个`,
    paceEveryDays: (days) => `平均每 ${days} 天点亮 1 个`,
    paceEveryWeeks: (weeks) => `平均每 ${weeks} 周点亮 1 个`,
    paceEveryMonths: (months) => `平均每 ${months} 个月点亮 1 个`,
    timeProgress: '时间',
    nodeProgress: '节点',
    achieved: '已达成',
    abandoned: '已放弃',
    archived: '已归档',
    achievedOn: (date) => `达成于 ${date}`,
    abandonedOn: (date) => `放弃于 ${date}`,
    archivedOn: (date) => `归档于 ${date}`,
    early: (days) => `提前 ${days} 天`,
    late: (days) => `超期 ${days} 天`,
    onTime: '准时达成',
    markAchieved: '标记达成',
    markAchievedTitle: '标记这个目标达成？',
    markAchievedDescription: (lit, total) =>
      `已点亮 ${lit}/${total} 个节点。目标今天结束，未点亮的节点保持原样。`,
    abandon: '放弃',
    abandonTitle: '放弃这个目标？',
    abandonDescription: (title) =>
      `“${title}”会在今天结束，节点保持原样。`,
    archive: '归档',
    archiveTitle: '归档这个目标？',
    archiveDescription: (title) =>
      `“${title}”会在今天结束，并移到已结束区。`,
    reopen: '重新开始',
    reopenTitle: '重新开始这个目标？',
    reopenDescription: (title) =>
      `“${title}”会回到进行中，截止日期不变。`,
    deleteGoal: '删除目标',
    deleteTitle: '删除这个目标？',
    deleteDescription: (title) =>
      `“${title}”和它的节点会被删除，且无法恢复。`,
    deleteConfirm: '删除',
    verdict: {
      ahead: '超前',
      onTrack: '正常',
      behind: '滞后',
      overdue: '已超期',
      notStarted: '未开始',
      noNodes: '未拆解',
    },
    verdictDetail: (diff) =>
      `${diff > 0 ? '+' : ''}${diff} 个百分点`,
    toastAchieved: '目标达成',
    toastArchived: '已归档这个目标',
    toastAbandoned: '已放弃这个目标',
    toastNodeRemoved: '已删除节点',
    toastGoalDeleted: '已删除目标',
    back: '返回',
    edit: '编辑',
    close: '关闭',
    closeBackdrop: '关闭目标面板',
    create: '创建目标',
    save: '保存修改',
    errors: {
      title: '给目标起个名字。',
      titleTooLong: '目标名称最多 40 个字。',
      nodeTooMany: '一个目标最多 999 个节点。',
      endBeforeStart: '截止日期必须晚于开始日期。',
    },
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
