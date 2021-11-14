import * as TYPES from '../constants';

export const setTitle = (value: string) => ({ type: TYPES.SET_TITLE, value });
export const setLanguage = (value: string) => ({ type: TYPES.SET_LANGUAGE, value });
export const setCurrency = (value: string) => ({ type: TYPES.SET_CURRENCY, value });