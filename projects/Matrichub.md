
I actually think this is a **pretty strong project idea**, especially for your profile. It combines backend engineering, distributed systems, developer experience (DX), and CLI development—all things that recruiters for backend roles tend to appreciate.

However, I wouldn't build **another Umami clone**. I'd build something that solves a problem Umami doesn't.

**The idea**

Imagine this:

```
npm install -g pulse-cli

pulse login

pulse watch my-app
```

Terminal:

```

 my-app

  

Visitors Today        14,291

Live Users               231

Requests/sec            142.8

Avg Latency             71ms

Errors                  0.12%

  

Top Pages

/home              ██████████ 39%

/pricing           ██████ 24%

/docs              ████ 17%

  

Countries

🇮🇳 India

🇺🇸 USA

🇯🇵 Japan

  
```

Press q to quit


Now imagine:

```
pulse logs
```

Shows live events.

```
pulse trace
```

Shows slow requests.

```
pulse tail
```

Shows recent user sessions.

Now it becomes much more than analytics.

  

**Why terminal?**

Developers spend 80% of their time here.

Instead of opening

```
Browser

↓

Dashboard

↓

Analytics
```

they simply do

```
pulse watch
```

That's a surprisingly pleasant workflow.


**Things I'd add**

**Live mode**

Like

htop

or

docker stats

Refreshing every second.

  

**Graphs in terminal**

Visitors

  

200 ┤

180 ┤     ╭──╮

160 ┤    ╭╯  ╰╮

140 ┤ ╭──╯    ╰──

120 ┼────────────────

Libraries exist for this.

  

**Top endpoints**

GET /login

  

23k req

  

Avg

48ms

  

P99

201ms

  

**Errors**

500

  

/database

  

12

  

Last seen

  

3 sec ago

  

**Deploy comparison**

Current Deploy

  

+13% traffic

  

-22% latency

  

+3% conversions

  

**Session replay (later)**

Open browser only if user wants.

  

**Alerts**

Latency > 500ms

  

Terminal

  

🔴 Alert

  

API latency spiked

  

**Architecture**

I'd build it like this.

SDK

     │

     ▼

  

Collector API

  

     │

  

Kafka / NATS

  

     │

  

Workers

  

     │

  

ClickHouse

  

     │

  

REST + WebSocket

  

     │

 ┌─────────────┐

 │ Web Dashboard│

 └─────────────┘

  

 ┌─────────────┐

 │ CLI         │

 └─────────────┘

CLI and dashboard use exactly the same backend.

  

**Monorepo?**

I would definitely use one.

Something like

pulse/

  

apps/

    dashboard

    api

    collector

  

packages/

    sdk-js

    sdk-rust

    shared-types

  

cli/

    pulse

  

docker/

This is much easier than maintaining five repositories.

For TypeScript, Turborepo + pnpm workspaces is a great combination.

  

**Tech stack**

Since you like Rust, I'd lean into that.

**Backend**

Rust

- Axum
- Tokio
- SQLx

or

Actix

  

**Database**

ClickHouse

Perfect for analytics.

Stores billions of events efficiently.

  

**Cache**

Redis

  

**Queue**

NATS

or Kafka later.

For an MVP, you can even skip the queue.

  

**Dashboard**

Next.js

Tailwind

shadcn/ui

Recharts or Tremor.

  

**CLI**

Rust

Libraries:

ratatui

  

crossterm

  

clap

  

reqwest

  

tokio-tungstenite

The result feels like lazygit or btop.

  

**SDK**

JavaScript

track({

    event:"page_view"

})

Later

Rust

  

Go

  

Python

  

**Is it free?**

Yes, for development.

|   |   |
|---|---|
|**Component**|**Free?**|
|Rust|✅|
|Next.js|✅|
|PostgreSQL|✅|
|ClickHouse|✅|
|Redis|✅|
|Docker|✅|
|Turborepo|✅|
|GitHub|✅|

Hosting will eventually cost money.

For an MVP, you could deploy on a small VPS (2–4 GB RAM) and stay within a modest monthly budget.

  

**Timeline**

Given your experience (you've already built Kagaz and are building Kache), I'd estimate:

**Week 1**

- Auth
- Dashboard
- Event ingestion

  

**Week 2**

- Charts
- Realtime WebSocket
- CLI MVP

  

**Week 3**

- SDK
- Projects
- API keys

  

**Week 4**

- Polish
- Docker
- Documentation
- Landing page

So about **4 weeks** for a polished MVP if you're working on it consistently alongside your studies.

  

**One thing I'd change**

Instead of marketing it as:

"Another Umami"

I'd position it as:

**Developer-first analytics that live in your terminal.**

That's a much stronger differentiator.

Think of it as a mix of:

- Umami (analytics)
- htop (live terminal dashboard)
- docker stats (real-time metrics)
- lazygit (great terminal UX)

That gives the project a clear identity.

**Would it help you get backend jobs?**

I think so—especially if you build it with a focus on systems rather than just UI. Recruiters and senior engineers would see experience with:

- High-throughput event ingestion
- WebSockets and real-time streaming
- Time-series/analytics databases like ClickHouse
- CLI application development in Rust
- API design and SDKs
- Scalable backend architecture

Those are all skills that map well to backend and infrastructure roles.

One suggestion, though: keep the **terminal interface as the flagship feature**, not just an add-on. There are already many analytics dashboards, but very few tools that make monitoring from the terminal feel first-class. That's the aspect people are most likely to remember and share.