
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
    { id: 1, start: 60, end: 120 , title: 'UI/UX Meeting', location: 'Technica' , discription: 'Putting UX/UI meetings back on the calendar on a monthly basis. The agenda is up to us to decide as a team, so if you have topics for future meetings, let\'s talk about them ahead of time so that we can have productive and valuable meetings'},
    { id: 2, start: 150, end: 270, title: 'Tachyons StandUp', location: 'Tachyons Bay', discription: 'Daily upadates of each team member and possible risk/dependencies factors'},
    { id: 3, start: 240, end: 300, title: 'Oauth Grooming', location: 'Nexus', discription: 'Lets have grooming about how to use oauth features and which services we should consider'}, 
    { id: 4, start: 200, end: 360, title: 'Local SOS', location: 'Marina Bay', discription: 'Putting this meeting to discuss each teams current user stories updates'}, 
    { id: 5, start: 180, end: 330, title: 'Risk Assesment', location: 'Softlayer', discription: 'With the deploy coming this weekend, it\'s time for the v155 product risk assesment'},
    { id: 6, start: 960, end: 1020, title: 'App team Sync-Up', location: 'Softlayer', discription: 'Lets meet all app engineers to spend some time to evaluate overselfs.'},
  ];

  var calendar = new RedmartSchedular.Calendar(events, {
    container: 'calendar-event-container'
  });

  window.onload = () => {
    calendar.render();
    calendar = null;
    delete calendar;
  };

  document.getElementById('submit-btn').addEventListener('click', function(event) {
    var eventObject = {
      'id': ++events.length,
      'start': parseInt(document.querySelector("input[name='start']").value, 10),
      'end': parseInt(document.querySelector("input[name='end']").value, 10),
      'title': document.querySelector("input[name='title']").value,
      'location': document.querySelector("input[name='location']").value,
      'discription': document.querySelector("input[name='discription']").value
    }
    events.push(eventObject);
    new RedmartSchedular.Calendar(events, {
      container: 'calendar-event-container'
    }).render();
    showAlertMessage(); 
  });

  function showAlertMessage() {
    document.querySelector(".webform-confirmation").style.display = 'inline-flex';
    hideAlertMessage();
  }

  function hideAlertMessage() {
    setTimeout(() => {
      document.querySelector(".webform-confirmation").style.display = 'none';
    }, 1000);
    
  }

}))(window, document);
