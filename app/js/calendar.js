
(((_, window) => {

  // Global namespace
  RedmartSchedular = {};

  const Calendar = RedmartSchedular.Calendar = ((() => {
    const defaults = {
      container: 'calendar-event-container',
      eventTemplate: '<div class="calendar-event" style="top: <%= top %>px; left: <%= left %>px; width: <%= width %>px; background-color:<%= color %>;">' +
                      '<div class="calendar-event-wrapper" style="height: <%= height %>px;">' +
                        '<div class="calendar-event-content">' +
                          '<a class="calendar-event-title" href="#modal-one<%= id %>"><%= title %></a>' +
                          '<div class="calendar-event-location"><%= location %></div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal-one<%= id %>" aria-hidden="true">' +
                    '<div class="modal-dialog">' +
                      '<div class="modal-header">' +
                        '<h2><%= title %></h2>' +
                        '<a href="#" class="btn-close" aria-hidden="true">×</a>' +
                      '</div>' +
                      '<div class="modal-body">' +
                        '<p><%= discription %></p>' +
                      '</div>' +
                      '<div class="modal-footer">' +
                        '<a href="#" class="btn">Close</a>' +
                      '</div>' +
                    '</div>' +
                 ' </div>' 
    };

    /**
     * Creates a new Calendar.
     *
     * @constructor
     * @param {Array}  events  An array of raw event objects. Each event object consists
     *                         of a start and end time (measured in minutes) from 9am,
     *                         as well as a unique id. The start time will be less than
     *                         the end time.
     * @param {Object} options Options to override defaults.
     */
    class Calendar {
      constructor(events, options) {
        options || (options = {});
        this.options = _.extend({}, defaults, options);
        this._defaults = defaults;
        this.eventCollection = new Calendar.EventCollection(options);

        if (events) {
          this.eventCollection.add(events);
          this.init();
        }
      }

      /**
       * Initializes Calendar and calls methods to calculate positions.
       */
      init() {
        this.layOutDay();
      }

      /**
       * Adds Calendar Events to the existing Event Collection.
       *
       * @param {Array} events An array of event objects. Each event object consists
       *                      of a start and end time (measured in minutes) from 9am,
       *                      as well as a unique id. The start time will be less than
       *                      the end time.
       */
      addEvents(events) {
        this.eventCollection.add(events);
      }

      /**
       * Sets the array of event objects that has the width, the left and top
       * positions set, in addition to the id, start and end time. The object
       * should be laid out so that there are no overlapping events.
       *
       * @returns {Array} An array of raw calendar event objects.
       */
      layOutDay() {
        this.eventCollection.calculateCollisionGroups();
        this.eventCollection.calculatePositions();

        console.log(`Part 1 Output:- `, this.eventCollection.raw());
        return this.eventCollection.raw();
      }

      /**
       * Renders the Calendar Events to the page.
       */
      render() {
        if (!this.eventCollection.length) {
          throw Error('There are no events to render.');
        }

        const container = document.getElementById(this.options.container);

        let html = '';
        for (let i = 0, l = this.eventCollection.length; i < l; ++i) {
          const event = this.eventCollection.events[i];
          const template = _.template(this.options.eventTemplate);
          const compiled = template(event);
          html += compiled;
        }

        // Write all elements to page at once for fastest performance
        container.innerHTML = html;
      }
    }

    return Calendar;
  }))();

  RedmartSchedular.Calendar.EventCollection = ((() => {
    const defaults = {
      containerWidth: 700,
      // Decrement offset by 1 since the left container border visually adds 1 pixel
      eventLeftOffset: 9,
      eventHorizontalPadding: 100,
      eventVerticalPadding: 2
    };

    /**
     * Creates a new Calendar EventCollection.
     *
     * @constructor
     * @param {Object} options Options to override defaults.
     */
    class EventCollection {
      constructor(options) {
        options || (options = {});
        this.options = _.extend({}, defaults, options);
        this._defaults = defaults;

        this.length = 0;
        this.collisionGroups = [];
      }

      /**
       * Adds an array of raw event objects to the EventCollection.
       *
       * @param {Array} events An array of raw event objects. Each event object consists
       *                       of a start and end time (measured in minutes) from 9am,
       *                       as well as a unique id. The start time will be less than
       *                       the end time.
       */
      add(events) {
        if (!_.isArray(events))
          throw TypeError('Events must be an array.');
        if (!events.length)
          throw Error('At least one event is required.');

        this.events = [];
        for (let i = 0; i < events.length; ++i) {
          if(events[i]) {
            this.events.push( new Calendar.Event(events[i]));
          }
        }

        // The events must be sorted by their start values in order for the
        // calculate algorithms to works correctly
        this.events = _.sortBy(this.events, 'start');

        this.length = this.events.length;
      }

      /**
       * Returns all of the events in an array of raw event objects.
       *
       * @returns {Array} An array of Calendar event objects.
       */
      raw() {
        return _.map(this.events, event => ({
          id: event.id,
          start: event.start,
          end: event.end,
          top: event.top,
          left: event.left,
          width: event.width,
          height: event.height
        }));
      }

      /**
       * Finds an event in the collection by id. Returns false if not found.
       *
       * @param {Number} event The id of the event object for which to search.
       * @returns {Object | Boolean} The event object. Returns false if not found.
       */
      findById(id) {
        let i = this.events.length;
        while (i--) {
          if (this.events[i].id === id) {
            return this.events[i];
          }
        }
        return false;
      }

      /**
       * Calculates and sets the a collision groups matrix. The matrix has
       * a reference to all the ids of all events in this eventsCollection. The
       * collections are grouped together in a net of all events which overlap,
       * directly. For example, if A overlaps with B and B overlaps with C but
       * A and C do not overlap, each A, B, and C will all be in the same
       * collision group at index 0. If D then does not overlap with any other
       * events, it will be added to a new collision group at the next index.
       */
      calculateCollisionGroups() {
        const events = this.events;
        const collisionGroups = [];
        collisionGroups[0] = [];

        collisionGroups[0].push(events[0].id);

        // Each event starting from second event
        for (let i = 1, l = events.length; i < l; ++i) {
          const event = events[i];

          // Collides with at least one existing collision group
          let found = false;

          // Each previous event or until found
          let j = i - 1;
          do {
            const previousEvent = events[j];

            if (event.collidesWith(previousEvent)) {
              // Find the collision group that previous event belongs to
              // and add current event's id to that collision group

              // Whether the previous event id has been found in a collision group
              let found2 = false;

              // Count backwards since it is probably more likely that
              // latest found collider is further on in the collision
              // groups structure
              let k = collisionGroups.length;
              while (!found2 && k--) {
                if (_.indexOf(collisionGroups[k], previousEvent.id) !== -1) {
                  // Add current event's id to this collision group
                  collisionGroups[k].push(event.id);
                  found2 = true;
                }
              }

              found = true;
            }
          } while (!found && j--);

          // Did not collide with any other events so give it its own
          // collision group
          if (!found) {
            collisionGroups.push([event.id]);
          }
        }

        this.collisionGroups = collisionGroups;
      }

      /**
       * Calculates and sets the positions of all the events in the collision
       * group. Assumes the EventCollection is sorted by start time.
       */
      calculatePositions() {
        // Set tops and heights
        for (var i = 0, l = this.events.length; i < l; ++i) {
          this.events[i].top = this.events[i].start;
          this.events[i].height = this.events[i].end - this.events[i].start - this.options.eventVerticalPadding;
        }

        const collisionGroups = this.collisionGroups;

        // Each collision group
        for (var i = 0, l = collisionGroups.length; i < l; ++i) {
          const group = collisionGroups[i];
          console.log(`collision group ${i}`, group);
          const matrix = [];

          // Initialize first row
          matrix[0] = [];

          // Each event in the collision group
          for (var j = 0, l2 = group.length; j < l2; ++j) {
            // While incrementing columns, if there is no existing last event in
            // the current column, then place the current event. If there is an
            // existing last event in the current column, then check if the
            // current event collides with the existing event. If the event does
            // not collide, then place the current event in the next row of the
            // current column.
            // Here is an example where D does not collide with A, E does not
            // collide with B, and F does not collide with D.
            //
            // [[A, B, C],
            //  [D, E],
            //  [F]
            //

            // Increment columns until spot found
            var event = this.findById(group[j]);
            var col = 0;
            let found = false;
            while(!found) {
              var row = this._getMatrixColumnLastRow(matrix, col);

              if (row === false) {
                // No last event in row and no index so create index and place here
                matrix[0].push(event);
                found = true;
              } else {
                const existingevent = matrix[row][col];
                if (!event.collidesWith(existingevent)) {
                  // Place the current event in the next row of the current column
                  if (matrix[row + 1] === undefined) {
                    matrix[row + 1] = [];
                  }
                  matrix[row + 1][col] = event;
                  found = true;
                }
              }

              col++;
            }
          }

          // When the matrix for this collision group is complete then the
          // dividing value for all events in that group will be the maximum
          // length of all the rows in the matrix. Since all events in the
          // collision group collide with at least one other event in the
          // collision group, then setting all their widths to the divisible
          // will satisfy the condition that every colliding event must be the
          // same width as every other event that it collides with.
          console.log(`matrix ${i}`, matrix);

          // Find the maximum row length
          let maxRowLength = 1;
          for (var j = 0, l2 = matrix.length; j < l2; ++j) {
            maxRowLength = Math.max(maxRowLength, matrix[j].length);
          }
          const eventWidth = (this.options.containerWidth - this.options.eventHorizontalPadding) / maxRowLength;

          // Predefine all possible left positions for this matrix
          const eventLeftPositions = [];
          for (var j = 0, l2 = maxRowLength; j < l2; ++j) {
            eventLeftPositions[j] = (eventWidth * j) + (this.options.eventLeftOffset);
          }

          // Set the left position and width of all the events in the current matrix
          for (var row = 0, l2 = matrix.length; row < l2; ++row) {
            for (var col = 0, l3 = matrix[row].length; col < l3; ++col) {
              var event = matrix[row][col];
              event.left = eventLeftPositions[col];
              event.width = eventWidth;
            }
          }
        }
      }

      /**
       * Given a matrix and a column, return the row of the last
       * event in the column or false if no event is present.
       * 
       * @param {Array} matrix A two-dimensional array of event ids.
       * @param {Numer} col    The column of the matrix to search.
       * @returns {Number | Boolean} The row of the last event in the column.
       *                             Returns false if no element was found.
       */
      _getMatrixColumnLastRow(matrix, col) {
        // From the last row in the matrix, search for the column where there
        // is a value or until there are no more rows
        let row = matrix.length;
        while (row--) {
          if (matrix[row][col] !== undefined) return row;
        }

        // No more rows
        return false;
      }
    }

    return EventCollection;
  }))();

  RedmartSchedular.Calendar.Event = ((() => {
    /**
     * Creates a new Calendar Event.
     *
     * @constructor
     * @param {Object} event A raw calendar event object. The event
     *                       object consists of a start and end time 
     *                       (measured in minutes) from 9am, as well as a
     *                       unique id. The start time will be less than
     *                       the end time.
     */
    class Event {
      constructor(event) {
        if (!event.hasOwnProperty('id'))
          throw TypeError('Event id is required.');
        if (!event.hasOwnProperty('start'))
          throw TypeError('Event start is required.');
        if (!event.hasOwnProperty('end'))
          throw TypeError('Event end is required.');
        if (event.end - event.start <= 0)
          throw TypeError('Event end time must be greater than start time.');

        this.id = event.id;
        this.start = event.start;
        this.end = event.end;
        this.color = this.getRandomColor();
        this.title = event.title;
        this.location = event.location;
        this.discription = event.discription;
        this.top = null;
        this.left = null;
        this.width = null;
        this.height = null;
        this.widthDivisor = null;
      }

      /**
       * Returns true if the given Event coincides with the same time as the
       * calling Event.
       *
       * @param {Object} otherEvent The other event to compare with this Event.
       * @returns {boolean} If the other event occurs within the same time
       *                    as the first object.
       */
      collidesWith(otherEvent) {
        if ( (this.start <= otherEvent.start && otherEvent.start <= this.end) ||
             (this.start <= otherEvent.end && otherEvent.end <= this.end) ||
             (otherEvent.start <= this.start && this.start <= otherEvent.end) ||
             (otherEvent.start <= this.end && this.end <= otherEvent.end) ) {
          return true;
        }
        return false;
      }

      getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    }

    return Event;
  }))();

  return RedmartSchedular;
}))(_, window);
