
(((window, document) => {

  // Note: See spec/unit/CalendarSpec.js for more test data

  // Events from part 1
  // var events = [
  //   { id: 1, start: 60, end: 179 },
  //   { id: 2, start: 180, end: 299 },
  //   { id: 3, start: 300, end: 419 },
  //   { id: 4, start: 120, end: 239 },
  //   { id: 5, start: 240, end: 330 },
  //   { id: 6, start: 180, end: 360 },
  //   { id: 7, start: 480, end: 540 }
  // ];

  const events = [
    { id: 1, start: 60, end: 120 , title: 'UI/UX Meeting', location: 'Technica'},
    { id: 2, start: 150, end: 270, title: 'Vikings StandUp', location: 'Vikings Bay'},
    { id: 3, start: 240, end: 300, title: 'Oauth Grooming', location: 'Nexus'}, 
    { id: 4, start: 200, end: 360, title: 'Local SOS', location: 'Marina Bay'}, 
    { id: 5, start: 180, end: 330, title: 'Risk Assesment', location: 'Softlayer'},
    { id: 6, start: 960, end: 1020, title: 'App team Sync-Up', location: 'Softlayer'},
    
  ];

  const calendar = new RedmartSchedular.Calendar(events, {
    container: 'calendar-event-container'
  });

  window.onload = () => {
    calendar.render();
  };

}))(window, document);
