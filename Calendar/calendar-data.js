// Vasa academic calendar 2026-27, transcribed from the school's calendar sheet (the vasa-26:27-*.png screenshots).
// Single source for both index.html and Vasa-2026-27.ics — after editing, regenerate the .ics with:
//   node make-ics.js
(function(){
  var LEGEND = [
    ['asc', 'School is closed / ASC open'],
    ['closed', 'School and ASC are closed'],
    ['packed', 'Theme day / Packed lunch day'],
    ['theme', 'Theme day / School lunch'],
    ['prao', 'PRAO'],
    ['np', 'Nationella Prov / National tests'],
    ['end', 'Students start / end']
  ];

  // [week, month label, Monday's date, [Mon..Fri], all-week, weeks spanned (default 1)].
  // A cell is null, "text" or ["category", "text"]. An all-week cell may add {from, to} when it covers more than
  // that one week; the page still shows it in its week, the .ics spans the whole range.
  // Text may contain <span class="g"> (green) or <span class="r"> (red) as in the original sheet.
  var A = function(t){ return ['asc', t || 'ASC']; };
  var WEEKS = [
    ['31', 'July', '2026-07-27', [A(), A(), A(), A(), A()]],
    ['32', 'Aug', '2026-08-03', [A(), A(), A('ASC (Vasa)'), A(), A('ASC (Teachers start)')]],
    ['33', 'Aug', '2026-08-10', [A(), A('ASC\nNo meeting'), A('ASC\nStaff meeting'), A(), A()]],
    ['34', 'Aug', '2026-08-17', [['closed', 'Students start/opening ceremony (ASC Closed)'], ['packed', 'Mentor Day'], null, null, null], 'Form PTA\nForm Winter Party Committee'],
    ['35', 'Aug', '2026-08-24', [null, null, 'MYP 4 Eknäs', 'MYP 4 Eknäs', null]],
    ['36', 'Aug/Sep', '2026-08-31', [null, 'PYP Parent evening\nEY-PYP3 16.00-17.00,\nPYP 4-PYP6 16.30-17.30', 'MYP Parent Meeting 16.30-17.30', null, ['packed', 'Learner Profile Day']]],
    ['37', 'Sep', '2026-09-07', [['theme', 'Integrity Week\nMT Lesson starts'], ['theme', 'Integrity Week'], ['theme', 'Integrity Week'], ['theme', 'Integrity Week'], ['theme', 'Integrity Week']], 'Integrity Week'],
    ['38', 'Sep', '2026-09-14', [null, null, null, ['theme', 'Vasa Health Run (Skoljoggen)'], null], ['', 'Dev Talks Week 38-43', { from:'2026-09-14', to:'2026-10-23' }]],
    ['39', 'Sep', '2026-09-21', [null, null, null, 'School photo', 'School photo']],
    ['40', 'Sep/Oct', '2026-09-28', [['theme', 'PYP6 - Football tournament (ES, VASA & ISKH)'], null, null, null, null]],
    ['41', 'Oct', '2026-10-05', [null, null, null, null, null]],
    ['42', 'Oct', '2026-10-12', [null, 'MYP Dev Talk', 'MYP Dev Talk', 'MYP Dev Talk', null]],
    ['43', 'Oct', '2026-10-19', [null, null, null, ['packed', 'UN day\nPYP 5-PYP 6 dev talks, PYP 3'], ['theme', 'Halloween Party']]],
    ['44', 'Oct', '2026-10-26', [A(), A(), A(), A(), ['closed', 'ASC Closed Study Day']]],
    ['45', 'Nov', '2026-11-02', [null, null, null, null, ['theme', 'Diwali Celebration Nov 8th']]],
    ['46', 'Nov', '2026-11-09', [null, 'MYP classes end at 14.00 (most likely)', null, null, null]],
    ['47', 'Nov', '2026-11-16', [
      ['theme', 'Career Week\n<span class="g">PRAO MYP3</span>'],
      ['theme', 'Career Week\n<span class="g">PRAO MYP3</span>\nGymnasiemässan Nov 17-19'],
      ['theme', 'Career Week\n<span class="g">PRAO MYP3</span>\nGymnasiemässan Nov 17-19'],
      ['theme', 'Career Week\n<span class="g">PRAO MYP3</span>\nGymnasiemässan VASA and ISKH 9.00-15.00'],
      ['theme', 'Career Week\n<span class="g">PRAO MYP3</span>']], ['np', 'Oral NP']],
    ['48', 'Nov', '2026-11-23', [null, null, null, null, A('ASC Open\nTeacher Study Day')]],
    ['49', 'Nov/Dec', '2026-11-30', [null, null, null, null, 'Winter Concert (church booked 15.00-17.00) & Winter Party']],
    ['50', 'Dec', '2026-12-07', [null, null, ['theme', 'Nobel Meal and Nobel day focus'], null, null]],
    ['51', 'Dec', '2026-12-14', [null, null, ['packed', 'Class Day / Choice Day MYP'], ['end', 'Students end'], A('ASC Open')]],
    ['52', 'Dec', '2026-12-21', [A(), A(), A('ASC\nClosing 15:00'), ['closed', 'ASC Closed\nRÖD DAG'], ['closed', 'ASC Closed | RÖD DAG: Juldagen']]],
    ['53', 'Dec/Jan', '2026-12-28', [['closed', 'ASC Closed'], ['closed', 'ASC Closed'], ['closed', 'ASC Closed'], ['closed', 'ASC Closed\nRÖD DAG'], ['closed', 'ASC Closed\nRÖD DAG']]],
    ['1', 'Jan', '2027-01-04', [A(), A('ASC\nClosing 15:00'), ['closed', 'ASC Closed | RÖD DAG: Trettondedag jul'], A(), A()]],
    ['2', 'Jan', '2027-01-11', [A('ASC\nTeachers start'), ['end', 'Students start - regular schedule'], null, null, null]],
    ['3', 'Jan', '2027-01-18', [null, null, null, null, null]],
    ['4', 'Jan', '2027-01-25', [null, null, null, null, null]],
    ['5', 'Feb', '2027-02-01', [['theme', 'Book Week'], ['theme', 'Book Week'], ['theme', 'Book Week'], ['theme', 'Book Week\nPYP3: Tvåornas Kör 1a lektionen 40 min efter lunch'], ['theme', 'Book Week']]],
    ['6', 'Feb', '2027-02-08', [null, null, null, null, null], 'PYP Dev Talks Week 6-12'],
    ['7', 'Feb', '2027-02-15', [null, null, null, null, null]],
    ['8', 'Feb', '2027-02-22', [null, 'MYP Subject Talks (14.00-18.00)', 'MYP Subject Talks (14.00-18.00)', 'MYP Subject Talks (14.00-18.00)\nPYP3: Tvåornas Kör 2a lektion 40 min efter lunch', null]],
    ['9', 'Mar', '2027-03-01', [A(), A(), A(), A(), ['closed', 'ASC Study Day']]],
    ['10', 'Mar', '2027-03-08', [null, null, null, 'Pi Day', A('Romme Ski Trip\nASC Open\nTeacher Study Day')]],
    ['11', 'Mar', '2027-03-15', [null, null, ['np', 'NP - Sv MYP 4\n200 min'], null, ['np', 'NP - Sv MYP 4\n200 min']], ['np', 'NP - PYP4\nMarch 15 - May 21', { from:'2027-03-15', to:'2027-05-21' }]],
    ['12', 'Mar', '2027-03-22', [null, null, null, 'ASC Closing 15.00', ['closed', 'Långfredagen']]],
    ['13', 'Mar/Apr', '2027-03-29', [['closed', 'Annandag påsk'], A('ASC/ Easter break'), A('ASC/ Easter break'), A('ASC/ Easter break'), A('ASC/ Easter break')]],
    ['14', 'Apr', '2027-04-05', [['prao', 'PRAO'], ['prao', 'PRAO'], ['prao', 'PRAO'], ['prao', 'PRAO'], ['prao', 'PRAO']]],
    ['15', 'Apr', '2027-04-12', [null, ['np', 'NP - Eng MYP 4\n90+30 min'], null, ['np', 'NP - Eng MYP 4\n80 min\nPYP3: Tvåornas Kör 3e lektion 40 min efter lunch'], 'Staff Conference?']],
    ['16', 'Apr', '2027-04-19', [['np', 'NP - Eng MYP 1\n70 + 55 min'], ['np', 'NP - NO MYP 4\n90+90 min'], ['np', 'NP - Eng MYP 1\n45 min'], ['packed', 'Celebration of Learning Day\nPYP 6 Exhibition\nMYP Community Project\n13.00-17.00'], null], '<span class="r">MYP4 Tallinn- TBD</span>'],
    ['17', 'Apr', '2027-04-26', ['IB Evaluation visit', ['np', 'NP - SV MYP 1\n80 + 80 min\nIB Evaluation visit'], ['np', 'NP - SO MYP 4\n120 min\nIB Evaluation visit'], ['np', 'NP - SV MYP 1\n70 + 60 min'], 'ASC Closing 15.00\nValborg']],
    ['18', 'May', '2027-05-03', [null, ['np', 'NP - SO MYP 4\n120 min'], 'ASC Closing 15.00', ['closed', 'Ascension day'], ['closed', 'Bridge Day / Klämdag']]],
    ['19', 'May', '2027-05-10', [null, ['np', 'NP - Math MYP 1\n40+80 min\nFritidshemmets dag 2027'], ['np', 'NP- Math MYP 4\n40+80 min'], ['np', 'NP - Math MYP 1\n80+40 min'], ['np', 'NP - Math MYP 4\n40+80 min']]],
    ['20', 'May', '2027-05-17', [null, null, null, 'Student orientation day PYP1', 'Student orientation day EY']],
    ['21', 'May', '2027-05-24', [null, ['packed', 'Global Day\nEY-P5 / P6-MYP'], null, null, null]],
    ['22', 'May/Jun', '2027-05-31', [['packed', 'Sports Day\nEY-PYP6 / MYP'], null, null, null, null]],
    ['23', 'Jun', '2027-06-07', [null, null, ['packed', 'Gärdet/Spring Outing'], ['packed', 'Mentor Day'], ['end', 'Students end']]],
    ['24', 'Jun', '2027-06-14', [A(), A(), A(), A('ASC /Teachers last day/Staff party?'), A()]],
    ['25', 'Jun', '2027-06-21', [A(), A(), A(), A('ASC closes 15:00'), ['closed', 'Mid-Summer Eve']]],
    ['26', 'Jun/July', '2027-06-28', [A(), A(), A(), A(), A('ASC closes 15:00')]],
    ['27-30', 'July', '2027-07-05', [['closed', 'School Closed'], ['closed', 'School Closed'], ['closed', 'School Closed'], ['closed', 'School Closed'], ['closed', 'School Closed']], null, 4]
  ];

  var VASA_CALENDAR = { legend: LEGEND, weeks: WEEKS };
  if (typeof module !== 'undefined' && module.exports) module.exports = VASA_CALENDAR;
  else window.VASA_CALENDAR = VASA_CALENDAR;
})();
