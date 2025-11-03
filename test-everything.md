# Comprehensive Test Script - Educate.io Quiz Module

This document provides a complete testing checklist for all features and pages in the application.

## Test Environment Setup

1. **Start the Application**
   ```bash
   npm run dev
   ```
   - Frontend should start on http://localhost:3000
   - Backend should start on http://localhost:3001

2. **Demo Credentials**
   - Student: `student@demo.com` / `demo123`
   - Teacher: `teacher@demo.com` / `demo123`

---

## 1. Authentication Tests

### 1.1 Login Page (`/login`)
- [ ] Page loads correctly
- [ ] Demo credentials are displayed in the info box
- [ ] Can login with student credentials (`student@demo.com` / `demo123`)
- [ ] Can login with teacher credentials (`teacher@demo.com` / `demo123`)
- [ ] Error message shows for invalid credentials
- [ ] After login, redirects to `/quizzes`
- [ ] Registration is disabled (shows appropriate message)

### 1.2 Authentication State
- [ ] User session persists after page refresh
- [ ] User profile displays correctly in Sidebar
- [ ] Logout functionality works
- [ ] Redirected to login when not authenticated

---

## 2. Dashboard Page Tests (`/dashboard`)

### 2.1 Page Load
- [ ] Page loads without errors
- [ ] Sidebar displays correctly
- [ ] All sections are visible

### 2.2 Statistics Cards
- [ ] Total Quizzes card displays correct count
- [ ] Published Quizzes card displays correct count
- [ ] Drafts card displays correct count
- [ ] Total Questions card displays correct count
- [ ] Icons display correctly

### 2.3 Quick Actions
- [ ] "Create Quiz" button navigates to `/quizzes/new`
- [ ] "View All Quizzes" button navigates to `/quizzes`
- [ ] "View Analytics" button works
- [ ] "Manage Students" button works

### 2.4 Recent Quizzes Section
- [ ] Displays recent quizzes if any exist
- [ ] Shows empty state with icon and button if no quizzes
- [ ] Clicking quiz navigates to edit page
- [ ] "View All" button navigates to quizzes page
- [ ] Quiz status badges display correctly

---

## 3. Quizzes Page Tests (`/quizzes`)

### 3.1 Page Load
- [ ] Page loads without errors
- [ ] Quizzes list displays (or empty state)

### 3.2 Search Functionality
- [ ] Search input is visible
- [ ] Can type in search box
- [ ] Search filters quizzes by title
- [ ] Search works in real-time

### 3.3 Filter Functionality
- [ ] "All" filter button works
- [ ] "Published" filter button works
- [ ] "Draft" filter button works
- [ ] "Archived" filter button works
- [ ] Active filter is highlighted

### 3.4 Sort Functionality
- [ ] Sort dropdown is visible
- [ ] Can select sort options (Date Created, Title, Status)

### 3.5 Quiz Cards
- [ ] Quiz cards display correctly
- [ ] Status badges show correct colors
- [ ] Question count displays
- [ ] Assignment status displays
- [ ] Last edited date displays
- [ ] "Edit" button navigates to edit page
- [ ] "Preview" button works (or shows message)
- [ ] Three-dot menu button is visible

### 3.6 Empty State
- [ ] Shows icon, message, and button when no quizzes
- [ ] Button navigates to create quiz page

### 3.7 Create Quiz Button
- [ ] "Create New Quiz" button is visible
- [ ] Button navigates to `/quizzes/new`

---

## 4. Quiz Creation Tests (`/quizzes/new`)

### 4.1 Page Load
- [ ] Page loads without errors
- [ ] All 4 steps visible in sidebar
- [ ] Step 1 (General) is active by default

### 4.2 Step 1: General Settings
- [ ] Quiz Title input is visible
- [ ] Can type quiz title
- [ ] Description textarea is visible
- [ ] Can type description
- [ ] "Enable Negative Marking" toggle works
- [ ] "Show Instant Feedback" toggle works
- [ ] "Show in Gradebook" toggle works

