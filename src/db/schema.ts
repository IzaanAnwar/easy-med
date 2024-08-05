import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  time,
  date,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { enum: ["user", "doctor", "admin"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: text("id")
    .primaryKey()
    .references(() => users.id)
    .$defaultFn(() => crypto.randomUUID()),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const admins = pgTable("admins", {
  id: text("id")
    .primaryKey()
    .references(() => users.id)
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),
    appointmentDate: date("appointment_date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    status: varchar("status", {
      enum: ["pending", "confirmed", "cancelled", "completed"],
    }).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId),
      doctorIdIdx: index("doctor_id_idx").on(table.doctorId),
      appointmentDateIdx: index("appointment_date_idx").on(
        table.appointmentDate
      ),
    };
  }
);

export const schedules = pgTable(
  "schedules",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),
    dayOfWeek: varchar("day_of_week", {
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    }).notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    isAvailable: boolean("is_available").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      doctorScheduleIdx: uniqueIndex("doctor_schedule_idx").on(
        table.doctorId,
        table.dayOfWeek
      ),
    };
  }
);

export const symptoms = pgTable("symptoms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  symptomDescription: text("symptom_description").notNull(),
  severity: integer("severity").notNull(),
  dateReported: timestamp("date_reported").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointments.id),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  diagnosis: text("diagnosis").notNull(),
  interactionDetails: text("interaction_details").notNull(),
  medicines: text("medicines").notNull(),
  dosageInstructions: text("dosage_instructions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adminId: text("admin_id")
    .notNull()
    .references(() => admins.id),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// table relations
export const usersRelations = relations(users, ({ one, many }) => ({
  doctor: one(doctors),
  admin: one(admins),
  appointments: many(appointments),
  symptoms: many(symptoms),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.id],
    references: [users.id],
  }),
  appointments: many(appointments),
  schedules: many(schedules),
}));

export const adminsRelations = relations(admins, ({ one }) => ({
  user: one(users, {
    fields: [admins.id],
    references: [users.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  doctor: one(doctors, {
    fields: [schedules.doctorId],
    references: [doctors.id],
  }),
}));

export const symptomsRelations = relations(symptoms, ({ one }) => ({
  user: one(users, {
    fields: [symptoms.userId],
    references: [users.id],
  }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  appointment: one(appointments, {
    fields: [prescriptions.appointmentId],
    references: [appointments.id],
  }),
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
    references: [doctors.id],
  }),
  user: one(users, {
    fields: [prescriptions.userId],
    references: [users.id],
  }),
}));

export const adminLogsRelations = relations(adminLogs, ({ one }) => ({
  admin: one(admins, {
    fields: [adminLogs.adminId],
    references: [admins.id],
  }),
}));
