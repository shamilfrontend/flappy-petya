export const TARGET_FPS = 60;
export const MS_PER_FRAME = 1000 / TARGET_FPS;
export const MAX_FRAME_DELTA = 3;

export const PIPE_GAP = 80;
export const PIPE_START_DELAY = 50;
export const PIPE_SPAWN_INTERVAL = 150;
export const PIPE_SPEED = 2;
export const PIPE_SPAWN_MARGIN = 52;
export const PIPE_SPAWN_OFFSET_MIN = 120;
export const PIPE_SPAWN_OFFSET_RANGE = 200;

export const GROUND_HEIGHT = 112;
export const OBSTACLE_WIDTH = 52;
export const OBSTACLE_BODY_HEIGHT = 400;

export const GOOSE_X = 60;
export const GOOSE_RADIUS = 15;
export const GOOSE_GRAVITY = 0.25;
export const GOOSE_JUMP = 4.6;

export const FG_SCROLL_SPEED = 2;
export const FG_TILE_WIDTH = 14;

export const BASE_WIDTH = 320;
export const BASE_HEIGHT = 480;

export const GROUND_OFFSET = 10;
export const SPLASH_GOOSE_BASE_OFFSET = 245;
export const SPLASH_GOOSE_HOVER_AMPLITUDE = 5;

export const DEATH_ANIM_DURATION = 20;
export const SHAKE_DURATION = 12;
export const SHAKE_INTENSITY = 4;

export const RESIZE_DEBOUNCE_MS = 100;
export const COUNTDOWN_STEP_DURATION = 45;
export const COUNTDOWN_STEPS = 4;
export const TRANSITION_DURATION = 12;
export const SCORE_PULSE_DURATION = 20;
export const SCORE_UI_ANIM_DURATION = 18;
export const PIPE_VARIANT_COUNT = 5;

/**
 * Плавная прогрессия: к этому счёту скорость труб достигает максимального буста.
 */
export const PIPE_DIFFICULTY_RAMP_SCORE = 25;

/**
 * Максимальный буст скорости труб в забеге (например 0.22 = +22%).
 */
export const PIPE_MAX_SPEED_BOOST = 0.22;
