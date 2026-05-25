// components/crm/SortableContactCard.tsx
"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, DollarSign } from "lucide-react";
import { CRMContact } from "../types/crm";

interface CardProps {
  contact: CRMContact;
  glowColor: string;
}

export default function SortableContactCard({ contact, glowColor }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing outline-none select-none ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      <motion.div
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98, rotate: -0.5 }}
        transition={{ type: "spring", stiffness: 500, damping: 25 }}
        className="group/card relative overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950 p-4 shadow-xl hover:border-white/[0.12] hover:bg-zinc-900/30 transition-colors duration-200"
      >
        {/* Interactive Dynamic Gradient Light */}
        <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-[40px] transition-opacity duration-500 opacity-0 group-hover/card:opacity-100 ${glowColor}`} />

        {/* Card Data Layout */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold tracking-tight text-zinc-300 group-hover/card:text-white transition-colors">
              {contact.name}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <Building2 className="h-3 w-3" />
              <span>{contact.company}</span>
            </div>
          </div>
          <button className="rounded-md p-1 text-zinc-600 opacity-0 group-hover/card:opacity-100 transition-all duration-200 hover:bg-zinc-800 hover:text-white">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Lower Metadata Border Block */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 font-mono">Seen {contact.lastActive}</span>
          <div className="flex items-center text-emerald-400 font-medium bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">
            <DollarSign className="h-2.5 w-2.5 mr-0.5 stroke-[2.5]" />
            {contact.value.toLocaleString()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}