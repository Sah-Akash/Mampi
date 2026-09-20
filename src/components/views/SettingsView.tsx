import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Settings,
  Calendar,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  Check,
  Plus,
  SlidersHorizontal,
  Moon,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const SettingsView: React.FC = () => {
  const {
    data,
    updateWeddingInfo,
    updateWeddingBudget,
    toggleCompactINR,
    toggleTheme,
    resetToDemoData,
    clearAllData,
    addEvent,
    exportDataBackup,
    importDataBackup,
  } = useWedding();

  const [weddingName, setWeddingName] = useState(data.name);
  const [coupleNames, setCoupleNames] = useState(data.coupleNames);
  const [weddingDate, setWeddingDate] = useState(data.date);
  const [city, setCity] = useState(data.city || 'Jaipur / Delhi NCR');
  const [budget, setBudget] = useState(data.totalBudget);

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // New event inline
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState(data.date);
  const [newEventBudget, setNewEventBudget] = useState<number>(200000);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeddingInfo(weddingName, coupleNames, weddingDate, city);
    updateWeddingBudget(Number(budget));
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    addEvent({
      name: newEventName.trim(),
      date: newEventDate,
      allocatedBudget: Number(newEventBudget),
      budget: Number(newEventBudget),
    });

    setNewEventName('');
    setIsAddingEvent(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataBackup(content);
      if (success) {
        alert('Wedding data backup successfully restored!');
      } else {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 max-w-4xl">
      {/* Wedding Profile Info Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Wedding Details & Master Plan
            </h3>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              Configure couple names, city, and total allocated budget
            </p>
          </div>

          {isSavedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              Changes Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveInfo} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Project / Wedding Title
              </label>
              <input
                type="text"
                required
                value={weddingName}
                onChange={(e) => setWeddingName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Couple Names
              </label>
              <input
                type="text"
                required
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Main Wedding Date
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                City / Destination
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Master Wedding Budget (₹)
              </label>
              <input
                type="number"
                required
                min="10000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-base font-bold bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#80142B] dark:text-[#E2C799]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Save Wedding Settings
            </button>
          </div>
        </form>
      </div>

      {/* Multi-Event Configuration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Wedding Functions & Events
            </h3>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              Multi-event tracking (Sangeet, Haldi, Wedding, Reception)
            </p>
          </div>

          <button
            onClick={() => setIsAddingEvent(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#FAF8F5] dark:bg-[#221D19] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352F28] rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>+ Add Function</span>
          </button>
        </div>

        {/* Add Event Form */}
        {isAddingEvent && (
          <form
            onSubmit={handleAddEvent}
            className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E0D7C7] dark:border-[#352F28] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#80142B] dark:text-[#E2C799]">
                Add Celebration Function
              </span>
              <button
                type="button"
                onClick={() => setIsAddingEvent(false)}
                className="text-xs text-[#7D7067] hover:underline"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Function Name (e.g. Haldi, Cocktail)"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
              />
              <input
                type="date"
                required
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="px-3 py-2 text-xs bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
              />
              <input
                type="number"
                placeholder="Allocated Budget (₹)"
                value={newEventBudget}
                onChange={(e) => setNewEventBudget(Number(e.target.value))}
                className="px-3 py-2 text-xs font-bold bg-white dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#80142B] text-white text-xs font-bold rounded-xl"
              >
                Save Function
              </button>
            </div>
          </form>
        )}

        {/* Existing Events List */}
        <div className="space-y-2">
          {data.events.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#28221D] flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] block">
                  {ev.name}
                </span>
                <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                  Date: {ev.date}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-[#80142B] dark:text-[#E2C799]">
                {formatINR(ev.allocatedBudget || ev.budget || 0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences & Number Formats */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
          Display Preferences
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#28221D]">
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] block">
                Number Display Format
              </span>
              <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Toggle between exact (₹7,42,500) and compact (₹7.42L)
              </span>
            </div>
            <button
              onClick={toggleCompactINR}
              className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-[#28221D] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
            >
              {data.settings.useCompactINR ? 'Using: ₹ Lakhs (Compact)' : 'Using: Exact ₹'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#201C18] border border-[#E8DFD1] dark:border-[#28221D]">
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] block">
                Interface Theme
              </span>
              <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                Light (Warm Ivory & Royal Maroon) or Dark Mode
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3.5 py-1.5 text-xs font-bold bg-white dark:bg-[#28221D] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl flex items-center gap-1.5"
            >
              {data.settings.theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#C5A059]" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{data.settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backup, Restore & Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Data Backup & Safety
            </h3>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              All data is stored securely and privately in your browser's local storage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={exportDataBackup}
            className="flex items-center justify-center gap-2 p-3 bg-[#FAF8F5] dark:bg-[#221D19] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352F28] rounded-2xl text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-[#C5A059]" />
            <span>Download Backup File (JSON)</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 bg-[#FAF8F5] dark:bg-[#221D19] hover:bg-[#EAE3D5] text-[#2C2523] dark:text-[#EAE5DF] border border-[#E4DAC9] dark:border-[#352F28] rounded-2xl text-xs font-bold transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#80142B] dark:text-[#E2C799]" />
            <span>Restore Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-[#EFE9DE] dark:border-[#28221D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => {
              if (window.confirm('Reset all expenses, vendors, and budget to demo sample data?')) {
                resetToDemoData();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#7D7067] hover:text-[#80142B] dark:hover:text-[#E2C799] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Pre-filled Demo Data</span>
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete ALL wedding data and start with an empty sheet?'
                )
              ) {
                clearAllData();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Data & Start Fresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};
