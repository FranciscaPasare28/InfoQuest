// // import React, { useState } from 'react';
// // import Draggable from 'react-draggable';
// // import { useUpdateNoteMutation, useDeleteNoteMutation } from '../api/notes';
// //
// // function StickyNote({ note, onUpdate }) {
// //   const [content, setContent] = useState(note.content);
// //   const [position, setPosition] = useState({ x: note.x, y: note.y }); // Stare pentru poziția curentă
// //   const [updateNote] = useUpdateNoteMutation();
// //   const [deleteNote] = useDeleteNoteMutation();
// //
// //   const handleContentChange = (e) => {
// //     setContent(e.target.value);
// //   };
// //
// //   const handleSave = () => {
// //     updateNote({
// //       id: note.id,
// //       content,
// //       x: position.x, // Trimite noile coordonate la salvare
// //       y: position.y,
// //     }).then(() => {
// //       onUpdate(); // Refresh or re-fetch notes to reflect updates
// //     });
// //   };
// //
// //   const handleDelete = () => {
// //     deleteNote(note.id);
// //   };
// //
// //   const handleDrag = (e, data) => {
// //     setPosition({ x: data.x, y: data.y });
// //   };
// //
// //   return (
// //     <Draggable
// //       position={position} // Utilizează starea locală pentru poziție
// //       onDrag={handleDrag} // Actualizează poziția în timpul mișcării
// //       onStop={handleDrag}
// //     >
// //       <div className="sticky-note">
// //         <textarea value={content} onChange={handleContentChange} />
// //         <button onClick={handleSave}>Save</button>
// //         <button onClick={handleDelete}>Delete</button>
// //       </div>
// //     </Draggable>
// //   );
// // }
// //
// // export default StickyNote;
import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useUpdateNoteMutation, useDeleteNoteMutation, useGetNotesQuery } from '../api/notes';

// function StickyNote({ note, onUpdate }) {
//   const [content, setContent] = useState(note.content);
//   const [position, setPosition] = useState({ x: note.x, y: note.y });
//   const textAreaRef = useRef(null);
//
//   const updateNote = useUpdateNoteMutation()[0];
//   const deleteNote = useDeleteNoteMutation()[0];
//
//   const handleContentChange = (e) => {
//     setContent(e.target.value);
//   };
//
//   // const handleDragStop = (e, data) => {
//   //   const newPos = { x: data.x, y: data.y };
//   //   setPosition(newPos);
//   //   // Actualizare la backend
//   //   updateNote({
//   //     id: note.id,
//   //     content,
//   //     ...newPos,
//   //   }).then(onUpdate); // Notifică containerul să reîncarce datele dacă este necesar
//   // };
//   const handleDragStop = (e, data) => {
//     const newPos = { x: data.x, y: data.y };
//     setPosition(newPos); // Actualizează starea locală cu noua poziție
//     // Actualizare la backend
//     updateNote({
//       id: note.id,
//       content: note.content, // Asigură-te că acest câmp este corect preluat
//       color: note.color, // La fel și pentru culoare, dacă este relevant
//       ...newPos,
//     }).then(onUpdate)
//       .catch((error) => console.error('Failed to update note:', error));
//   };
//
//   // const handleSave = () => {
//   //   updateNote({
//   //     id: note.id,
//   //     x: position.x,
//   //     y: position.y,
//   //   }).then(onUpdate);
//   // };
//   const handleSave = () => {
//     const updatedNote = { ...note, content };
//     updateNote(updatedNote).then(() => {
//       onUpdate();
//     });
//   };
//
//   const handleDelete = () => {
//     deleteNote(note.id);
//   };
//
//   useEffect(() => {
//     adjustTextAreaHeight();
//   }, [content]);
//
//   const adjustTextAreaHeight = () => {
//     if (textAreaRef.current) {
//       textAreaRef.current.style.height = 'inherit'; // Reset height
//       textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set to scroll height
//     }
//   };
//
//   return (
//     <Draggable
//       position={position}
//       // onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
//       onStop={handleDragStop}
//     >
//       <div className="sticky-note">
//         <textarea
//           ref={textAreaRef}
//           value={content}
//           onChange={handleContentChange}
//           style={{ width: '100%', overflow: 'hidden' }}
//         />
//         <button onClick={handleSave}>Save</button>
//         <button onClick={handleDelete}>Delete</button>
//       </div>
//     </Draggable>
//   );
// }
//
// export default StickyNote;
function StickyNote({ note }) {
  const { data: notes, mutate, refetch } = useGetNotesQuery();
  const [content, setContent] = useState(note.content);
  const [position, setPosition] = useState({ x: note.x, y: note.y });
  const updateNote = useUpdateNoteMutation()[0];
  const deleteNote = useDeleteNoteMutation()[0];

  const onUpdate = () => {
    refetch(); // sau orice metodă care reîncarcă datele de la server
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleDragStop = (e, data) => {
    const newPos = { x: data.x, y: data.y };
    setPosition(newPos);
    // Actualizare la backend cu conținutul actualizat și noua poziție
    updateNote({
      id: note.id,
      content,
      x: newPos.x,
      y: newPos.y,
    }).then(onUpdate).catch((error) => {
      console.error('Failed to update note:', error);
    });
  };

  const handleSave = () => {
    updateNote({
      id: note.id,
      content,
      x: position.x,
      y: position.y,
    }).then(onUpdate).catch((error) => {
      console.error('Failed to update note:', error);
    });
  };

  const handleDelete = () => {
    // Acest apel trebuie să trimită ID-ul corect al notei către metoda deleteNote
    deleteNote(note.id); // Asigurați-vă că note.id este valabil și că este trimis corect
  };

  return (
    <Draggable position={position} onStop={handleDragStop}>
      <div className="sticky-note">
        <textarea value={content} onChange={handleContentChange} />
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </Draggable>
  );
}
export default StickyNote;
