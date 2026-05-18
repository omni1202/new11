// 2026 data reflects the official holiday tables plus the 2026 legal addition of Labor Day and Constitution Day.
// 2027 data reflects KASI calendar data plus the 2026 legal holiday/substitute-holiday rules.
const HOLIDAY_YEARS = {
  2026: [
    { date: "2026-01-01", name: "신정" },
    { date: "2026-02-16", name: "설날 연휴" },
    { date: "2026-02-17", name: "설날" },
    { date: "2026-02-18", name: "설날 연휴" },
    { date: "2026-03-01", name: "삼일절" },
    { date: "2026-03-02", name: "삼일절 대체공휴일", substitute: true },
    { date: "2026-05-01", name: "노동절" },
    { date: "2026-05-05", name: "어린이날" },
    { date: "2026-05-24", name: "부처님오신날" },
    { date: "2026-05-25", name: "부처님오신날 대체공휴일", substitute: true },
    { date: "2026-06-06", name: "현충일" },
    { date: "2026-07-17", name: "제헌절" },
    { date: "2026-08-15", name: "광복절" },
    { date: "2026-08-17", name: "광복절 대체공휴일", substitute: true },
    { date: "2026-09-24", name: "추석 연휴" },
    { date: "2026-09-25", name: "추석" },
    { date: "2026-09-26", name: "추석 연휴" },
    { date: "2026-10-03", name: "개천절" },
    { date: "2026-10-05", name: "개천절 대체공휴일", substitute: true },
    { date: "2026-10-09", name: "한글날" },
    { date: "2026-12-25", name: "성탄절" },
  ],
  2027: [
    { date: "2027-01-01", name: "신정" },
    { date: "2027-02-06", name: "설날" },
    { date: "2027-02-07", name: "설날 연휴" },
    { date: "2027-02-08", name: "설날 연휴" },
    { date: "2027-02-09", name: "설날 추가휴일", substitute: true },
    { date: "2027-03-01", name: "삼일절" },
    { date: "2027-05-01", name: "노동절" },
    { date: "2027-05-03", name: "노동절 대체공휴일", substitute: true },
    { date: "2027-05-05", name: "어린이날" },
    { date: "2027-05-13", name: "부처님오신날" },
    { date: "2027-06-06", name: "현충일" },
    { date: "2027-07-17", name: "제헌절" },
    { date: "2027-07-19", name: "제헌절 대체공휴일", substitute: true },
    { date: "2027-08-15", name: "광복절" },
    { date: "2027-08-16", name: "광복절 대체공휴일", substitute: true },
    { date: "2027-09-14", name: "추석 연휴" },
    { date: "2027-09-15", name: "추석" },
    { date: "2027-09-16", name: "추석 연휴" },
    { date: "2027-10-03", name: "개천절" },
    { date: "2027-10-04", name: "개천절 대체공휴일", substitute: true },
    { date: "2027-10-09", name: "한글날" },
    { date: "2027-10-11", name: "한글날 대체공휴일", substitute: true },
    { date: "2027-12-25", name: "성탄절" },
    { date: "2027-12-27", name: "성탄절 대체공휴일", substitute: true },
  ],
};

const MONTH_NAMES = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const KOREA_TIMEZONE = "Asia/Seoul";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const yearSelect = document.querySelector("#year-select");
const monthHeading = document.querySelector("#month-heading");
const holidayListHeading = document.querySelector("#holiday-list-heading");
const calendarGrid = document.querySelector("#calendar-grid");
const weekdayRow = document.querySelector("#weekday-row");
const holidayList = document.querySelector("#holiday-list");
const todayLabel = document.querySelector("#today-label");
const liveTime = document.querySelector("#live-time");
const rangeLabel = document.querySelector("#range-label");
const countdownTitle = document.querySelector("#countdown-title");
const countdownDate = document.querySelector("#countdown-date");
const countdownBadge = document.querySelector("#countdown-badge");
const countdownNote = document.querySelector("#countdown-note");
const followupTitle = document.querySelector("#followup-title");
const remainingHolidayCount = document.querySelector("#remaining-holiday-count");
const prevMonthButton = document.querySelector("#prev-month");
const nextMonthButton = document.querySelector("#next-month");

