const db = require('../db/knex');

// Helper to generate URL-friendly slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Helper to sanitize gym response
const sanitizeGym = (gym) => ({
  id: gym.id,
  name: gym.name,
  slug: gym.slug,
  description: gym.description,
  addressLine1: gym.address_line1,
  addressLine2: gym.address_line2,
  city: gym.city,
  state: gym.state,
  country: gym.country,
  postalCode: gym.postal_code,
  contactEmail: gym.contact_email,
  contactPhone: gym.contact_phone,
  websiteUrl: gym.website_url,
  logoUrl: gym.logo_url,
  timezone: gym.timezone,
  currency: gym.currency,
  ownerId: gym.owner_id,
  status: gym.status,
  createdAt: gym.created_at,
  updatedAt: gym.updated_at,
});

// POST /api/gyms - Create a new gym
const createGym = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      contactEmail,
      contactPhone,
      websiteUrl,
      timezone,
      currency,
    } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Gym name is required' });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Gym name must be between 2 and 100 characters' });
    }

    // Generate unique slug
    let slug = generateSlug(name);
    const existingSlug = await db('gyms').where({ slug }).whereNull('deleted_at').first();
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create the gym
    const [gym] = await db('gyms')
      .insert({
        name: name.trim(),
        slug,
        description: description || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        city: city || null,
        state: state || null,
        country: country || null,
        postal_code: postalCode || null,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        website_url: websiteUrl || null,
        timezone: timezone || 'UTC',
        currency: currency || 'USD',
        owner_id: userId,
        status: 'active',
      })
      .returning('*');

    // Add owner as head_coach in gym_staff
    await db('gym_staff').insert({
      gym_id: gym.id,
      user_id: userId,
      role: 'head_coach',
      status: 'active',
    });

    res.status(201).json({
      message: 'Gym created successfully',
      gym: sanitizeGym(gym),
    });
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/gyms/:id - Get gym by ID
const getGym = async (req, res) => {
  try {
    const { id } = req.params;

    const gym = await db('gyms')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    res.json({ gym: sanitizeGym(gym) });
  } catch (error) {
    console.error('Get gym error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/gyms/:id - Update gym
const updateGym = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      contactEmail,
      contactPhone,
      websiteUrl,
      timezone,
      currency,
      status,
    } = req.body;

    // Check gym exists
    const gym = await db('gyms')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Check authorization (owner or head_coach)
    const isOwner = gym.owner_id === userId;
    const isHeadCoach = await db('gym_staff')
      .where({ gym_id: id, user_id: userId, role: 'head_coach', status: 'active' })
      .whereNull('deleted_at')
      .first();

    if (!isOwner && !isHeadCoach) {
      return res.status(403).json({ error: 'Not authorized to update this gym' });
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Gym name cannot be empty' });
      }
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ error: 'Gym name must be between 2 and 100 characters' });
      }
    }

    // Build update object
    const updates = { updated_at: db.fn.now() };
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (addressLine1 !== undefined) updates.address_line1 = addressLine1;
    if (addressLine2 !== undefined) updates.address_line2 = addressLine2;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (country !== undefined) updates.country = country;
    if (postalCode !== undefined) updates.postal_code = postalCode;
    if (contactEmail !== undefined) updates.contact_email = contactEmail;
    if (contactPhone !== undefined) updates.contact_phone = contactPhone;
    if (websiteUrl !== undefined) updates.website_url = websiteUrl;
    if (timezone !== undefined) updates.timezone = timezone;
    if (currency !== undefined) updates.currency = currency;
    if (status !== undefined) updates.status = status;

    // Update slug if name changed
    if (name !== undefined && name.trim() !== gym.name) {
      let newSlug = generateSlug(name);
      const existingSlug = await db('gyms')
        .where({ slug: newSlug })
        .whereNot({ id })
        .whereNull('deleted_at')
        .first();
      if (existingSlug) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      updates.slug = newSlug;
    }

    const [updatedGym] = await db('gyms')
      .where({ id })
      .update(updates)
      .returning('*');

    res.json({
      message: 'Gym updated successfully',
      gym: sanitizeGym(updatedGym),
    });
  } catch (error) {
    console.error('Update gym error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/gyms/:id - Soft delete gym
const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check gym exists
    const gym = await db('gyms')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!gym) {
      return res.status(404).json({ error: 'Gym not found' });
    }

    // Only owner can delete
    if (gym.owner_id !== userId) {
      return res.status(403).json({ error: 'Only the gym owner can delete the gym' });
    }

    // Soft delete
    await db('gyms')
      .where({ id })
      .update({
        deleted_at: db.fn.now(),
        status: 'inactive',
      });

    res.json({ message: 'Gym deleted successfully' });
  } catch (error) {
    console.error('Delete gym error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/gyms - List gyms for current user
const listGyms = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get gyms where user is owner or staff member
    const gyms = await db('gyms')
      .where(function() {
        this.where('owner_id', userId)
          .orWhereIn('id', function() {
            this.select('gym_id')
              .from('gym_staff')
              .where('user_id', userId)
              .whereNull('deleted_at');
          });
      })
      .whereNull('deleted_at')
      .orderBy('created_at', 'desc');

    res.json({
      gyms: gyms.map(sanitizeGym),
    });
  } catch (error) {
    console.error('List gyms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createGym,
  getGym,
  updateGym,
  deleteGym,
  listGyms,
};
