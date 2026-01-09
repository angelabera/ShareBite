# 🤝 Contributing to ShareBite

First of all, **thank you** for considering contributing to ShareBite! 🥗💚

This project aims to reduce food waste by connecting restaurants, households, and NGOs — ensuring that no meal goes to waste.

We welcome **all kinds of contributions** — whether you're fixing bugs, improving UI, or adding new features.
This project is **beginner-friendly** and **Hacktoberfest-eligible**, so feel free to jump in! 🌍✨

## 🚀 How to Contribute

Follow these steps to start contributing to ShareBite:

### 1. Fork this repository

Click the **Fork** button on the top-right corner of this page.

### 2. Clone your fork
```bash
git clone https://github.com/<your-username>/ShareBite.git
cd ShareBite
```

### 3. 🎯 Create or Find an Issue

**⚠️ IMPORTANT: Before starting work, you MUST create an issue and get it assigned to you!**

#### Option A: Work on Existing Issues
- Browse the [Issues tab](https://github.com/angelabera/ShareBite/issues)
- Look for issues labeled `good first issue`, `help wanted`, or `hacktoberfest`
- Comment on the issue saying **"I'd like to work on this"**
- Wait for a maintainer to **assign** the issue to you

#### Option B: Propose New Features/Fixes
- Create a **new issue** describing what you want to work on
- Use the appropriate template (bug report, feature request, etc.)
- Wait for maintainer **approval** and **assignment**
- Once approved and assigned, you can start working!

> **💡 Why this step matters:** This prevents duplicate work and ensures your contribution aligns with project goals.

### 4. Create a new branch

Create a branch for your feature or fix:

```bash
git checkout -b feature-name
```

**Example:**
```bash
git checkout -b add-food-listing-ui
```

### 5. Make your changes

Here are some common contribution ideas:

- 🥣 **Add new features** (e.g., "Claim Food" button, live maps, notifications)
- 🎨 **Improve UI** with modern CSS techniques
- 🐞 **Fix bugs** or typos
- 🧠 **Improve documentation**
- 💬 **Add translations** or accessibility improvements
- 📱 **Enhance mobile responsiveness**
- ⚡ **Optimize performance**
- 🔒 **Add security features**

### 6. Commit your changes
```bash
git add .
git commit -m "Added new feature: food listing form"
```

### 7. Push to your fork
```bash
git push origin feature-name
```

### 8. Create a Pull Request (PR)

1. Go to your fork on GitHub
2. Click **Compare & Pull Request**
3. **Reference the issue** in your PR description (e.g., "Closes #123")
4. Add a clear title and short description of what you've done
5. Submit your PR 🚀

> **📝 Note:** Your PR will only be reviewed if it's linked to an assigned issue!

## 📌 Contribution Rules

Please follow these simple rules to keep contributions clean and helpful:

### ✅ Do's
- **Create an issue** and **get it assigned** before starting work
- Keep your code **clean**, **well-commented**, and **readable**
- Use **meaningful commit messages**
- **One PR = one feature** or fix
- Follow **project structure** and naming conventions
- **Test your changes** before submitting
- Be **respectful** and **helpful** to others
- Include **screenshots** for UI changes
- Update **documentation** when needed
- **Reference the issue** in your PR (e.g., "Fixes #123")

### ❌ Don'ts
- **Don't start work** without an assigned issue
- No **spammy** or **irrelevant** PRs — they'll be marked invalid
- Don't break **existing functionality**
- Don't submit **incomplete** features
- Avoid **duplicate** PRs for the same issue
- Don't submit **PRs without issue reference**

## 🔰 Good First Issues

If you're **new to open source**, look for labels like:

- `good first issue`
- `help wanted`
- `beginner friendly`
- `documentation`
- `enhancement`

These are great starting points for beginners! 💪

## 💡 Other Ways to Contribute

Not a coder? You can still make a **huge impact**:

- 🧾 **Write documentation** or improve README
- 🎨 **Suggest new UI/UX** ideas
- 🌍 **Add language localization**
- 📱 **Improve responsiveness** for mobile
- 💭 **Open issues** with suggestions or feedback
- 🧪 **Test the application** and report bugs
- 📝 **Write tutorials** or blog posts
- 💬 **Help answer questions** in issues

## 📋 Development Guidelines

### Code Style
- Use **consistent indentation** (2 spaces for HTML/CSS, 2 spaces for JavaScript)
- Follow **semantic HTML** practices
- Use **CSS custom properties** for theming
- Write **modern ES6+** JavaScript
- Add **comments** for complex logic
- Use **meaningful variable names**

### File Organization
```
ShareBite/
│
├── .gitignore                     # Specifies files and folders Git should ignore
├── README.md                      # Main project overview, setup, and usage instructions
├── CONTRIBUTING.md                # Guidelines for contributing to the project
├── CODE_OF_CONDUCT.md             # Community behavior and contribution standards
├── INTEGRATION_GUIDE.md           # Instructions for integrating different project modules
├── TESTING_GUIDE.md               # Testing procedures and best practices
├── License.md                     # Open-source license information
├── sw.js                          # Service worker enabling PWA and offline support
├── git                            # Git-related metadata or configuration file
│
├── backend/                       # Backend server handling APIs and database logic
│   ├── server.js                  # Entry point for Express server initialization
│   ├── package.json               # Backend dependencies, scripts, and metadata
│   ├── package-lock.json          # Locked backend dependency versions
│   │
│   └── src/                       # Core backend source code
│       ├── config/                # Configuration files
│       │   └── db.js              # MongoDB connection setup
│       │
│       ├── controllers/           # Business logic for handling requests
│       │   ├── authController.js  # User authentication logic (login/register)
│       │   ├── ngoAuthController.js # NGO authentication logic
│       │   └── foodListingController.js # Food listing creation and management
│       │
│       ├── middleware/            # Express middleware functions
│       │   └── authMiddleware.js  # JWT-based route protection
│       │
│       ├── models/                # Database schemas
│       │   ├── User.js            # User schema definition
│       │   ├── Ngo.js             # NGO schema definition
│       │   └── FoodListing.js     # Food donation listing schema
│       │
│       └── routes/                # API route definitions
│           ├── authRoutes.js      # User authentication routes
│           ├── ngoAuthRoutes.js   # NGO authentication routes
│           └── foodListingRoutes.js # Food listing API routes
│
├── frontend/                      # Frontend user interface (HTML, CSS, JS)
│   ├── css/                       # Stylesheets
│   │   └── style.css              # Global application styling
│   │
│   ├── js/                        # Frontend JavaScript logic
│   │   ├── api.js                 # Handles API calls to backend
│   │   ├── auth.js                # Frontend authentication logic
│   │   ├── foodlisting.js         # Food listing UI logic
│   │   ├── script.js              # Common JavaScript utilities
│   │   └── theme.js               # Dark/light theme handling
│   │
│   ├── logo/                      # Branding assets
│   │   ├── logo.svg               # Scalable vector logo
│   │   └── sharebite_logo.png     # Logo image
│   │
│   ├── index.html                 # Landing page
│   ├── login.html                 # User login page
│   ├── login_ngo.html             # NGO login page
│   ├── register.html              # User registration page
│   ├── ngo-register.html          # NGO registration page
│   ├── foodlisting.html           # Donor food listing page
│   ├── volunteer_food.html        # Volunteer food viewing page
│   ├── map.html                   # Map-based food location view
│   ├── track-impact.html          # Donation impact tracking page
│   ├── donor-guidelines.html      # Donor rules and guidelines
│   ├── forgotpassword.html        # Password recovery page
│   ├── support.html               # Support and help page
│   ├── License.html               # Frontend license information
│   └── 404.html                   # Custom 404 error page
│
├── src/                           # Additional project modules
│   └── chatbot/                   # Chatbot logic for user assistance
│        ├── chatbot.css           # Chatbot UI styling
│        ├── ChatbotKnowledge.js   # Chatbot responses, intents, and logic
│        └── ChatbotWidget.js      # Chatbot UI widget and event handling

```

### Testing Your Changes
Before submitting a PR:

1. **Open `index.html`** in multiple browsers
2. **Test on different devices** (mobile, tablet, desktop)
3. **Check all interactive features** work correctly
4. **Verify responsive design** at various screen sizes
5. **Test form submissions** and validations
6. **Ensure no console errors** appear

## 🏷️ Issue Labels

We use these labels to organize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements to docs
- `ui/ux` - User interface improvements
- `accessibility` - Making the app more accessible
- `mobile` - Mobile-specific improvements
- `hacktoberfest` - Hacktoberfest eligible issues

## 💬 Code of Conduct

To keep this community **positive** and **inclusive**:

- 🤝 **Be kind and respectful**
- 🧑‍💻 **Help beginners** when possible
- 🚫 **No harassment**, hate, or offensive behavior
- 💬 Keep discussions **constructive** and focused
- 🌍 **Welcome everyone** regardless of background
- 📚 **Share knowledge** and learn together

This project is meant to be a **safe and welcoming space** for everyone. 💖

## 🏆 Hacktoberfest 2025

🎉 **This repository is part of Hacktoberfest 2025!**

### Hacktoberfest Guidelines:
- All **valid PRs** will be labeled `hacktoberfest-accepted`
- Make at least **4 quality PRs** (here or elsewhere) to complete Hacktoberfest
- Only **meaningful and original** contributions will count
- **Spam PRs** will be marked as `spam` or `invalid`
- Focus on **quality over quantity**

### What Counts for Hacktoberfest:
✅ **Bug fixes** with proper testing
✅ **New features** that enhance the platform
✅ **UI/UX improvements** with screenshots
✅ **Documentation** improvements
✅ **Accessibility** enhancements
✅ **Performance** optimizations

### What Doesn't Count:
❌ **Trivial changes** (fixing typos in comments)
❌ **Duplicate PRs**
❌ **Auto-generated** content
❌ **Spam** or low-effort contributions

## 🆘 Need Help?

If you're stuck or have questions:

1. **Check existing issues** - your question might already be answered
2. **Open a new issue** with the `question` label
3. **Join the discussion** in existing issues
4. **Ask for help** in your PR description

Remember: **No question is too small!** We're here to help. 🤗

## 🎯 Project Roadmap

Want to contribute but not sure where to start? Check out our roadmap:

### 🔮 Upcoming Features
- **User Authentication** (login/register system)
- **Real-time Notifications** (when new food is available)
- **Geolocation Integration** (find nearby food)
- **Image Upload** (real photos for food listings)
- **Rating System** (user reviews and feedback)
- **Mobile App** (React Native version)
- **API Backend** (Node.js + MongoDB)
- **Admin Dashboard** (manage users and listings)

### 🛠️ Current Priorities
1. **Mobile Responsiveness** improvements
2. **Accessibility** enhancements
3. **Performance** optimizations
4. **Testing** framework setup
5. **Documentation** expansion

---

**Let's code for a cause — and make the world a little kinder, one meal at a time** 🌏💚

### 🙏 Thank You!

Every contribution, no matter how small, makes ShareBite better and helps fight food waste worldwide.

**Happy coding!** 🚀✨