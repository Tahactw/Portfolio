"""
Default site data used when no site.json exists yet.
"""

DEFAULTS = {
    "meta": {
        "title": "Taha Cagri Tanik | Portfolio",
        "description": "Cybersecurity student and developer — building the future one project at a time.",
        "favicon": "",
        "ogImage": "",
        "themeColor": "#6c63ff"
    },
    "hero": {
        "greeting": "Hi, I'm",
        "name": "Taha Cagri Tanik",
        "tagline": "Cybersecurity Student & Developer crafting secure, elegant solutions.",
        "cta": {
            "text": "View My Work",
            "href": "#projects"
        }
    },
    "about": {
        "heading": "About Me",
        "paragraphs": [
            "I'm a cybersecurity student with a passion for building software that is both secure and beautiful. My journey in tech started with curiosity about how systems work — and how they break.",
            "Today I focus on full-stack development, security research, and creating tools that make the digital world safer. When I'm not coding, you'll find me exploring new technologies and contributing to open-source."
        ],
        "image": ""
    },
    "skills": [
        {
            "category": "Security",
            "icon": "shield",
            "items": ["Penetration Testing", "Network Security", "Cryptography", "SIEM", "Incident Response"]
        },
        {
            "category": "Languages",
            "icon": "code",
            "items": ["Python", "JavaScript", "TypeScript", "C/C++", "Bash", "SQL"]
        },
        {
            "category": "Frameworks",
            "icon": "layers",
            "items": ["React", "Node.js", "Flask", "Django", "Three.js"]
        },
        {
            "category": "Tools",
            "icon": "terminal",
            "items": ["Git", "Docker", "Linux", "Wireshark", "Burp Suite", "AWS"]
        }
    ],
    "projects": [
        {
            "title": "SecureScan",
            "description": "Automated vulnerability scanner that identifies common web application security flaws with detailed remediation reports.",
            "image": "",
            "images": [],
            "youtube": "",
            "modelUrl": "",
            "tags": ["Python", "Security", "Flask"],
            "link": "",
            "github": "https://github.com",
            "featured": True
        },
        {
            "title": "CryptoVault",
            "description": "End-to-end encrypted file storage system with zero-knowledge architecture and modern UI.",
            "image": "",
            "images": [],
            "youtube": "",
            "modelUrl": "",
            "tags": ["TypeScript", "React", "Cryptography"],
            "link": "",
            "github": "https://github.com",
            "featured": True
        },
        {
            "title": "NetMonitor",
            "description": "Real-time network traffic analyzer with anomaly detection using machine learning.",
            "image": "",
            "images": [],
            "youtube": "",
            "modelUrl": "",
            "tags": ["Python", "ML", "Networking"],
            "link": "",
            "github": "https://github.com",
            "featured": False
        }
    ],
    "experience": [
        {
            "role": "Security Intern",
            "company": "CyberCorp",
            "period": "Summer 2024",
            "description": "Conducted penetration testing and vulnerability assessments for enterprise clients.",
            "highlights": [
                "Identified 15+ critical vulnerabilities across client systems",
                "Developed automated testing scripts reducing assessment time by 40%",
                "Contributed to incident response procedures documentation"
            ]
        },
        {
            "role": "Student Developer",
            "company": "University Tech Lab",
            "period": "2023 — Present",
            "description": "Building internal tools and research prototypes for the cybersecurity department.",
            "highlights": [
                "Created a web-based SIEM dashboard for lab monitoring",
                "Mentored junior students in secure coding practices"
            ]
        }
    ],
    "contact": {
        "heading": "Get In Touch",
        "subtext": "I'm always open to discussing new projects, creative ideas, or opportunities to be part of something great.",
        "email": "hello@example.com",
        "social": [
            {"platform": "GitHub", "url": "https://github.com", "icon": "github"},
            {"platform": "LinkedIn", "url": "https://linkedin.com", "icon": "linkedin"},
            {"platform": "Twitter", "url": "https://twitter.com", "icon": "twitter"}
        ]
    },
    "settings": {
        "particleCount": 80,
        "cursorGlow": True,
        "smoothScroll": True,
        "animationSpeed": 1.0,
        "theme": "dark"
    }
}
