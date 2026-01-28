/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Clear existing data in reverse dependency order
  await knex('refresh_tokens').del();
  await knex('attendances').del();
  await knex('qr_codes').del();
  await knex('voucher_transactions').del();
  await knex('voucher_packages').del();
  await knex('memberships').del();
  await knex('class_slot_coaches').del();
  await knex('class_concepts').del();
  await knex('class_slots').del();
  await knex('timetables').del();
  await knex('disciplines').del();
  await knex('gym_staff').del();
  await knex('gyms').del();
  await knex('users').where('email', 'like', '%@mmagym.com').orWhere('email', 'like', '%@example.com').del();

  // Insert users (password is 'password123' hashed with bcrypt)
  const passwordHash = '$2b$10$8K1p/a0dL1LXMIgoEDFrwOfMQHLVn/2FdR1W9zFvTHBhBFOvUBDt.';

  const users = await knex('users')
    .insert([
      {
        email: 'owner@mmagym.com',
        password_hash: passwordHash,
        first_name: 'Mike',
        last_name: 'Owner',
        phone: '+1234567890',
        status: 'active',
      },
      {
        email: 'coach.bjj@mmagym.com',
        password_hash: passwordHash,
        first_name: 'Carlos',
        last_name: 'Gracie',
        phone: '+1234567891',
        status: 'active',
      },
      {
        email: 'coach.muaythai@mmagym.com',
        password_hash: passwordHash,
        first_name: 'Buakaw',
        last_name: 'Banchamek',
        phone: '+1234567892',
        status: 'active',
      },
      {
        email: 'coach.wrestling@mmagym.com',
        password_hash: passwordHash,
        first_name: 'Dan',
        last_name: 'Gable',
        phone: '+1234567893',
        status: 'active',
      },
      {
        email: 'student1@example.com',
        password_hash: passwordHash,
        first_name: 'John',
        last_name: 'Student',
        phone: '+1234567894',
        status: 'active',
      },
      {
        email: 'student2@example.com',
        password_hash: passwordHash,
        first_name: 'Jane',
        last_name: 'Trainee',
        phone: '+1234567895',
        status: 'active',
      },
    ])
    .returning('*');

  const [owner, coachBjj, coachMuayThai, coachWrestling, student1, student2] = users;

  // Insert gym
  const [gym] = await knex('gyms')
    .insert({
      name: 'Elite MMA Academy',
      slug: 'elite-mma-academy',
      description: 'Premier mixed martial arts training facility',
      address_line1: '123 Fighter Street',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postal_code: '90001',
      contact_phone: '+1234567800',
      contact_email: 'info@elitemma.com',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      default_class_duration_minutes: 60,
      owner_id: owner.id,
      status: 'active',
    })
    .returning('*');

  // Insert gym staff (only coaches - owner is tracked via gyms.owner_id, students via memberships)
  await knex('gym_staff').insert([
    { gym_id: gym.id, user_id: coachBjj.id, role: 'head_coach', status: 'active' },
    { gym_id: gym.id, user_id: coachMuayThai.id, role: 'coach', status: 'active' },
    { gym_id: gym.id, user_id: coachWrestling.id, role: 'coach', status: 'active' },
  ]);

  // Insert disciplines
  const disciplines = await knex('disciplines')
    .insert([
      {
        gym_id: gym.id,
        name: 'Brazilian Jiu-Jitsu',
        slug: 'bjj',
        description: 'Ground fighting and submission grappling',
        color_code: '#3B82F6',
        default_duration_minutes: 60,
        requires_gi: true,
        display_order: 1,
        is_active: true,
      },
      {
        gym_id: gym.id,
        name: 'Muay Thai',
        slug: 'muay-thai',
        description: 'Thai boxing - the art of eight limbs',
        color_code: '#EF4444',
        default_duration_minutes: 60,
        requires_gi: false,
        display_order: 2,
        is_active: true,
      },
      {
        gym_id: gym.id,
        name: 'Wrestling',
        slug: 'wrestling',
        description: 'Olympic-style wrestling and takedowns',
        color_code: '#10B981',
        default_duration_minutes: 60,
        requires_gi: false,
        display_order: 3,
        is_active: true,
      },
      {
        gym_id: gym.id,
        name: 'MMA',
        slug: 'mma',
        description: 'Mixed Martial Arts - combining all disciplines',
        color_code: '#F59E0B',
        default_duration_minutes: 90,
        requires_gi: false,
        display_order: 4,
        is_active: true,
      },
    ])
    .returning('*');

  const [bjj, muayThai, wrestling, mma] = disciplines;

  // Insert timetables (one per discipline)
  const timetables = await knex('timetables')
    .insert([
      {
        gym_id: gym.id,
        discipline_id: bjj.id,
        name: 'BJJ Schedule',
        description: 'Brazilian Jiu-Jitsu weekly classes',
        valid_from: new Date('2026-01-01'),
        is_active: true,
        is_published: true,
        created_by_user_id: owner.id,
      },
      {
        gym_id: gym.id,
        discipline_id: muayThai.id,
        name: 'Muay Thai Schedule',
        description: 'Muay Thai weekly classes',
        valid_from: new Date('2026-01-01'),
        is_active: true,
        is_published: true,
        created_by_user_id: owner.id,
      },
      {
        gym_id: gym.id,
        discipline_id: wrestling.id,
        name: 'Wrestling Schedule',
        description: 'Wrestling weekly classes',
        valid_from: new Date('2026-01-01'),
        is_active: true,
        is_published: true,
        created_by_user_id: owner.id,
      },
      {
        gym_id: gym.id,
        discipline_id: mma.id,
        name: 'MMA Schedule',
        description: 'Mixed Martial Arts weekly classes',
        valid_from: new Date('2026-01-01'),
        is_active: true,
        is_published: true,
        created_by_user_id: owner.id,
      },
    ])
    .returning('*');

  const [bjjTimetable, muayThaiTimetable, wrestlingTimetable, mmaTimetable] = timetables;

  // Insert class slots (weekly schedule)
  const classSlots = await knex('class_slots')
    .insert([
      // BJJ Classes
      { timetable_id: bjjTimetable.id, title: 'BJJ Fundamentals', day_of_week: 1, start_time: '09:00', end_time: '10:00', max_capacity: 20, level: 'beginner', is_active: true },
      { timetable_id: bjjTimetable.id, title: 'BJJ Advanced', day_of_week: 1, start_time: '19:00', end_time: '20:30', max_capacity: 16, level: 'advanced', is_active: true },
      { timetable_id: bjjTimetable.id, title: 'BJJ Fundamentals', day_of_week: 3, start_time: '09:00', end_time: '10:00', max_capacity: 20, level: 'beginner', is_active: true },
      { timetable_id: bjjTimetable.id, title: 'BJJ Advanced', day_of_week: 4, start_time: '19:00', end_time: '20:30', max_capacity: 16, level: 'advanced', is_active: true },
      { timetable_id: bjjTimetable.id, title: 'BJJ Open Mat', day_of_week: 6, start_time: '10:00', end_time: '11:30', max_capacity: 25, level: 'all', is_active: true },

      // Muay Thai Classes
      { timetable_id: muayThaiTimetable.id, title: 'Muay Thai All Levels', day_of_week: 1, start_time: '18:00', end_time: '19:00', max_capacity: 15, level: 'all', is_active: true },
      { timetable_id: muayThaiTimetable.id, title: 'Muay Thai All Levels', day_of_week: 3, start_time: '18:00', end_time: '19:00', max_capacity: 15, level: 'all', is_active: true },
      { timetable_id: muayThaiTimetable.id, title: 'Muay Thai Sparring', day_of_week: 6, start_time: '11:30', end_time: '12:30', max_capacity: 12, level: 'intermediate', is_active: true },

      // Wrestling Classes
      { timetable_id: wrestlingTimetable.id, title: 'Wrestling Drills', day_of_week: 2, start_time: '18:00', end_time: '19:00', max_capacity: 20, level: 'all', is_active: true },
      { timetable_id: wrestlingTimetable.id, title: 'Wrestling Drills', day_of_week: 4, start_time: '18:00', end_time: '19:00', max_capacity: 20, level: 'all', is_active: true },

      // MMA Classes
      { timetable_id: mmaTimetable.id, title: 'MMA Sparring', day_of_week: 2, start_time: '19:00', end_time: '20:30', max_capacity: 12, level: 'intermediate', is_active: true },
      { timetable_id: mmaTimetable.id, title: 'MMA Sparring', day_of_week: 5, start_time: '18:00', end_time: '19:30', max_capacity: 12, level: 'intermediate', is_active: true },
    ])
    .returning('*');

  // Assign coaches to class slots
  const coachAssignments = [];
  for (const slot of classSlots) {
    let coachId;
    if (slot.timetable_id === bjjTimetable.id) coachId = coachBjj.id;
    else if (slot.timetable_id === muayThaiTimetable.id) coachId = coachMuayThai.id;
    else if (slot.timetable_id === wrestlingTimetable.id) coachId = coachWrestling.id;
    else coachId = coachBjj.id; // MMA taught by BJJ coach
    coachAssignments.push({ class_slot_id: slot.id, user_id: coachId });
  }
  await knex('class_slot_coaches').insert(coachAssignments);

  // Insert memberships for students
  const memberships = await knex('memberships')
    .insert([
      {
        gym_id: gym.id,
        user_id: student1.id,
        membership_type: 'voucher',
        started_at: new Date('2026-01-01'),
        expires_at: new Date('2026-06-30'),
        status: 'active',
      },
      {
        gym_id: gym.id,
        user_id: student2.id,
        membership_type: 'unlimited',
        started_at: new Date('2026-01-01'),
        expires_at: new Date('2026-02-28'),
        status: 'active',
      },
    ])
    .returning('*');

  // Insert voucher package for student1
  await knex('voucher_packages').insert({
    membership_id: memberships[0].id,
    package_name: 'Starter Pack',
    total_vouchers: 20,
    remaining_vouchers: 15,
    price_paid: 149.99,
    currency: 'USD',
    purchased_at: new Date('2026-01-01'),
    expires_at: new Date('2026-06-30'),
    status: 'active',
    created_by_user_id: owner.id,
  });

  console.log('Seed data inserted successfully!');
};
