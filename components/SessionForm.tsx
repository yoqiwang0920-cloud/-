import React, { useState, useEffect } from 'react';
import { Tag, Session } from '../types';
import { X, Calendar as CalIcon, Save, FileText, Trash2 } from 'lucide-react';
import { CatPawIcon } from './CatIcons';

interface SessionFormProps {
  existingTags: Tag[];
  initialDate?: string;
  initialData?: Session | null;
  onSave: (session: Session | Omit<Session, 'id'>) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ 
  existingTags, 
  initialDate, 
  initialData, 
  onSave, 
  onDelete, 
  onCancel 
}) => {
  const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setNotes(initialData.notes || '');
      setSelectedTags(initialData.tags);
    } else if (initialDate) {
      setDate(initialDate);
    }
  }, [initialData, initialDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate title from tags
    const tagNames = selectedTags
      .map(id => existingTags.find(t => t.id === id)?.name)
      .filter(Boolean);
      
    const generatedTitle = tagNames.length > 0 ? tagNames.join(' + ') : '拍摄档期';
    const generatedClient = '客户'; 

    const sessionData = {
      title: generatedTitle,
      clientName: generatedClient,
      date,
      time: '00:00',
      tags: selectedTags,
      notes
    };

    if (initialData) {
      onSave({ ...sessionData, id: initialData.id });
    } else {
      onSave(sessionData);
    }
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      onDelete(initialData.id);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-100 relative overflow-hidden">
      {/* Decorative Ear */}
      <div className="absolute -top-6 -left-6 w-20 h-20 bg-orange-100 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-50 rounded-full pointer-events-none" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
          <CatPawIcon className="w-6 h-6 text-orange-500" />
          {initialData ? '编辑拍摄档期' : '新增拍摄档期'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-orange-50 rounded-full text-orange-400 hover:text-orange-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-orange-800 uppercase mb-3 ml-1">1. 选择拍摄类型 (标签)</label>
          <div className="flex flex-wrap gap-3 bg-orange-50 p-4 rounded-2xl border border-orange-100">
            {existingTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all transform hover:scale-105 flex items-center gap-2 ${
                  selectedTags.includes(tag.id)
                    ? tag.color + ' ring-2 ring-offset-2 ring-orange-200 shadow-md scale-105'
                    : 'bg-white text-gray-500 hover:bg-white shadow-sm border border-gray-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${tag.color.split(' ')[0].replace('bg-', 'bg-')}`} />
                {tag.name}
              </button>
            ))}
            {existingTags.length === 0 && (
              <p className="text-gray-400 text-sm">暂无标签，请在侧边栏添加</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">日期</label>
          <div className="relative">
            <CalIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-300 focus:outline-none transition-colors bg-gray-50/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-orange-800 uppercase mb-2 ml-1">2. 拍摄备注</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-orange-300 focus:outline-none transition-colors resize-none bg-gray-50/50"
              placeholder="请输入具体的拍摄内容、客户需求或注意事项..."
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-50 text-red-500 font-bold py-4 px-6 rounded-2xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2 shadow-sm border border-red-100"
            >
              <Trash2 className="w-5 h-5" />
              删除
            </button>
          )}
          <button
            type="submit"
            className="flex-[2] bg-orange-500 text-white font-bold py-4 px-6 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-200 flex justify-center items-center gap-2 group"
          >
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {initialData ? '保存修改' : '保存喵喵档期'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;