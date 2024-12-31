import React from 'react';
import { Loader2 } from 'lucide-react';
import type { ProcessStatus } from '../types';

interface Props {
  status: ProcessStatus;
}

export function ProcessingStatus({ status }: Props) {
  return (
    <div className="bg-white/90 p-4 rounded-lg shadow-lg border-2 border-amber-900">
      <h2 className="text-xl font-bold text-amber-900 mb-4">Processing Status</h2>
      <div className="space-y-2">
        <StatusItem label="Optimizing Resume" done={status.resume} />
        <StatusItem label="Crafting Cover Letter" done={status.coverLetter} />
        <StatusItem label="Preparing Interview Guide" done={status.interview} />
      </div>
    </div>
  );
}

function StatusItem({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <div className="h-4 w-4 rounded-full bg-green-500" />
      ) : (
        <Loader2 className="h-4 w-4 animate-spin text-amber-700" />
      )}
      <span className="text-amber-900">{label}</span>
    </div>
  );
}