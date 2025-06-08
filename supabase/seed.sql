-- Seed file for FlashcardAI demo data
-- This creates default flashcards for any existing demo user

-- Note: The demo user (demo@example.com) should be created manually or through the app
-- This seed file only adds default flashcards for testing purposes

-- Check if a user with demo@example.com exists and create flashcards for them
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Try to find existing demo user
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
        RAISE NOTICE 'Demo user (demo@example.com) not found. Default flashcards will be created when user signs up.';
    END IF;
END $$;