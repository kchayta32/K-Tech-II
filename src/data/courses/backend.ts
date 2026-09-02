import { Course } from '@/types';

export const backendCourses: Course[] = [
  {
    id: 'nestjs-enterprise-architecture',
    slug: 'nestjs-enterprise-architecture',
    title: 'Enterprise Backend ด้วย NestJS และ Prisma ORM',
    titleEn: 'Enterprise Backend Development with NestJS & Prisma',
    tagline: 'สร้างสถาปัตยกรรม Backend ระดับองค์กรด้วย TypeScript, Dependency Injection, Prisma และ Microservices',
    description: 'เรียนรู้การออกแบบระบบ Backend ระดับ Enterprise ที่มี scalability สูง ด้วย NestJS Framework เจาะลึก Dependency Injection (DI), Decorators, Modules, Controllers, Services, Request Lifecycle (Middleware, Guards, Interceptors, Pipes), การจัดการฐานข้อมูลด้วย Prisma ORM, Authentication ด้วย JWT & Passport, และการแยกส่วนสู่ Microservices สื่อสารผ่าน Message Broker',
    categoryId: 'backend',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    instructor: {
      name: 'ธีรเดช เจริญผล (Theeradej C.)',
      role: 'Principal Backend Architect & Cloud Specialist',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้ออกแบบระบบ Microservices รองรับธุรกรรมกว่า 10 ล้านรายการต่อวัน ให้กับองค์กรการเงินและ E-Commerce ชั้นนำ',
    },
    rating: 4.96,
    reviewsCount: 430,
    enrolledStudents: 2890,
    tags: ['NestJS', 'TypeScript', 'Prisma', 'PostgreSQL', 'Microservices', 'Clean-Architecture', 'Backend'],
    prerequisites: ['TypeScript พื้นฐาน', 'ความเข้าใจสถาปัตยกรรม REST API และ Relational Database'],
    learningOutcomes: [
      'เข้าใจและออกแบบโครงสร้าง Modular Architecture และ Inversion of Control (IoC/DI)',
      'ควบคุม Request Lifecycle ด้วย Custom Guards, Interceptors, Pipes, และ Exception Filters',
      'เชื่อมต่อและเขียน Database Queries ที่ปลอดภัยและมีประสิทธิภาพด้วย Prisma ORM',
      'ทำ Authentication & Role-based Authorization (RBAC) ด้วย JWT และ Passport',
      'สร้างระบบ Microservices ด้วย NestJS Microservices Module สื่อสารผ่าน Redis หรือ RabbitMQ',
    ],
    badgeIcon: '🦁',
    accentColor: '#E0234E',
    featured: true,
    modules: [
      {
        id: 'mod-nest-1',
        title: 'โมดูล 1: สถาปัตยกรรม NestJS, IoC Container และ Dependency Injection',
        description: 'เข้าใจหัวใจของ NestJS: Modules, Providers, Controllers และการจัดโครงสร้างโค้ดแบบ Clean Code',
        lessons: [
          {
            id: 'nest-di-and-modules',
            title: '1.1 Dependency Injection, Providers และ Inversion of Control (IoC)',
            titleEn: 'Dependency Injection, Providers and IoC Container',
            description: 'กลไกการทำงานของ NestJS IoC Container, การประกาศ @Injectable() และ Provider Scopes',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### Dependency Injection ใน NestJS

NestJS ใช้แนวคิด **Inversion of Control (IoC)** โดยสร้าง IoC Container ขึ้นมาจัดการ lifecycle และการ instantiate ของคลาสต่างๆ (Providers) ให้อัตโนมัติ

\`\`\`typescript
// users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateUserDto {
  email: string;
  name: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(\`ไม่พบผู้ใช้งานอีเมล \${email}\`);
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
      },
    });
  }
}
\`\`\`

#### การสร้าง Controller และการ Inject Service:
\`\`\`typescript
// users.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService, CreateUserDto } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
\`\`\``,
            exercise: {
              id: 'ex-nest-service',
              title: 'สร้าง DiscountCalculator Service',
              instructions: 'เขียนคลาส Service คำนวณราคาสุทธิ `calculateTotal(price: number, membershipTier: "PLATINUM" | "GOLD" | "SILVER" | "STANDARD"): number` โดย PLATINUM ลด 20%, GOLD ลด 15%, SILVER ลด 10%, STANDARD ลด 0%',
              language: 'typescript',
              initialCode: `export class DiscountService {
  calculateTotal(price: number, tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD'): number {
    // TODO: คำนวณราคาสุทธิหลังหักส่วนลด
    return price;
  }
}`,
              solutionCode: `export class DiscountService {
  calculateTotal(price: number, tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'STANDARD'): number {
    const discountRates: Record<string, number> = {
      PLATINUM: 0.20,
      GOLD: 0.15,
      SILVER: 0.10,
      STANDARD: 0.0,
    };
    const rate = discountRates[tier] ?? 0;
    return price * (1 - rate);
  }
}`,
              hints: ['ใช้ object map จับคู่อัตราส่วนลดตาม membershipTier', 'คำนวณราคาสุทธิ = price * (1 - rate)'],
              testCases: [
                {
                  input: 'new DiscountService().calculateTotal(1000, "PLATINUM")',
                  expectedOutput: '800',
                  description: 'ส่วนลด PLATINUM 20% จาก 1,000 เหลือ 800',
                },
                {
                  input: 'new DiscountService().calculateTotal(2000, "GOLD")',
                  expectedOutput: '1700',
                  description: 'ส่วนลด GOLD 15% จาก 2,000 เหลือ 1,700',
                },
              ],
            },
            quiz: [
              {
                id: 'q-nest-di',
                question: 'Decorator @Injectable() ใน NestJS มีหน้าที่หลักคืออะไร?',
                options: [
                  'ทำให้คลาสกลายเป็น HTTP Route Controller',
                  'บอกให้ Nest IoC Container ทราบว่าคลาสนี้เป็น Provider ที่สามารถถูก Inject ไปยังคลาสอื่นได้',
                  'แปลงคลาสเป็น Singleton Database Connection',
                  'ทำหน้าที่ Validate ข้อมูล JSON Request body',
                ],
                correctAnswer: 1,
                explanation: '@Injectable() จะติด metadata ให้กับคลาส เพื่อให้ NestJS IoC runtime จัดการ dependency injection ให้โดยอัตโนมัติ',
              },
            ],
          },
          {
            id: 'nest-request-lifecycle',
            title: '1.2 Request Lifecycle: Guards, Interceptors, Pipes & Filters',
            titleEn: 'Request Lifecycle: Guards, Interceptors, Pipes and Filters',
            description: 'ลำดับการประมวลผลของ HTTP Request ใน NestJS และการเขียน Custom Auth Guard กับ Validation Pipe',
            durationMinutes: 40,
            type: 'reading',
            contentMarkdown: `### ลำดับ Request Lifecycle ใน NestJS

เมื่อมี Request เข้ามา จะถูกส่งผ่านเลเยอร์ต่างๆ ตามลำดับดังนี้:

1. **Incoming Request**
2. **Global / Module / Route Middleware** (เช่น \`cors\`, \`express-rate-limit\`)
3. **Guards** (ตรวจสอบสิทธิ์ เช่น \`AuthGuard\`, \`RolesGuard\`)
4. **Interceptors (Pre-controller)** (เช่น Logging, Metrics, Request Mutation)
5. **Pipes** (Data Transformation & Validation เช่น \`ValidationPipe\`, \`ParseIntPipe\`)
6. **Controller (Route Handler)** (เรียก Service Business Logic)
7. **Interceptors (Post-controller)** (Response Mapping เช่น แปลงรูปแบบ JSON)
8. **Exception Filters** (ดักจับ Error และส่ง Custom Error Format กลับไปให้ Client)`,
          },
        ],
      },
      {
        id: 'mod-nest-2',
        title: 'โมดูล 2: Prisma ORM Integration & Database Transactions',
        description: 'การสร้าง Schema, Relations, CRUD Operations และ Atomic Transactions ด้วย Prisma Client',
        lessons: [
          {
            id: 'nest-prisma-transactions',
            title: '2.1 Prisma Schema Modeling, Relations & Interactive Transactions',
            titleEn: 'Prisma Schema Modeling and Interactive Transactions',
            description: 'การจำลองโครงสร้างข้อมูล One-to-Many, Many-to-Many และการทำ Atomic Database Transactions ($transaction)',
            durationMinutes: 50,
            type: 'interactive_code',
            contentMarkdown: `### Prisma Interactive Transactions

ในการโอนเงินหรือสั่งซื้อสินค้า เราต้องรับประกันว่าการเปลี่ยนแปลงทั้งหมดจะสำเร็จพร้อมกัน (ACID)

\`\`\`typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransferService {
  constructor(private readonly prisma: PrismaService) {}

  async transferMoney(fromAccountId: string, toAccountId: string, amount: number) {
    return this.prisma.$transaction(async (tx) => {
      // 1. ดึงข้อมูลบัญชีผู้โอนและตรวจสอบยอดเงิน
      const sender = await tx.account.findUnique({
        where: { id: fromAccountId },
      });

      if (!sender || sender.balance < amount) {
        throw new BadRequestException('ยอดเงินในบัญชีไม่เพียงพอสำหรับการโอน');
      }

      // 2. หักเงินบัญชีผู้โอน
      const updatedSender = await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      });

      // 3. เพิ่มเงินบัญชีผู้รับ
      const updatedReceiver = await tx.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      });

      // 4. บันทึกประวัติ Transaction Log
      const log = await tx.transactionRecord.create({
        data: {
          fromAccountId,
          toAccountId,
          amount,
          status: 'SUCCESS',
        },
      });

      return { sender: updatedSender, receiver: updatedReceiver, logId: log.id };
    });
  }
}
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    id: 'graphql-fullstack-mastery',
    slug: 'graphql-fullstack-mastery',
    title: 'Fullstack GraphQL Mastery: Schema, Resolvers และ Realtime Subscriptions',
    titleEn: 'Fullstack GraphQL Mastery: Schema, Resolvers & Realtime Subscriptions',
    tagline: 'สร้าง API ที่ยืดหยุ่น ไร้ปัญหา Over-fetching ด้วย GraphQL, Apollo Server, DataLoader และ WebSocket Subscriptions',
    description: 'เรียนรู้ GraphQL ตั้งแต่พื้นฐานไปจนถึงระดับ Production Architecture เข้าใจ Schema Definition Language (SDL), Code-first vs Schema-first, Resolver Execution Tree, การแก้ปัญหา N+1 Query ด้วย DataLoader, การทำ Authentication & Caching, และการสร้าง Realtime Feed ด้วย GraphQL Subscriptions ผ่าน WebSockets',
    categoryId: 'backend',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    instructor: {
      name: 'ชญานนท์ รุ่งโรจน์ (Chayanon R.)',
      role: 'Staff Fullstack Architect',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญด้าน GraphQL Federation และ Microservices Gateway ในระบบที่มีทราฟฟิกระดับสากล',
    },
    rating: 4.93,
    reviewsCount: 315,
    enrolledStudents: 2120,
    tags: ['GraphQL', 'Apollo-Server', 'DataLoader', 'NodeJS', 'TypeScript', 'WebSockets', 'Backend'],
    prerequisites: ['JavaScript/TypeScript', 'ความเข้าใจพื้นฐานเรื่อง HTTP & REST APIs'],
    learningOutcomes: [
      'ออกแบบ GraphQL Schema ด้วย SDL และ Type Definitions ที่มีแบบแผน',
      'เขียน Queries, Mutations และ Resolvers ที่มี Type Safety สมบูรณ์',
      'แก้ไขปัญหา N+1 Query อย่างเด็ดขาดด้วย Batching & Caching ของ DataLoader',
      'สร้างระบบ Real-time Updates ด้วย GraphQL Subscriptions ผ่าน WebSockets',
      'เข้าใจแนวคิด Apollo Federation และการรวม Subgraphs เข้าเป็น Supergraph เดียว',
    ],
    badgeIcon: '◈',
    accentColor: '#E535AB',
    featured: false,
    modules: [
      {
        id: 'mod-gql-1',
        title: 'โมดูล 1: GraphQL Schema Design & Resolvers',
        description: 'การออกแบบ Schema, Type System และ Resolver Execution Mechanism',
        lessons: [
          {
            id: 'gql-schema-resolvers',
            title: '1.1 Schema Definition Language (SDL), Queries และ Mutations',
            titleEn: 'Schema Definition Language (SDL), Queries and Mutations',
            description: 'โครงสร้าง Schema, Types, Input Types, Enums และการแมปเข้ากับ Resolver Functions',
            durationMinutes: 40,
            type: 'interactive_code',
            contentMarkdown: `### โครงสร้าง GraphQL Schema (SDL)

GraphQL ใช้ Schema เป็นสัญญากลาง (Contract) ระหว่าง Frontend และ Backend

\`\`\`graphql
# schema.graphql
enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  CANCELLED
}

type Product {
  id: ID!
  title: String!
  price: Float!
  inventory: Int!
}

type Order {
  id: ID!
  customerEmail: String!
  items: [OrderItem!]!
  totalAmount: Float!
  status: OrderStatus!
  createdAt: String!
}

type OrderItem {
  product: Product!
  quantity: Int!
  unitPrice: Float!
}

input CreateOrderInput {
  customerEmail: String!
  productId: ID!
  quantity: Int!
}

type Query {
  product(id: ID!): Product
  products(limit: Int = 10): [Product!]!
  order(id: ID!): Order
}

type Mutation {
  createOrder(input: CreateOrderInput!): Order!
  cancelOrder(id: ID!): Order!
}
\`\`\`

#### การเขียน Resolver ใน TypeScript:
\`\`\`typescript
export const resolvers = {
  Query: {
    product: async (_, { id }, { dataSources }) => {
      return dataSources.db.products.findById(id);
    },
    products: async (_, { limit }, { dataSources }) => {
      return dataSources.db.products.findAll({ limit });
    },
  },
  Mutation: {
    createOrder: async (_, { input }, { dataSources, currentUser }) => {
      if (!currentUser) throw new Error('Unauthenticated');
      return dataSources.ordersService.create(input);
    },
  },
  Order: {
    // Nested Field Resolver สำหรับ Product ภายใน OrderItem
    totalAmount: (parent) => {
      return parent.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }
  }
};
\`\`\``,
            quiz: [
              {
                id: 'q-gql-sdl',
                question: 'ใน GraphQL Schema เครื่องหมายตกใจ (!) ด้านหลัง Type เช่น `String!` หมายถึงอะไร?',
                options: [
                  'ฟิลด์นั้นเป็นความลับ (Private Field)',
                  'ฟิลด์นั้นเป็น Non-nullable (ห้ามเป็น null หรือต้องส่งค่ากลับมาเสมอ)',
                  'ฟิลด์นั้นเป็น Auto-incrementing Identifier',
                  'ฟิลด์นั้นต้องเข้ารหัสแบบ Base64',
                ],
                correctAnswer: 1,
                explanation: 'ใน GraphQL SDL เครื่องหมาย `!` หมายถึง Non-null type ซึ่งหมายความว่าผลลัพธ์ของฟิลด์นั้นจะต้องไม่เป็น null เด็ดขาด',
              },
            ],
          },
          {
            id: 'gql-dataloader-n-plus-one',
            title: '1.2 การแก้ไขปัญหา N+1 Query ด้วย DataLoader',
            titleEn: 'Solving N+1 Query Problem using DataLoader',
            description: 'เข้าใจกลไก Batching และ Per-request In-memory Caching เพื่อลด Database Queries จาก N+1 เหลือเพียง 1 ครั้ง',
            durationMinutes: 45,
            type: 'reading',
            contentMarkdown: `### ปัญหา N+1 Query ใน GraphQL

เมื่อ Query ร้องขอ \`users { posts { title } }\` หากมี User 50 คน และแต่ละคนยิงหา Post แยกกัน Backend จะยิง Database Query ทั้งหมด 1 + 50 = 51 ครั้ง!

#### การแก้ปัญหาด้วย DataLoader
DataLoader รวมคำขอ (Batching) ใน Event Loop Tick เดียวกัน ให้กลายเป็น SQL \`WHERE id IN (...)\` เพียงคำสั่งเดียว

\`\`\`typescript
import DataLoader from 'dataloader';

// สร้าง Batch Loader Function
export function createAuthorLoader(db: Database) {
  return new DataLoader<string, Author>(async (authorIds) => {
    // ยิงคำสั่ง DB เพียงครั้งเดียวสำหรับทุก authorId ใน batch
    const authors = await db.authors.findMany({
      where: { id: { in: [...authorIds] } }
    });

    // ต้องเรียง Array ผลลัพธ์ให้ตรงกับลำดับของ authorIds ที่ส่งเข้ามา
    const authorMap = new Map(authors.map(a => [a.id, a]));
    return authorIds.map(id => authorMap.get(id) || null);
  });
}
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    id: 'python-fastapi-async-backend',
    slug: 'python-fastapi-async-backend',
    title: 'Modern Python Backend ด้วย FastAPI, AsyncIO และ Pydantic v2',
    titleEn: 'Modern Python Backend with FastAPI, AsyncIO & Pydantic v2',
    tagline: 'สร้าง High-performance Asynchronous APIs ด้วย Python ยุคใหม่, Pydantic, SQLAlchemy 2.0 และ AsyncIO',
    description: 'ก้าวสู่การเขียน Python Backend ที่เร็วและทันสมัยที่สุด ทำความเข้าใจ Event Loop & Coroutines ใน AsyncIO, การพัฒนา RESTful APIs ด้วย FastAPI, การทำ Data Validation & Serialization ด้วย Pydantic v2, การจัดการ Asynchronous Database ด้วย SQLAlchemy 2.0 และ Alembic, ตลอดจนการทำ Automated Test ด้วย Pytest และ HTTPX',
    categoryId: 'backend',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    instructor: {
      name: 'พงศธร เมธากุล (Pongsatorn M.)',
      role: 'Staff Python Engineer & AI Infrastructure Lead',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญ High-throughput Asynchronous Python และระบบ Backend สำหรับ Real-time AI Inference',
    },
    rating: 4.97,
    reviewsCount: 460,
    enrolledStudents: 3340,
    tags: ['Python', 'FastAPI', 'AsyncIO', 'Pydantic', 'SQLAlchemy', 'PostgreSQL', 'Backend'],
    prerequisites: ['Python พื้นฐาน (Functions, Classes, Type hints)'],
    learningOutcomes: [
      'เข้าใจกลไก Non-blocking I/O และ AsyncIO Event Loop อย่างถ่องแท้',
      'สร้าง High-performance REST APIs ด้วย FastAPI พร้อม Auto OpenAPI Docs',
      'ออกแบบ Schema และ Data Validation ที่แม่นยำด้วย Pydantic v2',
      'เชื่อมต่อ Async PostgreSQL Database ด้วย SQLAlchemy 2.0 และ AsyncSession',
      'เขียน Unit & Integration Tests ด้วย Pytest และ AsyncClient',
    ],
    badgeIcon: '⚡',
    accentColor: '#009688',
    featured: true,
    modules: [
      {
        id: 'mod-py-1',
        title: 'โมดูล 1: AsyncIO และ FastAPI Core Architecture',
        description: 'การทำงานของ Non-blocking Python, Coroutines และการประกาศ API Endpoints',
        lessons: [
          {
            id: 'fastapi-async-pydantic',
            title: '1.1 AsyncIO Coroutines, FastAPI Routing และ Pydantic Validation',
            titleEn: 'AsyncIO Coroutines, FastAPI Routing and Pydantic v2 Models',
            description: 'เขียน async def, Dependency Injection (Depends) และ Pydantic BaseModel สำหรับ Request/Response',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### สถาปัตยกรรม FastAPI และ Pydantic v2

FastAPI ถูกสร้างขึ้นบน Starlette (ASGI toolkit) และ Pydantic v2 (Rust-based validation) ให้ประสิทธิภาพความเร็วเทียบเคียงกับ Go และ Node.js

\`\`\`python
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import asyncio

app = FastAPI(title="FinTech Payment Service", version="2.0.0")

# Pydantic v2 Schema
class PaymentRequest(BaseModel):
    account_id: str = Field(..., min_length=5, max_length=20, description="รหัสบัญชีผู้โอน")
    recipient_id: str = Field(..., min_length=5, max_length=20, description="รหัสบัญชีผู้รับ")
    amount: float = Field(..., gt=0, description="จำนวนเงินต้องมากกว่า 0")
    currency: str = Field(default="THB", pattern="^(THB|USD|EUR)$")

class PaymentResponse(BaseModel):
    transaction_id: str
    status: str
    amount: float
    timestamp: datetime

@app.post("/api/v1/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def process_payment(request: PaymentRequest):
    # จำลอง Async I/O (เช่น ยิง Bank Gateway หรือ Database)
    await asyncio.sleep(0.05)
    
    if request.amount > 1_000_000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ยอดเงินเกินวงเงินสูงสุดที่อนุญาต (1,000,000 THB)"
        )

    return PaymentResponse(
        transaction_id="TXN-99881122",
        status="PROCESSED",
        amount=request.amount,
        timestamp=datetime.utcnow()
    )
\`\`\``,
            exercise: {
              id: 'ex-py-calc-fee',
              title: 'เขียนฟังก์ชันคำนวณค่าธรรมเนียมธุรกรรม',
              instructions: 'เขียนฟังก์ชัน `calculate_fee(amount, tier)` ใน Python โดย tier "STANDARD" คิดค่าธรรมเนียม 15 บาทเสมอ, "GOLD" ฟรีหากยอดตั้งแต่ 1,000 บาทขึ้นไป (มิฉะนั้น 10 บาท), "VIP" ฟรีทุกยอด',
              language: 'python',
              initialCode: `def calculate_fee(amount: float, tier: str) -> float:
    # TODO: คำนวณค่าธรรมเนียม
    return 0.0`,
              solutionCode: `def calculate_fee(amount: float, tier: str) -> float:
    if tier == "VIP":
        return 0.0
    elif tier == "GOLD":
        return 0.0 if amount >= 1000.0 else 10.0
    else: # STANDARD
        return 15.0`,
              hints: ['ตรวจสอบ tier VIP ก่อน คืนค่า 0.0', 'tier GOLD ตรวจสอบว่า amount >= 1000.0 หรือไม่'],
              testCases: [
                {
                  input: 'calculate_fee(500, "STANDARD")',
                  expectedOutput: '15.0',
                  description: 'STANDARD เสียค่าธรรมเนียม 15.0',
                },
                {
                  input: 'calculate_fee(1500, "GOLD")',
                  expectedOutput: '0.0',
                  description: 'GOLD ยอด 1500 ฟรีค่าธรรมเนียม',
                },
              ],
            },
            quiz: [
              {
                id: 'q-fastapi-async',
                question: 'ใน FastAPI เมื่อเราประกาศ route handler เป็น `async def` ข้อใดกล่าวถูกต้องที่สุด?',
                options: [
                  'ฟังก์ชันจะรันใน ThreadPool แยกต่างหากเสมอ',
                  'ฟังก์ชันจะรันบน Event Loop โดยตรง และสามารถใช้คำสั่ง await สำหรับ Non-blocking I/O ได้',
                  'FastAPI จะแปลงโค้ดเป็นภาษา C ก่อนรัน',
                  'ไม่สามารถเชื่อมต่อฐานข้อมูลได้',
                ],
                correctAnswer: 1,
                explanation: 'เมื่อใช้ `async def` ใน FastAPI ตัวฟังก์ชันจะถูกประมวลผลบน AsyncIO Event Loop หลักของ ASGI server (Uvicorn) ทำให้สามารถรันงานแบบ Concurrency ผ่าน await ได้โดยไม่บล็อกเธรด',
              },
            ],
          },
        ],
      },
    ],
  },
];
