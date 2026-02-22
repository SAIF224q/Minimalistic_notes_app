import { useState, useEffect, useRef } from "react";
import { useNotes } from "@/lib/NoteContext";
import { useSettings } from "@/lib/SettingsContext";
import { Plus, Trash2, Moon, Sun, Type, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { notes, activeNoteId, setActiveNote, addNote, updateNote, deleteNote } = useNotes();
  const { theme, setTheme, fontStyle, setFontStyle } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeNote = notes.find((n) => n.id === activeNoteId);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const resize = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
      if (ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = ref.current.scrollHeight + "px";
      }
    };
    // small timeout to allow react to render the values first
    setTimeout(() => {
      resize(titleRef);
      resize(contentRef);
    }, 0);
  }, [activeNote?.id, activeNote?.title, activeNote?.content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNoteId) updateNote(activeNoteId, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNoteId) updateNote(activeNoteId, { content: e.target.value });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden transition-colors duration-200">
      {/* Sidebar */}
      <div
        className={cn(
          "h-full bg-secondary/30 border-r border-border transition-all duration-300 flex flex-col shrink-0",
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full border-none opacity-0"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-foreground rounded-sm flex items-center justify-center">
              <span className="text-background text-xs font-bold">N</span>
            </div>
            <span className="font-medium text-sm">Notes</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={addNote} data-testid="button-add-note">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {notes.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                  activeNoteId === note.id
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
                data-testid={`card-note-${note.id}`}
              >
                <span className="truncate flex-1">{note.title || "Untitled"}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity"
                  data-testid={`button-delete-${note.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Settings Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-1 bg-secondary rounded-full p-1">
            <button
              onClick={() => setFontStyle("sans")}
              className={cn("px-2 py-1 rounded-full text-xs font-sans-style transition-colors", fontStyle === "sans" && "bg-background text-foreground shadow-sm")}
              data-testid="button-font-sans"
            >
              Aa
            </button>
            <button
              onClick={() => setFontStyle("serif")}
              className={cn("px-2 py-1 rounded-full text-xs font-serif-style transition-colors", fontStyle === "serif" && "bg-background text-foreground shadow-sm")}
              data-testid="button-font-serif"
            >
              Aa
            </button>
            <button
              onClick={() => setFontStyle("mono")}
              className={cn("px-2 py-1 rounded-full text-xs font-mono-style transition-colors", fontStyle === "mono" && "bg-background text-foreground shadow-sm")}
              data-testid="button-font-mono"
            >
              Aa
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-secondary"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="button-toggle-theme"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Topbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              data-testid="button-toggle-sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto px-8 sm:px-16 md:px-24 lg:px-32 py-24">
          {activeNote ? (
            <div className="max-w-3xl mx-auto flex flex-col min-h-full animate-in fade-in duration-300 pb-32">
              <textarea
                ref={titleRef}
                value={activeNote.title}
                onChange={(e) => {
                  handleTitleChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder="Untitled"
                className="editor-textarea text-4xl sm:text-5xl font-bold mb-6 text-foreground placeholder:text-muted overflow-hidden"
                rows={1}
                data-testid="input-note-title"
              />
              <textarea
                ref={contentRef}
                value={activeNote.content}
                onChange={(e) => {
                  handleContentChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
                placeholder="Start writing..."
                className="editor-textarea flex-1 text-base sm:text-lg text-foreground/90 leading-relaxed placeholder:text-muted/60 overflow-hidden"
                style={{ minHeight: "60vh" }}
                data-testid="input-note-content"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Type className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p>Select a note or create a new one.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}