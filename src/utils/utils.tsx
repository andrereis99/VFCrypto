import { toast as Toast } from "react-toastify";
import Strings from './strings';

export const translate = (text: any) => {
	if (!text) return "";

	if (typeof text === "string") return text;

	const lang = Strings.getLanguage();
	const defaultLanguage = Strings.getLanguage();

	if (text[defaultLanguage] || text[lang]) {
		return text[defaultLanguage] || text[lang];
	}

	return Object.values(text).filter((val) => !!val)[0] || "";
};

export const formatPrice = (price: number, currency: string, curAtRight: boolean = false) => {
	if (!price) return `0.00 ${currency}`

	return `${curAtRight ? '' : `${currency} `}${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}${curAtRight ? ` ${currency}` : ''}`;
}

export const LANGUAGES = [
	{
		value: 'pt',
		label: 'PT',
	},
	{
		value: 'en',
		label: 'EN',
	},
];

export const CURRENCIES = [
	{
		value: 'EUR',
		label: '€',
	},
	{
		value: 'USD',
		label: '$',
	},
	{
		value: 'GBP',
		label: '£',
	},
	{
		value: 'JPY',
		label: '¥',
	},
	{
		value: 'KRW',
		label: '₩',
	}
];

// Toast
const TOAST_CLOSETIME = 5000;

class Popup {
  success(message: String) {
    if (Toast.isActive(`success_${message}`)) {
      Toast.update(`success_${message}`, { autoClose: TOAST_CLOSETIME });
    } else {
      Toast.success(message, { toastId: `success_${message}` });
    }
  }

  error(message: String) {
    if (Toast.isActive(`error_${message}`)) {
      Toast.update(`error_${message}`, { autoClose: TOAST_CLOSETIME });
    } else {
      Toast.error(message, { toastId: `error_${message}` });
    }
  }
}

export const popup = new Popup();

export const toast = new Popup();
// End of toast