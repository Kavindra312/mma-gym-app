const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/knex');

describe('Gym Endpoints', () => {
  let accessToken;
  let userId;
  let gymId;

  const testUser = {
    email: 'gymtest@example.com',
    password: 'password123',
    firstName: 'Gym',
    lastName: 'Tester',
  };

  const testGym = {
    name: 'Test MMA Academy',
    description: 'A test gym for unit testing',
    addressLine1: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    country: 'USA',
    postalCode: '12345',
    contactEmail: 'gym@test.com',
    contactPhone: '+1234567890',
    timezone: 'America/New_York',
    currency: 'USD',
  };

  beforeAll(async () => {
    // Clean up any existing test data
    await db('gym_staff')
      .whereIn('user_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('gyms')
      .whereIn('owner_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('refresh_tokens')
      .whereIn('user_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('users').where('email', testUser.email).del();

    // Register and login test user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    accessToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await db('gym_staff')
      .whereIn('user_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('gyms')
      .whereIn('owner_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('refresh_tokens')
      .whereIn('user_id', db('users').select('id').where('email', testUser.email))
      .del();
    await db('users').where('email', testUser.email).del();
    await db.destroy();
  });

  describe('POST /api/gyms', () => {
    it('should create a new gym', async () => {
      const res = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testGym);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Gym created successfully');
      expect(res.body.gym.name).toBe(testGym.name);
      expect(res.body.gym.ownerId).toBe(userId);
      expect(res.body.gym.slug).toBeDefined();

      gymId = res.body.gym.id;
    });

    it('should reject request without authentication', async () => {
      const res = await request(app)
        .post('/api/gyms')
        .send(testGym);

      expect(res.statusCode).toBe(401);
    });

    it('should reject gym without name', async () => {
      const res = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...testGym, name: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Gym name is required');
    });

    it('should reject gym with name too short', async () => {
      const res = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...testGym, name: 'A' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Gym name must be between 2 and 100 characters');
    });

    it('should reject gym with name too long', async () => {
      const res = await request(app)
        .post('/api/gyms')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...testGym, name: 'A'.repeat(101) });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Gym name must be between 2 and 100 characters');
    });
  });

  describe('GET /api/gyms/:id', () => {
    it('should get gym by ID', async () => {
      const res = await request(app)
        .get(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.gym.id).toBe(gymId);
      expect(res.body.gym.name).toBe(testGym.name);
    });

    it('should return 404 for non-existent gym', async () => {
      const res = await request(app)
        .get('/api/gyms/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Gym not found');
    });

    it('should reject request without authentication', async () => {
      const res = await request(app)
        .get(`/api/gyms/${gymId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/gyms', () => {
    it('should list user gyms', async () => {
      const res = await request(app)
        .get('/api/gyms')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.gyms)).toBe(true);
      expect(res.body.gyms.length).toBeGreaterThan(0);
      expect(res.body.gyms.some((g) => g.id === gymId)).toBe(true);
    });
  });

  describe('PUT /api/gyms/:id', () => {
    it('should update gym', async () => {
      const updates = {
        name: 'Updated Test Academy',
        description: 'Updated description',
      };

      const res = await request(app)
        .put(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updates);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Gym updated successfully');
      expect(res.body.gym.name).toBe(updates.name);
      expect(res.body.gym.description).toBe(updates.description);
    });

    it('should return 404 for non-existent gym', async () => {
      const res = await request(app)
        .put('/api/gyms/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(404);
    });

    it('should reject empty name', async () => {
      const res = await request(app)
        .put(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Gym name cannot be empty');
    });

    it('should reject unauthorized user', async () => {
      // Create another user
      const otherUser = {
        email: 'other@example.com',
        password: 'password123',
        firstName: 'Other',
        lastName: 'User',
      };

      // Clean up if exists
      await db('refresh_tokens')
        .whereIn('user_id', db('users').select('id').where('email', otherUser.email))
        .del();
      await db('users').where('email', otherUser.email).del();

      const otherRes = await request(app)
        .post('/api/auth/register')
        .send(otherUser);

      const res = await request(app)
        .put(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${otherRes.body.accessToken}`)
        .send({ name: 'Hacked Name' });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Not authorized to update this gym');

      // Clean up other user
      await db('refresh_tokens')
        .whereIn('user_id', db('users').select('id').where('email', otherUser.email))
        .del();
      await db('users').where('email', otherUser.email).del();
    });
  });

  describe('DELETE /api/gyms/:id', () => {
    it('should reject unauthorized user', async () => {
      // Create another user
      const otherUser = {
        email: 'delete-other@example.com',
        password: 'password123',
        firstName: 'Delete',
        lastName: 'Other',
      };

      await db('refresh_tokens')
        .whereIn('user_id', db('users').select('id').where('email', otherUser.email))
        .del();
      await db('users').where('email', otherUser.email).del();

      const otherRes = await request(app)
        .post('/api/auth/register')
        .send(otherUser);

      const res = await request(app)
        .delete(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${otherRes.body.accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe('Only the gym owner can delete the gym');

      // Clean up other user
      await db('refresh_tokens')
        .whereIn('user_id', db('users').select('id').where('email', otherUser.email))
        .del();
      await db('users').where('email', otherUser.email).del();
    });

    it('should delete gym (soft delete)', async () => {
      const res = await request(app)
        .delete(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Gym deleted successfully');

      // Verify gym is soft deleted
      const getRes = await request(app)
        .get(`/api/gyms/${gymId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 for non-existent gym', async () => {
      const res = await request(app)
        .delete('/api/gyms/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
    });
  });
});
