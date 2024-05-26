// StickyNotesContainer.js
import React, { useEffect, useState } from 'react';
import { Button, Input, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import StickyNote from './StickyNotes';
import { useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation } from '../api/notes';

function StickyNotesContainer() {
  const { data: notes, mutate, refetch } = useGetNotesQuery();
  const [createNote] = useCreateNoteMutation();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  const [notePositions, setNotePositions] = useState({}); // Starea pentru pozițiile notelor
  const [updateNote] = useUpdateNoteMutation();
  const handleAddNote = async () => {
    if (!newNoteContent.trim()) {
      console.log('Content is empty, not creating a note.');
      return;
    }
    try {
      await createNote({
        content: newNoteContent,
        color: 'yellow',
        x: 100 + (notes?.length || 0) * 10,
        y: 100 + (notes?.length || 0) * 10,
      }).unwrap();
      setNewNoteContent('');
      refetch(); // Correct usage to refresh the data
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const deleteNote = (noteId) => {
    mutate(notes.filter((note) => note.id !== noteId), false);
  };

  const toggleNotes = () => {
    setShowStickyNotes(!showStickyNotes);
  };

  const handleUpdateNote = async (id, content, x, y) => {
    try {
      await updateNote({
        id,
        content,
        x,
        y,
      }).unwrap();
      refetch(); // Refresh data after update
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleNoteDrag = (id, newX, newY) => {
    const updatedNotes = notes.map((note) => (note.id === id ? { ...note, x: newX, y: newY } : note));
    mutate(updatedNotes);
  };
  useEffect(() => {
    if (notes) {
      const initialPositions = {};
      notes.forEach((note) => {
        initialPositions[note.id] = { x: note.x, y: note.y };
      });
      setNotePositions(initialPositions);
    }
  }, [notes]);

  const handleDrag = (id, newX, newY) => {
    setNotePositions((prev) => ({
      ...prev,
      [id]: { x: newX, y: newY },
    }));
  };

  return (
    <>
      <Button onClick={() => setShowStickyNotes(!showStickyNotes)} className="toggle-notes-button">
        {showStickyNotes ? 'Hide Notes' : 'Show Notes'}
      </Button>
      {showStickyNotes && (
        <div className="notes-panel">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={() => handleUpdateNote(note.id, note.content, note.x, note.y)}
              position={{ x: note.x, y: note.y }}
              // onUpdate={refetch}
              onDelete={deleteNote}
              onDrag={handleDrag}
              // position={notePositions[note.id]}
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Input
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Enter note content"
              suffix={(
                <Tooltip title="Add Note">
                  <PlusCircleOutlined
                    onClick={handleAddNote}
                    style={{ color: 'green', cursor: 'pointer' }}
                  />
                </Tooltip>
                )}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default StickyNotesContainer;
