import { Course } from '@/types';

export const devopsCourses: Course[] = [
  {
    id: 'docker-container-engineering',
    slug: 'docker-container-engineering',
    title: 'Docker & Container Engineering: ตั้งแต่พื้นฐานสู่ Multi-Stage Builds',
    titleEn: 'Docker & Container Engineering: Multi-Stage Builds & Optimization',
    tagline: 'เข้าใจ Containerization อย่างแท้จริง: cgroups, namespaces, Multi-stage Builds, Compose และ Image Security',
    description: 'เรียนรู้เทคโนโลยี Containerization ตั้งแต่แก่นของ Linux (Namespaces, cgroups), การเขียน Dockerfile ที่มีประสิทธิภาพสูงด้วย Multi-stage Builds, การลดขนาด Image จาก 1GB เหลือเพียง 50MB, การจัดการ Multi-container Development Environment ด้วย Docker Compose, การตั้งค่า Bridged Networks และ Volume persistence, ตลอดจนการทำ Container Security Scanning ด้วย Trivy',
    categoryId: 'devops',
    difficulty: 'Beginner',
    estimatedHours: 14,
    instructor: {
      name: 'อดิศร รัตนพานิช (Adisorn R.)',
      role: 'Staff DevOps & Platform Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญ Containerization และ Infrastructure Automation มีประสบการณ์บริหารระบบ Container ระดับ 10,000+ Pods',
    },
    rating: 4.96,
    reviewsCount: 480,
    enrolledStudents: 3650,
    tags: ['Docker', 'Containers', 'DevOps', 'Docker-Compose', 'Security', 'Linux'],
    prerequisites: ['คำสั่ง Command Line / Terminal พื้นฐาน'],
    learningOutcomes: [
      'เข้าใจความแตกต่างระหว่าง Virtual Machines และ Linux Containers',
      'เขียน Production Multi-stage Dockerfile ขนาดกะทัดรัดและปลอดภัย (Non-root user)',
      'จัดการ Environment ตัวแปร, Volumes และ Isolated Networks ด้วย Docker Compose',
      'ลด Attack Surface ของ Container Image และสแกนช่องโหว่ด้วย Trivy',
      'ตั้งค่า Healthchecks และ Auto-restart policies สำหรับ Container Services',
    ],
    badgeIcon: '🐳',
    accentColor: '#2496ED',
    featured: true,
    modules: [
      {
        id: 'mod-docker-1',
        title: 'โมดูล 1: Dockerfile Optimization & Multi-Stage Builds',
        description: 'การสร้าง Container Image ที่มีขนาดเล็ก ปลอดภัย และคอมไพล์เร็วด้วย Build Cache',
        lessons: [
          {
            id: 'docker-multistage-production',
            title: '1.1 Multi-Stage Dockerfile Architecture สำหรับ Node.js / Go',
            titleEn: 'Multi-Stage Dockerfile Architecture for Production',
            description: 'แยกส่วน Build Environment ออกจาก Runtime Image เพื่อความปลอดภัยและขนาดที่เล็กที่สุด',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### ปรัชญา Multi-Stage Builds ใน Docker

ใน Production เราไม่ต้องการ Toolchain หนักๆ เช่น Node.js build tools, TypeScript compiler, หรือ Go compiler อยู่ใน Image จริงที่จะ Deploy

\`\`\`dockerfile
# Stage 1: Build & Compile Stage
FROM node:20-alpine AS builder
WORKDIR /app

# ติดตั้ง Dependencies ก่อนเพื่อใช้ประโยชน์จาก Docker Layer Caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy ซอร์สโค้ดและทำการ Build
COPY . .
RUN npm run build
RUN npm prune --production # ลบ devDependencies ออกเพื่อลดขนาด

# Stage 2: Minimal Production Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# สร้าง Non-root user เพื่อความปลอดภัย
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy เฉพาะไฟล์ที่จำเป็นจาก Builder Stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

USER nestjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main.js"]
\`\`\``,
            exercise: {
              id: 'ex-docker-port',
              title: 'เขียน Docker Compose Port Mapping Syntax',
              instructions: 'เขียน string การ map port ใน Docker Compose โดยให้ host port 8080 ชี้ไปยัง container port 3000',
              language: 'javascript',
              initialCode: `export function getPortMapping(hostPort, containerPort) {
  // TODO: คืนค่า string port mapping
  return "";
}`,
              solutionCode: `export function getPortMapping(hostPort, containerPort) {
  return \`\${hostPort}:\${containerPort}\`;
}`,
              hints: ['รูปแบบของ Port mapping คือ "HOST:CONTAINER"'],
              testCases: [
                {
                  input: 'getPortMapping(8080, 3000)',
                  expectedOutput: '"8080:3000"',
                  description: 'Map port 8080:3000',
                },
              ],
            },
            quiz: [
              {
                id: 'q-docker-layer-cache',
                question: 'ทำไมใน Dockerfile จึงควร COPY package.json และรัน npm ci ก่อนที่จะ COPY ซอร์สโค้ดทั้งหมด?',
                options: [
                  'เพราะ Docker ไม่ยอมให้อ่านไฟล์ซอร์สโค้ดก่อน',
                  'เพื่อใช้ประโยชน์จาก Layer Caching ทำให้ไม่ต้องดาวน์โหลด dependencies ซ้ำเมื่อมีการแก้ไขเพียงโค้ดในโปรเจกต์',
                  'เพื่อให้ไฟล์มีขนาดเล็กลง',
                  'เพื่อบังคับให้ npm ทำงานแบบ Multithread',
                ],
                correctAnswer: 1,
                explanation: 'Docker จะใช้ Cache ของแต่ละบรรทัด หาก package.json ไม่มีการเปลี่ยนแปลง บรรทัด `npm ci` จะถูกดึงจาก Cache ทันที ช่วยประหยัดเวลาการ Build จากหลายนาทีเหลือเพียงไม่กี่วินาที',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kubernetes-production-helm',
    slug: 'kubernetes-production-helm',
    title: 'Production Kubernetes & Helm: Orchestration และ High Availability',
    titleEn: 'Production Kubernetes & Helm: Orchestration & High Availability',
    tagline: 'บริหารจัดการ Container คลัสเตอร์ระดับ Production: Pods, Deployments, Services, Ingress, ConfigMaps และ Helm Charts',
    description: 'เรียนรู้ระบบจัดการ Container Orchestration อันดับ 1 ของโลก ทำความเข้าใจ Control Plane, Worker Nodes, Pod Lifecycle, Rolling Updates, Horizontal Pod Autoscaling (HPA), Services (ClusterIP, NodePort, LoadBalancer), Ingress NGINX พร้อม SSL/TLS Cert-Manager, Persistent Volumes (PV/PVC), และการแพ็กเกจแอปพลิเคชันด้วย Helm 3 Charts',
    categoryId: 'devops',
    difficulty: 'Advanced',
    estimatedHours: 20,
    instructor: {
      name: 'ชานนท์ เมธาภัทร (Chanon M.)',
      role: 'Principal Cloud & Kubernetes Architect (CKA, CKS)',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญ Kubernetes ผ่านการรับรอง CKA, CKAD, CKS และผู้ออกแบบ Hybrid-Cloud Kubernetes Clusters ให้กับองค์กรข้ามชาติ',
    },
    rating: 4.98,
    reviewsCount: 490,
    enrolledStudents: 3420,
    tags: ['Kubernetes', 'Helm', 'K8s', 'DevOps', 'Cloud-Native', 'Infrastructure'],
    prerequisites: ['ความเข้าใจ Docker และ Container Fundamentals'],
    learningOutcomes: [
      'เข้าใจสถาปัตยกรรม Kubernetes (API Server, etcd, Kubelet, Kube-Proxy)',
      'เขียน Deployment Manifests พร้อม Zero-Downtime Rolling Update Strategy',
      'กำหนด Resource Requests/Limits และตั้งค่า Horizontal Pod Autoscaler (HPA)',
      'กำหนด Routing ทราฟฟิกภายนอกเข้าสู่คลัสเตอร์ด้วย Ingress และ TLS Certificates',
      'สร้างและเผยแพร่ Reusable Custom Helm Charts ด้วย Values.yaml Templates',
    ],
    badgeIcon: '☸️',
    accentColor: '#326CE5',
    featured: true,
    modules: [
      {
        id: 'mod-k8s-1',
        title: 'โมดูล 1: Kubernetes Core Manifests & Zero-Downtime Deployment',
        description: 'การประกาศ Deployment, Service, Liveness/Readiness Probes และ Resources Limits',
        lessons: [
          {
            id: 'k8s-deployment-service',
            title: '1.1 Production Deployment Manifest, Probes และ Resource Requests/Limits',
            titleEn: 'Production Deployment, Probes and Resource Management',
            description: 'โครงสร้าง YAML ของ Deployment, การตั้งค่า Liveness/Readiness Probes เพื่อไม่ให้ทราฟฟิกตกหล่น',
            durationMinutes: 50,
            type: 'interactive_code',
            visualizerType: 'k8s-cluster',
            contentMarkdown: `### Production-Ready Kubernetes Deployment Manifest

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: production
  labels:
    app.kubernetes.io/name: api-gateway
    app.kubernetes.io/tier: backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # สร้าง Pod ใหม่เพิ่มเกินได้ 1 ตัวระหว่าง Deploy
      maxUnavailable: 0  # ห้ามให้ Pod ใช้งานไม่ได้เลยแม้แต่ตัวเดียว (Zero Downtime)
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: registry.k-tech.io/api-gateway:v2.4.1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8080
        resources:
          requests:
            cpu: "250m"       # การันตี 0.25 vCPU
            memory: "512Mi"   # การันตี 512 MB RAM
          limits:
            cpu: "1000m"      # สูงสุดไม่เกิน 1 vCPU
            memory: "1Gi"     # OOMKilled หากเกิน 1 GB
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 20
\`\`\``,
            quiz: [
              {
                id: 'q-k8s-probes',
                question: 'ความแตกต่างระหว่าง Readiness Probe และ Liveness Probe ใน Kubernetes คือข้อใด?',
                options: [
                  'ไม่มีความแตกต่างกัน เป็นชื่อเรียกสลับกันได้',
                  'Readiness Probe ตรวจสอบว่า Pod พร้อมรับ Traffic หรือยัง (ถ้าไม่ผ่านจะดึงออกจาก Service Endpoint) ส่วน Liveness Probe ตรวจสอบว่า Container ตายหรือค้างหรือไม่ (ถ้าไม่ผ่านจะ Restart Pod ทิ้ง)',
                  'Liveness Probe ใช้กับ Database เท่านั้น',
                  'Readiness Probe จะลบ Pod ทิ้งทันทีที่เฟล',
                ],
                correctAnswer: 1,
                explanation: 'Readiness Probe ควบคุมการส่ง Traffic หากไม่พร้อม Service จะระงับการส่ง Request ไปหา Pod นั้น ส่วน Liveness Probe มีหน้าที่เช็คว่า Container ทำงานปกติหรือไม่ หากค้างหรือ Deadlock Kubelet จะฆ่าและ Restart Container ใหม่',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cicd-github-actions-automation',
    slug: 'cicd-github-actions-automation',
    title: 'Automated CI/CD Pipelines ด้วย GitHub Actions',
    titleEn: 'Automated CI/CD Pipelines with GitHub Actions',
    tagline: 'สร้างระบบส่งมอบซอฟต์แวร์อัตโนมัติ: Automated Tests, Matrix Builds, Docker Registry และ Zero-Downtime CD',
    description: 'เรียนรู้การสร้าง Continuous Integration และ Continuous Deployment (CI/CD) แบบอัตโนมัติ 100% ด้วย GitHub Actions ทำความเข้าใจ Workflows, Events, Jobs, Steps, Matrix Strategy, การจัดการ Secrets & Environments, การทำ Cache dependencies, การสร้าง Docker Container และ Push สู่ GitHub Container Registry (GHCR), และการ Deploy สู่ Kubernetes / Cloud แบบไร้รอยต่อ',
    categoryId: 'devops',
    difficulty: 'Intermediate',
    estimatedHours: 15,
    instructor: {
      name: 'อดิศร รัตนพานิช (Adisorn R.)',
      role: 'Staff DevOps & Platform Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญ Containerization และ Infrastructure Automation ประสบการณ์พัฒนาระบบ CI/CD กว่า 10 ปี',
    },
    rating: 4.94,
    reviewsCount: 320,
    enrolledStudents: 2340,
    tags: ['CI-CD', 'GitHub-Actions', 'Automation', 'DevOps', 'Docker', 'Testing'],
    prerequisites: ['Git และ GitHub พื้นฐาน'],
    learningOutcomes: [
      'เข้าใจไวยากรณ์ GitHub Actions Workflow (on, jobs, steps, uses, run)',
      'ตั้งค่า Automated Testing & Code Linting บน Pull Requests',
      'ใช้ Matrix Builds รันการทดสอบข้าม Node.js / Python หลายเวอร์ชันพร้อมกัน',
      'สร้าง Multi-arch Docker Images และ Push ไปยัง Container Registry ด้วย GitHub Secrets',
      'ออกแบบ Deployment Workflow พร้อม Environment Approval Protection Rules',
    ],
    badgeIcon: '🚀',
    accentColor: '#2088FF',
    featured: false,
    modules: [
      {
        id: 'mod-ci-1',
        title: 'โมดูล 1: GitHub Actions Workflow Architecture',
        description: 'การเขียน Workflow ไฟล์ YAML เพื่อรัน Linting, Testing และ Build อัตโนมัติ',
        lessons: [
          {
            id: 'gha-pipeline-syntax',
            title: '1.1 Workflow Syntax, Matrix Strategy และ Dependency Caching',
            titleEn: 'Workflow Syntax, Matrix Strategy and Cache Actions',
            description: 'สร้าง Automated CI Pipeline สำหรับ Unit Tests และ Type-checking',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### โครงสร้าง GitHub Actions CI Workflow

\`\`\`yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-and-lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v4

    - name: Setup Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm' # แคช node_modules อัตโนมัติ

    - name: Install Dependencies
      run: npm ci

    - name: Run ESLint & TypeScript Check
      run: |
        npm run lint
        npm run type-check

    - name: Run Unit & Integration Tests
      run: npm run test:coverage
\`\`\``,
            quiz: [
              {
                id: 'q-gha-matrix',
                question: 'ฟีเจอร์ Matrix Strategy ใน GitHub Actions มีประโยชน์หลักอย่างไร?',
                options: [
                  'ทำให้เซิร์ฟเวอร์รันเร็วขึ้น 10 เท่า',
                  'ช่วยให้สามารถรัน Job เดียวกันซ้ำข้ามหลาย Environments หรือ Versions (เช่น OS หรือ Node.js ต่างๆ) ได้พร้อมกันแบบ Parallel',
                  'แปลงโค้ดให้อยู่ในรูปของ Matrix 2 มิติ',
                  'ใช้สำหรับเชื่อมต่อฐานข้อมูล',
                ],
                correctAnswer: 1,
                explanation: 'Matrix Strategy ช่วยให้คุณสร้างชุดตัวแปร (Configurations) และสั่งให้ GitHub Actions แตกย่อย Job ออกมารันควบคู่กัน (Parallelism) ตามตัวแปรต่างๆ เช่น Node version, OS version',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'cloud-architecture-aws-azure',
    slug: 'cloud-architecture-aws-azure',
    title: 'Cloud Architecture บน AWS และ Azure: สถาปัตยกรรมคลาวด์ยุคใหม่',
    titleEn: 'Cloud Architecture on AWS & Azure: High Availability & Serverless',
    tagline: 'ออกแบบคลาวด์ระดับองค์กร: VPC/VNet, EC2/VM, S3/Blob, Serverless (Lambda/Functions) และ Terraform IaC',
    description: 'เรียนรู้การออกแบบโครงสร้างพื้นฐานบน 2 คลาวด์ยักษ์ใหญ่ของโลก AWS และ Microsoft Azure เข้าใจหลักการ Well-Architected Framework: Compute, Storage (S3 / Blob), Virtual Private Cloud (VPC & VNet, Subnets, Routing, NAT), Serverless Architecture ด้วย AWS Lambda และ Azure Functions, Managed Databases (RDS / Azure SQL), และการเขียน Infrastructure as Code (IaC) ด้วย Terraform',
    categoryId: 'devops',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    instructor: {
      name: 'ชานนท์ เมธาภัทร (Chanon M.)',
      role: 'Principal Cloud Architect',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      bio: 'ที่ปรึกษาด้าน Multi-Cloud Strategy และ Terraform Automation สำหรับระบบขนาดใหญ่ในภูมิภาคเอเชีย',
    },
    rating: 4.95,
    reviewsCount: 380,
    enrolledStudents: 2790,
    tags: ['AWS', 'Azure', 'Cloud-Architecture', 'Serverless', 'Terraform', 'DevOps'],
    prerequisites: ['ความรู้พื้นฐานระบบเครือข่าย (IP, Subnet, DNS, HTTP/HTTPS)'],
    learningOutcomes: [
      'เข้าใจ 6 เสาหลักของ AWS Well-Architected Framework (Security, Reliability, Performance...)',
      'ออกแบบ Virtual Private Cloud (VPC/VNet) แยก Public และ Private Subnets อย่างปลอดภัย',
      'สร้าง Serverless Event-driven Applications ด้วย AWS Lambda และ S3 Triggers',
      'ออกแบบระบบ Auto Scaling และ Multi-AZ Failover เพื่อความพร้อมใช้งานสูง (HA)',
      'เขียนโค้ด Provision Cloud Resources ด้วย Terraform (IaC)',
    ],
    badgeIcon: '☁️',
    accentColor: '#FF9900',
    featured: true,
    modules: [
      {
        id: 'mod-cloud-1',
        title: 'โมดูล 1: Cloud Networking & Security (VPC & Subnets)',
        description: 'การออกแบบ Network Topology ที่ปลอดภัย: Public Subnets, Private Subnets, NAT Gateways และ Security Groups',
        lessons: [
          {
            id: 'cloud-vpc-subnets-nat',
            title: '1.1 การออกแบบ VPC Network Topology, CIDR Blocks และ Security Groups',
            titleEn: 'VPC Network Topology, CIDR Blocks and Bastion Architecture',
            description: 'หลักการแบ่ง Subnet สำหรับ Web, Application และ Database tiers พร้อมการกำหนด Route Tables',
            durationMinutes: 45,
            type: 'reading',
            contentMarkdown: `### สถาปัตยกรรม 3-Tier Secure VPC

การออกแบบเครือข่ายบน Cloud ที่ได้มาตรฐาน จะต้องแยก Subnets ออกเป็น 3 เลเยอร์:

1. **Public Subnet**: วาง Application Load Balancer (ALB) หรือ NAT Gateway (มี Public IP และ Route ไปยัง Internet Gateway)
2. **Private Application Subnet**: วาง Container Nodes หรือ EC2 ที่รัน Business Logic (ไม่มี Public IP เข้าถึงอินเทอร์เน็ตขาออกผ่าน NAT Gateway เท่านั้น)
3. **Isolated Database Subnet**: วาง Database Cluster (RDS / Aurora) โดยไม่อนุญาตให้ออกอินเทอร์เน็ตใดๆ ทั้งสิ้น รับเฉพาะ Connection จาก Application Subnet เท่านั้น`,
          },
        ],
      },
    ],
  },
];
