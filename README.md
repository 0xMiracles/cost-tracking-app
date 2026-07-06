# Учёт расходов / Expense Tracker

Личное приложение для учёта расходов: быстрое добавление трат, свои категории, статистика за месяц, анализ по месяцам и защита кодом доступа. Полностью бесплатный стек: [Next.js](https://nextjs.org) + [Neon](https://neon.tech) (Postgres) + [Vercel](https://vercel.com).

A personal expense tracking app: quick expense entry, custom categories, monthly stats, per-month analysis, and PIN-code protection. Fully free stack: [Next.js](https://nextjs.org) + [Neon](https://neon.tech) (Postgres) + [Vercel](https://vercel.com).

---

## 🇷🇺 Как создать себе такой же сайт (инструкция от А до Я)

Ваши данные будут храниться в **вашей собственной базе**, а вход защищён **вашим собственным кодом** — этот репозиторий не даёт никому доступа к чужим данным.

### Способ 1: через v0 (проще всего, ничего настраивать руками не нужно)

1. Зайдите на [v0.app](https://v0.app) и создайте бесплатный аккаунт.
2. Напишите в чат: **«Сделай мне такой же сайт, как в этом репозитории: https://github.com/0xMiracles/cost-tracking-app»** (или прикрепите ссылку на свой форк).
3. v0 сам изучит код, предложит подключить бесплатную базу Neon — согласитесь.
4. Попросите v0: **«Создай таблицы из файла scripts/setup.sql»** — он выполнит скрипт сам.
5. Нажмите **Publish** (или Create PR, если подключите GitHub) — сайт опубликуется на бесплатной постоянной ссылке `*.vercel.app`.
6. Откройте сайт — при первом заходе придумайте свой код доступа. Готово!

### Способ 2: вручную через GitHub + Vercel (без ИИ)

1. **Форкните репозиторий**: нажмите кнопку **Fork** вверху этой страницы на GitHub.
2. **Создайте аккаунт на [vercel.com](https://vercel.com)** (бесплатно, можно войти через GitHub).
3. В Vercel нажмите **Add New → Project** и выберите ваш форк — Vercel сам определит Next.js.
4. **Подключите базу данных**: в проекте Vercel откройте вкладку **Storage → Create Database → Neon** (бесплатный тариф). Переменная окружения `DATABASE_URL` добавится автоматически.
5. **Создайте таблицы**: в панели Neon (открывается из вкладки Storage) найдите **SQL Editor**, вставьте содержимое файла [`scripts/setup.sql`](scripts/setup.sql) и выполните его.
6. Нажмите **Deploy** (или Redeploy, если проект уже задеплоился до подключения базы).
7. Откройте ваш сайт по ссылке `ваш-проект.vercel.app` — при первом заходе придумайте свой код доступа.

### Способ 3: через другие ИИ-инструменты

Любой современный ИИ-инструмент для программирования справится с этой задачей — код открыт и стандартен:

- **ИИ-конструкторы сайтов** (v0, Lovable, Bolt, Replit): скиньте ссылку на репозиторий и попросите воссоздать проект — они умеют и код писать, и базу подключать, и деплоить.
- **ИИ-агенты в редакторе** (Cursor, Claude Code, GitHub Copilot): склонируйте форк на компьютер, откройте в редакторе и попросите ИИ помочь с настройкой — он выполнит шаги из Способа 2 вместе с вами.
- **Обычные чат-ИИ** (ChatGPT, Claude, Gemini): скиньте ссылку и просите пошаговую помощь — они всё объяснят, но кнопки в Vercel и GitHub нажимать придётся вам.

Во всех случаях суть одна: форк репозитория → база Neon → выполнить `scripts/setup.sql` → деплой на Vercel.

### Частые вопросы

- **Это точно бесплатно?** Да: Vercel (тариф Hobby), Neon (Free) и GitHub бесплатны для личных проектов. Сайт работает 24/7.
- **Мой код доступа виден в репозитории?** Нет. В коде есть только механизм проверки; сам код хранится в вашей базе в зашифрованном виде (хеш + соль).
- **Как пользоваться с телефона?** Откройте сайт в браузере и добавьте на главный экран («Поделиться → На экран "Домой"» на iPhone, «Добавить на главный экран» на Android) — будет как обычное приложение.

---

## 🇬🇧 How to create your own copy (step-by-step guide)

Your data lives in **your own database**, protected by **your own PIN code** — this repository gives no one access to anyone else's data.

### Option 1: via v0 (easiest, no manual setup)

1. Go to [v0.app](https://v0.app) and create a free account.
2. Type in the chat: **"Build me the same app as this repository: https://github.com/0xMiracles/cost-tracking-app"** (or link your own fork).
3. v0 will study the code and offer to connect a free Neon database — accept it.
4. Ask v0: **"Create the tables from scripts/setup.sql"** — it will run the script for you.
5. Click **Publish** (or Create PR if you connect GitHub) — the site deploys to a free permanent `*.vercel.app` URL.
6. Open the site — on first visit you'll set your own access code. Done!

### Option 2: manually via GitHub + Vercel (no AI)

1. **Fork this repository**: click the **Fork** button at the top of this page on GitHub.
2. **Create an account at [vercel.com](https://vercel.com)** (free, you can sign in with GitHub).
3. In Vercel click **Add New → Project** and pick your fork — Vercel auto-detects Next.js.
4. **Connect a database**: in your Vercel project open **Storage → Create Database → Neon** (free tier). The `DATABASE_URL` environment variable is added automatically.
5. **Create the tables**: in the Neon console (opens from the Storage tab) find the **SQL Editor**, paste the contents of [`scripts/setup.sql`](scripts/setup.sql) and run it.
6. Click **Deploy** (or Redeploy if the project deployed before the database was connected).
7. Open your site at `your-project.vercel.app` — on first visit you'll set your own access code.

### Option 3: via other AI tools

Any modern AI coding tool can handle this — the code is open and standard:

- **AI app builders** (v0, Lovable, Bolt, Replit): share the repository link and ask them to recreate the project — they can write code, connect a database, and deploy.
- **AI agents in your editor** (Cursor, Claude Code, GitHub Copilot): clone your fork locally, open it in your editor, and ask the AI to walk through Option 2 with you.
- **Regular chat AIs** (ChatGPT, Claude, Gemini): share the link and ask for step-by-step help — they'll explain everything, but you'll click the buttons in Vercel and GitHub yourself.

In every case the recipe is the same: fork the repo → Neon database → run `scripts/setup.sql` → deploy on Vercel.

### FAQ

- **Is it really free?** Yes: Vercel (Hobby plan), Neon (Free plan), and GitHub are free for personal projects. The site runs 24/7.
- **Is my access code visible in the repository?** No. The code only contains the verification mechanism; your PIN is stored in your database as a salted hash.
- **How do I use it on a phone?** Open the site in your browser and add it to your home screen ("Share → Add to Home Screen" on iPhone, "Add to Home screen" on Android) — it works like a native app.

---

## Local development / Локальная разработка

```bash
pnpm install
# add DATABASE_URL to .env.development.local, then:
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built with v0

This repository is linked to a [v0](https://v0.app) project. Start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` automatically deploys.

[Continue working on v0 →](https://v0.app/chat/projects/prj_0Nqev5UcnbJumcqalDpP4Rp36mTc)