### 4.3 Step 2: Timing & Attempts
- [ ] Can navigate to Step 2
- [ ] Time Limit input is visible
- [ ] Can enter time limit in minutes
- [ ] Shows preview text when time limit is set
- [ ] Max Attempts input is visible
- [ ] Can change max attempts
- [ ] Shows correct attempt count message
- [ ] "Shuffle Questions" toggle works
- [ ] Start Date & Time input is visible
- [ ] End Date & Time input is visible
- [ ] Can select dates

### 4.4 Step 3: Access Control
- [ ] Can navigate to Step 3
- [ ] "Require Access Code" toggle works
- [ ] Access Code input appears when toggle is on
- [ ] Can enter access code
- [ ] "Allow Anonymous Access" toggle works

### 4.5 Step 4: Publishing
- [ ] Can navigate to Step 4
- [ ] Review section displays all entered information
- [ ] Basic Information section is correct
- [ ] Timing & Attempts section is correct
- [ ] Access Control section is correct
- [ ] Scoring & Feedback section is correct

### 4.6 Navigation
- [ ] "Previous" button appears on steps 2-4
- [ ] "Previous" button navigates to previous step
- [ ] "Next" button appears on steps 1-3
- [ ] "Next" button navigates to next step
- [ ] Can't proceed from step 1 without title
- [ ] "Save as Draft" button appears on step 4
- [ ] "Save & Publish" button appears on step 4
- [ ] Both save buttons work (navigate to edit page)

---

## 5. Quiz Editor Tests (`/quizzes/[id]/edit`)

### 5.1 Page Load
- [ ] Page loads without errors
- [ ] Quiz title displays in sidebar
- [ ] Question list sidebar is visible

### 5.2 Question List Sidebar
- [ ] Displays all questions for the quiz
- [ ] Shows question type and number
- [ ] Can click on question to select it
- [ ] Selected question is highlighted
- [ ] "Add New Question" button is visible

### 5.3 Question Editor
- [ ] Question type buttons are visible (Multiple Choice, True/False, Matching, Drag & Drop)
- [ ] Can change question type
- [ ] Question Prompt textarea is visible
- [ ] Can edit question prompt
- [ ] For Multiple Choice: options inputs are visible
- [ ] Can add new option
- [ ] Can remove option
- [ ] Can select correct answer (radio buttons)
- [ ] Explanation textarea is visible
- [ ] Can add explanation

### 5.4 Save Functionality
- [ ] "Save Question" button is visible
- [ ] Can save question (new or edited)
- [ ] "Cancel" button navigates back to quizzes

### 5.5 Empty State
- [ ] Shows message when no questions are selected
- [ ] Can add first question

---

## 6. Performance Page Tests (`/performance/[quizId]`)

### 6.1 Page Load
- [ ] Page loads without errors
- [ ] KPI cards display
- [ ] Loading state shows initially

### 6.2 KPI Cards
- [ ] Average Score card displays value
- [ ] Completion Rate card displays value
- [ ] Toughest Question card displays value
- [ ] Top Performer card displays name

### 6.3 Score Distribution Chart
- [ ] Chart section is visible
- [ ] Bar chart displays (or placeholder data)
- [ ] Chart is responsive

### 6.4 Performance by Topic
- [ ] Section is visible
- [ ] Topics display with scores
- [ ] Progress bars display correctly
- [ ] Percentages are accurate

### 6.5 Leaderboard
- [ ] Section is visible
- [ ] Top 3 have special styling (trophy/medal icons)
- [ ] Student names display
- [ ] Scores display
- [ ] Attempt numbers display
- [ ] Completion dates display
- [ ] Rankings are correct
- [ ] Info message displays at bottom

---

## 7. Courses Page Tests (`/courses`)

### 7.1 Page Load
- [ ] Page loads without errors
- [ ] Courses display (or empty state)

### 7.2 Search Functionality
- [ ] Search input is visible
- [ ] Can search by course name
- [ ] Can search by course code
- [ ] Results filter in real-time

