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
      "support": { "title": "Support", "contact_prompt": "Need help? Reach out to our support team and we’ll get back to you shortly.", "form_submit": "Send Message" }
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
      "support": { "title": "Support", "contact_prompt": "Besoin d'aide ? Contactez notre équipe d'assistance et nous vous répondrons sous peu.", "form_submit": "Envoyer" }
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
      "support": { "title": "समर्थन", "contact_prompt": "मदद चाहिए? हमारी सहायता टीम से संपर्क करें और हम शीघ्र उत्तर देंगे।", "form_submit": "संदेश भेजें" }
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
      "support": { "title": "Soporte", "contact_prompt": "¿Necesitas ayuda? Ponte en contacto con nuestro equipo de soporte y te responderemos en breve.", "form_submit": "Enviar mensaje" }
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
      "support": { "title": "支持", "contact_prompt": "需要帮助吗？请联系我们的支持团队，我们会尽快回复。", "form_submit": "发送消息" }
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
      "support": { "title": "Suporte", "contact_prompt": "Precisa de ajuda? Entre em contato com nossa equipe de suporte e responderemos em breve.", "form_submit": "Enviar mensagem" }
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
      "support": { "title": "الدعم", "contact_prompt": "هل تحتاج مساعدة؟ اتصل بفريق الدعم وسنعاود الاتصال بك قريبًا.", "form_submit": "إرسال رسالة" }
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