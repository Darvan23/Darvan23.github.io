/* NL / EN language switch.
   The pages are written in Dutch. This file swaps every known Dutch text
   for English and back. Choice is saved in localStorage; ?lang=en or ?lang=nl
   in the URL also works (handy for sending the English version to someone). */
(() => {
    const EN = {
        /* menu, titles, buttons */
        "Profiel": "Profile",
        "Projecten": "Projects",
        "Bekijk projecten": "View projects",
        "Bekijk live": "View live",
        "Code op GitHub": "Code on GitHub",
        "Download CV": "Download CV",
        "Nederlands": "Dutch",
        "Mail mij": "Email me",
        "Speel mijn games": "Play my games",
        "▶ Speel nu": "▶ Play now",
        "▶ Speelbaar": "▶ Playable",
        "↗ Live": "↗ Live",
        "Impressie": "Mock-up",
        "Impressie, alleen code": "Mock-up, code only",
        "Schoolprojecten": "School projects",
        "© 2026 Darvan Suleiman": "© 2026 Darvan Suleiman",

        /* home: hero */
        "Stagiair bij WeNine, 2026–2027": "Intern at WeNine, 2026–2027",
        "Frontend developer in opleiding. Ik maak interfaces die strak ogen en lekker aanvoelen: van webapps tot 3D-games die je meteen in je browser speelt.":
            "Frontend developer in training. I build interfaces that look sharp and feel great to use: from web apps to 3D games you can play right in your browser.",
        "MBO 4 Software Development, 3e jaar": "MBO 4 Software Development, 3rd year",
        "Hoogvliet, Rotterdam": "Hoogvliet, Rotterdam",
        "Rijbewijs B": "Driving licence B",
        "Sleep om te draaien, klik om te openen": "Drag to spin, click to open",

        /* home: about */
        "Over mij": "About me",
        "Ik bouw wat je ziet en aanraakt": "I build what you see and touch",
        "Hallo, ik ben Darvan. Mijn sterkste kant is de frontend: layout, styling, animaties en de kleine details waardoor een site goed voelt. Deze portfolio is daar zelf een voorbeeld van.":
            "Hi, I'm Darvan. My strongest side is the frontend: layout, styling, animation and the small details that make a site feel right. This portfolio is an example of that itself.",
        "Ik leer het best door te bouwen, van een bibliotheek-app met Next.js en MySQL tot games in de browser. Naast school en stage werk ik bij Totaal Vers, dus ik weet hoe je planning, tempo en verantwoordelijkheid combineert.":
            "I learn best by building, from a library app with Next.js and MySQL to games in the browser. Alongside school and my internship I work at Totaal Vers, so I know how to combine planning, pace and responsibility.",
        "3e": "3rd",
        "jaar MBO 4": "year MBO 4",
        "projecten gebouwd": "projects built",
        "talen gesproken": "languages spoken",
        "Waar ik mee werk": "What I work with",
        "Mijn stack": "My stack",
        "Backend en data": "Backend and data",
        "3D en games": "3D and games",
        "Werkwijze": "Workflow",

        /* home: gamer */
        "Ik speel games, en ik bouw ze": "I play games, and I build them",
        "Ik ben een echte gamer en speel op mijn PS5. Daar komt mijn liefde voor goede interfaces vandaan: menu's, animaties en feedback die meteen kloppen. Die ervaring stop ik in mijn eigen games, van schaken in de browser tot een 3D-stad in Paws & Pennies.":
            "I'm a real gamer and play on my PS5. That's where my love for good interfaces comes from: menus, animations and feedback that just feel right. I put that experience into my own games, from chess in the browser to a 3D town in Paws & Pennies.",
        "mijn console": "my console",
        "competitief": "competitive",
        "5 eigen games": "5 of my own games",
        "speelbaar online": "playable online",
        "Games die ik speel": "Games I play",
        "God of War-serie": "God of War series",
        "Tactische shooter": "Tactical shooter",
        "Actie-avontuur": "Action-adventure",
        "Voetbal": "Football",
        "Open wereld": "Open world",

        /* home: experience + education */
        "Werkervaring": "Work experience",
        "Praktijk": "Experience",
        "Stagiair Software Development": "Software Development Intern",
        "BOL-stage. Ik werk mee aan websites en webapps in een team.": "Work-based internship. I help build websites and web apps in a team.",
        "Medewerker": "Employee",
        "Bijbaan naast school en stage. Werken in een team met tempo en nauwkeurigheid.": "Part-time job alongside school and my internship. Working in a team with pace and accuracy.",
        "Productiemedewerker": "Production worker",
        "Groenten en fruit verpakken en sorteren met aandacht voor tempo en kwaliteit.": "Packing and sorting fruit and vegetables with attention to speed and quality.",
        "Bezorger": "Delivery driver",
        "Thuisbezorgd en NYP": "Thuisbezorgd and NYP",
        "Bestellingen snel en klantgericht bezorgen.": "Delivering orders quickly and with a customer focus.",
        "Klantenservice, keuken en schoonmaak.": "Customer service, kitchen and cleaning.",
        "Opleiding": "Education",
        "Leerroute": "Learning path",
        "2024 – nu": "2024 – now",
        "2025 – nu": "2025 – now",
        "ROC Mondriaan, 3e jaar": "ROC Mondriaan, 3rd year",
        "Webdevelopment, programmeren, databases, Scrum en moderne frameworks.": "Web development, programming, databases, Scrum and modern frameworks.",
        "ICT Beheer": "IT Management",
        "Basis in computersystemen, beheer en technische ondersteuning.": "Foundations in computer systems, administration and technical support.",
        "Diploma klas 12, exacte richting": "Grade 12 diploma, science track",
        "Malta School, Irak": "Malta School, Iraq",
        "12 jaar school in Irak. Na klas 9 koos ik de exacte richting, met natuurkunde, biologie en scheikunde. In 2018 haalde ik mijn diploma van klas 12.":
            "12 years of school in Iraq. After grade 9 I chose the science track, with physics, biology and chemistry. In 2018 I got my grade 12 diploma.",

        /* projects page */
        "Games die je direct in je browser speelt, websites en webapps. Pak een screenshot vast en draai hem om voor de details.":
            "Games you can play right in your browser, websites and web apps. Grab a screenshot and flip it for the details.",
        "Speel direct in je browser": "Play right in your browser",
        "Games met een groen": "Games with a green",
        "-label zijn online te spelen, zonder download. Klik op de afbeelding of op “Speel nu”.": " label can be played online, no download needed. Click the image or “Play now”.",
        "Eigen project, 3D game, web, Android en iOS": "Own project, 3D game, web, Android and iOS",
        "Een 3D cat simulation game. Je kiest een kat in het asiel, en die kat helpt een arm gezin door klusjes te doen in de stad. Met een verhaal, cutscenes, 10 katten om uit te kiezen en een levende stad met mensen.":
            "A 3D cat simulation game. You pick a cat at the shelter, and that cat helps a struggling family by doing odd jobs around town. With a story, cutscenes, 10 cats to choose from and a living town full of people.",
        "8 browsergames": "8 browser games",
        "Een verzameling klassieke games: schaken, dammen, snake, boter-kaas-en-eieren, vier op een rij, memory, reversi en zeeslag.":
            "A collection of classic games: chess, checkers, snake, tic-tac-toe, connect four, memory, reversi and battleship.",
        "Code": "Code",
        "Bordspel": "Board game",
        "Schaken": "Chess",
        "Schaken voor twee spelers met alle officiële regels: schaak, schaakmat, rokeren, en passant en promotie.":
            "Two-player chess with all the official rules: check, checkmate, castling, en passant and promotion.",
        "Spellogica": "Game logic",
        "Doolhofgame": "Maze game",
        "Een doolhof-achtervolging met 15 hoofdstukken. Vind de weg door een groot bos en ontsnap aan de achtervolger. Met geluidseffecten en skins.":
            "A maze chase with 15 chapters. Find your way through a huge forest and escape the chaser. With sound effects and skins.",
        "Schoolproject, game": "School project, game",
        "Raad welk product duurder is. Mijn eerste game, met duidelijke feedback en simpele spelregels.":
            "Guess which product costs more. My first game, with clear feedback and simple rules.",
        "Projecten uit mijn opleiding Software Development (alleen of in een Scrum-team) en eigen werk.":
            "Projects from my Software Development course (solo or in a Scrum team) and my own work.",
        "Eigen project, website": "Own project, website",
        "Website voor een sportkledingwinkel in Duhok. Met collecties, nieuwe drops, een sterke visuele stijl en bestellen via WhatsApp. Volledig responsive.":
            "Website for a sportswear shop in Duhok. With collections, new drops, a strong visual style and ordering via WhatsApp. Fully responsive.",
        "PHP website": "PHP website",
        "Hotelwebsite met pagina's voor kamers, aanbiedingen, boeken en contact, een eigen 404-pagina en een taalkeuze Nederlands/Engels. Opgebouwd met PHP-routing en herbruikbare onderdelen.":
            "Hotel website with pages for rooms, offers, booking and contact, a custom 404 page and a Dutch/English language switch. Built with PHP routing and reusable parts.",
        "Meertalig": "Multilingual",
        "Next.js webapp": "Next.js web app",
        "Dieren & Dashboard": "Animals & Dashboard",
        "App voor een dierenasiel. Zoek live door alle dieren, bekijk status, gewicht en leeftijd, en een dashboard met een KPI en een grafiek van het gewicht per dier.":
            "App for an animal shelter. Search all animals live, see their status, weight and age, plus a dashboard with a KPI and a weight-per-animal chart.",
        "Studenten & Cijfers": "Students & Grades",
        "App om cijfers van studenten te beheren: toevoegen, aanpassen en verwijderen, met een detailpagina per student. Veilige queries met PDO prepared statements en SQL joins.":
            "App to manage student grades: add, edit and delete, with a detail page per student. Safe queries with PDO prepared statements and SQL joins.",
        "Full-stack webapp": "Full-stack web app",
        "Bibliotheek-app": "Library app",
        "Systeem voor een bibliotheek: boeken lenen met database-transacties, terugbrengen met controle op te laat, statistieken met SQL joins en een badge-systeem.":
            "System for a library: borrowing books with database transactions, returns with overdue checks, statistics with SQL joins and a badge system.",
        "Teamproject": "Team project",
        "Teamdashboard voor het project Fisabilillah. Een grotere applicatie met overzichtelijke schermen en gedeelde code.":
            "Team dashboard for the Fisabilillah project. A larger application with clear screens and shared code.",
        "Review platform": "Review platform",
        "Platform waar gasten een review over hun verblijf achterlaten, gemaakt met PHP-formulieren en een nette presentatie.":
            "Platform where guests leave a review of their stay, built with PHP forms and a clean presentation.",
        "↻ Sleep om te draaien": "↻ Drag to spin",
        "Sleep terug om de screenshot te zien": "Drag back to see the screenshot",

        "Schoolproject, opnieuw gebouwd": "School project, rebuilt",
        "Hoger of Lager?": "Higher or Lower?",
        "Raad of het volgende product duurder of goedkoper is. Met 48 producten, 3 levens, een timer, combo-bonussen, steeds moeilijkere rondes en een record dat bewaard blijft.":
            "Guess whether the next product costs more or less. With 48 products, 3 lives, a timer, combo bonuses, rounds that get harder and a high score that is saved.",
        "Web Audio": "Web Audio",
        "Speel Hoger of Lager": "Play Higher or Lower",
        "Screenshot van Hoger of Lager: twee producten met prijzen": "Screenshot of Higher or Lower: two products with prices",
        /* skills page */
        "Technische vaardigheden": "Technical skills",
        "De talen, frameworks en tools waarmee ik websites, webapps en games bouw. Mijn sterkste kant: frontend, styling en animatie.":
            "The languages, frameworks and tools I use to build websites, web apps and games. My strongest side: frontend, styling and animation.",
        "Sleep de bol om hem te draaien.": "Drag the globe to spin it.",
        "Animaties": "Animations",
        "Backend & data": "Backend & data",
        "Tools & werkwijze": "Tools & workflow",
        "Gevorderd": "Advanced",
        "Goed": "Good",
        "Goed in ontwikkeling": "Good, still growing",
        "Basis tot goed": "Basic to good",
        "Basis": "Basic",
        "Hoe ik werk": "How I work",
        "Structuur maken": "Create structure",
        "Eerst begrijpen wat de gebruiker nodig heeft. Dan een duidelijke opbouw en datamodel.": "First understand what the user needs. Then a clear structure and data model.",
        "Bouwen en koppelen": "Build and connect",
        "Interface, logica, database en API-koppelingen bouwen in kleine stappen.": "Building interface, logic, database and API connections in small steps.",
        "Testen en verbeteren": "Test and improve",
        "Testen, feedback vragen en het werk bijhouden in sprint-logboeken.": "Testing, asking for feedback and tracking the work in sprint logs.",
        "Talen": "Languages",
        "Taalvaardigheid": "Language skills",
        "Koerdisch (Kurmanji)": "Kurdish (Kurmanji)",
        "Koerdisch (Sorani)": "Kurdish (Sorani)",
        "Engels": "English",
        "Arabisch": "Arabic",
        "Bijna moedertaal": "Near-native",
        "Vergevorderd": "Fluent",
        "Persoonlijk": "Personal",
        "Hobby's": "Hobbies",
        "Koken": "Cooking",
        "Zwemmen": "Swimming",
        "Biljart en pool": "Billiards and pool",
        "Mijn hobby's passen bij hoe ik leer: oefenen, samenwerken en steeds beter worden.": "My hobbies match how I learn: practise, work together and keep getting better.",

        /* contact page */
        "Neem contact op": "Get in touch",
        "Vragen over mijn projecten, een stage of samenwerking? Stuur een bericht of mail mij direct.":
            "Questions about my projects, an internship or working together? Send a message or email me directly.",
        "Frontend developer in opleiding": "Frontend developer in training",
        "Plaats": "Location",
        "Telefoon": "Phone",
        "Klik of sleep om het kaartje om te draaien": "Click or drag to flip the card",
        "Gegevens": "Details",
        "Woonplaats": "City",
        "Rijbewijs": "Driving licence",
        "Stuur een bericht": "Send a message",
        "Naam": "Name",
        "Bericht": "Message",
        "Verstuur bericht": "Send message",
        "Bezig met versturen...": "Sending...",
        "Bedankt! Je bericht is verstuurd. Check je inbox voor een bevestiging.": "Thanks! Your message has been sent. Check your inbox for a confirmation.",
        "Er ging iets mis. Probeer het later opnieuw of mail mij direct.": "Something went wrong. Try again later or email me directly.",

        /* Bug Hunt */
        "Bug Hunt": "Bug Hunt",
        "Schiet alle bugs weg!": "Shoot all the bugs!",
        "Sleep om te bewegen, je schiet automatisch": "Drag to move, you fire automatically",
        "← → of muis om te bewegen, spatie of klik om te schieten": "← → or mouse to move, space or click to shoot",
        "Opnieuw": "Play again",
        "Speel mijn echte games": "Play my real games",

        /* attributes: aria-labels, alt texts, titles */
        "Hoofdmenu": "Main menu",
        "Mijn projecten in 3D. Sleep om te draaien.": "My projects in 3D. Drag to spin.",
        "Visitekaartje. Klik om om te draaien.": "Business card. Click to flip.",
        "Speel Paws & Pennies": "Play Paws & Pennies",
        "Speel in de Game Room": "Play in the Game Room",
        "Speel schaken": "Play chess",
        "Speel Forest Maze Escape": "Play Forest Maze Escape",
        "Open de Eenzone website": "Open the Eenzone website",
        "Screenshot van Paws & Pennies: een 3D-stad met een kat, mensen en een bakkerij": "Screenshot of Paws & Pennies: a 3D town with a cat, people and a bakery",
        "Screenshot van de Game Room met schaken, dammen, snake en boter-kaas-en-eieren": "Screenshot of the Game Room with chess, checkers, snake and tic-tac-toe",
        "Screenshot van het schaakbord": "Screenshot of the chessboard",
        "Screenshot van Forest Maze Escape: een bos bij nacht": "Screenshot of Forest Maze Escape: a forest at night",
        "Screenshot van de Eenzone sportswear website": "Screenshot of the Eenzone sportswear website",
        "Screenshot van de Best-Inn Hotels website": "Screenshot of the Best-Inn Hotels website",
        "Impressie van het Hoger Lager spel": "Mock-up of the Hoger Lager game",
        "Impressie van de dieren-app met zoekfunctie en dashboard": "Mock-up of the animal app with search and dashboard",
        "Impressie van de studenten- en cijfersapp": "Mock-up of the students and grades app",
        "Impressie van de bibliotheek-app": "Mock-up of the library app",
        "Impressie van het teamdashboard": "Mock-up of the team dashboard",
        "Impressie van het reviewplatform": "Mock-up of the review platform",
        "3 van 5": "3 out of 5",
        "4 van 5": "4 out of 5",
        "5 van 5": "5 out of 5",
        "Start Bug Hunt: een mini-game": "Start Bug Hunt: a mini-game",
        "Stop Bug Hunt": "Stop Bug Hunt",
        "Wissel naar Engels": "Switch to Dutch",

        /* diensten page */
        "Diensten": "Services",
        "Website laten maken?": "Need a website?",
        "Website laten maken | Darvan Suleiman": "Websites | Darvan Suleiman",
        "Ik neem nieuwe klanten aan": "Taking on new clients",
        "Een website die er goed uitziet en klanten oplevert": "A website that looks great and brings in customers",
        "Voor kappers, restaurants, winkels en andere kleine bedrijven in Rotterdam en omgeving. Vaste prijzen, snel klaar en werkt perfect op je telefoon.": "For barbers, restaurants, shops and other small businesses in and around Rotterdam. Fixed prices, done fast and works perfectly on your phone.",
        "Stuur me een WhatsApp": "Send me a WhatsApp",
        "Bekijk prijzen": "See prices",
        "Prijzen": "Prices",
        "Kies wat bij jouw zaak past": "Pick what fits your business",
        "Alle prijzen zijn vanafprijzen. Na een kort gesprek krijg je een vaste prijs, zonder verrassingen.": "All prices are starting prices. After a short chat you get a fixed price, with no surprises.",
        "One-page website": "One-page website",
        "vanaf": "from",
        "/maand": "/month",
        "Voor een kapper, snackbar of salon die online gevonden wil worden.": "For a barber, snack bar or salon that wants to be found online.",
        "Eén pagina met al je info": "One page with all your info",
        "Openingstijden, adres en kaart": "Opening hours, address and map",
        "WhatsApp- en belknop": "WhatsApp and call button",
        "Werkt op telefoon, tablet en laptop": "Works on phone, tablet and laptop",
        "Klaar binnen 1 week": "Ready within 1 week",
        "Vraag dit aan": "Request this",
        "Meest gekozen": "Most popular",
        "Website tot 5 pagina's": "Website up to 5 pages",
        "Voor een bedrijf dat diensten, foto's en meer wil laten zien.": "For a business that wants to show services, photos and more.",
        "Tot 5 pagina's, bijvoorbeeld Home, Diensten, Over ons, Foto's en Contact": "Up to 5 pages, for example Home, Services, About, Photos and Contact",
        "Eigen ontwerp met animaties": "Custom design with animations",
        "Contactformulier": "Contact form",
        "Basis vindbaarheid in Google": "Basic Google visibility",
        "Klaar binnen 2 weken": "Ready within 2 weeks",
        "Shopify-klus": "Shopify job",
        "Voor webshops die iets willen aanpassen of verbeteren.": "For web shops that want to change or improve something.",
        "Nieuwe banner of homepage": "New banner or homepage",
        "Productpagina's mooier maken": "Better-looking product pages",
        "Kleine fouten oplossen": "Fixing small issues",
        "Snelheid verbeteren": "Improving speed",
        "Prijs per klus, vooraf bekend": "Price per job, agreed upfront",
        "Onderhoud en hosting": "Maintenance and hosting",
        "Ik houd je website online en pas kleine dingen voor je aan, zoals nieuwe openingstijden, prijzen of foto's. Je hoeft zelf niks te doen.": "I keep your website online and make small changes for you, like new opening hours, prices or photos. You don't have to do anything.",
        "Zo werkt het": "How it works",
        "Van eerste bericht tot live website": "From first message to live website",
        "Bericht sturen": "Send a message",
        "Stuur me een WhatsApp of mail. Vertel kort wat voor zaak je hebt.": "Send me a WhatsApp or email. Tell me briefly about your business.",
        "Gratis voorbeeld": "Free preview",
        "Ik maak een eerste ontwerp, zodat je ziet hoe jouw website eruit kan zien.": "I make a first design so you can see what your website could look like.",
        "Bouwen": "Building",
        "Ik bouw de website. Jij geeft feedback en ik pas het aan tot je blij bent.": "I build the website. You give feedback and I adjust it until you're happy.",
        "Online": "Online",
        "Je website staat live op je eigen domein en je kunt hem meteen delen.": "Your website goes live on your own domain and you can share it right away.",
        "Voorbeelden": "Examples",
        "Werk dat ik eerder maakte": "Work I've made before",
        "Meer zien? Bekijk al mijn projecten.": "Want to see more? Check out all my projects.",
        "Website voor een kledingwinkel, met bestellen via WhatsApp": "Website for a clothing shop, with ordering via WhatsApp",
        "Hotelwebsite met kamers, boeken en taalkeuze": "Hotel website with rooms, booking and language choice",
        "Dit portfolio": "This portfolio",
        "Eigen ontwerp met 3D en animaties": "Custom design with 3D and animations",
        "Website van Eenzone Sportswear": "Eenzone Sportswear website",
        "Website van Best-Inn Hotels": "Best-Inn Hotels website",
        "Het portfolio van Darvan Suleiman": "Darvan Suleiman's portfolio",
        "Vragen": "Questions",
        "Goed om te weten": "Good to know",
        "Wat moet ik zelf aanleveren?": "What do I need to provide?",
        "Je logo, wat foto's en de belangrijkste info over je zaak. Heb je geen goede foto's of teksten? Dan help ik je daarmee.": "Your logo, some photos and the key info about your business. No good photos or texts? I'll help you with that.",
        "Heb ik een domeinnaam nodig?": "Do I need a domain name?",
        "Ja, bijvoorbeeld jouwzaak.nl. Heb je er nog geen? Dan regel ik dat samen met je. Een domein kost meestal rond de €10 tot €15 per jaar.": "Yes, for example yourbusiness.nl. Don't have one yet? I'll set it up with you. A domain usually costs around €10 to €15 a year.",
        "Kan ik later nog dingen veranderen?": "Can I change things later?",
        "Ja. Met het onderhoudsplan pas ik kleine dingen voor je aan. Zonder plan kan het ook, dan spreken we per klus een prijs af.": "Yes. With the maintenance plan I make small changes for you. Without a plan that's fine too, we just agree on a price per job.",
        "Wanneer betaal ik?": "When do I pay?",
        "De helft bij de start en de rest als de website klaar is en jij tevreden bent.": "Half at the start and the rest when the website is finished and you're happy with it.",
        "Zullen we jouw website maken?": "Shall we build your website?",
        "Stuur een bericht. Ik reageer meestal dezelfde dag.": "Send a message. I usually reply the same day.",

        /* diensten: particulieren */
        "Kies wat bij jou past": "Pick what fits you",
        "Voor bedrijven": "For businesses",
        "Voor particulieren": "For individuals",
        "Soort klant": "Type of client",
        "Voor jezelf of een speciale dag": "For yourself or a special day",
        "Een uitnodiging die je gasten niet vergeten. Gewoon via WhatsApp te delen, in jullie eigen talen: Nederlands, Koerdisch, Arabisch, Engels en meer.": "An invitation your guests won't forget. Easy to share on WhatsApp, in your own languages: Dutch, Kurdish, Arabic, English and more.",
        "Bekijk de demo-uitnodiging": "See the demo invitation",
        "Digitale uitnodiging": "Digital invitation",
        "Voor een verloving, henna-avond, verjaardag of babyshower.": "For an engagement, henna night, birthday or baby shower.",
        "Eén mooie pagina met animatie": "One beautiful animated page",
        "Namen, datum en locatie met kaart": "Names, date and venue with map",
        "Aftellen naar de dag": "Countdown to the day",
        "Knop om het in je agenda te zetten": "Add-to-calendar button",
        "Te delen via WhatsApp": "Shareable on WhatsApp",
        "Digitale trouwuitnodiging": "Digital wedding invitation",
        "Een luxe uitnodiging voor jullie bruiloft.": "A luxury invitation for your wedding.",
        "Envelop die opengaat": "An envelope that opens",
        "Jullie foto en eigen kleuren": "Your photo and your own colours",
        "Programma van de dag": "Schedule of the day",
        "2 talen inbegrepen": "2 languages included",
        "Muziek als je wilt": "Music if you like",
        "Meest compleet": "Most complete",
        "Trouwwebsite met RSVP": "Wedding website with RSVP",
        "Alles voor jullie gasten op één plek.": "Everything for your guests in one place.",
        "Alles van de trouwuitnodiging": "Everything from the wedding invitation",
        "Jullie verhaal en foto's": "Your story and photos",
        "Gasten laten weten of ze komen": "Guests let you know if they're coming",
        "Overzicht van al je gasten": "Overview of all your guests",
        "Koppelwebsite": "Couple website",
        "Een cadeau voor een jubileum of Valentijnsdag: jullie verhaal, foto's en een persoonlijke boodschap.": "A gift for an anniversary or Valentine's Day: your story, photos and a personal message.",
        "Persoonlijke website": "Personal website",
        "Voor studenten, artiesten en freelancers: een pagina over jou, je werk en hoe mensen je bereiken.": "For students, artists and freelancers: a page about you, your work and how people can reach you.",
        "Extra taal": "Extra language",
        "+€25 per taal": "+€25 per language",
        "Spoed, klaar binnen 3 dagen": "Rush, ready within 3 days",

        /* page titles */
        "Darvan Suleiman | Frontend Developer": "Darvan Suleiman | Frontend Developer",
        "Projecten | Darvan Suleiman": "Projects | Darvan Suleiman",
        "Skills | Darvan Suleiman": "Skills | Darvan Suleiman",
        "Contact | Darvan Suleiman": "Contact | Darvan Suleiman",
    };

    const ATTRS = ["aria-label", "alt", "title", "placeholder"];
    const SKIP = "script, style, svg, .hero-name, .lang-switch";
    const norm = (s) => s.replace(/\s+/g, " ").trim();

    // remember the original Dutch for every text node / attribute we change
    const textOriginal = new WeakMap();
    const attrOriginal = new WeakMap();
    let titleOriginal = null;

    let lang = "nl";
    try {
        const q = new URLSearchParams(location.search).get("lang");
        if (q === "en" || q === "nl") { lang = q; localStorage.setItem("lang", q); }
        else lang = localStorage.getItem("lang") || "nl";
    } catch (_) {}

    window.dsLang = () => lang;
    window.dsT = (nl) => (lang === "en" && EN[nl] !== undefined ? EN[nl] : nl);

    function apply() {
        document.documentElement.lang = lang;

        if (titleOriginal === null) titleOriginal = document.title;
        document.title = lang === "en" ? (EN[titleOriginal] || titleOriginal) : titleOriginal;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent || parent.closest(SKIP)) continue;
            if (!textOriginal.has(node)) {
                const key = norm(node.nodeValue);
                if (!key || EN[key] === undefined) continue;
                textOriginal.set(node, node.nodeValue);
            }
            const original = textOriginal.get(node);
            const key = norm(original);
            // keep the surrounding spaces of the original text node
            const lead = original.match(/^\s*/)[0], trail = original.match(/\s*$/)[0];
            node.nodeValue = lang === "en" ? lead + EN[key] + trail : original;
        }

        document.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(",")).forEach((el) => {
            if (el.closest(".lang-switch")) return;
            let saved = attrOriginal.get(el);
            if (!saved) { saved = {}; attrOriginal.set(el, saved); }
            ATTRS.forEach((a) => {
                if (!el.hasAttribute(a)) return;
                if (!(a in saved)) {
                    const v = el.getAttribute(a);
                    if (EN[norm(v)] === undefined) return;
                    saved[a] = v;
                }
                el.setAttribute(a, lang === "en" ? EN[norm(saved[a])] : saved[a]);
            });
        });

        // the default CV in the hero follows the language too
        document.querySelectorAll(".cv-menu").forEach((menu) => {
            const links = [...menu.querySelectorAll("a")];
            const en = links.find((a) => a.href.includes("-en")), nl = links.find((a) => a.href.includes("-nl"));
            if (en && nl) menu.prepend(lang === "en" ? en : nl);
        });

        const sw = document.querySelector(".lang-switch");
        if (sw) {
            sw.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
        }
    }

    function setLang(next) {
        if (next === lang) return;
        lang = next;
        try { localStorage.setItem("lang", lang); } catch (_) {}
        apply();
        if (window.dsTrack) window.dsTrack("Taal gewisseld", { taal: lang.toUpperCase() });
    }

    /* the switch in the top bar */
    const bar = document.querySelector(".topbar-inner");
    if (bar) {
        const sw = document.createElement("div");
        sw.className = "lang-switch";
        sw.setAttribute("role", "group");
        sw.setAttribute("aria-label", "Taal / Language");
        sw.innerHTML = '<button type="button" data-lang="nl" aria-label="Nederlands">NL</button><button type="button" data-lang="en" aria-label="English">EN</button>';
        sw.addEventListener("click", (e) => {
            const b = e.target.closest("button[data-lang]");
            if (b) setLang(b.dataset.lang);
        });
        bar.appendChild(sw);
    }

    apply();
})();
