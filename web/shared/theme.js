// 첫 화면을 그리기 전에 적용한다. 데모 데이터와 별도 키에 저장한다.
(() => {
  const KEY = 'evenstay-theme', MODES = ['system', 'light', 'dark'];
  const media = matchMedia('(prefers-color-scheme: dark)');
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  let mode = MODES.includes(read()) ? read() : 'system';
  function apply() {
    const theme = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    document.querySelectorAll('iframe').forEach((frame) => {
      try { frame.contentWindow.evenstayTheme?.set(mode); } catch { /* 외부 프레임은 자체 테마를 쓴다. */ }
    });
    window.dispatchEvent(new Event('evenstay-themechange'));
  }
  function set(value) {
    mode = MODES.includes(value) ? value : 'system';
    apply();
  }
  window.evenstayTheme = {
    get mode() { return mode; },
    set,
    cycle() {
      set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
      try { localStorage.setItem(KEY, mode); } catch { /* 저장이 막혀도 현재 페이지에서는 전환한다. */ }
    },
  };
  media.addEventListener('change', () => { if (mode === 'system') apply(); });
  window.addEventListener('storage', (e) => { if (e.key === KEY || e.key === null) set(read()); });
  document.addEventListener('load', (e) => {
    if (e.target.tagName === 'IFRAME') {
      try { e.target.contentWindow.evenstayTheme?.set(mode); } catch { /* 외부 프레임은 자체 테마를 쓴다. */ }
    }
  }, true);
  apply();
})();
