import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  IndianRupee,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

const PRESET_COLORS = [
  '#80142B',
  '#C5A059',
  '#0D9488',
  '#4338CA',
  '#D97706',
  '#E11D48',
  '#059669',
  '#7C3AED',
  '#475569',
];

export const CategoriesView: React.FC = () => {
  const {
    data,
    categorySummaries,
    addCategory,
    updateCategory,
    deleteCategory,
    setActiveTab,
  } = useWedding();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBudget, setNewCatBudget] = useState<number | ''>(50000);
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[0]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBudget, setEditBudget] = useState<number>(0);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      budget: typeof newCatBudget === 'number' ? newCatBudget : 0,
      color: newCatColor,
      icon: 'Tag',
    });

    setNewCatName('');
    setNewCatBudget(50000);
    setIsAddingCategory(false);
  };

  const handleStartEdit = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditBudget(cat.budget);
  };

  const handleSaveEdit = (id: string) => {
    updateCategory(id, { name: editName, budget: Number(editBudget) });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#80142B] dark:text-[#E2C799]" />
            <h3 className="text-base sm:text-lg font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Wedding Expense Categories
            </h3>
          </div>
          <p className="text-xs text-[#7D7067] dark:text-[#A89F97]">
            Tailored categories for traditional and modern Indian weddings
          </p>
        </div>

        <button
          onClick={() => setIsAddingCategory(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#80142B] hover:bg-[#681023] text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Custom Category</span>
        </button>
      </div>

      {/* Add Category Form */}
      {isAddingCategory && (
        <form
          onSubmit={handleAddCategory}
          className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border-2 border-[#80142B]/20 dark:border-[#C5A059]/30 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
              Create New Wedding Category
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="text-xs text-[#7D7067] hover:underline"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Haldi Props, Pagdi, DJ & Sound"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Budget Allocation (₹)
              </label>
              <input
                type="number"
                min="0"
                value={newCatBudget}
                onChange={(e) => setNewCatBudget(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] dark:border-[#352F28] rounded-xl text-[#2C2523] dark:text-[#EAE5DF]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#7D7067] dark:text-[#A89F97] block mb-1">
                Badge Color
              </label>
              <div className="flex items-center gap-1.5 mt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCatColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      newCatColor === c ? 'scale-110 border-[#2C2523] dark:border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#80142B] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#681023]"
            >
              Save Category
            </button>
          </div>
        </form>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categorySummaries.map((catSummary) => {
          const { category, spent, remaining, percentageUsed, isOverBudget, expenseCount } = catSummary;
          const isEditing = editingId === category.id;

          return (
            <div
              key={category.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1613] border border-[#E8DFD1] dark:border-[#28221D] shadow-xs space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-2 py-1 text-xs font-bold bg-[#FAF8F5] dark:bg-[#221D19] border border-[#E0D7C7] rounded-md"
                    />
                  ) : (
                    <div>
                      <h4 className="text-sm font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                        {category.name}
                      </h4>
                      <span className="text-[11px] text-[#7D7067] dark:text-[#A89F97]">
                        {expenseCount} expenses
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {isEditing ? (
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-1 text-[#7D7067] hover:text-[#2C2523] rounded-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {data.categories.length > 1 && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete category "${category.name}"? ${
                              expenseCount > 0
                                ? `Warning: ${expenseCount} expenses are linked to this category.`
                                : ''
                            }`
                          )
                        ) {
                          deleteCategory(category.id);
                        }
                      }}
                      className="p-1 text-[#7D7067] hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="w-full bg-[#EFE9DF] dark:bg-[#25211D] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, percentageUsed)}%`,
                      backgroundColor: isOverBudget ? '#DC2626' : category.color,
                    }}
                  />
                </div>
              </div>

              {/* Financial Numbers */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EFE9DE] dark:border-[#25201C]">
                <div>
                  <span className="text-[10px] text-[#7D7067] dark:text-[#A89F97] block">
                    Spent
                  </span>
                  <span className="font-bold text-[#80142B] dark:text-[#E2C799]">
                    {formatINR(spent)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#7D7067] dark:text-[#A89F97] block">
                    Budget
                  </span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editBudget}
                      onChange={(e) => setEditBudget(Number(e.target.value))}
                      className="w-24 px-1 py-0.5 text-xs font-bold text-right bg-[#FAF8F5] border rounded-md"
                    />
                  ) : (
                    <span className="font-bold text-[#2C2523] dark:text-[#EAE5DF]">
                      {formatINR(category.budget)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
