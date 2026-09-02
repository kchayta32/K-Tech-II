# 🚀 K-Tech | Modern Tech MOOC Platform

> **แพลตฟอร์มการเรียนรู้วิทยาการคอมพิวเตอร์และวิศวกรรมเทคโนโลยีขั้นสูง สไตล์ MOOC** (เช่น mooc.fi) พร้อมระบบ Interactive Code Playground, สถาปัตยกรรม Visualizer จำลองแบบ Real-time, ระบบตรวจแบบฝึกหัดอัตโนมัติ และใบประกาศนียบัตรดิจิทัล

🔗 **Live Deployment:** [https://k-tech.vercel.app/](https://k-tech.vercel.app/)  
📦 **GitHub Repository:** [https://github.com/kchayta32/K-Tech](https://github.com/kchayta32/K-Tech)

---

## 🌟 ฟีเจอร์หลักของระบบ (Core Features)

1. **สถาปัตยกรรม MOOC Classroom เสมือนจริง**:
   - หน้าเรียนรู้แบบ Dual-Pane แบ่งหน้าจอระหว่างทฤษฎีและ Code Lab
   - สารบัญบทเรียนพร้อมแถบสถานะ Checkpoint และบันทึกความคืบหน้าอัตโนมัติ
   - ปุ่มย้อนกลับ/ถัดไป พร้อมการคำนวณ XP และ Streak รายวัน

2. **Interactive Monaco Code Runner & Test Suite**:
   - จำลองการเขียนและรันโค้ดสด (TypeScript, JavaScript, Python, SQL, HTML)
   - ระบบ Test Cases อัตโนมัติ (Expected vs Actual Output)
   - ระบบคำใบ้แบบ Progressive Hints และปุ่มเปิดดูเฉลยอย่างเป็นทางการ
   - เอฟเฟกต์พลุเฉลิมฉลอง (Canvas Confetti) เมื่อทำแบบฝึกหัดผ่าน

3. **แบบทดสอบวัดผลความรู้ (Knowledge Quizzes)**:
   - ตรวจคำตอบแบบทันทีพร้อมคำอธิบายเฉลยภาษาไทยอย่างละเอียด
   - คำนวณเกรดและระดับเกียรตินิยม (Distinction ≥80%)

4. **Visualizer Sandboxes สำหรับระบบซับซ้อน**:
   - **D3.js Data Viz Sandbox**: กราฟแท่งและแบบจำลอง Force-directed microservice network
   - **Kafka Stream Visualizer**: จำลองการส่ง Message ข้าม Topic Partitions และ Consumer Groups
   - **Kubernetes Cluster Visualizer**: จำลอง Master/Worker Nodes, Pod Auto-scaling และ Ingress Routing
   - **Neural Network Visualizer**: จำลอง Multi-layer Perceptron และ Decision Boundary

5. **ใบประกาศนียบัตรดิจิทัล (Verifiable Certificate Generator)**:
   - ออกใบประกาศนียบัตรความละเอียดสูง พร้อมรหัส Credential ID และระบบตรวจสอบสถานะสากลที่ `/certificates/[code]`

6. **ระบบ Firebase Cloud Integration**:
   - รองรับ Google Authentication, Email/Password, และ Guest Mode
   - ซิงค์ประวัติการเรียน, คะแนนแบบทดสอบ, บุ๊กมาร์ก, และสมุดโน้ตส่วนตัว

---

## 📚 โครงสร้างหมวดหมู่และหลักสูตร (17+ Master Courses)

### 🎨 1. หมวดหมู่ Frontend
- **Svelte**: Modern Svelte 5 (Runes `$state`, `$derived`, `$effect`), SvelteKit SSR, Forms & Actions
- **TypeScript**: Generics Constraints, Discriminated Unions, Utility Types, Conditional Types
- **D3.js**: Data Binding, Scales, Axes, SVG Rendering, Force-directed Physics

### 🦁 2. หมวดหมู่ Backend
- **NestJS (Node.js + TypeScript)**: Enterprise Architecture, DI, Guards, Interceptors, Prisma ORM
- **GraphQL**: Schema Definition Language (SDL), Queries, Mutations, Resolvers, DataLoader
- **Python**: AsyncIO Coroutines, FastAPI, Pydantic v2, Async SQLAlchemy

### 📊 3. หมวดหมู่ Data & Processing
- **PostgreSQL**: Advanced SQL, Window Functions (`ROW_NUMBER`, `RANK`, `LAG`), JSONB, Indexing
- **MongoDB**: Aggregation Pipelines (`$match`, `$group`, `$lookup`), ESR Indexing
- **Elasticsearch**: Inverted Index, Query DSL Bool Queries, BM25 Scoring, Aggregations
- **Redis**: In-Memory Data Structures, Sorted Sets Leaderboards, Distributed Locks (Redlock)
- **Kafka**: Event-Driven Architecture, Topics, Partitions, Idempotent Producers, Consumer Groups

### 🧠 4. หมวดหมู่ AI & ML
- **OpenAI / Claude APIs**: Prompt Engineering, Tool & Function Calling, Strict JSON Schema, RAG
- **Hugging Face**: Transformers Library, Self-Attention, Pipelines, LoRA / PEFT Fine-Tuning
- **Python ML Pipelines**: Scikit-Learn `Pipeline`, `ColumnTransformer`, Model Validation, MLflow

### ☁️ 5. หมวดหมู่ DevOps & Cloud
- **Docker**: Multi-stage Production Builds, Image Optimization, Docker Compose
- **Kubernetes**: Pods, Deployments, Rolling Updates, Services, Ingress, Helm Charts
- **CI/CD**: GitHub Actions Workflows, Matrix Testing, Automated Deployment
- **AWS / Azure**: Cloud Fundamentals, VPC / VNet Architecture, IAM, Serverless Lambda

---

## 🛠️ การติดตั้งและรันใน Local Environment

```bash
# 1. Clone repository
git clone https://github.com/kchayta32/K-Tech.git
cd K-Tech

# 2. ติดตั้ง Dependencies
npm install
# หรือใช้ Bun
bun install

# 3. รัน Development Server
npm run dev

# 4. เปิดเบราว์เซอร์ที่
http://localhost:3000
```

---

## 🚀 การ Deploy ไปยัง Vercel

โปรเจกต์ได้รับการออกแบบตามมาตรฐาน Next.js App Router 14+ สามารถเชื่อมต่อกับ GitHub และ Deploy บน Vercel ได้ทันที:
1. เข้าไปที่ [Vercel Dashboard](https://vercel.com/)
2. Import repository `kchayta32/K-Tech`
3. กดปุ่ม **Deploy** และพร้อมใช้งานที่ `https://k-tech.vercel.app/`
