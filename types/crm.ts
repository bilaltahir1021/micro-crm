// types/crm.ts
export type StageId = 'LEAD' | 'CONTACTED' | 'PROPOSAL' | 'WON';

export interface CRMContact {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: StageId;
  lastActive: string;
}

export interface Column {
  id: StageId;
  title: string;
  glowColor: string; // Tailwinds ambient radial color
}

export const COLUMNS: Column[] = [
  { id: 'LEAD', title: 'New Leads', glowColor: 'group-hover:bg-blue-500/10' },
  { id: 'CONTACTED', title: 'In Discussion', glowColor: 'group-hover:bg-indigo-500/10' },
  { id: 'PROPOSAL', title: 'Proposal Sent', glowColor: 'group-hover:bg-amber-500/10' },
  { id: 'WON', title: 'Closed Won', glowColor: 'group-hover:bg-emerald-500/10' },
];