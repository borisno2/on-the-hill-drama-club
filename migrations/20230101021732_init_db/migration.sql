-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerificationToken` VARCHAR(191) NOT NULL DEFAULT '',
    `emailVerificationTokenExpiry` DATETIME(3) NULL,
    `provider` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `subjectId` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `User_subjectId_key`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `user` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    `surname` VARCHAR(191) NOT NULL DEFAULT '',
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `streetAddress` VARCHAR(191) NOT NULL DEFAULT '',
    `suburb` VARCHAR(191) NOT NULL DEFAULT '',
    `postcode` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Account_user_key`(`user`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL DEFAULT '',
    `surname` VARCHAR(191) NOT NULL DEFAULT '',
    `dateOfBirth` DATE NOT NULL,
    `school` VARCHAR(191) NOT NULL,
    `yearLevel` INTEGER NOT NULL,
    `medical` TEXT NULL,
    `account` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Student_account_idx`(`account`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lesson` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `time` VARCHAR(191) NOT NULL DEFAULT '',
    `day` VARCHAR(191) NOT NULL,
    `minYear` INTEGER NOT NULL,
    `maxYear` INTEGER NOT NULL,
    `cost` DECIMAL(18, 2) NULL,
    `quantity` INTEGER NULL,
    `startDate` DATE NULL,
    `endDate` DATE NULL,
    `type` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enrolment` (
    `id` VARCHAR(191) NOT NULL,
    `lesson` VARCHAR(191) NULL,
    `student` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Enrolment_lesson_idx`(`lesson`),
    INDEX `Enrolment_student_idx`(`student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bill` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `account` VARCHAR(191) NULL,
    `date` DATE NULL,
    `dueDate` DATE NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Bill_account_idx`(`account`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BillItem` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `bill` VARCHAR(191) NULL,
    `quantity` INTEGER NULL,
    `amount` DECIMAL(18, 2) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BillItem_bill_idx`(`bill`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
