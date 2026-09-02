import { Course } from '@/types';

export const aimlCourses: Course[] = [
  {
    id: 'openai-claude-llm-engineering',
    slug: 'openai-claude-llm-engineering',
    title: 'LLM Application Engineering ด้วย OpenAI & Claude APIs',
    titleEn: 'LLM Application Engineering with OpenAI & Claude APIs',
    tagline: 'สร้าง AI Applications ระดับ Production: Prompt Engineering, Tool Calling, Structured Outputs และ RAG',
    description: 'เรียนรู้การสร้างแอปพลิเคชันปัญญาประดิษฐ์ยุค Generative AI ด้วย OpenAI GPT-4o และ Anthropic Claude 3.5 Sonnet เจาะลึกเทคนิค Prompt Engineering ชั้นสูง (Few-shot, Chain-of-Thought), การทำ Tool / Function Calling เพื่อให้ LLM เชื่อมต่อกับฐานข้อมูลและ APIs ภายนอก, การบังคับผลลัพธ์แบบ Structured JSON Outputs ด้วย Pydantic/Zod, การสร้าง Retrieval-Augmented Generation (RAG) ด้วย Vector Databases (Pinecone/Qdrant), และการพัฒนา Autonomous Agent Systems',
    categoryId: 'ai-ml',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    instructor: {
      name: 'ดร. นภนต์ จิตรกานต์ (Dr. Naphon J.)',
      role: 'Principal AI & LLM Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'อดีตนักวิจัย NLP และผู้เชี่ยวชาญการ Implement RAG Enterprise Systems ให้กับสถาบันการเงินและ Tech Unicorns',
    },
    rating: 4.98,
    reviewsCount: 520,
    enrolledStudents: 3890,
    tags: ['OpenAI', 'Claude', 'LLM', 'RAG', 'Prompt-Engineering', 'LangChain', 'AI-ML'],
    prerequisites: ['Python หรือ TypeScript พื้นฐาน', 'ความเข้าใจสถาปัตยกรรม REST API'],
    learningOutcomes: [
      'เข้าใจกลไกและ Parameter ของ LLMs (Temperature, Top-p, Context Window, Tokenization)',
      'ใช้งาน Tool/Function Calling เพื่อให้ AI เรียกใช้ฟังก์ชันและ APIs ภายนอกได้อย่างแม่นยำ',
      'บังคับผลลัพธ์เป็น Strict JSON Schema ด้วย Structured Outputs',
      'ออกแบบระบบ RAG แบบครบวงจร: Chunking, Embeddings, Vector Search, Re-ranking',
      'สร้าง AI Autonomous Agents พร้อมระบบ Memory และ Error Recovery',
    ],
    badgeIcon: '🤖',
    accentColor: '#10A37F',
    featured: true,
    modules: [
      {
        id: 'mod-llm-1',
        title: 'โมดูล 1: LLM Tool Calling & Structured Outputs',
        description: 'การเชื่อมต่อโมเดลภาษาเข้ากับโค้ดและเครื่องมือจริง เพื่อสร้าง AI ที่ลงมือทำงานได้',
        lessons: [
          {
            id: 'llm-tool-calling-structured',
            title: '1.1 Tool Calling (Function Calling) และ Structured Outputs ด้วย JSON Schema',
            titleEn: 'Tool Calling (Function Calling) and Strict Structured Outputs',
            description: 'การประกาศ Tool Schema, การ Handle tool_calls จาก AI และการส่ง Tool Response กลับไปสังเคราะห์คำตอบ',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### กลไก Tool Calling ใน Modern LLMs

Tool Calling เปิดโอกาสให้ LLM สามารถตัดสินใจได้ว่าเมื่อไหร่ควรเรียกใช้ฟังก์ชันภายนอก พร้อมสกัด Arguments ที่จำเป็นออกมาให้อย่างแม่นยำ

\`\`\`python
from openai import OpenAI
from pydantic import BaseModel, Field
import json

client = OpenAI()

# 1. กำหนดฟังก์ชันจริงบนระบบของเรา
def check_stock(product_name: str) -> dict:
    stock_db = {"iphone 16 pro": 15, "macbook air": 0, "airpods pro": 42}
    qty = stock_db.get(product_name.lower(), -1)
    return {"product": product_name, "in_stock": qty > 0, "quantity": max(0, qty)}

# 2. ประกาศ Tool Definitions ให้ LLM ทราบ
tools = [
    {
        "type": "function",
        "function": {
            "name": "check_stock",
            "description": "ตรวจสอบจำนวนสินค้าคงเหลือในคลังสินค้าตามชื่อสินค้า",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_name": {
                        "type": "string",
                        "description": "ชื่อสินค้า เช่น 'iPhone 16 Pro', 'MacBook Air'"
                    }
                },
                "required": ["product_name"],
                "additionalProperties": False
            },
            "strict": True
        }
    }
]

# 3. ส่งคำถามของผู้ใช้ไปยัง OpenAI พร้อม Tools
user_prompt = "ตอนนี้หน้าร้านเรามี iPhone 16 Pro กับ MacBook Air เหลืออยู่ในสต็อกบ้างไหม?"
messages = [{"role": "user", "content": user_prompt}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# 4. ตรวจสอบว่าโมเดลต้องการเรียก Tool หรือไม่
response_message = response.choices[0].message
if response_message.tool_calls:
    messages.append(response_message) # ใส่ assistant tool_calls message กลับเข้าประวัติ
    
    for tool_call in response_message.tool_calls:
        args = json.loads(tool_call.function.arguments)
        tool_result = check_stock(args["product_name"])
        
        # ส่งผลลัพธ์ของ Tool กลับไปให้โมเดล
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(tool_result)
        })
        
    # เรียก Completion รอบสุดท้ายเพื่อให้ AI สรุปคำตอบเป็นภาษาธรรมชาติ
    final_response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages
    )
    print(final_response.choices[0].message.content)
\`\`\``,
            exercise: {
              id: 'ex-prompt-template',
              title: 'สร้าง Prompt Template สำหรับ Support AI',
              instructions: 'เขียนฟังก์ชัน `build_support_prompt(customer_name, issue, tier)` เพื่อจัดรูปแบบ Prompt สำหรับ Customer Support โดยเพิ่มคำทักทายพิเศษสำหรับ tier "VIP"',
              language: 'python',
              initialCode: `def build_support_prompt(customer_name: str, issue: str, tier: str) -> str:
    # TODO: สร้าง System / User Prompt Template
    return ""`,
              solutionCode: `def build_support_prompt(customer_name: str, issue: str, tier: str) -> str:
    vip_note = " Priority: VIP Customer." if tier == "VIP" else ""
    return f"Customer: {customer_name} ({tier}).{vip_note} Issue: {issue}. Please resolve politely."`,
              hints: ['ตรวจสอบว่า tier == "VIP" เพื่อแทรกข้อความ Priority'],
              testCases: [
                {
                  input: 'build_support_prompt("Alice", "Login failed", "VIP")',
                  expectedOutput: '"Customer: Alice (VIP). Priority: VIP Customer. Issue: Login failed. Please resolve politely."',
                  description: 'จัดรูปแบบ Prompt สำหรับลูกค้าระดับ VIP ถูกต้อง',
                },
              ],
            },
            quiz: [
              {
                id: 'q-llm-strict-tools',
                question: 'ใน OpenAI Structured Outputs และ Strict Tool Calling การตั้งค่า `"strict": true` บังคับเงื่อนไขใดใน JSON Schema?',
                options: [
                  'ห้ามใช้ตัวอักษรภาษาอังกฤษ',
                  'ต้องกำหนด `"additionalProperties": false` และทุก field ต้องระบุใน `"required"` array',
                  'ผลลัพธ์ต้องมีความยาวไม่เกิน 100 tokens',
                  'ต้องรันโมเดลบน Local GPU เท่านั้น',
                ],
                correctAnswer: 1,
                explanation: 'ใน Strict mode ของ OpenAI ทุก properties จะต้องถูกระบุใน array `required` และห้ามมี key เกิน โดยต้องระบุ `"additionalProperties": false` เพื่อให้การันตีผลลัพธ์ 100% ตาม Schema',
              },
            ],
          },
          {
            id: 'llm-rag-architecture',
            title: '1.2 สถาปัตยกรรม Retrieval-Augmented Generation (RAG)',
            titleEn: 'RAG Architecture: Chunking, Embeddings and Vector Search',
            description: 'ทำความเข้าใจกระบวนการ Semantic Chunking, Vector Embeddings (text-embedding-3) และ Cosine Similarity',
            durationMinutes: 50,
            type: 'reading',
            visualizerType: 'neural-net',
            contentMarkdown: `### วงจรการทำงานของระบบ RAG (Retrieval-Augmented Generation)

RAG ช่วยแก้ปัญหา Hallucination และทำให้ AI สามารถตอบคำถามจากเอกสารภายในองค์กรได้อย่างถูกต้อง

1. **Document Ingestion**: นำเอกสาร PDF, Word, Markdown มาทำความสะอาด
2. **Chunking Strategy**: หั่นเอกสารเป็นท่อนๆ เช่น 500 tokens พร้อม Overlap 50 tokens
3. **Embedding Generation**: แปลงข้อความแต่ละ Chunk เป็น Dense Vector ด้วยโมเดล Embedding (เช่น \`text-embedding-3-small\` ขนาด 1,536 มิติ)
4. **Vector Database Indexing**: เก็บ Vector ลงฐานข้อมูลเวกเตอร์ เช่น Qdrant, Pinecone หรือ pgvector
5. **Retrieval**: เมื่อผู้ใช้ถามคำถาม จะแปลงคำถามเป็น Vector แล้วทำ Cosine Similarity Search ค้นหา Top-K chunks ที่ใกล้เคียงที่สุด
6. **Augmented Generation**: นำ Context Chunks ที่ค้นพบ ใส่ประกอบเข้าไปใน Prompt ส่งให้ LLM ตอบคำถาม`,
          },
        ],
      },
    ],
  },
  {
    id: 'huggingface-transformers-mastery',
    slug: 'huggingface-transformers-mastery',
    title: 'Hugging Face & Transformer Models: จาก Pipeline สู่ Fine-tuning',
    titleEn: 'Hugging Face & Transformer Models: From Pipelines to Fine-Tuning',
    tagline: 'เจาะลึกสถาปัตยกรรม Transformers, Tokenizers, Hugging Face Hub และการทำ Fine-tuning ด้วย LoRA/PEFT',
    description: 'เรียนรู้หัวใจของ Deep Learning สมัยใหม่: Self-Attention Mechanism, Multi-Head Attention, BERT, RoBERTa, LLaMA, และ Mistral เข้าใจการใช้งานไลบรารี Hugging Face \`transformers\`, \`datasets\`, \`accelerate\`, \`peft\`, การทำ Parameter-Efficient Fine-Tuning (PEFT/LoRA) สำหรับโมเดลภาษาขนาดใหญ่ และการ Deploy โมเดลบน Hugging Face Spaces & Inference Endpoints',
    categoryId: 'ai-ml',
    difficulty: 'Advanced',
    estimatedHours: 16,
    instructor: {
      name: 'พัชราภา วงศ์สุวรรณ (Patcharapa W.)',
      role: 'Senior Machine Learning Scientist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bio: 'นักวิจัย Transformer Models และผู้นำการประยุกต์ใช้ Open-weights LLMs สำหรับงานวิเคราะห์ภาษาไทย',
    },
    rating: 4.94,
    reviewsCount: 310,
    enrolledStudents: 2150,
    tags: ['Hugging-Face', 'Transformers', 'PyTorch', 'Fine-Tuning', 'LoRA', 'NLP', 'AI-ML'],
    prerequisites: ['Python และพื้นฐาน Machine Learning / Deep Learning เบื้องต้น'],
    learningOutcomes: [
      'เข้าใจสมการ Self-Attention: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V',
      'ใช้งาน Hugging Face Pipelines สำหรับงาน Text Classification, NER, Summarization',
      'ทำ Data Preprocessing & Tokenization ด้วย AutoTokenizer',
      'ทำ Fine-tuning โมเดลด้วย LoRA (Low-Rank Adaptation) และ QLoRA 4-bit Quantization',
      'ประเมินประสิทธิภาพโมเดลด้วย ROUGE, BLEU, Perplexity และ Hugging Face Evaluate',
    ],
    badgeIcon: '🤗',
    accentColor: '#FFD21E',
    featured: false,
    modules: [
      {
        id: 'mod-hf-1',
        title: 'โมดูล 1: Transformer Architecture & Tokenizers',
        description: 'เข้าใจกลไก Attention Mechanism และการแปลงข้อความเป็นตัวเลขด้วย Tokenizer',
        lessons: [
          {
            id: 'hf-pipelines-tokenizers',
            title: '1.1 Hugging Face Pipelines, AutoModel และ AutoTokenizer',
            titleEn: 'Hugging Face Pipelines, AutoModel and Tokenizer Internals',
            description: 'การโหลดโมเดล Pre-trained, การแปลง Input IDs & Attention Mask, และการทำ Inference',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### การทำงานกับ Hugging Face Transformers

\`\`\`python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# 1. โหลด Tokenizer และ Model จาก Hugging Face Hub
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# 2. Tokenize ข้อความ (แปลงข้อความเป็น Token IDs และ Attention Mask)
sentences = ["This course provides phenomenal depth!", "The documentation was confusing."]
inputs = tokenizer(sentences, padding=True, truncation=True, return_tensors="pt")

print("Input IDs shape:", inputs["input_ids"].shape)
print("Attention Mask:", inputs["attention_mask"])

# 3. Model Inference (Forward Pass)
with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits
    probabilities = torch.softmax(logits, dim=-1)

# 4. แปลง Logits เป็นผลลัพธ์
for sentence, prob in zip(sentences, probabilities):
    pos_score = prob[1].item()
    label = "POSITIVE" if pos_score > 0.5 else "NEGATIVE"
    print(f"Text: '{sentence}' -> {label} ({max(prob).item()*100:.2f}%)")
\`\`\``,
            quiz: [
              {
                id: 'q-hf-attention-mask',
                question: 'Attention Mask ใน Hugging Face Transformers มีหน้าที่อะไร?',
                options: [
                  'บดบังข้อความที่เป็นความลับ',
                  'บอกให้โมเดลทราบว่าตำแหน่งใดเป็น Token จริง (ค่า 1) และตำแหน่งใดเป็น Padding Token ที่ไม่ต้องคำนวณ Attention (ค่า 0)',
                  'สุ่ม Dropout เลเยอร์ในระหว่างการเทรน',
                  'คำนวณ Loss Function ของโมเดล',
                ],
                correctAnswer: 1,
                explanation: 'Attention Mask เป็น binary tensor (0 หรือ 1) เพื่อระบุให้โมเดลประมวลผลเฉพาะโทเค็นจริง และละเลย (mask out) โทเค็นที่เป็น Padding ที่เติมเข้ามาเพื่อให้ batch มีความยาวเท่ากัน',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'python-ml-pipelines-production',
    slug: 'python-ml-pipelines-production',
    title: 'End-to-End Python ML Pipelines: จาก Scikit-Learn สู่ MLflow',
    titleEn: 'End-to-End Python ML Pipelines: Scikit-Learn to MLflow',
    tagline: 'สร้าง Machine Learning Pipelines มาตรฐานวิศวกรรม: Feature Engineering, Cross-Validation, Tuning และ Model Tracking',
    description: 'เรียนรู้กระบวนการสร้าง Machine Learning ในระดับ Production เจาะลึกการทำ Exploratory Data Analysis (EDA), การสร้าง Scikit-Learn Pipelines และ Custom Transformers, การจัดการ Class Imbalance ด้วย SMOTE, การปรับจูน Hyperparameter ด้วย Optuna & Bayesian Optimization, การทำ Experiment Tracking และ Model Registry ด้วย MLflow, และการ Export โมเดลไปรันด้วย ONNX Runtime',
    categoryId: 'ai-ml',
    difficulty: 'Intermediate',
    estimatedHours: 16,
    instructor: {
      name: 'ดร. กฤษฎา ภัทรเดช (Dr. Kritsada P.)',
      role: 'Head of Machine Learning Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'ที่ปรึกษาด้าน AI Strategy และผู้ออกแบบ ML Platform ให้กับบริษัทระดับภูมิภาคเอเชียตะวันออกเฉียงใต้',
    },
    rating: 4.95,
    reviewsCount: 340,
    enrolledStudents: 2480,
    tags: ['Scikit-Learn', 'Machine-Learning', 'MLOps', 'MLflow', 'Feature-Engineering', 'Python', 'AI-ML'],
    prerequisites: ['Python พื้นฐาน', 'ความเข้าใจพื้นฐานคณิตศาสตร์และสถิติ (Mean, Variance, Probability)'],
    learningOutcomes: [
      'สร้าง Scikit-Learn Pipeline ป้องกัน Data Leakage ระหว่าง Train/Test Split',
      'ออกแบบ Custom Transformers สำหรับ Feature Engineering ขั้นสูง',
      'ประเมินโมเดลอย่างรอบด้าน (Precision, Recall, F1-Score, ROC-AUC, PR-Curve)',
      'บันทึก Parameters, Metrics, และ Model Artifacts ด้วย MLflow Tracking',
      'Deploy และรันโมเดล Inference ความเร็วสูงด้วย ONNX Runtime',
    ],
    badgeIcon: '📈',
    accentColor: '#F7931E',
    featured: false,
    modules: [
      {
        id: 'mod-ml-1',
        title: 'โมดูล 1: Production Scikit-Learn Pipelines',
        description: 'การร้อยเรียงขั้นตอน Data Preprocessing และ Model Training ให้เป็น Pipeline เดียวกัน',
        lessons: [
          {
            id: 'sklearn-pipeline-column-transformer',
            title: '1.1 ColumnTransformer, Preprocessing Pipelines และการป้องกัน Data Leakage',
            titleEn: 'ColumnTransformer, Pipelines and Preventing Data Leakage',
            description: 'แยกการจัดการ Numeric features (Scaling/Imputation) และ Categorical features (One-Hot Encoding) อย่างเป็นระบบ',
            durationMinutes: 45,
            type: 'interactive_code',
            contentMarkdown: `### สถาปัตยกรรม Scikit-Learn Pipeline & ColumnTransformer

การใช้ Pipeline ช่วยป้องกัน **Data Leakage** ได้ 100% เนื่องจากสถิติของ Transformer (เช่น ค่าเฉลี่ยของ StandardScaler) จะถูกคำนวณจากชุด Train เท่านั้นในระหว่าง Cross-Validation

\`\`\`python
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# 1. กำหนดฟิลด์แต่ละประเภท
numeric_features = ["age", "annual_income", "credit_score", "tenure_months"]
categorical_features = ["education_level", "employment_type", "housing_status"]

# 2. สร้าง Sub-pipelines สำหรับแต่ละประเภทข้อมูล
numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")), # แทนค่าว่างด้วยมัธยฐาน
    ("scaler", StandardScaler())                  # ปรับสเกลข้อมูลให้ mean=0, std=1
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
    ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

# 3. รวมเข้าเป็น ColumnTransformer
preprocessor = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# 4. สร้าง Full End-to-End Pipeline พร้อม Classifier
clf_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42))
])

# ฝึกโมเดลและประเมินผล
# clf_pipeline.fit(X_train, y_train)
# y_pred = clf_pipeline.predict(X_test)
\`\`\``,
            quiz: [
              {
                id: 'q-sklearn-leakage',
                question: 'ทำไมการทำ `fit_transform` ด้วย StandardScaler บน Dataset ทั้งหมดก่อนการทำ `train_test_split` จึงทำให้เกิดปัญหา Data Leakage?',
                options: [
                  'เพราะจะทำให้ข้อมูลในตารางสูญหาย',
                  'เพราะโมเดลจะได้รับข้อมูลสถิติ (Mean & Std) ของ Test Set ล่วงหน้า ซึ่งเป็นการโกงในการวัดผลจริง',
                  'เพราะ StandardScaler ไม่รองรับ Array ของ Pandas',
                  'เพราะจะทำให้ RAM เต็ม',
                ],
                correctAnswer: 1,
                explanation: 'การ fit scaler บนทั้ง dataset จะทำให้ข้อมูลภาพรวมของ Test set (ซึ่งในสถานการณ์จริงยังไม่เกิดขึ้น) รั่วไหลเข้าไปใน Train set ทำให้ผลการวัดความแม่นยำสูงเกินจริง (Data Leakage)',
              },
            ],
          },
        ],
      },
    ],
  },
];
