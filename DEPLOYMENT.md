# Deployment Guide

This guide covers deploying the Hostel Booking Application to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Heroku (Recommended for beginners)
### Option 2: DigitalOcean App Platform
### Option 3: AWS (EC2 + RDS)
### Option 4: Vercel (Frontend) + Railway (Backend)

---

## 🔧 Heroku Deployment

### Backend (Django) on Heroku

1. **Prepare the backend**
```bash
cd backend

# Create Procfile
echo "web: gunicorn hostel_booking.wsgi" > Procfile

# Update requirements.txt
pip freeze > requirements.txt

# Add gunicorn if not present
echo "gunicorn==20.1.0" >> requirements.txt
```

2. **Create Heroku app**
```bash
heroku create your-hostel-backend
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Set environment variables**
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-production-secret-key
heroku config:set PAYSTACK_SECRET_KEY=your-paystack-secret
heroku config:set PAYSTACK_PUBLIC_KEY=your-paystack-public
heroku config:set CLOUDINARY_CLOUD_NAME=your-cloudinary-name
heroku config:set CLOUDINARY_API_KEY=your-cloudinary-key
heroku config:set CLOUDINARY_API_SECRET=your-cloudinary-secret
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-hostel-backend
git push heroku main
heroku run python manage.py migrate
```

### Frontend (React) on Vercel

1. **Prepare frontend**
```bash
cd frontend

# Update .env for production
VITE_API_URL=https://your-hostel-backend.herokuapp.com
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

2. **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

---

## 🌊 DigitalOcean App Platform

### Full Stack Deployment

1. **Create App Spec** (`app.yaml`)
```yaml
name: hostel-booking-app
services:
- name: backend
  source_dir: /backend
  github:
    repo: your-username/hostel-booking-app-integrated
    branch: main
  run_command: gunicorn hostel_booking.wsgi
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: DEBUG
    value: "False"
  - key: SECRET_KEY
    value: your-secret-key
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: PAYSTACK_SECRET_KEY
    value: your-paystack-secret

- name: frontend
  source_dir: /frontend
  github:
    repo: your-username/hostel-booking-app-integrated
    branch: main
  build_command: npm run build
  run_command: npm run preview
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: VITE_API_URL
    value: ${backend.PUBLIC_URL}

databases:
- name: db
  engine: PG
  version: "13"
  size_slug: db-s-dev-database
```

---

## ☁️ AWS Deployment

### Backend on EC2 with RDS

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier)
   - Security groups: HTTP (80), HTTPS (443), SSH (22)

2. **Setup Server**
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3-pip python3-venv nginx -y

# Clone repository
git clone https://github.com/your-username/hostel-booking-app-integrated.git
cd hostel-booking-app-integrated/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# Setup environment variables
sudo nano /etc/environment
# Add your environment variables

# Setup Nginx
sudo nano /etc/nginx/sites-available/hostel-booking
```

3. **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/your/static/files/;
    }
}
```

4. **Setup Systemd Service**
```bash
sudo nano /etc/systemd/system/hostel-booking.service
```

```ini
[Unit]
Description=Hostel Booking Django App
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/hostel-booking-app-integrated/backend
Environment="PATH=/home/ubuntu/hostel-booking-app-integrated/backend/venv/bin"
ExecStart=/home/ubuntu/hostel-booking-app-integrated/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 hostel_booking.wsgi
Restart=always

[Install]
WantedBy=multi-user.target
```

### Frontend on S3 + CloudFront

1. **Build and Upload**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name --delete
```

2. **Setup CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: 404 -> /index.html (for SPA routing)

---

## 🔒 Security Checklist

### Backend Security
- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Set up database backups
- [ ] Configure logging

### Frontend Security
- [ ] Remove console.log statements
- [ ] Use HTTPS for API calls
- [ ] Validate all user inputs
- [ ] Implement proper error handling
- [ ] Set up Content Security Policy
- [ ] Enable HSTS headers

---

## 📊 Monitoring & Maintenance

### Backend Monitoring
```bash
# Check application logs
heroku logs --tail -a your-hostel-backend

# Monitor database
heroku pg:info -a your-hostel-backend

# Check dyno status
heroku ps -a your-hostel-backend
```

### Performance Optimization
- Enable database connection pooling
- Set up Redis for caching
- Optimize database queries
- Compress static files
- Use CDN for images

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-hostel-backend"
        heroku_email: "your-email@example.com"
        appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID}}
        vercel-project-id: ${{ secrets.PROJECT_ID}}
        working-directory: ./frontend
```

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CORS_ALLOWED_ORIGINS` in backend
   - Verify frontend URL is correct

2. **Database Connection Issues**
   - Check `DATABASE_URL` format
   - Verify database credentials

3. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check `STATIC_URL` and `STATIC_ROOT`

4. **Environment Variables Not Loading**
   - Verify `.env` file location
   - Check variable names (no spaces)

### Health Check Endpoints
- Backend: `https://your-backend.com/api/health/`
- Frontend: Check if app loads and API calls work

---

## 📞 Support

For deployment issues:
1. Check the logs first
2. Verify environment variables
3. Test locally before deploying
4. Create an issue in the repository

Remember to test your deployment thoroughly before going live!