# 💼 WhatsApp Agent - Real-World Use Cases

Complete examples of how to use WhatsApp Agent for common business scenarios.

---

## 🏪 E-Commerce / Online Store

### 1. Order Confirmation Messages

```python
import requests

def send_order_confirmation(customer_phone, order_id, items, total):
    message = f"""
✅ Order Confirmed!

Order ID: #{order_id}
Items: {items}
Total: ${total}

Your order will be delivered in 2-3 business days.
Track your order: https://yourstore.com/track/{order_id}

Thank you for shopping with us! 🛍️
    """
    
    response = requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })
    
    return response.json()

# Usage
send_order_confirmation('1234567890', 'ORD12345', '2x T-Shirts, 1x Jeans', 89.99)
```

### 2. Shipping Updates

```python
def send_shipping_update(customer_phone, order_id, tracking_number, carrier):
    message = f"""
📦 Your Order Has Shipped!

Order ID: #{order_id}
Tracking: {tracking_number}
Carrier: {carrier}

Track your package: https://track.{carrier}.com/{tracking_number}

Expected delivery: 2-3 days
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })
```

### 3. Abandoned Cart Reminder

```python
def send_cart_reminder(customer_phone, customer_name, cart_items, cart_value):
    message = f"""
Hey {customer_name}! 👋

You left {cart_items} in your cart worth ${cart_value}.

Complete your purchase now and get 10% OFF with code: COMPLETE10

🛒 View your cart: https://yourstore.com/cart

Offer expires in 24 hours!
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })
```

---

## 📚 Education / Online Courses

### 1. Class Reminder

```python
def send_class_reminder(students, class_name, datetime, meeting_link):
    message = f"""
📚 Class Reminder

Course: {class_name}
Time: {datetime}

Join here: {meeting_link}

Please join 5 minutes early.
See you in class! 👨‍🏫
    """
    
    # Broadcast to all students
    response = requests.post('http://localhost:3000/broadcast/message', json={
        'phoneNumbers': students,
        'message': message,
        'delay': 2000
    })
    
    return response.json()

# Usage
students = ['1234567890', '0987654321', '5555555555']
send_class_reminder(students, 'Python 101', 'Today at 3 PM', 'https://zoom.us/j/123456')
```

### 2. Assignment Submission Confirmation

```python
def confirm_assignment_submission(student_phone, student_name, assignment_name):
    message = f"""
✅ Assignment Received

Hi {student_name}!

Your assignment "{assignment_name}" has been successfully submitted.

Submission Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}

You'll receive your grade within 48 hours.

Good luck! 📝
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': student_phone,
        'message': message
    })
```

---

## 🏥 Healthcare / Medical

### 1. Appointment Reminder

```python
def send_appointment_reminder(patient_phone, patient_name, doctor_name, appointment_time):
    message = f"""
🏥 Appointment Reminder

Hi {patient_name},

Your appointment is scheduled for:
📅 {appointment_time}
👨‍⚕️ Dr. {doctor_name}

📍 City Medical Center, Floor 3

Please arrive 10 minutes early.
Bring your insurance card and ID.

To reschedule, reply RESCHEDULE
To confirm, reply CONFIRM
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': patient_phone,
        'message': message
    })
```

### 2. Test Results Ready

```python
def notify_test_results_ready(patient_phone, patient_name, test_name):
    message = f"""
✅ Test Results Ready

Hi {patient_name},

Your {test_name} results are now available.

🔐 View securely: https://portal.clinic.com/results

For questions, call us at (555) 123-4567

Have a healthy day! 💚
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': patient_phone,
        'message': message
    })
```

---

## 🏠 Real Estate

### 1. New Property Alert

```python
def send_property_alert(client_phone, property_details):
    # First send the message
    message = f"""
🏠 New Property Match!

{property_details['type']} - ${property_details['price']}
📍 {property_details['location']}
🛏️ {property_details['bedrooms']} bed | 🚿 {property_details['bathrooms']} bath
📐 {property_details['sqft']} sq ft

{property_details['description']}

View details: {property_details['url']}

Interested? Reply YES to schedule a viewing! 
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': client_phone,
        'message': message
    })
    
    # Then send property images
    if property_details.get('image_url'):
        requests.post('http://localhost:3000/send/image-url', json={
            'phoneNumber': client_phone,
            'url': property_details['image_url'],
            'caption': f"{property_details['type']} - ${property_details['price']}"
        })

# Usage
property_details = {
    'type': '3BHK Apartment',
    'price': '450,000',
    'location': 'Downtown, City Center',
    'bedrooms': 3,
    'bathrooms': 2,
    'sqft': 1500,
    'description': 'Modern apartment with city views',
    'url': 'https://realestate.com/property/12345',
    'image_url': 'https://realestate.com/images/property-12345.jpg'
}
send_property_alert('1234567890', property_details)
```

---

## 🍕 Food Delivery / Restaurant

### 1. Order Tracking

