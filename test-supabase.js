// Test script to verify Supabase connection and add test psychiatrist data
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cerkfpecmqkaumipgeyo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmtmcGVjbXFrYXVtaXBnZXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTg4MzYsImV4cCI6MjA3MjI5NDgzNn0.s0DfD3fSgnsbhm7DTKXHiCM0XWescQNJONE3HZXCK8o';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('\n🔍 Testing Supabase connection...\n');
  
  try {
    // Test 1: Check if we can query the providers table
    console.log('1. Checking providers table...');
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('*')
      .eq('provider_type', 'psychiatrist')
      .limit(5);
    
    if (providersError) {
      console.error('❌ Error querying providers:', providersError.message);
    } else {
      console.log(`✅ Found ${providers?.length || 0} psychiatrists in database`);
      if (providers && providers.length > 0) {
        console.log('Sample psychiatrist:', {
          id: providers[0].id,
          name: `${providers[0].first_name} ${providers[0].last_name}`,
          status: providers[0].status
        });
      }
    }
    
    // Test 2: Check slots table
    console.log('\n2. Checking slots table...');
    const { data: slots, error: slotsError } = await supabase
      .from('slots')
      .select('*')
      .limit(5);
    
    if (slotsError) {
      console.error('❌ Error querying slots:', slotsError.message);
    } else {
      console.log(`✅ Found ${slots?.length || 0} slots in database`);
    }
    
    // Test 3: Add sample psychiatrist if none exist
    if (!providers || providers.length === 0) {
      console.log('\n3. Adding sample psychiatrist data...');
      
      const samplePsychiatrists = [
        {
          email: 'dr.sharma@example.com',
          phone: '+91 9876543210',
          first_name: 'Dr. Rajesh',
          last_name: 'Sharma',
          provider_type: 'psychiatrist',
          status: 'verified',
          registration_number: 'MCI-123456',
          bio: 'Senior Psychiatrist with 15+ years of experience in treating anxiety, depression, and bipolar disorders.',
          experience_years: 15,
          specializations: ['Anxiety Disorders', 'Depression', 'Bipolar Disorder', 'PTSD'],
          languages: ['English', 'Hindi', 'Bengali'],
          practice_modes: ['video', 'audio', 'in_person'],
          default_fee: 1500,
          default_duration: 45,
          rating: 4.8,
          total_reviews: 127
        },
        {
          email: 'dr.patel@example.com',
          phone: '+91 9876543211',
          first_name: 'Dr. Priya',
          last_name: 'Patel',
          provider_type: 'psychiatrist',
          status: 'verified',
          registration_number: 'MCI-789012',
          bio: 'Child and Adolescent Psychiatrist specializing in ADHD, autism spectrum disorders, and behavioral issues.',
          experience_years: 12,
          specializations: ['Child Psychiatry', 'ADHD', 'Autism Spectrum', 'Behavioral Disorders'],
          languages: ['English', 'Gujarati', 'Hindi'],
          practice_modes: ['video', 'in_person'],
          default_fee: 2000,
          default_duration: 60,
          rating: 4.9,
          total_reviews: 89
        },
        {
          email: 'dr.menon@example.com',
          phone: '+91 9876543212',
          first_name: 'Dr. Arjun',
          last_name: 'Menon',
          provider_type: 'psychiatrist',
          status: 'verified',
          registration_number: 'MCI-345678',
          bio: 'Specializing in addiction psychiatry and substance abuse disorders with a holistic treatment approach.',
          experience_years: 10,
          specializations: ['Addiction Psychiatry', 'Substance Abuse', 'Dual Diagnosis', 'Rehabilitation'],
          languages: ['English', 'Malayalam', 'Tamil', 'Hindi'],
          practice_modes: ['video', 'audio'],
          default_fee: 1800,
          default_duration: 50,
          rating: 4.7,
          total_reviews: 65
        }
      ];
      
      const { data: newProviders, error: insertError } = await supabase
        .from('providers')
        .insert(samplePsychiatrists)
        .select();
      
      if (insertError) {
        console.error('❌ Error adding sample data:', insertError.message);
      } else {
        console.log(`✅ Added ${newProviders?.length || 0} sample psychiatrists`);
      }
    }
    
    console.log('\n✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();
