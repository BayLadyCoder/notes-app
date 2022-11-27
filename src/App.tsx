import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NewNote } from './NewNote';
import { useLocalStorage } from './useLocalStorage';
import { NoteData, RawNote, Tag } from './types';
import { useMemo } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { NoteList } from './NoteList';
import { NoteLayout } from './NoteLayout';
import { Note } from './Note';
import { EditNote } from './EditNote';

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, []);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => [
      ...prevNotes,
      { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
    ]);
  };

  const addTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNote) => {
      return prevNote.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  };

  return (
    <Container className='my-4'>
      <Routes>
        <Route
          path='/'
          element={<NoteList notes={notesWithTags} availableTags={tags} />}
        />
        <Route
          path='/new'
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />
        <Route path='/:id' element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note />} />
          <Route
            path='edit'
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Container>
  );
}

export default App;
