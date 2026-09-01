/**
 * Every word of standing site copy lives here, so the pages stay layout and the
 * text stays editable by someone who does not write React.
 *
 * ─── BEFORE LAUNCH ────────────────────────────────────────────────────────────
 * The writing is real and usable, but the following are placeholders the resort
 * needs to confirm or replace:
 *   • telephone numbers, email addresses and the WhatsApp line
 *   • opening year, awards, and the founder's name in `story`
 *   • driving times and distances (approximate — check against a real route)
 *   • every testimonial (written as examples, not real guests)
 *   • the map embed coordinates
 *   • all photography (see ResortImage — missing files fall back to a panel)
 * ──────────────────────────────────────────────────────────────────────────────
 */

export const resort = {
  name: 'Grace Arena Resorts',
  shortName: 'Grace Arena',
  tagline: 'A Yoruba country estate, kept for people who notice the details',
  village: 'Onimangoro',
  town: 'Igbo-Ora',
  lga: 'Ibarapa Central',
  state: 'Oyo State',
  country: 'Nigeria',
  addressLines: ['Onimangoro', 'Igbo-Ora, Ibarapa Central', 'Oyo State, Nigeria'],
  phone: '+234 800 000 0000',
  whatsapp: '+234 800 000 0000',
  email: 'reservations@gracearenaresort.com',
  eventsEmail: 'events@gracearenaresort.com',
  /** Approximate — Igbo-Ora town centre. Replace with the resort's own pin. */
  mapQuery: 'Igbo-Ora, Oyo State, Nigeria',
  checkInTime: '3:00 pm',
  checkOutTime: '12:00 noon',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'X', href: 'https://x.com' },
  ],
} as const

