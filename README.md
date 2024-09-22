## NextJS 14 Server Actions and Supabase

Based on Server Actions, I implemented optimistic updates using useOptimistic for adding, deleting, and editing todos via drag-and-drop. This ensures that the UI reflects the result immediately without waiting for the database update. If the data change is not applied due to validation or other reasons, the UI reverts to its original state.

### Getting Started

### setting .env.development.local

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

#### Supabase Table

Since the data is simple this time, I applied basic SQL without using Prisma or similar tools.

```sql
CREATE TABLE todos (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  priority INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create their own todos" ON todos FOR
    INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view only their own todos" ON todos FOR
    SELECT USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own todos" ON todos FOR
    UPDATE USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own todos" ON todos FOR
    DELETE USING ((SELECT auth.uid()) = user_id);

```

#### Supabase Database Functions

I created Functions this time to support transaction processing.

```sql
CREATE OR REPLACE FUNCTION update_todos_priorities(todo_updates JSONB)
RETURNS VOID AS $$
DECLARE
    todo_update JSONB;
BEGIN
    FOR todo_update IN SELECT * FROM jsonb_array_elements(todo_updates)
    LOOP
        UPDATE todos
        SET priority = (todo_update->>'priority')::INTEGER,
            updated_at = (todo_update->>'updated_at')::TIMESTAMPTZ
        WHERE id = (todo_update->>'id')::BIGINT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

#### Supabase SMTP Settings

https://supabase.com/docs/guides/auth/auth-smtp

#### Authentication Email Templates Confirm Signup

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p>
  <a href="{{ .SiteURL }}/verify_email/{{ .TokenHash }}">Confirm your mail</a>
</p>
```
