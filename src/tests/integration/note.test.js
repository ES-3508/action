const app = require('../../app');
const supertest = require('supertest');
const req = supertest(app);
const Note = require('../../models/note');

// Integration Tests programmatically test the API used by the application

describe('Note API Integration Tests', () => {

  it('should add a new note and then delete it', async () => {
    // Step 1: Add a new note
    const noteData = {
      title: '[INTEGRATION TEST] New Note',
      description: 'This note was created at ' + new Date(),
    };

    const addRes = await req.post('/').send(noteData);

    // Check if the note was added successfully
    expect(addRes.statusCode).toEqual(302);
    expect(addRes.headers['location']).toEqual('/');

    // Step 2: Find the note that was just added
    const createdNote = await Note.findOne({ title: noteData.title });
    expect(createdNote).not.toBeNull(); // Ensure the note exists

    // Step 3: Delete the note
    const deleteRes = await req.delete(`/${createdNote._id}`).send();

    // Check if the note was deleted successfully
    expect(deleteRes.statusCode).toEqual(302);
    expect(deleteRes.headers['location']).toEqual('/');

    // Step 4: Verify the note has been deleted
    const deletedNote = await Note.findById(createdNote._id);
    expect(deletedNote).toBeNull(); // Ensure the note no longer exists
  });

});
