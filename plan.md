Core Functions (Features)

✅ For Students
	•	Account Management: Register, login, profile update
	•	Event Browsing: See all events with details (date, venue, organizer, capacity)
	•	Event Registration: Click “Register” to join an event
	•	My Events: Dashboard showing which events the student has registered for
	•	Notifications (optional): Confirmation of registration, reminder mail

✅ For Admin/Organizers
	•	Event Management:
	•	    Create new events (name, date, venue, organizer, capacity)
	•	    Edit event details
	•	    Delete an event
	•	Venue Management:
	•	    Add/Edit venues with capacity info
	•	Prevent booking conflict (two events same time in same venue)
	•	Participant Management:
	•	    View list of registered students per event
	•	    Export participant list (Excel/PDF optional)

✅ Extra (if you want bonus marks 🚀)
	•	Search & Filter: Search events by department/date/organizer
	•	Event Capacity Check: Stop registration if venue is full
	•	Feedback/Ratings: Students can give feedback after event
	•	Reports & Stats: Admin can see most popular events, total participants etc.

form page dbms schemes:
Database Schema:

Store form questions in a table (e.g., event_forms) with fields: event_id, question_id, question_text, question_type, options, is_required, conditional_logic.