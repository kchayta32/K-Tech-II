import { Course } from '@/types';

export const frontendCourses: Course[] = [
  {
    id: 'svelte-5-complete-mastery',
    slug: 'svelte-5-complete-mastery',
    title: 'Svelte 5 และ SvelteKit: สร้างเว็บแอปพลิเคชันยุคใหม่ด้วย Runes',
    titleEn: 'Svelte 5 & SvelteKit: Modern Web Development with Runes',
    tagline: 'เจาะลึกระบบ Reactivity ยุคใหม่ด้วย Svelte 5 Runes และสร้าง Full-stack Web ด้วย SvelteKit',
    description: 'เรียนรู้ Svelte 5 Framework ล่าสุดที่เปลี่ยนผ่านสู่ระบบ Runes ($state, $derived, $effect, $props) ทำความเข้าใจปรัชญา Compiler-first framework และการสร้าง Fullstack Web Application ด้วย SvelteKit ตั้งแต่ Routing, Form Actions, Loaders ไปจนถึง SSR และ Optimistic UI',
    categoryId: 'frontend',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    instructor: {
      name: 'กานต์ นิมิตวัฒนา (Karn Nimit)',
      role: 'Staff Frontend Architect & Svelte Contributor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญด้าน Modern Frontend Performance และ Reactive Systems ประสบการณ์พัฒนาระบบสเกลใหญ่กว่า 10 ปี',
    },
    rating: 4.95,
    reviewsCount: 384,
    enrolledStudents: 2450,
    tags: ['Svelte 5', 'SvelteKit', 'Runes', 'TypeScript', 'Frontend', 'SSR'],
    prerequisites: ['HTML/CSS และ JavaScript ES6+', 'ความเข้าใจพื้นฐานเรื่อง Component-based UI'],
    learningOutcomes: [
      'เข้าใจกลไก Compiler และ Reactivity ระบบใหม่ของ Svelte 5 ด้วย Runes ($state, $derived, $effect)',
      'ใช้งาน $props, $bindable และ Snippets แทน Slots แบบเดิมได้อย่างมีประสิทธิภาพ',
      'สร้าง Full-stack Web Apps ด้วย SvelteKit (Routing, Loaders, Form Actions, API Endpoints)',
      'จัดการ State ข้ามคอมโพเนนต์ด้วย Universal Reactivity และ Svelte Store',
      'ออกแบบ Animations & Transitions ที่ลื่นไหล 60 FPS ด้วย Svelte Motion',
    ],
    badgeIcon: '⚡',
    accentColor: '#FF3E00',
    featured: true,
    modules: [
      {
        id: 'mod-svelte-1',
        title: 'โมดูล 1: ก้าวสู่ Svelte 5 และปรัชญา Runes Reactivity',
        description: 'เข้าใจการเปลี่ยนแปลงครั้งสำคัญใน Svelte 5 จาก let variables สู่ Signals-powered Runes',
        lessons: [
          {
            id: 'svelte-runes-state-derived',
            title: '1.1 ทำความเข้าใจ $state, $derived และการจัดการ Fine-grained Reactivity',
            titleEn: 'Understanding $state, $derived and Fine-Grained Reactivity',
            description: 'เรียนรู้วิธีการประกาศ reactive state และ computed values ด้วย $state และ $derived runes',
            durationMinutes: 35,
            type: 'interactive_code',
            contentMarkdown: `### วิวัฒนาการของ Reactivity ใน Svelte 5

ใน Svelte 4 และเวอร์ชันก่อนหน้า Svelte ใช้ไวยากรณ์ \`let count = 0\` และ \`$: doubled = count * 2\` ซึ่งคอมไพเลอร์จะมองหาเครื่องหมาย assignment (\`=\`) เพื่อ trigger การ re-render

แต่ใน **Svelte 5** ได้เปลี่ยนมาใช้ **Runes** ซึ่งสร้างบนพื้นฐานของ Signals architecture ทำให้ reactivity สามารถทำงานได้ทั้งใน \`.svelte\` files และไฟล์ JavaScript/TypeScript ทั่วไป (\`.svelte.ts\`)

#### 1. \`$state()\` - การประกาศ Reactive State
\`\`\`svelte
<script lang="ts">
  let count = $state(0);
  let user = $state({
    name: 'Somchai',
    preferences: { theme: 'dark', notifications: true }
  });

  function increment() {
    count += 1; // Svelte 5 จะ track การกลายพันธุ์ระดับ deep property โดยอัตโนมัติ
  }

  function toggleTheme() {
    user.preferences.theme = user.preferences.theme === 'dark' ? 'light' : 'dark';
  }
</script>

<button onclick={increment}>
  Clicked {count} times
</button>
<button onclick={toggleTheme}>
  Current Theme: {user.preferences.theme}
</button>
\`\`\`

#### 2. \`$derived()\` และ \`$derived.by()\` - การคำนวณค่าอนุพันธ์
\`\`\`svelte
<script lang="ts">
  let items = $state([
    { id: 1, name: 'MacBook Pro', price: 75000, inStock: true },
    { id: 2, name: 'Magic Mouse', price: 2900, inStock: false },
    { id: 3, name: 'Studio Display', price: 54000, inStock: true },
  ]);

  // Derived พื้นฐาน
  let inStockItems = $derived(items.filter(item => item.inStock));
  
  // Derived ที่มีการคำนวณซับซ้อน (Derived by block)
  let totalPrice = $derived.by(() => {
    return inStockItems.reduce((sum, item) => sum + item.price, 0);
  });
</script>
\`\`\`

> [!TIP]
> \`$derived\` จะ re-evaluate เฉพาะเมื่อ dependencies ที่มันอ่านค่ามีการเปลี่ยนแปลงเท่านั้น และเป็น lazy evaluation ช่วยประหยัด CPU cycles ได้อย่างมหาศาล`,
            exercise: {
              id: 'ex-svelte-runes',
              title: 'สร้าง Shopping Cart Summary ด้วย $state และ $derived',
              instructions: 'เขียนฟังก์ชันคำนวณ `subtotal`, `discountAmount` (ส่วนลด 10% หากยอดรวมเกินหรือเท่ากับ 5,000 บาท), และ `netTotal`',
              language: 'typescript',
              initialCode: `// เขียนโค้ดคำนวณยอดเงิน Cart Summary
export function calculateCart(items: { name: string; price: number; quantity: number }[]) {
  // TODO: คำนวณ subtotal, discount, netTotal
  let subtotal = 0;
  let discount = 0;
  let netTotal = 0;

  return { subtotal, discount, netTotal };
}`,
              solutionCode: `export function calculateCart(items: { name: string; price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const discount = subtotal >= 5000 ? subtotal * 0.1 : 0;
  const netTotal = subtotal - discount;

  return { subtotal, discount, netTotal };
}`,
              hints: [
                'ใช้ items.reduce คำนวณ subtotal จาก price * quantity',
                'ตรวจสอบเงื่อนไข subtotal >= 5000 สำหรับส่วนลด 10%',
                'netTotal เท่ากับ subtotal ลบด้วย discount',
              ],
              testCases: [
                {
                  input: 'calculateCart([{ name: "Keyboard", price: 3000, quantity: 2 }])',
                  expectedOutput: '{"subtotal":6000,"discount":600,"netTotal":5400}',
                  description: 'คำนวณยอดเกิน 5,000 ได้รับส่วนลด 10%',
                },
                {
                  input: 'calculateCart([{ name: "Mousepad", price: 800, quantity: 1 }])',
                  expectedOutput: '{"subtotal":800,"discount":0,"netTotal":800}',
                  description: 'คำนวณยอดไม่เกิน 5,000 ไม่ได้ส่วนลด',
                },
              ],
            },
            quiz: [
              {
                id: 'q-svelte-1',
                question: 'ใน Svelte 5 ข้อใดถูกต้องเกี่ยวกับ $derived.by() เมื่อเทียบกับ $derived()?',
                options: [
                  '$derived.by() ใช้สำหรับ async function เท่านั้น',
                  '$derived.by() รับ callback function เพื่อรองรับ logic การคำนวณที่มีหลายขั้นตอนหรือมีเงื่อนไขซับซ้อน',
                  '$derived.by() จะอัปเดตค่าเมื่อ DOM re-render เท่านั้น',
                  '$derived.by() ไม่สามารถเข้าถึงตัวแปร $state ได้',
                ],
                correctAnswer: 1,
                explanation: '$derived.by(() => { ... }) ถูกออกแบบมาเพื่อรับ anonymous function ที่มี logic หลายบรรทัด หรือเงื่อนไขที่ซับซ้อนและส่งคืนค่าที่คำนวณแล้วออกมา',
              },
            ],
          },
          {
            id: 'svelte-props-snippets',
            title: '1.2 ระบบ $props, $bindable และ Snippets แทนที่ Slots',
            titleEn: 'Component Props, Two-Way Binding and Snippets vs Slots',
            description: 'การรับส่งข้อมูลระหว่างคอมโพเนนต์ด้วย $props rune และการออกแบบ Custom Templates ด้วย Snippets',
            durationMinutes: 30,
            type: 'interactive_code',
            contentMarkdown: `### การรับ Props ใน Svelte 5

ลาก่อน \`export let foo = 'bar'\` ใน Svelte 5 เราประกาศ Props ทั้งหมดผ่าน Rune เดียวคือ \`$props()\`

\`\`\`svelte
<!-- Button.svelte -->
<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    label: string;
    onclick?: () => void;
  }

  let { 
    variant = 'primary', 
    disabled = false, 
    label, 
    onclick 
  }: Props = $props();
</script>

<button class="btn btn-{variant}" {disabled} {onclick}>
  {label}
</button>
\`\`\`

### การทำ Two-way Binding ด้วย \`$bindable()\`
หากต้องการให้ Parent สามารถใช้ \`bind:value\` กับคอมโพเนนต์ลูกได้ คอมโพเนนต์ลูกต้องประกาศค่านั้นด้วย \`$bindable()\`:

\`\`\`svelte
<!-- CustomInput.svelte -->
<script lang="ts">
  let { value = $bindable(''), label }: { value: string; label: string } = $props();
</script>

<label>
  {label}
  <input bind:value={value} />
</label>
\`\`\`

### Snippets: ปฏิวัติการสร้าง Reusable Template Blocks
ใน Svelte 5 คำสั่ง \`<slot>\` ถูกยกเลิกและแทนที่ด้วย **Snippets** ที่ทรงพลังและ type-safe กว่ามาก

\`\`\`svelte
<!-- Card.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    title, 
    header, 
    children, 
    footer 
  }: {
    title: string;
    header?: Snippet<[string]>;
    children: Snippet;
    footer?: Snippet;
  } = $props();
</script>

<div class="card">
  {#if header}
    {@render header(title)}
  {:else}
    <h3>{title}</h3>
  {/if}

  <div class="card-body">
    {@render children()}
  </div>

  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>
\`\`\``,
            quiz: [
              {
                id: 'q-svelte-snippets',
                question: 'คำสั่งใดใน Svelte 5 ใช้สำหรับ render snippet block ใน template?',
                options: ['<slot />', '{@render mySnippet()}', '{#snippet mySnippet}', '<svelte:fragment>'],
                correctAnswer: 1,
                explanation: 'ใน Svelte 5 ใช้แท็ก `{@render snippetName(args)}` ในการ render snippet ที่ส่งเข้ามาหรือประกาศไว้',
              },
            ],
          },
        ],
      },
      {
        id: 'mod-svelte-2',
        title: 'โมดูล 2: SvelteKit Full-stack Architecture & Form Actions',
        description: 'การสร้างแอปพลิเคชัน SSR, API Endpoints, Data Loaders และ Progressive Enhancement',
        lessons: [
          {
            id: 'sveltekit-routing-loaders',
            title: '2.1 File-based Routing, +page.server.ts และ Data Loaders',
            titleEn: 'File-based Routing, Server Loaders and Page Data',
            description: 'โครงสร้าง SvelteKit Routing, การ Fetch ข้อมูลบน Server (+page.server.ts) และ Type-safe Data flow',
            durationMinutes: 40,
            type: 'reading',
            contentMarkdown: `### สถาปัตยกรรม File-based Routing ของ SvelteKit

SvelteKit ใช้โครงสร้างโฟลเดอร์ใน \`src/routes/\` ในการสร้าง Route:

- \`+page.svelte\`: UI ของหน้านั้นๆ
- \`+page.ts\` หรือ \`+page.server.ts\`: โค้ดสำหรับโหลดข้อมูล (Data Loaders)
- \`+layout.svelte\`: Layout ครอบหน้าที่ใช้ร่วมกันในโฟลเดอร์นั้น
- \`+server.ts\`: API Endpoint สำหรับ REST / Webhook

#### การโหลดข้อมูลด้วย \`+page.server.ts\`
\`\`\`typescript
// src/routes/products/[id]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async ({ params, locals }) => {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { reviews: true }
  });

  if (!product) {
    throw error(404, 'ไม่พบสินค้าที่คุณต้องการ');
  }

  return {
    product,
    user: locals.user
  };
};
\`\`\`

#### การเข้าถึงข้อมูลใน \`+page.svelte\` แบบ Type-Safe:
\`\`\`svelte
<!-- src/routes/products/[id]/+page.svelte -->
<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1>{data.product.name}</h1>
<p class="price">{data.product.price.toLocaleString()} THB</p>
\`\`\``,
          },
          {
            id: 'sveltekit-form-actions',
            title: '2.2 Form Actions & Progressive Enhancement with use:enhance',
            titleEn: 'Server Form Actions and Progressive Enhancement',
            description: 'การจัดการ Mutation ข้อมูลด้วย Form Actions และสร้าง Smooth UX ด้วย use:enhance',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### Form Actions ใน SvelteKit

Form Actions ช่วยให้การ submit ฟอร์มทำงานได้แม้ JavaScript บนเบราว์เซอร์จะยังโหลดไม่เสร็จ (Progressive Enhancement)

#### 1. การสร้าง Form Action ใน \`+page.server.ts\`
\`\`\`typescript
// src/routes/contact/+page.server.ts
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!email || !email.includes('@')) {
      return fail(400, { email, missingEmail: true, message: 'กรุณากรอกอีเมลที่ถูกต้อง' });
    }

    return { success: true };
  }
};
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    id: 'typescript-advanced-patterns',
    slug: 'typescript-advanced-patterns',
    title: 'TypeScript Advanced Patterns: สถาปัตยกรรม Type ระดับสูง',
    titleEn: 'TypeScript Advanced Patterns & Type System Architecture',
    tagline: 'เข้าใจ Type System ระดับลึก: Generics, Conditional Types, Template Literals, และ Type Narrowing',
    description: 'ยกระดับการเขียน TypeScript สู่ระดับ Production Architecture เจาะลึก Generics, Type Narrowing, Discriminated Unions, Mapped Types, Conditional Types, Template Literal Types, Branded Types, และการเขียน Type-safe APIs ที่ป้องกัน Bug ได้ตั้งแต่ Compile-time',
    categoryId: 'frontend',
    difficulty: 'Advanced',
    estimatedHours: 15,
    instructor: {
      name: 'ดร. วิศรุต อัครพาณิชย์ (Dr. Wissarut A.)',
      role: 'Principal Software Architect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญด้าน Type Theory และ Large-scale TypeScript Systems ผู้เขียนหนังสือ Modern TypeScript in Action',
    },
    rating: 4.98,
    reviewsCount: 512,
    enrolledStudents: 3100,
    tags: ['TypeScript', 'Generics', 'Type-System', 'Software-Design', 'Frontend'],
    prerequisites: ['ความเข้าใจ TypeScript พื้นฐาน (interfaces, basic types, functions)'],
    learningOutcomes: [
      'เข้าใจและสร้าง Complex Generics พร้อม Constraints ที่ปลอดภัย',
      'ออกแบบ Discriminated Unions และเขียน Custom Type Guards เพื่อ Narrow Types',
      'ประยุกต์ใช้ Conditional Types (infer keyword) และ Template Literal Types',
      'สร้าง Deep Readonly, Deep Partial และ Utility Types ระดับสูงด้วย Mapped Types',
      'ป้องกัน Runtime primitive injection ด้วย Branded Types & Nominal Typing',
    ],
    badgeIcon: '🔷',
    accentColor: '#3178C6',
    featured: true,
    modules: [
      {
        id: 'mod-ts-1',
        title: 'โมดูล 1: Advanced Generics & Type Constraints',
        description: 'การสร้างฟังก์ชันและคลาสที่ยืดหยุ่นด้วย Generic Type Parameters พร้อม Type Safety เต็มร้อย',
        lessons: [
          {
            id: 'ts-generics-constraints',
            title: '1.1 Deep Dive Generics, Keyof และ Type Constraints (extends keyof)',
            titleEn: 'Deep Dive into Generics, Keyof and Type Constraints',
            description: 'สร้าง Generic functions ที่มีข้อกำหนดเฉพาะเจาะจง ป้องกัน runtime error จากการอ่าน property ผิดพลาด',
            durationMinutes: 40,
            type: 'interactive_code',
            contentMarkdown: `### การใช้งาน Generics พร้อม Constraints

Generics ทำให้โค้ดของเราทำงานกับข้อมูลได้หลายชนิดโดยยังคง Type Safety ไว้อย่างสมบูรณ์

#### ตัวอย่าง: Type-safe \`getProperty\` และ \`pluck\`
\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 'usr_102',
  name: 'Anan',
  age: 28,
  role: 'ADMIN' as const
};

const userName = getProperty(user, 'name'); // Type: string
const userAge = getProperty(user, 'age');   // Type: number
\`\`\``,
            exercise: {
              id: 'ex-ts-pluck',
              title: 'สร้าง Type-safe Pluck Utility Function',
              instructions: 'เขียนฟังก์ชัน `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` เพื่อดึงค่า property `key` ออกมาจาก array ของ object ทุกตัว',
              language: 'typescript',
              initialCode: `export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // TODO: เขียน logic ดึงค่า array ของ property ออกมา
  return [];
}`,
              solutionCode: `export function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}`,
              hints: ['ใช้ Array.prototype.map() เพื่อเข้าถึง item[key]'],
              testCases: [
                {
                  input: 'pluck([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }], "name")',
                  expectedOutput: '["Alice","Bob"]',
                  description: 'ดึงรายชื่อ name ออกมาจาก array',
                },
                {
                  input: 'pluck([{ age: 20 }, { age: 30 }], "age")',
                  expectedOutput: '[20,30]',
                  description: 'ดึง array ตัวเลขอายุ',
                },
              ],
            },
            quiz: [
              {
                id: 'q-ts-keyof',
                question: 'หาก T คือ interface { a: number; b: string } แล้ว type ของ keyof T คืออะไร?',
                options: ['string | number', '"a" | "b"', '["a", "b"]', 'any'],
                correctAnswer: 1,
                explanation: 'keyof T จะสร้าง union type ของ string literal keys ทั้งหมดที่มีอยู่ใน interface นั้น ซึ่งคือ "a" | "b"',
              },
            ],
          },
          {
            id: 'ts-discriminated-unions',
            title: '1.2 Discriminated Unions & Exhaustive Pattern Matching',
            titleEn: 'Discriminated Unions and Exhaustive Type Checking',
            description: 'ออกแบบระบบ State Machine และ Event Payload ด้วย Tagged/Discriminated Unions พร้อม Exhaustiveness check',
            durationMinutes: 35,
            type: 'interactive_code',
            contentMarkdown: `### Discriminated Unions (Tagged Unions)

Discriminated Union คือการกำหนด union ของ types ที่มี property ร่วมกันอย่างน้อยหนึ่งตัว (Discriminant) ซึ่งเป็น Literal type เพื่อให้ TypeScript สามารถทำ Type Narrowing ได้ 100%

\`\`\`typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; timestamp: number }
  | { status: 'error'; error: Error };
\`\`\``,
          },
        ],
      },
      {
        id: 'mod-ts-2',
        title: 'โมดูล 2: Conditional Types & Template Literal Types',
        description: 'การเขียน Type Logic ขั้นสูงด้วย infer keyword และ String template type manipulation',
        lessons: [
          {
            id: 'ts-conditional-infer',
            title: '2.1 Conditional Types และการแกะ Type ด้วย `infer` Keyword',
            titleEn: 'Conditional Types and Type Extraction using `infer`',
            description: 'ทำความเข้าใจ T extends U ? X : Y และการสกัด ReturnType, UnwrapPromise ด้วย infer',
            durationMinutes: 45,
            type: 'reading',
            contentMarkdown: `### Conditional Types: Ternary Operator ในระดับ Type

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type A = IsString<'hello'>; // true
type B = IsString<123>;     // false

// แกะ Type ที่ถูกครอบด้วย Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
\`\`\``,
          },
        ],
      },
    ],
  },
  {
    id: 'd3js-interactive-dataviz',
    slug: 'd3js-interactive-dataviz',
    title: 'Interactive Data Visualization ด้วย D3.js และ SVG',
    titleEn: 'Interactive Data Visualization with D3.js & SVG',
    tagline: 'สร้าง Interactive Charts, Force-Directed Graphs, และ Custom Dashboards ระดับมืออาชีพ',
    description: 'เรียนรู้ D3.js v7 แบบลงลึก เข้าใจ Data-Join Lifecycle (enter, update, exit), การใช้ D3 Scales (scaleLinear, scaleBand, scaleTime), การวาดกราฟิก SVG ทางคณิตศาสตร์, การสร้าง Force-directed simulation สำหรับ Node Graphs, และการทำ Zoom, Pan, Brush เพื่อสร้าง Dashboard ระดับ Enterprise',
    categoryId: 'frontend',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    instructor: {
      name: 'พัชรินทร์ วัฒนศิลป์ (Patcharin W.)',
      role: 'Lead Data Visualization Engineer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'ผู้เชี่ยวชาญการออกแบบ Data Storytelling และพัฒนา Interactive Charts สำหรับ FinTech และ AI Analytics',
    },
    rating: 4.92,
    reviewsCount: 290,
    enrolledStudents: 1820,
    tags: ['D3.js', 'Data-Visualization', 'SVG', 'Frontend', 'Charts', 'Animation'],
    prerequisites: ['HTML, SVG พื้นฐาน, JavaScript ES6+', 'ความรู้พื้นฐานเวกเตอร์และระบบพิกัด x, y'],
    learningOutcomes: [
      'เข้าใจกลไก Data Binding และ .join() lifecycle ของ D3.js อย่างถ่องแท้',
      'เลือกและปรับแต่ง Scales (Linear, Band, Time, Ordinal, Color scales) ได้อย่างถูกต้อง',
      'สร้าง Bar Charts, Line Charts, Donut Charts พร้อม Animated Transitions',
      'สร้าง Force-directed Simulation สำหรับ Network Graph Visualization',
      'รวม D3.js เข้ากับ Framework สมัยใหม่อย่าง Svelte หรือ React ได้อย่างไร้รอยต่อ',
    ],
    badgeIcon: '📊',
    accentColor: '#F9A03F',
    featured: false,
    modules: [
      {
        id: 'mod-d3-1',
        title: 'โมดูล 1: D3 Fundamentals, DOM Selection & Scales',
        description: 'พื้นฐานการ Select, Data Binding และการแปลงค่า Domain สู่ Range พิกัดหน้าจอ',
        lessons: [
          {
            id: 'd3-scales-and-axes',
            title: '1.1 D3 Scales: scaleLinear, scaleBand และการวาดแกน (Axes)',
            titleEn: 'D3 Scales (Linear, Band, Time) and SVG Axes Generation',
            description: 'ทำความเข้าใจ Domain vs Range และการใช้ d3.axisBottom, d3.axisLeft',
            durationMinutes: 45,
            type: 'interactive_code',
            visualizerType: 'd3-chart',
            contentMarkdown: `### D3 Scales: หัวใจสำคัญของการแปลงข้อมูลสู่กราฟิก

Scale ใน D3.js คือฟังก์ชันคณิตศาสตร์ที่แปลง **Domain** (ขอบเขตข้อมูลจริง เช่น ยอดขาย 0 ถึง 1,000,000 บาท) ไปเป็น **Range** (ขอบเขตพิกัดพิกเซลบนหน้าจอ เช่น 0 ถึง 600px)

\`\`\`javascript
import * as d3 from 'd3';

// 1. Linear Scale สำหรับตัวเลขต่อเนื่อง (Continuous data)
const yScale = d3.scaleLinear()
  .domain([0, 100])      // Min, Max ของ Data
  .range([400, 0]);      // Min, Max ของพิกัด SVG (แกน Y บน SVG จะเริ่มจากบนลงล่าง จึงกลับ 400 -> 0)

// 2. Band Scale สำหรับข้อมูลหมวดหมู่ (Categorical data เช่น ชื่อเดือน, ประเภทสินค้า)
const xScale = d3.scaleBand()
  .domain(['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.'])
  .range([0, 500])
  .padding(0.2); // ช่องว่างระหว่างแท่งกราฟ
\`\`\``,
            exercise: {
              id: 'ex-d3-linear-scale',
              title: 'สร้างฟังก์ชัน Linear Scale คำนวณพิกัด Y',
              instructions: 'เขียนฟังก์ชันจำลอง Linear scale เพื่อแปลงค่า `value` จาก `[domainMin, domainMax]` ไปเป็นพิกัด `[rangeMin, rangeMax]`',
              language: 'javascript',
              initialCode: `export function linearScale(value, domainMin, domainMax, rangeMin, rangeMax) {
  // TODO: คำนวณพิกัดเชิงเส้น
  return 0;
}`,
              solutionCode: `export function linearScale(value, domainMin, domainMax, rangeMin, rangeMax) {
  const percentage = (value - domainMin) / (domainMax - domainMin);
  return rangeMin + percentage * (rangeMax - rangeMin);
}`,
              hints: ['หาอัตราส่วน (value - domainMin) / (domainMax - domainMin) แล้วนำไปคูณกับช่วงของ range'],
              testCases: [
                {
                  input: 'linearScale(50, 0, 100, 0, 500)',
                  expectedOutput: '250',
                  description: 'แปลงค่า 50 ในช่วง 0-100 สู่ช่วง 0-500 ได้ 250',
                },
                {
                  input: 'linearScale(0, 0, 100, 400, 0)',
                  expectedOutput: '400',
                  description: 'แปลงค่า 0 ในช่วง 0-100 สู่พิกัดกลับทิศ 400-0 ได้ 400',
                },
              ],
            },
            quiz: [
              {
                id: 'q-d3-scales',
                question: 'ทำไมแกน Y ใน D3 SVG Scale จึงมักกำหนด range เป็น [height, 0] แทนที่จะเป็น [0, height]?',
                options: [
                  'เพราะ D3.js บังคับให้เขียนแบบย้อนกลับ',
                  'เพราะระบบพิกัด SVG มีจุด (0, 0) อยู่ที่มุมซ้ายบน ค่า y=0 คือจุดบนสุด ค่า y มากขึ้นจะเลื่อนลงล่าง',
                  'เพื่อให้กราฟแสดงข้อมูลติดลบได้ถูกต้อง',
                  'เพื่อเพิ่มความเร็วในการคำนวณของ Browser GPU',
                ],
                correctAnswer: 1,
                explanation: 'ใน SVG coordinate system จุด (0,0) อยู่ที่มุมซ้ายบนสุด เมื่อค่า y เพิ่มขึ้นจะวิ่งลงข้างล่าง เพื่อให้ค่าข้อมูลสูงสุดอยู่บนสุด เราจึงต้อง Map domain สูงสุดไปยัง range y=0',
              },
            ],
          },
        ],
      },
      {
        id: 'mod-d3-2',
        title: 'โมดูล 2: Force-Directed Simulations & Network Graphs',
        description: 'การสร้าง Interactive Network Topology และ Social Graph ด้วย D3 Force Simulation',
        lessons: [
          {
            id: 'd3-force-simulation',
            title: '2.1 Force-directed Layout (d3-force) และ Drag Interactions',
            titleEn: 'Force-directed Layout Simulation and Node Dragging',
            description: 'กำหนดแรงดึงดูด (forceManyBody), การเชื่อมโยง (forceLink), และแรงศูนย์กลาง (forceCenter)',
            durationMinutes: 50,
            type: 'reading',
            visualizerType: 'd3-chart',
            contentMarkdown: `### Force Simulation ใน D3

โมดูล \`d3-force\` จำลองแรงทางฟิสิกส์ระหว่างอนุภาค (Nodes) และเส้นเชื่อม (Links)

\`\`\`javascript
import * as d3 from 'd3';

const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
const links = [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'C' },
  { source: 'B', target: 'D' },
];

const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(80))
  .force('charge', d3.forceManyBody().strength(-300)) // แรงผลักออกจากกัน
  .force('center', d3.forceCenter(width / 2, height / 2)) // ดูดเข้ากึ่งกลาง
  .force('collision', d3.forceCollide().radius(25)); // ป้องกันโหนดทับกัน
\`\`\``,
          },
        ],
      },
    ],
  },
];
