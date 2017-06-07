/**
 * @license
 * Copyright 2017 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.cron',
  name: 'Cron',
  extends: 'foam.nanos.script.Script',
  javaImports: [
    'java.util.Date',
    'java.util.Calendar'
  ],
  documentation: 'FOAM class that models a Cron script',
  properties: [
    {
      class: 'Int',
      name: 'minute',
      value: -1,
      documentation: `Minute to execute script.
          Ranges from 0 - 59. -1 for wildcard`
    },
    {
      class: 'Int',
      name: 'hour',
      value: -1,
      documentation: `Hour to execute script.
          Ranges from 0 - 23. -1 for wildcard`
    },
    {
      class: 'Int',
      name: 'dayOfMonth',
      value: -1,
      documentation: `Day of Month to execute script.
          Ranges from 1 - 31. -1 for wildcard`
    },
    {
      class: 'Int',
      name: 'month',
      value: -1,
      documentation: `Month to execute script.
          Ranges from 1 - 12. -1 for wildcard`
    },
    {
      class: 'Int',
      name: 'dayOfWeek',
      value: -1,
      documentation: `Day of week to execute script.
          Ranges from 0 - 6, where 0 is Sunday. -1 for wildcard`
    },
    {
      class: 'DateTime',
      name: 'scheduledTime',
      documentation: `Scheduled time to run Cron script.`,
      javaFactory: function() {
/*Calendar now = Calendar.getInstance();
now.set(Calendar.MILLISECOND, 0);
now.set(Calendar.SECOND, 0);
if ( getMinute() >= 0 && getMinute() <= 59 ) now.set(Calendar.MINUTE, getMinute());
if ( getHour() >= 0 && getHour() <= 23 ) now.set(Calendar.HOUR_OF_DAY, getHour());
if ( getDayOfMonth() >= 1 && getDayOfMonth() <= 31 ) now.set(Calendar.DAY_OF_MONTH, getDayOfMonth());
if ( getMonth() >= 1 && getMonth() <= 12 ) now.set(Calendar.MONTH, getMonth() - 1);
if ( getDayOfWeek() >= 0 && getDayOfWeek() <= 6 ) now.set(Calendar.DAY_OF_WEEK, getDayOfWeek() + 1);
return now.getTime();*/
      }
    }
  ],

  methods: [
    {
      name: 'getNextScheduledTime',
      javaReturns: 'Date',
      javaCode: function() {
/*Calendar next = Calendar.getInstance();
next.add(Calendar.MINUTE, 1);
next.set(Calendar.MILLISECOND, 0);
next.set(Calendar.SECOND, 0);

boolean dateFound = false;
while ( next.get(Calendar.YEAR) < 3000 ) {
  if ( getMonth() >= 0 && next.get(Calendar.MONTH) != getMonth() - 1 ) {
    next.add(Calendar.MONTH, 1);
    next.set(Calendar.DAY_OF_MONTH, 1);
    next.set(Calendar.HOUR_OF_DAY, 0);
    next.set(Calendar.MINUTE, 0);
    continue;
  }
  if ( ( getDayOfMonth() >= 0 && next.get(Calendar.DAY_OF_MONTH) != getDayOfMonth() ) ||
      ( getDayOfWeek() >= 0 && next.get(Calendar.DAY_OF_WEEK) != getDayOfWeek() + 1) ) {
    next.add(Calendar.DAY_OF_MONTH, 1);
    next.set(Calendar.HOUR_OF_DAY, 0);
    next.set(Calendar.MINUTE, 0);
    continue;
  }
  if ( getHour() >= 0 && next.get(Calendar.HOUR_OF_DAY) != getHour() ) {
    next.add(Calendar.HOUR_OF_DAY, 1);
    next.set(Calendar.MINUTE, 0);
    continue;
  }
  if ( getMinute() >= 0 && next.get(Calendar.MINUTE) != getMinute() ) {
    next.add(Calendar.MINUTE, 1);
    continue;
  }
  dateFound = true;
  break;
}
if ( !dateFound ) {
  throw new Exception("Unable to get next scheduled time");
}
return next.getTime();*/
      }
    }
  ]
});
