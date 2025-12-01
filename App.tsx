import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Bell, Menu, Calendar as CalendarIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Session, Tag, ViewMode } from './types';
import { WEEKDAYS } from './constants';
import { saveSessions, getSessions, saveTags, getTags } from './services/storage';
import { CatPawIcon, CatFaceIcon } from './components/CatIcons';
import SessionForm from './components/SessionForm';
import TagManager from './components/TagManager';

const App: React.FC = () => {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Reference date for the view
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined); // Track clicked date
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showNotification, setShowNotification] = useState<Session[]>([]);

  // Load Data
  useEffect(() => {
    setSessions(getSessions());
    setTags(getTags());
  }, []);

  // Save Data effects
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveTags(tags);
  }, [tags]);

  // Check for tomorrow's sessions for notification
  useEffect(() => {
    const checkReminders = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const upcoming = sessions.filter(s => s.date === tomorrowStr);
      
      if (upcoming.length > 0) {
        setShowNotification(upcoming);
        // Request browser permission if not granted
        if (Notification.permission === "granted") {
           new Notification("喵喵提醒 🐱", {
             body: `明天有 ${upcoming.length} 个拍摄档期，请做好准备！`,
             icon: "https://cdn-icons-png.flaticon.com/512/616/616430.png"
           });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    };
    
    // Check immediately on load if we have sessions
    if (sessions.length > 0) {
        checkReminders();
    }
  }, [sessions]);

  // Calendar Logic (3 Weeks)
  const startOfView = useMemo(() => {
    const d = new Date(currentDate);
    // Align to the most recent Sunday (or today if Sunday)
    const day = d.getDay(); 
    const diff = d.getDate() - day; 
    return new Date(d.setDate(diff));
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const days = [];
    // Generate 21 days (3 weeks)
    for (let i = 0; i < 21; i++) {
      const d = new Date(startOfView);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [startOfView]);

  // Determine header date: Use the Saturday of the first week (index 6)
  // to satisfy "If the first week has arrived in Month X, show Month X"
  const headerDate = calendarDays[6] || startOfView;

  const changeWeeks = (delta: number) => {
    const newDate = new Date(currentDate);
    // Jump 3 weeks (21 days)
    newDate.setDate(newDate.getDate() + (delta * 21));
    setCurrentDate(newDate);
  };

  const handleSaveSession = (sessionData: Session | Omit<Session, 'id'>) => {
    if ('id' in sessionData) {
      // Update existing
      setSessions(prev => prev.map(s => s.id === sessionData.id ? sessionData as Session : s));
    } else {
      // Create new
      const newSession: Session = { ...sessionData, id: uuidv4() };
      setSessions(prev => [...prev, newSession]);
    }
    setIsFormOpen(false);
    setEditingSession(null);
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setIsFormOpen(false);
    setEditingSession(null);
  };

  const openAddModal = (dateStr?: string) => {
    setEditingSession(null);
    setSelectedDate(dateStr || new Date().toISOString().split('T')[0]);
    setIsFormOpen(true);
  };

  const openEditModal = (session: Session) => {
    setEditingSession(session);
    setIsFormOpen(true);
  };

  const handleAddTag = (tagData: Omit<Tag, 'id'>) => {
    const newTag = { ...tagData, id: uuidv4() };
    setTags(prev => [...prev, newTag]);
  };

  const handleDeleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const getTagById = (id: string) => tags.find(t => t.id === id);

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-[1800px] mx-auto p-4 md:p-8 gap-8 relative bg-orange-50 font-sans">
      
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center mb-4 border-b-2 border-gray-800 pb-2">
        <div className="font-bold text-2xl text-gray-800 flex items-center gap-3">
            <CatFaceIcon className="w-8 h-8" />
            <span>三脚猫拍摄档期</span>
        </div>
        <button onClick={() => setViewMode(viewMode === 'calendar' ? 'tags' : 'calendar')} className="p-2 border-2 border-gray-800 rounded-lg active:bg-gray-100">
            <Menu className="text-gray-800 w-6 h-6" />
        </button>
      </div>

      {/* Reminder Banner */}
      {showNotification.length > 0 && (
        <div className="fixed top-6 right-6 z-50 bg-white border-2 border-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] rounded-lg p-4 flex items-start gap-4 max-w-sm">
          <div className="bg-orange-100 p-2 rounded-full shrink-0 border border-gray-800">
            <Bell className="w-5 h-5 text-gray-800" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">明天有拍摄任务！</h4>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">您有 {showNotification.length} 个档期需要准备。</p>
            <button 
              onClick={() => setShowNotification([])}
              className="text-xs text-gray-800 font-bold mt-2 hover:underline"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`md:w-64 flex flex-col gap-8 shrink-0 ${viewMode !== 'tags' && 'hidden md:flex'}`}>
        <div className="hidden md:flex items-center gap-3 py-2 border-b-2 border-transparent">
          <CatFaceIcon className="w-10 h-10 text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">三脚猫<br/>拍摄档期</h1>
        </div>

        <button 
          onClick={() => openAddModal()}
          className="bg-gray-800 text-white p-4 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all border-2 border-gray-800"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold text-lg">新增拍摄档期</span>
        </button>

        <div className="hidden md:block">
            <TagManager tags={tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />
        </div>
        
        {/* Mobile Tag View */}
        <div className="md:hidden block">
            {viewMode === 'tags' && <TagManager tags={tags} onAdd={handleAddTag} onDelete={handleDeleteTag} />}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full ${viewMode === 'tags' && 'hidden md:flex'}`}>
        
        {/* Calendar Container - "Paper" Look */}
        <div className="flex-1 flex flex-col">
          
          {/* Header Area */}
          <div className="flex justify-between items-end mb-4 px-1">
             <div className="flex flex-col">
                <span className="text-gray-500 font-bold text-sm">CURRENT VIEW</span>
                <h2 className="text-4xl font-black text-gray-800 flex items-baseline gap-2">
                  {headerDate.getFullYear()}年
                  <span className="text-orange-600">{headerDate.getMonth() + 1}月</span>
                </h2>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={() => changeWeeks(-1)} className="p-2 border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button onClick={() => changeWeeks(1)} className="p-2 border-2 border-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
             </div>
          </div>

          {/* Grid Container */}
          <div className="bg-white border-2 border-gray-800 rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b-2 border-gray-800 bg-gray-50">
              {WEEKDAYS.map((day, i) => (
                <div key={day} className={`text-center font-bold py-3 text-lg border-r border-gray-800 last:border-r-0 ${i === 0 || i === 6 ? 'text-orange-600' : 'text-gray-800'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isToday = dateStr === new Date().toISOString().split('T')[0];
                const daySessions = sessions.filter(s => s.date === dateStr);
                
                // Determine borders: Right border for all except last column (index % 7 === 6)
                const isLastCol = (index + 1) % 7 === 0;
                // Bottom border for all except last row. Since we show 21 days, indices 14-20 are last row.
                const isLastRow = index >= 14;

                return (
                  <div
                    key={dateStr}
                    onClick={() => openAddModal(dateStr)}
                    className={`
                      relative flex flex-col min-h-[12rem] p-2 transition-colors cursor-pointer group
                      border-b-2 border-gray-800 ${!isLastCol ? 'border-r-2 border-gray-800' : ''}
                      ${isToday ? 'bg-orange-50' : 'bg-white hover:bg-gray-50'}
                      ${isLastRow ? 'border-b-0' : ''}
                    `}
                  >
                    {/* Date Number */}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xl font-bold font-mono ${isToday ? 'text-orange-600 underline decoration-4 underline-offset-4' : 'text-gray-400'}`}>
                          {date.getDate()}
                      </span>
                      {daySessions.length === 0 && (
                          <Plus className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    
                    {/* Content: List Items */}
                    <div className="flex flex-col gap-2">
                      {daySessions.map(session => {
                          const firstTag = getTagById(session.tags[0]);
                          const tagColorClass = firstTag ? firstTag.color : 'bg-gray-200 text-gray-800';
                          // Parse color safely
                          const colorParts = tagColorClass.split('-');
                          const colorName = colorParts.length > 1 ? colorParts[1] : 'gray';
                          const dotColor = `bg-${colorName}-400`;

                          return (
                            <div 
                              key={session.id} 
                              onClick={(e) => { e.stopPropagation(); openEditModal(session); }}
                              className="flex items-start gap-2 group/item"
                            >
                               {/* Bullet Point */}
                               <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColor} border border-gray-800`}></div>
                               
                               {/* Text Content */}
                               <div className="text-sm font-bold text-gray-700 leading-tight group-hover/item:text-orange-600 transition-colors line-clamp-3 break-words">
                                  {session.notes || "无备注"}
                               </div>
                            </div>
                          );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] cat-scroll animate-in fade-in zoom-in duration-200">
            <SessionForm 
              existingTags={tags} 
              initialDate={editingSession?.date || selectedDate}
              initialData={editingSession}
              onSave={handleSaveSession}
              onDelete={deleteSession}
              onCancel={() => { setIsFormOpen(false); setEditingSession(null); }}
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default App;