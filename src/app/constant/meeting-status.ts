export const meeting_status: Map<string, {label: string, tag: string, color: string, stateNumber: number, stateLabel: string, state: string}> =
  new Map<string, {label: string, tag: string, color: string, stateNumber: number, stateLabel: string, state: string}>([
  ['MEETING_CREATED', {label: 'তৈরি হ​য়েছে', tag: 'meeting_created', color: 'badge badge-secondary', stateNumber: 1, stateLabel: 'মিটিং তৈরি হ​য়েছে', state: 'done'}],
  ['NOTICE_SENT_FOR_APPROVAL', {label: 'নোটিশ অনুমোদনের অপেক্ষায়', tag: 'notice_sent_for_approval', color: 'badge badge-warning', stateNumber: 2, stateLabel: 'নোটিশ অনুমোদনের অপেক্ষায়', state: 'done'}],
  ['NOTICE_APPROVED', {label: 'নোটিশ অনুমোদিত', tag: 'notice_approved', color: 'badge badge-success', stateNumber: 3, stateLabel: 'নোটিশ অনুমোদিত', state: 'done'}],
  ['NOTICE_SENT_FOR_CORRECTION', {label: 'নোটিশ সংশোধনের অপেক্ষায়', tag: 'notice_sent_for_correction', color: 'badge badge-danger', stateNumber: 3, stateLabel: 'নোটিশ অনুমোদিত', state: 'error'}],
  ['NOTICE_CIRCULATED', {label: 'নোটিশ প্রচারিত', tag: 'notice_circulated', color: 'badge badge-primary', stateNumber: 4, stateLabel: 'নোটিশ প্রচারিত', state: 'done'}],
  ['MEETING_CONDUCTED', {label: 'অনুষ্ঠিত', tag: 'meeting_conducted', color: 'badge badge-info', stateNumber: 5, stateLabel: 'মিটিং অনুষ্ঠিত', state: 'done'}],
  ['RESOLUTION_SENT_FOR_APPROVAL', {label: 'কার্যবিবরণী অনুমোদনের অপেক্ষায়', tag: 'resolution_sent_for_approval', color: 'badge badge-warning', stateNumber: 6, stateLabel: 'কার্যবিবরণী অনুমোদনের অপেক্ষায়', state: 'done'}],
  ['RESOLUTION_APPROVED', {label: 'কার্যবিবরণী অনুমোদিত', tag: 'resolution_approved', color: 'badge badge-success', stateNumber: 7, stateLabel: 'কার্যবিবরণী অনুমোদিত', state: 'done'}],
  ['RESOLUTION_SENT_FOR_CORRECTION', {label: 'কার্যবিবরণী সংশোধনের অপেক্ষায়', tag: 'resolution_sent_for_correction', color: 'badge badge-danger', stateNumber: 7, stateLabel: 'কার্যবিবরণী অনুমোদিত', state: 'error'}],
  ['RESOLUTION_CIRCULATED', {label: 'কার্যবিবরণী প্রচারিত', tag: 'resolution_circulated', color: 'badge badge-primary', stateNumber: 8, stateLabel: 'কার্যবিবরণী প্রচারিত', state: 'done'}],
  ['MEETING_CANCELLED', {label: 'বাতিল', tag: 'meeting_cancelled', color: 'badge badge-light', stateNumber: 0, stateLabel: 'মিটিং বাতিল হ​য়েছে', state: 'done'}],
  ['MEETING_RESCHEDULE', {label: 'সময়সূচী পুনর্নির্ধারিত', tag: 'meeting_reschedule', color: 'badge badge-secondary', stateNumber: -1, stateLabel: '', state: 'done'}]
]);
