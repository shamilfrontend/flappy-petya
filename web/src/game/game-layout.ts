import {
  FOOTER_BUTTON_GAP,
  getPauseButtonRect,
  getRecordsLayout,
  getScoreBadgeY,
  getScoreLayout,
  getSettingsLayout,
  getSplashLayout,
  layoutSettingsToggles,
  layoutSplashFooterButtons,
} from '../graphics/ui-layout';
import {
  layoutRecordsTabs,
  measureButton,
  measurePlayerNameButton,
} from '../graphics/ui-text';
import { DIFFICULTIES } from './difficulty';
import type { GameHost } from './game-host';

const RETRY_BUTTON_LABEL = 'Ещё раз';
const BACK_BUTTON_LABEL = 'Назад';

export function layoutGameUi(host: GameHost): void {
  const { logicalWidth, logicalHeight } = host.viewport;
  const scoreLayout = getScoreLayout(logicalHeight);
  const splashLayout = getSplashLayout(logicalHeight);
  const recordsLayout = getRecordsLayout(logicalHeight);

  const retryBtnSize = measureButton(host.ctx, RETRY_BUTTON_LABEL);
  host.okBtn = {
    x: (logicalWidth - retryBtnSize.width) / 2,
    y: scoreLayout.retryButtonY,
    width: retryBtnSize.width,
    height: retryBtnSize.height,
  };

  const [recordsBtn, settingsBtn] = layoutSplashFooterButtons(
    logicalWidth / 2,
    splashLayout.footerStartY,
    logicalWidth,
  );
  host.recordsBtn = recordsBtn;
  host.settingsBtn = settingsBtn;

  if (host.playerName) {
    const playerNameBtnSize = measurePlayerNameButton(
      host.ctx,
      host.playerName,
      logicalWidth,
    );
    host.playerNameBtn = {
      x: (logicalWidth - playerNameBtnSize.width) / 2,
      y: host.recordsBtn.y + host.recordsBtn.height + FOOTER_BUTTON_GAP,
      width: playerNameBtnSize.width,
      height: playerNameBtnSize.height,
    };
  } else {
    host.playerNameBtn = { x: 0, y: 0, width: 0, height: 0 };
  }

  const settingsLayout = getSettingsLayout(logicalHeight);
  const backBtnSize = measureButton(host.ctx, BACK_BUTTON_LABEL);
  host.backBtn = {
    x: (logicalWidth - backBtnSize.width) / 2,
    y: recordsLayout.backButtonY,
    width: backBtnSize.width,
    height: backBtnSize.height,
  };

  const [soundToggleBtn, hapticToggleBtn] = layoutSettingsToggles(
    logicalWidth / 2,
    settingsLayout.panelStartY,
    logicalWidth,
  );
  host.soundToggleBtn = soundToggleBtn;
  host.hapticToggleBtn = hapticToggleBtn;

  host.recordsTabBtns = layoutRecordsTabs(
    logicalWidth / 2,
    recordsLayout.tabsY,
    logicalWidth,
    DIFFICULTIES.length,
  );

  host.difficultyTabBtns = layoutRecordsTabs(
    logicalWidth / 2,
    splashLayout.difficultyTabsY,
    logicalWidth,
    DIFFICULTIES.length,
  );

  const playBtnSize = measureButton(host.ctx, host.getPlayButtonLabel());
  host.playBtn = {
    x: (logicalWidth - playBtnSize.width) / 2,
    y: splashLayout.playButtonY,
    width: playBtnSize.width,
    height: playBtnSize.height,
  };

  host.pauseBtn = getPauseButtonRect(
    logicalWidth,
    getScoreBadgeY(logicalHeight),
  );
}
