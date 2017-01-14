import { Meteor } from 'meteor/meteor';
import createAdminUser from './create-admin-user';

import '../../api/users/methods';
import '../../api/users/server/publications';

import '../../api/subjects/methods';
import '../../api/subjects/server/publications';

import '../../api/assessments/methods';
import '../../api/assessments/server/publications';

Meteor.startup(createAdminUser);
