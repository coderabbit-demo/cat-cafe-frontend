# Cat Cafe Frontend

A Deno Fresh customer experience for browsing availability, choosing a
complimentary herbal tea, registering, and managing reservations.

To begin:
```bash
cp .env.example .env
```
Then set the `GOOGLE_CLIENT_ID` within the `.env` and run:
```bash
PORT=8443 deno task --env-file=.env start
```
The backend is expected at `CAT_CAFE_API_URL` (default `http://localhost:8444`).

To smoke-test the port contract, start the backend with
`uv run uvicorn app.main:app --port 8444`, then run

```bash
FUTURE_DATE=$(deno eval 'const date = new Date(); date.setUTCDate(date.getUTCDate() + 1); console.log(date.toISOString().slice(0, 10))')
curl --fail "http://localhost:8444/api/v1/availability?date=${FUTURE_DATE}"
```

Verify it returns availability JSON.

## Manually test Google sessions

1. Start both FE and BE apps with the same `GOOGLE_CLIENT_ID`, open
   `http://localhost:8443`, and sign in with Google.
2. Confirm your email replaces the **Sign in** link in the header, then refresh
   the page and confirm the session remains displayed.
3. Select an available future date and time, complete the form, and choose
   **Book visit**. Confirm the success message appears.
4. Open **My reservations**, confirm the new reservation is listed, choose
   **Cancel**, and confirm it is removed.

## Background: CodeRabbit demo use case

This repo models the smallest possible microservice architecture: one frontend
service (this repository) and one
[backend](https://github.com/coderabbit-demo/cat-cafe-backend). Together they
can be used to demonstrate both
[automatic](https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis#automatic-repository-linking)
and
[manual](https://docs.coderabbit.ai/knowledge-base/multi-repo-analysis#setting-it-up)
repository linking.

PRs are scoped to a single repository, but shipping a feature or fix often
requires carefully coordinated changes across several. Multi-repo analysis gives
CodeRabbit visibility across that boundary, which organizations use to improve
review comprehension, release velocity, and efficiency.

### To do

- [x] Sign-in and authentication (so that reservations can work)
- [ ] Make reservations persistent across BE app restarts
