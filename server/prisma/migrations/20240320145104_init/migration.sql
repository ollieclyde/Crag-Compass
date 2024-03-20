-- CreateTable
CREATE TABLE "Crag" (
    "crag_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "climbs" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "ukcURL" TEXT NOT NULL,
    "altitude" INTEGER NOT NULL,
    "faces" TEXT NOT NULL,
    "googleMapsURL" TEXT NOT NULL,
    "osx" TEXT NOT NULL,
    "osy" TEXT NOT NULL,
    "climbing_type_id" TEXT NOT NULL,

    CONSTRAINT "Crag_pkey" PRIMARY KEY ("crag_id")
);

-- CreateTable
CREATE TABLE "ClimbingType" (
    "climbing_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ClimbingType_pkey" PRIMARY KEY ("climbing_type_id")
);

-- CreateTable
CREATE TABLE "CragInfo" (
    "id" SERIAL NOT NULL,
    "img" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "approach" TEXT NOT NULL,
    "accessType" INTEGER NOT NULL,
    "accessNotes" TEXT NOT NULL,
    "crag_id" INTEGER NOT NULL,

    CONSTRAINT "CragInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "route_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "logs" INTEGER NOT NULL,
    "crag_id" INTEGER NOT NULL,
    "climbing_type_id" INTEGER NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "_ClimbingTypeToCrag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Crag_crag_id_key" ON "Crag"("crag_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClimbingType_climbing_type_id_key" ON "ClimbingType"("climbing_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "CragInfo_crag_id_key" ON "CragInfo"("crag_id");

-- CreateIndex
CREATE UNIQUE INDEX "Route_route_id_key" ON "Route"("route_id");

-- CreateIndex
CREATE UNIQUE INDEX "Route_climbing_type_id_key" ON "Route"("climbing_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ClimbingTypeToCrag_AB_unique" ON "_ClimbingTypeToCrag"("A", "B");

-- CreateIndex
CREATE INDEX "_ClimbingTypeToCrag_B_index" ON "_ClimbingTypeToCrag"("B");

-- AddForeignKey
ALTER TABLE "CragInfo" ADD CONSTRAINT "CragInfo_crag_id_fkey" FOREIGN KEY ("crag_id") REFERENCES "Crag"("crag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_crag_id_fkey" FOREIGN KEY ("crag_id") REFERENCES "Crag"("crag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_climbing_type_id_fkey" FOREIGN KEY ("climbing_type_id") REFERENCES "ClimbingType"("climbing_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClimbingTypeToCrag" ADD CONSTRAINT "_ClimbingTypeToCrag_A_fkey" FOREIGN KEY ("A") REFERENCES "ClimbingType"("climbing_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClimbingTypeToCrag" ADD CONSTRAINT "_ClimbingTypeToCrag_B_fkey" FOREIGN KEY ("B") REFERENCES "Crag"("crag_id") ON DELETE CASCADE ON UPDATE CASCADE;
