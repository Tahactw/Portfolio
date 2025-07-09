# Futuristic Isometric Arena Portfolio

A cutting-edge portfolio featuring an interactive isometric arena with charging mechanics, smooth animations, and a professional admin panel.

## Features

- **Interactive Isometric Arena**: Navigate with WASD/Click in a futuristic environment
- **Charging Mechanic**: Stand on hexagonal pads to charge and navigate (1.5s charge time)
- **Elastic Camera**: Smooth, spring-like camera that returns to isometric view
- **Custom Animated Character**: GLB model with Idle, Walking, Running animations
- **Full Admin Panel**: Manage projects and experiences with drag-and-drop
- **Category Filtering**: Filter projects by Mechatronics, Video Montage, or Web Development
- **Rich Media Support**: Images, GIFs, Videos, YouTube embeds

## How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Add Your Character Model**
   - Place your `Meshy_Merged_Animations.glb` file in `public/models/`
   - Ensure it contains three animations: "Idle", "Walking", "Running"

3. **Configure Environment**
   - The `.env.local` file is pre-configured with the necessary API keys
   - For production, generate a new `NEXTAUTH_SECRET` using `openssl rand -base64 32`

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site

5. **Access the Admin Panel**
   - Navigate to `/admin`
   - Sign in with GitHub using the username in `GITHUB_ADMIN_USERNAME`

## Controls

- **WASD** - Move character
- **Shift + WASD** - Run
- **Click ground** - Move to location
- **Mouse drag** - Temporarily pan camera (elastic return)
- **Stand on pad** - Charge to navigate (1.5s)

## Technologies Used

- Next.js 14 with App Router
- Three.js & React Three Fiber for 3D graphics
- Framer Motion for animations
- Tailwind CSS for styling
- NextAuth for authentication
- Cloudinary for image management
- Formspree for contact forms