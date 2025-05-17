-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('NASABAH', 'PERUSAHAAN', 'PEMERINTAH');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('WASTE_LISTING_SALE', 'TIMBANG_SUBMISSION');

-- CreateEnum
CREATE TYPE "public"."WasteType" AS ENUM ('RECYCLABLE', 'NON_RECYCLABLE');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PickupStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ListingStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."WasteListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "wasteType" "public"."WasteType" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorImage" TEXT NOT NULL,
    "status" "public"."ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WasteListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "public"."Role" NOT NULL,
    "saldo" INTEGER NOT NULL DEFAULT 0,
    "nilaiTimbang" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "type" "public"."TransactionType" NOT NULL,
    "description" TEXT,
    "deliveryFee" INTEGER,
    "deliveryDistance" DOUBLE PRECISION,
    "isDeliveryFree" BOOLEAN,
    "wasteListingId" TEXT,
    "sellerId" UUID NOT NULL,
    "buyerId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimbangData" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "wasteType" "public"."WasteType" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nasabahId" UUID NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "TimbangData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonthlyStatistics" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "wasteType" "public"."WasteType" NOT NULL,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "totalVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalValue" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyStatistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Statistics" (
    "id" TEXT NOT NULL,
    "totalTransactions" INTEGER NOT NULL DEFAULT 0,
    "totalVolume" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalTimbangWeight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalValue" INTEGER NOT NULL DEFAULT 0,
    "wasteTypeMetrics" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyProfile" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "deliveryRadius" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "deliveryFeeBase" INTEGER NOT NULL DEFAULT 10000,
    "feePerKm" INTEGER NOT NULL DEFAULT 1000,
    "acceptedWasteTypes" "public"."WasteType"[],
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PickupSchedule" (
    "id" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "public"."PickupStatus" NOT NULL DEFAULT 'SCHEDULED',
    "notes" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "pickupLatitude" DOUBLE PRECISION NOT NULL,
    "pickupLongitude" DOUBLE PRECISION NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PickupSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_user_id_key" ON "public"."user_roles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TimbangData_transactionId_key" ON "public"."TimbangData"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyStatistics_month_year_wasteType_key" ON "public"."MonthlyStatistics"("month", "year", "wasteType");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_userId_key" ON "public"."CompanyProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PickupSchedule_transactionId_key" ON "public"."PickupSchedule"("transactionId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_wasteListingId_fkey" FOREIGN KEY ("wasteListingId") REFERENCES "public"."WasteListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."user_roles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."user_roles"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimbangData" ADD CONSTRAINT "TimbangData_nasabahId_fkey" FOREIGN KEY ("nasabahId") REFERENCES "public"."user_roles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimbangData" ADD CONSTRAINT "TimbangData_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyProfile" ADD CONSTRAINT "CompanyProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_roles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PickupSchedule" ADD CONSTRAINT "PickupSchedule_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PickupSchedule" ADD CONSTRAINT "PickupSchedule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
