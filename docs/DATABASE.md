# Database Schema

This document describes the PostgreSQL database schema for the MMA Gym App, hosted on Supabase.

## Overview

The database uses:
- **PostgreSQL** on Supabase
- **Knex.js** as the query builder/migration tool
- **UUID** primary keys
- **snake_case** column naming
- **Soft deletes** via `deleted_at` timestamps

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│    users    │       │    gyms     │       │   disciplines   │
├─────────────┤       ├─────────────┤       ├─────────────────┤
│ id (PK)     │◄──────│ owner_id    │       │ id (PK)         │
│ email       │       │ id (PK)     │◄──────│ gym_id (FK)     │
│ password_   │       │ name        │       │ name            │
│   hash      │       │ slug        │       │ slug            │
│ first_name  │       │ ...         │       │ color_code      │
│ last_name   │       └─────────────┘       │ ...             │
│ ...         │              │              └─────────────────┘
└─────────────┘              │                      │
       │                     │                      │
       │              ┌──────┴──────┐               │
       │              ▼             ▼               │
       │      ┌─────────────┐ ┌─────────────┐       │
       │      │  gym_staff  │ │ memberships │       │
       │      ├─────────────┤ ├─────────────┤       │
       └─────►│ user_id(FK) │ │ user_id(FK) │◄──────┘
              │ gym_id (FK) │ │ gym_id (FK) │
              │ role        │ │ membership_ │
              └─────────────┘ │   type      │
                              └─────────────┘
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                    ┌─────────────┐ ┌──────────────────┐
                    │  voucher_   │ │   attendances    │
                    │  packages   │ └──────────────────┘
                    └─────────────┘
```

## Tables

### users
Stores all user accounts (gym owners, coaches, students).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | Unique email address |
| phone | VARCHAR | Phone number |
| password_hash | VARCHAR | bcrypt hashed password |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| status | VARCHAR | Account status (active, inactive, suspended) |
| last_login_at | TIMESTAMP | Last login timestamp |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |
| deleted_at | TIMESTAMP | Soft delete timestamp |

### gyms
Gym/academy information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | Gym name |
| slug | VARCHAR | URL-friendly identifier |
| description | TEXT | Gym description |
| address_line1 | VARCHAR | Street address |
| city | VARCHAR | City |
| state | VARCHAR | State/province |
| country | VARCHAR | Country |
| postal_code | VARCHAR | Postal code |
| contact_email | VARCHAR | Contact email |
| contact_phone | VARCHAR | Contact phone |
| timezone | VARCHAR | Timezone (e.g., America/Los_Angeles) |
| currency | VARCHAR | Currency code (e.g., USD) |
| owner_id | UUID | FK to users (gym owner) |
| status | VARCHAR | Gym status (active, inactive) |

### gym_staff
Links users to gyms as staff members (coaches).

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gym_id | UUID | FK to gyms |
| user_id | UUID | FK to users |
| role | VARCHAR | Role: head_coach, coach, assistant |
| status | VARCHAR | Status: pending, active, inactive |

### disciplines
Martial arts disciplines offered by a gym.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gym_id | UUID | FK to gyms |
| name | VARCHAR | Discipline name (e.g., Brazilian Jiu-Jitsu) |
| slug | VARCHAR | URL-friendly identifier |
| description | TEXT | Description |
| color_code | VARCHAR | Hex color for UI display |
| default_duration_minutes | INTEGER | Default class duration |
| requires_gi | BOOLEAN | Whether gi is required |
| is_active | BOOLEAN | Active status |

### timetables
Weekly schedules for each discipline.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gym_id | UUID | FK to gyms |
| discipline_id | UUID | FK to disciplines |
| name | VARCHAR | Schedule name |
| valid_from | DATE | Start date |
| valid_until | DATE | End date (optional) |
| is_active | BOOLEAN | Active status |
| is_published | BOOLEAN | Visible to members |

### class_slots
Individual class time slots within a timetable.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| timetable_id | UUID | FK to timetables |
| title | VARCHAR | Class title |
| day_of_week | INTEGER | 0=Sunday, 1=Monday, etc. |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| max_capacity | INTEGER | Maximum attendees |
| level | VARCHAR | Skill level (beginner, intermediate, advanced, all) |
| is_active | BOOLEAN | Active status |

### class_slot_coaches
Assigns coaches to class slots.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| class_slot_id | UUID | FK to class_slots |
| user_id | UUID | FK to users (coach) |

### class_concepts
Class content/curriculum for specific dates.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| class_slot_id | UUID | FK to class_slots |
| date | DATE | Specific date |
| title | VARCHAR | Lesson title |
| description | TEXT | Lesson description |
| techniques | JSONB | Techniques covered |

### memberships
User memberships to gyms.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gym_id | UUID | FK to gyms |
| user_id | UUID | FK to users |
| membership_type | VARCHAR | Type: voucher, unlimited |
| started_at | TIMESTAMP | Start date |
| expires_at | TIMESTAMP | Expiration date |
| status | VARCHAR | Status: active, expired, cancelled |

### voucher_packages
Voucher/class packages purchased by members.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| membership_id | UUID | FK to memberships |
| package_name | VARCHAR | Package name |
| total_vouchers | INTEGER | Total vouchers in package |
| remaining_vouchers | INTEGER | Vouchers remaining |
| price_paid | DECIMAL | Purchase price |
| currency | VARCHAR | Currency code |
| expires_at | TIMESTAMP | Package expiration |
| status | VARCHAR | Status: active, expired, depleted |

### voucher_transactions
Records voucher usage.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| voucher_package_id | UUID | FK to voucher_packages |
| attendance_id | UUID | FK to attendances |
| vouchers_used | INTEGER | Number of vouchers used |

### attendances
Class attendance records.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| class_slot_id | UUID | FK to class_slots |
| user_id | UUID | FK to users |
| date | DATE | Attendance date |
| check_in_time | TIMESTAMP | Check-in time |
| status | VARCHAR | Status: checked_in, cancelled, no_show |

### qr_codes
QR codes for check-in.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| gym_id | UUID | FK to gyms |
| code | VARCHAR | QR code value |
| expires_at | TIMESTAMP | Expiration time |

### refresh_tokens
JWT refresh tokens for authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| token | TEXT | JWT refresh token |
| expires_at | TIMESTAMP | Token expiration |
| created_at | TIMESTAMP | Creation time |

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase)

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `DATABASE_URL` with your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
   ```

### Database Commands

```bash
# Run migrations
npm run migrate

# Rollback migrations
npm run migrate:rollback

# Check migration status
npm run migrate:status

# Run seeds (development data)
npm run seed
```

### Seed Data

The seed file creates sample data for development:
- 6 users (1 owner, 3 coaches, 2 students)
- 1 gym (Elite MMA Academy)
- 4 disciplines (BJJ, Muay Thai, Wrestling, MMA)
- 4 timetables with 12 class slots
- 2 memberships with voucher packages

All seed users have the password: `password123`

| Email | Role |
|-------|------|
| owner@mmagym.com | Gym Owner |
| coach.bjj@mmagym.com | Head Coach |
| coach.muaythai@mmagym.com | Coach |
| coach.wrestling@mmagym.com | Coach |
| student1@example.com | Student |
| student2@example.com | Student |
