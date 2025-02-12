import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime())/ 1000);

    const intervals = [
      { label: 'سنة', seconds: 31536000 },
      { label: 'شهر', seconds: 2592000 },
      { label: 'أسبوع', seconds: 604800 },
      { label: 'يوم', seconds: 86400 },
      { label: 'ساع', seconds: 3600 },
      { label: 'دقيقة', seconds: 60 },
      { label: 'ثانية', seconds: 1 }
    ];

    for(const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `منذ ${count} ${interval.label}${count > 2 ? 'ات' : 'ة'}`;
      }
    }
    return 'الآن';
  }

}
