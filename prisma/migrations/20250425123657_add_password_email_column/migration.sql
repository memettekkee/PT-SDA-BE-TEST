/*
  Warnings:

  - Added the required column `email` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "merchants" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
