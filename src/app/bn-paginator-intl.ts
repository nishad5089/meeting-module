import { MatPaginatorIntl } from '@angular/material';

const bnRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 এর​ ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${length} এর​ ${startIndex + 1} - ${endIndex}`;
};


export function getBnPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'প্রতি পৃষ্ঠায় উপাদান​:';
  paginatorIntl.nextPageLabel = 'পরবর্তী​ পৃষ্ঠা';
  paginatorIntl.previousPageLabel = 'পূর্ববর্তী পৃষ্ঠা';
  paginatorIntl.getRangeLabel = bnRangeLabel;

  return paginatorIntl;
}
