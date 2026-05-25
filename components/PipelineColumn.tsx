// components/crm/PipelineColumn.tsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableContactCard from "./SortableContactCard";
import { CRMContact, StageId, Column } from "../types/crm";

interface ColumnProps {
  column: Column;
  contacts: CRMContact[];
}

export default function PipelineColumn({ column, contacts }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const columnValueSum = contacts.reduce((sum, c) => sum + c.value, 0);

  return (
    <div
      ref={setNodeRef}
      className={`group flex flex-col h-full max-h-[75vh] rounded-2xl border bg-zinc-900/10 p-4 transition-all duration-300 ${
        isOver 
          ? "border-violet-500/30 bg-zinc-900/40 shadow-[0_0_30px_rgba(139,92,246,0.05)]" 
          : "border-white/[0.04]"
      }`}
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors">
            {column.title}
          </h3>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            {contacts.length} {contacts.length === 1 ? "deal" : "deals"}
          </p>
        </div>
        <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-white/[0.06] rounded-md px-2 py-0.5">
          ${(columnValueSum / 1000).toFixed(0)}k
        </span>
      </div>

      {/* Sortable Context Loop */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none custom-scroll">
        <SortableContext items={contacts.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {contacts.map((contact) => (
            <SortableContactCard key={contact.id} contact={contact} glowColor={column.glowColor} />
          ))}
        </SortableContext>
        
        {/* Transparent drop spacer when column empty */}
        {contacts.length === 0 && (
          <div className="h-20 rounded-xl border border-dashed border-white/[0.04] flex items-center justify-center text-xs text-zinc-600">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}