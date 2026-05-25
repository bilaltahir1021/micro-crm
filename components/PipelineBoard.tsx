// components/crm/PipelineBoard.tsx
"use client";

import React, { useState } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCorners } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import PipelineColumn from "./PipelineColumn";
import { CRMContact, COLUMNS, StageId } from "../types/crm";

// Initial state mock (Replace with Server Component fetched data later)
const INITIAL_CONTACTS: CRMContact[] = [
  { id: "1", name: "Alexander Wright", company: "Aether Labs", value: 48000, stage: "LEAD", lastActive: "2h ago" },
  { id: "2", name: "Elena Rostova", company: "Mirny Heavy Ind.", value: 125000, stage: "CONTACTED", lastActive: "1d ago" },
  { id: "3", name: "Marcus Vance", company: "Chronos Capital", value: 72000, stage: "PROPOSAL", lastActive: "30m ago" },
  { id: "4", name: "Siddharth Nair", company: "Helix Bio", value: 210000, stage: "WON", lastActive: "3d ago" },
];

export default function PipelineBoard() {
  const [contacts, setContacts] = useState<CRMContact[]>(INITIAL_CONTACTS);

  // Smooth dragging configuration
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Prevents accidental drag when clicking
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const contactId = active.id as string;
    const targetStageId = over.id as StageId;

    // Find the moved item
    const movedContact = contacts.find((c) => c.id === contactId);
    if (!movedContact || movedContact.stage === targetStageId) return;

    // 1. OPTIMISTIC UPDATE: Update state immediately for zero-latency feel
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, stage: targetStageId } : c))
    );

    // 2. BACKEND SYNC (Conceptual Next.js Server Action)
    try {
      // await updateContactStageAction(contactId, targetStageId);
    } catch (error) {
      // Rollback state if server fails
      setContacts(contacts);
      console.error("Failed to sync pipeline update:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#030303] text-zinc-200 p-8">
      {/* Dynamic Dashboard Metrics Bar */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <p className="text-xs font-mono text-violet-400 uppercase tracking-widest">Workspace / Deals Pipeline</p>
          <h1 className="text-3xl font-bold tracking-tight text-white mt-1">Deal Velocity</h1>
        </div>
        <div className="bg-zinc-900/40 border border-white/[0.06] backdrop-blur-md rounded-xl px-4 py-2 text-xs font-medium">
          Total Value: <span className="text-emerald-400 font-semibold">
            ${contacts.reduce((acc, curr) => acc + (curr.stage === 'WON' ? curr.value : 0), 0).toLocaleString()}
          </span>
        </div>
      </header>

      {/* Dnd Context Wrapper */}
      <DndContext id="crm-pipeline-board" sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-220px)] items-start">
          {COLUMNS.map((column) => (
            <PipelineColumn
              key={column.id}
              column={column}
              contacts={contacts.filter((c) => c.stage === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}