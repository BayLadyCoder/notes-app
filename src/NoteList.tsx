import React, { useMemo, useState } from 'react';
import { Button, Col, Row, Stack, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { NoteCard } from './NoteCard';
import { Note, Tag } from './types';

type NoteListProps = { availableTags: Tag[]; notes: Note[] };

export const NoteList = ({ availableTags, notes }: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (title === '') return true;
      if (selectedTags.length === 0) return true;

      if (note.title.toLowerCase().includes(title.toLocaleLowerCase()))
        return true;

      if (
        selectedTags.every((tag) =>
          note.tags.some((noteTag) => noteTag.id === tag.id)
        )
      )
        return true;
    });
  }, [title, selectedTags, notes]);

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs='auto'>
          <Stack gap={2} direction='horizontal'>
            <Link to='/new'>
              <Button variant='primary'>Create</Button>
            </Link>
            <Button variant='outline-secondary'>Edit Tags</Button>
          </Stack>
        </Col>
      </Row>
      <Form>
        <Row className='mb-4'>
          <Col>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type='text'
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId='tags'>
              <Form.Label>Tags</Form.Label>
              <ReactSelect
                value={selectedTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                options={availableTags.map((tag) => ({
                  label: tag.label,
                  value: tag.id,
                }))}
                onChange={(tags) =>
                  setSelectedTags(
                    tags.map((tag) => ({ label: tag.label, id: tag.value }))
                  )
                }
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <Row xs={1} sm={2} lg={3} xl={4} gap={3}>
        {filteredNotes.map((note) => (
          <Col key={note.id}>
            <NoteCard id={note.id} title={note.title} tags={note.tags} />
          </Col>
        ))}
      </Row>
    </>
  );
};
