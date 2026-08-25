# AI Background Removal SaaS Website  

A Full Stack AI-powered SaaS website that allows users to upload images, remove backgrounds using AI, and download the results with a transparent background.  

## 🌟 Features 
- **Background Removal**: AI-powered image processing for seamless background removal.  
- **Credit System**: Users can purchase credits to process images.  
- **User Authentication**: Integrated with Clerk for secure login, registration, and user management.  
- **Payment Integration**: Supports online payment for purchasing credits.  

## 🔧 Technologies Used 
- **Frontend**: React.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: Clerk  

## Installation  
1. **Clone the repository**:  
   ```bash  
   git clone https://github.com/yourusername/ai-bg-removal-website.git  
   ```  

2. **Navigate to the project directory**:  
   ```bash  
   cd ai-bg-removal-website  
   ```  

3. **Install dependencies and configure environment files**:
   ```bash
   cd client && npm install
   copy .env.example .env
   cd ../server && npm install
   copy .env.example .env
   npm run migrate:indexes
   ```

4. **Start the app**:
   ```bash
   # terminal 1
   cd server && npm start
   # terminal 2
   cd client && npm run dev
   ```
