// Simple scoring for MVP: MIT completion (50%), habits (30%), reflections (20%)

export function computeDailyScore(day) {
  if (!day) return 0;

  const mitList = Array.isArray(day.mitList) ? day.mitList : [];
  const totalMits = mitList.length;
  const completedMits = mitList.filter((t) => t && t.done).length;
  const mitScore = totalMits > 0 ? completedMits / totalMits : 0;

  const habits = day.habits || {};
  const habitKeys = ['exercise', 'reading', 'planning'];
  const totalHabits = habitKeys.length;
  const completedHabits = habitKeys.reduce((acc, key) => acc + (habits[key] ? 1 : 0), 0);
  const habitScore = totalHabits > 0 ? completedHabits / totalHabits : 0;

  const reflections = day.reflections || {};
  const reflectParts = ['gratitude', 'victories', 'lessons'];
  const totalRef = reflectParts.length;
  const completedRef = reflectParts.reduce((acc, key) => acc + (reflections[key] && reflections[key].trim() ? 1 : 0), 0);
  const reflectionScore = totalRef > 0 ? completedRef / totalRef : 0;

  const weighted = 0.5 * mitScore + 0.3 * habitScore + 0.2 * reflectionScore;
  const percent = Math.round(weighted * 100);
  return Math.max(0, Math.min(100, percent));
}

