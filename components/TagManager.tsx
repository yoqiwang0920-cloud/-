import React, { useState } from 'react';
import { Tag } from '../types';
import { TAG_COLORS } from '../constants';
import { Plus, Trash2, Tag as TagIcon } from 'lucide-react';

interface TagManagerProps {
  tags: Tag[];
  onAdd: (tag: Omit<Tag, 'id'>) => void;
  onDelete: (id: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ tags, onAdd, onDelete }) => {
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].value);

  const handleAdd = () => {
    if (newTagName.trim()) {
      onAdd({ name: newTagName, color: selectedColor });
      setNewTagName('');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TagIcon className="text-orange-400" />
        标签管理
      </h3>
      
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs text-gray-400 mb-1 ml-1">新标签名称</label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="例如：亲子写真"
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-100 focus:border-orange-300 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-xs text-gray-400 mb-1 ml-1">选择颜色</label>
          <div className="flex gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
            {TAG_COLORS.map((color) => (
              <button
                key={color.label}
                onClick={() => setSelectedColor(color.value)}
                className={`w-6 h-6 rounded-full ${color.value.split(' ')[0]} ${
                  selectedColor === color.value ? 'ring-2 ring-gray-400 ring-offset-2' : ''
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={!newTagName.trim()}
          className="bg-orange-500 text-white p-2.5 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-colors group">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${tag.color.split(' ')[0]}`} />
              <span className="font-medium text-gray-700">{tag.name}</span>
            </div>
            <button
              onClick={() => onDelete(tag.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagManager;
