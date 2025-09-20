
// add Auto

function normalizeTextNoSpaces(s = '') {
  // remove diacritics, convert đ->d, lowercase, remove non-alphanumerics and spaces (no internal hyphens)
  return s.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // remove accents
    .replace(/đ/g, 'd').replace(/Đ/g, 'D') // convert đ
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');          // remove everything except a-z0-9 (no spaces)
}
function normalizeTextForMatch(s = '') {
  // used for comparing option text: remove diacritics and trim, keep spaces collapsed
  return s.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
function makeSlugTih(school, ward) {
  const a = normalizeTextNoSpaces(school || '');
  const b = normalizeTextNoSpaces(ward || '');
  return `tih-${a}-${b}`;
}
function triggerEvents(el) {
  if (!el) return;
  ['focus','input','change','blur'].forEach(ev => {
    try { el.dispatchEvent(new Event(ev, { bubbles: true })); } catch(e){/*ignore*/ }
  });
}

/* ---------- DOM helpers ---------- */
function setInputValueByName(name, value) {
  const el = document.querySelector(`[name="${name}"]`);
  if (!el) {
    console.warn('[setInputValueByName] Không tìm thấy element với name:', name);
    return false;
  }
  el.focus?.();
  el.value = value ?? '';
  triggerEvents(el);
  el.blur?.();
  return true;
}

function setSelectByName(name, desiredTextOrValue) {
  // try find select or input hidden (select2/ACF may use different structures)
  let el = document.querySelector(`[name="${name}"]`);
  if (!el) {
    // try input hidden (common in some JS-enhanced selects)
    el = document.querySelector(`input[name="${name}"]`);
  }
  if (!el) {
    console.warn('[setSelectByName] Không tìm thấy select/input với name:', name);
    return false;
  }

  // If it's a select element with options
  if (el.tagName.toLowerCase() === 'select') {
    // try match by value first
    const byValue = Array.from(el.options).find(o => o.value === String(desiredTextOrValue));
    if (byValue) {
      el.value = byValue.value;
      triggerEvents(el);
      return true;
    }
    // try match by option text (normalized)
    const match = Array.from(el.options).find(o =>
    normalizeTextForMatch(o.text).includes(normalizeTextForMatch(desiredTextOrValue))
    );
    if (match) {
      el.value = match.value;
      triggerEvents(el);
      return true;
    }
    // fallback: set raw value and trigger
    el.value = desiredTextOrValue;
    triggerEvents(el);
    return true;
  }

  // If it's an input (hidden or text) used by JS libs, set value and trigger events
  el.value = desiredTextOrValue;
  triggerEvents(el);

  // Try also to find an associated select2 container and update visually (best-effort)
  const selectId = el.id || (el.getAttribute && el.getAttribute('id'));
  if (selectId) {
    const select2Container = document.querySelector(`#select2-${selectId}-container`);
    if (select2Container) {
      select2Container.textContent = desiredTextOrValue;
    }
  }
  return true;
}

/* ---------- Data (entries) ---------- */
/* Mảng entries dựa trên dữ liệu bạn gửi. Bạn có thể thêm/bớt/sửa tùy ý. */
const entries = [
  { level: 'Tiểu Học', school: 'Hòa Bình', oldDistrict: '1', ward: 'Sài Gòn', program: 'TK + GT', experimental: '1', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Ngọc Hân', oldDistrict: '1', ward: 'Bến Thành', program: 'TK + GT', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Đinh Tiên Hoàng', oldDistrict: '1', ward: 'Tân Định', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'phầm mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Thái Bình', oldDistrict: '1', ward: 'Bến Thành', program: 'TK + GT', experimental: '1', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Sơn Hà', oldDistrict: '3', ward: 'Bàn Cờ', program: 'TK', experimental: '0', textbook: 'mới', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Thái Bình', oldDistrict: '4', ward: 'Xóm Chiếu', program: 'TK', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Đống Đa', oldDistrict: '4', ward: 'Khánh Hội', program: 'TK', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Phú Định', oldDistrict: '6', ward: 'Bình Phú', program: 'TK', experimental: '3', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Chi Lăng', oldDistrict: 'Gò Vấp', ward: 'Thông Tây Hội', program: 'TK', experimental: '1', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'An Hội', oldDistrict: 'Gò Vấp', ward: 'Thông Tây Hội', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Viết Xuân', oldDistrict: 'Gò Vấp', ward: 'An Nhơn', program: 'TK', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Quý Đôn', oldDistrict: 'Gò Vấp', ward: 'An Hội Tây', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Hoàng Văn Thụ', oldDistrict: 'Gò Vấp', ward: 'An Nhơn', program: 'TK', experimental: '2', textbook: 'cũ', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Thị Minh Khai', oldDistrict: 'Gò Vấp', ward: 'Thông Tây Hội', program: 'TK', experimental: '1', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Phạm Ngũ Lão', oldDistrict: 'Gò Vấp', ward: 'Hạnh Thông', program: 'TK', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Thị Hồng Gấm', oldDistrict: 'Gò Vấp', ward: 'An Hội Tây', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Kim Đồng', oldDistrict: 'Gò Vấp', ward: 'Gò Vấp', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Hoàn', oldDistrict: 'Gò Vấp', ward: 'An Hội Đông', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Võ Thị Sáu', oldDistrict: 'Gò Vấp', ward: 'An Hội Đông', program: 'TK + GT', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Hanh Thông', oldDistrict: 'Gò Vấp', ward: 'Hạnh Thông', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Đặng Thùy Trâm', oldDistrict: 'Gò Vấp', ward: 'An Hội Tây', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Thượng Hiền', oldDistrict: 'Gò Vấp', ward: 'Hạnh Thông', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Phan Chu Trinh', oldDistrict: 'Gò Vấp', ward: 'An Hội Đông', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Đức Thọ', oldDistrict: 'Gò Vấp', ward: 'An Hội Đông', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Hoàng Văn Thụ', oldDistrict: 'Tân Bình', ward: 'Tân Sơn Nhất', program: 'TK + GT', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Chi Lăng', oldDistrict: 'Tân Bình', ward: 'Tân Hòa', program: 'TK + GT', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Văn Sĩ', oldDistrict: 'Tân Bình', ward: 'Tân Sơn Hòa', program: 'TK + GT', experimental: '2', textbook: 'cũ', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Bành Văn Trân', oldDistrict: 'Tân Bình', ward: 'Tân Sơn Nhất', program: 'TK', experimental: '2', textbook: 'mới', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Lê Thị Hồng Gấm', oldDistrict: 'Tân Bình', ward: 'Bảy Hiền', program: 'TK', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Trần Quốc Tuấn', oldDistrict: 'Tân Bình', ward: 'Bảy Hiền', program: 'TK + GT', experimental: '2', textbook: 'cũ', software: 'Phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Trường Thạnh', oldDistrict: 'Thủ Đức', ward: 'Long Phước', program: 'TK', experimental: '2', textbook: 'mới', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Linh Chiểu', oldDistrict: 'Thủ Đức', ward: 'Thủ Đức', program: 'TK', experimental: '2', textbook: 'cũ', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Đặng Văn Bất', oldDistrict: 'Thủ Đức', ward: 'Hiệp Bình', program: 'TK', experimental: '2', textbook: 'mới', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Nguyễn Thị Tư', oldDistrict: 'Thủ Đức', ward: 'An Khánh', program: 'TK', experimental: '2', textbook: 'cũ', software: 'phần mềm', account: 'tài khoản' },
  { level: 'Tiểu Học', school: 'Giồng Ông Tố', oldDistrict: 'Thủ Đức', ward: 'Bình Trưng', program: 'TK', experimental: '2', textbook: 'mới', software: 'phần mềm', account: 'tài khoản' }
];

/* ---------- Field mapping (tên name attributes bạn cung cấp) ---------- */
const FIELD = {
  title: 'post_title',
  slug: 'acf[field_68a8538fd4e52]',
  wardSelect: 'acf[field_68a853e3d4e53]',
  levelSelect: 'acf[field_68a85457d4e54]',
  startDate: 'acf[field_68a856806e4ba]',
  endDate: 'acf[field_68a856c86e4bb]',
  extraInfo: 'acf[field_68a856f96e4bc]',
  otherDate: 'acf[field_68a93cd7bf16e]'
};

/* ---------- Default dates ---------- */
const DEFAULTS = {
  start: '20250915',
  end:   '20250930',
  other: '20251013'
};

/* ---------- Main fill function ---------- */
function fillFormForEntry(entry) {
  // 1) Title
  setInputValueByName(FIELD.title, entry.school);

  // 2) Slug: tih-<schoolNoSpaces>-<wardNoSpaces>
  const slugCandidate = makeSlugTih(entry.school, entry.ward);
  setInputValueByName(FIELD.slug, slugCandidate);

  // 3) Ward select / input
  setSelectByName(FIELD.wardSelect, entry.ward);

  // 4) Level select (normalize values to expected ones)
  let levelVal = entry.level || '';
  // convert common variants, ensure "Tiểu học" lowercase 'học'
  levelVal = levelVal.replace(/\bHọc\b/, 'học'); // Tiểu Học -> Tiểu học
  setSelectByName(FIELD.levelSelect, levelVal);

  // 5) Dates
  setInputValueByName(FIELD.startDate, DEFAULTS.start);
  setInputValueByName(FIELD.endDate, DEFAULTS.end);
  setInputValueByName(FIELD.otherDate, DEFAULTS.other);

  // 6) Extra info (compose)
  const textbookLabel = entry.textbook || '';
  const extra = `Quận ${entry.oldDistrict}, Sách ${textbookLabel}, Chương trình: ${entry.program}`;
  setInputValueByName(FIELD.extraInfo, extra);
  document.querySelector('#publish').click();

  console.info(`[AutoFill] Đã điền: ${entry.school} — slug: ${slugCandidate}`);
}

/* ---------- Iteration helpers ---------- */
let currentIndex = parseInt(localStorage.getItem("currentIndex") || "0", 10);

function fillNext() {
  // Nếu vượt quá số lượng entries thì reset về 0
  if (currentIndex >= entries.length) {
    currentIndex = 0;
  }

  // Lấy entry hiện tại
  const e = entries[currentIndex];
  fillFormForEntry(e);

  // Tăng index và lưu lại vào localStorage
  currentIndex++;
  localStorage.setItem("currentIndex", currentIndex);
}
function fillAllSequential(delayMs = 800) {
  // điền tự động tất cả entries với khoảng delay để bạn có thể Publish giữa chừng nếu muốn
  currentIndex = 0;
  function step() {
    if (currentIndex >= entries.length) {
      console.info('[AutoFill] Hoàn tất fillAllSequential.');
      return;
    }
    fillFormForEntry(entries[currentIndex]);
    currentIndex++;
    setTimeout(step, delayMs);
  }
  step();
}

/* ---------- Export helpers to global window for console access ---------- */
window.__wpAutoFill = {
  entries,
  fillFormForEntry,
  fillNext,
  fillAllSequential,
  resetIndex: () => { currentIndex = 0; console.log('[AutoFill] Index reset'); },
  setIndex: (i) => { currentIndex = Math.max(0, Math.min(entries.length, i)); console.log('[AutoFill] Index set to', currentIndex); },
  makeSlugTih
};

/* ---------- Ready ---------- */
console.log('[AutoFill] Script loaded. Gọi fillNext() để điền entry hiện tại (không submit).');
console.log(`[AutoFill] Total entries: ${entries.length}. Slug sample for first entry: ${makeSlugTih(entries[0].school, entries[0].ward)}`);
// document.querySelector('.page-title-action') && document.querySelector('.page-title-action').click()

// if(!document.querySelector('.page-title-action')){
//   fillNext() // tự động điền tất cả với delay 1.5s
// }