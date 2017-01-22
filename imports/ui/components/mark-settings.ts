export interface MarkSetting {
	// TODO try to import SemanticCOLOR type (may be create issue)
	color: 'green' | 'olive' | 'yellow' | 'orange';
	icon: 'star' | 'smile' | 'meh' | 'frown';
	title: string;
}

const markSettings: {[key: string]: MarkSetting} = {
	exellent: {
		icon: 'star',
		color: 'green',
		title: 'Exellent'
	},
	good: {
		icon: 'smile',
		color: 'olive',
		title: 'Good'
	},
	normal: {
		icon: 'meh',
		color: 'yellow',
		title: 'Normal'
	},
	bad: {
		icon: 'frown',
		color: 'orange',
		title: 'Bad'
	}
};

export default markSettings;
