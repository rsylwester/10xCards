-- Seed file for FlashcardAI demo data
-- This creates a demo user and default flashcards

-- Create demo user if it doesn't exist
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to find existing demo user
    SELECT id INTO demo_user_id 
    FROM auth.users 
    WHERE email = 'demo@example.com' 
    LIMIT 1;
    
    -- If demo user doesn't exist, create it
    IF demo_user_id IS NULL THEN
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            recovery_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'demo@example.com',
            crypt('demopass', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            now(),
            now(),
            '',
            '',
            '',
            ''
        ) RETURNING id INTO demo_user_id;
        
        RAISE NOTICE 'Created demo user with email: demo@example.com';
    ELSE
        RAISE NOTICE 'Demo user already exists';
    END IF;
    
    -- Get the demo user ID again (in case it was just created)
    SELECT id INTO demo_user_id 
    FROM auth.users 
    WHERE email = 'demo@example.com' 
    LIMIT 1;
    
    -- If demo user exists, create default flashcards
    IF demo_user_id IS NOT NULL THEN
        -- Delete existing default flashcards for this user to avoid duplicates
        DELETE FROM public.flashcards 
        WHERE user_id = demo_user_id AND source = 'default';
        
        -- Insert default flashcards
        INSERT INTO public.flashcards (user_id, front, back, source) VALUES
            (demo_user_id, 'Sophisticated', 'Wyrafinowany, skomplikowany', 'default'),
            (demo_user_id, 'Prevalent', 'Powszechny, rozpowszechniony', 'default'),
            (demo_user_id, 'Comprehensive', 'Kompleksowy, wyczerpujący', 'default'),
            (demo_user_id, 'Substantial', 'Znaczny, istotny', 'default'),
            (demo_user_id, 'Elaborate', 'Rozbudowany, szczegółowy', 'default'),
            (demo_user_id, 'Inevitable', 'Nieunikniony, nieuchronny', 'default'),
            (demo_user_id, 'Profound', 'Głęboki, dogłębny', 'default'),
            (demo_user_id, 'Resilient', 'Odporny, elastyczny', 'default'),
            (demo_user_id, 'Compelling', 'Przekonujący, porywający', 'default'),
            (demo_user_id, 'Versatile', 'Wszechstronny, uniwersalny', 'default'),
            (demo_user_id, 'Feasible', 'Wykonalny, możliwy do zrealizowania', 'default'),
            (demo_user_id, 'Coherent', 'Spójny, logiczny', 'default'),
            (demo_user_id, 'Pragmatic', 'Pragmatyczny, praktyczny', 'default'),
            (demo_user_id, 'Ambiguous', 'Niejednoznaczny, dwuznaczny', 'default'),
            (demo_user_id, 'Innovative', 'Innowacyjny, nowatorski', 'default'),
            (demo_user_id, 'Discrepancy', 'Rozbieżność, niezgodność', 'default'),
            (demo_user_id, 'Hierarchy', 'Hierarchia, porządek', 'default'),
            (demo_user_id, 'Paradigm', 'Paradygmat, wzorzec', 'default'),
            (demo_user_id, 'Nevertheless', 'Niemniej jednak, mimo to', 'default'),
            (demo_user_id, 'Furthermore', 'Ponadto, co więcej', 'default'),
            (demo_user_id, 'Subsequently', 'Następnie, w dalszej kolejności', 'default'),
            (demo_user_id, 'Consequently', 'W konsekwencji, w rezultacie', 'default'),
            (demo_user_id, 'Presumably', 'Prawdopodobnie, przypuszczalnie', 'default'),
            (demo_user_id, 'Predominantly', 'Przeważnie, głównie', 'default'),
            (demo_user_id, 'Approximately', 'Około, w przybliżeniu', 'default');
        
        RAISE NOTICE 'Created % default flashcards for demo user', 
            (SELECT COUNT(*) FROM public.flashcards WHERE user_id = demo_user_id AND source = 'default');
    ELSE
        RAISE NOTICE 'Failed to create or find demo user';
    END IF;
END $$;