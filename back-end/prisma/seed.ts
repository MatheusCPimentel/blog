import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const posts = [
    {
      title: "Getting Started with TypeScript",
      content: `TypeScript is a powerful programming language that builds on JavaScript by adding static type definitions. It helps catch errors early and makes your code more maintainable.

Key benefits include better IDE support, early error detection, and improved code documentation through types.`,
      excerpt:
        "Learn the basics of TypeScript and why it's useful for JavaScript developers.",
      slug: "getting-started-with-typescript",
      viewCount: 245,
    },
    {
      title: "Building REST APIs with Express",
      content: `Express.js is a minimal and flexible Node.js web application framework. It provides a robust set of features for building web and mobile applications.

In this post, we cover the basics of setting up an Express server, creating routes, and handling middleware.`,
      excerpt: "Learn how to build REST APIs using Express.js framework.",
      slug: "building-rest-apis-express",
      viewCount: 189,
    },
    {
      title: "Modern CSS Features",
      content: `CSS has evolved significantly in recent years. New features like CSS Grid, Flexbox, and CSS Variables have revolutionized how we style web applications.

These tools make it easier to create responsive, maintainable stylesheets.`,
      excerpt: "Explore the latest CSS features for modern web development.",
      slug: "modern-css-features",
      viewCount: 312,
    },
    {
      title: "Database Design Basics",
      content: `Good database design is crucial for application performance and maintainability. Understanding relationships, normalization, and indexing helps create efficient databases.

Start with identifying entities and their relationships, then optimize for your specific use case.`,
      excerpt:
        "Learn fundamental concepts of database design and optimization.",
      slug: "database-design-basics",
      viewCount: 156,
    },
    {
      title: "JavaScript Best Practices",
      content: `Writing clean, maintainable JavaScript is essential for any web developer. Focus on consistent naming conventions, proper error handling, and modular code structure.

Use modern ES6+ features like arrow functions, destructuring, and modules to write more concise code.`,
      excerpt: "Essential JavaScript best practices for cleaner code.",
      slug: "javascript-best-practices",
      viewCount: 198,
    },
  ];

  for (const postData of posts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    });
  }

  console.log(`✅ Created ${posts.length} posts`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
