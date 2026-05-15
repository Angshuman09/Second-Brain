

CREATE TABLE basics.app_events(
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
event_name TEXT NOT NULL,

metadata JSONB DEFAULT '{}'::jsonb,

created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.app_events (event_name, metadata)

VALUES 

('sign_up',
  '{"token" : "userId"}'
),

('sign_in',
'{"token":"userid"}'
);

SELECT * FROM basics.app_events;


SELECT 
    event_name,
    metadata ->> 'browser' AS browser
FROM basics.app_events
WHERE metadata ? 'browser';
