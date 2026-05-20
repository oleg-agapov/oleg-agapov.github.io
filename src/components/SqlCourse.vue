<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as duckdb from '@duckdb/duckdb-wasm';
// @ts-ignore – ?url imports typed by Vite client types
import duckdb_wasm_mvp from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
// @ts-ignore
import mvp_worker_url from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
// @ts-ignore
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
// @ts-ignore
import eh_worker_url from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

interface Lesson {
  id: string;
  title: string;
  description: string;
  concepts: { title: string; body: string }[];
  exercise?: {
    prompt: string;
    placeholder?: string;
    hint?: string;
    validate: (result: QueryResult) => boolean;
  };
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

const db = ref<duckdb.AsyncDuckDB | null>(null);
const conn = ref<duckdb.AsyncDuckDBConnection | null>(null);
const dbReady = ref(false);
const sidebarOpen = ref(false);
const currentLessonId = ref<string>('');
const query = ref('');
const queryResult = ref<QueryResult | null>(null);
const queryError = ref<string | null>(null);
const running = ref(false);
const showHint = ref(false);
const exercisePassed = ref(false);
const progress = ref<Record<string, { completed: boolean; completedAt: string }>>({});

const modules: Module[] = [
  {
    id: 'basics',
    title: 'Module 1 — The Basics',
    lessons: [
      {
        id: 'select-101',
        title: 'Your First SELECT',
        description: 'Learn to retrieve data from a table using the most fundamental SQL statement.',
        concepts: [
          {
            title: 'What is SELECT?',
            body: '<code>SELECT</code> is how you ask a database for data. Every SQL query starts here. The simplest form retrieves everything from a table:<br><br><code>SELECT * FROM table_name;</code><br><br>The <code>*</code> means "all columns." You\'ll learn to be more specific soon.',
          },
          {
            title: 'The employees table',
            body: 'For this course, we\'ve loaded a small company dataset. The <code>employees</code> table has columns:<ul><li><code>id</code> — unique identifier</li><li><code>name</code> — full name</li><li><code>department</code> — which team they\'re on</li><li><code>salary</code> — annual salary</li><li><code>hire_date</code> — when they joined</li></ul>',
          },
        ],
        exercise: {
          prompt: 'Write a query to select all columns from the employees table.',
          placeholder: 'SELECT ...',
          hint: 'Use SELECT * FROM followed by the table name.',
          validate: (result) => result.columns.length === 5 && result.rows.length === 8,
        },
      },
    ],
  },
];

const allLessons = computed(() => modules.flatMap((m) => m.lessons));
const totalLessons = computed(() => allLessons.value.length);
const completedCount = computed(
  () => Object.values(progress.value).filter((p) => p.completed).length,
);
const progressPct = computed(() =>
  totalLessons.value ? Math.round((completedCount.value / totalLessons.value) * 100) : 0,
);
const currentLesson = computed(
  () => allLessons.value.find((l) => l.id === currentLessonId.value) ?? allLessons.value[0],
);
const currentModuleTitle = computed(() => {
  for (const m of modules) {
    if (m.lessons.some((l) => l.id === currentLessonId.value)) return m.title;
  }
  return modules[0]?.title ?? '';
});
const currentIndex = computed(() =>
  allLessons.value.findIndex((l) => l.id === currentLessonId.value),
);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < allLessons.value.length - 1);

