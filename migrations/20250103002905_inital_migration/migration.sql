-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT NOT NULL DEFAULT '',
    "emailVerificationTokenExpiry" TIMESTAMP(3),
    "provider" TEXT NOT NULL,
    "password" TEXT,
    "subjectId" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'ACCOUNT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user" TEXT,
    "firstName" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "surname" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "phone" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "secondContactName" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "secondContactPhone" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "streetAddress" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "suburb" TEXT NOT NULL DEFAULT 'PLEASE_UPDATE',
    "postcode" INTEGER NOT NULL DEFAULT 3550,
    "xeroId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "surname" TEXT NOT NULL DEFAULT '',
    "dateOfBirth" DATE NOT NULL,
    "school" TEXT NOT NULL,
    "medical" TEXT,
    "account" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "cost" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL,
    "length" TEXT NOT NULL DEFAULT '',
    "description" TEXT,
    "xeroAccountCode" TEXT,

    CONSTRAINT "LessonCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportantDate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "date" DATE NOT NULL,
    "brief" TEXT NOT NULL DEFAULT '',
    "description" TEXT,

    CONSTRAINT "ImportantDate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Term" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "quantity" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "termStatus" TEXT,
    "copyFrom" TEXT,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonTerm" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "term" TEXT,
    "lesson" TEXT,
    "numberOfLessons" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "lessonCategory" TEXT,
    "description" TEXT,
    "cost" INTEGER NOT NULL,
    "time" TEXT NOT NULL DEFAULT '',
    "lengthMin" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "minYear" INTEGER NOT NULL,
    "maxYear" INTEGER NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailSettings" (
    "id" INTEGER NOT NULL,
    "fromEmail" TEXT NOT NULL DEFAULT '',
    "enrolmentConfirmationTemplate" TEXT NOT NULL DEFAULT '',
    "lessonTermMessageTemplate" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EmailSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XeroSettings" (
    "id" INTEGER NOT NULL,
    "tokenSet" JSONB,
    "tenantId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "XeroSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "bio" TEXT,
    "position" TEXT NOT NULL DEFAULT '',
    "image_filesize" INTEGER,
    "image_pathname" TEXT,
    "image_width" INTEGER,
    "image_height" INTEGER,
    "image_contentType" TEXT,
    "image_contentDisposition" TEXT,
    "image_url" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrolment" (
    "id" TEXT NOT NULL,
    "lessonTerm" TEXT,
    "student" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrolment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "content" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonTerm_messages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Lesson_teachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_subjectId_key" ON "User"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_user_key" ON "Account"("user");

-- CreateIndex
CREATE UNIQUE INDEX "Account_xeroId_key" ON "Account"("xeroId");

-- CreateIndex
CREATE INDEX "Student_account_idx" ON "Student"("account");

-- CreateIndex
CREATE UNIQUE INDEX "LessonCategory_slug_key" ON "LessonCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LessonCategory_xeroAccountCode_key" ON "LessonCategory"("xeroAccountCode");

-- CreateIndex
CREATE INDEX "Term_copyFrom_idx" ON "Term"("copyFrom");

-- CreateIndex
CREATE INDEX "LessonTerm_term_idx" ON "LessonTerm"("term");

-- CreateIndex
CREATE INDEX "LessonTerm_lesson_idx" ON "LessonTerm"("lesson");

-- CreateIndex
CREATE INDEX "Lesson_lessonCategory_idx" ON "Lesson"("lessonCategory");

-- CreateIndex
CREATE INDEX "Enrolment_lessonTerm_idx" ON "Enrolment"("lessonTerm");

-- CreateIndex
CREATE INDEX "Enrolment_student_idx" ON "Enrolment"("student");

-- CreateIndex
CREATE UNIQUE INDEX "_LessonTerm_messages_AB_unique" ON "_LessonTerm_messages"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonTerm_messages_B_index" ON "_LessonTerm_messages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Lesson_teachers_AB_unique" ON "_Lesson_teachers"("A", "B");

-- CreateIndex
CREATE INDEX "_Lesson_teachers_B_index" ON "_Lesson_teachers"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_fkey" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_account_fkey" FOREIGN KEY ("account") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Term" ADD CONSTRAINT "Term_copyFrom_fkey" FOREIGN KEY ("copyFrom") REFERENCES "Term"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LessonTerm" ADD CONSTRAINT "LessonTerm_term_fkey" FOREIGN KEY ("term") REFERENCES "Term"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonTerm" ADD CONSTRAINT "LessonTerm_lesson_fkey" FOREIGN KEY ("lesson") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_lessonCategory_fkey" FOREIGN KEY ("lessonCategory") REFERENCES "LessonCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolment" ADD CONSTRAINT "Enrolment_lessonTerm_fkey" FOREIGN KEY ("lessonTerm") REFERENCES "LessonTerm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolment" ADD CONSTRAINT "Enrolment_student_fkey" FOREIGN KEY ("student") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonTerm_messages" ADD CONSTRAINT "_LessonTerm_messages_A_fkey" FOREIGN KEY ("A") REFERENCES "LessonTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonTerm_messages" ADD CONSTRAINT "_LessonTerm_messages_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_teachers" ADD CONSTRAINT "_Lesson_teachers_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Lesson_teachers" ADD CONSTRAINT "_Lesson_teachers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