### 7.3 Course Cards
- [ ] Course cards display correctly
- [ ] Course code badge is visible
- [ ] Course name displays
- [ ] Description displays (if available)
- [ ] Student count displays
- [ ] Quiz count displays
- [ ] Created date displays
- [ ] Can click on card (shows alert for now)

### 7.4 Create Course Button
- [ ] "Create New Course" button is visible
- [ ] Button works (shows alert for now)

### 7.5 Empty State
- [ ] Shows icon, message, and button when no courses
- [ ] Button works

---

## 8. Grades Page Tests (`/grades`)

### 8.1 Page Load
- [ ] Page loads without errors
- [ ] Statistics cards display

### 8.2 Statistics Cards
- [ ] Total Submissions card displays count
- [ ] Completed card displays count
- [ ] Pending card displays count
- [ ] Average Score card displays percentage

### 8.3 Search and Filter
- [ ] Search input is visible
- [ ] Can search by student name
- [ ] Can search by quiz title
- [ ] Can search by course
- [ ] Filter buttons are visible
- [ ] "All" filter works
- [ ] "Completed" filter works
- [ ] "Pending" filter works

### 8.4 Grades Table
- [ ] Table displays all columns
- [ ] Student names display
- [ ] Quiz titles display
- [ ] Course codes display as badges
- [ ] Scores display with color coding
- [ ] Status badges display with correct colors
- [ ] Submitted dates display
- [ ] Table is responsive

### 8.5 Score Color Coding
- [ ] 90%+ scores are green
- [ ] 70-89% scores are blue
- [ ] 50-69% scores are yellow
- [ ] <50% scores are red

---

## 9. Students Page Tests (`/students`)

### 9.1 Page Load
- [ ] Page loads without errors
- [ ] Statistics cards display

### 9.2 Statistics Cards
- [ ] Total Students card displays count
- [ ] Active card displays count
- [ ] Inactive card displays count
- [ ] Average Score card displays percentage

### 9.3 Search and Filter
- [ ] Search input is visible
- [ ] Can search by student name
- [ ] Can search by email
- [ ] Filter buttons are visible
- [ ] "All" filter works
- [ ] "Active" filter works
- [ ] "Inactive" filter works

### 9.4 Student Cards
- [ ] Student cards display in grid
- [ ] Avatar with initials displays
- [ ] Student name displays
- [ ] Email displays with icon
- [ ] Status badge displays with correct color
- [ ] Course count displays
- [ ] Quiz count displays
- [ ] Average score displays with color coding

### 9.5 Add Student Button
- [ ] "Add Student" button is visible
- [ ] Button works (shows alert for now)

### 9.6 Empty State
- [ ] Shows icon, message, and button when no students
- [ ] Button works

---

## 10. Settings Page Tests (`/settings`)

### 10.1 Page Load
- [ ] Page loads without errors
- [ ] All sections are visible

### 10.2 Profile Section
- [ ] Profile section is visible
- [ ] User avatar displays with initials
- [ ] User name displays
- [ ] Email displays
- [ ] Role displays
- [ ] "Edit Profile" button is visible

### 10.3 Notification Settings
- [ ] "Email Notifications" toggle works
- [ ] "Quiz Reminders" toggle works
- [ ] "Grade Notifications" toggle works
- [ ] Descriptions display

### 10.4 Preferences
- [ ] "Dark Mode" toggle is visible (disabled)
- [ ] "Auto Save" toggle works
- [ ] Descriptions display

### 10.5 Security Section
- [ ] Security section is visible
- [ ] Current Password input is visible
- [ ] New Password input is visible
- [ ] Confirm Password input is visible
- [ ] "Change Password" button is visible

### 10.6 Save Functionality
- [ ] "Cancel" button navigates back
- [ ] "Save Settings" button is visible
- [ ] Button saves settings (shows success message)

---

## 11. Sidebar Component Tests

### 11.1 Navigation
- [ ] Logo displays
- [ ] All navigation items are visible
- [ ] Active route is highlighted
- [ ] Can click on each navigation item
- [ ] Dashboard link works
- [ ] Courses link works
- [ ] Quizzes link works
- [ ] Grades link works
- [ ] Students link works