async function initDuckDB() {
  const bundle = await duckdb.selectBundle({
    mvp: { mainModule: duckdb_wasm_mvp as string, mainWorker: mvp_worker_url as string },
    eh: { mainModule: duckdb_wasm_eh as string, mainWorker: eh_worker_url as string },
  });
  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.ConsoleLogger();
  db.value = new duckdb.AsyncDuckDB(logger, worker);
  await db.value.instantiate(bundle.mainModule, bundle.pthreadWorker);
  conn.value = await db.value.connect();

  await conn.value.query(`
    CREATE TABLE employees (
      id INTEGER,
      name VARCHAR,
      department VARCHAR,
      salary INTEGER,
      hire_date DATE
    );
    INSERT INTO employees VALUES
      (1, 'Alice Chen',    'Engineering', 95000, '2021-03-15'),
      (2, 'Bob Martinez',  'Engineering', 88000, '2022-01-10'),
      (3, 'Carol White',   'Engineering', 92000, '2020-07-22'),
      (4, 'David Kim',     'Marketing',   72000, '2021-09-01'),
      (5, 'Eva Johnson',   'Marketing',   68000, '2023-02-14'),
      (6, 'Frank Lee',     'Sales',       78000, '2019-11-30'),
      (7, 'Grace Park',    'Sales',       82000, '2020-05-18'),
      (8, 'Henry Liu',     'Sales',       75000, '2022-08-05');
  `);

  dbReady.value = true;
}

async function runQuery() {
  if (running.value || !query.value.trim() || !conn.value) return;
  running.value = true;
  queryResult.value = null;
  queryError.value = null;
  exercisePassed.value = false;

  try {
    const arrowResult = await conn.value.query(query.value);
    const columns = arrowResult.schema.fields.map((f) => f.name);
    const rows = arrowResult.toArray().map((row) => {
      const obj: Record<string, unknown> = {};
      for (const field of arrowResult.schema.fields) {
        let val = row[field.name];
        if (typeof val === 'bigint') val = Number(val);
        obj[field.name] = val;
      }
      return obj;
    });
    queryResult.value = { columns, rows };

    const validator = currentLesson.value?.exercise?.validate;
    if (validator && validator(queryResult.value)) {
      exercisePassed.value = true;
      markCompleted(currentLessonId.value);
    }
  } catch (e) {
    queryError.value = e instanceof Error ? e.message : String(e);
  } finally {
    running.value = false;
  }
}

function goToLesson(id: string) {
  currentLessonId.value = id;
  query.value = '';
  queryResult.value = null;
  queryError.value = null;
  showHint.value = false;
  exercisePassed.value = false;
}

function prevLesson() {
  if (hasPrev.value) goToLesson(allLessons.value[currentIndex.value - 1].id);
}

function nextLesson() {
  if (hasNext.value) goToLesson(allLessons.value[currentIndex.value + 1].id);
}

function isCompleted(id: string) {
  return !!progress.value[id]?.completed;
}

function markCompleted(id: string) {
  progress.value[id] = { completed: true, completedAt: new Date().toISOString() };
  try {
    localStorage.setItem('sql-course-progress', JSON.stringify(progress.value));
  } catch {}
}

function loadProgress() {
  try {
    const saved = localStorage.getItem('sql-course-progress');
    if (saved) progress.value = JSON.parse(saved);
  } catch {
    progress.value = {};
  }
}

onMounted(async () => {
  loadProgress();
  currentLessonId.value = allLessons.value[0]?.id ?? '';
  await initDuckDB();
});
</script>

