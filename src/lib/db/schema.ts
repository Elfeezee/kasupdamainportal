import { mysqlTable, serial, varchar, text, timestamp, boolean, bigint, decimal, json } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(), // Renamed from uid
  name: text('name'),
  email: varchar('email', { length: 255 }).unique(),
  password: text('password'), // For credentials login
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  phone: text('phone'),
  role: text('role').default('Applicant'),
  din: text('din'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const applications = mysqlTable('applications', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  type: text('type').notNull(),
  applicant_name: text('applicant_name').notNull(),
  status: text('status').notNull().default('Pending'),
  data: json('data'),
  rejection_reason: text('rejection_reason'),
  din: text('din'),
  din_id: bigint('din_id', { mode: 'number' }),
  original_permit_id: text('original_permit_id'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const transactions = mysqlTable('transactions', {
  id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  application_id: bigint('application_id', { mode: 'number' }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  description: text('description'),
  payment_reference: varchar('payment_reference', { length: 255 }).unique().notNull(),
  payment_link: text('payment_link'),
  status: varchar('status', { length: 50 }).notNull().default('Pending'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  last_verified_at: timestamp('last_verified_at'),
  payer_name: text('payer_name'),
  payer_email: text('payer_email'),
  payer_phone: text('payer_phone'),
});

export const payments = mysqlTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  user_id: varchar('user_id', { length: 36 }).notNull(),
  application_id: bigint('application_id', { mode: 'number' }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('Pending'),
  description: text('description'),
  transaction_ref: text('transaction_ref'),
  provider: text('provider'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const contact_messages = mysqlTable('contact_messages', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const news_items = mysqlTable('news_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: text('title').notNull(),
  summary: text('summary'),
  content: text('content'),
  date: timestamp('date').default(sql`CURRENT_TIMESTAMP`),
  image_url: text('image_url'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const publications = mysqlTable('publications', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: text('title').notNull(),
  type: text('type'),
  summary: text('summary'),
  download_url: text('download_url'),
  image_url: text('image_url'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const site_statistics = mysqlTable('site_statistics', {
  id: varchar('id', { length: 36 }).primaryKey(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  icon: text('icon'),
  display_order: bigint('display_order', { mode: 'number' }).default(0),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const site_events = mysqlTable('site_events', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: text('title').notNull(),
  event_date: timestamp('event_date').notNull(),
  date_text: text('date_text'),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const site_leadership = mysqlTable('site_leadership', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  role: text('role'),
  bio: text('bio'),
  full_bio: text('full_bio'),
  image_url: text('image_url'),
  display_order: bigint('display_order', { mode: 'number' }).default(0),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const site_carousel = mysqlTable('site_carousel', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: text('title'),
  subtitle: text('subtitle'),
  alt_text: text('alt_text'),
  image_url: text('image_url'),
  display_order: bigint('display_order', { mode: 'number' }).default(0),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

export const site_mda_logos = mysqlTable('site_mda_logos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  logo_url: text('logo_url'),
  display_order: bigint('display_order', { mode: 'number' }).default(0),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').onUpdateNow(),
});

// Relations
import { relations } from 'drizzle-orm';

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  user: one(users, {
    fields: [applications.user_id],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.user_id],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [transactions.application_id],
    references: [applications.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
  transactions: many(transactions),
}));

// NextAuth Tables
export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 })
      .notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: bigint("expires_at", { mode: "number" }),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: {
      columns: [account.provider, account.providerAccountId],
    },
  })
);

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: {
      columns: [vt.identifier, vt.token],
    },
  })
);
