import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Expense } from '../../types';
import {
  Users,
  Plus,
  IndianRupee,
  Receipt,
  User,
  Trash2,
  PieChart,
} from 'lucide-react';
import { formatINR, formatCompactINR, formatFriendlyDate } from '../../utils/formatters';
import { ContributionChart } from '../charts/ContributionChart';

export const PeopleView: React.FC = () => {
  const {
    data,
    totalSpent,
    peopleSummaries,
    addPerson,
    deletePerson,
    setExpenseToEdit,
    setIsAddExpenseOpen,
  } = useWedding();

  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Dad');
  const [phone, setPhone] = useState('');
  const [color, setColor] = useState('#80142B');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addPerson({
      name: name.trim(),
      relation,
      phone: phone || undefined,
      avatarColor: color,
    });

    setName('');
    setPhone('');
    setIsAddingPerson(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner & Contribution Bar Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#80142B] dark:text-[#E2C799]" />
              <h3 className="text-base sm:text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                Family Contributions & Payers
              </h3>
            </div>
            <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
              Track who paid for what across Dad, Mom, Groom, Bride, and relatives
            </p>
          </div>

          <button
            onClick={() => setIsAddingPerson(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Family Member</span>
          </button>
        </div>

        {/* Visual Contribution Chart */}
        <div className="pt-2">
          <ContributionChart
            data={peopleSummaries}
            totalSpent={totalSpent}
            useCompact={data.settings.useCompactINR}
          />
        </div>
      </div>

      {/* Add Person Inline Form */}
      {isAddingPerson && (
        <form
          onSubmit={handleAdd}
          className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border-2 border-[#80142B]/20 dark:border-[#C5A059]/30 shadow-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Add New Family Member
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingPerson(false)}
              className="text-xs text-[#7D7067] hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Uncle, Chachi Ji"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Relation / Role
              </label>
              <input
                type="text"
                placeholder="e.g. Groom's Father, Bride's Brother"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Phone (Optional)
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-[#80142B] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#681023]"
              >
                Save Member
              </button>
            </div>
          </div>
        </form>
      )}

      {/* People Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {peopleSummaries.map(({ person, totalPaid, percentageOfTotal, expenses }) => (
          <div
            key={person.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-4"
          >
            {/* Member Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-xs"
                  style={{ backgroundColor: person.avatarColor || '#80142B' }}
                >
                  {person.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                    {person.name}
                  </h4>
                  <span className="text-xs text-[#7D7067] dark:text-[#A89F97]">
                    {person.relation}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-[#80142B] dark:text-[#E2C799] block">
                  {formatINR(totalPaid)}
                </span>
                <span className="text-[11px] font-semibold text-[#7D7067] dark:text-[#A89F97]">
                  {percentageOfTotal}% of total spend
                </span>
              </div>
            </div>

            {/* Expenses Paid by this Person */}
            <div className="space-y-1.5 pt-1 border-t border-[#EFE9DE] dark:border-[#26201B]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7D7067] dark:text-[#A89F97] block">
                Expenses Paid ({expenses.length})
              </span>

              {expenses.length === 0 ? (
                <p className="text-xs text-[#7D7067] dark:text-[#A89F97] italic py-1">
                  No payments made yet by {person.name}.
                </p>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {expenses.map((exp: Expense) => (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setExpenseToEdit(exp);
                        setIsAddExpenseOpen(true);
                      }}
                      className="p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#201C18] hover:bg-[#F4EFE6] dark:hover:bg-[#25201C] flex items-center justify-between text-xs cursor-pointer transition-colors"
                    >
                      <span className="font-semibold text-[#2C2523] dark:text-[#EAE5DF] truncate max-w-[200px]">
                        {exp.name}
                      </span>
                      <span className="font-bold text-[#80142B] dark:text-[#E2C799] whitespace-nowrap">
                        {formatINR(exp.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer action */}
            {data.people.length > 1 && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${person.name}"?`)) {
                      deletePerson(person.id);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-[#7D7067] hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
