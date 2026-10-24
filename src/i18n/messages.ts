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
    emptyTitle: string
    emptyBody: string
    addFirst: string
    noExpensesPeriod: string
    todayLabel: string
    yesterdayLabel: string
    expenseCount: (count: number) => string
    total: string
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
    amount: string
    category: string
    chooseCategory: string
    contentLabel: string
    contentPlaceholder: string
    date: string
    save: string
    add: string
    uncategorized: string
    toastDeleted: string
    toastCategoryDeleted: string
    close: string
    closeBackdrop: string
    errors: {
      amount: string
      category: string
      content: string
      date: string
    }
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
      'A quiet, local-first home for tasks, habits, and spending. Organize with #tags, build routines, and track expenses — stored only on your device.',
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
    languageHint: 'The whole app switches immediately.',
    data: 'Data',
    dataLocal: 'Stored on this device',
    dataSummary: (tasks, habits, expenses) =>
      `${tasks} ${tasks === 1 ? 'task' : 'tasks'} · ${habits} ${
        habits === 1 ? 'habit' : 'habits'
      } · ${expenses} ${
        expenses === 1 ? 'expense' : 'expenses'
      }`,
    backup: 'Backup',
    backupHint: 'Download a copy, or restore one on another device.',
    exportBackup: 'Export',
    importBackup: 'Import',
    clearData: 'Erase all data',
    clearTitle: 'Erase all data?',
    clearDescription: (tasks, habits, expenses) =>
      `This removes ${tasks} tasks, ${habits} habits, and ${expenses} expenses. This cannot be undone.`,
    clearConfirm: 'Erase everything',
    importTitle: 'Restore this backup?',
    importDescription: (tasks, habits, expenses, categories) =>
      `This replaces current data with ${tasks} tasks, ${habits} habits, ${expenses} expenses, and ${categories} custom categories.`,
    importConfirm: 'Restore',
    importInvalid: 'This is not a valid flow backup.',
    importUnsupported: 'This backup was created by a newer version of flow.',
    exportError: 'Could not create the backup file.',
    importError: 'Could not read this file.',
    about: 'About',
    aboutText:
      'A quiet, local-first home for tasks, habits, and spending. No account, no cloud, no noise.',
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
    streak: (count) => `${count} in a row`,
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
    subtitle: 'A simple record of what you spend.',
    viewLabel: 'Money view',
    records: 'Records',
    addExpense: 'Add expense',
    emptyTitle: 'No expenses yet',
    emptyBody: 'Record what you spend — the reports will add up.',
    addFirst: 'Add your first expense',
    noExpensesPeriod: 'No spending this period',
    todayLabel: 'Today',
    yesterdayLabel: 'Yesterday',
    expenseCount: (count) =>
      `${count} ${count === 1 ? 'expense' : 'expenses'}`,
    total: 'Total',
    entries: 'Entries',
    dailyAverage: 'Daily average',
    trend: 'Trend',
    trendHint: 'Tap a bar to see the amount',
    weekBucket: (index) => `W${index}`,
    byCategory: 'By category',
    otherCategories: 'Other categories',
    week: 'Weekly',
    month: 'Monthly',
    thisWeek: 'This week',
    thisMonth: 'This month',
    previous: 'Previous',
    next: 'Next',
    newExpense: 'New expense',
    editExpense: 'Edit expense',
    amount: 'Amount',
    category: 'Category',
    chooseCategory: 'Choose a category',
    contentLabel: 'Note',
    contentPlaceholder: 'What was this for?',
    date: 'Date',
    save: 'Save changes',
    add: 'Add expense',
    uncategorized: 'Uncategorized',
    toastDeleted: 'Expense deleted',
    toastCategoryDeleted: 'Category deleted',
    close: 'Close',
    closeBackdrop: 'Close expense sheet',
    errors: {
      amount: 'Enter a valid amount.',
      category: 'Choose a category.',
      content: 'Add a note.',
      date: 'Pick a valid date.',
    },
    categoriesTitle: 'Category',
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
        count === 1 ? 'expense' : 'expenses'
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
      '一个安静、本地优先的待办、习惯与记账工具：用 #标签 整理待办，按天养成习惯，记录每一笔支出，数据只留在本机。',
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
    languageHint: '切换后整个界面立即生效。',
    data: '数据',
    dataLocal: '数据只保存在本机',
    dataSummary: (tasks, habits, expenses) =>
      `${tasks} 条待办 · ${habits} 个习惯 · ${expenses} 笔支出`,
    backup: '备份',
    backupHint: '导出 JSON 备份，或从另一台设备恢复。',
    exportBackup: '导出',
    importBackup: '导入',
    clearData: '清空所有数据',
    clearTitle: '清空所有数据？',
    clearDescription: (tasks, habits, expenses) =>
      `这会移除 ${tasks} 条待办、${habits} 个习惯和 ${expenses} 笔支出，且无法恢复。`,
    clearConfirm: '全部清空',
    importTitle: '恢复这个备份？',
    importDescription: (tasks, habits, expenses, categories) =>
      `这会用 ${tasks} 条待办、${habits} 个习惯、${expenses} 笔支出和 ${categories} 个自定义分类替换当前数据。`,
    importConfirm: '恢复',
    importInvalid: '这不是有效的 flow 备份文件。',
    importUnsupported: '这个备份来自更新版本的 flow。',
    exportError: '无法创建备份文件。',
    importError: '无法读取这个文件。',
    about: '关于',
    aboutText: '一个安静、本地优先的待办、习惯与记账工具。无账号、无云端、无打扰。',
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
    streak: (count) => `连续 ${count} 次`,
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
    subtitle: '把每一笔花销，记得简单一点。',
    viewLabel: '记账视图',
    records: '流水',
    addExpense: '记一笔',
    emptyTitle: '还没有支出',
    emptyBody: '记下每一笔，周报月报会自动汇总。',
    addFirst: '记第一笔',
    noExpensesPeriod: '这个周期还没有支出',
    todayLabel: '今天',
    yesterdayLabel: '昨天',
    expenseCount: (count) => `${count} 笔`,
    total: '总计',
    entries: '笔数',
    dailyAverage: '日均',
    trend: '趋势',
    trendHint: '点击柱状图查看金额',
    weekBucket: (index) => `第${index}周`,
    byCategory: '分类占比',
    otherCategories: '其他分类',
    week: '周报',
    month: '月报',
    thisWeek: '本周',
    thisMonth: '本月',
    previous: '上一个',
    next: '下一个',
    newExpense: '记一笔',
    editExpense: '编辑支出',
    amount: '金额',
    category: '分类',
    chooseCategory: '选择分类',
    contentLabel: '内容',
    contentPlaceholder: '花在什么地方？',
    date: '日期',
    save: '保存修改',
    add: '记一笔',
    uncategorized: '未分类',
    toastDeleted: '已删除这笔支出',
    toastCategoryDeleted: '已删除分类',
    close: '关闭',
    closeBackdrop: '关闭记账面板',
    errors: {
      amount: '请输入有效金额。',
      category: '选择一个分类。',
      content: '写点内容。',
      date: '选一个有效日期。',
    },
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
      `“${name}”会被删除，${count} 笔支出会移到“杂项”。`,
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
