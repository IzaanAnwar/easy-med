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

export const usersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { enum: ["user", "doctor", "admin"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const doctorsTable = pgTable("doctors", {
  id: text("id")
    .primaryKey()
    .references(() => usersTable.id)
    .$defaultFn(() => crypto.randomUUID()),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminsTable = pgTable("admins", {
  id: text("id")
    .primaryKey()
    .references(() => usersTable.id)
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const appointmentsTable = pgTable(
  "appointments",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorsTable.id),
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

export const schedulesTable = pgTable(
  "schedules",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorsTable.id),
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

export const symptomsTable = pgTable("symptoms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  symptomDescription: text("symptom_description").notNull(),
  severity: integer("severity").notNull(),
  dateReported: timestamp("date_reported").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const prescriptionsTable = pgTable("prescriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  appointmentId: text("appointment_id")
    .notNull()
    .references(() => appointmentsTable.id),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctorsTable.id),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id),
  diagnosis: text("diagnosis").notNull(),
  interactionDetails: text("interaction_details").notNull(),
  medicines: text("medicines").notNull(),
  dosageInstructions: text("dosage_instructions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const adminLogsTable = pgTable("admin_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adminId: text("admin_id")
    .notNull()
    .references(() => adminsTable.id),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// table relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  doctor: one(doctorsTable),
  admin: one(adminsTable),
  appointments: many(appointmentsTable),
  symptoms: many(symptomsTable),
}));

export const doctorsRelations = relations(doctorsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [doctorsTable.id],
    references: [usersTable.id],
  }),
  appointments: many(appointmentsTable),
  schedules: many(schedulesTable),
}));

export const adminsRelations = relations(adminsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [adminsTable.id],
    references: [usersTable.id],
  }),
}));

export const appointmentsRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [appointmentsTable.userId],
      references: [usersTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [appointmentsTable.doctorId],
      references: [doctorsTable.id],
    }),
  })
);

export const schedulesRelations = relations(schedulesTable, ({ one }) => ({
  doctor: one(doctorsTable, {
    fields: [schedulesTable.doctorId],
    references: [doctorsTable.id],
  }),
}));

export const symptomsRelations = relations(symptomsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [symptomsTable.userId],
    references: [usersTable.id],
  }),
}));

export const prescriptionsRelations = relations(
  prescriptionsTable,
  ({ one }) => ({
    appointment: one(appointmentsTable, {
      fields: [prescriptionsTable.appointmentId],
      references: [appointmentsTable.id],
    }),
    doctor: one(doctorsTable, {
      fields: [prescriptionsTable.doctorId],
      references: [doctorsTable.id],
    }),
    user: one(usersTable, {
      fields: [prescriptionsTable.userId],
      references: [usersTable.id],
    }),
  })
);

export const adminLogsRelations = relations(adminLogsTable, ({ one }) => ({
  admin: one(adminsTable, {
    fields: [adminLogsTable.adminId],
    references: [adminsTable.id],
  }),
}));
