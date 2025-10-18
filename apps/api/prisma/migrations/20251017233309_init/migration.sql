-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentText" TEXT,
    "imageUrl" TEXT,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("articleId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_url_key" ON "Article"("url");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategory" ADD CONSTRAINT "ArticleCategory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleCategory" ADD CONSTRAINT "ArticleCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
