import React from 'react';
import { NoteForm } from './NoteForm';
import { NoteData } from './types';

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
};

export const NewNote = ({ onSubmit }: NewNoteProps) => {
  return (
    <>
      <h1 className='mb-4'>NewNote</h1>
      <NoteForm onSubmit={onSubmit} />
    </>
  );
};
