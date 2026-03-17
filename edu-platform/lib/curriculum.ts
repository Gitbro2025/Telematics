import { Subject } from './types'

export const curriculum: Subject[] = [
  // ─────────────────────── MATHEMATICS ───────────────────────
  {
    id: 'mathematics',
    title: 'Mathematics',
    emoji: '🔢',
    description: 'Numbers, patterns, shapes and more!',
    colorClass: 'subject-math',
    gradient: 'from-blue-500 to-purple-600',
    topics: [
      {
        id: 'whole-numbers',
        title: 'Whole Numbers',
        emoji: '🔢',
        description: 'Understanding big numbers and how to use them',
        subTopics: [
          {
            id: 'place-value',
            title: 'Place Value',
            emoji: '🏛️',
            description: 'Understanding what each digit in a number means',
            duration: 8,
            difficulty: 1,
            funFact: 'The number 1 million written out is 1 followed by 6 zeros!',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is Place Value?',
                content: 'Every digit in a number has a PLACE and a VALUE. The place tells you HOW MUCH that digit is worth. Think of it like seats in a cinema — the row you sit in matters!'
              },
              {
                type: 'visual',
                emoji: '🏛️',
                title: 'The Place Value Chart',
                content: 'Let\'s look at the number 345 678:\n\n🏛️ HUNDREDS of Thousands = 3\n🏠 TENS of Thousands = 4\n🚪 THOUSANDS = 5\n🪑 HUNDREDS = 6\n👣 TENS = 7\n1️⃣ UNITS/ONES = 8\n\nSo 345 678 = 300000 + 40000 + 5000 + 600 + 70 + 8'
              },
              {
                type: 'tip',
                emoji: '🎯',
                title: 'Memory Trick',
                content: 'Remember the order from RIGHT to LEFT:\n👆 U = Units (1s)\n👆 T = Tens (10s)\n👆 H = Hundreds (100s)\n👆 Th = Thousands (1000s)\n👆 TTh = Ten Thousands (10 000s)\n👆 HTh = Hundred Thousands (100 000s)'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Let\'s Try One!',
                content: 'What is the value of 7 in the number 472 381?\n\nStep 1: Write out the place value chart\nStep 2: Find where 7 sits: Ten Thousands place\nStep 3: The VALUE of 7 is 70 000\n\n✅ Answer: 70 000'
              }
            ],
            quiz: [
              {
                id: 'pv-q1',
                question: 'What is the value of the digit 5 in the number 253 417?',
                emoji: '🎯',
                options: ['5 000', '50 000', '500', '500 000'],
                correctIndex: 1,
                explanation: 'The 5 is in the Ten Thousands place, so its value is 50 000. Count from the right: 7=units, 1=tens, 4=hundreds, 3=thousands, 5=ten thousands!'
              },
              {
                id: 'pv-q2',
                question: 'Which number has a 9 in the hundreds place?',
                emoji: '🔍',
                options: ['9 234', '23 914', '4 982', '91 234'],
                correctIndex: 2,
                explanation: '4 982 → the digits from right are: 2(units), 8(tens), 9(hundreds), 4(thousands). So 9 is in the hundreds place! ✅'
              },
              {
                id: 'pv-q3',
                question: 'What is 3 in expanded form for the number 30 000?',
                emoji: '💭',
                options: ['3 × 100', '3 × 1000', '3 × 10 000', '3 × 100 000'],
                correctIndex: 2,
                explanation: '30 000 = 3 × 10 000. The 3 is in the Ten Thousands place!'
              }
            ]
          },
          {
            id: 'rounding',
            title: 'Rounding Numbers',
            emoji: '🎯',
            description: 'Making numbers simpler and easier to work with',
            duration: 7,
            difficulty: 1,
            funFact: 'Shops use rounding when they advertise "about R500" for something that costs R487!',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is Rounding?',
                content: 'Rounding means making a number simpler while keeping it close to the original. We round to the nearest 10, 100, 1000 etc.\n\nThink of it like this: if you\'re 3 steps from your house and 7 steps from the shop, you\'re closer to HOME! 🏠'
              },
              {
                type: 'visual',
                emoji: '📏',
                title: 'The Golden Rule',
                content: '🔢 Look at the digit to the RIGHT of where you\'re rounding.\n\n• If it\'s 0,1,2,3,4 → ROUND DOWN (keep the digit the same)\n• If it\'s 5,6,7,8,9 → ROUND UP (add 1 to the digit)\n\n🎯 Easy way to remember: "5 or more, let it soar! 4 or less, let it rest!"'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Rounding to the nearest 100',
                content: 'Round 3 456 to the nearest 100:\n\nStep 1: Find the hundreds digit → 4\nStep 2: Look at the digit to its right → 5\nStep 3: 5 or more? YES → Round UP\nStep 4: 4 becomes 5, and everything to the right becomes 0\n\n✅ Answer: 3 500'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Another Example',
                content: 'Round 7 823 to the nearest 1000:\n\nStep 1: Find the thousands digit → 7\nStep 2: Look at the digit to its right → 8\nStep 3: 8 is 5 or more? YES → Round UP\nStep 4: 7 becomes 8, rest becomes 0\n\n✅ Answer: 8 000'
              }
            ],
            quiz: [
              {
                id: 'round-q1',
                question: 'Round 4 738 to the nearest 1 000',
                emoji: '🎯',
                options: ['4 000', '5 000', '4 700', '4 800'],
                correctIndex: 1,
                explanation: 'Look at the hundreds digit: 7. Since 7 ≥ 5, round UP. 4 thousands becomes 5 thousands → 5 000 ✅'
              },
              {
                id: 'round-q2',
                question: 'Round 6 245 to the nearest 100',
                emoji: '💭',
                options: ['6 300', '6 200', '6 000', '6 250'],
                correctIndex: 1,
                explanation: 'Look at the tens digit: 4. Since 4 < 5, round DOWN. Keep 2 hundreds → 6 200 ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'fractions',
        title: 'Fractions',
        emoji: '🍕',
        description: 'Working with parts of a whole',
        subTopics: [
          {
            id: 'common-fractions',
            title: 'Common Fractions',
            emoji: '🍕',
            description: 'Understanding and comparing fractions',
            duration: 10,
            difficulty: 2,
            funFact: 'When you eat 3 slices of an 8-slice pizza, you ate 3/8 of the pizza! 🍕',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is a Fraction?',
                content: 'A fraction shows PART of a whole. It has TWO parts:\n\n🔺 NUMERATOR (top number) = how many parts you HAVE\n🔻 DENOMINATOR (bottom number) = total number of EQUAL parts\n\n📝 Think: "Down = Denominator, Num = Number you have!"'
              },
              {
                type: 'visual',
                emoji: '🍕',
                title: 'Pizza Example',
                content: 'Imagine a pizza cut into 8 equal slices:\n\n🍕🍕🍕 ← You eat 3 slices\n\nYou ate 3/8 of the pizza\n• Numerator = 3 (slices you ate)\n• Denominator = 8 (total slices)\n\n"3 out of 8 parts" = THREE EIGHTHS'
              },
              {
                type: 'text',
                emoji: '📚',
                title: 'Types of Fractions',
                content: '1️⃣ PROPER fraction: numerator < denominator\n   Example: 3/4 (less than 1 whole)\n\n2️⃣ IMPROPER fraction: numerator > denominator\n   Example: 7/4 (more than 1 whole)\n\n3️⃣ MIXED number: whole number + fraction\n   Example: 1¾ = 1 whole + 3/4'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Comparing Fractions',
                content: 'Which is bigger: 3/4 or 5/8?\n\nMethod: Make the denominators the same!\nStep 1: LCM of 4 and 8 = 8\nStep 2: 3/4 = 6/8 (multiply top and bottom by 2)\nStep 3: Compare: 6/8 vs 5/8\nStep 4: 6/8 > 5/8\n\n✅ Answer: 3/4 is bigger!'
              }
            ],
            quiz: [
              {
                id: 'frac-q1',
                question: 'What fraction of this shape is shaded if 5 out of 12 equal parts are shaded?',
                emoji: '🎨',
                options: ['5/7', '7/12', '5/12', '12/5'],
                correctIndex: 2,
                explanation: '5 parts shaded out of 12 total parts = 5/12. Shaded parts go on TOP (numerator), total parts go on BOTTOM (denominator)! ✅'
              },
              {
                id: 'frac-q2',
                question: 'Which fraction is the LARGEST?',
                emoji: '🔍',
                options: ['1/2', '3/8', '5/8', '1/4'],
                correctIndex: 2,
                explanation: 'Convert to eighths: 1/2=4/8, 3/8=3/8, 5/8=5/8, 1/4=2/8. The largest is 5/8! ✅'
              },
              {
                id: 'frac-q3',
                question: 'Convert 2¾ to an improper fraction',
                emoji: '💭',
                options: ['8/4', '9/4', '11/4', '7/4'],
                correctIndex: 2,
                explanation: '2¾: Multiply whole number by denominator: 2×4=8. Add numerator: 8+3=11. Keep denominator: 11/4 ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'patterns',
        title: 'Patterns & Sequences',
        emoji: '🔄',
        description: 'Finding rules and patterns in numbers',
        subTopics: [
          {
            id: 'number-patterns',
            title: 'Number Patterns',
            emoji: '🔄',
            description: 'Spotting rules in number sequences',
            duration: 8,
            difficulty: 1,
            funFact: 'The Fibonacci sequence (1,1,2,3,5,8,13...) appears in sunflower seeds, pinecones, and seashells! 🌻',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is a Pattern?',
                content: 'A pattern is when numbers follow a RULE. If you find the rule, you can predict what comes next!\n\nLook for: +, -, ×, ÷ between each term, or a combination.'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Finding the Rule',
                content: 'Sequence: 3, 6, 12, 24, 48, ___\n\nStep 1: What changes? 3→6 (+3? or ×2?)\nStep 2: Check: 6→12 (+6? or ×2?)\nStep 3: Check: 12→24 (×2 ✓)\nStep 4: Rule is ×2 each time\nStep 5: Next term: 48 × 2 = 96\n\n✅ Answer: 96'
              },
              {
                type: 'tip',
                emoji: '🎯',
                title: 'Pro Tip',
                content: 'Always CHECK your rule on ALL terms, not just the first two!\n\nIf the numbers grow slowly → likely adding (+)\nIf the numbers grow fast → likely multiplying (×)\nIf numbers decrease → subtracting (-) or dividing (÷)'
              }
            ],
            quiz: [
              {
                id: 'pat-q1',
                question: 'What is the NEXT number in the pattern: 2, 5, 11, 23, 47, ___?',
                emoji: '🔢',
                options: ['71', '94', '95', '96'],
                correctIndex: 2,
                explanation: 'Rule: multiply by 2 then add 1! Check: 2×2+1=5 ✓, 5×2+1=11 ✓, 11×2+1=23 ✓. So 47×2+1 = 95 ✅'
              },
              {
                id: 'pat-q2',
                question: 'What is the 5th term in the pattern that starts 100, 90, 80, 70, ___?',
                emoji: '💭',
                options: ['50', '60', '65', '55'],
                correctIndex: 1,
                explanation: 'The rule is -10 each time. 100, 90, 80, 70, 60. The 5th term is 60! ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'measurement',
        title: 'Measurement',
        emoji: '📏',
        description: 'Perimeter, area, volume and more',
        subTopics: [
          {
            id: 'perimeter-area',
            title: 'Perimeter & Area',
            emoji: '📐',
            description: 'Measuring the edges and surface of shapes',
            duration: 10,
            difficulty: 2,
            funFact: 'Farmers use perimeter to know how much fencing to buy, and area to know how much seed to plant! 🌾',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Perimeter vs Area',
                content: '📏 PERIMETER = the distance AROUND the outside of a shape (like a fence)\n📦 AREA = the space INSIDE a shape (like carpet on a floor)\n\n🎯 Memory trick:\n• "Peri" means "around" (like periscope looks around)\n• Area = "a" as in the amount of space'
              },
              {
                type: 'visual',
                emoji: '🏠',
                title: 'Formulas',
                content: 'RECTANGLE:\n📏 Perimeter = 2 × (length + width)\n📦 Area = length × width\n\nSQUARE:\n📏 Perimeter = 4 × side\n📦 Area = side × side\n\nTRIANGLE:\n📏 Perimeter = side + side + side\n📦 Area = ½ × base × height'
              },
              {
                type: 'example',
                emoji: '✏️',
                title: 'Worked Example',
                content: 'A garden is 8m long and 5m wide. Find:\na) Perimeter\nb) Area\n\na) P = 2 × (8 + 5) = 2 × 13 = 26m\n\nb) A = 8 × 5 = 40m²\n\n💡 Note: Perimeter uses "m", Area uses "m²" (square metres)!'
              }
            ],
            quiz: [
              {
                id: 'meas-q1',
                question: 'A square room has sides of 6m. What is the area of the room?',
                emoji: '🏠',
                options: ['24m²', '36m²', '12m²', '36m'],
                correctIndex: 1,
                explanation: 'Area of square = side × side = 6 × 6 = 36m². Don\'t forget the square (²) for area! ✅'
              },
              {
                id: 'meas-q2',
                question: 'A rectangle is 12cm long and 4cm wide. What is its perimeter?',
                emoji: '📏',
                options: ['48cm', '32cm', '16cm', '48cm²'],
                correctIndex: 1,
                explanation: 'P = 2 × (l + w) = 2 × (12 + 4) = 2 × 16 = 32cm. Remember: perimeter is just cm, not cm²! ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── ENGLISH ───────────────────────
  {
    id: 'english',
    title: 'English',
    emoji: '📖',
    description: 'Reading, writing, speaking and listening',
    colorClass: 'subject-english',
    gradient: 'from-pink-500 to-red-500',
    topics: [
      {
        id: 'reading-comprehension',
        title: 'Reading & Comprehension',
        emoji: '📖',
        description: 'Understanding what you read',
        subTopics: [
          {
            id: 'reading-strategies',
            title: 'Reading Strategies',
            emoji: '🔍',
            description: 'Tricks to understand any text better',
            duration: 8,
            difficulty: 1,
            funFact: 'Speed readers can read up to 1000 words per minute! The average person reads about 200-300 words per minute.',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'The STOP Strategy',
                content: 'Before reading:\n🔭 SCAN the text (look at headings, pictures, bold words)\n👁️ THINK about what you already know\n🎯 ORGANISE your thoughts\n❓ PREDICT what the text might be about'
              },
              {
                type: 'text',
                emoji: '📝',
                title: '5 Reading Strategies',
                content: '1. 🔍 SKIM - read quickly to get the main idea\n2. 🔎 SCAN - look for specific information\n3. ❓ QUESTION - ask "who, what, where, when, why, how"\n4. 🗺️ VISUALISE - make a picture in your mind\n5. 🔗 CONNECT - link to your own experiences'
              },
              {
                type: 'tip',
                emoji: '🎯',
                title: 'Answering Comprehension Questions',
                content: '📍 Read the QUESTION first, then find the answer\n📝 Quote from the text when possible\n🔢 For "list" questions, count how many are needed\n💬 For "explain" questions, use YOUR OWN words\n🎯 For "opinion" questions, give reasons!'
              }
            ],
            quiz: [
              {
                id: 'read-q1',
                question: 'What does "scanning" a text mean?',
                emoji: '🔍',
                options: [
                  'Reading every word carefully',
                  'Looking quickly for specific information',
                  'Making pictures in your mind',
                  'Reading the text out loud'
                ],
                correctIndex: 1,
                explanation: 'Scanning means moving your eyes quickly over the text to find a SPECIFIC piece of information — like scanning a menu for your favourite food! ✅'
              },
              {
                id: 'read-q2',
                question: 'The word "INFER" means:',
                emoji: '💭',
                options: [
                  'Copy the exact words from the text',
                  'Read the text aloud',
                  'Work out meaning from clues in the text',
                  'Skip the hard parts'
                ],
                correctIndex: 2,
                explanation: 'To infer means to work out something that isn\'t directly stated — using CLUES in the text. Like being a detective! 🕵️ ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'language-structures',
        title: 'Language Structures',
        emoji: '🔤',
        description: 'Grammar, punctuation and vocabulary',
        subTopics: [
          {
            id: 'nouns-pronouns',
            title: 'Nouns & Pronouns',
            emoji: '👤',
            description: 'Names for people, places and things',
            duration: 7,
            difficulty: 1,
            funFact: 'There are over 171,000 words in the English language! You use about 20,000 of them every day.',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is a Noun?',
                content: 'A noun is a NAMING word. It names:\n👤 People: teacher, boy, doctor, Maria\n🌍 Places: school, Cape Town, park, ocean\n🎁 Things: book, table, cloud, happiness\n💭 Ideas: love, courage, freedom, mathematics'
              },
              {
                type: 'text',
                emoji: '📝',
                title: 'Types of Nouns',
                content: '🏷️ COMMON noun: general names (dog, city, person)\n🌟 PROPER noun: specific names, ALWAYS capital letter (Buddy, Cape Town, Ms Smith)\n📦 COLLECTIVE noun: group names (a pride of lions, a flock of birds, a team of players)\n💭 ABSTRACT noun: things you can\'t touch (happiness, anger, beauty)'
              },
              {
                type: 'visual',
                emoji: '🔄',
                title: 'Pronouns Replace Nouns',
                content: 'Instead of repeating a noun, we use a PRONOUN:\n\n❌ "John ate John\'s sandwich because John was hungry."\n✅ "John ate HIS sandwich because HE was hungry."\n\n📋 Common pronouns:\n• I, me, my, mine\n• you, your, yours\n• he, him, his / she, her, hers\n• it, its\n• we, us, our / they, them, their'
              }
            ],
            quiz: [
              {
                id: 'noun-q1',
                question: 'Which sentence contains a PROPER noun?',
                emoji: '🔍',
                options: [
                  'The dog ran across the park.',
                  'She ate her lunch quickly.',
                  'Thabo went to Cape Town last summer.',
                  'The teacher was very kind.'
                ],
                correctIndex: 2,
                explanation: '"Thabo" (a specific person\'s name) and "Cape Town" (a specific city) are both PROPER nouns — they always need capital letters! ✅'
              },
              {
                id: 'noun-q2',
                question: '"A _______ of fish" — what is the collective noun?',
                emoji: '🐟',
                options: ['pack', 'shoal', 'herd', 'flock'],
                correctIndex: 1,
                explanation: 'A SHOAL of fish! Other collective nouns: a HERD of cattle, a PACK of wolves, a FLOCK of birds. ✅'
              }
            ]
          },
          {
            id: 'punctuation',
            title: 'Punctuation',
            emoji: '✒️',
            description: 'Marks that make writing clear',
            duration: 8,
            difficulty: 2,
            funFact: '"Eats, shoots and leaves" vs "Eats shoots and leaves" — one comma changes a panda into a murderer! 🐼',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Why Does Punctuation Matter?',
                content: 'Punctuation tells the reader HOW to read your writing — where to pause, stop, or change tone.\n\n"Let\'s eat Grandma!" 😱\nvs\n"Let\'s eat, Grandma!" 😊\n\nThat comma just saved Grandma\'s life!'
              },
              {
                type: 'visual',
                emoji: '✒️',
                title: 'Key Punctuation Marks',
                content: '. FULL STOP — ends a sentence\n, COMMA — short pause, separates items\n? QUESTION MARK — ends a question\n! EXCLAMATION MARK — shows strong feeling\n" " SPEECH MARKS — shows what someone says\n\' APOSTROPHE — shows ownership (Tom\'s) or contraction (don\'t)\n: COLON — introduces a list or explanation\n; SEMICOLON — joins related sentences'
              }
            ],
            quiz: [
              {
                id: 'punc-q1',
                question: 'Which sentence is correctly punctuated?',
                emoji: '✒️',
                options: [
                  "I love cats dogs and fish",
                  "I love cats, dogs and fish.",
                  "I love, cats, dogs, and, fish.",
                  "i love cats dogs and fish."
                ],
                correctIndex: 1,
                explanation: 'Commas separate items in a list. "I love cats, dogs and fish." — note: no comma before "and" in standard English, and capital "I" at the start! ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'creative-writing',
        title: 'Creative Writing',
        emoji: '✍️',
        description: 'Telling amazing stories with words',
        subTopics: [
          {
            id: 'story-structure',
            title: 'Story Structure',
            emoji: '📚',
            description: 'How to build a great story',
            duration: 10,
            difficulty: 2,
            funFact: 'The world\'s longest novel is "In Search of Lost Time" by Marcel Proust — it has over 1.5 million words!',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Every Story Needs These Parts',
                content: 'Think of a story like a MOUNTAIN:\n\n🏔️ EXPOSITION (beginning) — introduce characters, setting\n⬆️ RISING ACTION — the problem builds up\n🌋 CLIMAX — the most exciting part!\n⬇️ FALLING ACTION — things start to resolve\n🌅 RESOLUTION (ending) — how things ended up'
              },
              {
                type: 'tip',
                emoji: '🎯',
                title: 'The 5 W\'s of Story Writing',
                content: '👤 WHO — your characters\n🌍 WHERE — the setting\n⏰ WHEN — the time period\n🎭 WHAT — what happens\n❓ WHY — why it matters\n\nAnswer these and your story will have a strong foundation!'
              },
              {
                type: 'visual',
                emoji: '🌟',
                title: 'Show, Don\'t Tell',
                content: '❌ TELLING: "She was scared."\n✅ SHOWING: "Her hands trembled. She backed slowly against the wall, her heart hammering in her chest."\n\nDescribe what you can SEE, HEAR, SMELL, TASTE, TOUCH to make your writing come ALIVE!'
              }
            ],
            quiz: [
              {
                id: 'write-q1',
                question: 'In story structure, what is the CLIMAX?',
                emoji: '🌋',
                options: [
                  'The beginning where you meet the characters',
                  'The most exciting/tense part of the story',
                  'How the story ends',
                  'When the characters are introduced'
                ],
                correctIndex: 1,
                explanation: 'The climax is the PEAK of the story — the most exciting, tense, or important moment. It\'s when the main conflict comes to a head! 🌋 ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── NATURAL SCIENCES ───────────────────────
  {
    id: 'natural-sciences',
    title: 'Natural Sciences',
    emoji: '🔬',
    description: 'Discover how the world around us works',
    colorClass: 'subject-science',
    gradient: 'from-green-400 to-teal-500',
    topics: [
      {
        id: 'life-living',
        title: 'Life and Living',
        emoji: '🌿',
        description: 'Plants, animals and ecosystems',
        subTopics: [
          {
            id: 'ecosystems',
            title: 'Ecosystems',
            emoji: '🌍',
            description: 'How living things interact with their environment',
            duration: 10,
            difficulty: 2,
            funFact: 'A single teaspoon of healthy garden soil contains more living organisms than there are people on Earth! 🌱',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is an Ecosystem?',
                content: 'An ECOSYSTEM is all the living things (plants, animals, microbes) AND non-living things (water, soil, air, sunlight) in an area, working together.\n\n🌳 + 🐦 + 🐛 + 💧 + ☀️ + 🪨 = ECOSYSTEM!'
              },
              {
                type: 'visual',
                emoji: '🍽️',
                title: 'Food Chains',
                content: 'Energy passes from one living thing to another through FOOD CHAINS:\n\n☀️ Sun → 🌿 Grass → 🦓 Zebra → 🦁 Lion\n\nProducers: Plants that MAKE food using sunlight\nConsumers: Animals that EAT other organisms\n• 1st consumers: eat plants (herbivores)\n• 2nd consumers: eat herbivores (carnivores)\nDecomposers: Break down dead matter (bacteria, fungi)'
              },
              {
                type: 'example',
                emoji: '🌍',
                title: 'South African Biomes',
                content: 'SA has some amazing ecosystems:\n🌿 Fynbos (Cape) — most unique plant kingdom on Earth!\n🌵 Karoo — semi-desert with amazing succulents\n🌳 Bushveld (Savanna) — home to the Big 5\n🌊 Marine — great white sharks, whales, penguins!\n🌾 Grassland (Highveld) — where most people live'
              }
            ],
            quiz: [
              {
                id: 'eco-q1',
                question: 'In the food chain Sun → Grass → Rabbit → Fox, what is the RABBIT?',
                emoji: '🐰',
                options: ['A producer', 'A 1st order consumer', 'A 2nd order consumer', 'A decomposer'],
                correctIndex: 1,
                explanation: 'The rabbit eats grass (a plant/producer), making it a 1ST ORDER CONSUMER (primary consumer). The fox eats the rabbit, so the fox is a 2nd order consumer! ✅'
              },
              {
                id: 'eco-q2',
                question: 'Which of these is a PRODUCER in a food chain?',
                emoji: '🌿',
                options: ['Lion', 'Zebra', 'Grass', 'Vulture'],
                correctIndex: 2,
                explanation: 'GRASS is a producer — it makes its own food using sunlight through photosynthesis. Animals are consumers (they eat other things). ✅'
              }
            ]
          },
          {
            id: 'photosynthesis',
            title: 'Photosynthesis',
            emoji: '🌱',
            description: 'How plants make their own food',
            duration: 8,
            difficulty: 2,
            funFact: 'Plants were the first "solar panels" — they\'ve been converting sunlight to energy for 3 billion years! ☀️',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'The Recipe for Plant Food',
                content: 'Plants are AMAZING — they make their own food!\n\nINGREDIENTS:\n☀️ Sunlight (energy)\n💧 Water (from roots)\n💨 Carbon dioxide (from air through leaves)\n\nOUTPUT:\n🍬 Glucose (sugar = food for the plant)\n🌬️ Oxygen (released into air for us to breathe!)'
              },
              {
                type: 'visual',
                emoji: '🔬',
                title: 'The Formula',
                content: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nIn simple words:\nCarbon Dioxide + Water + Sunlight → Glucose + Oxygen\n\n🍃 This happens in the CHLOROPLASTS of leaves\n🟢 The green pigment CHLOROPHYLL captures sunlight\n🕳️ CO₂ enters through tiny pores called STOMATA'
              }
            ],
            quiz: [
              {
                id: 'photo-q1',
                question: 'What gas do plants RELEASE during photosynthesis?',
                emoji: '🌬️',
                options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
                correctIndex: 2,
                explanation: 'Plants release OXYGEN during photosynthesis — this is the oxygen we breathe! They absorb carbon dioxide and release oxygen. ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'matter-materials',
        title: 'Matter & Materials',
        emoji: '⚗️',
        description: 'What everything is made of',
        subTopics: [
          {
            id: 'states-of-matter',
            title: 'States of Matter',
            emoji: '🧊',
            description: 'Solids, liquids and gases',
            duration: 9,
            difficulty: 1,
            funFact: 'Plasma is the 4th state of matter — lightning and the sun are made of plasma! ⚡',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'The 3 States of Matter',
                content: '🧊 SOLID — definite shape and volume\n   (ice, rock, wood, your desk)\n\n💧 LIQUID — definite volume, no definite shape\n   (water, juice, blood, lava)\n\n💨 GAS — no definite shape or volume\n   (air, steam, oxygen, smoke)'
              },
              {
                type: 'visual',
                emoji: '🔬',
                title: 'What Happens to Particles',
                content: 'SOLID 🧊: Particles packed TIGHTLY together, vibrate in place\nLIQUID 💧: Particles CLOSE but can move past each other\nGAS 💨: Particles FAR APART and move FREELY in all directions\n\nHeat gives particles more energy to move!'
              },
              {
                type: 'example',
                emoji: '🌊',
                title: 'Water in All 3 States',
                content: 'Water is the perfect example:\n🧊 Ice = SOLID (water below 0°C)\n💧 Water = LIQUID (0°C to 100°C)\n💨 Steam = GAS (above 100°C)\n\nChanges:\n• Melting: solid → liquid\n• Freezing: liquid → solid\n• Evaporation: liquid → gas\n• Condensation: gas → liquid'
              }
            ],
            quiz: [
              {
                id: 'matter-q1',
                question: 'What happens to particles in a GAS compared to a SOLID?',
                emoji: '💨',
                options: [
                  'They are closer together',
                  'They are far apart and move freely',
                  'They are packed tightly and don\'t move',
                  'They are the same distance apart'
                ],
                correctIndex: 1,
                explanation: 'In a gas, particles are FAR APART and move FREELY in all directions. This is why gases spread out to fill any container! ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'energy-change',
        title: 'Energy & Change',
        emoji: '⚡',
        description: 'Electricity, light, sound and heat',
        subTopics: [
          {
            id: 'electricity',
            title: 'Electricity',
            emoji: '⚡',
            description: 'How electricity works and flows',
            duration: 10,
            difficulty: 2,
            funFact: 'Lightning travels at 270,000 km/h — that\'s fast enough to go around the Earth 7 times in ONE SECOND! ⚡',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What is Electricity?',
                content: 'Electricity is the flow of ELECTRONS (tiny negative particles) through a conductor (like copper wire).\n\nThink of it like water flowing through pipes:\n🔋 Battery = pump (pushes the current)\n🔌 Wire = pipe (carries the current)\n💡 Bulb = wheel (uses the energy)'
              },
              {
                type: 'visual',
                emoji: '🔌',
                title: 'Series vs Parallel Circuits',
                content: '🔗 SERIES circuit: components in ONE loop\n• Remove one bulb → all bulbs go out\n• Like old Christmas lights!\n\n⚡ PARALLEL circuit: each component has its OWN loop\n• Remove one bulb → others stay on\n• This is how home wiring works!\n\nSouth Africa uses 220-240V AC electricity'
              }
            ],
            quiz: [
              {
                id: 'elec-q1',
                question: 'In a SERIES circuit with 3 bulbs, what happens if one bulb breaks?',
                emoji: '💡',
                options: [
                  'Only that bulb goes out',
                  'The other 2 bulbs get brighter',
                  'All bulbs go out',
                  'Nothing changes'
                ],
                correctIndex: 2,
                explanation: 'In a series circuit there is only ONE path for current to flow. If one bulb breaks (opens the circuit), ALL the bulbs go out! ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── SOCIAL SCIENCES ───────────────────────
  {
    id: 'social-sciences',
    title: 'Social Sciences',
    emoji: '🌍',
    description: 'History, Geography and how people live',
    colorClass: 'subject-social',
    gradient: 'from-orange-400 to-yellow-400',
    topics: [
      {
        id: 'geography',
        title: 'Geography',
        emoji: '🗺️',
        description: 'Maps, climate and our world',
        subTopics: [
          {
            id: 'maps-skills',
            title: 'Map Skills',
            emoji: '🗺️',
            description: 'Reading and understanding maps',
            duration: 9,
            difficulty: 2,
            funFact: 'The first known map was made in Babylon (Iraq) about 2600 years ago — on a clay tablet! 🗺️',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'MAP = a drawing of an area from above',
                content: 'A map is a BIRD\'S EYE VIEW of a place. Maps have special tools to help you use them:\n\n🧭 COMPASS ROSE — shows directions (N, S, E, W)\n📏 SCALE — shows real distance (e.g. 1cm = 10km)\n🎨 KEY/LEGEND — explains symbols and colours\n📍 GRID — helps locate places'
              },
              {
                type: 'visual',
                emoji: '🧭',
                title: 'Cardinal & Intercardinal Directions',
                content: 'CARDINAL: North (N), South (S), East (E), West (W)\nINTERCARDINAL: NE, NW, SE, SW\n\n🧭 Memory trick for N-E-S-W (clockwise):\n"Never Eat Soggy Waffles!"\n\n🌅 The sun rises in the EAST and sets in the WEST\n☀️ At noon, the sun is in the NORTH (Southern Hemisphere)'
              },
              {
                type: 'example',
                emoji: '📏',
                title: 'Using Scale',
                content: 'Map scale: 1cm = 50 km\n\nIf two cities are 4cm apart on the map:\nReal distance = 4cm × 50 km = 200 km\n\n🚗 At 100 km/h, that would take 2 hours to drive!'
              }
            ],
            quiz: [
              {
                id: 'map-q1',
                question: 'What does the KEY (legend) on a map tell you?',
                emoji: '🗺️',
                options: [
                  'The distance between cities',
                  'What the symbols and colours mean',
                  'Which direction is North',
                  'The height of mountains'
                ],
                correctIndex: 1,
                explanation: 'The KEY or LEGEND explains what all the symbols and colours on the map represent — without it, you can\'t understand the map! ✅'
              }
            ]
          },
          {
            id: 'south-africa-geography',
            title: 'South Africa\'s Geography',
            emoji: '🇿🇦',
            description: 'The physical features of our country',
            duration: 10,
            difficulty: 2,
            funFact: 'South Africa is the ONLY country in the world with three capital cities: Pretoria (admin), Cape Town (legislative), and Bloemfontein (judicial)! 🏛️',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '🇿🇦',
                title: 'South Africa\'s Provinces',
                content: 'SA has 9 provinces:\n1. Western Cape 🍇 (Cape Town)\n2. Eastern Cape 🐘 (Gqeberha)\n3. Northern Cape 💎 (Kimberley)\n4. KwaZulu-Natal 🌊 (Durban, Pietermaritzburg)\n5. Free State 🌾 (Bloemfontein)\n6. Gauteng 🏙️ (Johannesburg, Pretoria)\n7. North West 🌻 (Mahikeng)\n8. Limpopo 🦒 (Polokwane)\n9. Mpumalanga 🌅 (Mbombela)'
              },
              {
                type: 'visual',
                emoji: '⛰️',
                title: 'Physical Features',
                content: '🏔️ Drakensberg Mountains: highest range in SA\n🌊 Indian Ocean: east coast (warm Mozambique current)\n🌊 Atlantic Ocean: west coast (cold Benguela current)\n🏜️ Kalahari Desert: north-west SA\n🌿 Cape Fold Mountains: Western Cape\n🌳 Highveld: central plateau where most people live'
              }
            ],
            quiz: [
              {
                id: 'sa-q1',
                question: 'Which ocean is on the EAST coast of South Africa?',
                emoji: '🌊',
                options: ['Atlantic Ocean', 'Pacific Ocean', 'Indian Ocean', 'Arctic Ocean'],
                correctIndex: 2,
                explanation: 'The INDIAN OCEAN is on South Africa\'s east coast (warm water from Mozambique). The ATLANTIC OCEAN is on the west coast (cold Benguela Current). ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'history',
        title: 'History',
        emoji: '📜',
        description: 'Stories from our past',
        subTopics: [
          {
            id: 'sa-history',
            title: 'South African History',
            emoji: '🇿🇦',
            description: 'The story of our rainbow nation',
            duration: 12,
            difficulty: 2,
            funFact: 'South Africa is called the "Rainbow Nation" — a term first used by Archbishop Desmond Tutu to describe our multicultural nation! 🌈',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Key Events in SA History',
                content: '🌍 First peoples: San and Khoikhoi lived here for thousands of years\n⛵ 1488: Bartolomeu Dias rounds the Cape\n⚓ 1652: Jan van Riebeeck arrives at the Cape (VOC)\n💎 1867: Diamonds discovered in Kimberley\n⚡ 1886: Gold discovered on Witwatersrand\n🏛️ 1910: Union of South Africa formed'
              },
              {
                type: 'text',
                emoji: '📜',
                title: 'Apartheid & Democracy',
                content: '📌 1948: National Party wins election — APARTHEID begins\n🚫 Apartheid = "apartness" — racial segregation enforced by law\n✊ ANC, PAC fight against apartheid\n🔒 1964: Nelson Mandela jailed on Robben Island\n🗳️ 1990: Mandela released from prison\n🌈 1994: First democratic elections — Mandela becomes president\n🕊️ South Africa becomes a democracy!'
              },
              {
                type: 'visual',
                emoji: '🏛️',
                title: 'Our Constitution',
                content: 'South Africa\'s CONSTITUTION (1996) is one of the most progressive in the world!\n\nIt protects:\n✅ Equality\n✅ Dignity\n✅ Freedom of speech\n✅ Education\n✅ Healthcare\n✅ Housing\n✅ Clean environment\n\n"Never, never, and never again shall this beautiful land experience the oppression of one by another." — Nelson Mandela'
              }
            ],
            quiz: [
              {
                id: 'hist-q1',
                question: 'In what year did South Africa have its first democratic elections?',
                emoji: '🗳️',
                options: ['1990', '1992', '1994', '1996'],
                correctIndex: 2,
                explanation: '1994 was the year of South Africa\'s first democratic elections where ALL citizens could vote. Nelson Mandela became the first democratically elected president! ✅'
              },
              {
                id: 'hist-q2',
                question: 'What does APARTHEID mean?',
                emoji: '📜',
                options: [
                  'Freedom and democracy',
                  'Racial segregation / "apartness"',
                  'Unity of all peoples',
                  'Economic development'
                ],
                correctIndex: 1,
                explanation: 'APARTHEID is an Afrikaans word meaning "apartness" or "separation". It was a system of racial segregation enforced in South Africa from 1948 to 1994. ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── LIFE ORIENTATION ───────────────────────
  {
    id: 'life-orientation',
    title: 'Life Orientation',
    emoji: '🌟',
    description: 'Life skills, health and personal development',
    colorClass: 'subject-lo',
    gradient: 'from-purple-400 to-pink-400',
    topics: [
      {
        id: 'personal-development',
        title: 'Personal Development',
        emoji: '🌱',
        description: 'Growing into the best version of yourself',
        subTopics: [
          {
            id: 'emotions-wellbeing',
            title: 'Emotions & Wellbeing',
            emoji: '😊',
            description: 'Understanding and managing your feelings',
            duration: 8,
            difficulty: 1,
            funFact: 'Scientists have found that smiling — even fake smiling — can actually make you feel happier! Your brain reads your facial muscles! 😊',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'What are Emotions?',
                content: 'Emotions are FEELINGS that come from your thoughts and experiences. ALL emotions are NORMAL and OK — even sad, angry, or scared.\n\n🎭 Basic emotions: Happy, Sad, Angry, Scared, Surprised, Disgusted, Excited\n\nYou can\'t always control what you feel, but you CAN learn to manage how you respond!'
              },
              {
                type: 'tip',
                emoji: '🎯',
                title: 'The STOP Technique',
                content: 'When you\'re overwhelmed or upset:\n\n🛑 STOP what you\'re doing\n💨 TAKE 3 deep breaths (belly breathing)\n👀 OBSERVE — what are you feeling? Why?\n🔄 PROCEED — choose how to respond\n\n🧠 Deep breathing activates your "calm system" (parasympathetic nervous system)!'
              },
              {
                type: 'text',
                emoji: '🌈',
                title: 'Building Resilience',
                content: '🌊 Resilience = bouncing back from difficulties\n\n5 Ways to Build Resilience:\n1. 💬 Talk to someone you trust\n2. 📓 Journal your feelings\n3. 🏃 Exercise and move your body\n4. 😴 Get enough sleep (10 hours for Grade 6!)\n5. 🎯 Focus on what you CAN control\n\nRemember: It\'s OK to ask for help!'
              }
            ],
            quiz: [
              {
                id: 'emo-q1',
                question: 'What does RESILIENCE mean?',
                emoji: '💪',
                options: [
                  'Never feeling sad or upset',
                  'Being stronger than everyone else',
                  'Bouncing back from difficult situations',
                  'Ignoring your feelings'
                ],
                correctIndex: 2,
                explanation: 'Resilience means the ability to BOUNCE BACK from setbacks and challenges. It\'s not about never struggling — it\'s about getting back up! 💪 ✅'
              }
            ]
          }
        ]
      },
      {
        id: 'health-hygiene',
        title: 'Health & Hygiene',
        emoji: '🧼',
        description: 'Taking care of your body',
        subTopics: [
          {
            id: 'healthy-lifestyle',
            title: 'Healthy Lifestyle',
            emoji: '🥦',
            description: 'Food, exercise and sleep for a healthy body',
            duration: 7,
            difficulty: 1,
            funFact: 'Your body replaces most of its cells every 7-10 years. You\'re literally not the same person you were a decade ago! 🔬',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'The Health Triangle',
                content: 'Good health has THREE sides:\n\n🏃 PHYSICAL health — exercise, nutrition, sleep, hygiene\n🧠 MENTAL health — managing stress, positive thinking\n👥 SOCIAL health — good relationships, communication\n\nAll three sides need to be strong for overall wellbeing!'
              },
              {
                type: 'visual',
                emoji: '🍽️',
                title: 'The Food Groups',
                content: 'SA uses the "Food Based Dietary Guidelines":\n\n🍚 Starchy foods (energy): rice, bread, potatoes, maize\n🥩 Proteins (building blocks): meat, eggs, beans, fish\n🥦 Vegetables and fruit (vitamins): as many colours as possible!\n🥛 Dairy (bones & teeth): milk, cheese, yoghurt\n💧 Water: 6-8 glasses per day!\n\nLimit: sugar, salt, and processed foods'
              }
            ],
            quiz: [
              {
                id: 'health-q1',
                question: 'How many hours of sleep does a Grade 6 learner need each night?',
                emoji: '😴',
                options: ['6-7 hours', '7-8 hours', '9-11 hours', '12-14 hours'],
                correctIndex: 2,
                explanation: 'Children aged 6-12 need 9-11 hours of sleep per night. Good sleep helps with memory, mood, growth and concentration! 😴 ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── EMS ───────────────────────
  {
    id: 'ems',
    title: 'Econ. & Management Sciences',
    emoji: '💰',
    description: 'Money, business and how the economy works',
    colorClass: 'subject-ems',
    gradient: 'from-yellow-400 to-orange-400',
    topics: [
      {
        id: 'economy',
        title: 'Economy & Finance',
        emoji: '💰',
        description: 'Understanding money and how it works',
        subTopics: [
          {
            id: 'needs-wants',
            title: 'Needs vs Wants',
            emoji: '🛒',
            description: 'Understanding what we must have vs what we\'d like',
            duration: 7,
            difficulty: 1,
            funFact: 'The average South African spends about 40% of their income on housing and 20% on food!',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Needs vs Wants',
                content: '🍕 NEEDS = things you MUST HAVE to survive\n• Food, water, shelter, clothing, healthcare, education\n\n🎮 WANTS = things you WOULD LIKE but don\'t need to survive\n• Games, toys, luxury food, new gadgets, brand clothes\n\n🎯 Key question: "Would I suffer WITHOUT it?" → YES = need, NO = want'
              },
              {
                type: 'text',
                emoji: '🏦',
                title: 'Scarcity & Choice',
                content: 'SCARCITY means there is not enough for everyone to have everything they want.\n\nBecause of scarcity, we have to CHOOSE:\n• If you spend R100 on a game (want), you can\'t spend it on books\n• This is called OPPORTUNITY COST — what you give up when you choose\n\n📊 Economists say: "There is no such thing as a free lunch!"'
              },
              {
                type: 'example',
                emoji: '💰',
                title: 'Making a Budget',
                content: 'You get R200 pocket money per month:\n\nNEEDS (must pay):\n🚌 Bus fare: R80\n🍎 Lunch x5 days: R50\n\nTotal needs: R130\nRemaining: R200 - R130 = R70\n\nWANTS (optional):\n🎮 Game: R60\n🍦 Ice cream: R20\nTotal wants: R80\n\nUh oh! You can\'t afford all your wants!\nChoose: game (R60) + OR ice cream (R20) twice'
              }
            ],
            quiz: [
              {
                id: 'ems-q1',
                question: 'Which of these is a NEED?',
                emoji: '🛒',
                options: ['A new PlayStation', 'Clean drinking water', 'Designer sneakers', 'A holiday trip'],
                correctIndex: 1,
                explanation: 'Clean drinking water is a NEED — you cannot survive without it! A PlayStation, designer sneakers, and holidays are WANTS (nice to have, but not essential for survival). ✅'
              },
              {
                id: 'ems-q2',
                question: 'What is OPPORTUNITY COST?',
                emoji: '💭',
                options: [
                  'The price you pay for something',
                  'The cost of going to a school',
                  'What you give up when you make a choice',
                  'The amount of money you save'
                ],
                correctIndex: 2,
                explanation: 'Opportunity cost is what you GIVE UP when you choose one thing over another. If you choose to buy a book, the opportunity cost is the game you could have bought instead! ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── AFRIKAANS ───────────────────────
  {
    id: 'afrikaans',
    title: 'Afrikaans',
    emoji: '🌺',
    description: 'Afrikaans taal — lees, skryf en praat',
    colorClass: 'subject-afrikaans',
    gradient: 'from-cyan-400 to-blue-400',
    topics: [
      {
        id: 'taal',
        title: 'Taalstruktuur',
        emoji: '🔤',
        description: 'Grammatika en taalreëls',
        subTopics: [
          {
            id: 'selfstandige-naamwoorde',
            title: 'Selfstandige Naamwoorde',
            emoji: '📝',
            description: 'Soorte en gebruike van naamwoorde in Afrikaans',
            duration: 8,
            difficulty: 2,
            funFact: 'Afrikaans developed from 17th century Dutch and is the youngest major language in the world — only about 350 years old! 🌺',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: 'Selfstandige Naamwoorde',
                content: '\'n Selfstandige naamwoord is \'n BENAMINGSWOORD.\n\nDit benoem:\n👤 Mense: onderwyser, seun, dokter\n🏙️ Plekke: skool, Kaapstad, park\n🎁 Dinge: boek, tafel, stoel\n💭 Idees: vreugde, vryheid, liefde'
              },
              {
                type: 'text',
                emoji: '📚',
                title: 'Enkelvoud en Meervoud',
                content: 'ENKELVOUD (1): hond, kat, boom, kind\nMEERVOUD (meer as 1):\n\nReël 1: voeg -e by\n   boom → bome, jaar → jare\n\nReël 2: voeg -s by (na klinkers)\n   skole → skoles (FOUT!)\n   seun → seuns ✓\n\nReël 3: onreëlmatig\n   kind → kinders\n   man → manne'
              }
            ],
            quiz: [
              {
                id: 'afr-q1',
                question: 'Wat is die meervoud van "boom"?',
                emoji: '🌳',
                options: ['booms', 'bome', 'boome', 'boomse'],
                correctIndex: 1,
                explanation: 'Die meervoud van "boom" is "bome". Ons voeg -e by en die dubbel-o word \'n enkel-o voor die -e. ✅'
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────── CREATIVE ARTS ───────────────────────
  {
    id: 'creative-arts',
    title: 'Creative Arts',
    emoji: '🎨',
    description: 'Art, drama, music and dance',
    colorClass: 'subject-creative',
    gradient: 'from-pink-400 to-rose-300',
    topics: [
      {
        id: 'visual-arts',
        title: 'Visual Arts',
        emoji: '🎨',
        description: 'Drawing, painting and creating',
        subTopics: [
          {
            id: 'elements-of-art',
            title: 'Elements of Art',
            emoji: '🖌️',
            description: 'The building blocks of visual art',
            duration: 8,
            difficulty: 1,
            funFact: 'The Mona Lisa has no eyebrows or eyelashes! Leonardo da Vinci painted her that way on purpose — or they faded over 500 years! 🖼️',
            contentBlocks: [
              {
                type: 'keypoint',
                emoji: '💡',
                title: '7 Elements of Art',
                content: 'Every piece of art uses these building blocks:\n\n1. 📏 LINE — marks that create shape and movement\n2. 🔷 SHAPE — 2D area (circle, triangle)\n3. 📦 FORM — 3D object (sphere, cube)\n4. 🎨 COLOUR — hue, value, intensity\n5. ⬛ VALUE — lightness and darkness\n6. 🪨 TEXTURE — how something feels or looks like it feels\n7. 📐 SPACE — positive/negative space'
              },
              {
                type: 'visual',
                emoji: '🎨',
                title: 'The Colour Wheel',
                content: '🔴🟡🔵 PRIMARY colours: Red, Yellow, Blue\n   (cannot be made by mixing other colours)\n\n🟠🟢🟣 SECONDARY colours: Orange, Green, Purple\n   (mix two primary colours)\n\nCOMPLEMENTARY colours: opposite on the colour wheel\n   Red ↔ Green, Blue ↔ Orange, Yellow ↔ Purple\n\nThese create maximum CONTRAST when placed together!'
              }
            ],
            quiz: [
              {
                id: 'art-q1',
                question: 'What are the PRIMARY colours?',
                emoji: '🎨',
                options: [
                  'Red, Orange, Yellow',
                  'Red, Yellow, Blue',
                  'Green, Purple, Orange',
                  'Red, Blue, Green'
                ],
                correctIndex: 1,
                explanation: 'The PRIMARY colours are Red, Yellow, and Blue. They cannot be made by mixing other colours together — all other colours come from these three! 🎨 ✅'
              }
            ]
          }
        ]
      }
    ]
  }
]

export function getSubject(id: string) {
  return curriculum.find(s => s.id === id)
}

export function getTopic(subjectId: string, topicId: string) {
  const subject = getSubject(subjectId)
  return subject?.topics.find(t => t.id === topicId)
}

export function getSubTopic(subjectId: string, topicId: string, subTopicId: string) {
  const topic = getTopic(subjectId, topicId)
  return topic?.subTopics.find(st => st.id === subTopicId)
}
