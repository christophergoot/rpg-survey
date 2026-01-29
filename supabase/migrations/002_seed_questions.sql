-- RPG Survey Application Database Schema
-- Migration 002: Seed Questions and Translations

-- ==============================================
-- INSERT SURVEY QUESTIONS
-- ==============================================

-- Question 1: Theme
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('theme', 'single_choice', 1, true, '{"options": ["scifi", "fantasy", "horror", "modern", "historical", "cyberpunk", "postapoc"]}'::jsonb);

-- Question 2: Setting Details
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('setting_details', 'text', 2, false, '{"maxLength": 500}'::jsonb);

-- Question 3: Activity Preferences (Multi-scale)
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('activity_preferences', 'multi_scale', 3, true, '{"scales": ["combat", "puzzles", "diplomacy", "exploration"], "min": 1, "max": 5}'::jsonb);

-- Question 4: Rules Complexity
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('rules_complexity', 'scale', 4, true, '{"min": 1, "max": 5}'::jsonb);

-- Question 5: Combat Style
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('combat_style', 'single_choice', 5, true, '{"options": ["narrative", "tactical", "hybrid"]}'::jsonb);

-- Question 6: Campaign Length
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('campaign_length', 'single_choice', 6, true, '{"options": ["oneshot", "short", "medium", "longterm"]}'::jsonb);

-- Question 7: Session Frequency
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('session_frequency', 'single_choice', 7, true, '{"options": ["weekly", "biweekly", "monthly", "flexible"]}'::jsonb);

-- Question 8: Experience Level
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('experience_level', 'scale', 8, true, '{"min": 1, "max": 5}'::jsonb);

-- Question 9: Character Creation
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('character_creation', 'single_choice', 9, true, '{"options": ["pregen", "collaborative", "full_control"]}'::jsonb);

-- Question 10: Tone Preferences
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('tone_preferences', 'multi_choice', 10, true, '{"options": ["serious", "lighthearted", "heroic", "gritty", "mysterious"]}'::jsonb);

-- Question 11: Content Boundaries
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('content_boundaries', 'multi_choice', 11, false, '{"options": ["gore", "horror", "romance", "political", "none"]}'::jsonb);

-- Question 12: Additional Comments
INSERT INTO survey_questions (question_key, question_type, order_index, is_required, config) VALUES
('additional_comments', 'text', 12, false, '{"maxLength": 1000}'::jsonb);

-- ==============================================
-- INSERT ENGLISH TRANSLATIONS
-- ==============================================

