#!/usr/bin/env node

/**
 * Database Seed Script
 * Populates the database with initial sample data
 */

// Load environment variables from .env file
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

async function seedDatabase() {
  console.log('\n🌱 Seeding Database…\n');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    log.error('Missing Supabase credentials');
    log.info('Required environment variables:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY (required for seeding)');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Sample FAQ items
  log.info('Seeding FAQ items…');
  const faqItems = [
    {
      question: 'Who was Lou Gehrig?',
      answer: 'Henry Louis "Lou" Gehrig (1903-1941) was an American professional baseball first baseman who played 17 seasons for the New York Yankees. Known as "The Iron Horse," he set the record for most consecutive games played (2,130) that stood for 56 years.',
      category: 'About Lou',
      display_order: 1,
      is_published: true
    },
    {
      question: 'What is ALS?',
      answer: 'Amyotrophic Lateral Sclerosis (ALS), also known as Lou Gehrig\'s disease, is a progressive neurodegenerative disease that affects nerve cells in the brain and spinal cord. Lou Gehrig was diagnosed with ALS in 1939.',
      category: 'About Lou',
      display_order: 2,
      is_published: true
    },
    {
      question: 'What was Lou Gehrig\'s famous speech?',
      answer: 'On July 4, 1939, Lou Gehrig delivered his farewell speech at Yankee Stadium, declaring himself "the luckiest man on the face of the earth." Despite his terminal diagnosis, he expressed gratitude for his life and career.',
      category: 'Career',
      display_order: 3,
      is_published: true
    }
  ];

  try {
    const { error } = await supabase.from('faq_items').upsert(faqItems);
    if (error) throw error;
    log.success(`Seeded ${faqItems.length} FAQ items`);
  } catch (error) {
    log.error(`Failed to seed FAQ items: ${error.message}`);
  }

  // Sample timeline events
  log.info('Seeding timeline events…');
  const timelineEvents = [
    {
      date: '1903-06-19',
      title: 'Birth',
      description: 'Lou Gehrig born in New York City',
      category: 'Life',
    },
    {
      date: '1923-06-15',
      title: 'Yankees Debut',
      description: 'Made his debut with the New York Yankees',
      category: 'Career',
    },
    {
      date: '1927-01-01',
      title: 'Record Season',
      description: 'Part of the legendary 1927 Yankees "Murderers\' Row" team',
      category: 'Career',
    },
    {
      date: '1939-05-02',
      title: 'Consecutive Games Streak Ends',
      description: 'Ended his record streak of 2,130 consecutive games played',
      category: 'Career',
    },
    {
      date: '1939-07-04',
      title: 'Farewell Speech',
      description: 'Delivered his famous "Luckiest Man" speech at Yankee Stadium',
      category: 'Career',
    },
    {
      date: '1941-06-02',
      title: 'Passing',
      description: 'Lou Gehrig passed away at age 37',
      category: 'Life',
    }
  ];

  try {
    const { error } = await supabase.from('timeline_events').upsert(timelineEvents);
    if (error) throw error;
    log.success(`Seeded ${timelineEvents.length} timeline events`);
  } catch (error) {
    log.error(`Failed to seed timeline events: ${error.message}`);
  }

  // Sample friends of club
  log.info('Seeding friends of club…');
  const friendsOfClub = [
    {
      name: 'ALS Association',
      description: 'Leading organization fighting Lou Gehrig\'s disease',
      website_url: 'https://www.als.org',
      display_order: 1,
      is_active: true
    },
    {
      name: 'National Baseball Hall of Fame',
      description: 'Preserving baseball history and honoring legends like Lou Gehrig',
      website_url: 'https://baseballhall.org',
      display_order: 2,
      is_active: true
    }
  ];

  try {
    const { error } = await supabase.from('friends_of_club').upsert(friendsOfClub);
    if (error) throw error;
    log.success(`Seeded ${friendsOfClub.length} friends of club`);
  } catch (error) {
    log.error(`Failed to seed friends of club: ${error.message}`);
  }

  // Sample weekly vote (for the current week)
  log.info('Seeding sample weekly vote…');
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

  const weeklyVote = {
    week_id: `week-${startOfWeek.toISOString().split('T')[0]}`,
    image_a_url: '/placeholder-a.jpg',
    image_b_url: '/placeholder-b.jpg',
    votes_a: 0,
    votes_b: 0,
    start_date: startOfWeek.toISOString(),
    end_date: endOfWeek.toISOString()
  };

  try {
    const { error } = await supabase.from('weekly_votes').upsert([weeklyVote]);
    if (error) throw error;
    log.success('Seeded weekly vote');
  } catch (error) {
    log.error(`Failed to seed weekly vote: ${error.message}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  log.success('Database seeding completed!');
  console.log('='.repeat(50) + '\n');
  log.info('Next steps:');
  console.log('  1. View data in Supabase Dashboard');
  console.log('  2. Run: npm run test:db');
  console.log('  3. Start the development server: npm run dev');
  console.log('');
}

// Run seeding
seedDatabase().catch((error) => {
  log.error(`Seeding failed: ${error.message}`);
  process.exit(1);
});