const supportedYears = Object.keys(HOLIDAY_YEARS)
  .map(Number)
  .sort((left, right) => left - right);

const holidayEntries = Object.values(HOLIDAY_YEARS)
  .flat()
  .map((holiday) => ({
    ...holiday,
    year: Number(holiday.date.slice(0, 4)),
  }))
  .sort((left, right) => left.date.localeCompare(right.date));

const holidayMap = new Map();

holidayEntries.forEach((holiday) => {
  if (!holidayMap.has(holiday.date)) {
    holidayMap.set(holiday.date, []);
  }

  holidayMap.get(holiday.date).push(holiday);
});

function getKoreaDateParts(reference = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: KOREA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });

  const parts = formatter.formatToParts(reference);
  const valueByType = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      valueByType[part.type] = part.value;
    }
  });

  return {
    year: Number(valueByType.year),
    month: Number(valueByType.month),
    day: Number(valueByType.day),
    weekday: valueByType.weekday,
    iso: `${valueByType.year}-${valueByType.month}-${valueByType.day}`,
  };
}

function getKoreaTimeString(reference = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: KOREA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(reference);
}

function toUtcDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function diffInDays(fromDateString, toDateString) {
  return Math.round((toUtcDate(toDateString) - toUtcDate(fromDateString)) / MS_PER_DAY);
}

function formatLongDate(dateString) {
  const utcDate = toUtcDate(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(utcDate);
}

function formatDateOnly(dateString) {
  const utcDate = toUtcDate(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(utcDate);
}

function formatFullWeekday(dateString) {
  const utcDate = toUtcDate(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "UTC",
    weekday: "long",
  }).format(utcDate);
}

function formatLongDateWithFullWeekday(dateString) {
  return `${formatDateOnly(dateString)} ${formatFullWeekday(dateString)}`;
}

function getDdText(dayDifference) {
  if (dayDifference === 0) {
    return "D-DAY";
  }

  if (dayDifference > 0) {
    return `D-${dayDifference}`;
  }

  return `D+${Math.abs(dayDifference)}`;
}

function getUpcomingIndex(todayIso) {
  return holidayEntries.findIndex((holiday) => holiday.date >= todayIso);
}

function getRemainingHolidayDaysText(todayIso) {
  const currentYear = Number(todayIso.slice(0, 4));

  if (!supportedYears.includes(currentYear)) {
    return "올해 남은 공휴일 집계는 지원 연도 안에서만 표시됩니다.";
  }

  const remainingDates = new Set(
    holidayEntries
      .filter((holiday) => holiday.year === currentYear && holiday.date >= todayIso)
      .map((holiday) => holiday.date)
  );

  return `올해 남은 공휴일은 총 ${remainingDates.size}일입니다.`;
}

function renderWeekdays() {
  weekdayRow.innerHTML = "";

  WEEKDAY_LABELS.forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "weekday-cell";
    cell.textContent = label;
    weekdayRow.appendChild(cell);
  });
}

function renderYearSelect(selectedYear) {
  yearSelect.innerHTML = "";

  supportedYears.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = `${year}년`;
    option.selected = year === selectedYear;
    yearSelect.appendChild(option);
  });
}

