# 🍽️ Restaurant Ordering System

A modern, real-time restaurant ordering platform with live order tracking and kitchen management.

**Live Demo:** https://restaurant-ordering-frontend.vercel.app  
**Backend API:** https://restaurant-ordering-backend-production.up.railway.app

---

## 🔗 Links

- **Live Application:** https://restaurant-ordering-frontend.vercel.app
- **Backend API:** https://restaurant-ordering-backend-production.up.railway.app
- **Frontend Repo:** https://github.com/nishantIA/restaurant-ordering-frontend
- **Backend Repo:** https://github.com/nishantIA/restaurant-ordering-backend
- **Backend API Docs:** https://restaurant-ordering-backend-production.up.railway.app/api/docs

- **Customer Route:** https://restaurant-ordering-frontend.vercel.app
- **Admin Route:** https://restaurant-ordering-frontend.vercel.app/dashboard
- **Admin Login Route:**https://restaurant-ordering-frontend.vercel.app/kitchen/login

**🔑 Admin Password:** `kitchen123`

---

## 🗺️ Routes

### **Customer Routes**
| Route | Description |
|-------|-------------|
| `/` | Menu browser & ordering |
| `/checkout` | Cart checkout & payment |
| `/orders/[orderNumber]` | Real-time order tracking |

### **Kitchen/Admin Routes**
| Route | Description |
|-------|-------------|
| `/kitchen/login` | Authentication |
| `/kitchen/dashboard` | Order management dashboard |

**🔑 Admin Password:** `kitchen123`

---


## 🏗️ Architecture

**Frontend:** Next.js 16 (App Router) + React 19 + TypeScript  
**State Management:** TanStack Query + Zustand  
**Real-time:** Socket.io for live order updates  
**Styling:** Tailwind CSS + ShadCN UI

---

## ✨ Features

### **Customer Side**
- 🔍 Menu browser with search & filters (category, dietary, price)
- 🎨 Advanced customization (simple + complex multi-level)
- 🛒 Session-based cart with real-time validation
- 💳 Mock payment gateway (95% success rate)
- 📊 Real-time order tracking via WebSocket

### **Kitchen/Admin Side**
- 🔐 Password-protected dashboard
- 📋 Live order notifications
- ⚡ Status management (Received → Preparing → Ready → Completed)
- 📊 Order filtering & statistics

---


## 📋 Project Assumptions

✅ **Single Location:** System designed for one restaurant location  
✅ **Single Admin:** One kitchen dashboard (no multi-user admin roles)  
✅ **Dine-in Orders:** Customers order from table, pick up when ready  
✅ **No Delivery:** Order tracking ends at "Ready" status  
✅ **Session-based:** No customer login required (anonymous ordering)  
✅ **Mock Payment:** Payment gateway simulated for demo purposes

---

## 🔄 Application Flow

### **Customer Journey**
```
1. Browse Menu (/)
   ↓ Search & filter items
2. Select Item → Customize
   ↓ Add size, toppings, modifiers
3. Add to Cart → Review
   ↓ View cart with real-time pricing
4. Checkout → Payment
   ↓ Enter contact info (optional)
5. Track Order (Real-time)
   ↓ Received → Preparing → Ready → Completed
```

### **Kitchen Workflow**
```
1. Login (/kitchen/login)
   ↓ Password: kitchen123
2. Dashboard → View Orders
   ↓ Real-time notifications
3. Update Status
   ↓ Preparing → Ready → Completed
4. Customer Notified
   ↓ Instant WebSocket update
```

---

## 🔴 Live Updates (WebSocket)

**Customer:** Receives instant notifications when order status changes  
**Kitchen:** Gets real-time alerts for new orders  
**Connection:** Auto-reconnect on disconnect

```
Order Status Change → Server → Customer & Kitchen (instant update)
```

---

## 🚀 Quick Start

### **Installation**
```bash
# Clone repository
git clone https://github.com/nishantIA/restaurant-ordering-frontend
cd restaurant-ordering-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### **Environment Variables**
```env
# .env.local
NEXT_PUBLIC_API_URL=https://restaurant-ordering-backend-production.up.railway.app/api/v1
NEXT_PUBLIC_KITCHEN_PASSWORD=kitchen123
```

### **Run Development**
```bash
npm run dev
# Open http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm start
```

---

## 🧪 Testing Guide

### **Test Customer Flow**
1. Visit homepage → Search "pizza"
2. Click item → Select customizations (Large, Extra Cheese)
3. Add to cart → Checkout
4. Enter phone: `1234567890` → Process payment
5. Track order → Observe real-time updates

### **Test Kitchen Flow**
1. Navigate to `/kitchen/login` → Enter `kitchen123`
2. View dashboard → See new order notification
3. Click "Mark as Preparing" → Customer sees update instantly
4. Continue: Ready → Completed

---

## 🎯 Key Highlights

### **Performance**
✅ React Query caching (5-min stale time)  
✅ Infinite scroll for menu  
✅ Optimistic UI updates  
✅ Debounced search (300ms)

### **UX Features**
✅ Responsive design (mobile-first)  
✅ Loading skeletons  
✅ Toast notifications  
✅ Error boundaries  
✅ Accessible (ARIA, keyboard nav)

### **Edge Cases Handled**
✅ Cart persistence (24hr)  
✅ Real-time price recalculation  
✅ Stock validation  
✅ WebSocket reconnection  
✅ Session timeout handling

---

## 📦 Tech Stack

```json
{
  "framework": "Next.js 16",
  "language": "TypeScript",
  "ui": "React 19 + Tailwind CSS",
  "state": "TanStack Query + Zustand",
  "realtime": "Socket.io Client",
  "forms": "React Hook Form + Zod"
}
```



## 📝 Additional Notes

- Kitchen password is hardcoded for demo purposes
- Payment gateway is mocked with 95% success rate
- Cart session expires after 24 hours
- Real-time features require active WebSocket connection
- Designed for single-location restaurant operations

---

**Built with ❤️ using Next.js 16 & React 19**