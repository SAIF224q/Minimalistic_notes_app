import React, { createContext, useContext, useEffect, useState } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteContextType {
  notes: Note[];
  activeNoteId: string | null;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem("minimal-notes");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  
  const [activeNoteId, setActiveNote] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("minimal-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNote(null);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote }}>
      {children}
    </NoteContext.Provider>
  );
}

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error("useNotes must be used within NoteProvider");
  return context;
};