import { DAILY_1_RESULTS } from './daily/task_1';
import { DAILY_2_RESULTS } from './daily/task_2';
import { DAILY_3_RESULTS } from './daily/task_3';

export const DAILIES_SCORE_ARRAY = [
    DAILY_1_RESULTS,
    DAILY_2_RESULTS,
    DAILY_3_RESULTS,
]

export const DAILIES_SCORE_ARRAY_MAP = DAILIES_SCORE_ARRAY.map((daily, index) => ({
    name: `Daily ${index + 1}`,
    maxPoints: Math.max(...Object.values(daily)),
    daily
}))