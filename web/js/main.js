import { api, db, load, register, reset, save } from './lib/kit.js';
import { mount, render } from './lib/app.js';
import { beatList, enterFromUrl, extraList, mountStage, playAll, playExtra } from './lib/stage.js';
import * as help from './lib/help.js';
import { openChooser, startTour, tourNow } from './lib/tour.js';
import common from './modules/common.js';
import core from './modules/core.js';
import safety from './modules/safety.js';
import family from './modules/family.js';
import assistant from './modules/assistant.js';
import transitions from './modules/transitions.js';
import requests from './modules/requests.js';
import community from './modules/community.js';

// 초기화 순서는 CLAUDE.md 규칙 9
[common, core, safety, family, assistant, transitions, requests, community].forEach(register);

const frame = document.getElementById('frame');
const start = async () => {
  if (!load()) { reset(); save(); }
  mount(frame); await mountStage(); render();
  window.proto = { api, db, reset, playAll, playExtra, render, help, beatList, extraList, tour: { start: startTour, now: tourNow, chooser: openChooser } };
  enterFromUrl();
};
if (frame.contentDocument?.readyState === 'complete' && frame.contentDocument.getElementById('root')) start();
else frame.addEventListener('load', start, { once: true });