```python
def send_order_status(customer_phone, order_id, status, eta):
    statuses = {
        'preparing': '👨‍🍳 Your order is being prepared',
        'ready': '✅ Your order is ready for pickup!',
        'dispatched': '🛵 Your order is on the way!',
        'delivered': '✅ Order delivered. Enjoy your meal!'
    }
    
    message = f"""
{statuses[status]}

Order ID: #{order_id}
ETA: {eta}

Track live: https://foodapp.com/track/{order_id}
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })

# Usage
send_order_status('1234567890', 'FD12345', 'dispatched', '15 minutes')
```

### 2. Daily Specials Broadcast

```python
def broadcast_daily_special(customers, special_name, price, image_url):
    message = f"""
🍽️ Today's Special!

{special_name}
Only ${price}

Order now: https://restaurant.com/order
Or call: (555) FOOD-111

Available until 9 PM tonight!
Limited quantities available. 🔥
    """
    
    # Broadcast to all customers
    requests.post('http://localhost:3000/broadcast/message', json={
        'phoneNumbers': customers,
        'message': message,
        'delay': 3000
    })
    
    # Can also send image with the special
    # (would need to loop through customers for images)
```

---

## 🏋️ Fitness / Gym

### 1. Class Schedule Update

```python
def send_class_schedule(members, schedule):
    message = """
🏋️ This Week's Schedule

Monday: Yoga - 6 AM, 6 PM
Tuesday: CrossFit - 5 AM, 7 PM
Wednesday: Spin - 6 AM, 6 PM
Thursday: HIIT - 5 AM, 7 PM
Friday: Yoga - 6 AM, 6 PM
Saturday: Open Gym - All Day
Sunday: Rest Day

Book your spot: https://gym.com/book
    """
    
    requests.post('http://localhost:3000/broadcast/message', json={
        'phoneNumbers': members,
        'message': message,
        'delay': 2000
    })
```

### 2. Membership Renewal Reminder

```python
def send_renewal_reminder(member_phone, member_name, expiry_date):
    message = f"""
⏰ Membership Renewal Reminder

Hi {member_name}!

Your membership expires on: {expiry_date}

Renew now and get 10% OFF!
💪 Use code: RENEW10

Renew here: https://gym.com/renew

Questions? Call us: (555) GYM-LIFE
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': member_phone,
        'message': message
    })
```

---

## 💼 Corporate / HR

### 1. Interview Scheduling

```python
def send_interview_invite(candidate_phone, candidate_name, position, datetime, location):
    message = f"""
🎯 Interview Invitation

Hi {candidate_name},

We're excited to invite you for an interview!

Position: {position}
Date & Time: {datetime}
Location: {location}

Please bring:
- Resume
- ID proof
- Portfolio (if applicable)

To confirm, reply CONFIRM
To reschedule, reply RESCHEDULE

Looking forward to meeting you!

HR Team
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': candidate_phone,
        'message': message
    })
    
    # Also send location
    requests.post('http://localhost:3000/send/location', json={
        'phoneNumber': candidate_phone,
        'latitude': 28.6139,
        'longitude': 77.2090,
        'description': 'Company Office - Building A, 3rd Floor'
    })
```

### 2. Team Announcements

```python
def send_team_announcement(team_members, announcement):
    message = f"""
📢 Team Announcement

{announcement}

Questions? Contact HR at hr@company.com

Thank you!
Management Team
    """
    
    requests.post('http://localhost:3000/broadcast/message', json={
        'phoneNumbers': team_members,
        'message': message,
        'delay': 1000
    })
```

---

## 🚗 Automotive / Service Center

### 1. Service Reminder

```python
def send_service_reminder(customer_phone, customer_name, vehicle, last_service):
    message = f"""
🚗 Service Reminder

Hi {customer_name},

Your {vehicle} is due for service!
Last serviced: {last_service}

Schedule now: https://autoservice.com/book
Or call: (555) AUTO-123

Get 15% OFF with code: SERVICE15

Keep your car running smoothly! 🔧
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })
```

### 2. Service Completion

```python
def send_service_completion(customer_phone, vehicle, services_performed, amount):
    message = f"""
✅ Service Completed

Your {vehicle} is ready for pickup!

Services Performed:
{services_performed}

Total: ${amount}
Payment: Completed ✓

Pickup hours: 9 AM - 7 PM
Location: 123 Main St

Thank you for choosing us! 🚗
    """
    
    # Send message
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': customer_phone,
        'message': message
    })
    
    # Send invoice document
    # requests.post('http://localhost:3000/send/document', 
    #     files={'document': open('invoice.pdf', 'rb')},
    #     data={'phoneNumber': customer_phone, 'caption': 'Service Invoice'})
```

---

## 🎓 Coaching / Tutoring

### 1. Progress Report

```python
def send_progress_report(parent_phone, student_name, subject, score, feedback):
    message = f"""
📊 Student Progress Report

Student: {student_name}
Subject: {subject}
Recent Test Score: {score}%

Teacher's Feedback:
{feedback}

Next class: Tomorrow at 4 PM

Keep up the good work! 📚

Questions? Reply to this message.
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': parent_phone,
        'message': message
    })
```

---

## 🏨 Hospitality / Hotels

### 1. Booking Confirmation

