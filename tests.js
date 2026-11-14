/* =========================================================
   IELTS Pro — 5 tests de niveau complets (textes originaux)
   Chaque test : Listening (2 parties), Reading (2 textes),
   Grammar & Vocabulary (10 questions), Writing (1 tâche).
   a = index de la bonne réponse (les options sont mélangées à l'écran)
   d = difficulté (1 à 4), qui pondère le score
   ========================================================= */
const TF = ["TRUE", "FALSE", "NOT GIVEN"];
const TESTS = [
  /* ===================== TEST A ===================== */
  {
    id: "A",
    listening: [
      { title: "Part 1 — A language course",
        script: "Thank you for calling the Westbridge Language Centre. Our next evening course starts on Monday the ninth of March, not the second as it says on our old website. Classes run on Mondays and Wednesdays from six thirty to eight thirty. The full course lasts ten weeks and costs two hundred and forty pounds, although students and people over sixty pay one hundred and ninety. You can pay in two instalments if you prefer. Please bring a photo for your student card on the first evening. The centre is on the second floor of the Hartley Building, opposite the train station.",
        qs: [
          { d: 1, q: "When does the next evening course start?", o: ["Monday 9 March", "Monday 2 March", "Wednesday 9 March", "Monday 6 March"], a: 0 },
          { d: 1, q: "How often are the classes?", o: ["Twice a week", "Once a week", "Every weekday", "Three times a week"], a: 0 },
          { d: 2, q: "How much do students pay for the course?", o: ["£190", "£240", "£210", "£150"], a: 0 },
          { d: 2, q: "What must new students bring on the first evening?", o: ["A photo", "Their passport", "The full fee", "A dictionary"], a: 0 },
          { d: 3, q: "Where is the centre?", o: ["Opposite the train station", "Next to the train station", "On the ground floor", "Behind the Hartley Building"], a: 0 }
        ] },
      { title: "Part 2 — A lecture on urban heat islands",
        script: "Today I want to look at what are called urban heat islands. Cities are often several degrees warmer than the surrounding countryside, especially at night. There are three main reasons. First, materials like concrete and asphalt absorb heat during the day and release it slowly after sunset. Second, cities have fewer trees, so there is less shade and less cooling from plants. Third, cars, air conditioners and factories all produce waste heat. Now, a common assumption is that the problem is mainly about summer discomfort. In fact, the health effects are more serious: during heatwaves, death rates in cities rise much faster than in rural areas. The good news is that relatively simple measures, such as planting trees and painting roofs white, can lower temperatures noticeably.",
        qs: [
          { d: 1, q: "An urban heat island is a city that is…", o: ["warmer than the surrounding countryside", "cooler at night", "built on an island", "affected by sea winds"], a: 0 },
          { d: 2, q: "When is the temperature difference usually greatest?", o: ["At night", "At midday", "In the morning", "In winter"], a: 0 },
          { d: 2, q: "Which of these is NOT given as a cause?", o: ["Rising sea levels", "Concrete and asphalt", "Fewer trees", "Waste heat from cars"], a: 0 },
          { d: 3, q: "According to the speaker, the most serious effect is…", o: ["higher death rates during heatwaves", "summer discomfort", "higher energy bills", "damage to buildings"], a: 0 },
          { d: 4, q: "What does the speaker say about solutions?", o: ["Simple measures can make a noticeable difference", "Only expensive technology works", "Nothing can be done", "Cities should be moved"], a: 0 }
        ] }
    ],
    reading: [
      { title: "The Return of the Night Train",
        text: `For several decades, overnight trains in Europe appeared to be in terminal decline. Cheap flights and high-speed rail made them seem slow and old-fashioned, and many national rail companies cut their sleeper services. Since the late 2010s, however, night trains have made a surprising comeback, with new routes linking major European cities.

Several factors explain this revival. Growing concern about the climate impact of flying has led some travellers to look for lower-carbon alternatives. A night train also saves the cost of a hotel and delivers passengers to the city centre rather than to a distant airport.

Nevertheless, operators face real obstacles. Sleeper carriages are expensive to build, and each one carries far fewer passengers than a daytime carriage. Track access charges differ from country to country, which makes international routes complicated to price. Some services have been suspended because they could not cover their costs. Supporters argue that governments should treat night trains as part of climate policy and subsidise them accordingly.`,
        qs: [
          { d: 1, q: "Why did night trains decline?", o: ["Competition from cheap flights and high-speed rail", "Safety problems", "A lack of passengers in winter", "Rising fuel prices"], a: 0 },
          { d: 2, q: "Which advantage of night trains is mentioned?", o: ["They save the cost of a hotel", "They are faster than planes", "They are cheap to build", "They carry more passengers"], a: 0 },
          { d: 2, q: "Why are sleeper carriages a financial problem?", o: ["They are expensive and carry fewer people", "They need special tracks", "They use too much energy", "They wear out quickly"], a: 0 },
          { d: 3, q: "TRUE / FALSE / NOT GIVEN — “All new night train routes have been profitable.”", o: TF, a: 1, fixed: true },
          { d: 4, q: "Supporters believe night trains should be…", o: ["subsidised as part of climate policy", "run only by private companies", "replaced by flights", "limited to one country"], a: 0 }
        ] },
      { title: "Why We Forget",
        text: `Most people regard forgetting as a failure of memory, but many psychologists now see it as an essential part of how memory works. In the 1880s, the German researcher Hermann Ebbinghaus tested himself on lists of nonsense syllables and found that he forgot much of the material within a day, after which the rate of forgetting slowed considerably. This pattern, known as the forgetting curve, has been reproduced many times.

More recent research suggests that forgetting can be useful. If we remembered every detail of every day, it might become harder to retrieve the information we actually need. Some scientists argue that the brain actively weakens unused memories to reduce this interference.

The practical lesson for learners is that forgetting can be slowed. Reviewing material at increasing intervals — after one day, then three days, then a week — is far more effective than reading it many times in a single session. This technique, called spaced repetition, is now built into many language-learning apps.`,
        qs: [
          { d: 2, q: "What did Ebbinghaus discover?", o: ["We forget a lot quickly, then more slowly", "We forget at a constant rate", "We never forget nonsense syllables", "Memory improves after a day"], a: 0 },
          { d: 2, q: "The forgetting curve has been…", o: ["confirmed by many later studies", "rejected by modern scientists", "tested only once", "used only with children"], a: 0 },
          { d: 3, q: "Why might forgetting be useful?", o: ["It reduces interference when recalling what we need", "It makes the brain bigger", "It helps us sleep", "It removes only bad memories"], a: 0 },
          { d: 1, q: "Spaced repetition means…", o: ["reviewing material at increasing intervals", "reading many times in one session", "studying only at night", "learning lists of nonsense words"], a: 0 },
          { d: 4, q: "TRUE / FALSE / NOT GIVEN — “Ebbinghaus tested other people as well as himself.”", o: TF, a: 2, fixed: true }
        ] }
    ],
    language: [
      { s: "grammar", d: 1, q: "Neither of my brothers ___ coffee.", o: ["drinks", "drink", "are drinking", "have drunk"], a: 0 },
      { s: "grammar", d: 2, q: "I wish I ___ more time to study last year.", o: ["had had", "have", "would have", "had"], a: 0 },
      { s: "grammar", d: 2, q: "The report ___ by the end of next week.", o: ["will have been finished", "will finish", "is finishing", "has finished"], a: 0 },
      { s: "grammar", d: 3, q: "Hardly ___ the meeting started when the fire alarm rang.", o: ["had", "did", "has", "was"], a: 0 },
      { s: "grammar", d: 4, q: "___ more carefully, the error would have been noticed.", o: ["Had the data been checked", "If the data checked", "The data had been checked", "Were the data checked"], a: 0 },
      { s: "vocab", d: 1, q: "A synonym of “huge” is:", o: ["enormous", "tiny", "narrow", "rapid"], a: 0 },
      { s: "vocab", d: 2, q: "The company decided to ___ a new policy on remote work.", o: ["implement", "implicate", "imply", "impress"], a: 0 },
      { s: "vocab", d: 3, q: "“Meticulous” means:", o: ["extremely careful about details", "very fast", "slightly careless", "extremely generous"], a: 0 },
      { s: "vocab", d: 3, q: "Choose the correct collocation: to ___ a risk.", o: ["take", "make", "do", "put"], a: 0 },
      { s: "vocab", d: 4, q: "A “double-edged sword” is something that…", o: ["has both advantages and disadvantages", "is very dangerous", "is completely useless", "is extremely sharp"], a: 0 }
    ],
    writing: { prompt: "Some people think that all students should be required to study a foreign language at school. To what extent do you agree or disagree?" }
  },

  /* ===================== TEST B ===================== */
  {
    id: "B",
    listening: [
      { title: "Part 1 — A swimming club open day",
        script: "Hello, and welcome to the Riverside Swimming Club open day. Let me tell you about our membership options. Adult membership is thirty-two pounds a month, and that includes unlimited swimming and two classes a week. Junior membership, for under sixteens, is eighteen pounds. If you join today, your first month is free. The pool is open from six in the morning until ten at night, except on Sundays, when it closes at four. Please note that the sauna is closed until the end of May for repairs. Finally, anyone who wants to join the competition team must attend a trial session on Saturday morning.",
        qs: [
          { d: 1, q: "How much is adult membership per month?", o: ["£32", "£18", "£16", "£22"], a: 0 },
          { d: 2, q: "What does adult membership include?", o: ["Unlimited swimming and two classes a week", "Swimming only", "The sauna and the gym", "Four classes a week"], a: 0 },
          { d: 1, q: "When does the pool close on Sundays?", o: ["4 pm", "10 pm", "6 pm", "2 pm"], a: 0 },
          { d: 2, q: "Why is the sauna closed?", o: ["It is being repaired", "It is only for juniors", "It is too busy", "It never opens on Sundays"], a: 0 },
          { d: 3, q: "What must people do to join the competition team?", o: ["Attend a trial on Saturday morning", "Pay an extra fee", "Be under sixteen", "Swim every day"], a: 0 }
        ] },
      { title: "Part 2 — A talk on procrastination",
        script: "Procrastination is often described as a problem of time management, but researchers increasingly see it as a problem of emotion management. When a task makes us feel anxious, bored or insecure, delaying it gives us immediate relief. The cost comes later, when the deadline is closer and the stress is greater. Interestingly, studies show that people who forgive themselves after procrastinating are less likely to do it again, whereas those who criticise themselves harshly tend to repeat the pattern. One practical technique is to make the first step extremely small — for example, writing a single sentence of an essay. Once people start, they usually continue, because the task turns out to be less unpleasant than they expected.",
        qs: [
          { d: 1, q: "Researchers increasingly see procrastination as a problem of…", o: ["emotion management", "time management", "intelligence", "physical health"], a: 0 },
          { d: 2, q: "Why do people delay unpleasant tasks?", o: ["It gives them immediate relief", "They have too much time", "They forget about them", "They prefer group work"], a: 0 },
          { d: 3, q: "Who is more likely to procrastinate again?", o: ["People who criticise themselves harshly", "People who forgive themselves", "People with deadlines", "People who work at night"], a: 0 },
          { d: 2, q: "The technique the speaker suggests is to…", o: ["make the first step very small", "work only at weekends", "set a later deadline", "avoid difficult tasks"], a: 0 },
          { d: 4, q: "Why does this technique work, according to the speaker?", o: ["The task is often less unpleasant than expected", "People receive a reward", "It removes the deadline", "Someone else does the work"], a: 0 }
        ] }
    ],
    reading: [
      { title: "The Foggaras of the Sahara",
        text: `Oases have supported life in the Sahara for thousands of years. In Algeria, many traditional oases relied on foggaras — underground channels that carry water by gravity from aquifers to palm gardens, sometimes over several kilometres. The system required no pumps and was managed collectively, with water shared according to centuries-old rules.

In recent decades, many foggaras have dried up. Motorised wells can extract far more water, but they have lowered the water table, leaving the older channels without supply. At the same time, fewer young people are willing to do the demanding work of maintaining the tunnels.

Some local associations are now trying to restore foggaras, arguing that they are a sustainable model of water management as well as a cultural heritage. Critics reply that the channels alone cannot support modern agriculture or growing populations. Most experts agree that the future probably lies in combining traditional knowledge with careful regulation of modern wells.`,
        qs: [
          { d: 1, q: "What is a foggara?", o: ["An underground channel that carries water by gravity", "A modern pump", "A type of palm tree", "A desert road"], a: 0 },
          { d: 2, q: "How was the water traditionally shared?", o: ["According to old collective rules", "By the government", "By auction", "By whoever arrived first"], a: 0 },
          { d: 2, q: "Why have many foggaras dried up?", o: ["Motorised wells lowered the water table", "The climate became wetter", "The tunnels were closed by law", "The palm gardens disappeared"], a: 0 },
          { d: 3, q: "TRUE / FALSE / NOT GIVEN — “Young people are increasingly keen to maintain the foggaras.”", o: TF, a: 1, fixed: true },
          { d: 4, q: "Most experts think the best way forward is…", o: ["combining traditional knowledge with regulation of wells", "abandoning foggaras completely", "banning all modern wells", "moving the population away"], a: 0 }
        ] },
      { title: "The Four-Day Working Week",
        text: `In recent years, companies in several countries have experimented with a four-day working week, in which employees work around 32 hours for the same salary. One of the largest trials took place in the United Kingdom in 2022, involving about 60 organisations and nearly 3,000 workers. At the end of the six-month trial, the large majority of companies chose to continue with the shorter week.

Participants reported lower levels of stress and burnout, and many companies said productivity was maintained. Some firms also found it easier to recruit new staff.

However, the model does not suit every sector. Hospitals, schools and factories that need staff to be present at fixed hours find it harder to reduce working time without hiring more people. Critics also point out that companies which volunteer for trials may be those most likely to succeed, so the results may not apply to the economy as a whole.`,
        qs: [
          { d: 1, q: "In a four-day week, employees…", o: ["work about 32 hours for the same pay", "work longer days", "earn less money", "work only in the morning"], a: 0 },
          { d: 2, q: "What happened at the end of the UK trial?", o: ["Most companies continued with the shorter week", "Most companies stopped", "The government banned it", "Salaries were reduced"], a: 0 },
          { d: 2, q: "Which benefit is mentioned?", o: ["Easier recruitment", "Higher prices", "More holidays", "Fewer meetings"], a: 0 },
          { d: 3, q: "Why is the model harder for hospitals and schools?", o: ["Staff must be present at fixed hours", "They have no budget", "Workers prefer five days", "It is illegal"], a: 0 },
          { d: 4, q: "Critics say the trial results may not apply widely because…", o: ["volunteer companies are more likely to succeed", "the trial was too long", "too many workers took part", "it only included hospitals"], a: 0 }
        ] }
    ],
    language: [
      { s: "grammar", d: 1, q: "There ___ a lot of traffic in the city centre this morning.", o: ["was", "were", "are", "have"], a: 0 },
      { s: "grammar", d: 2, q: "She has been working here ___ 2019.", o: ["since", "for", "from", "during"], a: 0 },
      { s: "grammar", d: 2, q: "If you ___ me earlier, I could have helped.", o: ["had told", "told", "have told", "would tell"], a: 0 },
      { s: "grammar", d: 3, q: "The man ___ car was stolen called the police.", o: ["whose", "who", "which", "whom"], a: 0 },
      { s: "grammar", d: 4, q: "Not until the results were published ___ how serious the problem was.", o: ["did we realise", "we realised", "we did realise", "realised we"], a: 0 },
      { s: "vocab", d: 1, q: "The opposite of “cheap” is:", o: ["expensive", "poor", "free", "simple"], a: 0 },
      { s: "vocab", d: 2, q: "Smoking can seriously ___ your health.", o: ["damage", "harm to", "injure to", "hurt at"], a: 0 },
      { s: "vocab", d: 3, q: "To “mitigate” a problem means to:", o: ["make it less serious", "make it worse", "ignore it", "discover it"], a: 0 },
      { s: "vocab", d: 3, q: "The results were ___ different from what we expected.", o: ["significantly", "significance", "significant", "signify"], a: 0 },
      { s: "vocab", d: 4, q: "A “watershed moment” is…", o: ["a turning point", "a rainy day", "a small mistake", "a relaxing time"], a: 0 }
    ],
    writing: { prompt: "In many cities, people spend more and more time travelling to work. What are the causes of this problem, and what solutions can you suggest?" }
  },

  /* ===================== TEST C ===================== */
  {
    id: "C",
    listening: [
      { title: "Part 1 — Booking a boat trip",
        script: "Good morning, and thank you for booking with Coastline Tours. Your boat trip to the islands leaves at nine fifteen tomorrow from Pier Four — please be there fifteen minutes before departure. The trip lasts about five hours, and lunch is included, but if you have any food allergies, please tell the guide when you board. The price for adults is forty-five pounds, and children under twelve travel at half price. If the weather is bad, we may cancel the trip; in that case, we will send a text message by seven a.m. and you can choose a refund or a new date. Don't forget sunscreen and a warm jacket — it can get windy at sea.",
        qs: [
          { d: 1, q: "What time does the boat leave?", o: ["9:15", "9:00", "7:00", "4:15"], a: 0 },
          { d: 2, q: "When should passengers arrive?", o: ["15 minutes before departure", "At 7 am", "One hour early", "At lunchtime"], a: 0 },
          { d: 2, q: "How much do children under twelve pay?", o: ["£22.50", "£45", "£12", "Nothing"], a: 0 },
          { d: 3, q: "If the trip is cancelled, passengers will…", o: ["receive a text message by 7 am", "be phoned by the guide", "lose their money", "go the next day automatically"], a: 0 },
          { d: 2, q: "Why does the speaker recommend a warm jacket?", o: ["It can be windy at sea", "Lunch is eaten outside", "The boat has no roof", "It will rain"], a: 0 }
        ] },
      { title: "Part 2 — A lecture on plastic recycling",
        script: "Many people assume that when they put plastic in the recycling bin, it will be turned into new products. Unfortunately, the reality is more complicated. Globally, only around nine percent of all the plastic ever produced has been recycled. One reason is that there are many different types of plastic, and most of them cannot easily be recycled together. Another is that recycled plastic is often more expensive than new plastic made from oil. Even when plastic is recycled, its quality usually decreases, so it can only be reused a limited number of times. For these reasons, many researchers argue that reducing the amount of plastic we use is far more effective than relying on recycling.",
        qs: [
          { d: 1, q: "Roughly what percentage of all plastic has been recycled?", o: ["About 9%", "About 50%", "About 90%", "About 19%"], a: 0 },
          { d: 2, q: "One problem with recycling plastic is that…", o: ["there are many different types of plastic", "plastic is too heavy", "bins are too small", "people rarely buy plastic"], a: 0 },
          { d: 3, q: "Why is recycled plastic less attractive to manufacturers?", o: ["It is often more expensive than new plastic", "It is illegal", "It is too strong", "It has no colour"], a: 0 },
          { d: 2, q: "What happens to plastic each time it is recycled?", o: ["Its quality decreases", "It becomes stronger", "It turns into oil", "It becomes cheaper"], a: 0 },
          { d: 4, q: "The speaker's main conclusion is that…", o: ["using less plastic is more effective than recycling", "recycling solves the problem", "plastic should be burned", "oil is better than plastic"], a: 0 }
        ] }
    ],
    reading: [
      { title: "The Language of Bees",
        text: `Honeybees communicate the location of food through a behaviour known as the waggle dance. When a forager returns to the hive after finding a good source of nectar, it moves in a figure-of-eight pattern, shaking its body during the straight central part of the dance. The direction of this central run indicates the direction of the food relative to the sun, while its length shows how far away the food is.

The Austrian scientist Karl von Frisch decoded the dance in the middle of the twentieth century, work for which he later shared a Nobel Prize. His conclusions were controversial for many years, as some researchers believed bees found food mainly by smell. Later experiments using radar to track individual bees confirmed that the dance does carry useful information.

Interestingly, the dance appears to be partly learned. Young bees that are unable to watch experienced dancers perform less precise dances, although their accuracy improves with practice.`,
        qs: [
          { d: 1, q: "What does the waggle dance communicate?", o: ["The location of food", "The age of the bee", "Danger near the hive", "The time of day"], a: 0 },
          { d: 2, q: "The length of the central run shows…", o: ["how far away the food is", "the type of flower", "the direction of the wind", "the number of bees"], a: 0 },
          { d: 3, q: "Why were von Frisch's conclusions controversial?", o: ["Some thought bees found food mainly by smell", "He used radar", "He worked alone", "He studied only one hive"], a: 0 },
          { d: 3, q: "TRUE / FALSE / NOT GIVEN — “Von Frisch received the Nobel Prize on his own.”", o: TF, a: 1, fixed: true },
          { d: 4, q: "Young bees that cannot watch experienced dancers…", o: ["dance less precisely at first", "cannot dance at all", "dance better", "leave the hive"], a: 0 }
        ] },
      { title: "Desalination Around the Mediterranean",
        text: `As rainfall becomes less reliable, many countries around the Mediterranean are turning to desalination — the process of removing salt from seawater to produce drinking water. Algeria is among the leading users of this technology in Africa, with large plants along its coast supplying cities such as Oran and Algiers.

Most modern plants use reverse osmosis, in which seawater is pushed at high pressure through membranes that block salt. The technology has become much more efficient over the past few decades, but it still requires large amounts of energy.

Desalination also produces brine, a very salty waste water that is usually returned to the sea. If it is not properly diluted, brine can harm marine life near the outlet. Engineers are therefore studying ways to spread brine more widely or to extract useful minerals from it.

Supporters see desalination as essential for water security, while critics argue that it should not replace efforts to reduce leaks and use water more carefully.`,
        qs: [
          { d: 1, q: "Why are Mediterranean countries turning to desalination?", o: ["Rainfall is becoming less reliable", "Sea levels are falling", "Rivers are too salty", "It is cheaper than rain"], a: 0 },
          { d: 2, q: "In reverse osmosis, salt is removed by…", o: ["membranes", "heat", "chemicals", "sunlight"], a: 0 },
          { d: 2, q: "Which disadvantage of desalination is still mentioned?", o: ["It needs a lot of energy", "It is slow to build", "It produces no water in winter", "It only works in Algeria"], a: 0 },
          { d: 3, q: "What can happen if brine is not diluted?", o: ["It can harm marine life", "It becomes drinking water", "It evaporates", "It blocks ships"], a: 0 },
          { d: 4, q: "Critics believe desalination should not…", o: ["replace reducing leaks and saving water", "be used at all", "be built near cities", "use reverse osmosis"], a: 0 }
        ] }
    ],
    language: [
      { s: "grammar", d: 1, q: "My sister ___ to the gym three times a week.", o: ["goes", "go", "going", "is go"], a: 0 },
      { s: "grammar", d: 2, q: "By the time we got there, the shop ___.", o: ["had closed", "closed", "has closed", "was closing"], a: 0 },
      { s: "grammar", d: 2, q: "This is the most interesting book I ___ read.", o: ["have ever", "ever", "had ever", "am ever"], a: 0 },
      { s: "grammar", d: 3, q: "The new hospital, ___ opened last year, employs 500 people.", o: ["which", "that", "who", "what"], a: 0 },
      { s: "grammar", d: 4, q: "Little ___ that the decision would change their lives.", o: ["did they know", "they knew", "knew they", "they did know"], a: 0 },
      { s: "vocab", d: 1, q: "If something is “essential”, it is…", o: ["necessary", "optional", "expensive", "rare"], a: 0 },
      { s: "vocab", d: 2, q: "The number of tourists ___ sharply in 2020.", o: ["fell", "fallen", "felt", "failed"], a: 0 },
      { s: "vocab", d: 3, q: "“Reluctant” means:", o: ["unwilling", "excited", "careful", "angry"], a: 0 },
      { s: "vocab", d: 3, q: "Choose the correct collocation: to ___ attention to something.", o: ["pay", "give", "make", "do"], a: 0 },
      { s: "vocab", d: 4, q: "A “sweeping generalisation” is a statement that…", o: ["is too broad to be accurate", "is carefully proven", "is very short", "is about cleaning"], a: 0 }
    ],
    writing: { prompt: "Some people believe that the internet has brought people closer together, while others think it has made people more isolated. Discuss both views and give your own opinion." }
  },

  /* ===================== TEST D ===================== */
  {
    id: "D",
    listening: [
      { title: "Part 1 — Renting a flat",
        script: "Hi, this is Karen from City Lettings, calling about the flat on Elm Road. The rent is six hundred and fifty pounds a month, and that includes water but not electricity or internet. The flat is on the third floor, and I should mention there's no lift. It has one bedroom and a small balcony facing the park. The landlord asks for a deposit of one month's rent, which you'll get back when you leave if there's no damage. Viewings are available on Thursday afternoon or Saturday morning — Friday is no longer possible, sorry. Please call me back to confirm which time suits you.",
        qs: [
          { d: 1, q: "How much is the rent per month?", o: ["£650", "£600", "£560", "£750"], a: 0 },
          { d: 2, q: "What is included in the rent?", o: ["Water", "Electricity", "Internet", "All bills"], a: 0 },
          { d: 2, q: "Which disadvantage does the speaker mention?", o: ["There is no lift", "The balcony is broken", "It is noisy", "There is no park"], a: 0 },
          { d: 2, q: "How much is the deposit?", o: ["One month's rent", "Two months' rent", "£100", "Nothing"], a: 0 },
          { d: 3, q: "On which day is a viewing no longer possible?", o: ["Friday", "Thursday", "Saturday", "Sunday"], a: 0 }
        ] },
      { title: "Part 2 — A talk on teenagers and sleep",
        script: "There is growing evidence that teenagers' body clocks are naturally set later than those of adults. During puberty, the hormone melatonin, which makes us feel sleepy, is released later in the evening, so many teenagers genuinely find it hard to fall asleep early. Yet most schools start early in the morning, which means that many students arrive at school without enough sleep. Some schools have experimented with later start times. In several studies, attendance improved and students reported feeling less tired, although the effect on exam results was smaller than some supporters had hoped. Critics point out that later starts can be difficult for parents and for school transport, so the decision involves more than just science.",
        qs: [
          { d: 1, q: "Why do many teenagers find it hard to sleep early?", o: ["Melatonin is released later in the evening", "They drink coffee", "They study too much", "Schools start late"], a: 0 },
          { d: 2, q: "What is the result of early school start times?", o: ["Many students arrive without enough sleep", "Students get better grades", "Teachers are tired", "Parents complain about homework"], a: 0 },
          { d: 3, q: "What improved in schools with later start times?", o: ["Attendance", "Sports results", "Parents' sleep", "Teachers' salaries"], a: 0 },
          { d: 3, q: "What does the speaker say about exam results?", o: ["The effect was smaller than expected", "They doubled", "They got worse", "They were not measured"], a: 0 },
          { d: 4, q: "Critics point out that later starts…", o: ["can cause problems for parents and transport", "are too expensive for teachers", "are illegal", "have no benefits at all"], a: 0 }
        ] }
    ],
    reading: [
      { title: "A City Centre Without Cars",
        text: `The Spanish city of Pontevedra has attracted international attention for a policy it introduced in 1999: banning most private cars from its historic centre. Since then, traffic accidents have fallen sharply, and the population of the centre has grown as families moved back.

The policy did not ban cars entirely. Residents can still drive to their homes, delivery vehicles have limited access, and free car parks were built on the edge of the centre. Pavements were widened and many traffic lights removed, so pedestrians have priority.

Other cities have adopted similar measures, but transforming a large capital is more difficult than changing a small city. Opponents argue that restricting cars can harm shops and make life harder for people with reduced mobility. Supporters respond that streets full of pedestrians tend to attract more customers, not fewer, and that good public transport can replace many car journeys.`,
        qs: [
          { d: 1, q: "What did Pontevedra do?", o: ["Banned most cars from its centre", "Built new motorways", "Closed all its shops", "Removed all parking"], a: 0 },
          { d: 2, q: "Which result of the policy is mentioned?", o: ["Traffic accidents fell sharply", "Prices rose", "Fewer families lived there", "Shops closed"], a: 0 },
          { d: 2, q: "TRUE / FALSE / NOT GIVEN — “Residents are not allowed to drive to their homes.”", o: TF, a: 1, fixed: true },
          { d: 3, q: "Why is the policy harder to apply in large capitals?", o: ["Transforming a large city is more difficult", "They have no pedestrians", "They have no public transport", "Their streets are too wide"], a: 0 },
          { d: 4, q: "Supporters argue that streets full of pedestrians…", o: ["attract more customers", "are dangerous", "need more cars", "reduce public transport"], a: 0 }
        ] },
      { title: "Learning by Teaching",
        text: `Teachers have long observed that explaining a subject to someone else is one of the best ways to understand it. Psychologists call this the protégé effect. In several experiments, students who studied material expecting to teach it later remembered it better than students who expected only to be tested, even when they never actually taught anyone.

Researchers believe the expectation of teaching changes the way people study. Learners who plan to teach tend to organise information more clearly, look for the main ideas and pay attention to how concepts are connected. When they actually explain the material, they also discover gaps in their own understanding.

The effect has practical applications. Some schools pair older students with younger ones, and many online courses ask learners to write short explanations for their classmates. However, the benefits depend on the quality of preparation: simply repeating information without understanding it brings little improvement.`,
        qs: [
          { d: 1, q: "The protégé effect refers to…", o: ["learning better by preparing to teach", "learning only from experts", "forgetting after teaching", "studying in groups"], a: 0 },
          { d: 2, q: "Students who expected to teach…", o: ["remembered the material better", "felt more anxious", "studied less", "needed more time"], a: 0 },
          { d: 3, q: "Why does the expectation of teaching help?", o: ["Learners organise information more clearly", "They receive extra lessons", "They study at night", "They copy their notes"], a: 0 },
          { d: 2, q: "What do learners discover when they explain material?", o: ["Gaps in their own understanding", "New subjects", "Their teacher's mistakes", "Better grades immediately"], a: 0 },
          { d: 4, q: "According to the passage, the benefits are limited when…", o: ["learners repeat information without understanding it", "students are older", "courses are online", "groups are large"], a: 0 }
        ] }
    ],
    language: [
      { s: "grammar", d: 1, q: "They ___ football every Saturday.", o: ["play", "plays", "playing", "are play"], a: 0 },
      { s: "grammar", d: 2, q: "I'm used to ___ up early.", o: ["getting", "get", "got", "have got"], a: 0 },
      { s: "grammar", d: 2, q: "The museum ___ in 1890.", o: ["was built", "built", "has built", "is building"], a: 0 },
      { s: "grammar", d: 3, q: "Unless we ___ now, we will miss the train.", o: ["leave", "will leave", "left", "don't leave"], a: 0 },
      { s: "grammar", d: 4, q: "Only after the storm had passed ___ to go outside.", o: ["were we allowed", "we were allowed", "we allowed", "allowed we"], a: 0 },
      { s: "vocab", d: 1, q: "A word that means “very tired” is:", o: ["exhausted", "excited", "exciting", "active"], a: 0 },
      { s: "vocab", d: 2, q: "Air pollution has a negative ___ on health.", o: ["impact", "impress", "imply", "input"], a: 0 },
      { s: "vocab", d: 3, q: "“Ambiguous” means:", o: ["having more than one possible meaning", "very clear", "extremely large", "unpleasant"], a: 0 },
      { s: "vocab", d: 3, q: "Choose the correct collocation: to ___ progress.", o: ["make", "do", "take", "give"], a: 0 },
      { s: "vocab", d: 4, q: "If a problem is “intractable”, it is…", o: ["very difficult to solve", "easy to fix", "already solved", "not important"], a: 0 }
    ],
    writing: { prompt: "Some people believe that university education should be free for all students, while others think students should pay for it. Discuss both views and give your own opinion." }
  },

  /* ===================== TEST E ===================== */
  {
    id: "E",
    listening: [
      { title: "Part 1 — A medical centre message",
        script: "You've reached the Greenfield Medical Centre. Our opening hours are eight a.m. to six thirty p.m., Monday to Friday. On Saturdays we open from nine until twelve for emergency appointments only. To book a routine appointment, please use our website or call after ten a.m., when the lines are less busy. Repeat prescriptions take two working days to prepare, so please order them in good time. From next month, our nurse clinic will move from Tuesday to Thursday afternoons. If you need urgent medical help when we are closed, please call one one one.",
        qs: [
          { d: 1, q: "What time does the centre close on weekdays?", o: ["6:30 pm", "6:00 pm", "12:00 pm", "8:00 pm"], a: 0 },
          { d: 2, q: "On Saturdays the centre is open for…", o: ["emergency appointments only", "routine appointments", "prescriptions only", "the nurse clinic"], a: 0 },
          { d: 2, q: "When is the best time to phone for a routine appointment?", o: ["After 10 am", "Before 8 am", "At 9 am", "On Saturday morning"], a: 0 },
          { d: 2, q: "How long do repeat prescriptions take?", o: ["Two working days", "One day", "A week", "Two hours"], a: 0 },
          { d: 3, q: "From next month, the nurse clinic will be on…", o: ["Thursday afternoons", "Tuesday afternoons", "Thursday mornings", "Saturdays"], a: 0 }
        ] },
      { title: "Part 2 — A lecture on the green Sahara",
        script: "It is hard to imagine, but several thousand years ago large parts of the Sahara were green. Lakes, grasslands and rivers covered areas that are now desert, and animals such as giraffes, elephants and hippos lived there. We know this partly from rock art: thousands of paintings and engravings, including many at Tassili n'Ajjer in Algeria, show people herding cattle and hunting wild animals. This humid period was caused by small changes in the Earth's orbit, which strengthened the summer monsoon over North Africa. Around five thousand years ago, the climate became drier again, and people gradually moved towards the Nile valley and other areas with reliable water. Some researchers believe these movements played a role in the rise of early civilisations.",
        qs: [
          { d: 1, q: "Several thousand years ago, large parts of the Sahara were…", o: ["green", "covered with ice", "under the sea", "full of cities"], a: 0 },
          { d: 2, q: "How do we know about this period?", o: ["Partly from rock art", "From written books", "From old maps", "From photographs"], a: 0 },
          { d: 2, q: "Where can many of these paintings be found?", o: ["Tassili n'Ajjer in Algeria", "The Nile valley", "London", "The Atlantic coast"], a: 0 },
          { d: 3, q: "What caused the humid period?", o: ["Small changes in the Earth's orbit", "Volcanic eruptions", "Early farming", "Melting glaciers"], a: 0 },
          { d: 4, q: "What happened about five thousand years ago?", o: ["The climate became drier and people moved", "The Sahara became greener", "People built cities in the desert", "Giraffes returned"], a: 0 }
        ] }
    ],
    reading: [
      { title: "How Habits Form",
        text: `Many of our daily actions are not the result of conscious decisions but of habits. Researchers estimate that a large share of what we do each day is repeated in the same place, often without much thought. A habit forms through a loop: a cue triggers a routine, which leads to a reward. Over time, the brain links the cue and the reward so strongly that the routine becomes automatic.

How long does it take to form a new habit? A popular claim says twenty-one days, but a study at University College London found that participants took on average about sixty-six days, with large differences between individuals and types of behaviour. Simple actions, such as drinking a glass of water after breakfast, became automatic much faster than demanding ones, such as doing fifty sit-ups.

The study also found that missing a single day did not significantly affect the process, which suggests that consistency over time matters more than perfection.`,
        qs: [
          { d: 1, q: "According to the passage, a habit loop consists of…", o: ["a cue, a routine and a reward", "a decision and a plan", "a goal and a punishment", "a time and a place"], a: 0 },
          { d: 2, q: "How long does the popular claim say a habit takes to form?", o: ["21 days", "66 days", "100 days", "7 days"], a: 0 },
          { d: 2, q: "What did the UCL study find?", o: ["About 66 days on average, with big individual differences", "Exactly 21 days for everyone", "Habits never become automatic", "Only simple habits can form"], a: 0 },
          { d: 3, q: "Which habit became automatic faster?", o: ["Drinking water after breakfast", "Doing fifty sit-ups", "Running every evening", "Studying for an hour"], a: 0 },
          { d: 4, q: "What does the study suggest about missing one day?", o: ["It does not significantly affect habit formation", "It means starting again", "It doubles the time needed", "It stops the habit forming"], a: 0 }
        ] },
      { title: "Words Without Translations",
        text: `Every language contains words that seem impossible to translate directly. The Portuguese word saudade, for example, describes a deep, nostalgic longing for something or someone that may never return. The German word Schadenfreude refers to pleasure taken in another person's misfortune. English speakers can explain these ideas, but they need a whole phrase rather than a single word.

Linguists point out that such words do not prove that speakers of other languages cannot experience the same feelings. Instead, they reflect what a culture has found important enough to name. Once a concept becomes widely discussed, languages often borrow the word, as English has done with Schadenfreude.

For translators, these words present a practical challenge. A literal translation may lose the emotional tone, while a long explanation may break the rhythm of a sentence. Good translators therefore choose different solutions depending on the context and the reader.`,
        qs: [
          { d: 1, q: "The word “saudade” describes…", o: ["a nostalgic longing", "pleasure in another person's misfortune", "a type of music", "a happy memory"], a: 0 },
          { d: 2, q: "English speakers can express these ideas…", o: ["using a phrase rather than a single word", "only in German", "not at all", "only with gestures"], a: 0 },
          { d: 3, q: "According to linguists, these words show…", o: ["what a culture found important enough to name", "that others cannot feel the same", "that English is limited", "that translation is impossible"], a: 0 },
          { d: 2, q: "TRUE / FALSE / NOT GIVEN — “English has borrowed the word Schadenfreude.”", o: TF, a: 0, fixed: true },
          { d: 4, q: "Good translators…", o: ["choose solutions depending on context and reader", "always translate literally", "avoid difficult words", "always add long explanations"], a: 0 }
        ] }
    ],
    language: [
      { s: "grammar", d: 1, q: "How many students ___ in your class?", o: ["are there", "there are", "is there", "have there"], a: 0 },
      { s: "grammar", d: 2, q: "I ___ my keys, so I can't open the door now.", o: ["have lost", "am losing", "lose", "had been lose"], a: 0 },
      { s: "grammar", d: 2, q: "If it ___ tomorrow, the match will be cancelled.", o: ["rains", "will rain", "rained", "would rain"], a: 0 },
      { s: "grammar", d: 3, q: "It is believed that the painting ___ in the 16th century.", o: ["was painted", "painted", "has painting", "is painting"], a: 0 },
      { s: "grammar", d: 4, q: "So difficult ___ that only five students passed.", o: ["was the exam", "the exam was", "did the exam", "the exam did"], a: 0 },
      { s: "vocab", d: 1, q: "A “colleague” is…", o: ["a person you work with", "a type of college", "a family member", "a neighbour"], a: 0 },
      { s: "vocab", d: 2, q: "The government plans to ___ taxes on fuel.", o: ["raise", "rise", "arise", "rose"], a: 0 },
      { s: "vocab", d: 3, q: "“Feasible” means:", o: ["possible and practical", "very expensive", "illegal", "impossible"], a: 0 },
      { s: "vocab", d: 3, q: "Choose the correct collocation: to ___ a role in something.", o: ["play", "make", "do", "act"], a: 0 },
      { s: "vocab", d: 4, q: "To “take something for granted” means to…", o: ["not appreciate it because you always expect it", "borrow it", "refuse it", "examine it carefully"], a: 0 }
    ],
    writing: { prompt: "Many young people today want to work for themselves rather than for a company. Why is this the case? Is it a positive or a negative development?" }
  }
];
const TEST_TIMES = { listening: 12, reading: 20, language: 8, writing: 15 }; // minutes par partie
const TEST_WRITING_MIN = 120;
