import {END_POINT_SEARCH} from '../app/meeting/core/master.service';
import {RolesService} from './meeting/master-settings/acl/roles/service/roles.service';
import {PermissionService} from './meeting/master-settings/acl/permission/service/permission.service';
import {ActionService} from './meeting/master-settings/acl/action/service/action.service';
import {MeetingStatusService} from './meeting/master-settings/acl/meeting-status/service/meeting-status.service';
import {UserRolesService} from './meeting/master-settings/acl/user-roles/service/user-roles.service';
import {master_settings_paths} from './constant/service-path.properties';

interface NavAttributes {
  [propName: string]: any;
}

interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}

interface NavBadge {
  text: string;
  variant: string;
}

interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

const PATH_MASTER_SETTINGS = '/settings';
export const navItems: Array<NavData> = [
  {
    name: 'ড্যাশবোর্ড​',
    icon: 'icon-speedometer',
    children: [
      {
        name: 'পঞ্জিকা',
        url: '/meetings/calendar',
        icon: 'icon-calendar',
      },
      {
        name: 'তালিকা',
        url: '/meetings/list',
        icon: 'icon-list'
      }
    ]
  },
  {
    name: 'করণীয়​',
    url: '/meetings/todos/0',
    icon: 'icon-check',
  },
  {
    name: 'অতিথি',
    url: '/meetings/guests',
    icon: 'icon-user',
    children: [
      {
        name: ' তালিকা ',
        url: '/meetings/guests/' + END_POINT_SEARCH,
        icon: 'icon-list'
      },
      {
        name: ' সেটিংস​ ',
        url: '/meetings/guests/settings/' + END_POINT_SEARCH,
        icon: 'icon-settings'
      }
    ]
  },
  {
    name: 'গ্রুপ',
    url: '/meetings/groups/' + END_POINT_SEARCH,
    icon: 'icon-people',
  },
  {
    name: 'রিপোর্ট',
    url: '/meetings/reports',
    icon: 'icon-envelope-letter',
  },
  {
    name: 'এক্সটারনাল মিটিং',
    url: '/meetings/external-meetings/' + END_POINT_SEARCH,
    icon: 'icon-calendar',
  },
  {
    name: 'মাস্টার সেটিংস',
    icon: 'icon-settings',
    url: '/meetings' + PATH_MASTER_SETTINGS,
    children: [
      {
        name: 'ভবন​',
        url: '/meetings' + PATH_MASTER_SETTINGS + master_settings_paths.BUILDINGS + '/' + END_POINT_SEARCH,
        icon: 'icon-map'
      },
      {
        name: 'কক্ষ​',
        url: '/meetings' + PATH_MASTER_SETTINGS + master_settings_paths.ROOMS + '/' + END_POINT_SEARCH,
        icon: 'icon-location-pin'
      },
      {
        name: 'পুনরাবৃত্তি',
        url: '/meetings' + PATH_MASTER_SETTINGS + master_settings_paths.FREQUENCIES + '/' + END_POINT_SEARCH,
        icon: 'icon-location-pin'
      },
      {
        name: 'ধরন​',
        url: '/meetings' + PATH_MASTER_SETTINGS + master_settings_paths.TYPES + '/' + END_POINT_SEARCH,
        icon: 'icon-location-pin'
      },
      {
        name: 'টেমপ্লেট',
        url: '/meetings' + PATH_MASTER_SETTINGS + master_settings_paths.TEMPLATES + '/' + END_POINT_SEARCH,
        icon: 'icon-location-pin'
      },
      {
        name: 'এ সি এল',
        icon: 'icon-settings',
        url: '/meetings' + PATH_MASTER_SETTINGS + '/acl',
        children: [
          {
            name: 'ইউজার-রোল',
            url: '/meetings' + PATH_MASTER_SETTINGS + UserRolesService.PATH + '/' + END_POINT_SEARCH,
            icon: 'icon-location-pin'
          },
          {
            name: 'অনুমতি',
            url: '/meetings' + PATH_MASTER_SETTINGS + PermissionService.PATH + '/' + END_POINT_SEARCH,
            icon: 'icon-location-pin'
          },
          {
            name: 'রোল',
            url: '/meetings' + PATH_MASTER_SETTINGS + RolesService.PATH + '/' + END_POINT_SEARCH,
            icon: 'icon-location-pin'
          },
          {
            name: 'অ্যাকশন ট্যাগ',
            url: '/meetings' + PATH_MASTER_SETTINGS + ActionService.PATH + '/' + END_POINT_SEARCH,
            icon: 'icon-location-pin'
          },
          {
            name: 'মিটিং অবস্থা',
            url: '/meetings' + PATH_MASTER_SETTINGS + MeetingStatusService.PATH + '/' + END_POINT_SEARCH,
            icon: 'icon-location-pin'
          }
        ]
      }
    ]
  }
];
