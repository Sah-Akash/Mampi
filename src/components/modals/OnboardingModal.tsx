import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Sparkles, Calendar, IndianRupee, Users, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, data, updateWeddingInfo, updateWeddingBudget, addPerson, updateCategory, setActiveTab } = useWedding();

  const [step, setStep] = useState(1);
  const [weddingName, setWeddingName] = useState(data.name || "Akash & Priya's Wedding");
  const [coupleNames, setCoupleNames] = useState(data.coupleNames || "Akash & Priya");
  const [weddingDate, setWeddingDate] = useState(data.date || '2026-12-14');
  const [city, setCity] = useState(data.city || 'Jaipur / Delhi NCR');
  const [budget, setBudget] = useState(data.totalBudget || 1200000);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRelation, setNewPersonRelation] = useState('Family');

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    updateWeddingInfo(weddingName, coupleNames, weddingDate, city);
    updateWeddingBudget(Number(budget));
    setIsOnboardingOpen(false);
    setActiveTab('dashboard');
  };

  const handleAddQuickPerson = () => {
    if (!newPersonName.trim()) return;
    addPerson({
      name: newPersonName.trim(),
      relation: newPersonRelation,
      avatarColor: '#80142B',
    });
    setNewPersonName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] dark:bg-[#181512] rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#2E2823] w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-[#F4EFE6] dark:bg-[#201C18] border-b border-[#E8DFD1] dark:border-[#2E2823]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#80142B] text-white flex items-center justify-center text-sm font-bold">
                {step}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97]">
                Step {step} of 6 • Wedding Setup Wizard
              </span>
            </div>
            <span className="text-xs font-semibold text-[#80142B] dark:text-[#E2C799]">
              {Math.round((step / 6) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-[#E0D7C7] dark:bg-[#2D2620] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#80142B] dark:bg-[#C5A059] h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    Name Your Shubh Vivah
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    The couple and title of the celebration
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97]">
                    Project / Wedding Title
                  </label>
                  <input
                    type="text"
                    value={weddingName}
                    onChange={(e) => setWeddingName(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-sm font-semibold"
                    placeholder="Akash & Priya's Wedding"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97]">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-sm font-semibold"
                    placeholder="Akash & Priya"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97]">
                    Wedding City / Destination
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-sm font-semibold"
                    placeholder="Jaipur, Rajasthan / Delhi NCR"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    When is the Big Day?
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    Sets countdowns and upcoming payment timelines
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase text-[#7D7067] dark:text-[#A89F97]">
                  Main Wedding Date
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-sm font-semibold"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    Total Wedding Budget
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    How much has the family decided to allocate in total?
                  </p>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#80142B] dark:text-[#C5A059]">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10000"
                    step="10000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 text-2xl font-bold bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {[800000, 1000000, 1200000, 1500000, 2000000, 2500000].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        budget === b
                          ? 'bg-[#80142B] text-white border-[#80142B]'
                          : 'bg-white dark:bg-[#221D19] text-[#554A43] dark:text-[#CCC] border-[#E0D7C7] dark:border-[#352F28]'
                      }`}
                    >
                      {formatINR(b)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    Currency & Number Formatting
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    Tailored for Indian numbering systems (Lakhs & Crores)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#221D19] rounded-2xl border border-[#E0D7C7] dark:border-[#352F28] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF] block">
                      Indian Rupee (INR ₹)
                    </span>
                    <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                      Default standard with Lakhs (₹12,00,000) and Crores
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    Family Members Who Pay
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    Add who will be contributing or paying vendors
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Chachi Ji, Sister, Mama Ji"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
                />
                <select
                  value={newPersonRelation}
                  onChange={(e) => setNewPersonRelation(e.target.value)}
                  className="px-2 py-2 text-xs bg-white dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl"
                >
                  <option value="Family">Family</option>
                  <option value="Bride Side">Bride Side</option>
                  <option value="Groom Side">Groom Side</option>
                  <option value="Relative">Relative</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddQuickPerson}
                  className="px-3 py-2 bg-[#80142B] text-white text-xs font-bold rounded-xl"
                >
                  Add
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {data.people.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-lg bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620] flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                      {p.name}
                    </span>
                    <span className="text-[#7D7067] dark:text-[#A89F97]">{p.relation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#80142B]/10 dark:bg-[#E2C799]/10 text-[#80142B] dark:text-[#E2C799] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    Review Category Budgets
                  </h3>
                  <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    You can adjust any category budget now or anytime later
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {data.categories.slice(0, 6).map((cat) => (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-[#221D19] border border-[#E8DFD1] dark:border-[#2D2620] flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-[#2C2523] dark:text-[#EAE5DF]">
                      {cat.name}
                    </span>
                    <input
                      type="number"
                      value={cat.budget}
                      onChange={(e) => updateCategory(cat.id, { budget: Number(e.target.value) })}
                      className="w-28 text-right px-2 py-1 text-xs font-bold bg-[#FAF8F5] dark:bg-[#181512] border border-[#E0D7C7] dark:border-[#352F28] rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-[#F4EFE6] dark:bg-[#201C18] border-t border-[#E8DFD1] dark:border-[#2E2823] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#7D7067] hover:bg-[#EAE3D5] dark:hover:bg-[#2D2620] rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <button
              onClick={() => setIsOnboardingOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-[#7D7067] hover:underline"
            >
              Skip Setup
            </button>
          )}

          {step < 6 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold bg-[#80142B] hover:bg-[#681023] text-white rounded-xl shadow-md transition-all"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold bg-[#80142B] hover:bg-[#681023] text-white rounded-xl shadow-md transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
