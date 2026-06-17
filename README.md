# Sports Match CMS

A complete static **Sports Match CMS** built with HTML, CSS, and JavaScript, deployable on GitHub Pages. Manage sports matches, leagues, categories, and stream sources directly from your browser using GitHub as storage.

## 🌟 Features

### 1. **Admin Authentication**
- Secure admin panel with username/password authentication
- Default credentials: `ymn10` / `ymn10`
- Session-based authentication
- Logout functionality

### 2. **Sports Categories Management**
- Default categories: Football, Cricket
- Add unlimited custom categories
- Edit and delete categories
- Real-time category listing

### 3. **League Management**
- Create, edit, and delete leagues
- Assign leagues to categories
- Search and filter functionality
- Match counter for each league

### 4. **Match Management**
- Add, edit, delete, and duplicate matches
- Full match details:
  - Sport category and league
  - Match title
  - Team A and Team B with flags/logos
  - Multiple stream sources per match
  - Start and finish times
- Advanced filtering and search
- Pagination support
- Auto-detect match status (Upcoming/Live/Finished)

### 5. **Stream Sources**
- Unlimited stream sources per match
- Support for multiple formats:
  - `.m3u8` (HLS)
  - `.mpd` (DASH)
  - `.ts` (Transport Stream)
  - `.mkv` (Matroska)
  - `.mp4` (MP4)
  - Direct video URLs
- Enable/disable sources
- Source naming (Main, Backup 1, etc.)

### 6. **Dashboard**
- Real-time statistics:
  - Total categories, leagues, and matches
  - Total stream sources
  - Upcoming, Live, and Finished match counts
- Recent matches display
- Quick overview of all data

### 7. **Dark Mode**
- Toggle dark/light theme
- Persistent theme preference
- Smooth transitions

### 8. **GitHub Integration**
- Load data from `match.json` in your repository
- Save changes directly to GitHub
- Personal Access Token authentication
- Configurable repository settings

### 9. **Responsive Design**
- Mobile-friendly interface
- Collapsible sidebar
- Touch-optimized controls
- Bootstrap 5 framework

### 10. **Public API**
- Access match data via public URL:
  ```
  https://raw.githubusercontent.com/OWNER/REPO/main/match.json
  ```

## 📋 JSON Structure

```json
{
  "categories": [
    {
      "id": "unique_id",
      "name": "Football"
    }
  ],
  "leagues": [
    {
      "id": "unique_id",
      "category": "category_id",
      "name": "FIFA World Cup"
    }
  ],
  "matches": [
    {
      "id": "unique_id",
      "category": "category_id",
      "league": "league_id",
      "title": "Semi Final",
      "teamA": {
        "name": "Team A",
        "flag": "https://example.com/flag.png"
      },
      "teamB": {
        "name": "Team B",
        "flag": "https://example.com/flag.png"
      },
      "sources": [
        {
          "name": "Main",
          "url": "https://example.com/stream.m3u8",
          "enabled": true
        }
      ],
      "start_time": "2026-07-15T20:00:00Z",
      "finish_time": "2026-07-15T22:00:00Z"
    }
  ]
}
```

## 🚀 Quick Start

### 1. Clone or Fork Repository
```bash
git clone https://github.com/Custommail100/tv.git
cd tv
```

### 2. Create GitHub Personal Access Token
1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select `repo` scope
4. Copy the generated token

### 3. Access the Application
- Open `auth.html` in your browser
- Enter admin credentials:
  - **Username:** `ymn10`
  - **Password:** `ymn10`
- Or configure GitHub:
  - **Owner:** Your GitHub username
  - **Repository:** Repository name
  - **Branch:** `main` (or your branch)
  - **Token:** Your Personal Access Token

### 4. Start Managing Matches
- Navigate to Dashboard to see overview
- Create categories, leagues, and matches
- Add stream sources
- Changes auto-save to GitHub

## 📁 File Structure

```
tv/
├── index.html              # Dashboard
├── matches.html            # Matches management
├── leagues.html            # Leagues management
├── categories.html         # Categories management
├── settings.html           # GitHub settings
├── auth.html              # Admin authentication
├── login.html             # GitHub configuration
├── match.json             # Data storage (auto-created)
└── assets/
    ├── css/
    │   └── style.css      # Main stylesheet
    └── js/
        ├── config.js      # Configuration & utilities
        ├── api.js         # GitHub API integration
        ├── ui.js          # UI helpers
        ├── dashboard.js   # Dashboard logic
        ├── categories.js  # Categories logic
        ├── leagues.js     # Leagues logic
        ├── matches.js     # Matches logic
        └── settings.js    # Settings logic
```

