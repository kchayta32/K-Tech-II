import { Course } from '@/types';

export const dataCourses: Course[] = [
  {
    id: 'postgresql-advanced-engineering',
    slug: 'postgresql-advanced-engineering',
    title: 'Advanced PostgreSQL: Window Functions, JSONB และ Query Optimization',
    titleEn: 'Advanced PostgreSQL: Window Functions, JSONB & Performance Tuning',
    tagline: 'เจาะลึกฐานข้อมูล PostgreSQL ขั้นสูง: Indexing Strategies, CTEs, Window Functions, JSONB และ EXPLAIN ANALYZE',
    description: 'พัฒนาทักษะวิศวกรรมฐานข้อมูล PostgreSQL ระดับมืออาชีพ เรียนรู้เทคนิคการเขียน Complex SQL, การวิเคราะห์ Execution Plan ด้วย EXPLAIN (ANALYZE, BUFFERS), การเลือกใช้ Index (B-Tree, GIN, GiST, BRIN, Partial Index), การใช้ Window Functions สำหรับ Analytics, การจัดการข้อมูล Semi-structured ด้วย JSONB, และการตั้งค่า Partitioning สำหรับข้อมูลขนาดใหญ่ระดับ Terabyte',
    categoryId: 'data',
    difficulty: 'Advanced',
    estimatedHours: 18,
    instructor: {
      name: 'ชัชวาล เลิศรัตนกุล (Chatchawal L.)',
      role: 'Principal Database Architect & PostgreSQL Core Contributor',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญด้าน Database Internals และการ Optimize ฐานข้อมูลขนาดมหึมาสำหรับ Financial Core Banking Systems',
    },
    rating: 4.96,
    reviewsCount: 395,
    enrolledStudents: 2680,
    tags: ['PostgreSQL', 'SQL', 'Database-Optimization', 'Indexing', 'JSONB', 'Data-Engineering'],
    prerequisites: ['SQL พื้นฐาน (SELECT, INSERT, JOIN, GROUP BY)'],
    learningOutcomes: [
      'เข้าใจและใช้งาน Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, NTILE)',
      'วิเคราะห์และปรับปรุง Query Performance ด้วย EXPLAIN ANALYZE และ Buffer Cache stats',
      'ออกแบบ Index กลยุทธ์ต่างๆ (Covering Index, Partial Index, Expression Index, GIN)',
      'จัดเก็บและประมวลผล JSONB ร่วมกับ Indexing ได้อย่างรวดเร็ว',
      'ออกแบบ Table Partitioning (Range, List, Hash) สำหรับ Big Data Table',
    ],
    badgeIcon: '🐘',
    accentColor: '#336791',
    featured: true,
    modules: [
      {
        id: 'mod-pg-1',
        title: 'โมดูล 1: Advanced SQL & Analytics Window Functions',
        description: 'การคำนวณข้อมูลเชิงลึกข้าม Rows โดยไม่ต้อง Group By ยุบแถวทิ้ง',
        lessons: [
          {
            id: 'pg-window-functions',
            title: '1.1 Deep Dive Window Functions: ROW_NUMBER, RANK, LAG/LEAD และ Framing',
            titleEn: 'Deep Dive into Window Functions: Ranking, Navigation and Framing',
            description: 'ทำความเข้าใจ OVER (PARTITION BY ... ORDER BY ...) และการหา Running Totals กับ Moving Averages',
            durationMinutes: 45,
            type: 'interactive_code',
            visualizerType: 'sql-visualizer',
            contentMarkdown: `### Window Functions ใน PostgreSQL

Window Functions ทำการคำนวณข้ามกลุ่มของแถว (Rowset) โดย**ไม่ทำให้จำนวนแถวของผลลัพธ์ลดลง**เหมือนคำสั่ง \`GROUP BY\`

\`\`\`sql
-- ตัวอย่าง: หาอันดับยอดขายในแต่ละแผนก พร้อมคำนวณส่วนต่างจากคนก่อนหน้า (LAG)
SELECT 
    employee_id,
    department,
    salary,
    -- จัดอันดับเงินเดือนภายในแต่ละแผนก
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept,
    -- ดึงเงินเดือนของคนอันดับก่อนหน้า
    LAG(salary, 1) OVER (PARTITION BY department ORDER BY salary DESC) as prev_higher_salary,
    -- คำนวณ Running Total ของเงินเดือนสะสมในแผนก
    SUM(salary) OVER (
        PARTITION BY department 
        ORDER BY salary DESC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_dept_total
FROM employees;
\`\`\`

#### ประโยชน์ของ Common Table Expressions (CTEs)
\`\`\`sql
WITH MonthlySales AS (
    SELECT 
        DATE_TRUNC('month', order_date) AS sales_month,
        SUM(total_amount) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
SalesWithGrowth AS (
    SELECT 
        sales_month,
        revenue,
        LAG(revenue, 1) OVER (ORDER BY sales_month) AS prev_month_revenue
    FROM MonthlySales
)
SELECT 
    sales_month,
    revenue,
    prev_month_revenue,
    ROUND(((revenue - prev_month_revenue) / prev_month_revenue * 100)::numeric, 2) AS mom_growth_pct
FROM SalesWithGrowth;
\`\`\``,
            exercise: {
              id: 'ex-sql-window-rank',
              title: 'เขียน SQL หา Top 3 สินค้าขายดีในแต่ละหมวด',
              instructions: 'เขียน SQL Query โดยใช้ CTE และ `DENSE_RANK()` เพื่อดึงข้อมูลสินค้าที่อยู่ใน Top 3 ของแต่ละ Category',
              language: 'sql',
              initialCode: `-- เขียนคำสั่ง SQL ค้นหา Top 3 Products ต่อ Category
WITH RankedProducts AS (
    SELECT 
        product_id,
        category,
        sales_count,
        -- TODO: เพิ่ม DENSE_RANK() OVER (...)
        1 as rank
    FROM products
)
SELECT product_id, category, sales_count
FROM RankedProducts
WHERE rank <= 3;`,
              solutionCode: `WITH RankedProducts AS (
    SELECT 
        product_id,
        category,
        sales_count,
        DENSE_RANK() OVER (PARTITION BY category ORDER BY sales_count DESC) as rank
    FROM products
)
SELECT product_id, category, sales_count
FROM RankedProducts
WHERE rank <= 3
ORDER BY category, rank;`,
              hints: ['ใช้ PARTITION BY category เพื่อแบ่งกลุ่มตามหมวดหมู่', 'ORDER BY sales_count DESC เพื่อเรียงจากมากไปน้อย'],
              testCases: [
                {
                  input: 'SELECT * FROM RankedProducts WHERE rank <= 3',
                  expectedOutput: 'Top 3 products per category',
                  description: 'กรองเอาเฉพาะอันดับ 1 ถึง 3 ในแต่ละหมวดหมู่',
                },
              ],
            },
            quiz: [
              {
                id: 'q-pg-rank-diff',
                question: 'ความแตกต่างระหว่าง RANK() และ DENSE_RANK() คือข้อใด?',
                options: [
                  'RANK() คำนวณเฉพาะตัวเลขบวก แต่ DENSE_RANK() รองรับตัวเลขลบ',
                  'เมื่อมีค่าเท่ากัน (Tie) RANK() จะข้ามอันดับถัดไป (เช่น 1, 2, 2, 4) แต่ DENSE_RANK() จะไม่ข้ามอันดับ (เช่น 1, 2, 2, 3)',
                  'DENSE_RANK() ใช้กับข้อมูลข้อความเท่านั้น',
                  'ไม่มีความแตกต่างกัน',
                ],
                correctAnswer: 1,
                explanation: 'RANK() จะเว้นช่องว่างของอันดับหากเกิดการเสมอ (Tie) ทำให้ลำดับถัดไปกระโดดข้ามไป ส่วน DENSE_RANK() จะรันอันดับต่อเนื่องกันโดยไม่ข้ามตัวเลข',
              },
            ],
          },
          {
            id: 'pg-jsonb-gin-index',
            title: '1.2 JSONB Data Type & GIN Indexing',
            titleEn: 'JSONB Operations, Operators and GIN Indexing Strategies',
            description: 'การจัดเก็บ Semi-structured JSON ใน PostgreSQL พร้อมการ Query ด้วย ->, ->>, @> และการใส่ GIN Index',
            durationMinutes: 40,
            type: 'reading',
            contentMarkdown: `### PostgreSQL JSONB: ความยืดหยุ่นระดับ NoSQL บน Relational Database

JSONB จัดเก็บข้อมูล JSON ในรูปแบบ Decomposed Binary Format ทำให้ประมวลผลและสร้าง Index ได้อย่างรวดเร็วมาก

\`\`\`sql
-- สร้างตารางเก็บ Document แบบ JSONB
CREATE TABLE customer_profiles (
    id SERIAL PRIMARY KEY,
    metadata JSONB NOT NULL
);

-- การใส่ GIN Index (Generalized Inverted Index)
CREATE INDEX idx_customer_metadata_gin ON customer_profiles USING GIN (metadata);

-- Query หา Document ที่มี attribute ซ้อนอยู่ (Containment Operator: @>)
SELECT * FROM customer_profiles 
WHERE metadata @> '{"address": {"city": "Bangkok"}, "verified": true}';

-- ดึงค่าเฉพาะ field ออกมาเป็น Text ด้วย ->>
SELECT id, metadata->'user'->>'name' as customer_name
FROM customer_profiles
WHERE (metadata->'account'->>'balance')::numeric > 50000;
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    id: 'mongodb-aggregation-scale',
    slug: 'mongodb-aggregation-scale',
    title: 'MongoDB Aggregation Pipeline และ High-Scale Architecture',
    titleEn: 'MongoDB Aggregation Pipeline & Distributed Architecture',
    tagline: 'วิเคราะห์ข้อมูลระดับลึกด้วย MongoDB Aggregation Framework, Sharding และ Indexing Strategies',
    description: 'ก้าวข้ามการทำ CRUD พื้นฐานสู่การวิเคราะห์ข้อมูลขั้นสูงด้วย MongoDB Aggregation Pipeline ($match, $group, $lookup, $unwind, $facet) เข้าใจ Compound Index, ESR Rule (Equality, Sort, Range), Schema Design Patterns สำหรับระบบขนาดใหญ่ (Bucket, Subset, Outlier patterns) และสถาปัตยกรรม Replica Sets & Sharding',
    categoryId: 'data',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    instructor: {
      name: 'ณัฐดนัย ศักดิ์เจริญ (Natdanai S.)',
      role: 'Lead NoSQL & Big Data Engineer',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      bio: 'ที่ปรึกษาด้าน Document Databases และการออกแบบ Schema สเกลใหญ่สำหรับ E-Commerce Multi-million SKU',
    },
    rating: 4.94,
    reviewsCount: 280,
    enrolledStudents: 1950,
    tags: ['MongoDB', 'NoSQL', 'Aggregation', 'Database-Design', 'Sharding', 'Data-Engineering'],
    prerequisites: ['พื้นฐาน JSON และแนวคิด Document Database'],
    learningOutcomes: [
      'สร้าง Multi-stage Aggregation Pipelines เพื่อประมวลผลข้อมูลที่ซับซ้อน',
      'ทำ Left Outer Join ระหว่าง Collections ด้วย $lookup stage',
      'ออกแบบ Indexes อย่างมีประสิทธิภาพสูงสุดตามกฎ ESR Rule',
      'เลือกใช้ Schema Design Patterns ที่เหมาะสมกับ Workload (Read vs Write heavy)',
      'เข้าใจกลไก Distributed Sharding, Chunk balancing และ Shard Keys',
    ],
    badgeIcon: '🍃',
    accentColor: '#47A248',
    featured: false,
    modules: [
      {
        id: 'mod-mongo-1',
        title: 'โมดูล 1: MongoDB Aggregation Pipeline Deep Dive',
        description: 'เข้าใจการส่งต่อข้อมูลผ่าน Stages ต่างๆ ในการวิเคราะห์ข้อมูลขั้นสูง',
        lessons: [
          {
            id: 'mongo-pipeline-stages',
            title: '1.1 Aggregation Stages: $match, $group, $lookup, $unwind และ $facet',
            titleEn: 'Aggregation Stages: Filtering, Grouping, Joining and Faceting',
            description: 'สร้าง Data Transformation Pipeline เพื่อคำนวณสถิติยอดขายและ Joining Collections',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### MongoDB Aggregation Pipeline

Aggregation Pipeline เปรียบเสมือนสายพานโรงงานที่นำ Documents เข้ามาผ่าน Stage ต่างๆ ทีละขั้น

\`\`\`javascript
db.orders.aggregate([
  // Stage 1: กรองเฉพาะออเดอร์ที่ชำระเงินแล้วในปี 2026 ($match ควรอยู่หน้าสุดเสมอเพื่อใช้ Index)
  {
    $match: {
      status: "COMPLETED",
      createdAt: {
        $gte: ISODate("2026-01-01T00:00:00Z"),
        $lt: ISODate("2027-01-01T00:00:00Z")
      }
    }
  },
  
  // Stage 2: แตก Array ของ items ในออเดอร์ออกมาเป็นเอกสารละ 1 item
  {
    $unwind: "$items"
  },
  
  // Stage 3: จัดกลุ่มตาม Category เพื่อคำนวณยอดขายรวมและจำนวนชิ้น
  {
    $group: {
      _id: "$items.categoryId",
      totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      totalQuantitySold: { $sum: "$items.quantity" },
      avgItemPrice: { $avg: "$items.price" }
    }
  },
  
  // Stage 4: Join หาข้อมูลชื่อ Category จาก Collection 'categories'
  {
    $lookup: {
      from: "categories",
      localField: "_id",
      foreignField: "_id",
      as: "categoryDetails"
    }
  },
  
  // Stage 5: ปรับโครงสร้างผลลัพธ์ให้อ่านง่าย
  {
    $project: {
      categoryName: { $arrayElemAt: ["$categoryDetails.name", 0] },
      totalRevenue: 1,
      totalQuantitySold: 1,
      avgItemPrice: { $round: ["$avgItemPrice", 2] }
    }
  },
  
  // Stage 6: เรียงลำดับจากยอดขายสูงสุด
  {
    $sort: { totalRevenue: -1 }
  }
]);
\`\`\``,
            quiz: [
              {
                id: 'q-mongo-match-order',
                question: 'เหตุใดจึงควรวาง Stage `$match` ไว้ที่จุดเริ่มต้นของ Aggregation Pipeline เสมอ?',
                options: [
                  'เพราะ MongoDB บังคับให้ไวยากรณ์ต้องขึ้นด้วย $match เสมอ',
                  'เพื่อให้สามารถใช้ Index ในการกรองเอกสารได้อย่างรวดเร็ว และลดปริมาณข้อมูลที่ต้องส่งต่อไปยัง Stage ถัดไป',
                  'เพื่อป้องกันไม่ให้เกิด Memory Leak ใน RAM',
                  'เพื่อให้คำสั่ง $unwind ทำงานแบบ Asynchronous',
                ],
                correctAnswer: 1,
                explanation: 'การวาง $match ในขั้นตอนแรกจะช่วยให้ MongoDB สามารถนำ Index มาใช้กรองข้อมูลได้ทันที ทำให้ Pipeline ทำงานกับชุดข้อมูลขนาดเล็กลง ประหยัด RAM และ CPU อย่างมาก',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'elasticsearch-search-analytics',
    slug: 'elasticsearch-search-analytics',
    title: 'Elasticsearch & Full-Text Search: สถาปัตยกรรมค้นหาและความเร็วสูง',
    titleEn: 'Elasticsearch & Full-Text Search: Architecture & Analytics',
    tagline: 'สร้างระบบค้นหาอัจฉริยะ (Search Engine) ด้วย Inverted Index, Query DSL, Aggregations และ Vector Search',
    description: 'ทำความเข้าใจหลักการทำงานเบื้องลึกของ Apache Lucene และ Elasticsearch: Inverted Index, Tokenizers, Filters, Stemming, การเขียน Query DSL (Match, Multi-match, Bool, Range, Function Score), การสร้าง Aggregations สำหรับ Search Facets, การจูน Cluster Shards & Replicas, และการนำ Dense Vector Search เข้ามารวมกับ BM25 Hybrid Search',
    categoryId: 'data',
    difficulty: 'Intermediate',
    estimatedHours: 15,
    instructor: {
      name: 'วรพล รัตนเดช (Worapol R.)',
      role: 'Staff Search & Distributed Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้ออกแบบ Enterprise Search Engine และ Log Analytics Platform รองรับการค้นหากว่า 1,000 QPS',
    },
    rating: 4.92,
    reviewsCount: 240,
    enrolledStudents: 1620,
    tags: ['Elasticsearch', 'Search-Engine', 'Full-Text-Search', 'Inverted-Index', 'Analytics', 'Data'],
    prerequisites: ['ความเข้าใจพื้นฐานเรื่อง REST API และ JSON format'],
    learningOutcomes: [
      'เข้าใจโครงสร้าง Inverted Index และ Lucene Segment Management',
      'ออกแบบ Custom Analyzers (Char Filter, Tokenizer, Token Filter) สำหรับภาษาไทยและอังกฤษ',
      'เขียน Elasticsearch Query DSL ขั้นสูงด้วย Bool queries (must, filter, should, must_not)',
      'สร้าง Metric และ Bucket Aggregations สำหรับ Dashboard และ Search Faceting',
      'ตั้งค่า Shard Allocation, Replication, และ Index Lifecycle Management (ILM)',
    ],
    badgeIcon: '🔍',
    accentColor: '#005571',
    featured: false,
    modules: [
      {
        id: 'mod-es-1',
        title: 'โมดูล 1: Inverted Index และ Query DSL',
        description: 'การจัดเก็บข้อความแบบ Inverted Index และการสืบค้นข้อมูลอย่างแม่นยำ',
        lessons: [
          {
            id: 'es-query-dsl-bool',
            title: '1.1 Elasticsearch Query DSL: Bool Queries, Relevance Scoring (BM25) และ Filter Context',
            titleEn: 'Query DSL: Bool Queries, BM25 Scoring and Filter Context',
            description: 'ความแตกต่างระหว่าง Query Context (Scoring) และ Filter Context (Exact Match & Caching)',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### Elasticsearch Bool Query Architecture

Query DSL ของ Elasticsearch ใช้โครงสร้าง JSON ที่ยืดหยุ่น โดยแบ่ง \`bool\` query ออกเป็น 4 องค์ประกอบสำคัญ:

\`\`\`json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "wireless noise cancelling headphones",
            "fields": ["title^3", "description", "brand^2"],
            "fuzziness": "AUTO"
          }
        }
      ],
      "filter": [
        { "term": { "status": "AVAILABLE" } },
        { "range": { "price": { "gte": 2000, "lte": 15000 } } }
      ],
      "should": [
        { "term": { "badge": "BEST_SELLER" } },
        { "match": { "tags": "bluetooth-5.3" } }
      ],
      "must_not": [
        { "term": { "is_refurbished": true } }
      ]
    }
  },
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 5000 },
          { "from": 5000, "to": 10000 },
          { "from": 10000 }
        ]
      }
    },
    "brands": {
      "terms": {
        "field": "brand.keyword",
        "size": 10
      }
    }
  }
}
\`\`\`

> [!TIP]
> เงื่อนไขภายในบล็อก **\`filter\`** และ **\`must_not\`** จะไม่คำนวณ Relevance Score (BM25) ทำให้ Elasticsearch สามารถนำผลลัพธ์ไปทำ Node Filter Caching ใน RAM ช่วยให้ Query เร็วขึ้นมหาศาล`,
            quiz: [
              {
                id: 'q-es-filter-vs-must',
                question: 'ข้อใดคือความแตกต่างหลักระหว่างการใส่เงื่อนไขในบล็อก `must` และบล็อก `filter`?',
                options: [
                  '`must` ใช้กับตัวเลขเท่านั้น ส่วน `filter` ใช้กับข้อความ',
                  '`must` จะคำนวณคะแนนความเกี่ยวข้อง (Relevance Score) ให้กับ Document ในขณะที่ `filter` จะตรวจแค่ Yes/No โดยไม่มีการคำนวณ Score และถูกแคชได้',
                  '`filter` จะทำให้การค้นหาช้ากว่าเสมอ',
                  '`must` ไม่สามารถใช้งานร่วมกับ boolean query ได้',
                ],
                correctAnswer: 1,
                explanation: 'เงื่อนไขใน `filter` ทำงานแบบ Non-scoring (Filter context) ผลลัพธ์จะเป็น binary Yes/No เท่านั้น จึงประหยัด CPU และถูกแคชใน Bitset Cache ได้ ทำให้เร็วกว่า `must` ซึ่งอยู่ใน Query context',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'redis-high-performance-caching',
    slug: 'redis-high-performance-caching',
    title: 'High-Performance Redis: Data Structures, Caching และ Distributed Locks',
    titleEn: 'High-Performance Redis: Data Structures, Caching & Distributed Locks',
    tagline: 'รีดประสิทธิภาพระดับ In-Memory: Strings, Hashes, Sorted Sets, Streams, Pub/Sub และ Redlock',
    description: 'เรียนรู้การนำ Redis มาใช้งานในระบบ Production ระดับ Ultra-low Latency เจาะลึก Data Structures พื้นฐานและขั้นสูง (Strings, Hashes, Lists, Sets, Sorted Sets, HyperLogLog, Streams), กลยุทธ์การทำ Caching (Cache-aside, Write-through, Cache Stampede prevention), Distributed Locks ด้วย Redlock Algorithm, และการรับประกันความคงทนของข้อมูลด้วย RDB vs AOF Persistence',
    categoryId: 'data',
    difficulty: 'Intermediate',
    estimatedHours: 14,
    instructor: {
      name: 'กิตติศักดิ์ ธรรมรัตน์ (Kittisak T.)',
      role: 'Staff Infrastructure & Performance Engineer',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญด้าน In-Memory Computing และ Caching Architectures ที่รองรับการอ่านข้อมูลระดับ Sub-millisecond',
    },
    rating: 4.95,
    reviewsCount: 360,
    enrolledStudents: 2750,
    tags: ['Redis', 'Caching', 'In-Memory', 'Distributed-Systems', 'Data-Structures', 'Backend'],
    prerequisites: ['ความเข้าใจระบบ Caching และโปรแกรมมิ่งฝั่ง Backend'],
    learningOutcomes: [
      'เลือกใช้ Redis Data Structures ได้ตรงตามประเภทการใช้งานและประหยัดหน่วยความจำ',
      'ออกแบบกลยุทธ์ Caching และแก้ปัญหา Cache Stampede / Thundering Herd',
      'สร้าง Realtime Leaderboard ด้วย Sorted Sets (ZADD, ZREVRANGE, ZRANK)',
      'ทำ Distributed Mutex Locking ที่ปลอดภัยด้วย Redlock Algorithm',
      'ประยุกต์ใช้ Redis Streams สำหรับ Lightweight Message Queue',
    ],
    badgeIcon: '🟥',
    accentColor: '#DC382D',
    featured: true,
    modules: [
      {
        id: 'mod-redis-1',
        title: 'โมดูล 1: Redis Data Structures & Caching Strategies',
        description: 'การใช้งาน Data Structures และรูปแบบการแคชข้อมูลเพื่อลดโหลดฐานข้อมูล',
        lessons: [
          {
            id: 'redis-data-structures-leaderboard',
            title: '1.1 Redis Sorted Sets (ZSET) และการสร้าง Real-time Gaming Leaderboard',
            titleEn: 'Redis Sorted Sets and Real-time Leaderboard Implementation',
            description: 'การใช้งานคำสั่ง ZADD, ZINCRBY, ZREVRANGE, ZRANK เพื่อจัดอันดับคะแนนแบบ Real-time',
            durationMinutes: 40,
            type: 'interactive_code',
            contentMarkdown: `### Redis Sorted Sets (ZSET)

ZSET คือโครงสร้างข้อมูลที่จับคู่ระหว่าง **Member (String)** และ **Score (Double-precision floating point)** โดย Redis จะจัดเรียงลำดับสมาชิกตามคะแนนโดยอัตโนมัติด้วยโครงสร้าง Skip List ทำให้การ Insert, Update, และ Query อันดับมีความเร็วระดับ $O(\\log N)$

\`\`\`typescript
import Redis from 'ioredis';
const redis = new Redis('redis://localhost:6379');

export class LeaderboardService {
  private key = 'leaderboard:weekly:2026-w35';

  // เพิ่มหรืออัปเดตคะแนนของผู้เล่น
  async updateScore(playerId: string, scoreDelta: number) {
    return redis.zincrby(this.key, scoreDelta, playerId);
  }

  // ดึง Top 10 ผู้เล่นที่มีคะแนนสูงสุด
  async getTopPlayers(limit = 10) {
    // WITHSCORES จะคืนค่า [playerId1, score1, playerId2, score2, ...]
    const results = await redis.zrevrange(this.key, 0, limit - 1, 'WITHSCORES');
    const leaderboard = [];
    for (let i = 0; i < results.length; i += 2) {
      leaderboard.push({
        rank: Math.floor(i / 2) + 1,
        playerId: results[i],
        score: parseFloat(results[i + 1]),
      });
    }
    return leaderboard;
  }

  // ดูอันดับปัจจุบันของผู้เล่น (0-indexed -> +1)
  async getPlayerRank(playerId: string) {
    const rank = await redis.zrevrank(this.key, playerId);
    return rank !== null ? rank + 1 : null;
  }
}
\`\`\``,
            exercise: {
              id: 'ex-redis-zset',
              title: 'เขียนฟังก์ชัน Parse Top Players จาก Redis Output',
              instructions: 'เขียนฟังก์ชันแปลง flat array `["user1", "950", "user2", "820"]` ให้กลายเป็น object array `[{ rank: 1, userId: "user1", score: 950 }, { rank: 2, userId: "user2", score: 820 }]`',
              language: 'typescript',
              initialCode: `export function formatLeaderboard(raw: string[]): { rank: number; userId: string; score: number }[] {
  // TODO: แปลง raw flat array เป็น structured leaderboard
  return [];
}`,
              solutionCode: `export function formatLeaderboard(raw: string[]): { rank: number; userId: string; score: number }[] {
  const result = [];
  for (let i = 0; i < raw.length; i += 2) {
    result.push({
      rank: Math.floor(i / 2) + 1,
      userId: raw[i],
      score: parseFloat(raw[i + 1]),
    });
  }
  return result;
}`,
              hints: ['วนลูป step ทีละ 2 (i += 2)', 'ตำแหน่ง i คือ userId และ i + 1 คือ score'],
              testCases: [
                {
                  input: 'formatLeaderboard(["playerA", "100", "playerB", "90"])',
                  expectedOutput: '[{"rank":1,"userId":"playerA","score":100},{"rank":2,"userId":"playerB","score":90}]',
                  description: 'แปลง 2 ผู้เล่นเป็น Object array ถูกต้อง',
                },
              ],
            },
            quiz: [
              {
                id: 'q-redis-zset-complexity',
                question: 'Time Complexity ในการค้นหาอันดับ (ZRANK/ZREVRANK) ใน Redis Sorted Set คือเท่าใด?',
                options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
                correctAnswer: 1,
                explanation: 'Redis Sorted Set ถูกสร้างขึ้นด้วย Skip List ผสม Hash Map ทำให้การเพิ่ม แก้ไข หรือค้นหาอันดับมี Time Complexity อยู่ที่ O(log N)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kafka-event-streaming-architecture',
    slug: 'kafka-event-streaming-architecture',
    title: 'Distributed Event Streaming ด้วย Apache Kafka',
    titleEn: 'Distributed Event Streaming with Apache Kafka',
    tagline: 'สร้างสถาปัตยกรรม Event-Driven ขนาดใหญ่ด้วย Topics, Partitions, Consumer Groups และ Kafka Streams',
    description: 'เรียนรู้ระบบ Distributed Commit Log อันทรงพลังของ Apache Kafka ทำความเข้าใจหัวใจของ Event-Driven Architecture: Broker, Topics, Partitions, Offsets, Producer Idempotency, Consumer Groups & Rebalancing, Exactly-Once Semantics (EOS), การจัดการ Schema Registry ด้วย Avro, และการประมวลผล Realtime Stream ด้วย Kafka Streams',
    categoryId: 'data',
    difficulty: 'Advanced',
    estimatedHours: 18,
    instructor: {
      name: 'อนันต์ วรคุณานนท์ (Anan W.)',
      role: 'Principal Distributed Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้ออกแบบ Event Mesh Infrastructure ที่รองรับการประมวลผลข้อความกว่า 500,000 events/sec',
    },
    rating: 4.97,
    reviewsCount: 410,
    enrolledStudents: 2900,
    tags: ['Kafka', 'Event-Driven', 'Distributed-Systems', 'Streaming', 'Message-Queue', 'Data-Engineering'],
    prerequisites: ['ความเข้าใจสถาปัตยกรรม Microservices และพื้นฐาน Distributed Networks'],
    learningOutcomes: [
      'เข้าใจกลไก Append-only Commit Log และโครงสร้าง Partition / Offset',
      'ออกแบบ Partition Key Strategy เพื่อรับประกันการเรียงลำดับข้อความ (Ordering Guarantee)',
      'จัดการ Consumer Groups, Offset Commit Strategies, และ Consumer Rebalance',
      'ตั้งค่า Idempotent Producer และ Transactional Message เพื่อทำ Exactly-Once Semantics',
      'พัฒนา Real-time Stateful Transformations ด้วย Kafka Streams API',
    ],
    badgeIcon: '⚡',
    accentColor: '#231F20',
    featured: true,
    modules: [
      {
        id: 'mod-kafka-1',
        title: 'โมดูล 1: Apache Kafka Architecture & Partitions',
        description: 'โครงสร้างภายในของ Kafka: Brokers, Logs, Partitions และ Offsets',
        lessons: [
          {
            id: 'kafka-producers-partitioning',
            title: '1.1 Topics, Partitions, Message Keys และการรับประกัน Ordering',
            titleEn: 'Topics, Partitions, Message Keys and Message Ordering Guarantees',
            description: 'หลักการกระจาย Event ลง Partition ด้วย MurmurHash2 และการรับประกันการเรียงลำดับข้อความ',
            durationMinutes: 50,
            type: 'interactive_code',
            visualizerType: 'kafka-stream',
            contentMarkdown: `### โครงสร้าง Partition และการกระจายข้อความใน Kafka

ใน Apache Kafka หัวใจสำคัญของการ Scale คือ **Partitions** ภายใน Topic:

- ข้อความที่มี **Message Key เดียวกัน** จะถูกส่งไปยัง **Partition เดียวกันเสมอ** (ผ่านสูตร \`MurmurHash2(key) % numPartitions\`)
- ภายในแต่ละ Partition ข้อความจะได้รับการจัดเก็บตามลำดับเวลาที่แน่นอนและมีหมายเลข **Offset** ประจำตัวแบบ Sequential
- **Kafka รับประกันการเรียงลำดับ (Ordering Guarantee) ภายใน Partition เดียวกันเท่านั้น** ไม่รับประกันข้าม Partitions!

\`\`\`typescript
import { Kafka, Partitioners } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  idempotent: true, // ป้องกันการส่งข้อความซ้ำ (Exactly-once delivery to broker)
});

export async function publishOrderEvent(order: { id: string; customerId: string; amount: number }) {
  await producer.connect();

  await producer.send({
    topic: 'ecommerce.orders.events',
    messages: [
      {
        key: order.customerId, // ใช้ customerId เป็น Key เพื่อให้ออเดอร์ของลูกค้ารายนี้เรียงลำดับถูกต้องเสมอ
        value: JSON.stringify({
          eventType: 'ORDER_PLACED',
          orderId: order.id,
          amount: order.amount,
          timestamp: Date.now(),
        }),
        headers: { 'source-system': 'web-checkout' },
      },
    ],
  });
}
\`\`\``,
            quiz: [
              {
                id: 'q-kafka-ordering',
                question: 'หากเราต้องการให้ Event ทั้งหมดของลูกค้ารายหนึ่งถูกประมวลผลตามลำดับก่อนหลังอย่างเคร่งครัด ควรทำอย่างไรใน Kafka?',
                options: [
                  'สร้าง Topic แยกต่างหากสำหรับลูกค้าแต่ละคน',
                  'กำหนด Message Key ให้เป็น Customer ID เพื่อให้ข้อความของลูกค้ารายนั้นตกลงใน Partition เดียวกันเสมอ',
                  'ตั้งค่า Consumer ให้รันเพียง Thread เดียว',
                  'ปิดระบบ Replication บน Broker',
                ],
                correctAnswer: 1,
                explanation: 'การกำหนด Key เดียวกัน (เช่น Customer ID) จะทำให้ Producer Hash ข้อความลงสู่ Partition เดิมเสมอ ซึ่งภายใน Partition เดียวกัน Kafka จะรับประกันการเรียงลำดับข้อความแบบ Strict Ordering',
              },
            ],
          },
        ],
      },
    ],
  },
];
