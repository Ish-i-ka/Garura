// src/components/interview_ui/Whiteboard.tsx
'use client';

// We import the Tldraw component directly from the library
import { Tldraw } from 'tldraw';

// We also need to import its CSS file for it to look correct.
// In a Vite project, we can import CSS directly into a component.
import 'tldraw/tldraw.css';

export default function Whiteboard() {
  return (
    // The component needs to be in a positioned container to take up full space.
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-slate-700">
      <Tldraw>
        {/* 
          tldraw provides its own complete UI (tools, canvas, etc.).
          We can customize it, but the default is perfect for our needs.
          We don't need to add any children here.
        */}
      </Tldraw>
    </div>
  );
}