-- Theme (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('theme', 'en', 'What theme sounds most exciting for collaborative storytelling?', 'Choose the setting that captures your imagination', '{
  "scifi": {"label": "Science Fiction", "description": "Explore endless possibilities among the stars and beyond"},
  "fantasy": {"label": "Fantasy", "description": "Traditional magic and medieval settings"},
  "horror": {"label": "Horror", "description": "Dark and suspenseful supernatural encounters"},
  "modern": {"label": "Modern", "description": "Contemporary real-world settings"},
  "historical": {"label": "Historical", "description": "Authentic period settings from Earth''s past"},
  "cyberpunk": {"label": "Cyberpunk", "description": "High-tech dystopian futures with corporate intrigue"},
  "postapoc": {"label": "Post-Apocalyptic", "description": "Survival in the aftermath of civilization"}
}'::jsonb);

-- Setting Details (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('setting_details', 'en', 'Any specific settings or worlds you''d like to explore?', 'Share any particular universes, time periods, or settings that interest you', null);

-- Activity Preferences (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('activity_preferences', 'en', 'How much do you enjoy these activities in RPGs?', 'Rate from 1 (not interested) to 5 (very interested)', '{
  "combat": {"label": "Combat", "description": "Fighting enemies and tactical encounters"},
  "puzzles": {"label": "Puzzle-Solving", "description": "Riddles, mysteries, and brain teasers"},
  "diplomacy": {"label": "Diplomacy", "description": "Negotiation, persuasion, and social interaction"},
  "exploration": {"label": "Exploration", "description": "Discovering new places and uncovering secrets"}
}'::jsonb);

-- Rules Complexity (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('rules_complexity', 'en', 'How much mechanical detail enhances your experience?', '1 = Rules-light (story focus) | 5 = Complex rules (tactical depth)', '{
  "1": {"label": "Rules-Light", "description": "Focus on storytelling and character development"},
  "2": {"label": "Light-Moderate", "description": "Simple rules with some structure"},
  "3": {"label": "Moderate", "description": "Balanced rules and narrative focus"},
  "4": {"label": "Moderate-Crunchy", "description": "Detailed rules with tactical options"},
  "5": {"label": "Crunchy", "description": "Complex mechanics and tactical depth"}
}'::jsonb);

-- Combat Style (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('combat_style', 'en', 'What combat style do you prefer?', 'How should conflicts be resolved?', '{
  "narrative": {"label": "Narrative/Abstract", "description": "Story-driven combat without grids or exact positioning"},
  "tactical": {"label": "Tactical/Grid-Based", "description": "Precise positioning with maps and miniatures"},
  "hybrid": {"label": "Hybrid Approach", "description": "Mix of narrative and tactical elements as needed"}
}'::jsonb);

-- Campaign Length (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('campaign_length', 'en', 'What campaign length appeals to you?', 'How long of a commitment are you interested in?', '{
  "oneshot": {"label": "One-Shot", "description": "Single session adventure (3-5 hours)"},
  "short": {"label": "Short Arc", "description": "3-6 sessions with a complete story"},
  "medium": {"label": "Medium Campaign", "description": "7-15 sessions exploring a major storyline"},
  "longterm": {"label": "Long-Term", "description": "16+ sessions building an epic saga"}
}'::jsonb);

-- Session Frequency (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('session_frequency', 'en', 'How often would you like to play?', 'What schedule works best for you?', '{
  "weekly": {"label": "Weekly", "description": "Once per week"},
  "biweekly": {"label": "Bi-weekly", "description": "Every two weeks"},
  "monthly": {"label": "Monthly", "description": "Once per month"},
  "flexible": {"label": "Flexible", "description": "Variable schedule as availability permits"}
}'::jsonb);

-- Experience Level (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('experience_level', 'en', 'What''s your experience with tabletop RPGs?', '1 = Complete beginner | 5 = Veteran player', '{
  "1": {"label": "Beginner", "description": "Never played or very new to RPGs"},
  "2": {"label": "Novice", "description": "Played a few sessions"},
  "3": {"label": "Intermediate", "description": "Completed several campaigns"},
  "4": {"label": "Experienced", "description": "Years of regular play"},
  "5": {"label": "Veteran", "description": "Extensive experience across many systems"}
}'::jsonb);

-- Character Creation (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('character_creation', 'en', 'How do you prefer to create characters?', 'What level of control do you want in character creation?', '{
  "pregen": {"label": "Pre-Generated", "description": "Use ready-made characters to jump right in"},
  "collaborative": {"label": "Collaborative Creation", "description": "Work with the GM to develop your character"},
  "full_control": {"label": "Full Player Control", "description": "Complete freedom to design your character"}
}'::jsonb);

-- Tone Preferences (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('tone_preferences', 'en', 'What tones appeal to you? (Select all that apply)', 'Choose the moods and atmospheres you enjoy', '{
  "serious": {"label": "Serious/Dark", "description": "Weighty themes and consequences"},
  "lighthearted": {"label": "Lighthearted/Humorous", "description": "Fun and comedic moments"},
  "heroic": {"label": "Heroic/Epic", "description": "Grand adventures and noble deeds"},
  "gritty": {"label": "Gritty/Realistic", "description": "Harsh realities and moral complexity"},
  "mysterious": {"label": "Mysterious/Suspenseful", "description": "Intrigue and unexpected twists"}
}'::jsonb);

-- Content Boundaries (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('content_boundaries', 'en', 'Are there any content areas you prefer to avoid?', 'Help the GM create a comfortable experience for everyone', '{
  "gore": {"label": "Gore/Violence", "description": "Graphic descriptions of violence or injury"},
  "horror": {"label": "Horror Elements", "description": "Scary or disturbing content"},
  "romance": {"label": "Romance", "description": "Romantic storylines or relationships"},
  "political": {"label": "Political Themes", "description": "Real-world political topics or analogues"},
  "none": {"label": "No Restrictions", "description": "Open to all content types"}
}'::jsonb);

-- Additional Comments (English)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('additional_comments', 'en', 'Anything else the GM should know?', 'Share any other preferences, concerns, or ideas', null);

-- ==============================================
-- INSERT SPANISH TRANSLATIONS
-- ==============================================

-- Theme (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('theme', 'es', '¿Qué tema suena más emocionante para narración colaborativa?', 'Elige el escenario que capture tu imaginación', '{
  "scifi": {"label": "Ciencia Ficción", "description": "Explora posibilidades infinitas entre las estrellas y más allá"},
  "fantasy": {"label": "Fantasía", "description": "Magia tradicional y escenarios medievales"},
  "horror": {"label": "Horror", "description": "Encuentros sobrenaturales oscuros y suspensivos"},
  "modern": {"label": "Moderno", "description": "Escenarios contemporáneos del mundo real"},
  "historical": {"label": "Histórico", "description": "Escenarios auténticos del pasado de la Tierra"},
  "cyberpunk": {"label": "Ciberpunk", "description": "Futuros distópicos de alta tecnología con intriga corporativa"},
  "postapoc": {"label": "Post-Apocalíptico", "description": "Supervivencia tras el colapso de la civilización"}
}'::jsonb);

-- Setting Details (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('setting_details', 'es', '¿Hay escenarios o mundos específicos que te gustaría explorar?', 'Comparte universos particulares, períodos de tiempo o escenarios que te interesen', null);

-- Activity Preferences (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('activity_preferences', 'es', '¿Cuánto disfrutas estas actividades en los juegos de rol?', 'Califica de 1 (no me interesa) a 5 (muy interesado)', '{
  "combat": {"label": "Combate", "description": "Luchar contra enemigos y encuentros tácticos"},
  "puzzles": {"label": "Resolución de Acertijos", "description": "Enigmas, misterios y rompecabezas"},
  "diplomacy": {"label": "Diplomacia", "description": "Negociación, persuasión e interacción social"},
  "exploration": {"label": "Exploración", "description": "Descubrir nuevos lugares y revelar secretos"}
}'::jsonb);

-- Rules Complexity (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('rules_complexity', 'es', '¿Cuánto detalle mecánico mejora tu experiencia?', '1 = Reglas ligeras (enfoque narrativo) | 5 = Reglas complejas (profundidad táctica)', '{
  "1": {"label": "Reglas Ligeras", "description": "Enfoque en narrativa y desarrollo de personajes"},
  "2": {"label": "Ligeras-Moderadas", "description": "Reglas simples con algo de estructura"},
  "3": {"label": "Moderadas", "description": "Balance entre reglas y enfoque narrativo"},
  "4": {"label": "Moderadas-Complejas", "description": "Reglas detalladas con opciones tácticas"},
  "5": {"label": "Complejas", "description": "Mecánicas complejas y profundidad táctica"}
}'::jsonb);

-- Combat Style (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('combat_style', 'es', '¿Qué estilo de combate prefieres?', '¿Cómo deben resolverse los conflictos?', '{
  "narrative": {"label": "Narrativo/Abstracto", "description": "Combate narrativo sin cuadrículas ni posicionamiento exacto"},
  "tactical": {"label": "Táctico/Basado en Cuadrícula", "description": "Posicionamiento preciso con mapas y miniaturas"},
  "hybrid": {"label": "Enfoque Híbrido", "description": "Mezcla de elementos narrativos y tácticos según sea necesario"}
}'::jsonb);

-- Campaign Length (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('campaign_length', 'es', '¿Qué duración de campaña te atrae?', '¿Qué nivel de compromiso te interesa?', '{
  "oneshot": {"label": "Aventura Única", "description": "Aventura de una sola sesión (3-5 horas)"},
  "short": {"label": "Arco Corto", "description": "3-6 sesiones con una historia completa"},
  "medium": {"label": "Campaña Mediana", "description": "7-15 sesiones explorando una historia principal"},
  "longterm": {"label": "Largo Plazo", "description": "16+ sesiones construyendo una saga épica"}
}'::jsonb);

-- Session Frequency (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('session_frequency', 'es', '¿Con qué frecuencia te gustaría jugar?', '¿Qué horario funciona mejor para ti?', '{
  "weekly": {"label": "Semanal", "description": "Una vez por semana"},
  "biweekly": {"label": "Quincenal", "description": "Cada dos semanas"},
  "monthly": {"label": "Mensual", "description": "Una vez al mes"},
  "flexible": {"label": "Flexible", "description": "Horario variable según disponibilidad"}
}'::jsonb);

-- Experience Level (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('experience_level', 'es', '¿Cuál es tu experiencia con juegos de rol de mesa?', '1 = Principiante completo | 5 = Jugador veterano', '{
  "1": {"label": "Principiante", "description": "Nunca jugué o muy nuevo en los juegos de rol"},
  "2": {"label": "Novato", "description": "Jugué algunas sesiones"},
  "3": {"label": "Intermedio", "description": "Completé varias campañas"},
  "4": {"label": "Experimentado", "description": "Años de juego regular"},
  "5": {"label": "Veterano", "description": "Experiencia extensa en muchos sistemas"}
}'::jsonb);

-- Character Creation (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('character_creation', 'es', '¿Cómo prefieres crear personajes?', '¿Qué nivel de control quieres en la creación de personajes?', '{
  "pregen": {"label": "Pre-Generado", "description": "Usar personajes preparados para empezar de inmediato"},
  "collaborative": {"label": "Creación Colaborativa", "description": "Trabajar con el DJ para desarrollar tu personaje"},
  "full_control": {"label": "Control Total del Jugador", "description": "Libertad completa para diseñar tu personaje"}
}'::jsonb);

-- Tone Preferences (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('tone_preferences', 'es', '¿Qué tonos te atraen? (Selecciona todos los que apliquen)', 'Elige los ambientes y atmósferas que disfrutas', '{
  "serious": {"label": "Serio/Oscuro", "description": "Temas importantes y consecuencias"},
  "lighthearted": {"label": "Ligero/Humorístico", "description": "Momentos divertidos y cómicos"},
  "heroic": {"label": "Heroico/Épico", "description": "Grandes aventuras y actos nobles"},
  "gritty": {"label": "Crudo/Realista", "description": "Realidades duras y complejidad moral"},
  "mysterious": {"label": "Misterioso/Suspensivo", "description": "Intriga y giros inesperados"}
}'::jsonb);

-- Content Boundaries (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('content_boundaries', 'es', '¿Hay áreas de contenido que prefieres evitar?', 'Ayuda al DJ a crear una experiencia cómoda para todos', '{
  "gore": {"label": "Gore/Violencia", "description": "Descripciones gráficas de violencia o lesiones"},
  "horror": {"label": "Elementos de Horror", "description": "Contenido aterrador o perturbador"},
  "romance": {"label": "Romance", "description": "Historias románticas o relaciones"},
  "political": {"label": "Temas Políticos", "description": "Tópicos políticos del mundo real o análogos"},
  "none": {"label": "Sin Restricciones", "description": "Abierto a todos los tipos de contenido"}
}'::jsonb);

-- Additional Comments (Spanish)
INSERT INTO question_translations (question_key, language, question_text, question_description, options) VALUES
('additional_comments', 'es', '¿Algo más que el DJ debería saber?', 'Comparte cualquier otra preferencia, preocupación o idea', null);