## 🔐 Security

- **Admin credentials** stored locally (for demo purposes)
- **GitHub Token** stored in localStorage
- Tokens are sent only to GitHub API over HTTPS
- No backend server required
- All authentication is client-side

## 🎨 UI/UX Features

- **Bootstrap 5** - Responsive components
- **Font Awesome** - Icon library
- **Dark Mode** - Eye-friendly theme
- **Toast Notifications** - User feedback
- **Loading States** - Visual feedback
- **Responsive Grid** - Mobile-optimized layouts
- **Smooth Animations** - Enhanced UX

## ⚙️ Configuration

All settings are available in the **Settings** page:
- GitHub Owner
- Repository Name
- Branch Name
- File Path
- Personal Access Token

## 🌐 Deployment on GitHub Pages

1. Enable GitHub Pages in repository settings
2. Set source to `main` branch
3. Access your site at: `https://username.github.io/tv/`

## 📊 Match Status Auto-Detection

Status is automatically determined based on current time:

- **Upcoming:** Current time < Start time
- **Live:** Start time ≤ Current time ≤ Finish time
- **Finished:** Current time > Finish time

No manual status updates required!

## 🔄 Data Sync

- **Auto-save** enabled by default
- Changes save to GitHub repository
- Real-time data updates
- No manual JSON editing needed

## 🎯 Usage Examples

### Adding a Match
1. Go to Matches page
2. Click "Add Match"
3. Fill in match details:
   - Select category and league
   - Enter team names and flag URLs
   - Set start and finish times
   - Add stream sources
4. Click "Save Match"
5. Data saves automatically to GitHub

### Managing Categories
1. Go to Categories page
2. Click "Add Category"
3. Enter category name
4. Click "Save Category"
5. Edit or delete existing categories

### Configuring GitHub
1. Go to Settings page
2. Enter GitHub credentials and token
3. Click "Test Connection"
4. Click "Save Settings"

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling and animations
- **JavaScript (Vanilla)** - Logic and interactivity
- **Bootstrap 5** - UI framework
- **Font Awesome 6** - Icons
- **GitHub API** - Data storage and retrieval
- **LocalStorage** - Client-side storage

## 📝 Default Data

The `match.json` comes pre-populated with:
- **Categories:** Football, Cricket
- **Leagues:** FIFA World Cup, UEFA Champions League, ICC World Cup, Dutch-Bangla Bank T20I Series
- **Sample Match:** Group Stage between Argentina and France

## 🔗 API Endpoints

### Get Match Data
```
GET https://raw.githubusercontent.com/OWNER/REPO/main/match.json
```

## 🎓 Customization

### Change Admin Credentials
Edit `auth.html` and update:
```javascript
const ADMIN_USERNAME = 'your_username';
const ADMIN_PASSWORD = 'your_password';
```

### Change Theme Colors
Edit `assets/css/style.css` and modify:
```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  /* ... other colors ... */
}
```

## 🐛 Troubleshooting

### Token Issues
- Verify token has `repo` scope
- Check token hasn't expired
- Ensure token is copied correctly

### GitHub Connection Failed
- Verify owner and repository names
- Check if repository exists
- Ensure token has access to repository

### Data Not Saving
- Check GitHub API rate limits
- Verify token permissions
- Check browser console for errors

## 📄 License

This project is open source and available for personal and commercial use.

## 👨‍💻 Author

**Custommail100** - Full-stack Sports Match CMS

## 🤝 Contributing

Feel free to fork, modify, and use this project for your needs!

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review GitHub repository
3. Check browser console for errors

## 🎉 Features Roadmap

- [ ] Media upload integration
- [ ] Match statistics
- [ ] Team management
- [ ] Schedule templates
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Advanced search filters

## 📱 Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

---

**Made with ❤️ for sports fans and developers**

**Get Started:** Open `auth.html` → Login with `ymn10` / `ymn10` → Configure GitHub → Start managing matches!
