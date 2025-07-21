# BookingWithCal - First-Time Setup Guide

## 🚀 Getting Started

Welcome to BookingWithCal! This guide will help you set up your booking platform for the first time.

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation & First Run

1. **Install Dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

2. **Start the Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open Your Browser**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)
   - You'll be automatically redirected to the setup page

## 🎯 First-Time Setup Process

### Step 1: Company & Admin Information

- **Company Name**: Enter your business name (e.g., "Elite Barbershop")
- **Admin Username**: Choose a username for the master admin account (minimum 3 characters)
- **Admin Email**: Your email address for admin notifications

### Step 2: Secure Password

- **Password**: Create a strong password (minimum 8 characters)
- **Confirm Password**: Re-enter your password to confirm

### Step 3: Optional Company Details

- **Website**: Your business website (optional)
- **Phone**: Your business phone number (optional)

### Step 4: Complete Setup

- Review your information
- Click "Complete Setup"
- You'll be automatically logged in as the Mother Admin

## 👑 Mother Admin Capabilities

After setup, you'll have full access to:

### 🏢 **Business Management**

- Create unlimited client businesses
- Manage booking pages for each client
- Configure services, providers, and schedules
- Set up custom branding for each client

### 👥 **User Management**

- Create subadmin accounts
- Assign specific clients to subadmins
- Control permissions and access levels
- Monitor subadmin activity

### 📊 **Analytics & Monitoring**

- View platform-wide statistics
- Monitor booking performance
- Track revenue and growth metrics
- Export data in multiple formats

### ⚙️ **System Configuration**

- Manage global settings
- Configure email templates
- Set up calendar integrations
- Customize legal pages

## 🔐 Security Features

### Authentication System

- **Secure Login**: Encrypted password storage
- **Session Management**: Automatic token expiration
- **Role-Based Access**: Mother Admin vs Subadmin permissions
- **Protected Routes**: Authentication required for admin areas

### Multi-Tenant Architecture

- **Data Isolation**: Each client's data is separate
- **Independent Dashboards**: Clients can't see each other's data
- **Secure Access**: Business owners can only access their own dashboard

## 🌐 Platform Features

### For Business Owners (Your Clients)

- **Custom Booking Pages**: Branded pages at `yoursite.com/client-name`
- **Client Dashboards**: Private dashboard at `yoursite.com/client-name/dashboard`
- **Real-time Notifications**: Instant email alerts for new bookings
- **Calendar Integration**: Sync with Google, Outlook, Apple Calendar

### For Customers (Your Clients' Customers)

- **Easy Booking**: Simple, mobile-friendly booking process
- **Service Selection**: Choose services, providers, and time slots
- **Instant Confirmation**: Immediate booking confirmation emails
- **Rescheduling**: Self-service booking modifications

## 📱 Mobile Responsiveness

The platform is fully optimized for:

- **Touch Devices**: Large touch targets for easy mobile use
- **Responsive Design**: Adapts to any screen size
- **Fast Loading**: Optimized for mobile data connections
- **Progressive Web App**: Add to home screen capability

## 🎨 Customization Options

### Client Branding

- **Custom Colors**: Match your clients' brand colors
- **Logo Upload**: Add client logos to booking pages
- **Custom Domains**: Set up custom URLs (with proper DNS)
- **Social Media Integration**: Connect social profiles

### Service Configuration

- **Flexible Services**: Fixed-time or flexible-duration services
- **Pricing Options**: Set individual or package pricing
- **Provider Assignment**: Assign services to specific staff
- **Availability Rules**: Complex scheduling rules

## 🔧 Development & Testing

### API Mock System

The platform includes a built-in API mock system for development:

- **Local Storage**: User data stored in browser localStorage
- **Realistic Responses**: Simulates real API behavior
- **Development Mode**: Works offline for testing

### Reset System (Development Only)

To reset the system during development:

1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear localStorage data
4. Refresh the page to restart setup

## 🚨 Troubleshooting

### Common Issues

**Setup Page Not Loading**

- Clear browser cache and reload
- Check browser console for errors
- Ensure JavaScript is enabled

**Login Issues After Setup**

- Check that you're using the correct username/password
- Clear browser localStorage and restart setup if needed
- Contact support if issues persist

**Mobile Display Issues**

- Ensure viewport meta tag is present
- Check for JavaScript errors in mobile browser
- Test on multiple devices and browsers

### Getting Help

**Documentation**: Check the in-app help sections
**Support**: Contact the development team
**Community**: Join our Discord server for community support

## 🔄 Post-Setup Steps

### 1. Create Your First Client Business

- Go to Admin Dashboard
- Click "Add New Business"
- Fill in business details
- Generate booking page

### 2. Test the Booking Flow

- Visit the generated booking page
- Make a test booking
- Check email notifications
- Verify dashboard data

### 3. Configure Advanced Features

- Set up calendar sync
- Upload business logos
- Configure email templates
- Enable review system

### 4. Train Your Team

- Create subadmin accounts for team members
- Assign clients to subadmins
- Train on dashboard usage
- Set up notification preferences

## 🎯 Success Checklist

- ✅ Mother Admin account created
- ✅ First client business added
- ✅ Test booking completed successfully
- ✅ Email notifications working
- ✅ Mobile responsiveness verified
- ✅ Team members trained (if applicable)
- ✅ Calendar integration configured
- ✅ Branding customized

## 🚀 You're Ready to Go!

Congratulations! Your BookingWithCal platform is now ready to serve multiple client businesses. You can start onboarding your first clients and watch your booking business grow.

---

**Need Help?** Contact our support team or check the comprehensive documentation in the admin dashboard.
