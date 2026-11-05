// 시드 사람과 공간(코어 prd.md 9절, copy 2-11). 값은 data/people.json에 있고 모두 가상이다.
import { loadData } from './text.js';
export const { SITES, OWNERS, RESIDENTS, PERSONAS, GROUP_ORDER } = await loadData('people');
