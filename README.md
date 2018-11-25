# Calendar Meeting Schedular

### Problem Description

#### PART 1:
Create a function to calculate the positioning and width of meetings on a calendar for a single day (9 AM to 9 PM). Assume each minute on the calendar to have a height of 2px(Total height = 1440px). The width should be 600px.
- If there is one meeting between 11.30 and 12, show the meeting at the appropriate time, with a width of 600px.
- If there is more than one event, then the entire width should be split accordingly. (2 events of 300px each).
The input to the function will be an array of meeting objects with the time of the beginning and end specified in minutes after 9 AM. For example,

```javascript
[{
id : 123, start : 120, end : 150
}]
```
specifies a meeting starting at 11 AM and ending at 11.30 AM.
Return the array of the meetings with the width of each meeting, as well as the CSS attributes for its position. (top and left)


#### Part 2:

Build a webpage that uses the function from PART 1, to show the following meetings -

```javascript
[
{ id: "New", start: 60, end: 120 },
{ id: "New 1", start: 150, end: 270 }, { id: "New 2", start: 240, end: 300 }, { id: "New 3", start: 200, end: 360 }, { id: "New 4", start: 180, end: 330 },
]
```
#### PART 3:
 
* Add new meeting, and All meetings should be aligned accordingly.
* Extensibility of the function.


### Project Organization

Calendar is a class of the RedmartSchedular module. EventCollection and Event are classes of Calendar properties so that they may be referenced via Calendar.EventCollection and Calendar.Event, respectively. A class for the Event exists beyond what the normal event object so that it will be more robust as features are added to the Calendar and the Event object has more functionality added to it.

#### How to Run
Navigate to `app/index.html` and open in any browser of your choice. Also go to Developer Console to see Part 1 Output.

### Dependencies

The only dependency for the calendar is [Lo-Dash](https://github.com/bestiejs/lodash), an optimized version of the JavaScript utility library, [Underscore.js](https://github.com/documentcloud/underscore). The library is used for simple operations such as mapping and sorting, and nothing significant.

### Testing

Unit tests are used to verify the expected output of the left and top positions as well as the widths and heights of the events after processing. A few sample event collections are tested. 

#### How to Run
Unit tests are performed using [Jasmine](https://github.com/pivotal/jasmine) by navigating to `spec/SpecRunner.html` in the browser.

### ToDo (Future Scope)

* Add support for Delete and Update an Event based on id.
* Drag and Drop Support to Update meeting timings.
* Write Integration test cases for view.
* Cosmetic changes to Calendar, Modal, and Form.
* Make it responsible using bootstrap or any other library.
* Extend Event Object to include other properties such as Guests, Organizer etc.
* Extend MeetingSchedular for Week, Month and Year.
* Write API for Events.