export const navLinks = [
  { to: '/accommodation', label: 'Stay' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
]

export const heroSlides = [
  {
    image: '/images/resort/exterior-evening.jpg',
    eyebrow: 'Onimangoro · Igbo-Ora · Oyo State',
    heading: 'Where the Ibarapa evening comes in gold',
    body: 'Twenty-eight suites and villas on a walled estate an hour and a half from Ibadan — built for slow mornings, long dinners, and the kind of celebration people talk about for years.',
  },
  {
    image: '/images/resort/pool-dusk.jpg',
    eyebrow: 'The Water Garden',
    heading: 'A pool the length of the lawn',
    body: 'Shaded cabanas, a swim-up bar stocked with palm wine and small chops, and nobody at all in a hurry.',
  },
  {
    image: '/images/resort/arena-wedding.jpg',
    eyebrow: 'The Arena',
    heading: 'Six hundred guests, one unbroken roofline',
    body: 'Our event hall was the reason the resort was built. It still sets the standard for everything around it.',
  },
]

/** The four things a first-time visitor most wants to know. */
export const highlights = [
  {
    figure: '28',
    label: 'Suites & villas',
    body: 'From garden rooms opening onto the lawn to a three-bedroom presidential villa behind its own gate.',
  },
  {
    figure: '600',
    label: 'Seats in the Arena',
    body: 'A column-free hall with its own kitchen, generator ring and bridal wing.',
  },
  {
    figure: '14',
    label: 'Acres of grounds',
    body: 'Lawns, a mango orchard, a kitchen garden that supplies the restaurant, and room to breathe.',
  },
  {
    figure: '1.5 hrs',
    label: 'From Ibadan',
    body: 'Far enough to feel like somewhere else. Close enough to leave after breakfast and be there for lunch.',
  },
]

export const facilities = [
  {
    slug: 'the-water-garden',
    name: 'The Water Garden',
    kicker: 'Pool & cabanas',
    body: 'A 25-metre pool set into the lawn, with shaded cabanas, a children\'s shallow, and a bar that runs from eleven until the last person leaves.',
    image: '/images/resort/pool-dusk.jpg',
  },
  {
    slug: 'iyan-restaurant',
    name: 'Ìyán',
    kicker: 'Restaurant',
    body: 'Yoruba cooking taken seriously: pounded yam with egúsí, ofada rice and ayamase, grilled river fish, and a Sunday table that goes on all afternoon.',
    image: '/images/resort/restaurant.jpg',
  },
  {
    slug: 'the-gold-bar',
    name: 'The Gold Bar',
    kicker: 'Bar & lounge',
    body: 'Palm wine served properly cold, a short and serious list of Nigerian craft spirits, and live highlife on Friday and Saturday.',
    image: '/images/resort/bar.jpg',
  },
  {
    slug: 'ile-ifara-spa',
    name: 'Ilé Ìfara',
    kicker: 'Spa & wellness',
    body: 'Four treatment rooms working with shea, black soap and local botanicals, plus a steam room and an open-air massage pavilion.',
    image: '/images/resort/spa.jpg',
  },
  {
    slug: 'the-arena',
    name: 'The Arena',
    kicker: 'Events',
    body: 'Six hundred seated under one roof, a 400-square-metre garden lawn beside it, and a bridal suite that does not feel like an afterthought.',
    image: '/images/resort/arena-wedding.jpg',
  },
  {
    slug: 'the-orchard',
    name: 'The Orchard',
    kicker: 'Grounds',
    body: 'Mango, cashew and citrus, a kitchen garden the chefs pick from each morning, and a bonfire clearing at the far end.',
    image: '/images/resort/orchard.jpg',
  },
]

export const experiences = [
  {
    name: 'The twin capital of the world',
    duration: 'Half day',
    body: 'Igbo-Ora records more twin births than anywhere else on earth, and the town wears it openly. Our guide walks you through the compounds, the ìbejì carving tradition, and — if your dates land right — the World Twins Festival itself.',
    image: '/images/experiences/twins.jpg',
  },
  {
    name: 'Market morning in Igbo-Ora',
    duration: '3 hours',
    body: 'Leave at seven with one of our chefs, buy what looks good, come back and cook it. You eat what you chose for lunch.',
    image: '/images/experiences/market.jpg',
  },
  {
    name: 'Àdìrè at the dye pits',
    duration: '4 hours',
    body: 'A working session with an indigo dyer — tie, stitch, wax and dip. The cloth you make is yours, dried and folded by the time you leave.',
    image: '/images/experiences/adire.jpg',
  },
  {
    name: 'Bàtá drums after dark',
    duration: 'Evenings, Fri & Sat',
    body: 'A drum circle in the orchard clearing with a bonfire, suya off the grill, and players who have been at it since they were nine.',
    image: '/images/experiences/drums.jpg',
  },
  {
    name: 'Sunrise over the Ibarapa hills',
    duration: '2 hours',
    body: 'A guided walk out through the farms while it is still cool, with flasks of coffee and a stop at the ridge for the light coming up.',
    image: '/images/experiences/sunrise.jpg',
  },
  {
    name: 'Ibadan, and back by dinner',
    duration: 'Full day',
    body: 'A driver, a guide, and a day in the old city — Mapo Hall, Bower\'s Tower, the university, and lunch somewhere we like.',
    image: '/images/experiences/ibadan.jpg',
  },
]

export const eventSpaces = [
  {
    name: 'The Arena',
    seated: 600,
    standing: 900,
    body: 'Column-free, air-conditioned, with its own service kitchen, dedicated generator ring, and a bridal wing with two dressing rooms.',
    features: ['Column-free floor', 'Service kitchen', 'Dedicated generators', 'Bridal wing', 'Stage and rigging points'],
    image: '/images/resort/arena-wedding.jpg',
  },
  {
    name: 'The Garden Lawn',
    seated: 300,
    standing: 450,
    body: 'Four hundred square metres of level lawn beside the Arena, for outdoor ceremonies, cocktail hours, and receptions that want the sky.',
    features: ['Level lawn', 'Marquee points', 'Evening lighting', 'Adjacent to the Arena'],
    image: '/images/resort/garden-lawn.jpg',
  },
  {
    name: 'The Ìbàrapa Boardroom',
    seated: 24,
    standing: 40,
    body: 'A proper meeting room: one long table, good chairs, blackout blinds, a 98-inch screen and video conferencing that has been tested.',
    features: ['Seats 24', '98-inch screen', 'Video conferencing', 'Blackout blinds', 'Private break-out terrace'],
    image: '/images/resort/boardroom.jpg',
  },
  {
    name: 'The Orchard Clearing',
    seated: 120,
    standing: 200,
    body: 'A clearing among the mango trees with a fire pit at the centre — for rehearsal dinners, engagement parties, and the night before the big day.',
    features: ['Fire pit', 'String lighting', 'Grill station', 'Under the mango trees'],
    image: '/images/resort/orchard.jpg',
  },
]

export const eventTypes = [
  {
    value: 'WEDDING' as const,
    label: 'Wedding',
    body: 'Traditional, white, or both across a weekend — with the whole estate to yourselves if you want it.',
  },
  {
    value: 'CONFERENCE' as const,
    label: 'Conference',
    body: 'Plenary in the Arena, break-outs in the boardroom, and everybody sleeping on site.',
  },
  {
    value: 'CORPORATE_RETREAT' as const,
    label: 'Corporate retreat',
    body: 'Two or three days of sessions, meals and the kind of conversation that only happens away from the office.',
  },
  {
    value: 'CELEBRATION' as const,
    label: 'Celebration',
    body: 'Birthdays, anniversaries, naming ceremonies, thanksgivings — the milestones that deserve the room.',
  },
  {
    value: 'GROUP_STAY' as const,
    label: 'Group stay',
    body: 'Family reunions and friend groups taking a block of rooms, or the whole of one wing.',
  },
  {
    value: 'GENERAL' as const,
    label: 'Something else',
    body: 'Tell us what you have in mind and we will tell you honestly whether we are the right place for it.',
  },
]

export const story = {
  lead: 'Grace Arena began with a hall, and a family who thought Igbo-Ora deserved a better one.',
  paragraphs: [
    'For years, every wedding in Ibarapa meant a marquee, a generator, and a plan for what to do if it rained. Families hired canopies from three towns over. Caterers cooked in the open. The bride dressed in somebody\'s spare room. It worked, because people made it work — but nobody would have called it easy.',
    'The Arena was built to end that. Six hundred seats, a roof that holds, power that does not go, a kitchen designed by someone who had actually cooked for six hundred, and a bridal wing with a door that locks. It filled its first season before it was finished.',
    'Guests started asking where they could sleep. So the estate grew outward from the hall — first the garden rooms, then the suites, then the villas at the north end — and with them a restaurant that buys from the Igbo-Ora market, a pool set into the lawn, and fourteen acres of grounds that took four years to come good.',
    'What we have not done is import a resort from somewhere else and set it down here. The cloth is àdìrè from a workshop two towns over. The headboards were carved in Ibadan. The pounded yam is pounded. Igbo-Ora is known the world over as the home of twins, and we would rather you left knowing that than knowing our thread count.',
  ],
  values: [
    {
      name: 'Of this place',
      body: 'Yoruba craft, Yoruba cooking, Yoruba hospitality — not as decoration, but as the actual substance of the thing.',
    },
    {
      name: 'Quietly exacting',
      body: 'The generators are tested weekly. The water is filtered on site. You are not supposed to notice any of it.',
    },
    {
      name: 'Room to breathe',
      body: 'Fourteen acres for twenty-eight rooms. We would rather have fewer guests and more space between them.',
    },
    {
      name: 'A working neighbour',
      body: 'We hire, buy and build in Ibarapa. The estate should be worth something to Igbo-Ora, not just to its guests.',
    },
  ],
}

export const testimonials = [
  {
    quote:
      'We had four hundred guests and it did not rain inside once — which, if you have planned a wedding in Oyo in June, you will understand is the highest praise I have.',
    name: 'Tolu & Ifeanyi',
    context: 'Wedding, the Arena',
  },
  {
    quote:
      'I came for two nights to finish a proposal and stayed five. The study in the Ọlá suite is the best room I have ever worked in, and I have worked in a lot of hotel rooms.',
    name: 'Dr. A. Ogunleye',
    context: 'Ọlá Executive Suite',
  },
  {
    quote:
      'The market morning was the thing my children still talk about. They chose the fish. They watched it cooked. They ate all of it.',
    name: 'The Adekunle family',
    context: 'Twin City Pool Villa',
  },
]

export const faqs = [
  {
    question: 'How do I get there from Lagos or Ibadan?',
    answer:
      'From Ibadan it is roughly an hour and a half by road through Eruwa. From Lagos, allow three to four hours depending on the Ìbàdàn expressway. We can arrange a car and driver from either city, or from Ibadan airport — tell us your flight and we will be waiting.',
  },
  {
    question: 'Is there power and water around the clock?',
    answer:
      'Yes. The estate runs on a dedicated generator ring with automatic changeover, backed by solar, and water is drawn and filtered on site. The Arena has its own independent supply so an event is never at the mercy of the grid.',
  },
  {
    question: 'What are check-in and check-out times?',
    answer:
      'Check-in is from 3:00 pm and check-out is 12:00 noon. Early arrival and late departure are usually possible outside the wedding season — ask when you book and we will hold it if we can.',
  },
  {
    question: 'Can I hold a date before I have confirmed everything?',
    answer:
      'For events, yes — we will hold a date provisionally for fourteen days at no cost while you settle the rest. For rooms, a booking is confirmed by our reservations desk usually within a few hours of your request.',
  },
  {
    question: 'Do you cater for children?',
    answer:
      'Very much so. There is a shallow end with a lifeguard on duty at weekends, a children\'s menu that is not an afterthought, cots and extra beds on request, and the orchard, which does most of the work by itself.',
  },
  {
    question: 'Can we bring our own caterer or planner?',
    answer:
      'For events in the Arena, yes, subject to our kitchen and safety requirements. Most couples use ours because it is simpler, but we will not make it difficult if you have someone you trust.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Room bookings can be cancelled from your account at any time before the arrival date at no charge. Event deposits are governed by the contract you sign with our events team.',
  },
]

export const gallery = [
  { image: '/images/resort/exterior-evening.jpg', caption: 'The main house at dusk' },
  { image: '/images/resort/pool-dusk.jpg', caption: 'The Water Garden' },
  { image: '/images/resort/arena-wedding.jpg', caption: 'The Arena, set for a wedding' },
  { image: '/images/rooms/twin-city-pool-villa-pool.jpg', caption: 'Twin City Pool Villa' },
  { image: '/images/resort/restaurant.jpg', caption: 'Ìyán at breakfast' },
  { image: '/images/experiences/adire.jpg', caption: 'Àdìrè at the dye pits' },
  { image: '/images/resort/orchard.jpg', caption: 'The mango orchard' },
  { image: '/images/rooms/arena-terrace-suite-terrace.jpg', caption: 'Arena Terrace Suite' },
  { image: '/images/resort/spa.jpg', caption: 'Ilé Ìfara' },
  { image: '/images/experiences/drums.jpg', caption: 'Bàtá drums in the clearing' },
  { image: '/images/resort/garden-lawn.jpg', caption: 'The Garden Lawn' },
  { image: '/images/resort/bar.jpg', caption: 'The Gold Bar' },
]

export const gettingHere = [
  { from: 'Ibadan', detail: 'About 1 hr 30 min by road via Eruwa' },
  { from: 'Abeokuta', detail: 'About 1 hr 30 min via Ayetoro' },
  { from: 'Lagos', detail: '3 to 4 hrs, depending on the expressway' },
  { from: 'Ibadan Airport', detail: 'About 1 hr 45 min — transfers arranged on request' },
  { from: 'Lagos (MMIA)', detail: 'Transfers arranged on request, from 4 hrs' },
]
