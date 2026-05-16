-- Grammar academy curriculum seed.
-- Run after supabase/schema.sql. Re-runnable and safe for existing projects.
-- The public curriculum uses only three levels: Beginner, Intermediate, and Advanced.

update public.grammar_levels
set is_published = false,
    updated_at = now()
where slug not in ('beginner', 'intermediate', 'advanced');

with level_data(title, slug, description, level_order) as (
  values
    ('Beginner', 'beginner', 'Build the grammar needed for clear everyday English: be, pronouns, articles, simple tenses, questions, negatives, prepositions, and basic conversation patterns.', 1),
    ('Intermediate', 'intermediate', 'Connect ideas with stronger tense control, perfect forms, modals, passive voice, reported speech, clauses, conditionals, and natural conversation practice.', 2),
    ('Advanced', 'advanced', 'Refine precision, emphasis, register, academic grammar, business grammar, advanced clauses, discourse control, and confident formal or professional communication.', 3)
)
insert into public.grammar_levels (title, slug, description, level_order, is_published)
select title, slug, description, level_order, true
from level_data
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  level_order = excluded.level_order,
  is_published = true,
  updated_at = now();

update public.profiles
set current_level_id = null,
    updated_at = now()
where current_level_id is not null
  and not exists (
    select 1
    from public.grammar_levels levels
    where levels.id = profiles.current_level_id
      and levels.slug in ('beginner', 'intermediate', 'advanced')
  );

with topic_data(level_slug, title, slug, description, topic_order) as (
  values
    ('beginner', 'Verb "to be" - am / is / are', 'verb-to-be-am-is-are', 'Use am, is, and are for identity, feelings, location, age, descriptions, and simple questions.', 1),
    ('beginner', 'Pronouns', 'pronouns', 'Use subject, object, and possessive pronouns to avoid repetition and build clear sentences.', 2),
    ('beginner', 'Articles - a / an / the', 'articles-a-an-the', 'Choose a, an, the, or no article with common nouns.', 3),
    ('beginner', 'Singular and plural nouns', 'singular-and-plural-nouns', 'Form regular and common irregular plural nouns accurately.', 4),
    ('beginner', 'This / that / these / those', 'this-that-these-those', 'Point to near and far people or things in singular and plural forms.', 5),
    ('beginner', 'Present simple', 'present-simple', 'Talk about habits, facts, routines, and general truths.', 6),
    ('beginner', 'Present continuous', 'present-continuous', 'Talk about actions happening now, around now, and temporary situations.', 7),
    ('beginner', 'Past simple', 'past-simple', 'Talk about finished actions and finished time in the past.', 8),
    ('beginner', 'Future with will', 'future-with-will', 'Use will for decisions, promises, offers, and predictions.', 9),
    ('beginner', 'Future with going to', 'future-with-going-to', 'Use going to for plans and predictions based on present evidence.', 10),
    ('beginner', 'Questions', 'questions', 'Build yes/no questions and information questions with correct word order.', 11),
    ('beginner', 'Negatives', 'negatives', 'Make accurate negative sentences with be, do, does, did, will, and can.', 12),
    ('beginner', 'There is / there are', 'there-is-there-are', 'Describe existence, quantity, and location with there is and there are.', 13),
    ('beginner', 'Prepositions - in / on / at', 'prepositions-in-on-at', 'Use in, on, and at for basic time and place meanings.', 14),
    ('beginner', 'Adjectives and adverbs', 'adjectives-and-adverbs', 'Describe nouns and actions with accurate adjective and adverb forms.', 15),
    ('beginner', 'Countable and uncountable nouns', 'countable-and-uncountable-nouns', 'Use countable and uncountable noun patterns with articles and quantity words.', 16),
    ('beginner', 'Some / any', 'some-any', 'Use some and any in statements, questions, offers, and negatives.', 17),
    ('beginner', 'Much / many / a lot of', 'much-many-a-lot-of', 'Choose quantity expressions for countable and uncountable nouns.', 18),
    ('beginner', 'Can / cannot', 'can-cannot', 'Talk about ability, permission, and simple possibility with can and cannot.', 19),
    ('beginner', 'Basic conversation grammar', 'basic-conversation-grammar', 'Use simple grammar for introductions, polite questions, short answers, and everyday exchanges.', 20),

    ('intermediate', 'Past continuous', 'past-continuous', 'Describe actions in progress at a past time and background situations.', 1),
    ('intermediate', 'Present perfect', 'present-perfect', 'Connect past actions to the present using have or has plus the past participle.', 2),
    ('intermediate', 'Present perfect vs past simple', 'present-perfect-vs-past-simple', 'Choose between present relevance and finished past time.', 3),
    ('intermediate', 'Present perfect continuous', 'present-perfect-continuous', 'Show duration and recent activity with have or has been plus verb-ing.', 4),
    ('intermediate', 'Past perfect', 'past-perfect', 'Show which past action happened before another past action.', 5),
    ('intermediate', 'Future continuous', 'future-continuous', 'Talk about actions in progress at a future time.', 6),
    ('intermediate', 'Future perfect', 'future-perfect', 'Talk about actions completed before a future time.', 7),
    ('intermediate', 'Comparatives', 'comparatives', 'Compare two people, things, places, or situations.', 8),
    ('intermediate', 'Superlatives', 'superlatives', 'Describe the highest or lowest point in a group.', 9),
    ('intermediate', 'Modal verbs', 'modal-verbs', 'Express ability, advice, obligation, permission, possibility, and certainty.', 10),
    ('intermediate', 'Gerunds and infinitives', 'gerunds-and-infinitives', 'Choose verb-ing or to + verb after common verbs and expressions.', 11),
    ('intermediate', 'Passive voice', 'passive-voice', 'Focus on the action or result instead of the person who does the action.', 12),
    ('intermediate', 'Reported speech', 'reported-speech', 'Report statements, questions, requests, and commands accurately.', 13),
    ('intermediate', 'Relative clauses', 'relative-clauses', 'Add useful information about nouns with who, which, that, where, and whose.', 14),
    ('intermediate', 'Conditionals type 0', 'conditionals-type-0', 'Talk about facts, rules, and always-true results.', 15),
    ('intermediate', 'Conditionals type 1', 'conditionals-type-1', 'Talk about real future possibilities and likely results.', 16),
    ('intermediate', 'Conditionals type 2', 'conditionals-type-2', 'Talk about imagined, unlikely, or unreal present and future situations.', 17),
    ('intermediate', 'Phrasal verbs', 'phrasal-verbs', 'Understand common verb plus particle patterns and word order.', 18),
    ('intermediate', 'Linking words', 'linking-words', 'Connect ideas clearly with contrast, reason, result, addition, and sequence.', 19),
    ('intermediate', 'Conversation practice', 'conversation-practice', 'Use intermediate grammar naturally in spoken exchanges and follow-up questions.', 20),

    ('advanced', 'Conditionals type 3', 'conditionals-type-3', 'Talk about unreal past situations and imagined past results.', 1),
    ('advanced', 'Mixed conditionals', 'mixed-conditionals', 'Connect past conditions with present results or present conditions with past results.', 2),
    ('advanced', 'Advanced passive voice', 'advanced-passive-voice', 'Use complex passive forms for formal, academic, and professional contexts.', 3),
    ('advanced', 'Advanced reported speech', 'advanced-reported-speech', 'Report nuanced speech, attitudes, doubts, emphasis, and distance.', 4),
    ('advanced', 'Advanced modal verbs', 'advanced-modal-verbs', 'Control degrees of certainty, obligation, criticism, expectation, and politeness.', 5),
    ('advanced', 'Modal perfect forms', 'modal-perfect-forms', 'Use modal + have + past participle for past speculation, criticism, and regret.', 6),
    ('advanced', 'Inversion', 'inversion', 'Use inverted word order after negative or limiting expressions for emphasis and formality.', 7),
    ('advanced', 'Cleft sentences', 'cleft-sentences', 'Emphasize specific information using it-clefts and wh-clefts.', 8),
    ('advanced', 'Participle clauses', 'participle-clauses', 'Compress information with present, past, and perfect participle clauses.', 9),
    ('advanced', 'Reduced relative clauses', 'reduced-relative-clauses', 'Shorten relative clauses when the meaning remains clear.', 10),
    ('advanced', 'Subjunctive mood', 'subjunctive-mood', 'Use formal verb patterns after demands, recommendations, and fixed expressions.', 11),
    ('advanced', 'Ellipsis and substitution', 'ellipsis-and-substitution', 'Avoid repetition while keeping meaning clear.', 12),
    ('advanced', 'Nominalization', 'nominalization', 'Turn verbs and adjectives into noun phrases for formal and academic style.', 13),
    ('advanced', 'Fronting', 'fronting', 'Move information to the beginning of a sentence for focus or cohesion.', 14),
    ('advanced', 'Discourse markers', 'discourse-markers', 'Guide readers and listeners through complex arguments and transitions.', 15),
    ('advanced', 'Academic grammar', 'academic-grammar', 'Use precise structures for research, analysis, argument, and evidence.', 16),
    ('advanced', 'Business grammar', 'business-grammar', 'Write and speak with professional clarity, tact, and directness.', 17),
    ('advanced', 'Formal and informal grammar', 'formal-and-informal-grammar', 'Adjust grammar choices for audience, relationship, purpose, and medium.', 18),
    ('advanced', 'Grammar for essays', 'grammar-for-essays', 'Build clear thesis statements, paragraph logic, evidence sentences, and conclusions.', 19),
    ('advanced', 'Advanced conversation practice', 'advanced-conversation-practice', 'Use advanced grammar naturally in nuanced, professional, and academic conversation.', 20)
)
insert into public.grammar_topics (level_id, title, slug, description, topic_order, is_published)
select levels.id, topic_data.title, topic_data.slug, topic_data.description, topic_data.topic_order, true
from topic_data
join public.grammar_levels levels on levels.slug = topic_data.level_slug
on conflict (level_id, slug) do update set
  title = excluded.title,
  description = excluded.description,
  topic_order = excluded.topic_order,
  is_published = true,
  updated_at = now();

