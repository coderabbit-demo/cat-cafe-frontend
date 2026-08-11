# Cat Cafe Frontend

A Deno Fresh customer experience for browsing availability, choosing a
complimentary herbal tea, registering, and managing reservations.

```bash
cp .env.example .env
PORT=8443 deno task start
```

The backend is expected at `CAT_CAFE_API_URL` (default `http://localhost:8444`).
To smoke-test the port contract, start the backend with
`uv run uvicorn app.main:app --port 8444`, then run
`curl --fail 'http://localhost:8444/api/v1/availability?date=2026-08-11'` and
verify it returns availability JSON.

## Background: CodeRabbit demo use case

This repo models the smallest possible microservice architecture: one frontend service (this repository) and one [backend](https://github.com/coderabbit-demo/cat-cafe-backend). Together they can be used to demonstrate both [automatic](https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis#automatic-repository-linking) and [manual](https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis#setting-it-up) repository linking.

PRs are scoped to a single repository, but shipping a feature or fix often requires carefully coordinated changes across several. Multi-repo analysis gives CodeRabbit visibility across that boundary, which organizations use to improve review comprehension, release velocity, and efficiency.
