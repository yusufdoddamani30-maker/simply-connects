import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  MapPin,
  Users,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { MOCK_EVENTS } from '../data/mockData';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'workshop' | 'meetup' | 'deadline'>('all');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getEventsForDate = (date: Date) => {
    return MOCK_EVENTS.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type.toLowerCase().includes(filterType);
    return matchesSearch && matchesFilter;
  });

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(day)}
          className={cn(
            "aspect-square border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 cursor-pointer transition-all relative",
            isToday && "bg-emerald-500 text-white border-emerald-500",
            isSelected && !isToday && "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-500",
            !isToday && !isSelected && "hover:bg-zinc-50 dark:hover:bg-zinc-800"
          )}
        >
          <div className={cn("text-sm font-bold", isToday && "text-white")}>
            {day}
          </div>
          {events.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
              {events.slice(0, 3).map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-1.5 h-1 rounded-full",
                    isToday ? "bg-white" : "bg-emerald-500"
                  )}
                />
              ))}
            </div>
          )}
        </motion.div>
      );
    }
    
    return days;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-emerald-500" /> Calendar
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your schedule and upcoming events.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('month')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              viewMode === 'month' ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            )}
          >
            Month
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              viewMode === 'week' ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            )}
          >
            Week
          </button>
          <button 
            onClick={() => setViewMode('day')}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              viewMode === 'day' ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            )}
          >
            Day
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Events List */}
          <div className="mt-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Upcoming Events'}
            </h3>
            
            <div className="space-y-4">
              {(selectedDate ? getEventsForDate(selectedDate) : filteredEvents.slice(0, 5)).map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{event.title}</h4>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Event on {new Date(event.date).toLocaleDateString()}</p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Open to all
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-lg uppercase">
                      {event.type}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Add Event */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Quick Add Event</h3>
            <button className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Search Events</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              {['all', 'workshop', 'hackathon', 'seminar'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                    filterType === type
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Event Stats */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Total Events</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{MOCK_EVENTS.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Workshops</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {MOCK_EVENTS.filter(e => e.type === 'workshop').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Hackathons</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {MOCK_EVENTS.filter(e => e.type === 'hackathon').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
