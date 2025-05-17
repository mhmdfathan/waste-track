-- Reset sequences and clean existing data
TRUNCATE TABLE "public"."user_roles" CASCADE;
TRUNCATE TABLE "public"."WasteListing" CASCADE;
TRUNCATE TABLE "public"."Transaction" CASCADE;
TRUNCATE TABLE "public"."TimbangData" CASCADE;
TRUNCATE TABLE "public"."MonthlyStatistics" CASCADE;
TRUNCATE TABLE "public"."Statistics" CASCADE;
TRUNCATE TABLE "public"."CompanyProfile" CASCADE;
TRUNCATE TABLE "public"."PickupSchedule" CASCADE;

-- Insert sample UserRoles (assuming these UUIDs match your Supabase auth users)
INSERT INTO "public"."user_roles" ("id", "user_id", "role", "saldo", "nilaiTimbang", "name", "email", "address", "latitude", "longitude", "createdAt", "isActive")
VALUES
    ('clhqwktp50000mp08bhxl1q1q', '123e4567-e89b-12d3-a456-426614174000', 'NASABAH', 500000, 250, 'John Doe', 'john@example.com', 'Jl. Nasabah No. 1, Jakarta', -6.2088, 106.8456, NOW(), true),
    ('clhqwktp50001mp08g7xl2w2w', '223e4567-e89b-12d3-a456-426614174001', 'PERUSAHAAN', 1000000, 0, 'PT Recycling Sejahtera', 'company@recycling.ltd', 'Jl. Industri No. 5, Bandung', -6.9175, 107.6191, NOW(), true),
    ('clhqwktp50002mp08k9xl3e3e', '323e4567-e89b-12d3-a456-426614174002', 'PEMERINTAH', 0, 0, 'Dinas Lingkungan Hidup', 'dlh@jakarta.go.id', 'Jl. Pemerintah No. 10, Jakarta', -6.1751, 106.8650, NOW(), true),
    ('clhqwktp50003mp08m2xl4r4r', '423e4567-e89b-12d3-a456-426614174003', 'NASABAH', 250000, 100, 'Jane Smith', 'jane@example.com', 'Jl. Nasabah No. 2, Jakarta', -6.2156, 106.8451, NOW(), true),
    ('clhqwktp50004mp08p5xl5t5t', '523e4567-e89b-12d3-a456-426614174004', 'PERUSAHAAN', 750000, 0, 'PT Green Solutions', 'info@greensolutions.com', 'Jl. Hijau No. 15, Surabaya', -7.2575, 112.7521, NOW(), true),
    ('clhqwktp50007mp08u1xl8i8i', '623e4567-e89b-12d3-a456-426614174005', 'PERUSAHAAN', 1000000, 0, 'EcoWaste Solutions', 'admin@ecowaste.com', 'Jl. Lingkungan No. 25, Jakarta', -6.2000, 106.8167, NOW(), true);