<template>
  <!-- Loading -->
  <div v-if="!dbReady" class="flex flex-col items-center justify-center h-screen gap-4">
    <div class="w-7 h-7 rounded-full border-2 border-cream-border border-t-terra animate-spin"></div>
    <div class="font-mono text-xs text-stone-400">Initializing DuckDB…</div>
  </div>

  <!-- App -->
  <div v-else class="grid min-h-screen md:grid-cols-[280px_1fr]">

    <!-- Mobile toggle -->
    <button
      class="fixed top-4 left-4 z-[99] w-9 h-9 bg-cream-card border border-cream-border rounded-md flex items-center justify-center cursor-pointer text-stone-700 text-base md:hidden"
      @click="sidebarOpen = !sidebarOpen"
    >☰</button>

    <!-- Sidebar -->
    <aside
      class="h-screen overflow-y-auto flex flex-col bg-cream-card border-r border-cream-border md:sticky md:top-0 max-md:fixed max-md:top-0 max-md:z-[100] max-md:w-[280px] max-md:[transition:left_0.25s]"
      :class="sidebarOpen ? 'max-md:left-0' : 'max-md:-left-[300px]'"
    >
      <div class="flex-1 overflow-y-auto">

        <!-- Back link -->
        <div class="pt-5 px-6">
          <a
            href="/courses"
            class="font-mono text-[11px] text-stone-400 no-underline tracking-wide hover:text-terra transition-colors block mb-5"
          >← Courses</a>
        </div>

        <!-- Brand -->
        <div class="px-6 pb-6 border-b border-cream-border mb-5">
          <span class="font-mono text-[10px] text-stone-400 uppercase tracking-[0.1em] block mb-1">Interactive Course</span>
          <h1 class="font-display text-[20px] font-normal tracking-tight text-stone-900">SQL Fundamentals</h1>
        </div>

        <!-- Modules -->
        <div v-for="mod in modules" :key="mod.id" class="mb-2">
          <div class="font-mono text-[10px] uppercase tracking-[0.12em] text-stone-400 px-6 py-2">{{ mod.title }}</div>
          <a
            v-for="lesson in mod.lessons"
            :key="lesson.id"
            class="relative flex items-center gap-2.5 px-6 py-[9px] cursor-pointer text-[13.5px] transition-colors no-underline"
            :class="currentLesson?.id === lesson.id
              ? 'bg-terra/10 text-terra'
              : 'text-stone-600 hover:bg-black/[0.04] hover:text-stone-800'"
            @click="goToLesson(lesson.id); sidebarOpen = false"
          >
            <div
              v-if="currentLesson?.id === lesson.id"
              class="absolute left-0 inset-y-1 w-[3px] bg-terra rounded-r"
            ></div>
            <span
              class="w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 text-[10px] transition-all"
              :class="isCompleted(lesson.id)
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-cream-border'"
            >
              <span v-if="isCompleted(lesson.id)">✓</span>
            </span>
            <span>{{ lesson.title }}</span>
          </a>
        </div>
      </div>

      <!-- Progress -->
      <div class="px-6 py-4 border-t border-cream-border">
        <div class="font-mono text-[10px] uppercase tracking-[0.1em] text-stone-400 mb-2">
          Progress — {{ completedCount }} / {{ totalLessons }}
        </div>
        <div class="h-1 bg-cream-border rounded-full overflow-hidden">
          <div
            class="h-full bg-emerald-600 rounded-full transition-[width] duration-[400ms]"
            :style="{ width: progressPct + '%' }"
          ></div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main v-if="currentLesson" class="py-12 px-14 max-w-3xl max-md:py-8 max-md:px-5">

      <!-- Lesson header -->
      <div class="mb-9">
        <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-terra mb-2">{{ currentModuleTitle }}</div>
        <h2 class="font-display text-[32px] font-normal tracking-tight mb-3">{{ currentLesson.title }}</h2>
        <p class="text-stone-600 text-[15px] max-w-[600px]">{{ currentLesson.description }}</p>
      </div>

      <!-- Concept blocks -->
      <div
        v-for="block in currentLesson.concepts"
        :key="block.title"
        class="bg-cream-card border border-cream-border rounded-lg px-7 py-6 mb-6"
      >
        <h3 class="text-[15px] font-semibold mb-2.5 text-stone-900">{{ block.title }}</h3>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="concept-body text-sm text-stone-600 leading-[1.7]" v-html="block.body"></div>
      </div>

      <!-- Editor -->
      <div v-if="currentLesson.exercise" class="mt-8">
        <div class="font-mono text-[11px] uppercase tracking-[0.1em] text-stone-400 mb-3">Exercise</div>
        <p class="text-sm text-stone-600 mb-3.5">{{ currentLesson.exercise.prompt }}</p>

        <div class="border border-cream-border rounded-lg overflow-hidden bg-cream-editor transition-colors focus-within:border-terra">
          <div class="flex items-center justify-between px-3 py-2 border-b border-cream-border bg-black/[0.03]">
            <span class="font-mono text-[11px] text-stone-400">sql</span>
            <div class="flex gap-2">
              <button
                v-if="currentLesson.exercise.hint"
                class="px-3.5 py-1.5 bg-transparent text-stone-600 border border-cream-border rounded-md font-mono text-xs cursor-pointer hover:border-stone-400 hover:text-stone-800 transition-all"
                @click="showHint = !showHint"
              >hint</button>
              <button
                class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-terra text-white border-none rounded-md font-mono text-xs cursor-pointer hover:opacity-85 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                :disabled="running"
                @click="runQuery()"
              >{{ running ? 'Running…' : '▶ Run' }}</button>
            </div>
          </div>
          <textarea
            v-model="query"
            class="w-full min-h-[120px] p-4 px-5 bg-transparent border-none text-stone-900 font-mono text-[13.5px] leading-relaxed resize-y outline-none [tab-size:2] placeholder:text-stone-400"
            :placeholder="currentLesson.exercise.placeholder ?? 'Write your SQL here…'"
            spellcheck="false"
            @keydown.meta.enter="runQuery()"
            @keydown.ctrl.enter="runQuery()"
          ></textarea>
        </div>

        <!-- Hint -->
        <div
          v-if="showHint"
          class="mt-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-lg text-[13.5px] text-amber-700 font-mono"
        >{{ currentLesson.exercise.hint }}</div>

        <!-- Error -->
        <div v-if="queryError" class="mt-4 border border-cream-border rounded-lg overflow-hidden">
          <div class="px-5 py-3.5 text-red-700 font-mono text-[12.5px] bg-red-50">{{ queryError }}</div>
        </div>

        <!-- Results table -->
        <div v-if="queryResult && queryResult.columns.length > 0" class="mt-4 border border-cream-border rounded-lg overflow-hidden">
          <div class="flex items-center gap-2 px-4 py-2.5 bg-cream-card border-b border-cream-border font-mono text-[11px] text-stone-400 uppercase tracking-[0.08em]">
            <div class="w-[7px] h-[7px] rounded-full bg-emerald-600"></div>
            <span>{{ queryResult.rows.length }} rows</span>
          </div>
          <div class="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table class="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th
                    v-for="col in queryResult.columns"
                    :key="col"
                    class="text-left px-4 py-2 font-mono text-[11px] font-medium text-stone-400 uppercase tracking-[0.06em] bg-cream-card border-b border-cream-border sticky top-0"
                  >{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in queryResult.rows"
                  :key="i"
                  class="group"
                >
                  <td
                    v-for="col in queryResult.columns"
                    :key="col"
                    class="px-4 py-[7px] border-b border-black/[0.04] text-stone-600 font-mono text-[12.5px] group-hover:bg-black/[0.02]"
                  >{{ row[col] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Success -->
        <div v-if="exercisePassed" class="mt-3 border border-cream-border rounded-lg overflow-hidden">
          <div class="px-5 py-3.5 flex items-center gap-2 text-emerald-700 font-mono text-[12.5px] bg-emerald-50">
            ✓ Correct — nice work! Lesson marked as complete.
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex justify-between mt-10 pt-6 border-t border-cream-border">
        <button
          class="px-5 py-2.5 bg-cream-card text-stone-600 border border-cream-border rounded-md font-mono text-xs cursor-pointer hover:border-terra hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          :disabled="!hasPrev"
          @click="prevLesson()"
        >← Previous</button>
        <button
          class="px-5 py-2.5 bg-cream-card text-stone-600 border border-cream-border rounded-md font-mono text-xs cursor-pointer hover:border-terra hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          :disabled="!hasNext"
          @click="nextLesson()"
        >Next →</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
/*
  Only CSS that can't be expressed with Tailwind: reaching into v-html content.
  Tailwind classes on the parent don't cascade into v-html injected markup.
*/
.concept-body :deep(ul) { list-style: none; margin-top: 0.5rem; }
.concept-body :deep(li) { display: flex; align-items: baseline; }
.concept-body :deep(li::before) { content: '→'; color: #D9542B; margin-right: 0.5rem; flex-shrink: 0; }
.concept-body :deep(code) {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  background: rgba(0, 0, 0, 0.06);
  padding: 1px 6px;
  border-radius: 4px;
  color: #D9542B;
}
</style>
