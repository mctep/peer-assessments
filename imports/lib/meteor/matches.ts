import { check, Match } from 'meteor/check';

export const NotEmptyStringMatch: Function = Match.Where((val: string): boolean => {
	check(val, String);
	return val.length > 0;
});