-- Insert CompanyProfiles
INSERT INTO "public"."CompanyProfile" ("id", "companyName", "address", "latitude", "longitude", "phone", "description", "logo", "website", "deliveryRadius", "deliveryFeeBase", "feePerKm", "acceptedWasteTypes", "userId", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50005mp08r7xl6y6y', 'PT Recycling Sejahtera', 'Jl. Industri No. 5, Bandung', -6.9175, 107.6191, '08123456789', 'Specialist in recycling all types of waste materials', 'https://example.com/logos/recycling.png', 'https://recycling.ltd', 50, 10000, 1000, ARRAY['RECYCLABLE', 'NON_RECYCLABLE']::public."WasteType"[], '223e4567-e89b-12d3-a456-426614174001', NOW(), NOW()),
    ('clhqwktp50006mp08t9xl7u7u', 'PT Green Solutions', 'Jl. Hijau No. 15, Surabaya', -7.2575, 112.7521, '08198765432', 'Eco-friendly waste management solutions', 'https://example.com/logos/green.png', 'https://greensolutions.com', 40, 12000, 1200, ARRAY['RECYCLABLE']::public."WasteType"[], '523e4567-e89b-12d3-a456-426614174004', NOW(), NOW()),
    ('clhqwktp50008mp08v3xl9o9o', 'EcoWaste Solutions', 'Jl. Lingkungan No. 25, Jakarta', -6.2000, 106.8167, '08111222333', 'Leading provider of sustainable waste management', 'https://example.com/logos/ecowaste.png', 'https://ecowaste.com', 45, 11000, 1100, ARRAY['RECYCLABLE', 'NON_RECYCLABLE']::public."WasteType"[], '623e4567-e89b-12d3-a456-426614174005', NOW(), NOW());

-- Insert WasteListings
INSERT INTO "public"."WasteListing" ("id", "title", "description", "price", "imageUrl", "wasteType", "weight", "authorId", "authorName", "authorImage", "status", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50007mp08v2xl8i8i', 'Plastic Bottles Collection', 'Clean plastic bottles ready for recycling', 50000, 'https://example.com/images/plastic-bottles.jpg', 'RECYCLABLE', 5.5, '123e4567-e89b-12d3-a456-426614174000', 'John Doe', 'https://example.com/avatars/john.jpg', 'AVAILABLE', NOW(), NOW()),
    ('clhqwktp50008mp08x4xl9o9o', 'Paper Waste Bundle', 'Mixed paper waste including newspapers and magazines', 30000, 'https://example.com/images/paper-waste.jpg', 'RECYCLABLE', 3.2, '423e4567-e89b-12d3-a456-426614174003', 'Jane Smith', 'https://example.com/avatars/jane.jpg', 'AVAILABLE', NOW(), NOW());

-- Insert Transactions
INSERT INTO "public"."Transaction" ("id", "amount", "status", "type", "description", "deliveryFee", "deliveryDistance", "isDeliveryFree", "wasteListingId", "sellerId", "buyerId", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50009mp08z6xl0a0a', 50000, 'COMPLETED', 'WASTE_LISTING_SALE', 'Purchase of plastic bottles collection', 10000, 5.2, false, 'clhqwktp50007mp08v2xl8i8i', '123e4567-e89b-12d3-a456-426614174000', '223e4567-e89b-12d3-a456-426614174001', NOW(), NOW()),
    ('clhqwktp50010mp0812xl1b1b', 30000, 'PENDING', 'WASTE_LISTING_SALE', 'Purchase of paper waste bundle', 12000, 6.5, false, 'clhqwktp50008mp08x4xl9o9o', '423e4567-e89b-12d3-a456-426614174003', '523e4567-e89b-12d3-a456-426614174004', NOW(), NOW());

-- Insert TimbangData
INSERT INTO "public"."TimbangData" ("id", "weight", "wasteType", "value", "nasabahId", "transactionId", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50011mp0834xl2c2c', 10.5, 'RECYCLABLE', 105000, '123e4567-e89b-12d3-a456-426614174000', 'clhqwktp50009mp08z6xl0a0a', NOW(), NOW()),
    ('clhqwktp50012mp0856xl3d3d', 7.2, 'RECYCLABLE', 72000, '423e4567-e89b-12d3-a456-426614174003', 'clhqwktp50010mp0812xl1b1b', NOW(), NOW());

-- Insert PickupSchedules
INSERT INTO "public"."PickupSchedule" ("id", "scheduledAt", "status", "notes", "pickupAddress", "pickupLatitude", "pickupLongitude", "distance", "transactionId", "companyId", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50013mp0878xl4e4e', NOW() + INTERVAL '2 days', 'SCHEDULED', 'Please call before pickup', 'Jl. Nasabah No. 1, Jakarta', -6.2088, 106.8456, 5.2, 'clhqwktp50009mp08z6xl0a0a', 'clhqwktp50005mp08r7xl6y6y', NOW(), NOW()),
    ('clhqwktp50014mp0890xl5f5f', NOW() + INTERVAL '3 days', 'SCHEDULED', 'Ring the doorbell twice', 'Jl. Nasabah No. 2, Jakarta', -6.2156, 106.8451, 6.5, 'clhqwktp50010mp0812xl1b1b', 'clhqwktp50006mp08t9xl7u7u', NOW(), NOW());

-- Insert MonthlyStatistics
INSERT INTO "public"."MonthlyStatistics" ("id", "month", "year", "wasteType", "totalTransactions", "totalVolume", "totalValue", "createdAt", "updatedAt")
VALUES
    ('clhqwktp50015mp0812xl6g6g', 5, 2025, 'RECYCLABLE', 10, 50.5, 505000, NOW(), NOW()),
    ('clhqwktp50016mp0834xl7h7h', 5, 2025, 'NON_RECYCLABLE', 5, 25.3, 126500, NOW(), NOW());

-- Insert Statistics
INSERT INTO "public"."Statistics" ("id", "totalTransactions", "totalVolume", "totalTimbangWeight", "totalValue", "wasteTypeMetrics", "updatedAt")
VALUES
    ('clhqwktp50017mp0856xl8i8i', 15, 75.8, 17.7, 631500, '{"RECYCLABLE": {"transactions": 10, "volume": 50.5, "value": 505000}, "NON_RECYCLABLE": {"transactions": 5, "volume": 25.3, "value": 126500}}', NOW());
