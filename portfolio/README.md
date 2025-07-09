# Fantasy Village Portfolio

A warm, inviting portfolio website featuring an immersive 3D fantasy village world with day/night cycle, a full-featured admin panel for content management, and professional pages for projects, experience, and contact.

## Features

- **Interactive 3D Fantasy World**: Navigate a stylized village with WASD controls
- **Custom Animated Character**: GLB model with Idle, Walking, and Running animations
- **Day/Night Cycle**: Toggle between warm day and cool night atmospheres
- **Full Admin Panel**: Manage projects and experiences with drag-and-drop reordering
- **Professional Design**: Clean typography, smooth animations, and attention to detail
- **Responsive**: Works seamlessly across all devices

## How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Character Model**
   - Place your `Meshy_Merged_Animations.glb` file in `public/models/`
   - The model should contain three animations: "Idle", "Walking", "Running"

3. **Configure Environment**
   - The `.env.local` file is pre-configured with the necessary API keys.
   - For production, generate a new `NEXTAUTH_SECRET` using `openssl rand -base64 32`.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

5. **Access the Admin Panel**
   - Navigate to `/admin`.
   - Sign in with GitHub using the username in `GITHUB_ADMIN_USERNAME`.

## Controls

- **WASD** - Move character
- **Shift + WASD** - Run
- **Click on ground** - Move to location
- **Mouse drag** - Orbit camera

## Technologies Used

- Next.js 14 with App Router
- Three.js & React Three Fiber for 3D graphics
- Framer Motion for animations
- Tailwind CSS for styling
- NextAuth for authentication
- Cloudinary for image management
- Formspree for contact forms