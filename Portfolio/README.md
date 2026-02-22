# Portfolio — Dynamic CMS-Driven Site

A sleek, dark-themed developer portfolio with:

- **WebGL background** via Three.js with custom GLSL shaders
- **Particle system** with mouse interactivity
- **Custom cursor** with smooth tracking
- **Scroll-reveal animations** with intersection observer
- **Admin CMS** at `/admin` for live content editing
- **Flask API** serving JSON data to a vanilla JS frontend
- **Vercel-ready** deployment configuration

## Structure

```
├── api/               # Flask backend
│   ├── index.py       # Vercel entry point
│   ├── auth.py        # Token-based auth
│   ├── routes/        # API endpoints
│   ├── models/        # Schema & defaults
│   └── engine/        # Storage & validation
├── public/            # Frontend
│   ├── index.html
│   ├── css/           # Core, layout, sections, animations
│   ├── js/            # Modular JS (app, renderer, cursor, etc.)
│   └── shaders/       # GLSL vertex/fragment shaders
├── admin/             # Admin CMS panel
│   ├── index.html
│   ├── css/
│   └── js/
├── data/              # Site content (site.json)
├── vercel.json        # Deployment config
└── requirements.txt   # Python dependencies
```

## Local Development

```bash
pip install -r requirements.txt
export ADMIN_TOKEN="Tahaquhali1"
flask --app api.index run --port 5000 --debug
```

Then open `http://localhost:5000` for the portfolio and `http://localhost:5000/admin` for the CMS.

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Set `ADMIN_TOKEN` environment variable
4. Deploy

## Admin Access

Navigate to `/admin` and enter your `ADMIN_TOKEN` to edit all site content through the CMS.