drop table if exists pg_temp.seed_lessons;
create temporary table seed_lessons (
  level_slug text not null,
  topic_slug text not null,
  lesson_title text not null,
  lesson_slug text not null,
  difficulty text not null,
  estimated_minutes integer not null,
  lesson_order integer not null,
  summary text not null,
  explanation text not null,
  formula text not null,
  usage_when text not null,
  usage_when_not text not null,
  examples jsonb not null,
  common_mistakes jsonb not null,
  wrong_correct_examples jsonb not null,
  short_notes jsonb not null,
  mini_practice jsonb not null,
  mc_correct text not null,
  mc_wrong_1 text not null,
  mc_wrong_2 text not null,
  mc_wrong_3 text not null,
  blank_prompt text not null,
  blank_answer text not null,
  blank_prompt_two text not null,
  blank_answer_two text not null,
  tf_prompt text not null,
  tf_answer text not null,
  correction_prompt text not null,
  correction_answer text not null,
  correction_prompt_two text not null,
  correction_answer_two text not null,
  mistake_hint text not null
) on commit drop;

insert into seed_lessons (
  level_slug,
  topic_slug,
  lesson_title,
  lesson_slug,
  difficulty,
  estimated_minutes,
  lesson_order,
  summary,
  explanation,
  formula,
  usage_when,
  usage_when_not,
  examples,
  common_mistakes,
  wrong_correct_examples,
  short_notes,
  mini_practice,
  mc_correct,
  mc_wrong_1,
  mc_wrong_2,
  mc_wrong_3,
  blank_prompt,
  blank_answer,
  blank_prompt_two,
  blank_answer_two,
  tf_prompt,
  tf_answer,
  correction_prompt,
  correction_answer,
  correction_prompt_two,
  correction_answer_two,
  mistake_hint
)
values
(
  'beginner',
  'verb-to-be-am-is-are',
  'Verb "to be" - am / is / are',
  'verb-to-be-am-is-are',
  'easy',
  18,
  1,
  $$Learn how to use am, is, and are in positive sentences, negatives, questions, and short answers.$$,
  $$The verb "to be" connects the subject to information about identity, location, feelings, age, jobs, descriptions, and situations. Use am with I, is with he, she, it, and singular nouns, and are with you, we, they, and plural nouns. In negative sentences, put not after the be verb. In questions, move am, is, or are before the subject.$$,
  $$I am; he/she/it is; you/we/they are. Negative: subject + am/is/are + not. Question: am/is/are + subject?$$,
  $$Use this structure when you say who someone is, where something is, how someone feels, what something is like, a person's job, age, nationality, or a simple current situation.$$,
  $$Do not use do or does with be in simple present questions or negatives. Say "Is she ready?", not "Does she is ready?" Be careful not to use are with one singular person or is with plural people.$$,
  to_jsonb(string_to_array($$I am a student.
She is a doctor.
They are at home.
The room is quiet.
We are ready for class.
He is not tired.
Are you from Baghdad?
My keys are on the table.$$ , E'\n')),
  to_jsonb(string_to_array($$Using is with I.
Using are with he, she, it, or one singular noun.
Forgetting am, is, or are before an adjective.
Using do or does with be questions.
Putting not before the be verb.
Using the wrong short answer, such as Yes, I do.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I is ready. | Correct: I am ready.
Wrong: She are my teacher. | Correct: She is my teacher.
Wrong: They is at school. | Correct: They are at school.
Wrong: Does he happy? | Correct: Is he happy?
Wrong: I not am tired. | Correct: I am not tired.
Wrong: Yes, I do. | Correct: Yes, I am.$$ , E'\n')),
  to_jsonb(string_to_array($$I am is often shortened to I'm.
He is, she is, and it is can become he's, she's, and it's.
Are is used with you for one person or many people.
Short answers repeat the be verb: Yes, she is.
Use not after am, is, or are for negatives.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: I ___ ready.
Make a question: She is your teacher.
Make negative: They are at home.
Correct: He are tired.
Answer shortly: Are you okay? Yes, ___.$$ , E'\n')),
  'She is ready for class.',
  'She are ready for class.',
  'Does she ready for class?',
  'They is at home.',
  'Complete the sentence: He ___ my brother.',
  'is',
  'Complete the question: ___ they at school today?',
  'Are',
  'The sentence "They are at home" is correct.',
  'True',
  'Correct the sentence: I is tired.',
  'I am tired',
  'Correct the sentence: Does she happy?',
  'Is she happy?',
  'Choose the be form that matches the subject, and do not add do or does to be questions.'
),
(
  'beginner',
  'pronouns',
  'Pronouns',
  'pronouns',
  'easy',
  18,
  1,
  $$Learn how to use subject, object, and possessive pronouns so sentences are clear and not repetitive.$$,
  $$Pronouns replace nouns when the meaning is clear. Subject pronouns do the action: I, you, he, she, it, we, they. Object pronouns receive the action or follow a preposition: me, you, him, her, it, us, them. Possessive adjectives come before nouns: my book, your phone, their class. Possessive pronouns stand alone: mine, yours, hers, ours, theirs.$$,
  $$Subject pronoun + verb. Verb/preposition + object pronoun. Possessive adjective + noun. Possessive pronoun = no noun after it.$$,
  $$Use pronouns after you introduce or clearly know the person, place, or thing. Use them to avoid repeating names and to show who owns something.$$,
  $$Do not use object pronouns as subjects. Do not put a noun after a possessive pronoun. Be careful with its, which shows possession, and it's, which means it is.$$,
  to_jsonb(string_to_array($$Sara is my sister. She is kind.
I called Omar. I called him yesterday.
This is my notebook.
The blue bag is mine.
Ali and Dana are here. They are waiting.
Please sit with us.
The dog is hungry. It needs food.
Their teacher gave them homework.$$ , E'\n')),
  to_jsonb(string_to_array($$Using me as the subject of a sentence.
Using her or him before a verb as the subject.
Putting a noun after mine, yours, ours, or theirs.
Confusing its and it's.
Using they for one thing when it is clearer.
Repeating the noun too often instead of using a pronoun.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: Me am ready. | Correct: I am ready.
Wrong: Her is my sister. | Correct: She is my sister.
Wrong: I called she. | Correct: I called her.
Wrong: This book is my. | Correct: This book is mine.
Wrong: This is mine book. | Correct: This is my book.
Wrong: The company changed it's policy. | Correct: The company changed its policy.$$ , E'\n')),
  to_jsonb(string_to_array($$I is always capitalized.
You can mean one person or more than one person.
It is used for one thing, place, animal, or idea when gender is not important.
They can refer to plural people or things.
Use possessive adjectives before nouns and possessive pronouns without nouns.$$ , E'\n')),
  to_jsonb(string_to_array($$Replace the noun: Sara is here. ___ is here.
Choose: I called (he / him).
Complete: This is ___ phone. (my / mine)
Correct: Me like English.
Complete: The red pen is ___ . (her / hers)$$ , E'\n')),
  'She is my sister.',
  'Her is my sister.',
  'I called she yesterday.',
  'This is mine book.',
  'Complete the sentence: Ali and Dana are here. ___ are ready.',
  'They',
  'Complete the sentence: I called Omar. I called ___ yesterday.',
  'him',
  'A possessive pronoun can stand alone without a noun after it.',
  'True',
  'Correct the sentence: Me am ready.',
  'I am ready',
  'Correct the sentence: This is mine book.',
  'This is my book',
  'Check whether the pronoun is doing the action, receiving the action, or showing possession.'
),
(
  'beginner',
  'articles-a-an-the',
  'Articles - a / an / the',
  'articles-a-an-the',
  'easy',
  20,
  1,
  $$Learn when to use a, an, the, and no article before English nouns.$$,
  $$Articles show whether a noun is general, new, or specific. Use a or an with one non-specific singular countable noun. Use an before a vowel sound, not only a vowel letter. Use the when the speaker and listener know which noun, when the noun is unique in the situation, or when you mention it a second time. Use no article for plural nouns and uncountable nouns when you speak generally.$$,
  $$a/an + singular countable noun. the + specific noun. no article + general plural or uncountable noun.$$,
  $$Use a or an when you introduce one thing for the first time. Use the when the noun is clear, known, already mentioned, or unique. Use no article for general ideas such as music, water, advice, books, and languages.$$,
  $$Do not use a or an with plural nouns or uncountable nouns. Do not use the for general meaning unless you mean a specific group or item.$$,
  to_jsonb(string_to_array($$I saw a bird outside.
The bird was near the window.
She is an engineer.
He bought a phone yesterday.
The phone is very fast.
Water is important.
Books help learners improve.
Can you close the door?$$ , E'\n')),
  to_jsonb(string_to_array($$Using a before a vowel sound.
Using an before a consonant sound.
Using a or an with plural nouns.
Using a or an with uncountable nouns.
Using the for general ideas.
Forgetting the when both people know the noun.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: She is a engineer. | Correct: She is an engineer.
Wrong: I bought an university book. | Correct: I bought a university book.
Wrong: I need a water. | Correct: I need water.
Wrong: I like the music in general. | Correct: I like music in general.
Wrong: She has a books. | Correct: She has books.
Wrong: Open door, please. | Correct: Open the door, please.$$ , E'\n')),
  to_jsonb(string_to_array($$Use an before vowel sounds: an hour, an honest person.
Use a before consonant sounds: a university, a European city.
Use the sun, the moon, and the internet because they are specific or unique.
First mention often uses a or an; second mention often uses the.
Some nouns can be general with no article or specific with the.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: She is ___ engineer.
Choose: I like (music / the music) in general.
Correct: I need a advice.
Complete: ___ book on the table is mine.
Choose: a hour / an hour.$$ , E'\n')),
  'She is an engineer.',
  'She is a engineer.',
  'I need a water.',
  'I like the music in general.',
  'Complete the sentence: She is ___ honest person.',
  'an',
  'Complete the sentence: I saw a dog. ___ dog was black.',
  'The',
  'Use an before a vowel sound, not only before a vowel letter.',
  'True',
  'Correct the sentence: I need a advice.',
  'I need advice',
  'Correct the sentence: She has a books.',
  'She has books',
  'Ask whether the noun is singular countable, plural, uncountable, specific, or general.'
),
(
  'beginner',
  'present-simple',
  'Present simple',
  'present-simple',
  'easy',
  22,
  1,
  $$Use the present simple for habits, routines, facts, schedules, and things that are generally true.$$,
  $$The present simple describes actions that happen regularly or facts that stay true. With I, you, we, and they, use the base verb. With he, she, it, and singular nouns, add -s or -es in positive sentences. In negatives and questions, use do or does plus the base verb. After does, do not add -s to the main verb.$$,
  $$Positive: subject + base verb / verb-s. Negative: subject + do/does not + base verb. Question: do/does + subject + base verb?$$,
  $$Use it for habits, daily routines, permanent situations, facts, general truths, timetables, and repeated actions.$$,
  $$Do not use present simple for actions happening right now. Do not add -s after does in questions or negatives.$$,
  to_jsonb(string_to_array($$I study English every day.
She works in a bank.
They live near the river.
The shop opens at nine.
Water boils at 100 degrees Celsius.
He does not eat meat.
Do you speak English?
My brother watches football on Fridays.$$ , E'\n')),
  to_jsonb(string_to_array($$Forgetting -s with he, she, it, or one singular noun.
Adding -s after does.
Using am, is, or are before a normal verb.
Using present simple for an action happening now.
Using do with he, she, or it instead of does.
Forgetting do or does in questions.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: She work every day. | Correct: She works every day.
Wrong: Does he plays football? | Correct: Does he play football?
Wrong: I am go to work. | Correct: I go to work.
Wrong: He do not like tea. | Correct: He does not like tea.
Wrong: You like coffee? | Correct: Do you like coffee?
Wrong: The lesson start at ten. | Correct: The lesson starts at ten.$$ , E'\n')),
  to_jsonb(string_to_array($$Frequency adverbs often come before the main verb: I usually study.
With be, frequency adverbs usually come after be: She is often late.
Add -es after verbs ending in -ch, -sh, -s, -x, or -o.
Use does for he, she, it, and singular nouns.
After do, does, do not, or does not, use the base verb.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: She ___ coffee every morning.
Make a question: You live near school.
Make negative: He likes tea.
Correct: Does she works here?
Choose: He go / goes to work by bus.$$ , E'\n')),
  'She works every day.',
  'She work every day.',
  'Does she works every day?',
  'I am go to school every day.',
  'Complete the sentence: He ___ coffee every morning.',
  'drinks',
  'Complete the question: ___ she work here?',
  'Does',
  'After does, the main verb stays in the base form.',
  'True',
  'Correct the sentence: She do not play football.',
  'She does not play football',
  'Correct the sentence: Does he plays tennis?',
  'Does he play tennis?',
  'Use -s only in positive sentences with he, she, it, and singular nouns.'
),
(
  'beginner',
  'present-continuous',
  'Present continuous',
  'present-continuous',
  'easy',
  22,
  1,
  $$Use the present continuous for actions happening now, around now, and temporary situations.$$,
  $$The present continuous uses am, is, or are plus a verb ending in -ing. It shows that an action is in progress now, happening around the present time, temporary, changing, or arranged for the near future. The be verb changes with the subject, but the -ing verb does not change for he, she, or it.$$,
  $$Subject + am/is/are + verb-ing. Negative: subject + am/is/are + not + verb-ing. Question: am/is/are + subject + verb-ing?$$,
  $$Use it for actions happening now, temporary work or study, current projects, changing situations, and fixed personal arrangements in the near future.$$,
  $$Do not normally use it for permanent habits or general facts. Be careful with stative verbs such as know, believe, understand, need, and love in basic English.$$,
  to_jsonb(string_to_array($$I am studying now.
She is cooking dinner.
They are playing outside.
We are learning grammar this week.
He is working from home today.
It is raining.
Are you listening?
She is meeting her manager tomorrow.$$ , E'\n')),
  to_jsonb(string_to_array($$Forgetting am, is, or are before verb-ing.
Using the base verb after am, is, or are.
Using present continuous for daily routines.
Adding -s to the -ing verb.
Using the wrong be form with the subject.
Forgetting spelling changes such as make to making.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: She cooking now. | Correct: She is cooking now.
Wrong: They are play outside. | Correct: They are playing outside.
Wrong: He is works today. | Correct: He is working today.
Wrong: I am go to school every day. | Correct: I go to school every day.
Wrong: We is studying. | Correct: We are studying.
Wrong: She is make dinner. | Correct: She is making dinner.$$ , E'\n')),
  to_jsonb(string_to_array($$Now, at the moment, and right now often signal present continuous.
Temporary time phrases include this week, today, and these days.
Drop final silent e before -ing: write to writing.
Double the final consonant in some short verbs: run to running.
Use present simple, not present continuous, for routines.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: She ___ cooking now.
Make negative: They are playing.
Make a question: You are listening.
Correct: He working today.
Choose: I study / am studying right now.$$ , E'\n')),
  'She is cooking now.',
  'She cooking now.',
  'They are play outside.',
  'He is works today.',
  'Complete the sentence: They are ___ outside.',
  'playing',
  'Complete the sentence: I ___ studying now.',
  'am',
  'Present continuous needs am, is, or are before verb-ing.',
  'True',
  'Correct the sentence: He working today.',
  'He is working today',
  'Correct the sentence: They are play football.',
  'They are playing football',
  'Check for both parts of the structure: the correct be verb and the -ing form.'
),
(
  'beginner',
  'past-simple',
  'Past simple',
  'past-simple',
  'easy',
  22,
  1,
  $$Use the past simple for finished actions and finished time periods.$$,
  $$The past simple describes actions that started and finished in the past. Regular verbs usually add -ed. Irregular verbs have special past forms, such as went, saw, bought, and made. In questions and negatives, use did plus the base verb. Do not use the past form after did.$$,
  $$Positive: subject + past verb. Negative: subject + did not + base verb. Question: did + subject + base verb?$$,
  $$Use it with finished time words such as yesterday, last night, last year, in 2020, two days ago, and when I was young.$$,
  $$Do not use present perfect with a finished past time. Do not use the past verb after did or did not.$$,
  to_jsonb(string_to_array($$I visited my cousin yesterday.
She watched a film last night.
They played football on Monday.
He went to school early.
We ate dinner at eight.
Did you see the message?
I did not understand the question.
The meeting started late.$$ , E'\n')),
  to_jsonb(string_to_array($$Using the base verb in positive past sentences.
Using did with the past verb.
Adding -ed to irregular verbs.
Forgetting did in past simple questions.
Using present perfect with yesterday or last week.
Forgetting spelling changes in regular past forms.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: She visit Paris last year. | Correct: She visited Paris last year.
Wrong: Did you went home? | Correct: Did you go home?
Wrong: I didn't watched TV. | Correct: I didn't watch TV.
Wrong: She buyed a phone. | Correct: She bought a phone.
Wrong: I have seen him yesterday. | Correct: I saw him yesterday.
Wrong: We stoped there. | Correct: We stopped there.$$ , E'\n')),
  to_jsonb(string_to_array($$Regular verbs often end in -ed.
Some verbs are irregular and must be learned separately.
After did and did not, use the base verb.
Finished time words often point to the past simple.
The be verb has past forms: was and were.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: I ___ my friend yesterday.
Make a question: She visited Paris.
Make negative: He went home.
Correct: Did you went home?
Choose: She bought / buyed a phone.$$ , E'\n')),
  'She visited Paris last year.',
  'She visit Paris last year.',
  'Did she visited Paris?',
  'I did not watched TV.',
  'Complete the sentence: I ___ my friend yesterday.',
  'visited',
  'Complete the question: ___ you see the message?',
  'Did',
  'After did, use the base verb.',
  'True',
  'Correct the sentence: He did not went home.',
  'He did not go home',
  'Correct the sentence: She buyed a new phone.',
  'She bought a new phone',
  'Look for finished past time and remember that did carries the past meaning.'
),
(
  'beginner',
  'future-with-will',
  'Future tense',
  'future-tense',
  'medium',
  24,
  1,
  $$Learn the difference between will and going to for common future meanings.$$,
  $$English uses several forms for the future. Will is common for quick decisions, promises, offers, requests, and general predictions. Going to is common for plans decided before now and predictions based on present evidence. Both forms use the base verb after the future marker. Going to also needs am, is, or are before going to.$$,
  $$will + base verb. am/is/are + going to + base verb.$$,
  $$Use will when you decide at the moment of speaking, promise something, offer help, or make a general prediction. Use going to for planned actions and predictions with present evidence.$$,
  $$Do not use to after will. Do not combine will and going to. Do not forget am, is, or are before going to.$$,
  to_jsonb(string_to_array($$I will call you later.
She will help us.
It will probably rain tomorrow.
I am going to study tonight.
They are going to travel next month.
Look at those clouds. It is going to rain.
Will you join us?
He is not going to sell his car.$$ , E'\n')),
  to_jsonb(string_to_array($$Using to after will.
Forgetting be before going to.
Combining will and going to.
Using the past verb after will.
Using will for a clear plan when going to sounds more natural.
Using going to without a subject.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I will to call you. | Correct: I will call you.
Wrong: She going to study. | Correct: She is going to study.
Wrong: I am going to will travel. | Correct: I am going to travel.
Wrong: He will called later. | Correct: He will call later.
Wrong: They is going to leave. | Correct: They are going to leave.
Wrong: Look at the clouds. It will rain soon. | Correct: Look at the clouds. It is going to rain soon.$$ , E'\n')),
  to_jsonb(string_to_array($$Will is often shortened to 'll in speech.
Will not can become won't.
Going to is very common in spoken English.
Use the base verb after both will and going to.
Context decides which future form sounds most natural.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: I ___ call you later.
Complete: She ___ going to visit us.
Choose: Look at the clouds. It will / is going to rain.
Correct: I will to help you.
Correct: They going to travel tomorrow.$$ , E'\n')),
  'I will call you later.',
  'I will to call you later.',
  'She going to study tonight.',
  'I am going to will travel.',
  'Complete the sentence: She ___ going to visit us.',
  'is',
  'Complete the sentence: I ___ help you with that.',
  'will',
  'Going to needs a form of be before it.',
  'True',
  'Correct the sentence: I will to help you.',
  'I will help you',
  'Correct the sentence: They going to travel tomorrow.',
  'They are going to travel tomorrow',
  'Use the base verb after will, and use am/is/are before going to.'
),
(
  'beginner',
  'questions',
  'Questions',
  'questions',
  'easy',
  22,
  1,
  $$Learn how to build yes/no questions and information questions with correct English word order.$$,
  $$Questions often need an auxiliary verb before the subject. With be, move am, is, or are before the subject. With present simple verbs, use do or does plus the base verb. With past simple verbs, use did plus the base verb. Question words such as what, where, when, why, who, and how usually come at the beginning.$$,
  $$Be question: am/is/are + subject? Present simple: do/does + subject + base verb? Past simple: did + subject + base verb? Wh-question: question word + auxiliary + subject + verb?$$,
  $$Use questions to ask about identity, location, time, reasons, people, choices, routines, facts, and past events.$$,
  $$Do not keep normal statement word order when a question needs an auxiliary. Do not use do or does with be questions.$$,
  to_jsonb(string_to_array($$Are you ready?
Is she your teacher?
Do you like coffee?
Does he work here?
Did they call yesterday?
What is your name?
Where do you live?
Why did she leave early?$$ , E'\n')),
  to_jsonb(string_to_array($$Using statement order in questions.
Using do or does with be.
Adding -s after does.
Using the past verb after did.
Forgetting the auxiliary in wh-questions.
Putting the question word in the middle.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: You are ready? | Correct: Are you ready?
Wrong: Does she is ready? | Correct: Is she ready?
Wrong: Does he works here? | Correct: Does he work here?
Wrong: Did they called yesterday? | Correct: Did they call yesterday?
Wrong: Where you live? | Correct: Where do you live?
Wrong: You went where? | Correct: Where did you go?$$ , E'\n')),
  to_jsonb(string_to_array($$Yes/no questions ask for yes or no.
Wh-questions ask for specific information.
Use does with he, she, it, and singular nouns.
Use did for past simple questions.
Short answers should match the auxiliary: Yes, I do; No, she isn't.$$ , E'\n')),
  to_jsonb(string_to_array($$Make a question: She is ready.
Complete: ___ do you live?
Correct: Does he works here?
Make a past question: They called yesterday.
Choose: Do / Does she speak English?$$ , E'\n')),
  'Are you ready?',
  'You are ready?',
  'Does she is ready?',
  'Does he works here?',
  'Complete the question: ___ do you live?',
  'Where',
  'Complete the question: ___ he work here?',
  'Does',
  'With be, a yes/no question starts with am, is, or are.',
  'True',
  'Correct the sentence: Does he works here?',
  'Does he work here?',
  'Correct the sentence: Where you live?',
  'Where do you live?',
  'Move the auxiliary before the subject and keep the main verb in the base form after do, does, or did.'
),
(
  'beginner',
  'negatives',
  'Negatives',
  'negatives',
  'easy',
  20,
  1,
  $$Learn how to say that something is not true with not, do not, does not, did not, will not, and cannot.$$,
  $$A negative sentence denies information or says that an action does not happen. With be, put not after am, is, or are. With present simple verbs, use do not or does not plus the base verb. With past simple verbs, use did not plus the base verb. With will and can, put not after the modal. Do not use two simple negative markers for one meaning.$$,
  $$Be: subject + am/is/are + not. Present: subject + do/does not + base verb. Past: subject + did not + base verb. Modal: subject + will/can + not + base verb.$$,
  $$Use negatives to deny facts, habits, actions, identity, location, ability, plans, or predictions.$$,
  $$Do not use not alone before a normal verb in simple tenses. Do not use am not with normal action verbs. Do not add -s or past forms after doesn't or didn't.$$,
  to_jsonb(string_to_array($$I am not tired.
She is not at home.
They are not ready.
I do not like onions.
He does not work here.
We did not watch the film.
She will not be late.
I cannot open the file.$$ , E'\n')),
  to_jsonb(string_to_array($$Forgetting be before not.
Using not without do, does, or did for action verbs.
Using do not with he, she, or it.
Adding -s after does not.
Using the past verb after did not.
Using cannot to with another verb.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: She not ready. | Correct: She is not ready.
Wrong: I not like coffee. | Correct: I do not like coffee.
Wrong: He do not work here. | Correct: He does not work here.
Wrong: She doesn't likes tea. | Correct: She doesn't like tea.
Wrong: I didn't watched TV. | Correct: I didn't watch TV.
Wrong: I cannot to swim. | Correct: I cannot swim.$$ , E'\n')),
  to_jsonb(string_to_array($$Do not is often shortened to don't.
Does not is often shortened to doesn't.
Did not is often shortened to didn't.
Cannot is usually written as one word.
After doesn't and didn't, use the base verb.$$ , E'\n')),
  to_jsonb(string_to_array($$Make negative: She is ready.
Complete: He ___ not work here.
Correct: I am not like coffee.
Make negative: They watched the film.
Choose: doesn't like / doesn't likes.$$ , E'\n')),
  'She is not ready.',
  'She not ready.',
  'I not like coffee.',
  'He do not work here.',
  'Complete the sentence: He ___ not work here.',
  'does',
  'Complete the sentence: We ___ not watch the film.',
  'did',
  'Does not is followed by the base verb.',
  'True',
  'Correct the sentence: I am not like coffee.',
  'I do not like coffee',
  'Correct the sentence: She does not likes tea.',
  'She does not like tea',
  'Choose the negative helper that matches the verb type and time.'
),
(
  'beginner',
  'prepositions-in-on-at',
  'Prepositions - in / on / at',
  'prepositions-in-on-at',
  'easy',
  22,
  1,
  $$Use in, on, and at for basic time and place with more confidence.$$,
  $$In, on, and at are common prepositions for time and place. For time, use in with months, years, seasons, and long periods; on with days and dates; and at with exact times. For place, use in for areas or enclosed spaces, on for surfaces, and at for points, events, or specific locations. Many expressions are fixed and need practice.$$,
  $$Time: in + month/year/period; on + day/date; at + exact time. Place: in + area/container; on + surface; at + point/location.$$,
  $$Use these prepositions to say when something happens or where something or someone is.$$,
  $$Do not translate prepositions directly from your first language. Do not use in for exact clock times or on for months.$$,
  to_jsonb(string_to_array($$I was born in July.
She studies in the morning.
The meeting is on Monday.
My birthday is on May 5.
Class starts at nine.
He is at the door.
The keys are on the table.
They live in Erbil.$$ , E'\n')),
  to_jsonb(string_to_array($$Using in with exact times.
Using in with days or dates.
Using at with countries or cities.
Using on with months or years.
Confusing on a surface with in a space.
Forgetting fixed expressions such as at night.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I wake up in 7 o'clock. | Correct: I wake up at 7 o'clock.
Wrong: The meeting is in Monday. | Correct: The meeting is on Monday.
Wrong: She lives at Iraq. | Correct: She lives in Iraq.
Wrong: My birthday is at June. | Correct: My birthday is in June.
Wrong: The phone is in the table. | Correct: The phone is on the table.
Wrong: We met on the station. | Correct: We met at the station.$$ , E'\n')),
  to_jsonb(string_to_array($$Use at for exact clock times.
Use on for days and calendar dates.
Use in for months, years, cities, countries, and rooms.
Use on for surfaces such as tables, walls, and pages.
Some phrases are fixed: at home, at work, at night, in the morning.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: Class starts ___ 8:00.
Choose: The book is in / on the table.
Correct: We met in Monday.
Complete: She lives ___ Baghdad.
Choose: at night / in night.$$ , E'\n')),
  'The class starts at eight.',
  'The class starts in eight.',
  'The meeting is in Monday.',
  'She lives at Iraq.',
  'Complete the sentence: The book is ___ the table.',
  'on',
  'Complete the sentence: We met ___ the station.',
  'at',
  'Use on for days and dates.',
  'True',
  'Correct the sentence: The meeting is in Monday.',
  'The meeting is on Monday',
  'Correct the sentence: She lives at Iraq.',
  'She lives in Iraq',
  'Identify whether the phrase is a time or place, then choose the common English pattern.'
),
(
  'beginner',
  'countable-and-uncountable-nouns',
  'Countable and uncountable nouns',
  'countable-and-uncountable-nouns',
  'medium',
  24,
  1,
  $$Learn which nouns can be counted and how that changes articles, plurals, and quantity words.$$,
  $$Countable nouns name separate things you can count: one book, two books. They have singular and plural forms. Uncountable nouns name materials, groups, or abstract ideas that are not usually counted directly: water, advice, information, furniture, homework. They usually do not take a or an and usually do not have a plural -s in everyday English. To count them, use units such as a piece of, a bottle of, or a cup of.$$,
  $$Countable: a/an + singular noun; number + plural noun. Uncountable: some/a lot of/much + noun; a piece/bottle/cup of + noun.$$,
  $$Use countable patterns for individual items and uncountable patterns for substances, abstract ideas, and mass nouns. Use many with countable plural nouns and much with uncountable nouns.$$,
  $$Do not add plural -s to common uncountable nouns such as advice, information, furniture, homework, luggage, and equipment. Do not use a or an directly before uncountable nouns.$$,
  to_jsonb(string_to_array($$I have a book.
She has three books.
We need some water.
He gave me good advice.
There is a lot of information online.
Can I have a piece of cake?
There are two chairs in the room.
This furniture is expensive.$$ , E'\n')),
  to_jsonb(string_to_array($$Using a or an before uncountable nouns.
Adding -s to advice, information, furniture, or homework.
Using many with uncountable nouns.
Using much with countable plural nouns in normal statements.
Forgetting a plural -s after numbers with countable nouns.
Using there are with singular uncountable nouns.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I need an advice. | Correct: I need advice.
Wrong: These informations are useful. | Correct: This information is useful.
Wrong: There are many furniture. | Correct: There is a lot of furniture.
Wrong: I bought three bread. | Correct: I bought three loaves of bread.
Wrong: She has two book. | Correct: She has two books.
Wrong: How many homework do you have? | Correct: How much homework do you have?$$ , E'\n')),
  to_jsonb(string_to_array($$A lot of works with both countable and uncountable nouns.
Some nouns can be both countable and uncountable with different meanings.
Use pieces, bottles, cups, slices, and loaves to count uncountable things.
Advice and information are usually singular uncountable nouns in English.
Use many for countable plurals and much for uncountable nouns.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: I need ___ advice.
Choose: many / much homework.
Correct: These informations are useful.
Complete: She has three ___ . (book)
Choose: a furniture / some furniture.$$ , E'\n')),
  'I need some advice.',
  'I need an advice.',
  'There are many information online.',
  'She has two book.',
  'Complete the sentence: I have ___ homework tonight.',
  'much',
  'Complete the sentence: She has three ___.',
  'books',
  'Advice is usually uncountable in English.',
  'True',
  'Correct the sentence: These informations are useful.',
  'This information is useful',
  'Correct the sentence: I bought three bread.',
  'I bought three loaves of bread',
  'Decide whether the noun is a countable item or an uncountable idea, material, or category.'
),
(
  'intermediate',
  'present-perfect',
  'Present perfect',
  'present-perfect',
  'medium',
  26,
  1,
  $$Use the present perfect to connect a past action or experience to the present.$$,
  $$The present perfect uses have or has plus the past participle. It connects the past with the present. It is common for life experiences, recent results, unfinished time periods, and situations that started in the past and continue now. The exact finished past time is usually not the focus. If you mention a finished time such as yesterday or last year, use the past simple instead.$$,
  $$Subject + have/has + past participle. Negative: subject + have/has not + past participle. Question: have/has + subject + past participle?$$,
  $$Use it for experiences, recent news or results, unfinished time periods, and actions or states continuing until now with for and since.$$,
  $$Do not use it with finished past time expressions such as yesterday, last week, in 2020, or two days ago. Use the past simple when the time is finished and specific.$$,
  to_jsonb(string_to_array($$I have visited Istanbul.
She has finished her homework.
They have lived here for five years.
We have already eaten.
He has just arrived.
Have you ever tried sushi?
I have not seen that film.
The train has left.$$ , E'\n')),
  to_jsonb(string_to_array($$Using the past simple form instead of the past participle.
Using have with he, she, or it.
Using present perfect with yesterday or last year.
Forgetting have or has.
Confusing for and since.
Putting yet in the wrong place in negatives and questions.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I have saw that film. | Correct: I have seen that film.
Wrong: She have finished. | Correct: She has finished.
Wrong: I have visited London yesterday. | Correct: I visited London yesterday.
Wrong: They lived here since 2020. | Correct: They have lived here since 2020.
Wrong: Have you ever went there? | Correct: Have you ever been there?
Wrong: He has not finished already. | Correct: He has not finished yet.$$ , E'\n')),
  to_jsonb(string_to_array($$Use has with he, she, it, and singular nouns.
Use the past participle: eaten, gone, seen, written.
Ever and never often appear with experiences.
Already, just, and yet often appear with recent results.
Use for with a length of time and since with a starting point.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: She ___ finished her work.
Choose: I have seen / saw that film.
Correct: I have visited him yesterday.
Complete: They have lived here ___ 2020.
Make a question: You have tried sushi.$$ , E'\n')),
  'She has finished her homework.',
  'She have finished her homework.',
  'I have saw that film.',
  'I have visited him yesterday.',
  'Complete the sentence: She ___ finished her homework.',
  'has',
  'Complete the sentence: I have ___ that film.',
  'seen',
  'Use past simple with a finished time like yesterday.',
  'True',
  'Correct the sentence: I have visited him yesterday.',
  'I visited him yesterday',
  'Correct the sentence: She have finished her report.',
  'She has finished her report',
  'Check whether the sentence connects past and present or names a finished past time.'
),
(
  'intermediate',
  'passive-voice',
  'Passive voice',
  'passive-voice',
  'medium',
  28,
  1,
  $$Use the passive voice when the action or result is more important than the person who does it.$$,
  $$The passive voice changes the focus of a sentence. In an active sentence, the subject does the action. In a passive sentence, the subject receives the action. Use the correct form of be plus the past participle. You can add by + agent if the person or thing that does the action is important, but many passive sentences leave the agent out because it is unknown, obvious, or not important.$$,
  $$Subject + be + past participle. Optional agent: by + doer. Present: is/are made. Past: was/were made. Future: will be made. Perfect: has/have been made.$$,
  $$Use passive voice for processes, reports, formal writing, news, systems, rules, results, and situations where the doer is unknown or less important.$$,
  $$Do not use passive voice when the doer is important and active voice is clearer. Do not forget the be verb, and do not use the base verb instead of the past participle.$$,
  to_jsonb(string_to_array($$The report is written every month.
The emails were sent yesterday.
The bridge was built in 1995.
English is spoken in many countries.
The problem has been solved.
The meeting will be held online.
The windows are cleaned on Fridays.
The cake was made by my sister.$$ , E'\n')),
  to_jsonb(string_to_array($$Forgetting the be verb.
Using the base verb instead of the past participle.
Using the wrong tense of be.
Adding by when the agent is not needed.
Using passive voice when active voice is simpler.
Confusing object and subject when changing active to passive.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: The report written every month. | Correct: The report is written every month.
Wrong: The emails were send yesterday. | Correct: The emails were sent yesterday.
Wrong: The bridge built in 1995. | Correct: The bridge was built in 1995.
Wrong: The problem has solved. | Correct: The problem has been solved.
Wrong: The meeting will held online. | Correct: The meeting will be held online.
Wrong: Coffee grows by farmers. | Correct: Coffee is grown by farmers.$$ , E'\n')),
  to_jsonb(string_to_array($$The passive always needs a form of be.
The main verb is always the past participle.
The tense is shown by the form of be.
Use by only when the doer matters.
Passive voice is common in academic, business, technical, and news writing.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: The report ___ written every month.
Choose: was built / was build.
Correct: The emails were send yesterday.
Change to passive: They clean the windows on Fridays.
Complete: The meeting will ___ held online.$$ , E'\n')),
  'The report is written every month.',
  'The report written every month.',
  'The emails were send yesterday.',
  'The meeting will held online.',
  'Complete the sentence: The bridge ___ built in 1995.',
  'was',
  'Complete the sentence: The meeting will ___ held online.',
  'be',
  'The passive voice uses be plus the past participle.',
  'True',
  'Correct the sentence: The emails were send yesterday.',
  'The emails were sent yesterday',
  'Correct the sentence: The problem has solved.',
  'The problem has been solved',
  'Find the tense first, choose the correct form of be, then use the past participle.'
),
(
  'intermediate',
  'conditionals-type-1',
  'Conditionals',
  'conditionals',
  'medium',
  30,
  1,
  $$Learn the core conditional patterns for facts, real future results, and imagined situations.$$,
  $$Conditionals connect a condition with a result. The zero conditional talks about facts and rules. The first conditional talks about real future possibilities. The second conditional talks about imagined, unlikely, or unreal present and future situations. The if-clause can come first or second. When the if-clause comes first, use a comma before the result clause.$$,
  $$Zero: if + present simple, present simple. First: if + present simple, will + base verb. Second: if + past simple, would + base verb.$$,
  $$Use conditionals for rules, cause and effect, plans, warnings, possibilities, advice, and imagined situations.$$,
  $$Do not use will in the if-clause of a basic first conditional. Do not use would in both clauses of a basic second conditional. Be careful not to mix zero, first, and second conditional meanings.$$,
  to_jsonb(string_to_array($$If you heat water, it boils.
If it rains, I will stay home.
If I see Ali, I will tell him.
We will be late if we leave now.
If she studies, she will pass.
If I had more time, I would travel.
If I were you, I would apologize.
If you press this button, the machine starts.$$ , E'\n')),
  to_jsonb(string_to_array($$Using will in the if-clause of the first conditional.
Using would in both clauses of the second conditional.
Using past simple for a real future condition.
Forgetting the comma when the if-clause comes first.
Using zero conditional for a single future possibility.
Confusing if and when in factual or scheduled situations.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: If it will rain, I will stay home. | Correct: If it rains, I will stay home.
Wrong: If I would have time, I would travel. | Correct: If I had time, I would travel.
Wrong: If you heat water, it will boils. | Correct: If you heat water, it boils.
Wrong: If she studies she will pass. | Correct: If she studies, she will pass.
Wrong: If I am you, I would wait. | Correct: If I were you, I would wait.
Wrong: If he will call, tell me. | Correct: If he calls, tell me.$$ , E'\n')),
  to_jsonb(string_to_array($$The if-clause can come before or after the result clause.
Use a comma when the if-clause comes first.
First conditional is for real future possibilities.
Second conditional is for imagined or unlikely situations.
Were is common with I in formal second conditional sentences.$$ , E'\n')),
  to_jsonb(string_to_array($$Complete: If it ___, I will stay home.
Choose: If I were / am you, I would wait.
Correct: If it will rain, we will cancel.
Complete: If you heat water, it ___.
Make a second conditional: If I have more time, I travel.$$ , E'\n')),
  'If it rains, I will stay home.',
  'If it will rain, I will stay home.',
  'If I would have time, I would travel.',
  'If you heat water, it will boils.',
  'Complete the sentence: If it ___ tomorrow, we will cancel.',
  'rains',
  'Complete the sentence: If you heat water, it ___.',
  'boils',
  'In the first conditional, the if-clause usually uses present simple.',
  'True',
  'Correct the sentence: If it will rain, we will cancel.',
  'If it rains, we will cancel',
  'Correct the sentence: If I would have time, I would travel.',
  'If I had time, I would travel',
  'Match the conditional type to the meaning: fact, real future possibility, or imagined situation.'
),
(
  'advanced',
  'advanced-conversation-practice',
  'Advanced conversation practice',
  'advanced-conversation-practice',
  'hard',
  32,
  1,
  $$Use advanced grammar naturally in nuanced conversation without sounding stiff or unclear.$$,
  $$Advanced conversation is not about using complicated grammar all the time. It is about choosing grammar that matches meaning, relationship, and context. Skilled speakers use hedging, emphasis, contrast, soft disagreement, conditionals, modal perfect forms, discourse markers, and reduced clauses to sound precise and natural. The goal is controlled flexibility: clear enough for conversation, accurate enough for serious discussion, and appropriate for the situation.$$,
  $$Hedging + claim; discourse marker + point; modal perfect for past judgement; conditional for nuance; cleft or fronting for emphasis.$$,
  $$Use these patterns when you discuss opinions, negotiate, clarify, disagree politely, reflect on past choices, add nuance, or guide a longer conversation.$$,
  $$Do not use advanced structures only to sound impressive. Avoid stacking too many complex patterns in one sentence. In casual situations, choose the simplest grammar that carries the meaning naturally.$$,
  to_jsonb(string_to_array($$I see your point, but I would frame it differently.
What I find difficult is the timing.
Had we known earlier, we could have adjusted the plan.
It might have been better to clarify the deadline first.
That said, the main issue is still quality.
If I were making the decision, I would ask for more evidence.
The proposal, while promising, needs clearer data.
To be fair, the first version was easier to follow.$$ , E'\n')),
  to_jsonb(string_to_array($$Using advanced grammar where a simple sentence is clearer.
Overusing however, therefore, and moreover in speech.
Using would have in the if-clause of a third conditional.
Sounding too direct when disagreement needs softening.
Using inversion in casual speech without a reason.
Forgetting that tone and grammar work together in conversation.$$ , E'\n')),
  to_jsonb(string_to_array($$Wrong: I disagree completely, you are wrong. | Correct: I see it differently because the data suggests another conclusion.
Wrong: If I would have known, I would have helped. | Correct: If I had known, I would have helped.
Wrong: However, therefore, moreover, I think we should wait. | Correct: That said, I think we should wait.
Wrong: What I want to say it is important. | Correct: What I want to say is important.
Wrong: It may has been a mistake. | Correct: It may have been a mistake.
Wrong: Had I knew, I would have called. | Correct: Had I known, I would have called.$$ , E'\n')),
  to_jsonb(string_to_array($$Advanced grammar should make meaning clearer, not heavier.
Hedging can make disagreement more professional.
Discourse markers help listeners follow your thinking.
Modal perfect forms are useful for past speculation and criticism.
Cleft sentences help emphasize one part of the message.$$ , E'\n')),
  to_jsonb(string_to_array($$Soften this: You are wrong.
Complete: It might ___ been better to wait.
Correct: If I would have known, I would have helped.
Add emphasis with a cleft: The timing worries me.
Choose a natural marker: That said / Moreover therefore.$$ , E'\n')),
  'It might have been better to wait.',
  'It might has been better to wait.',
  'If I would have known, I would have helped.',
  'What I want to say it is important.',
  'Complete the sentence: It might ___ been better to wait.',
  'have',
  'Complete the sentence: What I find difficult ___ the timing.',
  'is',
  'Advanced conversation grammar should support clarity and tone, not just complexity.',
  'True',
  'Correct the sentence: If I would have known, I would have helped.',
  'If I had known, I would have helped',
  'Correct the sentence: What I want to say it is important.',
  'What I want to say is important',
  'Choose grammar that matches the relationship, purpose, and level of formality.'
);

insert into public.lessons (
  topic_id,
  title,
  slug,
  difficulty,
  summary,
  explanation,
  formula,
  usage_when,
  usage_when_not,
  examples,
  common_mistakes,
  wrong_correct_examples,
  short_notes,
  mini_practice,
  lesson_order,
  estimated_minutes,
  is_published
)
select
  topics.id,
  seed.lesson_title,
  seed.lesson_slug,
  seed.difficulty,
  seed.summary,
  seed.explanation,
  seed.formula,
  seed.usage_when,
  seed.usage_when_not,
  seed.examples,
  seed.common_mistakes,
  seed.wrong_correct_examples,
  seed.short_notes,
  seed.mini_practice,
  seed.lesson_order,
  seed.estimated_minutes,
  true
from seed_lessons seed
join public.grammar_levels levels on levels.slug = seed.level_slug
join public.grammar_topics topics on topics.level_id = levels.id and topics.slug = seed.topic_slug
on conflict (topic_id, slug) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  summary = excluded.summary,
  explanation = excluded.explanation,
  formula = excluded.formula,
  usage_when = excluded.usage_when,
  usage_when_not = excluded.usage_when_not,
  examples = excluded.examples,
  common_mistakes = excluded.common_mistakes,
  wrong_correct_examples = excluded.wrong_correct_examples,
  short_notes = excluded.short_notes,
  mini_practice = excluded.mini_practice,
  lesson_order = excluded.lesson_order,
  estimated_minutes = excluded.estimated_minutes,
  is_published = true,
  updated_at = now();

drop table if exists pg_temp.seed_questions;
create temporary table seed_questions on commit drop as
select
  lessons.id as lesson_id,
  topics.id as topic_id,
  q.question_order,
  q.question_scope,
  q.difficulty,
  q.question_type,
  q.prompt,
  q.options,
  q.correct_answer,
  q.explanation,
  q.wrong_answer_explanation
from seed_lessons seed
join public.grammar_levels levels on levels.slug = seed.level_slug
join public.grammar_topics topics on topics.level_id = levels.id and topics.slug = seed.topic_slug
join public.lessons lessons on lessons.topic_id = topics.id and lessons.slug = seed.lesson_slug
cross join lateral (
  values
    (
      1,
      'practice',
      seed.difficulty,
      'multiple_choice',
      'Choose the correct sentence.',
      jsonb_build_array(seed.mc_wrong_1, seed.mc_correct, seed.mc_wrong_2, seed.mc_wrong_3),
      seed.mc_correct,
      'This sentence follows the lesson pattern: ' || seed.formula,
      seed.mistake_hint
    ),
    (
      2,
      'practice',
      seed.difficulty,
      'fill_blank',
      seed.blank_prompt,
      '[]'::jsonb,
      seed.blank_answer,
      'The answer completes the target grammar pattern in this lesson.',
      seed.mistake_hint
    ),
    (
      3,
      'practice',
      'review',
      'true_false',
      seed.tf_prompt,
      jsonb_build_array('True', 'False'),
      seed.tf_answer,
      'This checks an important rule from the lesson.',
      seed.mistake_hint
    ),
    (
      4,
      'practice',
      seed.difficulty,
      'sentence_correction',
      seed.correction_prompt,
      '[]'::jsonb,
      seed.correction_answer,
      'The corrected sentence uses the grammar rule accurately and keeps the original meaning.',
      seed.mistake_hint
    ),
    (
      5,
      'practice',
      seed.difficulty,
      'multiple_choice',
      'Which sentence is natural and grammatically correct?',
      jsonb_build_array(seed.mc_correct, seed.mc_wrong_3, seed.mc_wrong_1, seed.mc_wrong_2),
      seed.mc_correct,
      'The correct option is the only sentence that follows the lesson structure and sounds natural.',
      seed.mistake_hint
    ),
    (
      6,
      'practice',
      seed.difficulty,
      'fill_blank',
      seed.blank_prompt_two,
      '[]'::jsonb,
      seed.blank_answer_two,
      'The blank needs the grammar form required by the sentence meaning.',
      seed.mistake_hint
    ),
    (
      7,
      'practice',
      'review',
      'true_false',
      'This sentence is correct: ' || seed.mc_wrong_1,
      jsonb_build_array('True', 'False'),
      'False',
      'The sentence is a common learner mistake and should be corrected.',
      seed.mistake_hint
    ),
    (
      8,
      'practice',
      seed.difficulty,
      'sentence_correction',
      seed.correction_prompt_two,
      '[]'::jsonb,
      seed.correction_answer_two,
      'The corrected sentence removes the grammar mistake while preserving the meaning.',
      seed.mistake_hint
    )
) as q(
  question_order,
  question_scope,
  difficulty,
  question_type,
  prompt,
  options,
  correct_answer,
  explanation,
  wrong_answer_explanation
);

update public.questions existing
set
  topic_id = seed.topic_id,
  question_type = seed.question_type::public.question_type,
  difficulty = seed.difficulty,
  prompt = seed.prompt,
  options = seed.options,
  correct_answer = seed.correct_answer,
  explanation = seed.explanation,
  wrong_answer_explanation = seed.wrong_answer_explanation,
  is_published = true,
  updated_at = now()
from seed_questions seed
where existing.lesson_id = seed.lesson_id
  and existing.question_scope = seed.question_scope
  and existing.question_order = seed.question_order;

insert into public.questions (
  lesson_id,
  topic_id,
  question_type,
  difficulty,
  question_scope,
  prompt,
  options,
  correct_answer,
  explanation,
  wrong_answer_explanation,
  question_order,
  is_published
)
select
  seed.lesson_id,
  seed.topic_id,
  seed.question_type::public.question_type,
  seed.difficulty,
  seed.question_scope,
  seed.prompt,
  seed.options,
  seed.correct_answer,
  seed.explanation,
  seed.wrong_answer_explanation,
  seed.question_order,
  true
from seed_questions seed
where not exists (
  select 1
  from public.questions existing
  where existing.lesson_id = seed.lesson_id
    and existing.question_scope = seed.question_scope
    and existing.question_order = seed.question_order
);

update public.questions existing
set is_published = false,
    updated_at = now()
where existing.lesson_id in (select distinct lesson_id from seed_questions)
  and (
    existing.question_scope <> 'practice'
    or existing.question_order > 8
  );
