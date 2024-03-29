-- CreateTable
CREATE TABLE "CragStats" (
    "cragStatsID" SERIAL NOT NULL,
    "mainClimbingType" INTEGER NOT NULL,
    "beginnerRoutes" INTEGER NOT NULL,
    "experiencedRoutes" INTEGER NOT NULL,
    "advancedRoutes" INTEGER NOT NULL,
    "expertRoutes" INTEGER NOT NULL,
    "eliteRoutes" INTEGER NOT NULL,
    "range" TEXT NOT NULL,
    "cragID" INTEGER NOT NULL,

    CONSTRAINT "CragStats_pkey" PRIMARY KEY ("cragStatsID")
);

-- CreateIndex
CREATE UNIQUE INDEX "CragStats_cragID_key" ON "CragStats"("cragID");

-- AddForeignKey
ALTER TABLE "CragStats" ADD CONSTRAINT "CragStats_cragID_fkey" FOREIGN KEY ("cragID") REFERENCES "Crag"("cragID") ON DELETE RESTRICT ON UPDATE CASCADE;