### 11.2 User Profile
- [ ] User profile displays after login
- [ ] Avatar with initials displays
- [ ] User name displays
- [ ] Role displays

### 11.3 Bottom Actions
- [ ] Settings link is visible
- [ ] Log Out button is visible
- [ ] Back to Dashboard link is visible
- [ ] All links work correctly

### 11.4 Mobile Responsiveness
- [ ] Mobile menu button is visible on small screens
- [ ] Sidebar is hidden by default on mobile
- [ ] Can toggle sidebar on mobile
- [ ] Overlay appears when sidebar is open

---

## 12. Responsive Design Tests

### 12.1 Desktop (1920x1080)
- [ ] All pages display correctly
- [ ] Sidebar is always visible
- [ ] Content is properly spaced

### 12.2 Tablet (768x1024)
- [ ] Pages adapt to tablet size
- [ ] Sidebar works correctly
- [ ] Cards display in grid

### 12.3 Mobile (375x667)
- [ ] Mobile menu button appears
- [ ] Sidebar is hidden by default
- [ ] Content is stacked vertically
- [ ] All buttons are tappable
- [ ] Forms are usable

---

## 13. Error Handling Tests

### 13.1 Network Errors
- [ ] Graceful handling when API is unavailable
- [ ] Error messages display appropriately
- [ ] App doesn't crash

### 13.2 Invalid Routes
- [ ] 404 page or redirect works
- [ ] Invalid quiz IDs handled

### 13.3 Authentication Errors
- [ ] Redirects to login when token invalid
- [ ] Shows error messages appropriately

---

## 14. Performance Tests

### 14.1 Page Load Speed
- [ ] Pages load within reasonable time
- [ ] No excessive loading states

### 14.2 Smooth Navigation
- [ ] Page transitions are smooth
- [ ] No flickering
- [ ] No layout shifts

---

## 15. Accessibility Tests

### 15.1 Keyboard Navigation
- [ ] Can navigate all pages with keyboard
- [ ] Focus indicators are visible
- [ ] Tab order is logical

### 15.2 Screen Reader
- [ ] All images have alt text
- [ ] Form labels are associated
- [ ] Buttons have descriptive text

### 15.3 Color Contrast
- [ ] Text is readable
- [ ] Links are distinguishable
- [ ] Buttons have sufficient contrast

---

## 16. Cross-Browser Tests

### 16.1 Chrome
- [ ] All features work
- [ ] Styling is correct

### 16.2 Firefox
- [ ] All features work
- [ ] Styling is correct

### 16.3 Safari
- [ ] All features work
- [ ] Styling is correct

### 16.4 Edge
- [ ] All features work
- [ ] Styling is correct

---

## 17. Final Checklist

### 17.1 All Pages Created
- [ ] Dashboard (`/dashboard`)
- [ ] Courses (`/courses`)
- [ ] Quizzes (`/quizzes`)
- [ ] Grades (`/grades`)
- [ ] Students (`/students`)
- [ ] Settings (`/settings`)
- [ ] Login (`/login`)
- [ ] Quiz Create (`/quizzes/new`)
- [ ] Quiz Edit (`/quizzes/[id]/edit`)
- [ ] Performance (`/performance/[quizId]`)

### 17.2 All Features Working
- [ ] Authentication works
- [ ] Navigation works
- [ ] CRUD operations work
- [ ] Search works
- [ ] Filters work
- [ ] Forms work
- [ ] Buttons work

### 17.3 No Errors
- [ ] No console errors
- [ ] No hydration errors
- [ ] No TypeScript errors
- [ ] No build errors

---

## Testing Instructions

1. **Run the application**: `npm run dev`
2. **Use demo credentials** to login
3. **Go through each section** systematically
4. **Test each checkbox** in order
5. **Report any failures** or issues found
6. **Retest after fixes** to ensure resolution

---

## Test Results

Date: _______________
Tester: _______________
Environment: _______________

**Summary:**
- Total Tests: 250+
- Passed: _____
- Failed: _____
- Notes: _______________________________________________

