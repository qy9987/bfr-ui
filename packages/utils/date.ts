import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import cn from 'dayjs/locale/zh-cn';
import { isBaseEmpty } from './is';
dayjs.locale(cn);
dayjs.extend(RelativeTime);
/**
 * @description 处理时间
 * @param {String} 可转为js时间格式的数据
 * @param {String} 格式类型，默认为YYYY-M-D HH:mm:ss
 */
export function formatter(datestr: dayjs.ConfigType, type = 'YYYY-MM-DD HH:mm:ss'): string {
  return  isBaseEmpty(datestr) ? '' : dayjs(datestr).format(type);
}
export function now(type = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(type);
}
// 获取date到现在的相对时间
export function relativeTime(todate: dayjs.ConfigType) {
  return dayjs(todate).fromNow();
}

/**
 * 比对两个时间之间的间隔
 * @param start 开始时间
 * @param end 结束时间，为空时为当前时间
 */
export function diffTime(start: dayjs.ConfigType, end: dayjs.ConfigType = new Date()) {
  return dayjs(end).diff(dayjs(start));
}
