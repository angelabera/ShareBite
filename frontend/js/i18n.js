// Lightweight i18n loader
(function () {
  const DEFAULT_LANG = 'en';
  let translations = {};
  let current = DEFAULT_LANG;

  // Bundled locales: used when fetch fails (e.g., file:// or offline) so switching languages works reliably
  const bundledLocales = {
    "en": {
      "contact": {
        "title": "📞 Contact Us",
        "question": "💬 Do You Have a Question?",
        "fillForm": "Fill out the form below to get started",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email:",
          "email_placeholder": "Enter your email",
          "message": "Message:",
          "message_placeholder": "Type in your Message",
          "submit": "Submit"
        },
        "getInTouch": "Get In Touch",
        "getInTouchText": "We love to hear from you. Our team is always here to answer your questions.",
        "address": "Address:",
        "address_value": "ShareBite Building, Noida, India",
        "phone_label": "Phone No.",
        "phone_value": "+91 8888889999",
        "email_label": "Email:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "Made with 💚 by Angela Bera",
        "cursorTrailLabel": "Cursor trail",
        "copyright": "© 2025 ShareBite. All rights reserved.",
        "license": "License"
      },
      "toast": { "welcome": "Welcome, {name}! 🎉" },
      "nav": { "home": "Home", "features": "Features", "listings": "Listings", "about": "About", "contact": "Contact" },
      "hero": { "line1": "Reduce Food Waste,", "line2": "Feed Communities", "description": "Connect restaurants and households with NGOs and volunteers to redistribute fresh leftover food and fight hunger while reducing waste.", "donate": "Donate Food", "find": "Find Food", "help": "Help Others" },
      "features": { "title": "How ShareBite Works", "subtitle": "Simple steps to make a difference", "step1": { "title": "List Your Food", "desc": "Restaurants and households can easily list fresh leftover food with details about quantity, type, and pickup location.", "stepLabel": "Step 1" }, "step2": { "title": "Connect & Coordinate", "desc": "Our platform connects donors with NGOs, shelters, and volunteers for seamless pickup coordination.", "stepLabel": "Step 2" }, "step3": { "title": "Feed Communities", "desc": "Collected food reaches those who need it most, reducing waste while fighting hunger in local communities.", "stepLabel": "Step 3" } },
      "role": { "donor": "Donor", "collector": "Collector" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "Donor Guidelines", "subtitle": "Guidelines and tips for donors to donate safely and responsibly." },
      "support": { "title": "Support", "contact_prompt": "Need help? Reach out to our support team and we’ll get back to you shortly.", "form_submit": "Send Message" },
      "listings": {
        "title": "Food Listings",
        "subtitle": "Available food waiting to be collected",
        "filter": { "all": "All", "restaurant": "Restaurant", "household": "Household", "bakery": "Bakery", "event": "Event" },
        "errors": { "invalid_image": "Please upload a valid image file", "invalid_type": "Please select an image file", "image_too_large": "Image size should be less than 5MB", "required_field": "Please fill in the required field: {field}", "invalid_contact": "Please enter a valid email address or phone number", "fresh_date_future": "Fresh until date must be in the future." },
        "success": { "added": "Food listing added successfully!" },
        "dietaryFilters": "Dietary Filters",
        "dietary": { "vegetarian": "Vegetarian", "vegan": "Vegan", "gluten-free": "Gluten-Free", "dairy-free": "Dairy-Free", "non-vegetarian": "Non-Vegetarian", "nut-free": "Nut-Free" },
        "search_placeholder": "Search by location or food type...",
        "add_listing": "Add Listing",
        "learn_more": "Explore More",
        "notification": { "header": "Claimed Food Items", "no_items": "No claimed items yet", "empty_prompt": "Start claiming food items to see them here" },
        "modal": {
          "title": "Add Food Listing",
          "steps": { "1": "Food Details", "2": "Pickup Info", "3": "Photo & Review" },
          "step_titles": { "food_details": "Tell us about the food", "pickup_info": "When and where to pick up?", "add_photo": "Add a photo (optional)" },
          "form_labels": { "foodType": "Food Type *", "quantity": "Quantity *", "category": "Category *", "description": "Description", "freshUntil": "Fresh Until *", "pickupTime": "Preferred Pickup Time *", "location": "Pickup Location *", "contact": "Contact Information *", "photo": "Food Photo" },
          "placeholders": { "foodType": "e.g., Pizza, Sandwiches, Fruits", "quantity": "e.g., 10 portions", "description": "Additional details about the food...", "location": "Address or landmark", "contact": "Phone number or email", "fileUpload": "Drag & drop your image here or click to browse", "supports": "Supports: JPG, PNG, GIF (Max 5MB)" },
          "buttons": { "previous": "Previous", "cancel": "Cancel", "next": "Next", "submit": "Add Listing", "loading": "Loading ShareBite..." }
        },
        "claimed": "Claimed",
        "claim_food": "Claim Food",
        "switch_to_collector": "Switch to Collector",
        "login_to_claim": "Login to Claim",
        "no_listings_found": "No listings found",
        "no_listings_try": "Try adjusting your filters or search terms.",
        "time": { "minutesAgo": "{n}m ago", "hoursAgo": "{n}h ago", "daysAgo": "{n}d ago", "hoursLeft": "{n}h left", "daysLeft": "{n}d left" },
        "quantity_units": { "slices": "slices", "sandwiches": "sandwiches", "portions": "portions", "items": "items" }
      },
      "testimonials": {
        "title": "What People Say",
        "subtitle": "Real stories from our amazing community",
        "card1": { "author": "Sarah Johnson", "role": "Restaurant Owner", "quote": "ShareBite has transformed how we handle excess food at our restaurant. Instead of wasting perfectly good meals, we now connect with local shelters. It feels amazing to make a real difference!", "location": "New York, USA", "member_since": "Member since 2023" },
        "card2": { "author": "Michael Chen", "role": "NGO Coordinator", "quote": "This platform has been a game-changer for our food distribution efforts. We can now reach more families in need and coordinate pickups seamlessly. The impact on our community has been tremendous!", "location": "San Francisco, USA", "member_since": "Member since 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "Volunteer Coordinator", "quote": "As a volunteer, ShareBite makes it so easy to find and claim food donations. The notification system keeps me updated, and I love seeing the positive impact we're making together in reducing food waste.", "location": "Chicago, USA", "member_since": "Member since 2023" },
        "stats": { "active_users": "Active Users", "average_rating": "Average Rating", "satisfaction_rate": "Satisfaction Rate" }
      },
      "about": {
        "title": "About ShareBite",
        "description": "ShareBite is a revolutionary platform designed to tackle food waste while addressing hunger in communities. We believe that fresh, good food should never go to waste when there are people who need it.",
        "impact": { "environmental_title": "Environmental Impact", "environmental_text": "Reducing carbon footprint through waste reduction", "community_title": "Community Support", "community_text": "Connecting businesses with local communities", "growth_title": "Sustainable Growth", "growth_text": "Building a sustainable food ecosystem" },
        "stats": { "percent_label": "Food Waste Reduced" }
      }
    },
    "fr": {
      "contact": {
        "title": "📞 Contactez-nous",
        "question": "💬 Avez-vous une question ?",
        "fillForm": "Remplissez le formulaire ci-dessous pour commencer",
        "form": {
          "name": "Nom complet:",
          "name_placeholder": "Entrez votre nom complet",
          "email": "E-mail:",
          "email_placeholder": "Entrez votre e-mail",
          "message": "Message:",
          "message_placeholder": "Tapez votre message",
          "submit": "Envoyer"
        },
        "getInTouch": "Contactez-nous",
        "getInTouchText": "Nous aimons avoir de vos nouvelles. Notre équipe est toujours là pour répondre à vos questions.",
        "address": "Adresse:",
        "address_value": "ShareBite Building, Noida, India",
        "phone_label": "Tél :",
        "phone_value": "+91 8888889999",
        "email_label": "E-mail:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "Fait avec 💚 par Angela Bera",
        "cursorTrailLabel": "Trace du curseur",
        "copyright": "© 2025 ShareBite. Tous droits réservés.",
        "license": "Licence"
      },
      "toast": { "welcome": "Bienvenue, {name} ! 🎉" },
      "nav": { "home": "Accueil", "features": "Fonctionnalités", "listings": "Listes", "about": "À propos", "contact": "Contact" },
      "hero": { "line1": "Réduire le gaspillage alimentaire,", "line2": "Nourrir les communautés", "description": "Connectez les restaurants et les ménages aux ONG et aux bénévoles pour redistribuer les restes alimentaires frais et lutter contre la faim tout en réduisant le gaspillage.", "donate": "Faire un don de nourriture", "find": "Trouver de la nourriture", "help": "Aider les autres" },
      "features": { "title": "Comment fonctionne ShareBite", "subtitle": "Étapes simples pour faire la différence", "step1": { "title": "Listez votre nourriture", "desc": "Les restaurants et les ménages peuvent facilement lister les restes alimentaires frais avec des détails sur la quantité, le type et le lieu de collecte.", "stepLabel": "Étape 1" }, "step2": { "title": "Se connecter et coordonner", "desc": "Notre plateforme connecte les donateurs aux ONG, refuges et bénévoles pour une coordination de collecte fluide.", "stepLabel": "Étape 2" }, "step3": { "title": "Nourrir les communautés", "desc": "La nourriture collectée atteint ceux qui en ont le plus besoin, réduisant le gaspillage tout en luttant contre la faim locale.", "stepLabel": "Étape 3" } },
      "role": { "donor": "Donneur", "collector": "Collecteur" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "Directives pour les donateurs", "subtitle": "Lignes directrices et conseils pour que les donateurs donnent de manière sûre et responsable." },
      "support": { "title": "Support", "contact_prompt": "Besoin d'aide ? Contactez notre équipe d'assistance et nous vous réponpondons sous peu.", "form_submit": "Envoyer" },
      "listings": {
        "title": "Annonces Alimentaires",
        "subtitle": "Nourriture disponible en attente de collecte",
        "filter": { "all": "Tous", "restaurant": "Restaurant", "household": "Ménage", "bakery": "Boulangerie", "event": "Événement" },
        "errors": { "invalid_image": "Veuillez télécharger un fichier image valide", "invalid_type": "Veuillez sélectionner un fichier image", "image_too_large": "La taille de l'image doit être inférieure à 5 Mo", "required_field": "Veuillez remplir le champ requis : {field}", "invalid_contact": "Veuillez entrer une adresse e-mail ou un numéro de téléphone valide", "fresh_date_future": "La date \"frais jusqu'à\" doit être dans le futur." },
        "success": { "added": "Annonce de nourriture ajoutée avec succès !" },
        "dietaryFilters": "Filtres alimentaires",
        "dietary": { "vegetarian": "Végétarien", "vegan": "Végétalien", "gluten-free": "Sans gluten", "dairy-free": "Sans produits laitiers", "non-vegetarian": "Non-végétarien", "nut-free": "Sans noix" },
        "search_placeholder": "Rechercher par emplacement ou type de nourriture...",
        "add_listing": "Ajouter une annonce",
        "learn_more": "Explorer",
        "notification": { "header": "Articles réclamés", "no_items": "Aucun article réclamé pour le moment", "empty_prompt": "Emparez-vous des éléments alimentaires pour les voir ici" },
        "modal": {
          "title": "Ajouter une annonce de nourriture",
          "steps": { "1": "Détails de la nourriture", "2": "Infos de ramassage", "3": "Photo et révision" },
          "step_titles": { "food_details": "Parlez-nous de la nourriture", "pickup_info": "Quand et où récupérer ?", "add_photo": "Ajouter une photo (optionnel)" },
          "form_labels": { "foodType": "Type d'aliment *", "quantity": "Quantité *", "category": "Catégorie *", "description": "Description", "freshUntil": "Frais jusqu'à *", "pickupTime": "Heure de retrait préférée *", "location": "Lieu de retrait *", "contact": "Informations de contact *", "photo": "Photo de l'aliment" },
          "placeholders": { "foodType": "ex. Pizza, Sandwichs, Fruits", "quantity": "ex. 10 portions", "description": "Détails supplémentaires sur la nourriture...", "location": "Adresse ou point de repère", "contact": "Numéro de téléphone ou e-mail", "fileUpload": "Glisser-déposer votre image ici ou cliquez pour parcourir", "supports": "Formats pris en charge : JPG, PNG, GIF (Max 5MB)" },
          "buttons": { "previous": "Précédent", "cancel": "Annuler", "next": "Suivant", "submit": "Ajouter", "loading": "Chargement de ShareBite..." }
        },
        "claimed": "Réclamé",
        "claim_food": "Réclamer la nourriture",
        "switch_to_collector": "Basculer sur Collecteur",
        "login_to_claim": "Connectez-vous pour réclamer",
        "no_listings_found": "Aucune annonce trouvée",
        "no_listings_try": "Essayez d'ajuster vos filtres ou vos termes de recherche.",
        "time": { "minutesAgo": "il y a {n}m", "hoursAgo": "il y a {n}h", "daysAgo": "il y a {n}j", "hoursLeft": "{n}h restants", "daysLeft": "{n}j restants" },
        "quantity_units": { "slices": "tranches", "sandwiches": "sándwiches", "portions": "portions", "items": "articles" }
      },
      "testimonials": {
        "title": "Ce que disent les gens",
        "subtitle": "Histoires réelles de notre incroyable communauté",
        "card1": { "author": "Sarah Johnson", "role": "Propriétaire de restaurant", "quote": "ShareBite a transformé la façon dont nous gérons les excédents alimentaires dans notre restaurant. Au lieu de gaspiller des repas tout à fait bons, nous nous connectons désormais aux refuges locaux. C'est incroyable de faire une vraie différence !", "location": "New York, États-Unis", "member_since": "Membre depuis 2023" },
        "card2": { "author": "Michael Chen", "role": "Coordinateur d'ONG", "quote": "Cette plateforme a changé la donne pour nos efforts de distribution alimentaire. Nous pouvons désormais atteindre plus de familles dans le besoin et coordonner les ramassages sans heurts. L'impact sur notre communauté a été énorme !", "location": "San Francisco, États-Unis", "member_since": "Membre depuis 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "Coordinatrice des bénévoles", "quote": "En tant que bénévole, ShareBite facilite grandement la recherche et la réclamation des dons alimentaires. Le système de notification me tient informée, et j'adore voir l'impact positif que nous avons en réduisant le gaspillage alimentaire.", "location": "Chicago, États-Unis", "member_since": "Membre depuis 2023" },
        "stats": { "active_users": "Utilisateurs actifs", "average_rating": "Note moyenne", "satisfaction_rate": "Taux de satisfaction" }
      },
      "about": {
        "title": "À propos de ShareBite",
        "description": "ShareBite est une plateforme révolutionnaire conçue pour lutter contre le gaspillage alimentaire tout en s'attaquant à la faim dans les communautés. Nous croyons que la nourriture fraîche et bonne ne devrait jamais être gaspillée lorsqu'il y a des personnes qui en ont besoin.",
        "impact": { "environmental_title": "Impact environnemental", "environmental_text": "Réduction de l'empreinte carbone grâce à la réduction des déchets", "community_title": "Soutien communautaire", "community_text": "Relier les entreprises aux communautés locales", "growth_title": "Croissance durable", "growth_text": "Construire un écosystème alimentaire durable" },
        "stats": { "percent_label": "Réduction du gaspillage alimentaire" }
      }
    },
    "hi": {
      "contact": {
        "title": "📞 हमसे संपर्क करें",
        "question": "💬 क्या आपका कोई प्रश्न है?",
        "fillForm": "शुरू करने के लिए नीचे दिया गया फॉर्म भरें",
        "form": {
          "name": "पूरा नाम:",
          "name_placeholder": "अपना पूरा नाम दर्ज करें",
          "email": "ईमेल:",
          "email_placeholder": "अपना ईमेल दर्ज करें",
          "message": "संदेश:",
          "message_placeholder": "अपना संदेश लिखें",
          "submit": "भेजें"
        },
        "getInTouch": "संपर्क करें",
        "getInTouchText": "हमें आपसे सुनकर खुशी होगी। हमारी टीम हमेशा आपके प्रश्नों का उत्तर देने के लिए तैयार है।",
        "address": "पता:",
        "address_value": "ShareBite बिल्डिंग, नोएडा, इंडिया",
        "phone_label": "फ़ोन नंबर:",
        "phone_value": "+91 8888889999",
        "email_label": "ईमेल:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "💚 के साथ बनाया गया - Angela Bera",
        "cursorTrailLabel": "कर्सर ट्रेल",
        "copyright": "© 2025 ShareBite। सर्वाधिकार सुरक्षित।",
        "license": "लाइसेंस"
      },
      "toast": { "welcome": "स्वागत है, {name}! 🎉" },
      "nav": { "home": "होम", "features": "विशेषताएं", "listings": "सूचियाँ", "about": "हमारे बारे में", "contact": "संपर्क" },
      "hero": { "line1": "खाद्य अपशिष्ट कम करें,", "line2": "समुदायों को खिलाएँ", "description": "रेस्तरां और घरों को एनजीओ और स्वयंसेवकों से जोड़ें ताकि ताजा बचा हुआ भोजन पुनर्वितरित किया जा सके और कचरे को कम करते हुए भूख से लड़ने में मदद मिले.", "donate": "भोजन दान करें", "find": "भोजन खोजें", "help": "दूसरों की मदद करें" },
      "features": { "title": "ShareBite कैसे काम करता है", "subtitle": "फर्क डालने के सरल चरण", "step1": { "title": "अपना भोजन सूचीबद्ध करें", "desc": "रेस्तरां और घर आसानी से ताजा बचा हुआ भोजन सूचीबद्ध कर सकते हैं जिसमें मात्रा, प्रकार और पिकअप स्थान का विवरण होता है।", "stepLabel": "चरण 1" }, "step2": { "title": "जुड़ें और समन्वय करें", "desc": "हमारा प्लेटफ़ॉर्म दाताओं को NGOs, आश्रयों और स्वयंसेवकों से जोड़ता है ताकि पिकअप समन्वय सहज हो।", "stepLabel": "चरण 2" }, "step3": { "title": "समुदायों को खिलाएँ", "desc": "एकत्र किया गया भोजन उन लोगों तक पहुँचता है जिन्हें इसकी सबसे अधिक आवश्यकता है, कचरे को कम करते हुए स्थानीय समुदायों में भूख से लड़ता है।", "stepLabel": "चरण 3" } },
      "role": { "donor": "दाता", "collector": "संग्रहकर्ता" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "दानकर्ता दिशानिर्देश", "subtitle": "दान करने के लिए सुरक्षित और जिम्मेदार तरीके के लिए दिशानिर्देश और सुझाव।" },
      "support": { "title": "समर्थन", "contact_prompt": "मदद चाहिए? हमारी सहायता टीम से संपर्क करें और हम शीघ्र उत्तर देंगे।", "form_submit": "संदेश भेजें" },
      "listings": {
        "title": "खाद्य सूची",
        "subtitle": "उपलब्ध भोजन जो संग्रह के लिए प्रतीक्षा कर रहा है",
        "filter": { "all": "सभी", "restaurant": "रेस्टोरेंट", "household": "घरेलू", "bakery": "बेकरी", "event": "इवेंट" },
        "errors": { "invalid_image": "कृपया एक वैध इमेज फ़ाइल अपलोड करें", "invalid_type": "कृपया एक इमेज फ़ाइल चुनें", "image_too_large": "छवि का आकार 5MB से कम होना चाहिए", "required_field": "कृपया आवश्यक फ़ील्ड भरें: {field}", "invalid_contact": "कृपया एक मान्य ईमेल पता या फोन नंबर दर्ज करें", "fresh_date_future": "'ताज़ा रहेगा तक' तिथि भविष्य में होनी चाहिए." },
        "success": { "added": "भोजन सूची सफलतापूर्वक जोड़ी गई!" },
        "dietaryFilters": "आहार फ़िल्टर",
        "dietary": { "vegetarian": "शाकाहारी", "vegan": "वीगन", "gluten-free": "ग्लूटेन-फ्री", "dairy-free": "डेयरी-फ्री", "non-vegetarian": "गैर-शाकाहारी", "nut-free": "नट-फ्री" },
        "search_placeholder": "स्थान या भोजन प्रकार द्वारा खोजें...",
        "add_listing": "सूची जोड़ें",
        "learn_more": "और जानें",
        "notification": { "header": "दावे किए गए खाद्य आइटम", "no_items": "अभी तक कोई दाबी नहीं", "empty_prompt": "यहां देखने के लिए खाद्य आइटम दावा करना शुरू करें" },
        "modal": {
          "title": "खाद्य सूची जोड़ें",
          "steps": { "1": "भोजन विवरण", "2": "पिकअप जानकारी", "3": "फ़ोटो और समीक्षा" },
          "step_titles": { "food_details": "हमें भोजन के बारे में बताएं", "pickup_info": "कब और कहाँ उठाना है?", "add_photo": "एक फ़ोटो जोड़ें (वैकल्पिक)" },
          "form_labels": { "foodType": "भोजन प्रकार *", "quantity": "मात्रा *", "category": "वर्ग *", "description": "विवरण", "freshUntil": "ताज़ा रहेगा तक *", "pickupTime": "पसंदीदा पिकअप समय *", "location": "पिकअप स्थान *", "contact": "संपर्क जानकारी *", "photo": "भोजन फ़ोटो" },
          "placeholders": { "foodType": "उदा., पिज़्ज़ा, सैंडविच, फल", "quantity": "उदा., 10 भाग", "description": "भोजन के बारे में अतिरिक्त विवरण...", "location": "पता या लैंडमार्क", "contact": "फ़ोन नंबर या ईमेल", "fileUpload": "अपनी छवि यहां ड्रैग और ड्रॉप करें या ब्राउज़ करने के लिए क्लिक करें", "supports": "समर्थित: JPG, PNG, GIF (अधिकतम 5MB)" },
          "buttons": { "previous": "पिछला", "cancel": "रद्द करें", "next": "अगला", "submit": "सूची जोड़ें", "loading": "ShareBite लोड हो रहा है..." }
        },
        "claimed": "दावे किया गया",
        "claim_food": "भोजन का दावा करें",
        "switch_to_collector": "संग्रहकर्ता में स्विच करें",
        "login_to_claim": "दावा करने के लिए लॉगिन करें",
        "no_listings_found": "कोई सूची नहीं मिली",
        "no_listings_try": "कृपया अपने फ़िल्टर या खोज शब्द समायोजित करें।",
        "time": { "minutesAgo": "{n}म पहले", "hoursAgo": "{n}घ पहले", "daysAgo": "{n}दिन पहले", "hoursLeft": "{n}घंटे शेष", "daysLeft": "{n}दिन शेष" },
        "quantity_units": { "slices": "टुकड़े", "sandwiches": "सैंडविच", "portions": "पोर्टियंस", "items": "आइटम" }
      },
      "testimonials": {
        "title": "लोग क्या कहते हैं",
        "subtitle": "हमारे अद्भुत समुदाय की वास्तविक कहानियाँ",
        "card1": { "author": "Sarah Johnson", "role": "रेस्टोरेंट मालिक", "quote": "ShareBite ने हमारे रेस्तरां में अतिरिक्त भोजन को संभालने के तरीके को बदल दिया है। बिल्कुल अच्छे भोजन को व्यर्थ होने के बजाय, अब हम स्थानीय आश्रयों से जुड़ते हैं। यह वास्तव में फर्क डालना बहुत अच्छा महसूस होता है!", "location": "न्यूयॉर्क, यूएसए", "member_since": "सदस्य منذ 2023" },
        "card2": { "author": "Michael Chen", "role": "NGO समन्वयक", "quote": "यह प्लेटफ़ॉर्म हमारे खाद्य वितरण प्रयासों के लिए गेम-चेंजर रहा है। अब हम अधिक जरूरतमंद परिवारों तक पहुंच सकते हैं और पिकअप को सहजता से समन्वयित कर सकते हैं। हमारे समुदाय पर इसका प्रभाव बहुत बड़ा रहा है!", "location": "सैन फ्रांसिस्को, यूएसए", "member_since": "सदस्य منذ 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "स्वयंसेवक समन्वयक", "quote": "एक स्वयंसेवक के रूप में, ShareBite उपहार में दिए गए भोजन को ढूँढना और दावा करना इतना आसान बनाता है। नोटिफिकेशन सिस्टम मुझे अपडेट रखता है, और मुझे यह देखना पसंद है कि हम मिलकर खाद्य अपशिष्ट को कम करने में कितना सकारात्मक प्रभाव डाल रहे हैं।", "location": "शिकागो, यूएसए", "member_since": "सदस्य منذ 2023" },
        "stats": { "active_users": "सक्रिय उपयोगकर्ता", "average_rating": "औसत रेटिंग", "satisfaction_rate": "संतुष्टि दर" }
      },
      "about": {
        "title": "ShareBite के बारे में",
        "description": "ShareBite एक क्रांतिकारी प्लेटफ़ॉर्म है जिसे खाद्य अपशिष्ट से निपटने और समुदायों में भूख से लड़ने के लिए डिज़ाइन किया गया है। हम मानते हैं कि ताज़ा, अच्छा भोजन कभी व्यर्थ नहीं जाना चाहिए जब लोग इसकी ज़रूरत में हों।",
        "impact": { "environmental_title": "पर्यावरणीय प्रभाव", "environmental_text": "कचरे में कमी के माध्यम से कार्बन फुटप्रिंट में कमी", "community_title": "समुदाय समर्थन", "community_text": "व्यवसायों को स्थानीय समुदायों से जोड़ना", "growth_title": "स्थायी विकास", "growth_text": "एक स्थायी खाद्य पारिस्थितिकी तंत्र का निर्माण" },
        "stats": { "percent_label": "खाद्य अपशिष्ट कम हुआ" }
      }
    },
    "es": {
      "contact": {
        "title": "📞 Contáctanos",
        "question": "💬 ¿Tienes alguna pregunta?",
        "fillForm": "Complete el formulario a continuación para comenzar",
        "form": {
          "name": "Nombre completo:",
          "name_placeholder": "Ingrese su nombre completo",
          "email": "Correo electrónico:",
          "email_placeholder": "Ingrese su correo electrónico",
          "message": "Mensaje:",
          "message_placeholder": "Escribe tu mensaje",
          "submit": "Enviar"
        },
        "getInTouch": "Ponte en contacto",
        "getInTouchText": "Nos encantará saber de ti. Nuestro equipo siempre está aquí para responder tus preguntas.",
        "address": "Dirección:",
        "address_value": "ShareBite Building, Noida, India",
        "phone_label": "Teléfono:",
        "phone_value": "+91 8888889999",
        "email_label": "Correo electrónico:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "Hecho con 💚 por Angela Bera",
        "cursorTrailLabel": "Rastro del cursor",
        "copyright": "© 2025 ShareBite. Todos los derechos reservados.",
        "license": "Licencia"
      },
      "toast": { "welcome": "Bienvenido, {name}! 🎉" },
      "nav": { "home": "Inicio", "features": "Funcionalidades", "listings": "Listados", "about": "Acerca de", "contact": "Contacto" },
      "hero": { "line1": "Reducir el desperdicio de alimentos,", "line2": "Alimentar comunidades", "description": "Conecta restaurantes y hogares con ONG y voluntarios para redistribuir alimentos frescos sobrantes y combatir el hambre mientras se reduce el desperdicio.", "donate": "Donar comida", "find": "Encontrar comida", "help": "Ayudar a otros" },
      "features": { "title": "Cómo funciona ShareBite", "subtitle": "Pasos simples para marcar la diferencia", "step1": { "title": "Enumera tu comida", "desc": "Los restaurantes y hogares pueden enumerar fácilmente los alimentos sobrantes frescos con detalles sobre la cantidad, el tipo y el lugar de recogida.", "stepLabel": "Paso 1" }, "step2": { "title": "Conectar y coordinar", "desc": "Nuestra plataforma conecta a los donantes con ONG, refugios y voluntarios para una coordinación fluida de recogida.", "stepLabel": "Paso 2" }, "step3": { "title": "Alimenta a las comunidades", "desc": "La comida recogida llega a quienes más la necesitan, reduciendo el desperdicio mientras se combate el hambre en las comunidades locales.", "stepLabel": "Paso 3" } },
      "role": { "donor": "Donante", "collector": "Receptor" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "Guía para donantes", "subtitle": "Guías y consejos para que los donantes donen de forma segura y responsable." },
      "support": { "title": "Soporte", "contact_prompt": "¿Necesitas ayuda? Ponte en contacto con nuestro equipo de soporte y te responderemos en breve.", "form_submit": "Enviar mensaje" },
      "listings": {
        "title": "Listados de Alimentos",
        "subtitle": "Alimentos disponibles esperando ser recogidos",
        "filter": { "all": "Todos", "restaurant": "Restaurante", "household": "Hogar", "bakery": "Panadería", "event": "Evento" },
        "errors": { "invalid_image": "Por favor sube un archivo de imagen válido", "invalid_type": "Por favor selecciona un archivo de imagen", "image_too_large": "El tamaño de la imagen debe ser menor a 5MB", "required_field": "Por favor completa el campo requerido: {field}", "invalid_contact": "Por favor introduce un correo electrónico o número de teléfono válido", "fresh_date_future": "La fecha 'fresco hasta' debe ser en el futuro." },
        "success": { "added": "¡Listado de alimentos agregado con éxito!" },
        "dietaryFilters": "Filtros dietéticos",
        "dietary": { "vegetarian": "Vegetariano", "vegan": "Vegano", "gluten-free": "Sin gluten", "dairy-free": "Sin lácteos", "non-vegetarian": "No vegetariano", "nut-free": "Sin frutos secos" },
        "search_placeholder": "Buscar por ubicación o tipo de comida...",
        "add_listing": "Agregar listado",
        "learn_more": "Explorar más",
        "notification": { "header": "Artículos reclamados", "no_items": "Aún no hay elementos reclamados", "empty_prompt": "Comienza a reclamar alimentos para verlos aquí" },
        "modal": {
          "title": "Agregar listado de alimentos",
          "steps": { "1": "Detalles de la comida", "2": "Información de recogida", "3": "Foto y revisión" },
          "step_titles": { "food_details": "Cuéntanos sobre la comida", "pickup_info": "¿Cuándo y dónde recoger?", "add_photo": "Agregar una foto (opcional)" },
          "form_labels": { "foodType": "Tipo de comida *", "quantity": "Cantidad *", "category": "Categoría *", "description": "Descripción", "freshUntil": "Fresco hasta *", "pickupTime": "Hora preferida de recogida *", "location": "Lugar de recogida *", "contact": "Información de contacto *", "photo": "Foto de la comida" },
          "placeholders": { "foodType": "ej., Pizza, Sándwiches, Frutas", "quantity": "ej., 10 porciones", "description": "Detalles adicionales sobre la comida...", "location": "Dirección o referencia", "contact": "Número de teléfono o correo electrónico", "fileUpload": "Arrastra y suelta tu imagen aquí o haz clic para buscar", "supports": "Admite: JPG, PNG, GIF (Max 5MB)" },
          "buttons": { "previous": "Anterior", "cancel": "Cancelar", "next": "Siguiente", "submit": "Agregar listado", "loading": "Cargando ShareBite..." }
        },
        "claimed": "Reclamado",
        "claim_food": "Reclamar comida",
        "switch_to_collector": "Cambiar a Receptor",
        "login_to_claim": "Inicia sesión para reclamar",
        "no_listings_found": "No se encontraron listados",
        "no_listings_try": "Prueba ajustando tus filtros o términos de búsqueda.",
        "time": { "minutesAgo": "hace {n}m", "hoursAgo": "hace {n}h", "daysAgo": "hace {n}d", "hoursLeft": "{n}h restantes", "daysLeft": "{n}d restantes" },
        "quantity_units": { "slices": "porciones", "sandwiches": "sándwiches", "portions": "porciones", "items": "artículos" }
      },
      "testimonials": {
        "title": "Lo que dice la gente",
        "subtitle": "Historias reales de nuestra increíble comunidad",
        "card1": { "author": "Sarah Johnson", "role": "Propietaria de restaurante", "quote": "ShareBite ha transformado la forma en que manejamos el exceso de comida en nuestro restaurante. En lugar de desperdiciar comidas perfectamente buenas, ahora nos conectamos con refugios locales. ¡Es increíble hacer una diferencia real!", "location": "Nueva York, EE. UU.", "member_since": "Miembro desde 2023" },
        "card2": { "author": "Michael Chen", "role": "Coordinador de ONG", "quote": "Esta plataforma ha sido un cambio de juego para nuestros esfuerzos de distribución de alimentos. Ahora podemos llegar a más familias necesitadas y coordinar recogidas sin problemas. ¡El impacto en nuestra comunidad ha sido tremendo!", "location": "San Francisco, EE. UU.", "member_since": "Miembro desde 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "Coordinadora de voluntarios", "quote": "Como voluntaria, ShareBite facilita buscar y reclamar donaciones de alimentos. El sistema de notificaciones me mantiene actualizada, y me encanta ver el impacto positivo que estamos logrando juntos al reducir el desperdicio de alimentos.", "location": "Chicago, EE. UU.", "member_since": "Miembro desde 2023" },
        "stats": { "active_users": "Usuarios activos", "average_rating": "Valoración media", "satisfaction_rate": "Tasa de satisfacción" }
      },
      "about": {
        "title": "Acerca de ShareBite",
        "description": "ShareBite es una plataforma revolucionaria diseñada para abordar el desperdicio de alimentos mientras se combate el hambre en las comunidades. Creemos que la comida fresca y buena nunca debería desperdiciarse cuando hay personas que la necesitan.",
        "impact": { "environmental_title": "Impacto ambiental", "environmental_text": "Reducción de la huella de carbono mediante la reducción de residuos", "community_title": "Apoyo comunitario", "community_text": "Conectar empresas con comunidades locales", "growth_title": "Crecimiento sostenible", "growth_text": "Construir un ecosistema alimentario sostenible" },
        "stats": { "percent_label": "Desperdicio de alimentos reducido" }
      }
    },
    "zh": {
      "contact": {
        "title": "📞 联系我们",
        "question": "💬 您有问题吗？",
        "fillForm": "填写下面的表格以开始",
        "form": {
          "name": "全名:",
          "name_placeholder": "输入您的全名",
          "email": "电子邮件:",
          "email_placeholder": "输入您的电子邮件",
          "message": "留言:",
          "message_placeholder": "输入您的留言",
          "submit": "发送"
        },
        "getInTouch": "联系我们",
        "getInTouchText": "我们很乐意听到您的消息。我们的团队随时为您解答疑问。",
        "address": "地址:",
        "address_value": "ShareBite 大楼，诺伊达，印度",
        "phone_label": "电话:",
        "phone_value": "+91 8888889999",
        "email_label": "电子邮件:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "由 Angela Bera 用 💚 制作",
        "cursorTrailLabel": "光标轨迹",
        "copyright": "© 2025 ShareBite。版权所有。",
        "license": "许可证"
      },
      "toast": { "welcome": "欢迎, {name}! 🎉" },
      "nav": { "home": "首页", "features": "功能", "listings": "列表", "about": "关于", "contact": "联系" },
      "hero": { "line1": "减少食物浪费，", "line2": "喂养社区", "description": "将餐厅和家庭与非政府组织和志愿者联系起来，重新分配新鲜的剩余食物，在减少浪费的同时解决饥饿问题。", "donate": "捐赠食物", "find": "查找食物", "help": "帮助他人" },
      "features": { "title": "ShareBite 的工作方式", "subtitle": "简单的步骤来创造影响", "step1": { "title": "列出你的食物", "desc": "餐厅和家庭可以轻松列出新鲜的剩余食物，并提供数量、类型和取货地点等详细信息。", "stepLabel": "步骤 1" }, "step2": { "title": "连接与协调", "desc": "我们的平台将捐赠者与 NGO、收容所和志愿者连接起来，以实现无缝的取货协调。", "stepLabel": "步骤 2" }, "step3": { "title": "喂养社区", "desc": "收集到的食物送到最需要它的人手中，在本地社区中减少浪费并对抗饥饿。", "stepLabel": "步骤 3" } },
      "role": { "donor": "捐赠者", "collector": "领取者" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "捐赠者指南", "subtitle": "为捐赠者提供安全且负责任的捐赠指南和提示。" },
      "support": { "title": "支持", "contact_prompt": "需要帮助吗？请联系我们的支持团队，我们会尽快回复。", "form_submit": "发送消息" },
      "listings": {
        "title": "食物列表",
        "subtitle": "可供领取的食物",
        "filter": { "all": "全部", "restaurant": "餐厅", "household": "家庭", "bakery": "面包店", "event": "活动" },
        "errors": { "invalid_image": "请上传有效的图片文件", "invalid_type": "请选择图片文件", "image_too_large": "图片大小应小于5MB", "required_field": "请填写必填字段：{field}", "invalid_contact": "请输入有效的电子邮件地址或电话号码", "fresh_date_future": "“新鲜至”日期必须是将来的时间。" },
        "success": { "added": "食物列表添加成功！" },
        "dietaryFilters": "饮食筛选",
        "dietary": { "vegetarian": "素食", "vegan": "纯素", "gluten-free": "无麸质", "dairy-free": "无乳制品", "non-vegetarian": "非素食", "nut-free": "无坚果" },
        "search_placeholder": "按位置或食物类型搜索...",
        "add_listing": "添加列表",
        "learn_more": "探索更多",
        "notification": { "header": "已认领的食品", "no_items": "还没有认领的物品", "empty_prompt": "开始认领食品以在此处查看" },
        "modal": {
          "title": "添加食物列表",
          "steps": { "1": "食物详情", "2": "取货信息", "3": "照片与审核" },
          "step_titles": { "food_details": "告诉我们关于食物的情况", "pickup_info": "何时以及在哪里取货？", "add_photo": "添加照片（可选）" },
          "form_labels": { "foodType": "食物类型 *", "quantity": "数量 *", "category": "类别 *", "description": "描述", "freshUntil": "新鲜至 *", "pickupTime": "首选取货时间 *", "location": "取货地点 *", "contact": "联系信息 *", "photo": "食物照片" },
          "placeholders": { "foodType": "例如：披萨，三明治，水果", "quantity": "例如：10 份", "description": "有关食物的更多信息...", "location": "地址或地标", "contact": "电话号码或电子邮件", "fileUpload": "将你的图片拖放到此处或点击浏览", "supports": "支持：JPG、PNG、GIF（最大 5MB）" },
          "buttons": { "previous": "上一步", "cancel": "取消", "next": "下一步", "submit": "添加列表", "loading": "正在加载 ShareBite..." }
        },
        "claimed": "已认领",
        "claim_food": "认领食物",
        "switch_to_collector": "切换为领取者",
        "login_to_claim": "登录以认领",
        "no_listings_found": "未找到列表",
        "no_listings_try": "请尝试调整筛选器或搜索词。",
        "time": { "minutesAgo": "{n}分钟前", "hoursAgo": "{n}小时前", "daysAgo": "{n}天前", "hoursLeft": "剩余 {n}小时", "daysLeft": "剩余 {n}天" },
        "quantity_units": { "slices": "片", "sandwiches": "三明治", "portions": "份", "items": "件" }
      },
      "testimonials": {
        "title": "人们怎么说",
        "subtitle": "我们了不起的社区的真实故事",
        "card1": { "author": "Sarah Johnson", "role": "餐厅老板", "quote": "ShareBite 改变了我们处理餐厅剩余食物的方式。我们不再浪费完全可以食用的餐点，而是与当地收容机构建立联系。能真正产生影响，感觉真好！", "location": "美国 纽约", "member_since": "自 2023 年起会员" },
        "card2": { "author": "Michael Chen", "role": "非营利组织协调员", "quote": "该平台对我们的食物分配工作来说是一个改变游戏规则的工具。我们现在可以覆盖更多有需要的家庭并无缝协调取货。对我们社区的影响巨大！", "location": "美国 旧金山", "member_since": "自 2022 年起会员" },
        "card3": { "author": "Emily Rodriguez", "role": "志愿者协调员", "quote": "作为一名志愿者，ShareBite 让查找和认领食物捐赠变得如此简单。通知系统会及时更新我，我很喜欢看到我们共同减少食物浪费所带来的积极影响。", "location": "美国 芝加哥", "member_since": "自 2023 年起会员" },
        "stats": { "active_users": "活跃用户", "average_rating": "平均评分", "satisfaction_rate": "满意度" }
      },
      "about": {
        "title": "关于 ShareBite",
        "description": "ShareBite 是一个旨在解决食物浪费并应对社区饥饿的革命性平台。我们相信新鲜、可食用的食物在有人需要时不应被浪费。",
        "impact": { "environmental_title": "环境影响", "environmental_text": "通过减少浪费来降低碳足迹", "community_title": "社区支持", "community_text": "将企业与当地社区连接起来", "growth_title": "可持续增长", "growth_text": "建设可持续的食品生态系统" },
        "stats": { "percent_label": "减少的食物浪费" }
      }
    },
    "pt": {
      "contact": {
        "title": "📞 Contate-nos",
        "question": "💬 Você tem alguma pergunta?",
        "fillForm": "Preencha o formulário abaixo para começar",
        "form": {
          "name": "Nome completo:",
          "name_placeholder": "Digite seu nome completo",
          "email": "E-mail:",
          "email_placeholder": "Digite seu e-mail",
          "message": "Mensagem:",
          "message_placeholder": "Digite sua mensagem",
          "submit": "Enviar"
        },
        "getInTouch": "Entre em contato",
        "getInTouchText": "Adoramos ouvir de você. Nossa equipe está sempre aqui para responder às suas perguntas.",
        "address": "Endereço:",
        "address_value": "ShareBite Building, Noida, India",
        "phone_label": "Telefone:",
        "phone_value": "+91 8888889999",
        "email_label": "E-mail:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "Feito com 💚 por Angela Bera",
        "cursorTrailLabel": "Rastro do cursor",
        "copyright": "© 2025 ShareBite. Todos os direitos reservados.",
        "license": "Licença"
      },
      "toast": { "welcome": "Bem-vindo, {name}! 🎉" },
      "nav": { "home": "Início", "features": "Recursos", "listings": "Listagens", "about": "Sobre", "contact": "Contato" },
      "hero": { "line1": "Reduzir o desperdício de alimentos,", "line2": "Alimentar comunidades", "description": "Conecte restaurantes e residências com ONGs e voluntários para redistribuir alimentos frescos excedentes e combater a fome enquanto reduz o desperdício.", "donate": "Doar comida", "find": "Encontrar comida", "help": "Ajudar outros" },
      "features": { "title": "Como o ShareBite funciona", "subtitle": "Passos simples para fazer a diferença", "step1": { "title": "Liste sua comida", "desc": "Restaurantes e residências podem listar facilmente alimentos frescos excedentes com detalhes sobre quantidade, tipo e local de retirada.", "stepLabel": "Passo 1" }, "step2": { "title": "Conectar e coordenar", "desc": "Nossa plataforma conecta doadores com ONGs, abrigos e voluntários para coordenação de retirada sem complicações.", "stepLabel": "Passo 2" }, "step3": { "title": "Alimentar comunidades", "desc": "Os alimentos coletados chegam a quem mais precisa, reduzindo o desperdício enquanto combate a fome nas comunidades locais.", "stepLabel": "Passo 3" } },
      "role": { "donor": "Doador", "collector": "Coletor" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "Diretrizes para Doadores", "subtitle": "Diretrizes e dicas para os doadores doarem de forma segura e responsável." },
      "support": { "title": "Suporte", "contact_prompt": "Precisa de ajuda? Entre em contato com nossa equipe de suporte e responderemos em breve.", "form_submit": "Enviar mensagem" },
      "listings": {
        "title": "Listagens de Alimentos",
        "subtitle": "Alimentos disponíveis aguardando coleta",
        "filter": { "all": "Todos", "restaurant": "Restaurante", "household": "Residência", "bakery": "Padaria", "event": "Evento" },
        "errors": { "invalid_image": "Por favor envie um arquivo de imagem válido", "invalid_type": "Por favor selecione um arquivo de imagem", "image_too_large": "O tamanho da imagem deve ser menor que 5MB", "required_field": "Por favor preencha o campo obrigatório: {field}", "invalid_contact": "Por favor insira um e-mail ou número de telefone válido", "fresh_date_future": "A data de 'fresco até' deve estar no futuro." },
        "success": { "added": "Listagem de alimentos adicionada com sucesso!" },
        "dietaryFilters": "Filtros dietéticos",
        "dietary": { "vegetarian": "Vegetariano", "vegan": "Vegano", "gluten-free": "Sem glúten", "dairy-free": "Sem laticínios", "non-vegetarian": "Não vegetariano", "nut-free": "Sem nozes" },
        "search_placeholder": "Pesquisar por localização ou tipo de comida...",
        "add_listing": "Adicionar listagem",
        "learn_more": "Explorar mais",
        "notification": { "header": "Itens reivindicados", "no_items": "Ainda não há itens reivindicados", "empty_prompt": "Comece a reivindicar alimentos para vê-los aqui" },
        "modal": {
          "title": "Adicionar listagem de alimentos",
          "steps": { "1": "Detalhes da comida", "2": "Informações de retirada", "3": "Foto e revisão" },
          "step_titles": { "food_details": "Conte-nos sobre a comida", "pickup_info": "Quando e onde retirar?", "add_photo": "Adicionar uma foto (opcional)" },
          "form_labels": { "foodType": "Tipo de comida *", "quantity": "Quantidade *", "category": "Categoria *", "description": "Descrição", "freshUntil": "Fresco até *", "pickupTime": "Hora preferida de retirada *", "location": "Local de retirada *", "contact": "Informações de contato *", "photo": "Foto da comida" },
          "placeholders": { "foodType": "ex., Pizza, Sanduíches, Frutas", "quantity": "ex., 10 porções", "description": "Detalhes adicionais sobre a comida...", "location": "Endereço ou ponto de referência", "contact": "Número de telefone ou e-mail", "fileUpload": "Arraste e solte sua imagem aqui ou clique para procurar", "supports": "Suporta: JPG, PNG, GIF (Máx 5MB)" },
          "buttons": { "previous": "Anterior", "cancel": "Cancelar", "next": "Próximo", "submit": "Adicionar listagem", "loading": "Carregando ShareBite..." }
        },
        "claimed": "Listagem Reclamada",
        "claim_food": "Reivindicar comida",
        "switch_to_collector": "Mudar para Coletor",
        "login_to_claim": "Faça login para reivindicar",
        "no_listings_found": "Nenhuma listagem encontrada",
        "no_listings_try": "Tente ajustar seus filtros ou termos de pesquisa.",
        "time": { "minutesAgo": "há {n}m", "hoursAgo": "há {n}h", "daysAgo": "há {n}d", "hoursLeft": "{n}h restantes", "daysLeft": "{n}d restantes" },
        "quantity_units": { "slices": "fatias", "sandwiches": "sanduíches", "portions": "porções", "items": "itens" }
      },
      "testimonials": {
        "title": "O que as pessoas dizem",
        "subtitle": "Histórias reais da nossa incrível comunidade",
        "card1": { "author": "Sarah Johnson", "role": "Proprietária de restaurante", "quote": "O ShareBite transformou a forma como lidamos com o excesso de comida no nosso restaurante. Em vez de desperdiçar refeições perfeitamente boas, agora conectamo-nos com abrigos locais. É incrível fazer uma diferença real!", "location": "Nova Iorque, EUA", "member_since": "Membro desde 2023" },
        "card2": { "author": "Michael Chen", "role": "Coordenador de ONG", "quote": "Esta plataforma mudou completamente os nossos esforços de distribuição de alimentos. Agora podemos alcançar mais famílias necessitadas e coordenar recolhas sem problemas. O impacto na nossa comunidade tem sido enorme!", "location": "São Francisco, EUA", "member_since": "Membro desde 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "Coordenadora de voluntários", "quote": "Como voluntária, o ShareBite facilita muito encontrar e reivindicar doações de alimentos. O sistema de notificações mantém-me atualizada, e adoro ver o impacto positivo que estamos a ter juntos na redução do desperdício de alimentos.", "location": "Chicago, EUA", "member_since": "Membro desde 2023" },
        "stats": { "active_users": "Usuários ativos", "average_rating": "Avaliação média", "satisfaction_rate": "Taxa de satisfação" }
      },
      "about": {
        "title": "Sobre o ShareBite",
        "description": "ShareBite é uma plataforma revolucionária projetada para combater o desperdício de alimentos ao mesmo tempo em que enfrenta a fome nas comunidades. Acreditamos que comida fresca e boa nunca deve ser desperdiçada quando há pessoas que precisam.",
        "impact": { "environmental_title": "Impacto ambiental", "environmental_text": "Redução da pegada de carbono por meio da redução de resíduos", "community_title": "Apoio à comunidade", "community_text": "Conectando empresas com comunidades locais", "growth_title": "Crescimento sustentável", "growth_text": "Construindo um ecossistema alimentar sustentável" },
        "stats": { "percent_label": "Desperdício de alimentos reduzido" }
      }
    },
    "ar": {
      "contact": {
        "title": "📞 اتصل بنا",
        "question": "💬 هل لديك سؤال؟",
        "fillForm": "املأ النموذج أدناه للبدء",
        "form": {
          "name": "الاسم الكامل:",
          "name_placeholder": "أدخل اسمك الكامل",
          "email": "البريد الإلكتروني:",
          "email_placeholder": "أدخل بريدك الإلكتروني",
          "message": "رسالة:",
          "message_placeholder": "اكتب رسالتك",
          "submit": "إرسال"
        },
        "getInTouch": "تواصل معنا",
        "getInTouchText": "نحب أن نسمع منك. فريقنا دائمًا هنا للإجابة على أسئلتك.",
        "address": "العنوان:",
        "address_value": "مبنى ShareBite، نويْدا، الهند",
        "phone_label": "رقم الهاتف:",
        "phone_value": "+91 8888889999",
        "email_label": "البريد الإلكتروني:",
        "email_value": "sharebite@support.com.ng"
      },
      "footer": {
        "madeBy": "تم الإنشاء بحب 💚 بواسطة Angela Bera",
        "cursorTrailLabel": "آثار المؤشر",
        "copyright": "© 2025 ShareBite. جميع الحقوق محفوظة.",
        "license": "الرخصة"
      },
      "toast": { "welcome": "مرحبًا، {name}! 🎉" },
      "nav": { "home": "الرئيسية", "features": "المميزات", "listings": "الإدراجات", "about": "معلومات عنا", "contact": "اتصل" },
      "hero": { "line1": "تقليل هدر الطعام،", "line2": "إطعام المجتمعات", "description": "ربط المطاعم والمنازل بالمنظمات غير الحكومية والمتطوعين لإعادة توزيع الطعام المتبقي الطازج ومحاربة الجوع مع تقليل الهدر.", "donate": "التبرع بالطعام", "find": "إيجاد طعام", "help": "مساعدة الآخرين" },
      "features": { "title": "كيف يعمل ShareBite", "subtitle": "خطوات بسيطة لإحداث فرق", "step1": { "title": "أدرج طعامك", "desc": "يمكن للمطاعم والمنازل إدراج بقايا الطعام الطازجة بسهولة مع تفاصيل حول الكمية والنوع وموقع الاستلام.", "stepLabel": "الخطوة 1" }, "step2": { "title": "الاتصال والتنسيق", "desc": "تربط منصتنا المتبرعين بالمنظمات غير الحكومية والملاجئ والمتطوعين لتنسيق استلام سلس.", "stepLabel": "الخطوة 2" }, "step3": { "title": "إطعام المجتمعات", "desc": "يصل الطعام الذي تم جمعه إلى أولئك الذين يحتاجون إليه أكثر، مما يقلل من النفايات بينما يحارب الجوع في المجتمعات المحلية.", "stepLabel": "الخطوة 3" } },
      "role": { "donor": "متبرع", "collector": "مستلم" },
      "volunteer": {
        "title_prefix": "Join as a",
        "title_role": "Volunteer",
        "title_suffix": "& Help Feed Communities",
        "subtitle": "Volunteers are the backbone of ShareBite. Help us deliver surplus food from restaurants and households to NGOs, shelters, and communities in need.",
        "cta_signup": "Sign Up Now",
        "cta_learn": "Learn More",
        "why_title": "Why Volunteer with Us?",
        "card1": { "title": "🤝 Community Impact", "text": "Every hour you spend volunteering helps feed families and reduce food waste in your city." },
        "card2": { "title": "📅 Flexible Schedule", "text": "Choose volunteering times that fit your lifestyle - weekends, weekdays, or both." },
        "card3": { "title": "🌍 Network & Growth", "text": "Meet like-minded people, NGOs, and organizations working together for a better tomorrow." },
        "signup_title": "Volunteer Sign Up",
        "form": {
          "name": "Full Name:",
          "name_placeholder": "Enter your full name",
          "email": "Email Address:",
          "email_placeholder": "Enter your email",
          "phone": "Phone Number:",
          "phone_placeholder": "Enter your phone number",
          "availability": "Availability",
          "select": "-- Select --",
          "weekdays": "Weekdays",
          "weekends": "Weekends",
          "both": "Both",
          "submit": "Submit"
        }
      },
      "donor": { "title": "إرشادات المتبرع", "subtitle": "إرشادات ونصائح للمتبرعين للتبرع بأمان وبمسؤولية." },
      "support": { "title": "الدعم", "contact_prompt": "هل تحتاج مساعدة؟ اتصل بفريق الدعم وسنعاود الاتصال بك قريبًا.", "form_submit": "إرسال رسالة" },
      "listings": {
        "title": "قوائم الطعام",
        "subtitle": "الطعام المتاح في انتظار الجَمْع",
        "filter": { "all": "الكل", "restaurant": "مطعم", "household": "منزلي", "bakery": "مخبز", "event": "فعالية" },
        "errors": { "invalid_image": "يرجى تحميل ملف صورة صالح", "invalid_type": "يرجى اختيار ملف صورة", "image_too_large": "يجب أن يكون حجم الصورة أقل من 5 ميجابايت", "required_field": "يرجى تعبئة الحقل المطلوب: {field}", "invalid_contact": "يرجى إدخال بريد إلكتروني أو رقم هاتف صالح", "fresh_date_future": "يجب أن تكونِ تاريخ \"طازج حتى\" في المستقبل." },
        "success": { "added": "تمت إضافة قائمة الطعام بنجاح!" },
        "dietaryFilters": "مرشحات النظام الغذائي",
        "dietary": { "vegetarian": "نباتي", "vegan": "نباتي صرف", "gluten-free": "خالٍ من الغلوتين", "dairy-free": "خالٍ من الألبان", "non-vegetarian": "غير نباتي", "nut-free": "خالٍ من المكسرات" },
        "search_placeholder": "البحث حسب الموقع أو نوع الطعام...",
        "add_listing": "إضافة قائمة",
        "learn_more": "استكشف المزيد",
        "notification": { "header": "العناصر المطالَب بها", "no_items": "لا توجد عناصر مطالَب بها حتى الآن", "empty_prompt": "ابدأ بالمطالبة بعناصر الطعام لعرضها هنا" },
        "modal": {
          "title": "إضافة قائمة طعام",
          "steps": { "1": "تفاصيل الطعام", "2": "معلومات الاستلام", "3": "صورة ومراجعة" },
          "step_titles": { "food_details": "أخبرنا عن الطعام", "pickup_info": "متى وأين يتم الالتقاط؟", "add_photo": "إضافة صورة (اختياري)" },
          "form_labels": { "foodType": "نوع الطعام *", "quantity": "الكمية *", "category": "الفئة *", "description": "الوصف", "freshUntil": "طازج حتى *", "pickupTime": "موعد الاستلام المفضل *", "location": "موقع الاستلام *", "contact": "معلومات الاتصال *", "photo": "صورة الطعام" },
          "placeholders": { "foodType": "مثل: بيتزا، شطائر، فواكه", "quantity": "مثل: 10 حصص", "description": "تفاصيل إضافية عن الطعام...", "location": "عنوان أو معلم", "contact": "رقم الهاتف أو البريد الإلكتروني", "fileUpload": "اسحب وأفلت صورتك هنا أو انقر للتصفح", "supports": "يدعم: JPG، PNG، GIF (الحد الأقصى 5MB)" },
          "buttons": { "previous": "السابق", "cancel": "إلغاء", "next": "التالي", "submit": "إضافة القائمة", "loading": "جارٍ تحميل ShareBite..." }
        },
        "claimed": "مطالَب به",
        "claim_food": "مطالبة بالطعام",
        "switch_to_collector": "التبديل إلى المستلم",
        "login_to_claim": "سجل الدخول للمطالبة",
        "no_listings_found": "لم يتم العثور على قوائم",
        "no_listings_try": "حاول ضبط الفلاتر أو مصطلحات البحث الخاصة بك.",
        "time": { "minutesAgo": "منذ {n}د", "hoursAgo": "منذ {n}س", "daysAgo": "منذ {n}ي", "hoursLeft": "باقي {n}س", "daysLeft": "باقي {n}ي" }
      },
      "testimonials": {
        "title": "ماذا يقول الناس",
        "subtitle": "قصص حقيقية من مجتمعنا الرائع",
        "card1": { "author": "Sarah Johnson", "role": "مالك مطعم", "quote": "لقد غيّر ShareBite الطريقة التي نتعامل بها مع الفائض من الطعام في مطعمنا. بدلاً من إهدار وجبات صالحة تمامًا للأكل، نتواصل الآن مع المأوى المحلية. إنه شعور رائع أن نُحدث فرقًا حقيقيًا!", "location": "نيويورك، الولايات المتحدة", "member_since": "عضو منذ 2023" },
        "card2": { "author": "Michael Chen", "role": "منسق NGO", "quote": "لقد كان هذا النظام بمثابة تغيير قواعد اللعبة لجهود توزيع الطعام لدينا. يمكننا الآن الوصول إلى المزيد من الأسر المحتاجة وتنسيق عمليات الاستلام بسلاسة. لقد كان للأثر على مجتمعنا أثر كبير!", "location": "سان فرانسيسكو، الولايات المتحدة", "member_since": "عضو منذ 2022" },
        "card3": { "author": "Emily Rodriguez", "role": "منسق المتطوعين", "quote": "كمتطوعة، يجعل ShareBite من السهل جدًا العثور على تبرعات الطعام والمطالبة بها. يبقيني نظام الإشعارات محدثة، وأحب رؤية الأثر الإيجابي الذي نحدثه معًا في تقليل هدر الطعام.", "location": "شيكاغو، الولايات المتحدة", "member_since": "عضو منذ 2023" },
        "stats": { "active_users": "المستخدمون النشطون", "average_rating": "متوسط التقييم", "satisfaction_rate": "معدل الرضا" }
      },
      "about": {
        "title": "عن ShareBite",
        "description": "ShareBite هي منصة ثورية مصممة لمكافحة هدر الطعام ومعالجة الجوع في المجتمعات. نعتقد أن الطعام الطازج والجيد لا يجب أن يضيع أبدًا عندما يكون هناك أشخاص بحاجة إليه.",
        "impact": { "environmental_title": "التأثير البيئي", "environmental_text": "تقليل البصمة الكربونية من خلال تقليل النفايات", "community_title": "دعم المجتمع", "community_text": "ربط الشركات بالمجتمعات المحلية", "growth_title": "النمو المستدام", "growth_text": "بناء نظام غذائي مستدام" },
        "stats": { "percent_label": "انخفاض هدر الطعام" }
      }
    }
  }

  async function load(lang) {
    // prefer bundled locale for reliability, then fallback to fetching the JSON
    if (bundledLocales && Object.prototype.hasOwnProperty.call(bundledLocales, lang)) {
      translations = bundledLocales[lang];
      current = lang;
    } else {
      try {
        const res = await fetch(`i18n/${lang}.json`);
        if (!res.ok) throw new Error('Locale load failed');
        translations = await res.json();
        current = lang;
      } catch (err) {
        console.warn('i18n: failed to load', lang, err);
        translations = bundledLocales['en'] || {};
        current = 'en';
      }
    }

    // set language and direction (RTL support)
    try {
      document.documentElement.lang = current;
      if (current === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.classList.remove('rtl');
      }
    } catch (e) {}

    apply();
    return Promise.resolve();
  }

  function t(key, vars) {
    if (!key) return '';
    const parts = key.split('.');
    let cur = translations;
    for (let p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return key; // fallback to key (visible)
      }
    }
    if (typeof cur === 'string') {
      if (vars && typeof vars === 'object') {
        return cur.replace(/\{(.*?)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
      }
      return cur;
    }
    return key;
  }

  function apply() {
    // data-i18n -> textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr');
      const value = t(key);
      if (attr) {
        el.setAttribute(attr, value);
      } else {
        el.textContent = value;
      }
    });
  }

  function setLanguage(lang) {
    localStorage.setItem('sharebite-lang', lang);
    return load(lang);
  }

  // initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('sharebite-lang') || DEFAULT_LANG;
    load(stored).then(() => {
      const sel = document.getElementById('languageSelect');
      if (sel) {
        // Ensure the select shows the current language (default/en)
        sel.value = stored;
        sel.addEventListener('change', (e) => {
          const val = e.target.value;
          setLanguage(val);
        });
      }

      // Expose a helper so other scripts can set language programmatically
      window.setAppLanguage = setLanguage;
    });
  });

  window.i18n = {
    t,
    setLanguage,
    currentLang: () => current,
    apply
  };
})();