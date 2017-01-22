import { Meteor } from 'meteor/meteor';
import createAdminUser from './create-admin-user';

import '../../api/users/methods';
import '../../api/users/publications';

import '../../api/subjects/methods';
import '../../api/subjects/publications';

import '../../api/assessments/methods';
import '../../api/assessments/publications';

Meteor.startup(createAdminUser);