function buildCalendarDays(viewYear, viewMonthIndex, todayIso) {
  const firstDay = new Date(viewYear, viewMonthIndex, 1);
  const lastDay = new Date(viewYear, viewMonthIndex + 1, 0);
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells = [];

  for (let blankIndex = 0; blankIndex < startWeekday; blankIndex += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const iso = `${viewYear}-${String(viewMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({
      day,
      iso,
      weekday: new Date(viewYear, viewMonthIndex, day).getDay(),
      holidays: holidayMap.get(iso) || [],
      isToday: iso === todayIso,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function renderCalendar(viewYear, viewMonthIndex, todayIso) {
  monthHeading.textContent = `${viewYear}년 ${MONTH_NAMES[viewMonthIndex]}`;
  calendarGrid.innerHTML = "";

  buildCalendarDays(viewYear, viewMonthIndex, todayIso).forEach((entry) => {
    const cell = document.createElement("article");

    if (!entry) {
      cell.className = "date-cell is-empty";
      calendarGrid.appendChild(cell);
      return;
    }

    const hasHoliday = entry.holidays.length > 0;
    cell.className = "date-cell";

    if (entry.isToday) {
      cell.classList.add("is-today");
    }

    if (hasHoliday) {
      cell.classList.add("is-holiday");
    }

    if (entry.weekday === 0) {
      cell.classList.add("is-sunday");
    }

    if (entry.weekday === 6) {
      cell.classList.add("is-saturday");
    }

    const dateNumber = document.createElement("div");
    dateNumber.className = "date-number";
    dateNumber.textContent = entry.day;
    cell.appendChild(dateNumber);

    const tags = document.createElement("div");
    tags.className = "holiday-tags";

    entry.holidays.forEach((holiday) => {
      const pill = document.createElement("div");
      pill.className = "holiday-pill";

      if (holiday.substitute) {
        pill.classList.add("is-substitute");
      }

      pill.textContent = holiday.name;
      tags.appendChild(pill);
    });

    cell.appendChild(tags);
    calendarGrid.appendChild(cell);
  });
}

function renderHolidayList(viewYear, todayIso) {
  holidayListHeading.textContent = `${viewYear}년 공휴일`;
  holidayList.innerHTML = "";

  const entries = HOLIDAY_YEARS[viewYear] || [];

  if (entries.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "이 연도에 등록된 공휴일 데이터가 없습니다.";
    holidayList.appendChild(emptyState);
    return;
  }

  entries.forEach((holiday) => {
    const item = document.createElement("article");
    item.className = "holiday-item";

    const dayDifference = diffInDays(todayIso, holiday.date);
    const info = document.createElement("div");
    const title = document.createElement("p");
    const date = document.createElement("p");
    const badge = document.createElement("div");

    title.className = "holiday-item-title";
    date.className = "holiday-item-date";
    badge.className = "holiday-item-badge";

    if (dayDifference === 0) {
      badge.classList.add("is-today");
    } else if (dayDifference > 0) {
      badge.classList.add("is-upcoming");
    }

    title.textContent = holiday.name;
    date.textContent = formatLongDateWithFullWeekday(holiday.date);
    badge.textContent = getDdText(dayDifference);

    info.append(title, date);
    item.append(info, badge);
    holidayList.appendChild(item);
  });
}

function renderCountdown(todayIso) {
  const upcomingIndex = getUpcomingIndex(todayIso);

  if (upcomingIndex === -1) {
    countdownTitle.textContent = "등록된 다음 공휴일이 없습니다";
    countdownDate.textContent = "데이터 범위를 추가하면 이어서 계산됩니다.";
    countdownBadge.textContent = "-";
    countdownNote.textContent =
      "현재 포함된 데이터 범위를 모두 지난 상태입니다. 새 연도 공휴일을 추가하면 자동으로 이어집니다.";
    followupTitle.textContent = "다음 데이터 추가 대기";
    remainingHolidayCount.textContent = getRemainingHolidayDaysText(todayIso);
    return;
  }

  const currentHolidayDate = holidayEntries[upcomingIndex].date;
  const sameDayHolidays = holidayMap.get(currentHolidayDate) || [];
  const nextDifferentDayHoliday = holidayEntries.find(
    (holiday) => holiday.date > currentHolidayDate
  );
  const dayDifference = diffInDays(todayIso, currentHolidayDate);

  countdownTitle.textContent = sameDayHolidays.map((holiday) => holiday.name).join(" · ");
  countdownDate.textContent = formatLongDateWithFullWeekday(currentHolidayDate);
  countdownBadge.textContent = getDdText(dayDifference);

  if (dayDifference === 0) {
    countdownNote.textContent =
      "오늘이 공휴일입니다. 하루가 지나면 가장 가까운 다음 공휴일로 자동 전환됩니다.";
  } else {
    countdownNote.textContent = "";
  }

  remainingHolidayCount.textContent = getRemainingHolidayDaysText(todayIso);

  if (nextDifferentDayHoliday) {
    const nextDifference = diffInDays(todayIso, nextDifferentDayHoliday.date);
    followupTitle.textContent = `${nextDifferentDayHoliday.name} ${getDdText(nextDifference)}`;
  } else {
    followupTitle.textContent = "다음 공휴일 데이터 준비 중";
  }
}

function renderHeader(todayParts) {
  todayLabel.textContent = `${formatDateOnly(todayParts.iso)} ${formatFullWeekday(todayParts.iso)}`;
  rangeLabel.textContent = `지원 연도 ${supportedYears[0]}-${supportedYears[supportedYears.length - 1]} · 대한민국 기준`;
}

function renderLiveClock() {
  liveTime.textContent = getKoreaTimeString();
}

function syncViewWithinRange(viewState) {
  const minYear = supportedYears[0];
  const maxYear = supportedYears[supportedYears.length - 1];

  if (viewState.year < minYear) {
    viewState.year = minYear;
    viewState.monthIndex = 0;
  }

  if (viewState.year > maxYear) {
    viewState.year = maxYear;
    viewState.monthIndex = 11;
  }
}

function renderApp(viewState) {
  const todayParts = getKoreaDateParts();
  const todayYearInRange = supportedYears.includes(todayParts.year)
    ? todayParts.year
    : supportedYears[0];

  syncViewWithinRange(viewState);

  renderYearSelect(viewState.year);
  renderHeader(todayParts);
  renderCountdown(todayParts.iso);
  renderCalendar(viewState.year, viewState.monthIndex, todayParts.iso);
  renderHolidayList(viewState.year, todayParts.iso);

  if (!supportedYears.includes(todayParts.year)) {
    remainingHolidayCount.textContent =
      "올해 남은 공휴일 집계는 지원 연도 안에서만 표시됩니다.";
  }

  if (viewState.year !== todayYearInRange && viewState.year === supportedYears[supportedYears.length - 1]) {
    rangeLabel.textContent = `${rangeLabel.textContent} · 이후 연도는 script.js에 추가 가능`;
  }
}

const todayParts = getKoreaDateParts();
const initialYear = supportedYears.includes(todayParts.year)
  ? todayParts.year
  : supportedYears[0];

const viewState = {
  year: initialYear,
  monthIndex: supportedYears.includes(todayParts.year) ? todayParts.month - 1 : 0,
};

renderWeekdays();
renderApp(viewState);
renderLiveClock();

yearSelect.addEventListener("change", (event) => {
  viewState.year = Number(event.target.value);
  renderApp(viewState);
});

prevMonthButton.addEventListener("click", () => {
  viewState.monthIndex -= 1;

  if (viewState.monthIndex < 0) {
    viewState.year -= 1;
    viewState.monthIndex = 11;
  }

  syncViewWithinRange(viewState);

  if (viewState.year === supportedYears[0] && viewState.monthIndex < 0) {
    viewState.monthIndex = 0;
  }

  renderApp(viewState);
});

nextMonthButton.addEventListener("click", () => {
  viewState.monthIndex += 1;

  if (viewState.monthIndex > 11) {
    viewState.year += 1;
    viewState.monthIndex = 0;
  }

  syncViewWithinRange(viewState);
  renderApp(viewState);
});

setInterval(() => {
  renderApp(viewState);
}, 60 * 1000);

setInterval(() => {
  renderLiveClock();
}, 1000);