```python
def send_booking_confirmation(guest_phone, booking_details):
    message = f"""
✅ Booking Confirmed

{booking_details['hotel_name']}

Check-in: {booking_details['checkin']}
Check-out: {booking_details['checkout']}
Room Type: {booking_details['room_type']}
Guests: {booking_details['guests']}

Booking ID: {booking_details['booking_id']}

Early check-in available!
Free WiFi | Pool | Gym

Contact us: {booking_details['phone']}

See you soon! 🏨
    """
    
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': guest_phone,
        'message': message
    })
    
    # Send location
    requests.post('http://localhost:3000/send/location', json={
        'phoneNumber': guest_phone,
        'latitude': booking_details['latitude'],
        'longitude': booking_details['longitude'],
        'description': booking_details['hotel_name']
    })
```

---

## 🎫 Events / Ticketing

### 1. Event Ticket

```python
def send_event_ticket(attendee_phone, event_name, date, venue, ticket_id):
    message = f"""
🎫 Your Ticket

Event: {event_name}
Date: {date}
Venue: {venue}
Ticket ID: {ticket_id}

Show this message at the entrance.

Event starts at 7 PM
Doors open at 6 PM

See you there! 🎉
    """
    
    # Send message
    requests.post('http://localhost:3000/send/message', json={
        'phoneNumber': attendee_phone,
        'message': message
    })
    
    # Send QR code image (if you have one)
    # requests.post('http://localhost:3000/send/image-url', json={
    #     'phoneNumber': attendee_phone,
    #     'url': f'https://qr.yoursite.com/{ticket_id}',
    #     'caption': 'Scan this QR code at entrance'
    # })
```

---

## 🤖 Customer Support Bot

### Complete Auto-Reply System

```javascript
// In src/index.js

agent.onMessage(async (message, contact) => {
  const msg = message.body.toLowerCase();
  
  // Greetings
  if (msg.includes('hello') || msg.includes('hi')) {
    await message.reply(
      'Hello! 👋 Welcome to our support.\n\n' +
      'How can I help you today?\n\n' +
      '1️⃣ Product Information\n' +
      '2️⃣ Order Status\n' +
      '3️⃣ Returns & Refunds\n' +
      '4️⃣ Talk to Human\n\n' +
      'Reply with a number to continue.'
    );
  }
  
  // Order status
  else if (msg.includes('order') || msg === '2') {
    await message.reply(
      'To check your order status:\n\n' +
      'Please provide your Order ID\n' +
      '(Format: ORD12345)\n\n' +
      'Or visit: https://yourstore.com/track'
    );
  }
  
  // Product info
  else if (msg === '1' || msg.includes('product')) {
    await message.reply(
      '📦 Our Products:\n\n' +
      '• Electronics\n' +
      '• Fashion\n' +
      '• Home & Kitchen\n' +
      '• Books\n\n' +
      'Browse: https://yourstore.com/catalog\n\n' +
      'Need specific info? Just ask!'
    );
  }
  
  // Returns
  else if (msg === '3' || msg.includes('return')) {
    await message.reply(
      '↩️ Returns & Refunds:\n\n' +
      '✓ 30-day return policy\n' +
      '✓ Full refund within 7 days\n' +
      '✓ Free return shipping\n\n' +
      'Start return: https://yourstore.com/returns\n\n' +
      'Questions? Ask away!'
    );
  }
  
  // Talk to human
  else if (msg === '4' || msg.includes('human')) {
    await message.reply(
      '👤 Connecting you to our support team...\n\n' +
      'Average wait time: 2-3 minutes\n\n' +
      'Or call us: (555) 123-4567\n' +
      'Email: support@yourstore.com'
    );
    
    // Notify your team
    await agent.sendMessage(
      'SUPPORT_TEAM_NUMBER',
      `New support request from ${contact.pushname || contact.number}`
    );
  }
  
  // Unknown query
  else {
    await message.reply(
      'I\'m not sure I understand. 🤔\n\n' +
      'Type "help" to see what I can do!\n\n' +
      'Or call us: (555) 123-4567'
    );
  }
});
```

---

## 💡 Pro Tips

### 1. Personalization
Always use customer names and personalized data:
```python
message = f"Hi {customer_name}! ..." # Good
message = "Hi Customer! ..." # Bad
```

### 2. Clear CTAs (Call-to-Action)
Include clear next steps:
```python
message += "\n\nReply YES to confirm"
message += "\nOr call us: (555) 123-4567"
```

### 3. Use Emojis (But Don't Overdo)
Emojis make messages friendly:
```python
"✅ Confirmed" # Good
"✅🎉👍💯 Confirmed 🔥😊" # Too much
```

### 4. Timing
Send messages at appropriate times:
```python
import datetime

# Don't send late night messages
hour = datetime.datetime.now().hour
if 9 <= hour <= 21:  # 9 AM to 9 PM
    send_message(...)
```

### 5. Error Handling
Always handle errors:
```python
try:
    response = requests.post(...)
    if response.json()['success']:
        print("Message sent!")
    else:
        print(f"Failed: {response.json()['error']}")
except Exception as e:
    print(f"Error: {e}")
```

---

Made with ❤️ for business automation

