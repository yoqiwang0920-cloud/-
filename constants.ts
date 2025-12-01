import { Tag } from './types';

export const DEFAULT_TAGS: Tag[] = [
  { id: '1', name: '外景拍摄', color: 'bg-green-100 text-green-700' },
  { id: '2', name: '棚内拍摄', color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: '新生儿', color: 'bg-pink-100 text-pink-700' },
  { id: '4', name: '婚礼跟拍', color: 'bg-purple-100 text-purple-700' },
  { id: '5', name: '宠物摄影', color: 'bg-orange-100 text-orange-700' },
];

export const TAG_COLORS = [
  { label: '薄荷绿', value: 'bg-emerald-100 text-emerald-700' },
  { label: '天空蓝', value: 'bg-sky-100 text-sky-700' },
  { label: '蜜桃粉', value: 'bg-rose-100 text-rose-700' },
  { label: '香芋紫', value: 'bg-violet-100 text-violet-700' },
  { label: '橘猫黄', value: 'bg-orange-100 text-orange-700' },
  { label: '石墨灰', value: 'bg-gray-100 text-gray-700' },
];

export const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
