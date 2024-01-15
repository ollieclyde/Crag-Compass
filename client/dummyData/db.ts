const database: any = [{
  name: 'Henry Price',
  climbs: '16',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/henry_price-12106',
  rocktype: 'grit',
  altitude: '90m a.s.l',
  faces: 'E',
  googleURL: '/logbook/addclimb.php?climb=12106',
  osx: '-1.558',
  osy: '53.809',
  routes: []
}, {
  name: 'The Bear Pit',
  climbs: '3',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/the_bear_pit-27087',
  rocktype: 'UNKNOWN',
  altitude: '68m a.s.l',
  faces: 'SW',
  googleURL: '/logbook/addclimb.php?climb=27087',
  osx: '-1.57587',
  osy: '53.81521',
  routes: []
}, {
  name: 'Post Hill Quarry',
  climbs: '85',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/post_hill_quarry-18635',
  rocktype: 'Gritstone',
  altitude: '96m a.s.l',
  faces: 'W',
  googleURL: '/logbook/addclimb.php?climb=18635',
  osx: '-1.63884',
  osy: '53.79312',
  routes: []
}, {
  name: 'Outwood shed',
  climbs: '1',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/outwood_shed-29824',
  rocktype: 'Artificial',
  altitude: '92m a.s.l',
  faces: null,
  googleURL: '/logbook/addclimb.php?climb=29824',
  osx: '-1.62063',
  osy: '53.83407',
  routes: []
}, {
  name: 'Newlay Quarry',
  climbs: '13',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/newlay_quarry-15907',
  rocktype: 'grit',
  altitude: '64m a.s.l',
  faces: 'S',
  googleURL: '/logbook/addclimb.php?climb=15907',
  osx: '-1.6353',
  osy: '53.8252',
  routes: []
}, {
  name: 'Adel Crag',
  climbs: '18',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/adel_crag-2821',
  rocktype: 'Gritstone',
  altitude: null,
  faces: null,
  googleURL: '/logbook/addclimb.php?climb=2821',
  osx: '-1.57278',
  osy: '53.85722',
  routes: []
}, {
  name: 'Rein Road Quarry (Morley)',
  climbs: '1',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/rein_road_quarry_morley-10332',
  rocktype: 'Grit',
  altitude: '130m a.s.l',
  faces: 'N',
  googleURL: '/logbook/addclimb.php?climb=10332',
  osx: '-1.59361',
  osy: '53.73139',
  routes: []
}, {
  name: 'Calverley Woods',
  climbs: '24',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/calverley_woods-26274',
  rocktype: 'Grit',
  altitude: '125m a.s.l',
  faces: 'N',
  googleURL: '/logbook/addclimb.php?climb=26274',
  osx: '-1.6963',
  osy: '53.834',
  routes: []
}, {
  name: 'Hetchell',
  climbs: '88',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/hetchell-1873',
  rocktype: 'Gritstone',
  altitude: '100m a.s.l',
  faces: 'W',
  googleURL: '/logbook/addclimb.php?climb=1873',
  osx: '-1.4294',
  osy: '53.8772',
  routes: []
}, {
  name: 'Pool Bank',
  climbs: '?',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/pool_bank-15906',
  rocktype: 'Grit',
  altitude: '160m a.s.l',
  faces: 'NW',
  googleURL: '/logbook/addclimb.php?climb=15906',
  osx: '-1.63438',
  osy: '53.89459',
  routes: []
}, {
  name: 'Esholt Crag',
  climbs: '?',
  location: 'West Yorkshire',
  country: 'England',
  href: '/logbook/crags/esholt_crag-15910',
  rocktype: 'Grit',
  altitude: '90m a.s.l',
  faces: 'W',
  googleURL: '/logbook/addclimb.php?climb=15910',
  osx: '-1.7091',
  osy: '53.8582',
  routes: []
}
]


// function cragExistsInDB(user) {
//   // Check if the user with the same LinkedIn URL already exists in the database
//   return database.some((existingUser) => existingUser[0] === user[0]);
// }

// function addToDatabase(user) {
//   if (!cragExistsInDB(user)) {
//     // Only add the user to the database if they don't already exist
//     database.push(user);
//   }
// }

export default database


