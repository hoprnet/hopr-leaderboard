import { DAILY_1_RESULTS } from './daily/task_1';
import { DAILY_2_RESULTS } from './daily/task_2';
import { DAILY_3_RESULTS } from './daily/task_3';
import { DAILY_4_RESULTS } from './daily/task_4';
import { DAILY_5_RESULTS } from './daily/task_5';
import { DAILY_6_RESULTS } from './daily/task_6';
import { DAILY_7_RESULTS } from './daily/task_7';
import { DAILY_8_RESULTS } from './daily/task_8';
import { DAILY_9_RESULTS } from './daily/task_9';
import { DAILY_10_RESULTS } from './daily/task_10';
import { DAILY_11_RESULTS } from './daily/task_11';
import { DAILY_11W_RESULTS } from './daily/task_11w';

export const DAILIES_SCORE_ARRAY = [
    DAILY_1_RESULTS,
    DAILY_2_RESULTS,
    DAILY_3_RESULTS,
    DAILY_4_RESULTS,
    DAILY_5_RESULTS,
    DAILY_6_RESULTS,
    DAILY_7_RESULTS,
    DAILY_8_RESULTS,
    DAILY_9_RESULTS,
    DAILY_10_RESULTS,
    DAILY_11_RESULTS,
    DAILY_11W_RESULTS
]

export const DAILIES_SCORE_ARRAY_MAP = DAILIES_SCORE_ARRAY.map((daily, index) => ({
    name: `Daily ${index + 1}`,
    maxPoints: Math.max(...Object.values(daily)),
    daily
}))

