import { BudgetEntry, BudgetEntryType, BudgetGoals } from "@/lib/calculators/householdBudget";

export interface RecurringTemplate {
  id: string;
  label: string;
  type: BudgetEntryType;
  category: string;
  amount: number;
  memo: string;
}

const ENTRIES_KEY = "calcmoa:household-budget:v1";
const GOALS_KEY = "calcmoa:household-budget-goals:v1";
const TEMPLATES_KEY = "calcmoa:household-budget-templates:v1";

const EMPTY_ENTRIES: BudgetEntry[] = [];
const EMPTY_GOALS: BudgetGoals = {};
const EMPTY_TEMPLATES: RecurringTemplate[] = [];

let entries: BudgetEntry[] = EMPTY_ENTRIES;
let goals: BudgetGoals = EMPTY_GOALS;
let templates: RecurringTemplate[] = EMPTY_TEMPLATES;
let hydrated = false;
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (typeof window === "undefined" || hydrated) return;
  hydrated = true;
  try {
    const rawEntries = window.localStorage.getItem(ENTRIES_KEY);
    if (rawEntries) entries = JSON.parse(rawEntries);
  } catch {
    entries = EMPTY_ENTRIES;
  }
  try {
    const rawGoals = window.localStorage.getItem(GOALS_KEY);
    if (rawGoals) goals = JSON.parse(rawGoals);
  } catch {
    goals = EMPTY_GOALS;
  }
  try {
    const rawTemplates = window.localStorage.getItem(TEMPLATES_KEY);
    if (rawTemplates) templates = JSON.parse(rawTemplates);
  } catch {
    templates = EMPTY_TEMPLATES;
  }
}

function persistEntries() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch {
    // 저장 공간이 부족하거나 접근이 제한된 경우 무시
  }
}

function persistGoals() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    // 저장 공간이 부족하거나 접근이 제한된 경우 무시
  }
}

function persistTemplates() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch {
    // 저장 공간이 부족하거나 접근이 제한된 경우 무시
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void): () => void {
  loadFromStorage();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getEntriesSnapshot(): BudgetEntry[] {
  loadFromStorage();
  return entries;
}

export function getGoalsSnapshot(): BudgetGoals {
  loadFromStorage();
  return goals;
}

export function getTemplatesSnapshot(): RecurringTemplate[] {
  loadFromStorage();
  return templates;
}

export function getServerEntriesSnapshot(): BudgetEntry[] {
  return EMPTY_ENTRIES;
}

export function getServerGoalsSnapshot(): BudgetGoals {
  return EMPTY_GOALS;
}

export function getServerTemplatesSnapshot(): RecurringTemplate[] {
  return EMPTY_TEMPLATES;
}

export function addBudgetEntry(entry: BudgetEntry): void {
  entries = [...entries, entry];
  persistEntries();
  emit();
}

export function addBudgetEntries(newEntries: BudgetEntry[]): void {
  if (newEntries.length === 0) return;
  entries = [...entries, ...newEntries];
  persistEntries();
  emit();
}

export function removeBudgetEntry(id: string): void {
  entries = entries.filter((entry) => entry.id !== id);
  persistEntries();
  emit();
}

export function setBudgetGoal(category: string, limit: number): void {
  goals = { ...goals, [category]: limit };
  persistGoals();
  emit();
}

export function removeBudgetGoal(category: string): void {
  const next = { ...goals };
  delete next[category];
  goals = next;
  persistGoals();
  emit();
}

export function addTemplate(template: RecurringTemplate): void {
  templates = [...templates, template];
  persistTemplates();
  emit();
}

export function removeTemplate(id: string): void {
  templates = templates.filter((template) => template.id !== id);
  persistTemplates();
  emit();
}
