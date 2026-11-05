// 화면 문구는 strings/<모듈>.json, 시드 값은 data/<이름>.json에 있다. 코드에는 키만 둔다.
const base = new URL('../../', import.meta.url);
const get = (p) => fetch(new URL(p, base)).then((r) => (r.ok ? r.json() : {}));
const NAMES = ['common', 'core', 'safety', 'family', 'assistant', 'transitions', 'requests', 'community'];
const table = Object.assign({}, ...await Promise.all(NAMES.map((n) => get(`strings/${n}.json`))));

const JOSA = await get('data/josa.json');
const SLOT = new RegExp(`\\{(\\w+)(?:\\|(${Object.keys(JOSA).join('|')}))?\\}`, 'g');
const DIGIT_FINAL = [1, 8, 0, 1, 0, 0, 1, 8, 8, 0]; // 영 일 이 삼 사 오 육 칠 팔 구의 받침
function finalOf(s) { // 끝 글자의 받침 번호. 0은 받침 없음, 8은 ㄹ
  const c = String(s).trim().slice(-1), n = c.charCodeAt(0);
  if (n >= 0xAC00 && n <= 0xD7A3) return (n - 0xAC00) % 28;
  return /\d/.test(c) ? DIGIT_FINAL[+c] : 0;
}
function josa(v, p) {
  const f = finalOf(v), [withFinal, without, rieul] = JOSA[p];
  return f && !(rieul && f === 8) ? withFinal : without;
}

/** 문구 하나. vars는 문구 안 {이름} 자리를 채운다. {이름|을}처럼 쓰면 값 끝 글자에 맞는 조사를 붙인다. */
export function tx(key, vars) {
  const s = table[key];
  if (s === undefined) { console.error('missing string', key); return key; }
  return vars ? s.replace(SLOT, (m, k, p) => (k in vars ? vars[k] + (p ? josa(vars[k], p) : '') : m)) : s;
}
/** 중첩 구조의 문구 파일(strings/help.json) */
export const loadStrings = (name) => get(`strings/${name}.json`);
/** 시드 값 */
export const loadData = (name) => get(`data/${name}.json`);
